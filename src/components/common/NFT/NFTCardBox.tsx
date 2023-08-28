import type { PoolType, TokenValue } from 'src/types';
import React from 'react';
import styled from 'styled-components';
import { Card, Checkbox } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { formatNumber } from 'src/utils/number';
import { PoolTypeIcon } from '../Pools/PoolTypeIcon';

const StyledCard = styled(Card)<{ checked?: boolean; width?: number }>`
  background: #222329;
  border: 1px solid ${(props) => (props.checked ? '#4F75DD' : '#222329')};
  border-radius: 2px;
  width: ${(props) => props.width || 144}px;
  padding: 0 24px;
  position: relative;
  cursor: pointer;

  .ant-card-body {
    padding: 8px;
    margin-left: -24px;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  position: absolute;
  right: 8px;
  top: 8px;
`;

const InfoIconBox = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

interface Props {
  data: {
    image: string;
    tokenId: string;
    name?: string;
    price?: {
      value?: number;
      token: TokenValue;
    };
  };
  style?: {
    width?: number;
    opacity?: number;
  };
  poolType?: PoolType;
  attributes?: any[];
  checked?: boolean | null;
  onChecked?: (checked: boolean) => unknown;
}

export function NFTCardBox({ data, checked, attributes, style, poolType, onChecked }: Props) {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onChecked) {
      e.stopPropagation();
      e.preventDefault();
      onChecked(!checked);
    }
  };

  return (
    <StyledCard
      cover={
        <img
          alt={data.name || `#${data.tokenId}`}
          src={data.image || `https://via.placeholder.com/125?text=${data.name || data.tokenId}`}
          style={{ marginTop: 1, opacity: style?.opacity }}
        />
      }
      width={style?.width}
      checked={!!checked}
      onClick={handleCardClick}
    >
      {data.name || `# ${data.tokenId}`}
      {data.price?.value ? <div>{`${formatNumber(data.price.value)} ${data.price.token}`}</div> : null}
      {attributes ? (
        <InfoIconBox>
          <PoolTypeIcon type={poolType} />
          <InfoCircleOutlined style={{ fontSize: 17 }} />
        </InfoIconBox>
      ) : null}
      {checked !== null ? <StyledCheckbox checked={checked} /> : null}
    </StyledCard>
  );
}
