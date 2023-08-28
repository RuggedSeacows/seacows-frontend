/* eslint-disable no-restricted-syntax */
import { Switch, Select, Typography, Space, Button, Skeleton } from 'antd';
import React from 'react';
import { shallow } from 'zustand/shallow';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { NFTCardBox } from 'src/components/common/NFT/NFTCardBox';
import { Collection } from '@yolominds/metadata-service-api';
import { useCollectionPoolTokens } from 'src/hooks/api/usePools';
import {
  buyPoolFilterOptions,
  filterData,
  placeholderNFTs,
  placeholderStyle,
  priceSortOptions,
  sortData,
} from './const';
import { Toolbar, View, ListBox } from './CollectionBuyView.styled';
import { NFTBuyTable } from './NFTBuyTable';
import { useCollectionViewStore } from './store';
import { useCartStore } from '../cart/store';

interface Props {
  collection: Collection;
}

const { Text } = Typography;

export function CollectionBuyView({ collection }: Props) {
  const [mode, setMode] = React.useState<'list' | 'table'>('list');
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [priceSort, setPriceSort] = React.useState<string>(priceSortOptions[0].value);
  const [poolFilter, setPoolFilter] = React.useState<string>(buyPoolFilterOptions[0].value);
  const searchID = useCollectionViewStore((state) => state.searchID);
  const { pooledTokens, isLoading } = useCollectionPoolTokens(collection.address, collection.networkId);
  const [fillItemsToCart, addItemToCart, removeItemFromCart, setCartOpen] = useCartStore(
    (state) => [state.fillItemsToCart, state.addItemToCart, state.removeItemFromCart, state.setCartOpen],
    shallow,
  );

  const handleSwitchChange = (checked: boolean) => {
    setMode(checked ? 'list' : 'table');
  };

  const handlePriceSortChange = (value: string) => {
    setPriceSort(value);
  };

  const handlePoolFilterChange = (value: string) => {
    setPoolFilter(value);
  };

  const processedTokens = React.useMemo(
    () =>
      filterData(
        // @ts-ignore
        sortData(searchID ? pooledTokens.filter((nft) => nft.tokenId === searchID) : pooledTokens, priceSort),
        poolFilter,
      ),
    [searchID, priceSort, poolFilter, pooledTokens],
  );

  const addToCart = (nft: typeof processedTokens[number], add: boolean) => {
    // TODO: CollectionBuyView component is [REDACTED] as of May, 2023
    // if (add) {
    //   if (!nft.price.value) {
    //     throw new Error(`Selected NFT does not have price: ${nft.tokenId}`);
    //   }

    //   addItemToCart({
    //     collection: collection.address,
    //     image: nft.image,
    //     tokenId: nft.tokenId,
    //     pool: nft.pool,
    //     price: nft.price.value,
    //   });
    // } else {
    //   removeItemFromCart(nft.tokenId);
    // }
  };

  React.useEffect(() => {
    setCartOpen(true);
  }, [setCartOpen]);

  return (
    <View>
      <Toolbar>
        <Select value={priceSort} onChange={handlePriceSortChange} options={priceSortOptions} />
        <Select value={poolFilter} onChange={handlePoolFilterChange} options={buyPoolFilterOptions} />
        <Switch
          unCheckedChildren={<BarsOutlined />}
          checkedChildren={<AppstoreOutlined />}
          defaultChecked
          onChange={handleSwitchChange}
        />
      </Toolbar>
      {!!searchID && processedTokens.length === 0 ? (
        <Space direction="vertical" align="center" size="large" style={{ paddingTop: 32 }}>
          <Text>No NFTs found for this search.</Text>
          <Button type="primary">Back to all NFTs</Button>
        </Space>
      ) : mode === 'list' ? (
        <ListBox>
          {isLoading
            ? placeholderNFTs.map((_, index) => <Skeleton.Image key={index} active style={placeholderStyle} />)
            : processedTokens.map((nft, index) => (
                <NFTCardBox
                  key={index}
                  data={nft}
                  checked={selected[nft.tokenId]}
                  style={{ width: 240 }}
                  onChecked={(checked) => {
                    setSelected((cs) => ({ ...cs, [nft.tokenId]: checked }));
                    addToCart(nft, checked);
                  }}
                  attributes={[]}
                  poolType={nft.poolType}
                />
              ))}
        </ListBox>
      ) : (
        <NFTBuyTable
          data={processedTokens}
          selectedRowKeys={Object.keys(selected).filter((key) => selected[key] === true)}
          setSelectedRowKeys={(keys) =>
            setSelected((sels) => {
              console.log('setSelectedRowKeys', keys);
              const newSels = { ...sels };
              for (const key of keys) {
                newSels[key.toString()] = true;
              }
              return newSels;
            })
          }
        />
      )}
    </View>
  );
}
