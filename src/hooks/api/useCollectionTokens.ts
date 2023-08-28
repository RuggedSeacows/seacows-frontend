/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { metadataApi, supportedChainName } from 'src/utils/api';
import { useQuery } from '@tanstack/react-query';

function getTokenMap(tokens: any[]) {
  const mappedTokens: Record<
    string,
    {
      image: string;
      name: string;
      key: string;
      tokenId: string;
      rarity: number;
      attributes: Record<string, any>[];
    }
  > = {};

  for (const t of tokens) {
    const {
      token: { image, name, rarityRank, tokenId, attributes },
      market,
    } = t;

    mappedTokens[tokenId] = {
      image,
      name,
      key: tokenId,
      tokenId,
      rarity: rarityRank,
      attributes,
    };
  }
  return mappedTokens;
}

export type TokenWithAttributesResponse = Awaited<ReturnType<typeof metadataApi.collection.getCollectionTokens>>;

// Return aggregated tokens for certain collection pools
// TODO: Pagination
export function useCollectionTokens(nft: string, networkId: number, tokenIds: string[]) {
  const chainName = supportedChainName[networkId];
  const tokenIdJoined = tokenIds.map((id) => id.toString()).join(',');
  const collection = nft.toLowerCase();

  const { data, isLoading } = useQuery({
    queryKey: ['api', 'getCollectionTokens', chainName, collection, tokenIdJoined],
    queryFn: () => {
      if (!chainName || !tokenIdJoined) {
        return Promise.resolve({ tokens: [] } as TokenWithAttributesResponse);
      }

      return metadataApi.collection.getCollectionTokens(chainName, collection, tokenIdJoined);
    },
  });

  const tokens = data?.tokens || [];
  const tokenMap = getTokenMap(tokens);

  return {
    data,
    tokenMap,
    isLoading,
  };
}
