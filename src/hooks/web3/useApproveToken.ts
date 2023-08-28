import { BigNumber } from 'ethers';
import {
  Address,
  useAccount,
  erc20ABI,
  useContractReads,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';

export function useApproveToken(token: string | undefined, operator: string | undefined, amount: BigNumber) {
  const { address } = useAccount();

  const { data, isError } = useContractReads({
    contracts: [
      {
        address: token as Address,
        abi: erc20ABI,
        functionName: 'allowance',
        args: [address as Address, operator as Address],
      },
      // {
      //   address: token as Address,
      //   abi: erc20ABI,
      //   functionName: 'balanceOf',
      //   args: [address as Address],
      // }
    ],
    enabled: !!token && !!address && !!operator && amount.gt(BigNumber.from(0)),
    watch: true,
  });

  const isApproved = data && data[0] ? data[0].gte(amount) : false;

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: token as Address,
    abi: erc20ABI,
    functionName: 'approve',
    args: [operator as Address, amount],
    enabled: !isApproved && !!token && !!address && !!operator && amount.gt(BigNumber.from(0)),
  });

  const { data: call, error, isError: isApproveError, write: approve } = useContractWrite(config);
  const { isLoading: approveLoading, isSuccess } = useWaitForTransaction({
    hash: call?.hash,
  });

  return {
    isApproved,
    approve,
    isLoading: approveLoading,
    isSuccess,
    hasError: isPrepareError || isError || isApproveError,
    error: (prepareError || error)?.message,
  };
}
