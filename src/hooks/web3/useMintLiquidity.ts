import SeacowsPositionManagerAbi from '@yolominds/seacows-sdk/abis/amm/SeacowsPositionManager.json';
import { BigNumber, constants } from 'ethers';
import { getTokenAddress } from 'src/app/config';
import { TokenValue } from 'src/types';
import { Address, useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useConnectedNetwork } from '../useConnectedNetwork';

export function useMintLiquidity(
  alive: boolean | undefined,
  token: TokenValue,
  manager: string | undefined,
  collection: string | undefined,
  fee: number | undefined, // 100 bps
  tokenIds: BigNumber[],
  ethMin: BigNumber,
  ethActual: BigNumber,
  callbacks?: {
    onSuccess?: () => unknown;
  },
) {
  const { address } = useAccount();
  const { chainId } = useConnectedNetwork();
  const tokenAddress = getTokenAddress(chainId, token);
  const enabled =
    alive &&
    !!tokenAddress &&
    !!address &&
    !!manager &&
    !!collection &&
    !!fee &&
    tokenIds?.length > 0 &&
    ethMin.gt(BigNumber.from(0)) &&
    ethActual.gt(BigNumber.from(0)) &&
    ethActual.gte(ethMin);
  const args =
    token === 'ETH'
      ? [collection, fee, tokenIds, ethMin, constants.MaxUint256]
      : [tokenAddress, collection, fee, ethActual, tokenIds, ethMin, constants.MaxUint256];

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: manager as Address,
    abi: SeacowsPositionManagerAbi,
    functionName: token === 'ETH' ? 'mintWithETH' : 'mint',
    args,
    enabled,
    overrides:
      token === 'ETH'
        ? {
            from: address,
            value: ethActual,
          }
        : undefined,
  });

  const { data, error, isError, write: mint } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: callbacks?.onSuccess,
  });

  if (isPrepareError || isError) {
    console.debug('useMintLiquidity error', prepareError || error, args);
  }

  return {
    mint,
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError,
    error: (prepareError || error)?.message,
  };
}
