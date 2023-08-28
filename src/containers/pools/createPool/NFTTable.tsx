import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  name: string;
  image: string;
  tokenId: string;
  rarity: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Token',
    dataIndex: 'name',
    render: (text, record, index) => (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={record.image} alt={record.name} style={{ width: 50, marginRight: 8 }} />
        {record.name}
      </div>
    ),
  },
  {
    title: 'Token Id',
    dataIndex: 'tokenId',
  },
  {
    title: 'Rarity',
    dataIndex: 'rarity',
  },
];

interface Props {
  data: DataType[];
  selectedRowKeys: string[];
  setSelectedRowKeys: (keys: string[]) => unknown;
}

export function NFTTable({ data, selectedRowKeys, setSelectedRowKeys }: Props) {
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys.map((k) => k.toString()));
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
