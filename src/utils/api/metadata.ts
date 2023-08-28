import { SeacowsMetadataClient, SupportedChain } from '@yolominds/metadata-service-api';
import { Awaited } from '../types';

export const metadataApi = new SeacowsMetadataClient({
  BASE: process.env.NEXT_PUBLIC_METADATA_API_BASE_URL,
});

export const supportedChainName: Record<number, SupportedChain> = {
  1: SupportedChain.MAINNET,
  5: SupportedChain.GOERLI,
};

export type MetadataApiCacheKey = 'api-searchCollectionsByName' | 'api-trendingCollections' | 'api-topPoolCollections';

export const metadataApiFetcher = (url: MetadataApiCacheKey) => {
  if (url === 'api-searchCollectionsByName') {
    return metadataApi.collection.searchCollections(SupportedChain.GOERLI, 'ape', 'false');
  }
  if (url === 'api-trendingCollections' || url === 'api-topPoolCollections') {
    return metadataApi.collection.getTrendingCollections(SupportedChain.GOERLI);
  }
};

export type GetTrendingCollectionsResponse = Awaited<ReturnType<typeof metadataApi.collection.getTrendingCollections>>;
export type SearchCollectionsResponse = Awaited<ReturnType<typeof metadataApi.collection.searchCollections>>;
