import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Address, erc20ABI, erc721ABI, useContractReads } from 'wagmi';

interface Param {
  collection: string;
  token: string;
  pool: string;
}

export function useAmmPoolBalances(params: Param[]) {
  const enabled = (params || []).every((p) => !!p.pool && !!p.collection && !!p.token);

  const { data, isLoading, isError } = useContractReads({
    contracts: (params || [])
      .map((p) => [
        {
          address: p.collection as Address,
          abi: erc721ABI,
          functionName: 'balanceOf',
          args: [p.pool],
        },
        {
          address: p.token as Address,
          abi: erc20ABI,
          functionName: 'balanceOf',
          args: [p.pool],
        },
      ])
      .flat(),
    enabled,
    watch: true,
  });

  const result = data || [];
  const balances: { collectionBalance: number; tokenBalance: number }[] = [];

  if (result.some((b) => !b)) {
    return {
      balances: [],
      isLoading,
      isError,
    };
  }

  for (let i = 0; i < result.length; i += 1) {
    const idx = Math.floor(i / 2);

    // @ts-ignore
    if (!balances[idx]) balances[idx] = {};

    if (i % 2 === 0) {
      balances[idx].collectionBalance = BigNumber.from(result[i]).toNumber();
    } else {
      balances[idx].tokenBalance = Number(formatEther(BigNumber.from(result[i]).toString()));
    }
  }

  return {
    balances,
    isLoading,
    isError,
  };
}
