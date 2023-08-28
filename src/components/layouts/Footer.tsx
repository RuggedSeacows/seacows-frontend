import React from 'react';
import { Layout, Typography } from 'antd';
import styled from 'styled-components';

const Wrapper = styled(Layout.Footer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #000000aa;
  height: 48px;
  line-height: 48px;
`;

const { Text } = Typography;

export function Footer() {
  return (
    <Wrapper>
      <Text>© 2018 - 2023 Seacows Networks, Inc</Text>
    </Wrapper>
  );
}
