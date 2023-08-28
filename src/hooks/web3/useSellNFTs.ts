import { BigNumber, constants } from 'ethers';
import { Address, useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import SeacowsRouterAbi from '@yolominds/seacows-sdk/abis/periphery/SeacowsRouter.json';
import { useCartStore } from 'src/containers/cart/store';
// import SeacowsRouterAbi from './abis/SeacowsRouter.json';

export function useSellNFTs(
  alive: boolean,
  manager: string | undefined,
  pair: string | undefined,
  pairTokenIds: BigNumber[],
  wethAmount: BigNumber | undefined,
  callbacks?: {
    onSuccess?: () => unknown;
  },
) {
  const { address } = useAccount();
  const tokenOption = useCartStore((state) => state.tokenOption);
  const royaltyPercent = 0;

  const args = [pair, pairTokenIds, wethAmount, royaltyPercent, address, constants.MaxUint256];
  const enabled =
    alive &&
    !!address &&
    !!manager &&
    !!pair &&
    pairTokenIds.length > 0 &&
    wethAmount &&
    wethAmount.gt(BigNumber.from(0));

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: manager as Address,
    abi: SeacowsRouterAbi,
    functionName: tokenOption === 'ETH' ? 'swapExactNFTsForTokens' : 'swapExactNFTsForETH',
    args,
    enabled,
  });

  const { data, error, isError, write: buy } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: callbacks?.onSuccess,
  });

  if (isPrepareError || isError) {
    console.log('useSellNFTs error', prepareError || error, args);
  }

  return {
    buy,
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError,
    error: (prepareError || error)?.message,
  };
}
