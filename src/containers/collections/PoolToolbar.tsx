import { SweepBox } from 'src/components/common/Collection/SweepBox';
import React from 'react';
import { Button, Space, Typography } from 'antd';
import { formatNumber } from 'src/utils/number';
import { Toolbar } from './shared';

const { Text, Title } = Typography;

interface Props {
  showSweep?: boolean;
  currentPrice?: number;
  amount: number;
  maxAmount: number;
  onAmountChange: (value: number) => unknown;
  cta?: string;
  title?: string;
}
export function PoolToolbar({
  maxAmount,
  amount,
  onAmountChange,
  currentPrice,
  showSweep = true,
  cta = `The Pool's NFT`,
  title = 'Current Price',
}: Props) {
  return (
    <Toolbar>
      <Space direction="vertical">
        {currentPrice ? (
          <>
            <Text>{title}</Text>
            <Title level={3}>{`${formatNumber(currentPrice, 4)} ETH`}</Title>
          </>
        ) : (
          <div />
        )}
      </Space>

      <Space direction="horizontal">
        {showSweep && <SweepBox amount={amount} onAmountChange={(v) => onAmountChange(v || 0)} max={maxAmount} />}
        <Button>{cta}</Button>
      </Space>
    </Toolbar>
  );
}
