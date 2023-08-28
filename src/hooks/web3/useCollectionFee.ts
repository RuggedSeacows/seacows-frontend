import { BigNumber } from 'ethers';
import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import SeacowsPairAbi from '@yolominds/seacows-sdk/abis/amm/SeacowsERC721TradePair.json';

export function useCollectFee(
  alive: boolean,
  pair: string | undefined,
  tokenId: string | undefined,
  callbacks?: {
    onSuccess?: () => unknown;
  },
) {
  const args = [tokenId ? BigNumber.from(tokenId) : 0];
  const enabled = alive && !!pair && !!tokenId;

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: pair as Address,
    abi: SeacowsPairAbi,
    functionName: 'collect',
    args,
    enabled,
  });

  const { data, error, isError, write: collect } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: callbacks?.onSuccess,
  });

  return {
    collect,
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError,
    error: (prepareError || error)?.message,
  };
}
