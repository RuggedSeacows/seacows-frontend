/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery } from '@tanstack/react-query';
import { formatEther } from 'ethers/lib/utils';
import { SupportedChainId } from 'src/app/config';
import { getPools } from 'src/graphql/seacows';
import { metadataApi, supportedChainName } from 'src/utils/api';
import { notEmpty } from 'src/utils/types';

function getTokenMap(tokens: any[]) {
  const mappedTokens: Record<
    string,
    {
      image: string;
      name: string;
      key: string;
      tokenId: string;
      rarity: number;
    }
  > = {};

  for (const t of tokens) {
    const {
      token: { image, name, rarityRank, tokenId },
      market,
    } = t;

    mappedTokens[tokenId] = {
      image,
      name,
      key: tokenId,
      tokenId,
      rarity: rarityRank,
    };
  }
  return mappedTokens;
}

// Return created Seacow pools for certain collection
// TODO: Pagination
export function useCollectionPools(nft: string, networkId: number) {
  const collection = nft.toLowerCase();
  const { data: pools = [], isLoading } = useQuery({
    queryKey: ['subgraph', 'getPoolsByNFTAddress', networkId, collection],
    queryFn: () => {
      if (!networkId) {
        throw new Error('No network connected');
      }

      return getPools(networkId as SupportedChainId, {
        where: {
          nft: collection,
        },
      });
    },
  });

  return {
    pools,
    isLoading,
  };
}

type TokenWithAttributesResponse = Awaited<ReturnType<typeof metadataApi.collection.getCollectionTokens>>;

// Return aggregated tokens for certain collection pools
// TODO: Pagination
export function useCollectionPoolTokens(nft: string, networkId: number) {
  const { pools, isLoading: poolLoading } = useCollectionPools(nft, networkId);

  const aggregatedTokenIds = pools.map((p) => p.nftIdInventory).flat();
  const chainName = supportedChainName[networkId];
  const tokenIdJoined = aggregatedTokenIds.map((id) => id.toString()).join(',');
  const collection = nft.toLowerCase();

  const { data, isLoading: tokenLoading } = useQuery({
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

  const pooledTokens = pools
    .map((p) =>
      p.nftIdInventory
        .map((id) => {
          const token = tokenMap[id.toString()];

          if (!token) {
            return null;
          }

          return {
            lastSale: {
              token: p.token,
              value: p.lastSalePrice ? Number(formatEther(p.lastSalePrice)) : undefined,
            },
            price: {
              token: p.token,
              value: p.spotPrice ? Number(formatEther(p.spotPrice)) : undefined,
            },
            pool: p.id,
            poolType: p.poolType,
            ...token,
          };
        })
        .filter(notEmpty),
    )
    .flat();

  return {
    tokens: data?.tokens || [],
    pooledTokens,
    continuation: data?.continuation,
    isLoading: poolLoading || tokenLoading,
  };
}
