import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { AMM_ADDRESSES, getTokenAddress } from 'src/app/config';
import { TokenValue } from 'src/types';
import { Address, useAccount, useBalance, useContractReads, erc20ABI } from 'wagmi';
import { useConnectedNetwork } from '../../useConnectedNetwork';

// TODO: Check with Matt/Ben, and replace with actual addresses
const MOCK_ADDRESS = '0x1234' as Address;

export function useTokenBalances(account?: Address) {
  const { address } = useAccount();
  const { chainId } = useConnectedNetwork();

  const WETH_ADDRESS = chainId === 5 ? (AMM_ADDRESSES[chainId].weth as Address) : undefined;
  const USDT_ADDRESS = getTokenAddress(chainId, 'USDT');
  const USDC_ADDRESS = getTokenAddress(chainId, 'USDC');
  const accountToFetch = account || address;
  const {
    data: ethBalance,
    isLoading: ethBalanceLoading,
    isError: ethBalanceError,
  } = useBalance({
    address: accountToFetch,
    watch: true,
  });

  const {
    data: balances,
    isLoading,
    isError,
  } = useContractReads({
    contracts: accountToFetch
      ? [
          {
            address: WETH_ADDRESS,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [accountToFetch],
          },
          // {
          //   address: USDT_ADDRESS,
          //   abi: erc20ABI,
          //   functionName: 'balanceOf',
          //   args: [accountToFetch],
          // },
          // {
          //   address: USDC_ADDRESS,
          //   abi: erc20ABI,
          //   functionName: 'balanceOf',
          //   args: [accountToFetch],
          // },
        ]
      : [],
    watch: true,
  });

  const tokenBalances = useMemo(
    () =>
      ({
        ETH: ethBalance?.value,
        WETH: balances?.[0],
        // USDT: balances?.[1],
        // USDC: balances?.[2],
      } as Record<TokenValue, BigNumber | undefined>),
    [balances, ethBalance?.value],
  );

  return {
    tokenBalances,
    isLoading: ethBalanceLoading || isLoading,
    isError: ethBalanceError || isError,
  };
}
