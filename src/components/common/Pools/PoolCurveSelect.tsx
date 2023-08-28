import React from 'react';
import { Select, SelectProps, Space } from 'antd';
import { CPMMIcon } from 'src/components/icons/CPMMIcon';
import { ExponentialIcon } from 'src/components/icons/ExponentialIcon';
import { LinearIcon } from 'src/components/icons/LinearIcon';
import { CurveType } from 'src/types';

const { Option } = Select;
const CurveOptions: Record<CurveType, { value: string; label: string; icon: React.ReactNode }> = {
  cpmm: {
    value: 'cpmm',
    label: 'CPMM',
    icon: <CPMMIcon />,
  },
  linear: {
    value: 'linear',
    label: 'Linear',
    icon: <LinearIcon />,
  },
  exponential: {
    value: 'exponential',
    label: 'Exponential',
    icon: <ExponentialIcon />,
  },
};

interface Props extends SelectProps {
  value?: CurveType;
  curveTypes?: CurveType[];
  onChange?: (curve?: CurveType) => unknown;
}

export function PoolCurveSelect({ value, onChange, curveTypes = ['linear', 'exponential', 'cpmm'], ...rest }: Props) {
  return (
    <Select
      {...rest}
      style={{ width: '100%' }}
      placeholder="Select Curve type"
      onChange={onChange}
      optionLabelProp="label"
      value={value}
    >
      {curveTypes.map((curve) => (
        <Option value={CurveOptions[curve].value} label={CurveOptions[curve].label} key={curve}>
          <Space align="center">
            <span role="img" aria-label={CurveOptions[curve].label}>
              {CurveOptions[curve].icon}
            </span>
            <span>{CurveOptions[curve].label}</span>
          </Space>
        </Option>
      ))}
    </Select>
  );
}
