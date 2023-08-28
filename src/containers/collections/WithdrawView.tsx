import React from 'react';
import { Collection } from '@yolominds/metadata-service-api';
import { ExportOutlined } from '@ant-design/icons';
import { usePairReserves, useAMMPositionDetails, useCollectionTokens } from 'src/hooks';
import { Typography, Space, Image, Skeleton } from 'antd';
import { shallow } from 'zustand/shallow';
import { NFTCardBox } from 'src/components/common/NFT/NFTCardBox';
import { formatEther } from 'ethers/lib/utils';
import { getEllipsisTxt } from 'src/utils/format';
import { getEtherscanLink } from 'src/utils/address';
import { TokenIcon } from 'src/components/common/Token/TokenIcon';
import { AmmPosition } from 'src/types';
import { formatNumber } from 'src/utils/number';
import { Box, PositionBox } from './shared';
import { placeholderNFTs, placeholderStyle, makeNFTData } from './const';
import { ListBox } from './CollectionBuyView.styled';
import { useCartStore } from '../cart/store';
import { PoolToolbar } from './PoolToolbar';

interface Props {
  collection: Collection;
}

type PositionDetail = AmmPosition & {
  collectionBalance: number;
  tokenBalance: number;
};

// TODO: Filter by attributes
function filterData<T>(data: T[], id?: string): T[] {
  if (!id) return data;
  return data.filter((d) => (d as any).poolDetails?.id === id);
}

const { Text } = Typography;
export function WithdrawView({ collection }: Props) {
  const [selected, setSelected] = useCartStore((state) => [state.selections[state.type], state.setSelection]);
  const [activePositionId, setActivePositionId] = React.useState<string>();
  const [tokens] = React.useState(makeNFTData(true, 20));

  const { positions, isLoading } = useAMMPositionDetails(collection.address, collection.networkId, true);
  const { data } = usePairReserves(positions.map((pos) => pos.pool.id));

  const [fillItemsToCart, addItemToCart, removeItemFromCart, setCartOpen, setPairInfo, withdrawOptions] = useCartStore(
    (state) => [
      state.fillItemsToCart,
      state.addItemToCart,
      state.removeItemFromCart,
      state.setCartOpen,
      state.setPairInfo,
      state.withdraw,
    ],
    shallow,
  );

  const processedTokens = React.useMemo(() => {
    const position = positions.find((pos) => pos.id === activePositionId);
    return filterData(position?.pool.nfts || []);
  }, [activePositionId, positions]);

  const { tokenMap, isLoading: tokenLoading } = useCollectionTokens(
    collection.address,
    collection.networkId,
    processedTokens.map((t) => t.tokenId),
  );

  const getCurrentPoolPrice = (positionId?: string) => {
    const position = positions.find((pos) => pos.id === positionId);
    if (!position) {
      return 0;
    }

    const rate = data[position.pool.id]?.rate;

    if (rate) return Number(formatEther(rate));
    return 0;
  };

  const addToCart = (nft: typeof processedTokens[number], checked: boolean) => {
    if (!activePositionId) {
      alert('Select position first');
      return;
    }

    setSelected((cs) => ({ ...cs, [nft.tokenId]: checked }));

    if (checked) {
      addItemToCart('withdraw', {
        collection: collection.address,
        image: tokenMap[nft.tokenId]?.image ?? tokens[0].image,
        tokenId: nft.tokenId,
      });
    } else {
      removeItemFromCart('withdraw', nft.tokenId);
    }
  };

  const handlePositionSelect = (pos: PositionDetail) => {
    const price = getCurrentPoolPrice(pos.id);

    setActivePositionId(pos.id);
    setPairInfo({
      address: pos.pool.id,
      collection: collection.address,
      fee: pos.pool.fee,
      tokenId: pos.id,
      liquidity: pos.liquidity,
      price,
    });
  };

  React.useEffect(() => {
    setCartOpen(true);
  }, [setCartOpen]);

  const allowSelect = withdrawOptions.step === 2;

  return (
    <>
      <Text>{!isLoading ? (positions.length > 0 ? 'Your positions' : "You don't have any positions") : null}</Text>
      <Space direction="horizontal" size={32}>
        {isLoading
          ? [1, 2, 3].map((i) => <Skeleton.Node active key={i} />)
          : positions.map((pos) => (
              <PositionBox
                role="button"
                tabIndex={0}
                key={pos.id}
                active={activePositionId === pos.id}
                onClick={() => handlePositionSelect(pos)}
              >
                <div>
                  <TokenIcon token="ETH" /> {formatNumber(pos.tokenBalance)} {pos.pool.token.symbol}{' '}
                  <Image
                    src={collection.logo || `https://via.placeholder.com/24?text=${collection.name.slice(0, 1)}`}
                    alt={collection.name}
                    width={24}
                    height={24}
                    preview={false}
                  />{' '}
                  {pos.collectionBalance} {pos.pool.collection.symbol}
                </div>
                <div>Swap Fee: {pos.pool.fee / 100}%</div>
                <a
                  href={getEtherscanLink(collection.networkId, `address/${pos.pool.id}`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  {getEllipsisTxt(pos.pool.id)} <ExportOutlined />
                </a>
              </PositionBox>
            ))}
      </Space>

      <Box>
        <PoolToolbar
          amount={0}
          onAmountChange={() => {}}
          maxAmount={processedTokens.length}
          showSweep={false}
          currentPrice={getCurrentPoolPrice(activePositionId)}
        />

        <ListBox>
          {isLoading || tokenLoading
            ? placeholderNFTs.map((_, index) => <Skeleton.Image key={index} active style={placeholderStyle} />)
            : processedTokens.map((nft, index) => (
                <NFTCardBox
                  key={index}
                  // @ts-ignore
                  data={{
                    ...nft,
                    image: tokenMap[nft.tokenId]?.image,
                  }}
                  checked={allowSelect ? selected[nft.tokenId] : null}
                  onChecked={(checked) => {
                    if (allowSelect) {
                      addToCart(nft, checked);
                    }
                  }}
                  style={{ width: 240, opacity: allowSelect ? 1 : 0.5 }}
                />
              ))}
        </ListBox>
      </Box>
    </>
  );
}
