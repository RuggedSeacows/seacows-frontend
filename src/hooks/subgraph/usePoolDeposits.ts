import { useQuery } from '@tanstack/react-query';
import { getPoolDeposits } from 'src/graphql/amm';

export function usePoolDeposits(collection: string | undefined) {
  const { data: deposits = [], isLoading } = useQuery({
    queryKey: ['subgraph', 'getPoolDeposits', collection?.toLowerCase()],
    queryFn: () => {
      if (!collection) {
        return Promise.resolve([]);
      }

      return getPoolDeposits(collection.toLowerCase());
    },
  });

  return {
    deposits,
    isLoading,
  };
}
