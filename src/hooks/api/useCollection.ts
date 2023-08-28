/* eslint-disable no-restricted-syntax */
import { metadataApi, supportedChainName } from 'src/utils/api';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Collection } from '@yolominds/metadata-service-api';
import { useConnectedNetwork } from '../useConnectedNetwork';

export function useCollection(collecton: string | undefined) {
  const { chainId } = useConnectedNetwork();
  const nft = collecton?.toLowerCase();
  const chainName = chainId ? supportedChainName[chainId] : undefined;

  const { data: collection, isLoading } = useQuery({
    queryKey: ['api', 'getCollection', chainName, nft],
    queryFn: async () => {
      const isValidRequest = chainName && nft;
      if (!isValidRequest) {
        return Promise.resolve(null);
      }

      return metadataApi.collection.getCollection(chainName, nft).then((resp) => resp.collection);
    },
  });

  return {
    collection,
    isLoading,
  };
}

export function useCollections(collections: string[]) {
  const { chainId } = useConnectedNetwork();
  const chainName = chainId ? supportedChainName[chainId] : undefined;

  const results = useQueries({
    queries: collections.map((c) => ({
      queryKey: ['api', 'getCollection', chainName, c?.toLowerCase()],
      queryFn: async () => {
        const isValidRequest = chainName && c;
        if (!isValidRequest) {
          return Promise.resolve(null);
        }

        return metadataApi.collection.getCollection(chainName, c).then((resp) => resp.collection);
      },
    })),
  });

  const obj: Record<string, Collection> = {};
  for (const r of results) {
    if (r.data) {
      obj[r.data.address.toLowerCase()] = r.data;
    }
  }

  return {
    collectionDict: obj,
    isLoading: results.some((r) => r.isLoading),
  };
}
