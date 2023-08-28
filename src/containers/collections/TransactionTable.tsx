import React, { useMemo } from 'react';
import { Button, Skeleton, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getEllipsisTxt } from 'src/utils/format';
import { formatNumber } from 'src/utils/number';
import { timeAgo } from 'src/utils/time';
import { usePoolDeposits, usePoolSwaps, usePoolWithdraws } from 'src/hooks';
import { getEtherscanLink } from 'src/utils/address';
import { useAccount } from 'wagmi';
import { Box } from './shared';

interface DataType {
  key: string;
  type: string;
  tokenAmount: number;
  token: string;
  nftAmount: number;
  account: string;
  timestamp: number;
}

const { Title, Text } = Typography;

const columns = (currentAccount: string | undefined): ColumnsType<DataType> => [
  {
    title: 'All',
    dataIndex: 'type',
    render: (value, record) => (
      <Button type="link" href={getEtherscanLink(5, `tx/${record.key}`)} target="_blank" rel="noopener noreferrer">
        {value}
      </Button>
    ),
    filters: [
      {
        text: 'All',
        value: 'All',
      },
      {
        text: 'Swaps',
        value: 'Swap',
      },
      {
        text: 'Deposits',
        value: 'Deposit',
      },
      {
        text: 'Withdraws',
        value: 'Withdraw',
      },
    ],
    onFilter: (value, record) => (value === 'All' ? true : record.type.startsWith(String(value))),
  },
  {
    title: 'Token Amount',
    dataIndex: 'tokenAmount',
    render: (value, record) => <Text>{`${formatNumber(value, 4)} ${record.token}`}</Text>,
    sorter: (a, b) => a.tokenAmount - b.tokenAmount,
  },
  {
    title: 'NFT Quantity',
    dataIndex: 'nftAmount',
    render: (value) => <Text>{value}</Text>,
    sorter: (a, b) => a.nftAmount - b.nftAmount,
  },
  {
    title: 'Account',
    dataIndex: 'account',
    render: (value) => (
      <a href={getEtherscanLink(5, `address/${value}`)} target="_blank" rel="noopener noreferrer">
        {currentAccount && currentAccount.toLowerCase() === value.toLowerCase() ? 'You' : getEllipsisTxt(value, 6)}
      </a>
    ),
  },
  {
    title: 'Time',
    dataIndex: 'timestamp',
    render: (value) => <Text>{timeAgo.format(value)}</Text>,
    sorter: (a, b) => a.timestamp - b.timestamp,
  },
];

interface Props {
  collection: string;
}

function getTransactionType(collection: string, token: string, type: string) {
  if (type === 'Buy') {
    return `Swap ${token} for ${collection}`;
  }
  if (type === 'Sell') {
    return `Swap ${collection} for ${token}`;
  }

  if (type) {
    return `${type} ${collection} and ${token}`;
  }
  return '';
}

export function TransactionTable({ collection }: Props) {
  const { swaps, isLoading: swapLoading } = usePoolSwaps(collection);
  const { deposits, isLoading: depositLoading } = usePoolDeposits(collection);
  const { withdraws, isLoading: withdrawLoading } = usePoolWithdraws(collection);
  const { address } = useAccount();

  const swapData = useMemo(
    () =>
      swaps.map((swap) => ({
        key: swap.id,
        type: getTransactionType(swap.pool.collection.symbol, swap.token.symbol, swap.type),
        tokenAmount: swap.tokenAmount,
        token: swap.token.symbol,
        nftAmount: swap.nftAmount,
        account: swap.origin,
        timestamp: swap.timestamp * 1000,
      })),
    [swaps],
  );

  const depositData = useMemo(
    () =>
      deposits.map((mint) => ({
        key: mint.id,
        type: getTransactionType(mint.collection.symbol, mint.token.symbol, 'Deposit'),
        tokenAmount: mint.tokenAmount,
        token: mint.token.symbol,
        nftAmount: mint.nftAmount,
        account: mint.origin,
        timestamp: mint.timestamp * 1000,
      })),
    [deposits],
  );

  const withdrawData = useMemo(
    () =>
      withdraws.map((burn) => ({
        key: burn.id,
        type: getTransactionType(burn.collection.symbol, burn.token.symbol, 'Withdraw'),
        tokenAmount: burn.tokenAmount,
        token: burn.token.symbol,
        nftAmount: burn.nftAmount,
        account: burn.origin,
        timestamp: burn.timestamp * 1000,
      })),
    [withdraws],
  );

  const data = useMemo(() => {
    const combined = [...swapData, ...depositData, ...withdrawData];
    combined.sort((a, b) => b.timestamp - a.timestamp);
    return combined;
  }, [depositData, swapData, withdrawData]);

  return (
    <Box>
      <Title level={4}>Transactions</Title>
      <Skeleton active loading={swapLoading || depositLoading || withdrawLoading} paragraph>
        <Table columns={columns(address)} dataSource={data} />
      </Skeleton>
    </Box>
  );
}
