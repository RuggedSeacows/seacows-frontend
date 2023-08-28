import { Slider, Typography } from 'antd';
import { shallow } from 'zustand/shallow';
import { SecondaryText } from 'src/components/common/Text';
import React from 'react';
import { calculateExponentialPoints, calculateLinearPoints } from 'src/utils/curve';
import { useCreatePoolStore } from './store';

interface Props {
  className?: string;
}

const numPoints = 20;

export function NFTCounterBox({ className }: Props) {
  const [estimate, setEstimate] = React.useState('0');
  const poolType = useCreatePoolStore((state) => state.poolType);
  const [startPrice, delta, curveType] = useCreatePoolStore(
    (state) => [state.startPrice, state.delta, state.curveType],
    shallow,
  );

  const handleSliderChange = (newValue: number) => {
    const values =
      curveType === 'linear'
        ? calculateLinearPoints(startPrice || 0, delta || 0, numPoints)
        : curveType === 'exponential'
        ? calculateExponentialPoints(startPrice || 0, delta || 0, numPoints)
        : [];

    const pair = values.find(([x]) => x === newValue);
    setEstimate((pair?.[1] || 0).toFixed(3).toString());
  };

  return (
    <div className={className}>
      <Typography.Title level={4}>
        {poolType === 'NFT'
          ? 'Selling NFTs'
          : poolType === 'Token'
          ? 'Buying NFTs'
          : poolType === 'Trading'
          ? 'Total number of NFTs'
          : null}
      </Typography.Title>

      <Slider
        defaultValue={0}
        max={numPoints}
        min={0}
        marks={{ 0: '0', [numPoints]: numPoints.toString() }}
        onChange={handleSliderChange}
      />
      <SecondaryText>You will receive</SecondaryText>
      <Typography.Text style={{ margin: '0 4px' }}>{estimate}</Typography.Text>
      <SecondaryText>eth.</SecondaryText>
    </div>
  );
}
