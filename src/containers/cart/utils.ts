/* eslint-disable no-restricted-syntax */
/* eslint-disable no-empty */
import { shallow } from 'zustand/shallow';
import { BigNumber, constants, providers } from 'ethers';
import { getTokenInMax, getDepositTokenInMax, getWithdrawAssetsOutMin, getTokenOutMin } from '@yolominds/seacows-sdk';
import { useAccount } from 'wagmi';
import React from 'react';
import { useCollectionAMMPools, useConnectedNetwork, usePairReserves } from 'src/hooks';
import { BuyNote, getSlippageNumber, useCartStore } from './store';

export function useRouterBuyParams() {
  const [type, items, settings] = useCartStore((state) => [state.type, state.items, state.settings], shallow);

  if (type === 'buy') {
    const pairGrouped: Record<string, any> = {};
    const poolDetails: Record<string, BuyNote['pool']> = {};

    for (const item of items[type]) {
      if (item.pool && item.price) {
        poolDetails[item.pool.id] = item.pool;

        if (!pairGrouped[item.pool.id]) pairGrouped[item.pool.id] = [];

        pairGrouped[item.pool.id].push({
          tokenId: item.tokenId,
          price: item.price.value,
        });
      }
    }

    const pairs = [];
    const tokenIds = [];
    const amounts = [];
    const amountsToShow = [];
    for (const pool of Object.keys(pairGrouped)) {
      const ids = pairGrouped[pool].map((p: any) => BigNumber.from(p.tokenId));
      const { complementPrecision, fee, reserves, protocolFeePercent } = poolDetails[pool] || {};

      if (!complementPrecision || !fee || !reserves || !ids.length || !protocolFeePercent) {
        return {
          pairs: [],
          tokenIds: [],
          amounts: [],
          amountsToShow: [],
        };
      }

      const { tokenInMax, tokenInMaxWithSlippage } = getTokenInMax(
        ids,
        complementPrecision,
        reserves[0],
        reserves[1],
        BigNumber.from(0), // royaltyFeePercent
        BigNumber.from(protocolFeePercent),
        BigNumber.from(fee),
        BigNumber.from(10000),
        getSlippageNumber(settings.slippage),
        100,
      );

      amounts.push(tokenInMaxWithSlippage);
      amountsToShow.push(tokenInMax);
      pairs.push(pool);
      tokenIds.push(ids);
    }

    return {
      pairs,
      tokenIds,
      amounts,
      amountsToShow,
    };
  }

  return {
    pairs: [],
    tokenIds: [],
    amounts: [],
    amountsToShow: [],
  };
}

export function useRouterSellParams(): {
  pair: string;
  tokenOutMin: BigNumber;
  tokenOutMinWithSlippage: BigNumber;
  rate?: BigNumber;
} | null {
  const [type, items, slippage] = useCartStore((state) => [state.type, state.items, state.settings.slippage], shallow);
  const [setSellData] = useCartStore((state) => [state.setSellData], shallow);
  const { chainId = 5 } = useConnectedNetwork();

  const { collection } = items[type][0] || { collection: constants.AddressZero };
  const { pools } = useCollectionAMMPools(collection, chainId, false);
  const { data } = usePairReserves(pools.map((p) => p.id));

  if (type === 'sell') {
    const tokenIds = items[type].map((item) => BigNumber.from(item.tokenId));

    let bestPair: {
      pair: string;
      tokenOutMin: BigNumber;
      tokenOutMinWithSlippage: BigNumber;
      rate?: BigNumber;
    } | null = null;
    for (const pair of Object.keys(data)) {
      const { complementPrecision, fee, reserves, sellRate, protocolFeePercent } = data[pair];

      const { tokenOutMin, tokenOutMinWithSlippage } = getTokenOutMin(
        tokenIds as any,
        complementPrecision,
        reserves[0],
        reserves[1],
        BigNumber.from(0), // royaltyFeePercent
        BigNumber.from(protocolFeePercent),
        BigNumber.from(fee),
        BigNumber.from(10000),
        getSlippageNumber(slippage),
        100,
      );

      if (!bestPair) {
        bestPair = { pair, tokenOutMin, tokenOutMinWithSlippage, rate: sellRate };
      } else if (tokenOutMinWithSlippage.gt(bestPair.tokenOutMinWithSlippage)) {
        bestPair = { pair, tokenOutMin, tokenOutMinWithSlippage, rate: sellRate };
      }
    }

    setSellData({
      bestPair: bestPair?.pair,
      bestRate: bestPair?.rate,
      poolLength: pools.length,
    });

    return bestPair;
  }

  return null;
}

export function useDepositTokenAmount(alive: boolean, ids: BigNumber[]) {
  const { connector } = useAccount();
  const [pair, slippage] = useCartStore((state) => [state.pair?.address, state.settings.slippage], shallow);

  const [results, setResults] = React.useState<Awaited<ReturnType<typeof getDepositTokenInMax>>>({
    tokenInMax: BigNumber.from(0),
    tokenInMaxWithSlippage: BigNumber.from(0),
  });

  React.useEffect(() => {
    async function run() {
      if (!pair || !alive || !connector) {
        return;
      }

      const provider = await connector.getProvider();

      const tokenAmounts = await getDepositTokenInMax(
        pair,
        ids.map((id) => id.toNumber()),
        getSlippageNumber(slippage),
        100,
        new providers.Web3Provider(provider),
      );
      setResults(tokenAmounts);

      console.log(
        `slippage: ${slippage}`,
        tokenAmounts.tokenInMax.toString(),
        tokenAmounts.tokenInMaxWithSlippage.toString(),
      );
    }

    run();
  }, [alive, connector, ids, pair, slippage]);

  return results;
}

export function useWithdrawTokenAmount(alive: boolean, percentage: number) {
  const { connector } = useAccount();
  const [pair, slippage] = useCartStore((state) => [state.pair, state.settings.slippage], shallow);

  const [results, setResults] = React.useState<Awaited<ReturnType<typeof getWithdrawAssetsOutMin>>>({
    cTokenOutMin: BigNumber.from(0),
    cNftOutMin: BigNumber.from(0),
    tokenInRange: [BigNumber.from(0), BigNumber.from(0)],
    tokenOutRange: [BigNumber.from(0), BigNumber.from(0)],
    nftOutRange: [0, 0],
  });

  React.useEffect(() => {
    async function run() {
      const provider = await connector?.getProvider();

      if (!pair?.liquidity) return;
      console.log('withdraw', pair, percentage);

      const tokenAmounts = await getWithdrawAssetsOutMin(
        pair.address,
        pair.liquidity.mul(percentage).div(100),
        getSlippageNumber(slippage),
        100,
        new providers.Web3Provider(provider),
      );
      setResults(tokenAmounts);

      console.log(
        `withdraw slippage: ${slippage}`,
        tokenAmounts.cTokenOutMin.toString(),
        tokenAmounts.cNftOutMin.toString(),
        tokenAmounts.nftOutRange,
        tokenAmounts.tokenInRange,
        tokenAmounts.nftOutRange,
      );
    }

    if (alive && pair && connector && percentage > 0) {
      run();
    }
  }, [alive, connector, pair, percentage, slippage]);

  return results;
}
