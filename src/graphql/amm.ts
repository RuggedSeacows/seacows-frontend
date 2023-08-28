import { gql } from 'graphql-request';
import { PaginatedInput, AmmPoolFragment } from 'src/types/graphql';
import { AmmPool, AmmPosition } from 'src/types';
import { SupportedChainId } from 'src/app/config';
import { BigNumber } from 'ethers';
import { collectionFragment, nftFragment, tokenFragment } from './fragments';
import { graphql } from './client';
import { formatGqlAmmPool } from './formatter';

interface Response {
  pools: AmmPoolFragment[];
}

interface Input extends PaginatedInput {
  where?: {
    collection?: string;
    token?: string;
  };
  includeNFTs?: boolean;
}

/**
 * Retrieve pools data
 * @param skip skip amount, for pagination
 * @param first page size, for pagination
 * @param where PoolFilter
 * @param includeNFTs boolean - if true, it will return NFT tokenIds inside the pool
 * @returns AmmPool[]
 */
export const getAMMPools = async (
  chainId: SupportedChainId,
  { skip = 0, first = 1000, where, includeNFTs }: Input,
  requestHeaders?: HeadersInit,
) => {
  const query = gql`
    query GetAMMPools($where: Pool_filter, $skip: Int, $first: Int) {
      pools(first: $first, skip: $skip, where: $where) {
        id
        fee
        slot
        liquidity
        token {
          ...TokenFragment
        }
        collection {
          ...CollectionFragment
        }
        ${
          includeNFTs
            ? `
          nfts(first: $first) {
            ...NFTFragment
          }
        `
            : ''
        }
      }
    }
    ${tokenFragment}
    ${collectionFragment}
    ${nftFragment}
  `;

  const res = await graphql<Response>(
    chainId,
    query,
    {
      where: {
        collection: where?.collection,
        token: where?.token,
      },
      skip,
      first,
    },
    requestHeaders,
  );
  const pools = res.pools.map((pool) => formatGqlAmmPool(pool, includeNFTs));

  if (includeNFTs) return pools as unknown as AmmPool<true>[];
  return pools as unknown as AmmPool<false>[];
};

interface PositionInput extends PaginatedInput {
  where: {
    owner?: string;
    slotIds?: string[];
  };
}

export const getAMMPositions = async (
  chainId: SupportedChainId,
  { skip = 0, first = 1000, where }: PositionInput,
  requestHeaders?: HeadersInit,
): Promise<AmmPosition[]> => {
  type IntermediatePosition = {
    id: string;
    liquidity: string;
    slot: string;
    pool: {
      id: string;
      fee: string;
      // TODO: Non-essential. Can be removed
      collection: {
        id: string;
        name: string;
        symbol: string;
      };
      token: {
        decimals: string;
        id: string;
        name: string;
        symbol: string;
      };
      nfts: {
        // TODO: Non-essential. Can be removed
        id: string;
        tokenId: string;
      }[];
    };
  };

  const query = gql`
    query GetAMMPositions($where: Position_filter, $skip: Int, $first: Int) {
      positions(first: $first, skip: $skip, where: $where) {
        id
        liquidity
        slot
        pool {
          id
          fee
          collection {
            ...CollectionFragment
          }
          token {
            ...TokenFragment
          }
          nfts(first: $first) {
            ...NFTFragment
          }
        }
      }
    }
    ${collectionFragment}
    ${tokenFragment}
    ${nftFragment}
  `;

  const res = await graphql<{ positions: IntermediatePosition[] }>(
    chainId,
    query,
    {
      where: {
        owner: where.owner,
        slot_in: where.slotIds,
        liquidity_not: where.owner ? undefined : '0',
      },
      skip,
      first,
    },
    requestHeaders,
  );

  const positions = res.positions.map((position) => {
    const {
      liquidity,
      slot,
      pool: { fee, token, ...poolRest },
      ...rest
    } = position;
    return {
      ...rest,
      slot: Number(slot),
      liquidity: BigNumber.from(liquidity),
      pool: {
        ...poolRest,
        fee: Number(fee),
        slot: Number(slot),
        liquidity: BigNumber.from(liquidity),
        token: {
          ...token,
          decimals: Number(token.decimals),
        },
      },
    };
  });

  return positions;
};

const CHAIN_ID = 5;

export const getPoolSwaps = async (collection: string, type?: 'Buy' | 'Sell') => {
  const query = gql`
    query GetSwapsGql($where: Swap_filter, $skip: Int, $first: Int) {
      swaps(first: $first, skip: $skip, where: $where) {
        nftAmount
        tokenAmount
        token {
          id
          symbol
        }
        origin
        timestamp
        pool {
          id
          collection {
            id
            name
            symbol
          }
        }
        id
      }
    }
  `;

  const res = await graphql<{ swaps: any[] }>(CHAIN_ID, query, {
    where: {
      collection,
      nftAmount_gt: type === 'Sell' ? '0' : undefined,
      nftAmount_lt: type === 'Buy' ? '0' : undefined,
    },
    skip: 0,
    first: 1000,
  });

  return res.swaps.map((swap) => {
    const { nftAmount, tokenAmount, token, origin, timestamp, pool, id } = swap;
    return {
      id: String(id),
      nftAmount: Math.abs(Number(nftAmount)),
      tokenAmount: Math.abs(Number(tokenAmount)),
      type: Number(nftAmount) < 0 ? 'Buy' : 'Sell',
      token: {
        id: String(token.id),
        symbol: String(token.symbol),
      },
      origin: String(origin),
      timestamp: Number(timestamp),
      pool: {
        id: String(pool.id),
        collection: {
          id: String(pool.collection.id),
          name: String(pool.collection.name),
          symbol: String(pool.collection.symbol),
        },
      },
    };
  });
};

export const getPoolDeposits = async (collection: string) => {
  const query = gql`
    query GetMintsGql($where: Mint_filter, $skip: Int, $first: Int) {
      mints(where: $where, first: $first, skip: $skip) {
        nftAmount
        origin
        timestamp
        tokenAmount
        id
        token {
          symbol
        }
        collection {
          name
          symbol
        }
      }
    }
  `;

  const res = await graphql<{ mints: any[] }>(CHAIN_ID, query, {
    where: {
      collection,
    },
    skip: 0,
    first: 1000,
  });

  return res.mints.map((mint) => {
    const { nftAmount, tokenAmount, token, origin, timestamp, id, collection: col } = mint;
    return {
      id: String(id),
      nftAmount: Math.abs(Number(nftAmount)),
      tokenAmount: Math.abs(Number(tokenAmount)),
      type: 'Deposit',
      token: {
        symbol: String(token.symbol),
      },
      origin: String(origin),
      timestamp: Number(timestamp),
      collection: {
        name: String(col.name),
        symbol: String(col.symbol),
      },
    };
  });
};

export const getPoolWithdraws = async (collection: string) => {
  const query = gql`
    query GetWithdrawGql($where: Burn_filter, $skip: Int, $first: Int) {
      burns(where: $where, first: $first, skip: $skip) {
        nftAmount
        id
        origin
        tokenAmount
        timestamp
        collection {
          symbol
          name
        }
        token {
          symbol
        }
      }
    }
  `;

  const res = await graphql<{ burns: any[] }>(CHAIN_ID, query, {
    where: {
      collection,
    },
    skip: 0,
    first: 1000,
  });

  return res.burns.map((burn) => {
    const { nftAmount, tokenAmount, token, origin, timestamp, id, collection: col } = burn;
    return {
      id: String(id),
      nftAmount: Math.abs(Number(nftAmount)),
      tokenAmount: Math.abs(Number(tokenAmount)),
      type: 'Deposit',
      token: {
        symbol: String(token.symbol),
      },
      origin: String(origin),
      timestamp: Number(timestamp),
      collection: {
        name: String(col.name),
        symbol: String(col.symbol),
      },
    };
  });
};

export const getPoolStats = async (first = 1000, skip = 0) => {
  const query = gql`
    query GetPoolStats($first: Int, $skip: Int) {
      pools(first: $first, orderBy: liquidity, skip: $skip) {
        poolWeekData(orderBy: week, orderDirection: desc, first: 1) {
          price
          priceChange
          volume
          week
        }
        poolDayData(orderBy: date, orderDirection: desc, first: 1) {
          volume
          price
          priceChange
          date
        }
        liquidity
        id
        createdAt
        totalValueLocked
        totalFee
        collection {
          name
          id
        }
        fee
        token {
          id
          name
        }
        slot
      }
    }
  `;

  const res = await graphql<{ pools: any[] }>(CHAIN_ID, query, {
    skip,
    first,
  });

  return res.pools.map((pool) => {
    const {
      id,
      liquidity,
      collection,
      fee,
      token,
      slot,
      poolWeekData,
      poolDayData,
      totalValueLocked,
      createdAt,
      totalFee,
    } = pool;
    console.log('createdAt', createdAt);
    return {
      id: String(id),
      liquidity: BigNumber.from(liquidity),
      collection: {
        id: String(collection.id),
        name: String(collection.name),
      },
      token: {
        id: String(token.id),
        name: String(token.name),
      },
      slot: Number(slot),
      fee: Number(fee),
      totalValueLocked: Number(totalValueLocked),
      totalFee: Number(totalFee),
      createdAt: new Date(Number(createdAt) * 1000),
      poolWeekData:
        Array.isArray(poolWeekData) && poolWeekData.length > 0
          ? {
              price: Number(poolWeekData[0].price),
              priceChange: Number(poolWeekData[0].priceChange),
              volume: Number(poolWeekData[0].volume),
            }
          : null,
      poolDayData:
        Array.isArray(poolDayData) && poolDayData.length > 0
          ? {
              price: Number(poolDayData[0].price),
              priceChange: Number(poolDayData[0].priceChange),
              volume: Number(poolDayData[0].volume),
            }
          : null,
    };
  });
};
