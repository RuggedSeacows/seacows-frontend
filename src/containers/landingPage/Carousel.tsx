import styled from 'styled-components';
import React from 'react';
import { Typography, Row, Col, Button } from 'antd';
import { H1Title } from 'src/components/common/Text';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const Container = styled.div`
  background: black;
  padding: 125px 114px;
  width: 100%;
  border-radius: 16px;
  margin-bottom: 48px;
`;

const { Paragraph } = Typography;
export function Carousel() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <Container>
      <H1Title>Buy and sell NFTs instantly</H1Title>
      <Paragraph>
        Do instant trades or become a liquidity provider and earn passive income on your ERC721 & ERC1155 NFT assets.
      </Paragraph>
      {!address ? (
        <Button type="primary" style={{ marginTop: 48 }} onClick={openConnectModal}>
          Connect Wallet
        </Button>
      ) : null}
    </Container>
  );
}
