import styled from 'styled-components';
import React from 'react';
import { Typography, Row, Col } from 'antd';
import { CollectionBox } from 'src/components/common/Collection/CollectionBox';

const Container = styled.div`
  margin-top: 24px;
`;

interface Props {
  collections: Array<{
    image?: string;
    name: string;
  }>;
}

export function TrendingCollections({ collections }: Props) {
  return (
    <div>
      <Typography.Title>Trending Collections</Typography.Title>
      <Container>
        <Row gutter={[24, 24]}>
          {collections.map((collection, index) => (
            <Col key={index} md={4} xs={12} sm={6} span={3}>
              <CollectionBox image={collection.image} title={collection.name} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
