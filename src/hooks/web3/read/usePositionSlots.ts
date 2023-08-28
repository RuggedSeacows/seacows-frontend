import SeacowsPositionManagerAbi from '@yolominds/seacows-sdk/abis/amm/SeacowsPositionManager.json';
import { BigNumber } from 'ethers';
import { AMM_ADDRESSES } from 'src/app/config';
import { useConnectedNetwork } from 'src/hooks/useConnectedNetwork';
import { Address, useContractReads } from 'wagmi';

export function usePositionSlots(tokenIds: string[]) {
  const { chainId } = useConnectedNetwork();
  const operator = chainId === 5 ? AMM_ADDRESSES[chainId].manager : undefined;

  const { data, isLoading, isError } = useContractReads({
    contracts: (tokenIds || []).map((tokenId) => ({
      address: operator as Address,
      abi: SeacowsPositionManagerAbi,
      functionName: 'slotOf',
      args: [BigNumber.from(tokenId)],
    })),
    enabled: !!operator,
    watch: true,
  });

  return {
    slots: data ? data.filter((t) => !!t).map((t) => BigNumber.from(t).toString()) : undefined,
    isLoading,
    isError,
  };
}
