import { BigNumber } from 'ethers';
import { Nullable, Pretty } from 'src/utils/types';
import { PairFragment } from './graphql';

export type TODO = {
  todo: string;
};

export type TokenValue = 'ETH' | 'WETH' | 'USDT' | 'USDC';
export type PoolType = 'Trading' | 'Token' | 'NFT';
export type CurveType = 'cpmm' | 'exponential' | 'linear';

export interface Pool {
  id: string;
  owner: string;
  createdTx?: string;
  createdAt?: Nullable<string>;
  updatedAt?: Nullable<string>;
  nft?: string;
  token: TokenValue;
  curveType: CurveType;
  assetRecipient?: string;
  poolType: PoolType;
  delta?: Nullable<BigNumber>;
  fee?: Nullable<BigNumber>;
  volume?: Nullable<BigNumber>;
  spotPrice?: Nullable<BigNumber>;
  lastSalePrice?: Nullable<BigNumber>;
  nftIdInventory: BigNumber[];
  inventoryCount?: number;
  tokenLiquidity?: Nullable<BigNumber>;
  original: PairFragment;
}

type NFT = { id: string; tokenId: string };

export interface AmmPool<TIncludeNFTs extends boolean = false> {
  id: string;
  fee: number;
  liquidity: BigNumber;
  slot: number;

  token: {
    id: string;
    decimals: number;
    name: string;
    symbol: string;
  };

  nfts: TIncludeNFTs extends true ? NFT[] : undefined;

  collection: {
    id: string;
    name: string;
    symbol: string;
  };
}

export interface AmmPosition {
  id: string;
  liquidity: BigNumber;
  slot: Number;
  pool: AmmPool<true>;
}
