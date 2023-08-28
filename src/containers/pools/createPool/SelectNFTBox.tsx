/* eslint-disable no-restricted-syntax */
import styled from 'styled-components';
import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Space, Typography, Input, Switch, Skeleton } from 'antd';
import { useState } from 'react';
import { NFTCardBox } from 'src/components/common/NFT/NFTCardBox';
import { SweepBox } from 'src/components/common/Collection/SweepBox';
import { NFTTable } from './NFTTable';

const ToolBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 16px;
`;

const ListBox = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
`;

type SetSelectedCallback = (prevSels: Record<string, boolean>) => Record<string, boolean>;

interface Props {
  className?: string;
  tokens: Array<{
    key: string;
    image: string;
    tokenId: string;
    name: string;
    rarity: number;
  }>;
  tokenLoading?: boolean;
  selected: Record<string, boolean>;
  setSelected: (sels: Record<string, boolean> | SetSelectedCallback) => unknown;
  onSearch: (tokenId: string) => unknown;
}

const data = Array(10)
  .fill(0)
  .map((v, index) => ({
    key: index.toString(),
    image: `https://via.placeholder.com/125?text=${index}`,
    tokenId: (index + 1).toString(),
    name: `Token ${index + 1}`,
    rarity: 100 - index,
  }));

const { Search } = Input;
export function SelectNFTBox({ className, tokens, tokenLoading, selected, setSelected, onSearch }: Props) {
  const [amount, setAmount] = useState(0);
  const [mode, setMode] = useState<'list' | 'table'>('list');

  const handleAmountChange = (newValue: number | null) => {
    setAmount(newValue || 0);
    const newSelected: Record<string, boolean> = {};
    for (let i = 0; i < (newValue || 0); i += 1) {
      newSelected[tokens[i].tokenId] = true;
    }
    setSelected(newSelected);
  };

  const handleIDSearch = (value: string) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setMode(checked ? 'list' : 'table');
  };

  const handleNFTSelectChange = (tokenId: string, checked: boolean) => {
    setSelected((cs) => ({ ...cs, [tokenId]: checked }));
  };

  return (
    <div className={className}>
      <Typography.Title level={4}>Select NFTs</Typography.Title>
      <ToolBox>
        <SweepBox amount={amount} onAmountChange={handleAmountChange} max={tokens.length} />
        <Space split="  " align="center">
          <Search placeholder="Search ID" allowClear onSearch={handleIDSearch} type="number" min={0} />
          <Switch
            unCheckedChildren={<BarsOutlined />}
            checkedChildren={<AppstoreOutlined />}
            defaultChecked
            onChange={handleSwitchChange}
          />
        </Space>
      </ToolBox>
      {mode === 'list' ? (
        <ListBox>
          {tokenLoading
            ? data.map((t, index) => <Skeleton.Image key={index} active />)
            : tokens.map((t, index) => (
                <NFTCardBox
                  key={index}
                  data={t}
                  checked={selected[t.tokenId]}
                  onChecked={(checked) => handleNFTSelectChange(t.tokenId, checked)}
                />
              ))}
          {}
        </ListBox>
      ) : (
        <Skeleton active loading={tokenLoading} paragraph>
          <NFTTable
            data={tokens}
            selectedRowKeys={Object.keys(selected).filter((index) => selected[index] === true)}
            setSelectedRowKeys={(keys) =>
              setSelected((sels) => {
                const newSels = { ...sels };
                for (const key of keys) {
                  newSels[key] = true;
                }
                return newSels;
              })
            }
          />
        </Skeleton>
      )}
    </div>
  );
}
