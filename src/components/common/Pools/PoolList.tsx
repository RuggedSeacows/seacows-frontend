import React from 'react';
import { Button, Skeleton, Table, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { formatNumber } from 'src/utils/number';
import { useRouter } from 'next/router';
import { TokenValue } from 'src/types';
import styled from 'styled-components';
import { PlusOutlined } from '@ant-design/icons';
import { getTokenAddress } from 'src/app/config';
import { useAmmPoolBalances, useCollections } from 'src/hooks';
import { TokenIcon } from '../Token/TokenIcon';

const { Text } = Typography;

interface DataType {
  key: string;
  collection: {
    id: string;
    name: string;
    image: string | null;
  };
  price: number;
  token: TokenValue;
  assets: number;
  liquidity: number;
  dayChange: number;
  dayVolume: number;
  weekChange: number;
  weekVolume: number;
  apr: number;
  active: boolean;
}

const Flex = styled.div`
  display: 'flex';
  align-items: 'center';
`;

const columns = (push: ReturnType<typeof useRouter>['push']): ColumnsType<DataType> => [
  {
    title: 'Collection',
    dataIndex: 'collection',
    align: 'left',
    render: (_, record) => (
      <Flex>
        {record.collection.image ? (
          <img
            src={record.collection.image}
            alt={record.collection.name}
            style={{ width: 36, marginRight: 10, borderRadius: 4 }}
          />
        ) : (
          <Skeleton.Node active style={{ width: 36, height: 36, marginRight: 10, borderRadius: 4 }} />
        )}

        {record.collection.name}
      </Flex>
    ),
  },
  {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price,
    sortDirections: ['ascend', 'descend'],
    align: 'left',
    render: (text, record) => (
      <Flex>
        <TokenIcon token={record.token} /> {formatNumber(text)}
      </Flex>
    ),
  },
  {
    title: 'Number/Assets',
    dataIndex: 'assets',
    sorter: (a, b) => a.assets - b.assets,
    sortDirections: ['ascend', 'descend'],
    align: 'left',
    render: (text, record) => (
      <Flex>
        <span style={{ marginRight: 8 }}>{text}</span>/<TokenIcon token={record.token} />{' '}
        {formatNumber(record.liquidity)}
      </Flex>
    ),
  },
  {
    title: '1D Change',
    dataIndex: 'dayChange',
    sorter: (a, b) => a.dayChange - b.dayChange,
    sortDirections: ['ascend', 'descend'],
    align: 'left',
    render: (text) => <Text>{formatNumber(text, 2)} %</Text>,
  },
  {
    title: '1D Volume',
    dataIndex: 'dayVolume',
    sorter: (a, b) => a.dayVolume - b.dayVolume,
    sortDirections: ['ascend', 'descend'],
    align: 'left',
    render: (text, record) => (
      <Flex>
        <TokenIcon token={record.token} /> {formatNumber(text)}
      </Flex>
    ),
  },
  {
    title: '7D Change',
    dataIndex: 'weekChange',
    sorter: (a, b) => a.weekChange - b.weekChange,
    sortDirections: ['ascend', 'descend'],
    align: 'left',
    render: (text) => <Text>{formatNumber(text, 2)} %</Text>,
  },
  {
    title: '7D Volume',
    dataIndex: 'weekVolume',
    sorter: (a, b) => a.weekVolume - b.weekVolume,
    sortDirections: ['ascend', 'descend'],
    align: 'left',
    render: (text, record) => (
      <Flex>
        <TokenIcon token={record.token} /> {formatNumber(text)}
      </Flex>
    ),
  },
  {
    title: 'APR',
    dataIndex: 'apr',
    sorter: (a, b) => a.apr - b.apr,
    sortDirections: ['ascend', 'descend'],
    align: 'left',
    render: (text, record) => <Text style={{ whiteSpace: 'pre' }}>{`${formatNumber(text, 3)}%`}</Text>,
  },
  {
    title: 'Active',
    dataIndex: 'active',
    align: 'right',
    render: (text, record) => (
      <Button
        type="ghost"
        icon={<PlusOutlined />}
        style={{ color: '#4F75DD' }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          push(`/collections/${record.collection.id}#deposit`);
        }}
      >
        Add liquidity
      </Button>
    ),
  },
];

interface Props {
  pools: {
    id: string;
    collection: {
      id: string;
      name: string;
      image: string | null;
    };
    apr: number;
    token: string;
    liquidity: number;
    day: {
      change: number;
      volume: number;
    };
    price: number;
    week: {
      change: number;
      volume: number;
    };
  }[];
}

export function PoolList({ pools }: Props) {
  const { push } = useRouter();
  const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('PoolList onChange', pagination, filters, sorter, extra);
  };

  const collections = Array.from(new Set(pools.map((p) => p.collection.id)));
  const { collectionDict } = useCollections(collections);
  const { balances } = useAmmPoolBalances(
    pools.map((p) => ({
      collection: p.collection.id,
      token: p.token,
      pool: p.id,
    })),
  );

  const data: DataType[] = pools.map((p, index) => ({
    key: p.id,
    collection: {
      ...p.collection,
      image: collectionDict[p.collection.id.toLowerCase()]?.logo,
    },
    token: p.token.toLowerCase() === getTokenAddress(5, 'USDT') ? 'USDT' : 'ETH',
    liquidity: p.liquidity,
    assets: balances[index]?.collectionBalance || 0,
    price: p.price,
    apr: p.apr,
    dayChange: p.day.change,
    dayVolume: p.day.volume,
    weekChange: p.week.change,
    weekVolume: p.week.volume,
    active: true,
  }));

  return (
    <Table
      columns={columns(push)}
      dataSource={data}
      rowClassName="pool-table-row"
      onChange={onChange}
      onRow={(record, rowIndex) => ({
        onClick: (event) => {
          push(`/collections/${record.collection.id}`);
        },
      })}
    />
  );
}
