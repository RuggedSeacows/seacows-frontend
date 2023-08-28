import { useQuery } from '@tanstack/react-query';
import { getPoolStats } from 'src/graphql/amm';

export function usePoolStats(skip: number, first: number) {
  const { data: pools = [], isLoading } = useQuery({
    queryKey: ['subgraph', 'getPoolStats', skip, first],
    queryFn: () => {
      if (typeof skip !== 'number' || typeof first !== 'number') return Promise.resolve([]);
      return getPoolStats(Math.max(first, 30), skip);
    },
  });

  return {
    pools,
    isLoading,
  };
}
