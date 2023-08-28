import type { PoolType } from 'src/types';
import NFTPoolIcon from 'src/assets/nft-pool-icon.svg';
import TradingPoolIcon from 'src/assets/trading-pool-icon.svg';
import TokenPoolIcon from 'src/assets/token-pool-icon.svg';

interface Props {
  type?: PoolType;
}

export function PoolTypeIcon({ type }: Props) {
  if (type === 'NFT') {
    return <NFTPoolIcon />;
  }

  if (type === 'Trading') {
    return <TradingPoolIcon />;
  }

  if (type === 'Token') {
    return <TokenPoolIcon />;
  }

  return null;
}
