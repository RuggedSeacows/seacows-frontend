import { Chain } from 'wagmi/chains';
import ethers from 'ethers';

export const addNetwork = async ({ name, id, nativeCurrency, rpcUrls }: Chain | any) => {
  if (window.ethereum) {
    // await (window.ethereum as providers.ExternalProvider).request?.({
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [
        {
          chainName: name,
          chainId: ethers.utils.hexlify(id),
          nativeCurrency,
          rpcUrls: rpcUrls.public.http,
        },
      ],
    });
  }
};
