import { BigNumber } from 'ethers';
import { ADDRESSES, SupportedChainId } from 'src/app/config';
import { PoolType, TokenValue, CurveType, Pool, AmmPool } from 'src/types';
import { AmmPoolFragment, PairFragment } from 'src/types/graphql';
import { isSameAddress } from 'src/utils/address';

export function convertCurveAddressToType(chainId: SupportedChainId, address?: string): CurveType {
  if (!address) {
    throw new Error('convertCurveAddressToType received empty address');
  }

  if (isSameAddress(address, ADDRESSES[chainId].LinearCurve)) {
    return 'linear';
  }

  if (isSameAddress(address, ADDRESSES[chainId].ExponentialCurve)) {
    return 'exponential';
  }

  // if (isSameAddress(address, ADDRESSES.CPMM)) {
  //   return 'cpmm'
  // }

  throw new Error(`convertCurveAddressToType can't find the matching address: ${address}`);
}

export function formatGqlPool(chainId: SupportedChainId, pool: PairFragment): Pool {
  const {
    inventoryCount,
    lastSalePrice,
    poolType,
    spotPrice,
    tokenLiquidity,
    bondingCurveAddress,
    updatedAt,
    createdAt,
    delta,
    fee,
    erc20Contract,
    nftIdInventory,
    ...rest
  } = pool;
  return {
    ...rest,
    inventoryCount: Number(inventoryCount),
    lastSalePrice: lastSalePrice ? BigNumber.from(lastSalePrice) : null,
    delta: delta ? BigNumber.from(delta) : null,
    spotPrice: spotPrice ? BigNumber.from(spotPrice) : null,
    tokenLiquidity: tokenLiquidity ? BigNumber.from(tokenLiquidity) : null,
    createdAt: createdAt ? new Date(Number(createdAt) * 1000).toISOString() : null,
    updatedAt: updatedAt ? new Date(Number(updatedAt) * 1000).toISOString() : null,
    poolType: (poolType === '1' ? 'NFT' : poolType === '0' ? 'Token' : 'Trading') as PoolType,
    // TODO: Change token type based on erc20Contract (Address comes in WETH)
    token: 'ETH' as TokenValue,
    nftIdInventory: nftIdInventory?.map((id) => BigNumber.from(id)) || [],
    curveType: convertCurveAddressToType(chainId, bondingCurveAddress),
    original: pool,
    fee: fee ? BigNumber.from(fee) : null,
  };
}

export function formatGqlAmmPool(pool: AmmPoolFragment, includeNFTs?: boolean): AmmPool<true> | AmmPool<false> {
  const { token, liquidity, slot, fee, nfts, ...rest } = pool;
  return {
    ...rest,
    nfts: includeNFTs ? nfts : undefined,
    token: {
      ...token,
      decimals: Number(token.decimals),
    },
    liquidity: BigNumber.from(liquidity),
    slot: Number(slot),
    fee: Number(fee),
  };
}
