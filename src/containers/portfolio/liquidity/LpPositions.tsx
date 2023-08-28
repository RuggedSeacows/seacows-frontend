import { GiftOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';
import { Skeleton, Typography } from 'antd';
import { usePortfolioPositions } from 'src/hooks';
import { LpNftBox } from './LpNftBox';

const Box = styled.div`
  display: flex;
  padding: 24px;
  flex-direction: column;
  margin-top: 24px;
  align-items: flex-start;
  gap: 24px;
  flex: 1 0 0;
  align-self: stretch;

  border: 1px solid var(--neutral-3, #222329);
  background: var(--background, #151619);
`;

const NFTBoxList = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
`;

const { Text } = Typography;

const Placeholders = Array(3)
  .fill(0)
  .map((_, index) => index);

const placeholderStyle = {
  width: 240,
  height: 300,
};

export function LpPositions() {
  const { positionTokens, isLoading } = usePortfolioPositions();

  return (
    <Box>
      <div>
        <GiftOutlined style={{ color: '#FFFFFFD9', width: 24, height: 24 }} />
        <Text>My LP Position</Text>
      </div>
      <NFTBoxList>
        {isLoading
          ? Placeholders.map((i) => <Skeleton.Image key={i} active style={placeholderStyle} />)
          : positionTokens.map((t, index) => (
              <LpNftBox
                key={index}
                pool={t.pool}
                tokenId={t.tokenId}
                image={t.image}
                rewards={t.rewards}
                collection={t.collection}
              />
            ))}
      </NFTBoxList>
    </Box>
  );
}
