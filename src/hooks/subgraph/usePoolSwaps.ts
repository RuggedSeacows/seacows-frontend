import { useQuery } from '@tanstack/react-query';
import { getPoolSwaps } from 'src/graphql/amm';

export function usePoolSwaps(collection: string | undefined, type?: 'Buy' | 'Sell') {
  const { data: swaps = [], isLoading } = useQuery({
    queryKey: ['subgraph', 'getPoolSwaps', type, collection?.toLowerCase()],
    queryFn: () => {
      if (!collection) {
        return Promise.resolve([]);
      }

      return getPoolSwaps(collection.toLowerCase(), type);
    },
  });

  return {
    swaps,
    isLoading,
  };
}
