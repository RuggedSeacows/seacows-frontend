import React from 'react';
import { Collection } from '@yolominds/metadata-service-api';
import { ExportOutlined } from '@ant-design/icons';
import { useUserTokens, usePairReserves, useAMMPositionDetails, useCollectionAMMPools } from 'src/hooks';
import { Typography, Space, Image, Skeleton } from 'antd';
import { shallow } from 'zustand/shallow';
import { NFTCardBox } from 'src/components/common/NFT/NFTCardBox';
import { formatEther } from 'ethers/lib/utils';
import { getEllipsisTxt } from 'src/utils/format';
import { getEtherscanLink } from 'src/utils/address';
import { TokenIcon } from 'src/components/common/Token/TokenIcon';
import { AmmPool, AmmPosition } from 'src/types';
import { formatNumber } from 'src/utils/number';
import { BigNumber } from 'ethers';
import { Box, EmptyPoolShow, PositionBox } from './shared';
import { PoolToolbar } from './PoolToolbar';
import { placeholderNFTs, placeholderStyle } from './const';
import { ListBox } from './CollectionBuyView.styled';
import { useCartStore } from '../cart/store';

interface Props {
  collection: Collection;
}

type PositionDetail = AmmPosition & {
  collectionBalance: number;
  tokenBalance: number;
};

// TODO: Filter by attributes
function filterData<T>(data: T, _attributes = []): T {
  return data;
}

const { Text } = Typography;
export function DepositView({ collection }: Props) {
  const [pairInfo, selected, setSelected] = useCartStore((state) => [
    state.pair,
    state.selections[state.type],
    state.setSelection,
  ]);
  const [amount, setAmount] = React.useState(0);
  const [activePositionId, setActivePositionId] = React.useState<string>();
  const [activePoolId, setActivePoolId] = React.useState<string>();

  const { tokens, isLoading } = useUserTokens(collection.address);
  const { positions, isLoading: positionLoading } = useAMMPositionDetails(
    collection.address,
    collection.networkId,
    true,
  );
  const { pools, isLoading: poolLoading } = useCollectionAMMPools(collection.address, collection.networkId, false);
  const { data } = usePairReserves(positions.map((pos) => pos.pool.id));

  const [fillItemsToCart, addItemToCart, removeItemFromCart, setCartOpen, setPairInfo] = useCartStore(
    (state) => [
      state.fillItemsToCart,
      state.addItemToCart,
      state.removeItemFromCart,
      state.setCartOpen,
      state.setPairInfo,
    ],
    shallow,
  );

  const processedTokens = React.useMemo(() => filterData(tokens), [tokens]);

  const getCurrentPoolPrice = (positionId?: string) => {
    const position = positions.find((pos) => pos.id === positionId);
    if (!position) {
      return 0;
    }

    const rate = data[position.pool.id]?.rate;

    if (rate) return Number(formatEther(rate));
    return 0;
  };

  const handleAmountChange = (newValue: number | null) => {
    const value = newValue || 0;
    if (!activePositionId && !activePoolId) {
      const message = !activePositionId
        ? 'Select a pool that you want to create your position to'
        : 'Select a positition that you want to deposit into';
      alert(message);
      return;
    }

    setAmount(value);
    const newSelected: Record<string, boolean> = {};
    for (let i = 0; i < value; i += 1) {
      newSelected[processedTokens[i].key] = true;
    }
    setSelected(newSelected);

    fillItemsToCart(
      'deposit',
      processedTokens.slice(0, value).map((t) => ({
        collection: collection.address,
        image: t.image,
        tokenId: t.tokenId,
      })),
    );
  };

  const addToCart = (nft: typeof processedTokens[number], checked: boolean) => {
    if (!activePositionId && !activePoolId) {
      const message = !activePositionId
        ? 'Select a pool that you want to create your position to'
        : 'Select a positition that you want to deposit into';
      alert(message);
      return;
    }

    setSelected((cs) => ({ ...cs, [nft.tokenId]: checked }));

    if (checked) {
      addItemToCart('deposit', {
        collection: collection.address,
        image: nft.image,
        tokenId: nft.tokenId,
      });
    } else {
      removeItemFromCart('deposit', nft.tokenId);
    }
  };

  const handlePositionSelect = (pos: PositionDetail) => {
    setActivePositionId(pos.id);
    setPairInfo({
      address: pos.pool.id,
      collection: collection.address,
      fee: pos.pool.fee,
      tokenId: pos.id,
      liquidity: pos.liquidity,
      price: getCurrentPoolPrice(pos.id),
    });
    setSelected({});
    fillItemsToCart('deposit', []);
  };

  const handlePoolSelect = (pool: AmmPool | AmmPool<true>) => {
    setActivePoolId(pool.id);
    setPairInfo({
      address: pool.id,
      collection: collection.address,
      fee: pool.fee,
      tokenId: null,
      liquidity: pool.liquidity,
      price: Number(formatEther(data[pool.id]?.rate || BigNumber.from(0))),
    });
    setSelected({});
    fillItemsToCart('deposit', []);
  };

  React.useEffect(() => {
    setCartOpen(true);
  }, [setCartOpen]);

  const hasPositions = !positionLoading && positions?.length > 0;
  const hasPools = !poolLoading && pools?.length > 0;

  return (
    <>
      {hasPools ? <Text>Available Pools</Text> : null}
      <Space direction="horizontal" size={32}>
        {positionLoading || poolLoading
          ? [1, 2, 3].map((i) => <Skeleton.Node active key={i} />)
          : hasPositions
          ? positions.map((pos) => (
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
            ))
          : hasPools
          ? pools.map((pool) => (
              <PositionBox
                role="button"
                tabIndex={0}
                key={pool.id}
                active={activePoolId === pool.id}
                onClick={() => handlePoolSelect(pool)}
              >
                <div>
                  Liquidity:
                  <TokenIcon token="ETH" /> {formatNumber(formatEther(pool.liquidity))}
                </div>
                <div>Swap Fee: {pool.fee / 100}%</div>
                <a
                  href={getEtherscanLink(collection.networkId, `address/${pool.id}`)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#fff', textDecoration: 'underline' }}
                >
                  {getEllipsisTxt(pool.id)} <ExportOutlined />
                </a>
              </PositionBox>
            ))
          : null}
      </Space>

      <Box>
        {hasPools ? (
          <>
            <PoolToolbar
              amount={amount}
              cta={`Your Wallet's NFTs`}
              onAmountChange={handleAmountChange}
              maxAmount={processedTokens.length}
              currentPrice={getCurrentPoolPrice(activePositionId)}
            />

            <ListBox>
              {isLoading
                ? placeholderNFTs.map((_, index) => <Skeleton.Image key={index} active style={placeholderStyle} />)
                : processedTokens.map((nft, index) => (
                    <NFTCardBox
                      key={index}
                      data={nft}
                      checked={selected[nft.tokenId]}
                      style={{ width: 240 }}
                      onChecked={(checked) => {
                        addToCart(nft, checked);
                      }}
                      attributes={[]}
                      // poolType={nft.poolType}
                    />
                  ))}
            </ListBox>
          </>
        ) : (
          <EmptyPoolShow />
        )}
      </Box>
    </>
  );
}
