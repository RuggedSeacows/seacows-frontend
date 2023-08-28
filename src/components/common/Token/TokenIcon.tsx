import type { TokenValue } from 'src/types';
import Image from 'next/image';
import EthereumIcon from '../../../assets/tokens/ethereum.png';
import WETHIcon from '../../../assets/tokens/weth.png';
import USDTIcon from '../../../assets/tokens/usdt.png';
import USDCIcon from '../../../assets/tokens/usdc.png';

interface Props {
  token?: TokenValue;
  size?: number;
  alt?: string;
}

export function TokenIcon({ token, size = 24, alt }: Props) {
  const icon = token === 'ETH' ? EthereumIcon : token === 'WETH' ? WETHIcon : token === 'USDC' ? USDCIcon : token === 'USDT' ? USDTIcon : null;

  if (icon) {
    return <Image src={icon} width={size} height={size} alt={alt || token || 'Token'} />;
  }

  return null;
}
