import React from 'react';
import { InputNumber, Segmented, Slider, Space, Steps, Typography, Tooltip, Divider, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { formatEther } from 'ethers/lib/utils';
import { shallow } from 'zustand/shallow';
import { BigNumber } from 'ethers';
import { Step2List, WithdrawStepTitle, Flex } from './styled';
import { SecondaryText } from '../../components/common/Text';
import { useWithdrawTokenAmount } from './utils';
import { ButtonBox } from './CartAction.styled';
import { CartTable } from './CartBox.styled';
import { useCartStore } from './store';
import { CartActionSettings } from './CartAction';

interface Props {
  args: ReturnType<typeof useWithdrawTokenAmount>;
  onActionClick?: () => unknown;
  action: string;
  actionLoading?: boolean;
  actionDisabled?: boolean;
}

interface Step2Props {
  scheme: string;
  amount: number;
  args: Props['args'];
  setScheme: (v: string) => unknown;
}

interface Step3Props {
  depositToken: BigNumber;
  withdrawToken: BigNumber;
}

const Ticks = ['25%', '50%', '75%', 'Max'];
const { Text } = Typography;

const TickMap = {
  '25%': 25,
  '50%': 50,
  '75%': 75,
  Max: 100,
};
const WithdrawSchemes = ['Min', 'Max'];
const StepItems = [
  {
    title: 'Step 1',
  },
  {
    title: 'Step 2',
  },
  {
    title: 'Step 3',
  },
];

function WithdrawStep1() {
  const [tickOption, setTickOption] = React.useState<string>();
  const [amount, setWithdrawSettings] = useCartStore(
    (state) => [state.withdraw.percentage, state.setWithdrawSettings],
    shallow,
  );

  const onAmountChange = React.useCallback(
    (percentage: number | null) => setWithdrawSettings({ percentage: percentage ?? 0 }),
    [setWithdrawSettings],
  );

  const handleTickOptionChange = (tick: string) => {
    setTickOption(tick);
    if (onAmountChange) onAmountChange(tick ? (TickMap as any)[tick] || 0 : 0);
  };

  return (
    <>
      <WithdrawStepTitle>
        <span>Choose your withdraw percentage</span>
      </WithdrawStepTitle>
      <Space direction="horizontal" style={{ width: '100%', marginTop: 16 }}>
        <InputNumber min={0} max={100} value={amount} onChange={onAmountChange} style={{ width: 70 }} />
        <Segmented
          value={tickOption}
          options={Ticks}
          // @ts-ignore
          onChange={handleTickOptionChange}
        />
      </Space>

      <Slider defaultValue={0} style={{ width: '100%' }} min={0} max={100} value={amount} onChange={onAmountChange} />
    </>
  );
}

function WithdrawStep2({ scheme, amount, args, setScheme }: Step2Props) {
  const valueIndex = scheme === 'Min' ? 0 : 1;

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <WithdrawStepTitle>
        <span>Choose your withdraw</span>
        <span className="highlight"> {amount}% </span>
        <span>scheme.</span>
      </WithdrawStepTitle>

      <Step2List>
        <SecondaryText>Withdraw NFT</SecondaryText>
        <Space align="center" style={{ justifyContent: 'space-between' }}>
          <Text>Quantity ≈ {args.nftOutRange[valueIndex]}</Text>
          <Segmented
            value={scheme}
            options={WithdrawSchemes}
            // @ts-ignore
            onChange={setScheme}
          />
        </Space>
        <SecondaryText>Withdraw Token</SecondaryText>
        <Text>≈ {formatEther(args.tokenOutRange[valueIndex])} ETH</Text>
        <SecondaryText>
          Max Deposit Token{' '}
          <Tooltip
            placement="top"
            title="When the value of the withdrawal amount is higher than your LP position. You may be required to deposit additional tokens."
            arrow
            style={{ marginLeft: 8 }}
          >
            <InfoCircleOutlined />
          </Tooltip>
        </SecondaryText>
        <Text>≈ {formatEther(args.tokenInRange[valueIndex])} ETH</Text>
      </Step2List>
    </Space>
  );
}

function WithdrawStep3({ depositToken, withdrawToken }: Step3Props) {
  const [tokens, maxTokenLimit] = useCartStore(
    (state) => [state.items[state.type], state.withdraw.maxTokenLimit],
    shallow,
  );
  const [clearAllItems, clearItem] = useCartStore((state) => [state.clearAllItems, state.clearItem], shallow);

  return (
    <div style={{ width: '100%' }}>
      <Flex>
        <WithdrawStepTitle>
          <span>{`Select >= ${maxTokenLimit} NFTs`} </span>
          <Tooltip
            placement="top"
            title={`Select ≥ ${maxTokenLimit} NFTs. The withdrawn NFTs will be selected in sequence.`}
            arrow
            style={{ marginLeft: 8 }}
          >
            <InfoCircleOutlined />
          </Tooltip>
        </WithdrawStepTitle>
        <Button type="ghost" onClick={() => clearAllItems('withdraw')}>
          Clear All
        </Button>
      </Flex>

      {tokens.length > 0 ? (
        <CartTable style={{ width: '100%', marginTop: 16 }}>
          <thead>
            <tr>
              <th>
                <Text>NFT</Text>
              </th>
              <th>{/* <Text>Price</Text> */}</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t, index) => (
              <tr key={index}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={t.image} alt={t.tokenId} style={{ width: 32, marginRight: 8, borderRadius: 2 }} />
                    <Text>{`#${t.tokenId}`}</Text>
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Button
                    icon={<CloseCircleOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                    type="ghost"
                    onClick={() => clearItem(t)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </CartTable>
      ) : null}

      <Divider />
      <Step2List>
        <SecondaryText>Max Deposit Token</SecondaryText>
        <Text>≈ {formatEther(depositToken)} ETH</Text>
        <SecondaryText>Withdraw Token</SecondaryText>
        <Text>≈ {formatEther(withdrawToken)} ETH</Text>
      </Step2List>
    </div>
  );
}

export function WithdrawBox({ args, onActionClick, action: actionTitle, actionDisabled, actionLoading }: Props) {
  const [current, setCurrent] = React.useState(0);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [scheme, setScheme] = React.useState('Min');
  const [percentage, setWithdrawSettings] = useCartStore(
    (state) => [state.withdraw.percentage, state.setWithdrawSettings],
    shallow,
  );

  const onStepChange = React.useCallback(
    (value: number) => {
      setCurrent(value);

      setWithdrawSettings({
        step: value,
        maxTokenLimit: args.nftOutRange[scheme === 'Min' ? 0 : 1],
        maxTokenIn: args.tokenInRange[scheme === 'Min' ? 0 : 1],
      });
    },
    [args.nftOutRange, args.tokenInRange, scheme, setWithdrawSettings],
  );

  const action = () => {
    if (current === 2) {
      return {
        cta: actionTitle,
        disabled: actionDisabled,
        loading: actionLoading,
        onClick: onActionClick,
        icon: <CheckCircleOutlined />,
      };
    }

    return {
      cta: 'Next Step',
      disabled: !percentage,
      loading: false,
      onClick: () => onStepChange(current + 1),
    };
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Steps
        direction="horizontal"
        type="navigation"
        current={current}
        size="small"
        onChange={onStepChange}
        items={StepItems}
        style={{ marginBottom: 24 }}
      />
      {current === 0 ? (
        <WithdrawStep1 />
      ) : current === 1 ? (
        <WithdrawStep2 amount={percentage || 0} args={args} scheme={scheme} setScheme={setScheme} />
      ) : current === 2 ? (
        <WithdrawStep3
          depositToken={args.tokenInRange[scheme === 'Min' ? 0 : 1]}
          withdrawToken={args.tokenOutRange[scheme === 'Min' ? 0 : 1]}
        />
      ) : null}
      <Divider />
      {settingsOpen && <CartActionSettings />}
      <ButtonBox>
        <Button
          type="primary"
          style={{ flex: 1 }}
          disabled={action().disabled}
          loading={action().loading}
          onClick={action().onClick}
          icon={action().icon}
        >
          {action().cta}
        </Button>
        <Button
          type={settingsOpen ? 'default' : 'primary'}
          icon={<SettingOutlined />}
          onClick={() => setSettingsOpen(!settingsOpen)}
        />
      </ButtonBox>
    </Space>
  );
}
