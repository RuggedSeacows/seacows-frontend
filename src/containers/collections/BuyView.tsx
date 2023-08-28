import React from 'react';
import { Collection } from '@yolominds/metadata-service-api';
import { useCollectionAMMPoolTokens } from 'src/hooks';
import { Skeleton } from 'antd';
import { shallow } from 'zustand/shallow';
import { NFTCardBox } from 'src/components/common/NFT/NFTCardBox';
import { formatEther } from 'ethers/lib/utils';
import { BigNumber } from 'ethers';
import { Box, EmptyPoolShow } from './shared';
import { PoolToolbar } from './PoolToolbar';
import { placeholderNFTs, placeholderStyle } from './const';
import { ListBox } from './CollectionBuyView.styled';
import { useCartStore } from '../cart/store';

interface Props {
  collection: Collection;
}

// TODO: Filter by attributes
function filterData<T>(data: T, _attributes = []): T {
  return data;
}

export function BuyView({ collection }: Props) {
  const [selected, setSelected] = useCartStore((state) => [state.selections[state.type], state.setSelection]);
  const [amount, setAmount] = React.useState(0);

  const { pooledTokens, isLoading } = useCollectionAMMPoolTokens(collection.address, collection.networkId);

  const [fillItemsToCart, addItemToCart, removeItemFromCart, setCartOpen] = useCartStore(
    (state) => [state.fillItemsToCart, state.addItemToCart, state.removeItemFromCart, state.setCartOpen],
    shallow,
  );

  const processedTokens = React.useMemo(() => filterData(pooledTokens), [pooledTokens]);

  const handleAmountChange = (newValue: number | null) => {
    setAmount(newValue || 0);
    const newSelected: Record<string, boolean> = {};
    for (let i = 0; i < (newValue || 0); i += 1) {
      newSelected[processedTokens[i].key] = true;
    }
    setSelected(newSelected);
  };

  const addToCart = (nft: typeof processedTokens[number], add: boolean) => {
    if (add) {
      addItemToCart('buy', {
        collection: collection.address,
        image: nft.image,
        tokenId: nft.tokenId,
        pool: nft.poolDetails,

        // @ts-ignore
        price: nft.price,
      });
    } else {
      removeItemFromCart('buy', nft.tokenId);
    }
  };

  React.useEffect(() => {
    setCartOpen(true);
  }, [setCartOpen]);

  if (!isLoading && processedTokens.length === 0) {
    return (
      <Box>
        <EmptyPoolShow />
      </Box>
    );
  }

  const selectedCount = Object.keys(selected).filter((id) => selected[id]).length;

  const getBuyPrice = (
    poolDetails: {
      reserves: [BigNumber, BigNumber];
      fee: number;
      complementPrecision: BigNumber;
      protocolFeePercent: number;
      rate?: BigNumber | undefined;
      sellRate?: BigNumber | undefined;
      buyRate?: BigNumber | undefined;
      id: string;
    },
    buyOrder: number,
  ) => {
    const { reserves, fee, complementPrecision, protocolFeePercent, buyRate } = poolDetails;
    let tokenReserve = reserves[0];
    let nftReserve = reserves[1];

    if (buyOrder === 0) {
      if (buyRate) {
        return Number(formatEther(buyRate));
      }
      return undefined;
    }

    let price = BigNumber.from(0);
    for (let i = 0; i < buyOrder + 1; i += 1) {
      price = tokenReserve
        .mul(100_00 + protocolFeePercent * 100 + fee)
        .div(nftReserve.sub(complementPrecision))
        .mul(complementPrecision)
        .div(100_00);
      tokenReserve = tokenReserve.add(price);
      nftReserve = nftReserve.sub(complementPrecision);
    }

    return Number(formatEther(price));
  };

  const countSelectedItems = (index: number) => {
    let count = 0;
    for (let i = 0; i < index; i += 1) {
      if (i >= processedTokens.length) break;

      if (selected[processedTokens[i].tokenId]) {
        count += 1;
      }
    }

    return count;
  };

  return (
    <Box>
      <PoolToolbar
        amount={amount}
        onAmountChange={handleAmountChange}
        maxAmount={processedTokens.length}
        // currentPrice={rate ? Number(formatEther(rate)) : 0}
      />

      <ListBox>
        {isLoading
          ? placeholderNFTs.map((_, index) => <Skeleton.Image key={index} active style={placeholderStyle} />)
          : processedTokens.map((nft, index) => (
              <NFTCardBox
                key={index}
                data={{
                  ...nft,
                  price: {
                    ...nft.price,
                    value: getBuyPrice(
                      nft.poolDetails,
                      selected[nft.tokenId] ? countSelectedItems(index) : selectedCount,
                    ),
                  },
                }}
                checked={selected[nft.tokenId]}
                style={{ width: 240 }}
                onChecked={(checked) => {
                  setSelected((cs) => ({ ...cs, [nft.tokenId]: checked }));
                  addToCart(nft, checked);
                }}
                attributes={[]}
              />
            ))}
      </ListBox>
    </Box>
  );
}
