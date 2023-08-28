import SeacowsPositionManagerAbi from '@yolominds/seacows-sdk/abis/amm/SeacowsPositionManager.json';
import { BigNumber, constants } from 'ethers';
import { Address, useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';

type RemoveLiquidityConstraint = {
  cTokenOutMin: BigNumber;
  cNftOutMin: BigNumber;
  tokenInMax: BigNumber;
  nftIds: BigNumber[];
};

export function useRemoveLiquidity(
  alive: boolean,
  manager: string | undefined,
  collection: string | undefined,
  fee: number | undefined,
  liquidity: BigNumber | undefined,
  pairTokenId: BigNumber,
  constraint: RemoveLiquidityConstraint,
  callbacks?: {
    onSuccess?: () => unknown;
  },
) {
  const { address } = useAccount();
  const enabled =
    alive &&
    !!address &&
    !!manager &&
    !!collection &&
    !!fee &&
    !!liquidity &&
    liquidity.gt(BigNumber.from(0)) &&
    constraint.nftIds?.length > 0 &&
    constraint.cTokenOutMin.gt(BigNumber.from(0)) &&
    constraint.cNftOutMin.gt(BigNumber.from(0)) &&
    BigNumber.isBigNumber(pairTokenId);
  const args = [collection, fee, liquidity, constraint, pairTokenId, address, constants.MaxUint256];

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: manager as Address,
    abi: SeacowsPositionManagerAbi,
    functionName: 'removeLiquidityETH',
    args,
    enabled,
  });

  const { data, error, isError, write: removeLiquidity } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: callbacks?.onSuccess,
  });

  if (isPrepareError || isError) {
    console.log('useRemoveLiquidity error', prepareError || error, args);
  }

  return {
    removeLiquidity,
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError,
    error: (prepareError || error)?.message,
  };
}
