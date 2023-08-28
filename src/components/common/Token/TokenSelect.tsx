import type { TokenValue } from 'src/types';
import React from 'react';
import { Select, SelectProps, Space } from 'antd';
import { TokenIcon } from './TokenIcon';

const { Option } = Select;

interface Props extends SelectProps {
  value?: TokenValue;
  onChange?: (v: TokenValue) => unknown;
}

export function TokenSelect({ value, onChange, ...rest }: Props) {
  return (
    <Select
      {...rest}
      style={{ width: '100%' }}
      placeholder="Select a token"
      onChange={onChange}
      optionLabelProp="label"
      value={value}
    >
      <Option value="ETH" label="Ether">
        <Space>
          <span role="img" aria-label="Ether">
            <TokenIcon token="ETH" alt="ETH" size={24} />
          </span>
          ETH
        </Space>
      </Option>
      {/* <Option value="USDT" label="Tether">
        <Space>
          <span role="img" aria-label="Tether">
            <TokenIcon token="USDT" alt="USDT" size={24} />
          </span>
          USDT
        </Space>
      </Option>
      <Option value="USDC" label="USD Coin">
        <Space>
          <span role="img" aria-label="USD Coin">
            <TokenIcon token="USDC" alt="USDC" size={24} />
          </span>
          USDC
        </Space>
      </Option> */}
    </Select>
  );
}
