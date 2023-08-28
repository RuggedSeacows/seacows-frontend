import SeacowsERC721TradePairAbi from '@yolominds/seacows-sdk/abis/amm/SeacowsERC721TradePair.json';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Address, useContractReads } from 'wagmi';

type Args = Array<{ tokenId: string; pool: string }>;

export function usePairFees(args: Args) {
  const { data, isLoading, isError } = useContractReads({
    contracts: args.map((arg) => ({
      address: arg.pool as Address,
      abi: SeacowsERC721TradePairAbi,
      functionName: 'getPendingFee',
      args: [arg.tokenId],
    })),
    enabled: args.length > 0,
    watch: true,
  });

  const result: Record<string, string> = {};

  for (let i = 0; i < args.length; i += 1) {
    if (args[i] && data?.[i]) {
      result[args[i].tokenId] = formatEther(BigNumber.from(data[i]));
    }
  }

  return {
    data: result,
    isLoading,
    isError,
  };
}
