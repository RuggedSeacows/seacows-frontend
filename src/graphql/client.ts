import request from 'graphql-request';
import { SupportedChainId } from 'src/app/config';

export const PREV_SUBGRAPH_URL = 'https://api.thegraph.com/subgraphs/name/ponyjackal/seacows';
export const AMM_TRADE_SUBGRAPH_URL =
  'https://subgraph-goerli-dev.seacows.io/subgraphs/name/seacows/seacows-amm-subgraph';

/**
 * General wrapper around requests to the api & subgraph to centralize error handling
 *
 * @param query GraphQL query
 * @param params GraphQL params (via the gql function)
 * @param requestHeaders HeadersInit
 * @param url string url to query
 */
export const graphql = async <T>(
  chainId: SupportedChainId,
  query: string,
  params?: Record<string, any>,
  requestHeaders?: HeadersInit,
  url = AMM_TRADE_SUBGRAPH_URL,
) => {
  // TODO: Handle different GraphQL request based on the chainId
  try {
    const res = await request<T>(url, query, params, requestHeaders);
    return res;
  } catch (error: any) {
    console.error('GraphQL error', { error });

    // If the API error returned is somewhow different than what we expect
    // throw whatever came back.
    if (!error || !error?.response) {
      throw error;
    }

    throw error.response;
  }
};
