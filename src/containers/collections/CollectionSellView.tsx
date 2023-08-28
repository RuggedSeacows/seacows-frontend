import React from 'react';
import { NFTCardBox } from 'src/components/common/NFT/NFTCardBox';
import { SweepBox } from 'src/components/common/Collection/SweepBox';
import { Collection } from '@yolominds/metadata-service-api';
import { useCollectionPools } from 'src/hooks/api/usePools';
import { Skeleton } from 'antd';
import { useUserTokens } from 'src/hooks/api/useUserTokens';
import { NFTSellTable } from './NFTSellTable';
import { ListBox, Toolbar } from './CollectionSellView.styled';
import { placeholderNFTs, placeholderStyle } from './const';

interface Props {
  collection: Collection;
}

export function CollectionSellView({ collection }: Props) {
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [amount, setAmount] = React.useState(0);
  const { pools, isLoading: poolsLoading } = useCollectionPools(collection.address, collection.networkId);

  const { tokens, isLoading } = useUserTokens(collection.address);

  const handleAmountChange = (newValue: number | null) => {
    setAmount(newValue || 0);
    const newSelected: Record<string, boolean> = {};
    for (let i = 0; i < (newValue || 0); i += 1) {
      newSelected[tokens[i].key] = true;
    }
    setSelected(newSelected);
  };

  return (
    <div>
      <Skeleton active loading={poolsLoading} paragraph>
        <NFTSellTable pools={pools} />
      </Skeleton>

      <Toolbar>
        <SweepBox amount={amount} onAmountChange={handleAmountChange} max={tokens.length} />
      </Toolbar>
      <ListBox>
        {isLoading
          ? placeholderNFTs.map((_, index) => <Skeleton.Image key={index} active style={placeholderStyle} />)
          : tokens.map((nft, index) => (
              <NFTCardBox
                key={index}
                data={nft}
                checked={selected[nft.tokenId]}
                style={{ width: 240 }}
                onChecked={(checked) => setSelected((cs) => ({ ...cs, [nft.tokenId]: checked }))}
                attributes={[]}
              />
            ))}
      </ListBox>
    </div>
  );
}
