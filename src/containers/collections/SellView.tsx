import React from 'react';
import { Collection } from '@yolominds/metadata-service-api';
import { useCollectionAMMPools, useConnectedNetwork, useUserTokens } from 'src/hooks';
import { Skeleton } from 'antd';
import { shallow } from 'zustand/shallow';
import { NFTCardBox } from 'src/components/common/NFT/NFTCardBox';
import { formatEther } from 'ethers/lib/utils';
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

export function SellView({ collection }: Props) {
  const [selected, setSelected] = useCartStore((state) => [state.selections[state.type], state.setSelection], shallow);
  const [bestRate] = useCartStore((state) => [state.sell.bestRate], shallow);
  const [amount, setAmount] = React.useState(0);
  const { chainId = 5 } = useConnectedNetwork();
  const { pools, isLoading: poolsLoading } = useCollectionAMMPools(collection.address, chainId, false);

  const { tokens, isLoading } = useUserTokens(collection.address);

  const [fillItemsToCart, addItemToCart, removeItemFromCart, setPairInfo, setCartOpen] = useCartStore(
    (state) => [
      state.fillItemsToCart,
      state.addItemToCart,
      state.removeItemFromCart,
      state.setPairInfo,
      state.setCartOpen,
    ],
    shallow,
  );

  const processedTokens = React.useMemo(() => filterData(tokens), [tokens]);

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
      addItemToCart('sell', {
        collection: collection.address,
        image: nft.image,
        tokenId: nft.tokenId,
      });
    } else {
      removeItemFromCart('sell', nft.tokenId);
    }
  };

  React.useEffect(() => {
    setCartOpen(true);
  }, [setCartOpen]);

  if (!poolsLoading && !pools.length) {
    return (
      <Box>
        <EmptyPoolShow />
      </Box>
    );
  }

  return (
    <Box>
      <PoolToolbar
        amount={amount}
        cta={`Your Wallet's NFTs`}
        onAmountChange={handleAmountChange}
        maxAmount={processedTokens.length}
        currentPrice={bestRate ? Number(formatEther(bestRate)) : 0}
        title="Highest Price"
      />

      <ListBox>
        {isLoading
          ? placeholderNFTs.map((_, index) => <Skeleton.Image key={index} active style={placeholderStyle} />)
          : processedTokens.map((nft, index) => (
              <NFTCardBox
                key={index}
                // @ts-ignore
                data={nft}
                checked={selected[nft.tokenId]}
                style={{ width: 240 }}
                onChecked={(checked) => {
                  setSelected((cs) => ({ ...cs, [nft.tokenId]: checked }));
                  addToCart(nft, checked);
                }}
                attributes={[]}
                // poolType={nft.poolType}
              />
            ))}
      </ListBox>
    </Box>
  );
}
