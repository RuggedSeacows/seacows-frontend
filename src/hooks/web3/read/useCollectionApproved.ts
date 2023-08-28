import { Address, useAccount, erc721ABI, useContractRead } from 'wagmi';

export function useCollectionApproved(collection: string | undefined, operator: string | undefined) {
  const { address } = useAccount();

  const {
    data: isApproved,
    isLoading,
    isError,
  } = useContractRead({
    address: collection as Address,
    abi: erc721ABI,
    functionName: 'isApprovedForAll',
    args: [address as Address, operator as Address],
    enabled: !!collection && !!address && !!operator,
    watch: true,
  });

  return {
    isApproved,
    isLoading,
    isError,
  };
}
