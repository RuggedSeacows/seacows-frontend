import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect } from 'react';
import { SupportedChainId, supportedChains } from 'src/app/config';
import { useNetwork, useSwitchNetwork } from 'wagmi';

export function useConnectedNetwork() {
  const { chain } = useNetwork();
  const { openConnectModal } = useConnectModal();
  const { switchNetwork } = useSwitchNetwork();

  const chainId = chain?.id && chain?.unsupported === false ? chain.id : undefined;
  const isSupported = supportedChains.some((ch) => ch.id === chainId);

  useEffect(() => {
    if (!chainId) {
      openConnectModal?.();
    }

    if (chainId && chainId !== 5) {
      switchNetwork?.(5);
    }
  }, [chainId, openConnectModal, switchNetwork]);

  return {
    chainId: isSupported ? (chainId as SupportedChainId) : undefined,
    chain,
  };
}
