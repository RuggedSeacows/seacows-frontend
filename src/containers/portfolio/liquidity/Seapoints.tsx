import React from 'react';
import styled from 'styled-components';
import { Button, Typography } from 'antd';
import { CrownOutlined } from '@ant-design/icons';

const Box = styled.div`
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  flex: 1 0 0;
  align-self: stretch;

  border-radius: 2px;
  background: var(--neutral-1, #191a1f);
`;

const { Text } = Typography;
export function Seapoints() {
  return (
    <Box>
      <div>
        <CrownOutlined style={{ color: '#FFFFFFD9', width: 24, height: 24 }} />
        <Text>Seapoints</Text>
      </div>
      <div>
        <Text>0</Text>
      </div>
      <Button type="default" disabled style={{ width: '100%' }}>
        Use Seapoints
      </Button>
    </Box>
  );
}
