import styled from 'styled-components';
import React from 'react';
import { Image, Typography, Space } from 'antd';

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const { Title } = Typography;

interface Props {
  name: string;
  address?: string;
  image: string;
}

export function CollectionHeader({ image, name, address }: Props) {
  return (
    <Container>
      <Space align="center" size="large">
        <Image src={image} width={64} height={64} style={{ borderRadius: '100px' }} preview={false} />
        <Title style={{ display: 'inline-block' }} level={4}>
          {name}
        </Title>
      </Space>
    </Container>
  );
}
