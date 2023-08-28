import type { PoolType, CurveType, TokenValue } from 'src/types';
import { BigNumber, constants } from 'ethers';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { parseEther } from 'ethers/lib/utils';
import { ADDRESSES, getTokenAddress } from 'src/app/config';
import SeacowsPairFactoryAbi from 'src/abis/SeacowsPairFactory.json';
import { useConnectedNetwork } from '../useConnectedNetwork';

/**
 * Creates an ETH pair contract using EIP-1167.
 * `Other params`:
 *
 * @see _assetRecipient The address that will receive the assets traders give during trades. If set to address(0), assets will be sent to the pool address.
 * Not available to TRADE pools.
 * @see _fee The fee taken by the LP in each trade. Can only be non-zero if _poolType is Trade.
 *
 * @param nft The NFT contract of the collection the pair trades
 * @param curveType Pair curve type - cpmm | linear | exponential
 * @param poolType Pool type - Token | NFT | Trading
 * @param delta The delta value used by the bonding curve. The meaning of delta depends on the specific curve.
 * @param spot The initial selling spot price
 * @param nftIDs The list of IDs of NFTs to transfer from the sender to the pair
 * @param token Token type - ETH | USDT | USDC
 * @param initialTokenBalance ERC20 token amount to send initially. ONLY available for ERC20 pair. Use 0 for ETH pair
 * @returns
 */
function useCreatePair(
  nft: string | undefined,
  curveType: CurveType | undefined,
  poolType: PoolType | undefined,
  delta: string | number | undefined,
  spot: string | number | undefined,
  nftIDs: number[],
  token: TokenValue | undefined,
  initialTokenBalance: BigNumber,
) {
  const { chainId } = useConnectedNetwork();
  const isETHPair = token === 'ETH';
  const bondingCurve = !chainId
    ? undefined
    : curveType === 'linear'
    ? ADDRESSES[chainId].LinearCurve
    : ADDRESSES[chainId].ExponentialCurve;

  const argPoolType = poolType === 'Token' ? 0 : poolType === 'NFT' ? 1 : 2;

  const argDelta = parseEther((delta || 0).toString());
  const argSpot = parseEther((spot || 0).toString());
  const ethPairArgs = [nft, bondingCurve, constants.AddressZero, argPoolType, argDelta, 0, argSpot, nftIDs];
  const ethPairEnabled =
    !!chainId && !!nft && nft !== constants.AddressZero && nftIDs.length > 0 && argDelta.gt(0) && argSpot.gt(0);

  const erc20Token = getTokenAddress(chainId, token);
  const erc20PairArgs = [
    {
      token: erc20Token,
      nft,
      bondingCurve,
      assetRecipient: constants.AddressZero,
      poolType: argPoolType,
      delta: argDelta,
      fee: 0, // TODO: Reconsider fee for trading pair
      spotPrice: argSpot,
      initialNFTIDs: nftIDs,
      initialTokenBalance,
    },
  ];
  const erc20PairEnabled = ethPairEnabled && (poolType !== 'Trading' || initialTokenBalance?.gt(0)) && !!erc20Token;

  const functionName = isETHPair ? 'createPairETH' : 'createPairERC20';
  const args = isETHPair ? ethPairArgs : erc20PairArgs;
  const enabled = isETHPair ? ethPairEnabled : erc20PairEnabled;

  // console.log('useCreatePair', { enabled, args });
  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: chainId ? ADDRESSES[chainId].SeacowsPairERC721Factory : undefined,
    abi: SeacowsPairFactoryAbi,
    functionName,
    args,
    enabled,
  });

  const { data, error, isError, write: createPair } = useContractWrite(config);
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return {
    createPair,
    isLoading,
    isSuccess,
    hash: data?.hash,
    hasError: isPrepareError || isError,
    error: (prepareError || error)?.message,
  };
}

export default useCreatePair;
