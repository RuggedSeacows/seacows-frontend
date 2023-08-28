import React from 'react';
import { Button, Divider, Input, Typography, Tooltip, Segmented, Space } from 'antd';
import {
  CheckCircleOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UpOutlined,
} from '@ant-design/icons';
import { SecondaryText } from 'src/components/common/Text';
import { shallow } from 'zustand/shallow';
import { formatNumber } from 'src/utils/number';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { Box, ButtonBox, ActionDetail, RoyaltyBox, SettingsBox, Row, WhiteInput } from './CartAction.styled';
import { PayTokenOptions, useCartStore } from './store';

interface Props {
  amount: number;
  totalPay: string;
  averagePrice: string;
  payToken: string;
  tokenBalance?: BigNumber;

  onActionClick?: () => unknown;
  action: string;
  actionLoading?: boolean;
  actionDisabled?: boolean;
}

const { Text } = Typography;

const SlippageOptions = ['Auto', 'Custom'];
const MAX_SLIPPAGE = 80;
const MAX_DEADLINE = 4320;

export function CartActionSettings() {
  const [slippageOption, setSlippageOption] = React.useState('Auto');
  const [slippageOpen, setSlippageOpen] = React.useState(false);
  const [deadlineOpen, setDeadlineOpen] = React.useState(false);
  const [slippageInput, setSlippageInput] = React.useState<number>(0);

  const settings = useCartStore((state) => state.settings);
  const setSettings = useCartStore((state) => state.setSettings);

  const handleDeadlineChange = (e: any) => {
    if (Number(e.target.value) <= MAX_DEADLINE) {
      setSettings({
        deadline: Number(e.target.value),
      });
    }
  };

  const handleSlippageChange = (e: any) => {
    if (Number(e.target.value) <= MAX_SLIPPAGE) {
      setSettings({
        slippage: Number(e.target.value),
      });
      setSlippageInput(Number(e.target.value));
    }
  };

  const handleSlippageModeChange = (mode: string) => {
    setSlippageOption(mode);

    if (mode === 'Auto') {
      setSettings({
        slippage: 'Auto',
      });
    } else if (slippageInput > 0) {
      setSettings({
        slippage: slippageInput,
      });
    }
  };

  return (
    <SettingsBox>
      <Row>
        <Space>
          <Text>Max Slippage</Text>
          <Tooltip
            placement="top"
            title="Your transaction will revert if the pricechanges unfavorably by more than this percentage."
            arrow
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
        <Button type="text" onClick={() => setSlippageOpen(!slippageOpen)}>
          {settings.slippage === 'Auto' ? 'Auto' : `${settings.slippage}%`}{' '}
          {!slippageOpen ? <DownOutlined /> : <UpOutlined />}
        </Button>
      </Row>
      {slippageOpen ? (
        <Row>
          <Segmented
            value={slippageOption}
            options={SlippageOptions}
            // @ts-ignore
            onChange={handleSlippageModeChange}
          />
          <Input
            suffix="%"
            disabled={slippageOption === 'Auto'}
            value={settings.slippage === 'Auto' ? 0 : settings.slippage}
            type="number"
            min={0}
            max={MAX_SLIPPAGE}
            onChange={handleSlippageChange}
          />
        </Row>
      ) : null}
      <Row>
        <Space>
          <Text>Transaction deadline</Text>
          <Tooltip
            placement="top"
            title="Your transaction will revert if it ispending for more than this period of time."
            arrow
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </Space>
        <Button type="text" onClick={() => setDeadlineOpen(!deadlineOpen)}>
          {`${settings.deadline}m`} {!deadlineOpen ? <DownOutlined /> : <UpOutlined />}
        </Button>
      </Row>
      {deadlineOpen ? (
        <Row>
          <Input
            suffix="minutes"
            value={settings.deadline}
            onChange={handleDeadlineChange}
            type="number"
            min={10}
            max={MAX_DEADLINE}
          />
        </Row>
      ) : null}
    </SettingsBox>
  );
}

export function CartAction({
  amount,
  totalPay,
  tokenBalance,
  payToken,
  averagePrice,
  action,
  onActionClick,
  actionLoading,
  actionDisabled,
}: Props) {
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [tokenOption, setTokenOption] = useCartStore((state) => [state.tokenOption, state.setTokenOption], shallow);
  const [cartType, token] = useCartStore((state) => [state.type, state.token], shallow);
  const isSwap = cartType === 'buy' || cartType === 'sell';
  const isSell = cartType === 'sell';
  const isWithdraw = cartType === 'withdraw';

  return (
    <div>
      <Divider />
      {isSwap ? (
        <>
          <RoyaltyBox>
            <SecondaryText style={{ flexShrink: 0 }}>Royalty Fee:</SecondaryText>
            <Input suffix="%" disabled />
          </RoyaltyBox>
          <Divider />
        </>
      ) : null}
      <Box>
        {!isSwap ? (
          <>
            <SecondaryText>Token</SecondaryText>
            <WhiteInput suffix={tokenOption} disabled value={totalPay} />
            {/* <Input suffix={token} disabled value={totalPay} /> */}
          </>
        ) : null}
        {!isWithdraw && (
          <ActionDetail>
            <SecondaryText>Selected:</SecondaryText>
            <Text>{amount}</Text>
          </ActionDetail>
        )}
        {settingsOpen ? (
          <CartActionSettings />
        ) : isSwap ? (
          <>
            <ActionDetail>
              <SecondaryText>Average Price:</SecondaryText>
              <Text>{`${formatNumber(averagePrice, 4)} ${tokenOption}`}</Text>
            </ActionDetail>
            <ActionDetail>
              <SecondaryText>You {isSell ? 'receive' : 'pay'}:</SecondaryText>
              <Text>{`${formatNumber(totalPay, 4)} ${tokenOption}`}</Text>
            </ActionDetail>
          </>
        ) : null}
        <ActionDetail>
          <SecondaryText>{isSell ? 'Receive' : 'Pay'} With:</SecondaryText>
          <Segmented
            value={tokenOption}
            // @ts-ignore
            options={PayTokenOptions}
            // @ts-ignore
            onChange={setTokenOption}
          />
        </ActionDetail>
        {isSwap ? (
          <ActionDetail>
            <SecondaryText>Balance:</SecondaryText>
            <Text>{`${formatNumber(formatEther(tokenBalance || '0'), 4)} ${tokenOption}`}</Text>
          </ActionDetail>
        ) : null}

        <ButtonBox>
          <Button
            type="primary"
            style={{ flex: 1 }}
            disabled={actionDisabled}
            loading={actionLoading}
            onClick={onActionClick}
            icon={<CheckCircleOutlined />}
          >
            {action}
          </Button>
          <Button
            type={settingsOpen ? 'default' : 'primary'}
            icon={<SettingOutlined />}
            // disabled={!isSwap}
            onClick={() => setSettingsOpen(!settingsOpen)}
          />
        </ButtonBox>
      </Box>
    </div>
  );
}
