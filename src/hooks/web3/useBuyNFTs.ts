import { BigNumber, constants } from 'ethers';
import { Address, useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import SeacowsRouterAbi from '@yolominds/seacows-sdk/abis/periphery/SeacowsRouter.json';
import { useCartStore } from 'src/containers/cart/store';
// import SeacowsRouterAbi from './abis/SeacowsRouter.json';
import { useTokenBalances } from './read';

export function useBuyNFTs(
  alive: boolean,
  manager: string | undefined,
  pairs: string[],
  pairTokenIds: BigNumber[][],
  wethAmounts: BigNumber[],
  callbacks?: {
    onSuccess?: () => unknown;
  },
) {
  const { address } = useAccount();
  const { tokenBalances } = useTokenBalances();
  const tokenOption = useCartStore((state) => state.tokenOption);
  const royaltyPercent = 0;

  const totalAmount = wethAmounts.reduce((acc, amount) => acc.add(amount), BigNumber.from(0));
  // TODO: implement settings.deadline
  const args = [pairs, pairTokenIds, wethAmounts, royaltyPercent, address, constants.MaxUint256];
  const enabled =
    alive &&
    !!address &&
    !!manager &&
    pairs.filter((p) => !!p).length > 0 &&
    pairTokenIds.filter((tokenIds) => tokenIds.length > 0).length > 0 &&
    wethAmounts.filter((amount) => amount.gt(BigNumber.from(0))).length > 0 &&
    (tokenOption === 'ETH' ? tokenBalances.ETH?.gte(totalAmount) : tokenBalances.WETH?.gte(totalAmount));

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: manager as Address,
    abi: SeacowsRouterAbi,
    functionName: tokenOption === 'ETH' ? 'batchSwapETHForExactNFTs' : 'batchSwapTokensForExactNFTs',
    args,
    enabled,
    overrides:
      tokenOption === 'ETH'
        ? {
            value: totalAmount,
            from: address,
          }
        : undefined,
  });

  const { data, error, isError, write: buy } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: callbacks?.onSuccess,
  });

  if (isPrepareError || isError) {
    console.log('useBuyNFTs error', prepareError || error, args);
  }

  return {
    buy,
    tokenBalance: tokenBalances[tokenOption],
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError,
    error: (prepareError || error)?.message,
  };
}
