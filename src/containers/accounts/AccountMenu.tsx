import styled from 'styled-components';
import React from 'react';
import Link from 'next/link';
import { Typography } from 'antd';
import { useAccount } from 'wagmi';

const Container = styled.div`
  display: flex;
  padding: 24px 16px;
  background: #151619;
  box-shadow: inset -1px 0px 0px #222329;
  width: 100%;
  flex-direction: column;
  gap: 8px;
  height: 100%;
`;

const StyledLink = styled(Link)<{ active?: boolean }>`
  padding: 8px 24px;
  ${(props) => (props.active ? `background: #191A1F;` : '')}
  opacity: ${(props) => (props.active ? '1': '0.45')};
`;

const { Text } = Typography;

export function AccountMenu() {
  const { address } = useAccount();

  return (
    <Container>
      <StyledLink href="/activity" active>
        <Text>My Package</Text>
      </StyledLink>
      <StyledLink href="/my-pools">
        <Text>My Activity</Text>
      </StyledLink>
      <StyledLink href="/my-pools">
        <Text>My NFTs</Text>
      </StyledLink>
    </Container>
  );
}
