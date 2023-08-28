import styled from 'styled-components';
import React from 'react';
import { Image } from 'antd';

const Box = styled.div`
  border: 1px solid #191a1f;
  border-radius: 5px;
  width: 100%;
`;

const TitleBox = styled.div`
  padding: 10px 8px;
`;

const Title = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
`;

interface Props {
  image?: string;
  title: string;
}

export function CollectionBox({ image, title }: Props) {
  return (
    <Box>
      <Image
        width={204}
        height={204}
        src={image}
        fallback="https://via.placeholder.com/125"
        alt={title}
        preview={false}
      />
      <TitleBox>
        <Title>{title}</Title>
      </TitleBox>
    </Box>
  );
}
