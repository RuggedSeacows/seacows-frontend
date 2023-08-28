import { metadataApi, supportedChainName } from 'src/utils/api';
import { useAccount } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { useConnectedNetwork } from '../useConnectedNetwork';

export function useUserTokens(collecton: string | undefined, user?: string) {
  const { chainId } = useConnectedNetwork();
  const { address } = useAccount();
  const account = user || address;
  const chainName = supportedChainName?.[chainId || 0];
  const nft = collecton?.toLowerCase();

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['api', 'getUserOwnedTokens', chainName, nft, account?.toLowerCase()],
    queryFn: () => {
      const isValidRequest = chainName && nft && account;
      if (!isValidRequest) {
        return Promise.resolve([]);
      }

      // TODO: Pagination
      return metadataApi.user.getUserTokens(chainName, account, nft).then((resp) =>
        (resp.tokens || []).map((t: any) => ({
          key: t.token.tokenId,
          image: t.token.image,
          name: t.token.name,
          rarity: t.token.rarityRank,
          tokenId: t.token.tokenId,
        })),
      );
    },
  });

  return {
    tokens,
    isLoading,
  };
}
