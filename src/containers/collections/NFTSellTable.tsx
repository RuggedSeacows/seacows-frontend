import type { Pool } from 'src/types';
import React from 'react';
import Link from 'next/link';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PoolTypeIcon } from 'src/components/common/Pools/PoolTypeIcon';
import { TokenIcon } from 'src/components/common/Token/TokenIcon';
import { getEllipsisTxt } from 'src/utils/format';
import { formatBigNumber } from 'src/utils/number';

interface DataType {
  key: string;
  token: Pool['token'];
  pool: Pool['id'];
  volume: Pool['volume'];
  poolType: Pool['poolType'];
  price: Pool['spotPrice'];
}

const poolAddress = '0xFE735DB16AD8EA5F9895917ce632ef0B18C847ce';

const columns: ColumnsType<DataType> = [
  {
    title: 'Pool Address',
    dataIndex: 'pool',
    render: (pool, record, __) => <Link href={`/pools/${pool}`}>{getEllipsisTxt(pool, 6)}</Link>,
  },
  {
    title: 'Pool NFT Volume',
    dataIndex: 'volume',
    render: (_, record, __) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TokenIcon token={record.token} />
        {formatBigNumber(record.volume)}
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
    title: 'Price',
    dataIndex: 'price',
    render: (_, record, __) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TokenIcon token={record.token} />
        {formatBigNumber(record.price)}
      </div>
    ),
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: () => <Button type="link">Sell</Button>,
  },
];

interface Props {
  pools: Pool[];
}

export function NFTSellTable({ pools = [] }: Props) {
  // const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
  //   const dataMap: Record<string, number> = {};
  //   for (let i = 0; i < data.length; i += 1) {
  //     dataMap[data[i].key] = i;
  //   }

  //   setSelectedRowKeys(newSelectedRowKeys.map((k) => dataMap[k.toString()]));
  // };

  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange,
  // };

  const data = pools.map((p) => ({
    key: p.id,
    token: p.token,
    pool: p.id,
    volume: p.volume,
    price: p.spotPrice,
    poolType: p.poolType,
  }));

  return (
    <div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
