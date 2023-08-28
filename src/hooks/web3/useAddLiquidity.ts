import SeacowsPositionManagerAbi from '@yolominds/seacows-sdk/abis/amm/SeacowsPositionManager.json';
import { BigNumber, constants } from 'ethers';
import { AMM_ADDRESSES } from 'src/app/config';
import { useCartStore } from 'src/containers/cart/store';
import { Address, useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

export function useAddLiquidity(
  alive: boolean,
  manager: string | undefined,
  collection: string | undefined,
  fee: number | undefined,
  pairTokenId: BigNumber | undefined,
  tokenIds: BigNumber[],
  ethMin: BigNumber,
  ethActual: BigNumber,
  callbacks?: {
    onSuccess?: () => unknown;
  },
) {
  const { address } = useAccount();
  const tokenOption = useCartStore((state) => state.tokenOption);
  const enabled =
    alive &&
    !!address &&
    !!manager &&
    !!collection &&
    !!fee &&
    tokenIds?.length > 0 &&
    ethMin.gt(BigNumber.from(0)) &&
    ethActual.gt(BigNumber.from(0)) &&
    ethActual.gte(ethMin) &&
    BigNumber.isBigNumber(pairTokenId);
  const args =
    tokenOption === 'ETH'
      ? [collection, fee, tokenIds, ethMin, pairTokenId, constants.MaxUint256]
      : [AMM_ADDRESSES[5].weth, collection, fee, ethActual, tokenIds, ethMin, pairTokenId, constants.MaxUint256];

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: manager as Address,
    abi: SeacowsPositionManagerAbi,
    functionName: tokenOption === 'ETH' ? 'addLiquidityETH' : 'addLiquidity',
    args,
    enabled,
    overrides:
      tokenOption === 'ETH'
        ? {
            from: address,
            value: ethActual,
          }
        : undefined,
  });

  const { data, error, isError, write: addLiquidity } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: callbacks?.onSuccess,
  });

  if (isPrepareError || isError) {
    console.debug('useAddLiquidity error', prepareError || error, args);
  }

  return {
    addLiquidity,
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError,
    error: (prepareError || error)?.message,
  };
}
