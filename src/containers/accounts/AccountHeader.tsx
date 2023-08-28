import styled from 'styled-components';
import React from 'react';
import { Button, Image, Typography, Space } from 'antd';
import { useAccount } from 'wagmi';

const Container = styled.div`
  display: flex;
  padding: 16px 48px;
  background: #151619;
  box-shadow: inset 0px -1px 0px #222329;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const { Title } = Typography;

export function AccountHeader() {
  const { address } = useAccount();
  return (
    <Container>
      <Space align="center" size="large">
        <Image
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          width={64}
          height={64}
          style={{ borderRadius: '100px' }}
        />
        <Title style={{ display: 'inline-block' }} level={4}>
          Test
        </Title>
      </Space>
      {address ? <Button type="primary">Disconnect</Button> : <Button type="primary">Connect</Button>}
    </Container>
  );
}
