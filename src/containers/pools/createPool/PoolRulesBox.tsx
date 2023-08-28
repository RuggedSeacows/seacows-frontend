/* eslint-disable no-restricted-syntax */
/* eslint-disable no-restricted-globals */
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';
import { Form, Input, Typography } from 'antd';

import React from 'react';
import { PoolCurveSelect } from 'src/components/common/Pools/PoolCurveSelect';
import { CurveType } from 'src/types';
import { useCreatePoolStore } from './store';

interface Props {
  title: string;
  className?: string;
  onChange?: (
    values: Partial<{
      startPrice: string;
      curveType: CurveType;
      delta: string;
    }>,
  ) => unknown;
}

const GridForm = styled(Form)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 24px;
  grid-row-gap: 24px;
`;

export function PoolRulesBox({ title, className, onChange }: Props) {
  const [form] = Form.useForm();
  const [token, poolType, startPrice, swapFee, curveType] = useCreatePoolStore(
    (state) => [state.token, state.poolType, state.startPrice, state.swapFee, state.curveType],
    shallow,
  );
  const setStartPrice = useCreatePoolStore((state) => state.setStartPrice);
  const setDelta = useCreatePoolStore((state) => state.setDelta);
  const setCurveType = useCreatePoolStore((state) => state.setCurveType);
  const setSwapFee = useCreatePoolStore((state) => state.setSwapFee);

  const onFormValueChanges = (changedValues: any, values: any) => {
    for (const [key, value] of Object.entries(changedValues)) {
      if (key === 'startPrice') {
        const sp = parseFloat(value as string);
        setStartPrice(isNaN(sp) ? 0 : sp);
      } else if (key === 'delta') {
        const sp = parseFloat(value as string);
        setDelta(isNaN(sp) ? 0 : sp);
      } else if (key === 'swapFee') {
        const fee = parseFloat(value as string);
        setSwapFee(isNaN(fee) ? 0 : fee);
      } else if (key === 'curveType') {
        setCurveType(value as CurveType);
      }
    }

    if (onChange) {
      onChange(values);
    }
  };

  const curveTypes: CurveType[] = React.useMemo(
    () => (poolType === 'Trading' ? ['linear', 'exponential', 'cpmm'] : ['linear', 'exponential']),
    [poolType],
  );

  return (
    <div className={className}>
      <Typography.Title level={4}>{title}</Typography.Title>
      <GridForm
        layout="vertical"
        form={form}
        initialValues={{ startPrice, swapFee, curveType }}
        onValuesChange={onFormValueChanges}
        style={{ width: '100%' }}
      >
        <Form.Item
          // label={`Start Price (Suggested: ${token === 'USDT' ? '100 USDT' : token === 'USDC' ? '100 USDC' : '2 ETH'})`}
          label="Start Price"
          tooltip="Base Price for each NFT in the pool."
          name="startPrice"
          rules={[
            { required: true, message: 'Please input the start price' },
            {
              validator: (_, value) =>
                Number(value) > 0 ? Promise.resolve() : Promise.reject(new Error('Start price must be bigger than 0')),
            },
          ]}
        >
          <Input placeholder="Input start price" suffix={token} type="number" />
        </Form.Item>
        <Form.Item label="Curve" tooltip="Pricing Curve to determine price behaviour." name="curveType">
          <PoolCurveSelect curveTypes={curveTypes} defaultValue="cpmm" disabled />
        </Form.Item>
        <Form.Item
          label="Swap Fee"
          name="swapFee"
          rules={[
            {
              validator: (_, value) =>
                Number(value) > 0 ? Promise.resolve() : Promise.reject(new Error('Swap Fee must be bigger than 0')),
            },
            { required: true, message: 'Please input the swap fee' },
          ]}
        >
          <Input placeholder="Input the swap fee" suffix="%" type="number" max={50} min={0} disabled />
        </Form.Item>
        {/* <Form.Item
          label="Delta"
          tooltip="Delta determines how the NFT price changes after each pool transactions."
          name="delta"
          rules={[
            {
              validator: (_, value) =>
                Number(value) > 0 ? Promise.resolve() : Promise.reject(new Error('Delta must be bigger than 0')),
            },
            { required: true, message: 'Please input the delta' },
          ]}
        >
          {curveType === 'exponential' ? (
            <Input placeholder="Input delta percentage" suffix="%" type="number" />
          ) : (
            <Input placeholder="Input delta amount" suffix={token} type="number" max={100} min={0} />
          )}
        </Form.Item> */}
      </GridForm>
    </div>
  );
}
