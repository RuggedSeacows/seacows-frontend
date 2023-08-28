import { erc721ABI, Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi';

export function useApproveCollection(
  collection: string | undefined,
  operator: string | undefined,
  approve = true,
) {
  const { address } = useAccount();

  const {
    data: isApproved,
    isError,
  } = useContractRead({
    address: collection as Address,
    abi: erc721ABI,
    functionName: 'isApprovedForAll',
    args: [address as Address, operator as Address],
    enabled: !!collection && !!address && !!operator && approve,
    watch: true,
  });
  
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: collection as Address,
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    args: [operator as Address, approve],
    enabled: !isApproved && !!collection && !!operator,
  });

  const { data, error, isError: approveError, write: approveCall } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    isApproved,
    approve: approveCall,
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError || approveError,
    error: (prepareError || error)?.message,
  };
}

