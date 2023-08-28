export interface PairFilter {
  poolType?: number;
  erc20Contract?: string;
  nft?: string;
  owner?: string;
}

export interface PaginatedInput {
  skip?: number;
  first?: number;
}

export interface PairFragment {
  id: string;
  owner: string;
  createdTx?: string;
  createdAt?: bigint;
  updatedAt?: bigint;
  nft?: string;
  erc20Contract?: string;
  bondingCurveAddress?: string;
  assetRecipient?: string;
  poolType?: string;
  delta?: string;
  fee?: string;
  spotPrice?: string;
  lastSalePrice?: string;
  nftIdInventory?: [string];
  inventoryCount?: string;
  tokenLiquidity?: string;
}

export interface AmmPoolFragment {
  id: string;
  fee: string;
  liquidity: string;
  slot: string;
  token: {
    decimals: string;
    id: string;
    name: string;
    symbol: string;
  };
  nfts?: Array<{
    tokenId: string;
    id: string;
  }>;
  collection: {
    id: string;
    name: string;
    symbol: string;
  };
}
