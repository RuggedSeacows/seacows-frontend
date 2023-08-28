import { Typography } from 'antd';
import dynamic from 'next/dynamic';
import debounce from 'lodash/debounce';
import { shallow } from 'zustand/shallow';
import React from 'react';
import { calculateExponentialPoints, calculateLinearPoints } from 'src/utils/curve';
import { useCreatePoolStore } from './store';

const Line = dynamic(() => import('@ant-design/charts').then(({ Line: PLine }) => PLine), { ssr: false });

interface Props {
  numPoints: number;
  className?: string;
}

const config = {
  data: [],
  xField: 'amount',
  yField: 'price',
  label: {},
  point: {
    size: 5,
    shape: 'diamond',
    style: {
      fill: 'white',
      stroke: '#5B8FF9',
      lineWidth: 2,
    },
  },
  yAxis: {
    tickCount: 5,
  },
  smooth: true,
  autoFit: true,
  tooltip: {
    showMarkers: false,
  },
  state: {
    active: {
      style: {
        shadowBlur: 4,
        stroke: '#000',
        fill: 'red',
      },
    },
  },
  interactions: [
    {
      type: 'marker-active',
    },
  ],
};

const debounceTimeout = 500;
export function PriceGraphBox({ className, numPoints }: Props) {
  const [startPrice, delta, curveType] = useCreatePoolStore(
    (state) => [state.startPrice, state.delta, state.curveType],
    shallow,
  );
  const [points, setPoints] = React.useState<{ amount: string; price: number | string }[]>([]);

  React.useEffect(() => {
    const calcPoints = () => {
      const values =
        curveType === 'linear'
          ? calculateLinearPoints(startPrice || 0, delta || 0, numPoints)
          : curveType === 'exponential'
          ? calculateExponentialPoints(startPrice || 0, delta || 0, numPoints)
          : [];

      setPoints(
        values.map(([x, y]) => ({
          amount: x.toString(),
          price: y.toFixed(3),
        })),
      );
    };

    const f = debounce(calcPoints, debounceTimeout);
    f();
  }, [curveType, numPoints, startPrice, delta]);

  return (
    <div className={className}>
      <Typography.Title level={4}>Price Graph</Typography.Title>
      {/* https://charts.ant.design/en/examples/line/basic#line-point-style */}
      <Line
        {...config}
        data={points}
        autoFit={false}
        renderer="svg"
        padding="auto"
        yAxis={{
          tickInterval: 10,
          type: curveType === 'exponential' ? 'pow' : 'cat',
        }}
      />
    </div>
  );
}
