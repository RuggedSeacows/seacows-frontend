import React from 'react';
import styled from 'styled-components';
import { Button, Input, Space, Typography } from 'antd';
import { useTokenBalances } from 'src/hooks/web3/read/useTokenBalances';
import { formatEther } from 'ethers/lib/utils';
import { formatNumber } from 'src/utils/number';
import { TokenValue } from 'src/types';
import { SecondaryText } from '../Text';

interface Props {
  tokenType: TokenValue;
  amount: string;
  disabled?: boolean;
  setAmount: (amt: string) => unknown;
  allowAll?: boolean;
}

const StyledInput = styled(Input)`
  /* background: #191a1f; */
  border: 1px solid #2a2c33;
  border-radius: 2px;
`;

const BalanceBox = styled.div`
  display: flex;
  margin-top: 8px;
  gap: 8px;
`;

const { Text } = Typography;
export function TokenBalanceInput({ tokenType, amount, setAmount, disabled, allowAll = false }: Props) {
  const { tokenBalances } = useTokenBalances();

  const balance = tokenBalances[tokenType];

  const handleMaxClick = () => {
    if (balance) {
      setAmount(formatEther(balance.toString()));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  return (
    <div>
      <Space.Compact style={{ width: '100%' }}>
        <StyledInput
          placeholder="Input amount"
          suffix={tokenType}
          type="number"
          value={formatNumber(amount)}
          onChange={handleInputChange}
          min={0}
          disabled={disabled}
        />
        {allowAll ? (
          <Button type="ghost" style={{ color: '#4F75DD' }} onClick={handleMaxClick} disabled={disabled}>
            All
          </Button>
        ) : null}
      </Space.Compact>
      {balance ? (
        <BalanceBox>
          <SecondaryText>Balance:</SecondaryText>
          <Text>
            {formatNumber(formatEther(balance.toString()))} {tokenType}
          </Text>
        </BalanceBox>
      ) : (
        <BalanceBox>
          <SecondaryText>Balance is not found</SecondaryText>
        </BalanceBox>
      )}
    </div>
  );
}
