import { useQuery } from '@tanstack/react-query';
import { getPoolWithdraws } from 'src/graphql/amm';

export function usePoolWithdraws(collection: string | undefined) {
  const { data: withdraws = [], isLoading } = useQuery({
    queryKey: ['subgraph', 'getPoolWithdraws', collection?.toLowerCase()],
    queryFn: () => {
      if (!collection) {
        return Promise.resolve([]);
      }

      return getPoolWithdraws(collection.toLowerCase());
    },
  });

  return {
    withdraws,
    isLoading,
  };
}
