import { FC, useMemo } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { mainnet, goerli, polygon, polygonMumbai } from 'wagmi/chains';
import ethIcon from 'src/assets/ethereum-icon.jpeg';
import polygonIcon from 'src/assets/polygon-icon.jpeg';

const Icon = styled(Image)`
  border-radius: 50%;
  cursor: pointer;
`;

type NetworkIconProps = {
  width?: number;
  height?: number;
  chainId: number;
  onClick?: () => void;
};

const NetworkIcon: FC<NetworkIconProps> = ({ width = 24, height = 24, chainId, onClick }) => {
  const src = useMemo(
    () =>
      ({
        [mainnet.id]: ethIcon,
        [goerli.id]: ethIcon,
        [polygon.id]: polygonIcon,
        [polygonMumbai.id]: polygonIcon,
      }[chainId]),
    [chainId],
  );
  return <Icon src={src} width={width} height={height} onClick={onClick} alt="" />;
};

export default NetworkIcon;
