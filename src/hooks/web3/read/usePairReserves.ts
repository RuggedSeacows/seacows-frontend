import SeacowsERC721TradePairAbi from '@yolominds/seacows-sdk/abis/amm/SeacowsERC721TradePair.json';
import { BigNumber } from 'ethers';
import { Address, useContractReads } from 'wagmi';

type PairInfo = {
  nftReserve: BigNumber;
  tokenReserve: BigNumber;
  complement: BigNumber;
  protocolFeePercent: number;
  feePercent: number;
};

function getPairBuySellRates(info: PairInfo) {
  const { nftReserve, tokenReserve, complement, protocolFeePercent, feePercent } = info;

  /** Formula */
  // Sell HighestPrice = tokenOut * (1 - Protocol Fee Percent - Fee Percent)
  // tokenOut = (1 * tokenReserve) / (nftReserve + 1)

  // BuyPrice = tokenIn * (1 + Protocol Fee Percent + Fee Percent)
  // tokenIn = (1 * tokenReserve) / (nftReserve - 1)

  return {
    sell: tokenReserve
      .mul(100_00 - protocolFeePercent * 100 - feePercent)
      .div(nftReserve.add(complement))
      .mul(complement)
      .div(100_00),
    buy: tokenReserve
      .mul(100_00 + protocolFeePercent * 100 + feePercent)
      .div(nftReserve.sub(complement))
      .mul(complement)
      .div(100_00),
  };
}

export function usePairReserves(pairs: string[]) {
  const { data, isLoading, isError } = useContractReads({
    contracts: pairs
      .map((pair) => [
        {
          address: pair as Address,
          abi: SeacowsERC721TradePairAbi,
          functionName: 'getReserves',
          args: [],
        },
        {
          address: pair as Address,
          abi: SeacowsERC721TradePairAbi,
          functionName: 'feePercent',
          args: [],
        },
        {
          address: pair as Address,
          abi: SeacowsERC721TradePairAbi,
          functionName: 'COMPLEMENT_PRECISION',
          args: [],
        },
        {
          address: pair as Address,
          abi: SeacowsERC721TradePairAbi,
          functionName: 'protocolFeePercent',
          args: [],
        },
      ])
      .flat(),
    enabled: pairs.length > 0,
    watch: true,
  });

  const result: Record<
    string,
    {
      reserves: [BigNumber, BigNumber];
      fee: number;
      complementPrecision: BigNumber;
      protocolFeePercent: number;
      rate?: BigNumber;
      sellRate?: BigNumber;
      buyRate?: BigNumber;
    }
  > = {};
  for (let i = 0; i < pairs.length; i += 1) {
    if (pairs[i] && data) {
      const reserves = data[i * 4] as [BigNumber, BigNumber];
      const fee = Number(data[i * 4 + 1]);
      const complementPrecision = data[i * 4 + 2] as BigNumber;
      const rate =
        reserves && reserves.length >= 2 && reserves[1].gt(BigNumber.from(0))
          ? reserves[0].mul(complementPrecision).div(reserves[1])
          : undefined;

      const protocolFeePercent = data[i * 4 + 3] as BigNumber;
      const rates =
        reserves && reserves.length >= 2 && reserves[1].gt(BigNumber.from(0))
          ? getPairBuySellRates({
              tokenReserve: reserves[0],
              nftReserve: reserves[1],
              complement: complementPrecision,
              protocolFeePercent: Number(protocolFeePercent),
              feePercent: Number(fee),
            })
          : {
              sell: BigNumber.from(0),
              buy: BigNumber.from(0),
            };

      result[pairs[i]] = {
        reserves,
        fee: Number(protocolFeePercent),
        complementPrecision,
        protocolFeePercent: Number(protocolFeePercent),
        rate,
        buyRate: rates.buy,
        sellRate: rates.sell,
      };
    }
  }

  return {
    data: result,
    isLoading,
    isError,
  };
}
