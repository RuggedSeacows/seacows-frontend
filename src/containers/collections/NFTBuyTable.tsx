import type { PoolType, TokenValue } from 'src/types';
import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PoolTypeIcon } from 'src/components/common/Pools/PoolTypeIcon';
import { TokenIcon } from 'src/components/common/Token/TokenIcon';

interface DataType {
  key: string;
  name: string;
  image: string;
  tokenId: string;
  price: {
    value?: number;
    token: TokenValue;
  };
  lastSale: {
    value?: number;
    token: TokenValue;
  };
  poolType: PoolType;
  rarity: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Token',
    dataIndex: 'name',
    render: (_, record, __) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={record.image} alt={record.name} style={{ width: 50, marginRight: 8 }} />
        {record.name}
      </div>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    render: (text, record, __) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TokenIcon token={record.price.token} />
        {record.price?.value?.toFixed(2)}
      </div>
    ),
  },
  {
    title: 'Pool',
    dataIndex: 'poolType',
    render: (_, record, __) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PoolTypeIcon type={record.poolType} />
        {record.poolType}
      </div>
    ),
  },
  {
    title: 'Last Sale',
    dataIndex: 'lastSale',
    render: (text, record, __) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TokenIcon token={record.lastSale.token} />
        {record.lastSale?.value?.toFixed(2)}
      </div>
    ),
  },
  {
    title: 'Rarity',
    dataIndex: 'rarity',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    render: () => '1',
  },
];

interface Props {
  data: DataType[];
  selectedRowKeys: string[];
  setSelectedRowKeys: (keys: string[]) => unknown;
}

export function NFTBuyTable({ data, selectedRowKeys, setSelectedRowKeys }: Props) {
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys as string[]);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
}
