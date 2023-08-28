/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { SupportedChainId } from 'src/app/config';
import { getAMMPositions } from 'src/graphql/amm';
import { useAccount } from 'wagmi';
import { AmmPool, AmmPosition } from 'src/types';
import { useQuery } from '@tanstack/react-query';
import { useConnectedNetwork } from '../useConnectedNetwork';
import { useAmmPoolBalances, usePositionSlots } from '../web3';
import { useCollectionAMMPools } from './useAMMPools';

// Return created Seacow AMM positions owned by the connected wallet, or for certain slot ids
// TODO: Pagination
export function useAMMPositions(onlyOwner: boolean, slotIds?: string[]) {
  const { address } = useAccount();
  const { chainId } = useConnectedNetwork();
  const owner = onlyOwner ? address?.toLowerCase() : undefined;
  const { data: positions = [], isLoading } = useQuery({
    queryKey: ['subgraph', 'getAMMPositionsByOwnerOrSlotIds', chainId, owner, slotIds?.join(',')],
    queryFn: () => {
      if (!chainId) {
        throw new Error('No network connected');
      }

      if (!owner && !slotIds) {
        throw new Error('useAMMPositions: either `owner` or `slotIds` is necessary');
      }

      return getAMMPositions(chainId as SupportedChainId, {
        where: {
          owner,
          slotIds,
        },
      });
    },
  });

  return {
    positions,
    isLoading,
  };
}

export function useAMMPositionDetails(collection: string, networkId: number, onlyOwner: boolean) {
  const { pools, isLoading: loading3 } = useCollectionAMMPools(collection, networkId, false);
  const slotIds = pools.map((p) => p.slot.toString());

  const { positions, isLoading: loading1 } = useAMMPositions(onlyOwner, slotIds);

  // console.log('useAMMPositionDetails', positions, pools);

  const args = positions.map((pos) => ({
    pool: pos.pool.id,
    collection: pos.pool.collection.id,
    token: pos.pool.token.id,
  }));

  const { balances, isLoading: loading4 } = useAmmPoolBalances(args);

  const result: Array<AmmPosition & { collectionBalance: number; tokenBalance: number }> = [];

  if (args.length === balances.length) {
    for (let i = 0; i < balances.length; i += 1) {
      result.push({
        ...positions[i],
        ...balances[i],
      });
    }
  } else {
    console.error('useAmmPoolBalances do not match', args, balances);
  }

  return {
    positions: result,
    isLoading: loading1 || loading3 || loading4,
  };
}
