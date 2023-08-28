import { gql } from 'graphql-request';
import { PaginatedInput, PairFilter, PairFragment } from 'src/types/graphql';
import { Pool } from 'src/types';
import { SupportedChainId } from 'src/app/config';
import { pairFragment } from './fragments';
import { graphql } from './client';
import { formatGqlPool } from './formatter';

interface Response {
  pairs: PairFragment[];
}

interface Input extends PaginatedInput {
  where?: PairFilter;
}

/**
 * Retrieve pools data
 * @param skip skip amount, for pagination
 * @param first page size, for pagination
 * @param where PairFilter
 * @returns PairFragment[]
 */
export const getPools = async (
  chainId: SupportedChainId,
  { skip = 0, first = 100, where }: Input,
  requestHeaders?: HeadersInit,
): Promise<Pool[]> => {
  const query = gql`
    query GetPools($where: Pair_filter, $skip: Int, $first: Int) {
      pairs(first: $first, skip: $skip, where: $where) {
        ...PairFragment
      }
    }
    ${pairFragment}
  `;

  const res = await graphql<Response>(chainId, query, { where, skip, first }, requestHeaders);
  const pools = res.pairs.map((pair) => formatGqlPool(chainId, pair));
  return pools;
};
