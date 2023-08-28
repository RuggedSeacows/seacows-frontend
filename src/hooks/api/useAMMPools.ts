/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatEther } from 'ethers/lib/utils';
import { AMM_ADDRESSES, SupportedChainId } from 'src/app/config';
import { getAMMPools } from 'src/graphql/amm';
import { notEmpty } from 'src/utils/types';
import { constants } from 'ethers';
import { AmmPool, TokenValue } from 'src/types';
import { useQuery } from '@tanstack/react-query';
import { usePairReserves } from '../web3';
import { useCollectionTokens } from './useCollectionTokens';

// Return created Seacow AMM pools for certain collection
// TODO: Pagination
export function useCollectionAMMPools(nft: string, networkId: number, includeNFTs = false) {
  const collection = nft.toLowerCase();
  const { data: pools = [], isLoading } = useQuery({
    queryKey: ['subgraph', 'getAMMPoolsByNFTAddress', networkId, collection, includeNFTs],
    queryFn: () => {
      if (!networkId) {
        throw new Error('No network connected');
      }

      if (nft === constants.AddressZero) {
        return Promise.resolve([]);
      }

      return getAMMPools(networkId as SupportedChainId, {
        where: {
          collection,
          token: networkId === 5 ? AMM_ADDRESSES[networkId].weth.toLowerCase() : undefined,
        },
        includeNFTs,
      }).then((result) => (includeNFTs ? (result as AmmPool<true>[]) : (result as AmmPool<false>[])));
    },
  });

  return {
    pools,
    isLoading,
  };
}

// Return aggregated tokens for certain collection pools
// TODO: Pagination
export function useCollectionAMMPoolTokens(nft: string, networkId: number) {
  const { pools, isLoading: poolLoading } = useCollectionAMMPools(nft, networkId, true);

  const aggregatedTokenIds = pools.map((p) => (p.nfts || []).map((t) => t.tokenId)).flat();

  const { data, tokenMap, isLoading: tokenLoading } = useCollectionTokens(nft, networkId, aggregatedTokenIds);

  const pairs = pools.map((p) => p.id);
  const { data: pairDetails } = usePairReserves(pairs);

  const pooledTokens = pools
    .map((p) =>
      (p.nfts || [])
        .map((t) => {
          const token = tokenMap[t.tokenId];
          const pairD = pairDetails[p.id] || {};

          if (!token) {
            return null;
          }

          return {
            price: {
              token: p.token.symbol as TokenValue,
              value: pairD.rate ? Number(formatEther(pairD.rate)) : undefined,
            },
            poolDetails: {
              id: p.id,
              ...pairD,
            },
            poolType: 'Trading',
            ...token,
          };
        })
        .filter(notEmpty),
    )
    .flat();

  return {
    tokens: data?.tokens || [],
    pooledTokens,
    pairDetails,
    continuation: data?.continuation,
    isLoading: poolLoading || tokenLoading,
  };
}
