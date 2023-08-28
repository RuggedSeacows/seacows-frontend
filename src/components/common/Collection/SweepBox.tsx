import React from 'react';
import styled from 'styled-components';
import { ClearOutlined } from '@ant-design/icons';
import { InputNumber, Slider } from 'antd';

const Box = styled.div`
  background: #222329;
  border-radius: 2px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
`;

interface Props {
  amount?: number;
  max?: number;
  onAmountChange?: (amount: number | null) => unknown;
}

export function SweepBox({ amount, max = 100, onAmountChange }: Props) {
  return (
    <Box>
      <ClearOutlined style={{ color: '#FFFFFF73', fontSize: 24 }} />
      <InputNumber min={0} max={100} value={amount} onChange={onAmountChange} />
      <Slider defaultValue={0} style={{ width: 158 }} min={0} max={max} value={amount} onChange={onAmountChange} />
    </Box>
  );
}
