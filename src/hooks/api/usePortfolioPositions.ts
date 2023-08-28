/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AMM_ADDRESSES } from 'src/app/config';
import { metadataApi, supportedChainName } from 'src/utils/api';
import { useQuery } from '@tanstack/react-query';
import { usePairFees } from '../web3';
import { useAMMPositions } from './useAMMPositions';
import { useConnectedNetwork } from '../useConnectedNetwork';
import { TokenWithAttributesResponse } from './useCollectionTokens';
import { useCollections } from './useCollection';

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

export function usePortfolioPositions() {
  const { positions, isLoading } = useAMMPositions(true);
  const { chainId } = useConnectedNetwork();

  const aggregatedTokenIds = positions.map((pos) => pos.id);
  const tokenIdJoined = aggregatedTokenIds.map((id) => id.toString()).join(',');

  const chainName = chainId ? supportedChainName[chainId] : undefined;
  const lpCollection = chainId === 5 ? AMM_ADDRESSES[chainId].manager : undefined;

  // Load LP Token Images
  const { data, isLoading: tokenLoading } = useQuery({
    queryKey: ['api', 'getCollectionTokens', chainName, lpCollection, tokenIdJoined],
    queryFn: () => {
      if (!chainName || !tokenIdJoined || !lpCollection) {
        return Promise.resolve({ tokens: [] } as TokenWithAttributesResponse);
      }

      return metadataApi.collection.getCollectionTokens(chainName, lpCollection, tokenIdJoined);
    },
  });

  // Load Position Collection Images
  const collections = Array.from(new Set(positions.map((pos) => pos.pool.collection.id)));
  const { collectionDict, isLoading: collectionLoading } = useCollections(collections);

  const tokens = data?.tokens || [];
  const tokenMap = getTokenMap(tokens);

  // TODO: Pull reward amounts
  const feeArgs = positions.map((pos) => ({
    tokenId: pos.id,
    pool: pos.pool.id,
  }));

  const { data: feeDict } = usePairFees(feeArgs);

  const positionTokens = positions.map((pos) => ({
    collection: {
      name: pos.pool.collection.name,
      address: pos.pool.collection.id,
      image:
        collectionDict[pos.pool.collection.id.toLowerCase()]?.logo ||
        `https://via.placeholder.com/24?text=${pos.pool.collection.name.slice(0, 1)}`,
    },
    tokenId: pos.id,
    pool: pos.pool.id,
    image: tokenMap[pos.id]?.image || `https://via.placeholder.com/250?text=LP Tokens #${pos.id}`,
    rewards: {
      token: pos.pool.token.symbol,
      amount: feeDict[pos.id] || '0',
    },
  }));

  return {
    positionTokens,
    isLoading: isLoading || tokenLoading || collectionLoading,
  };
}
