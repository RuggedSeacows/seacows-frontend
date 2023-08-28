import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { useAccount } from 'wagmi';
import styled from 'styled-components';
import { ExtendedLayoutChildren } from 'src/components/layouts';
import { PortfolioNav } from 'src/containers/portfolio/PortfolioNav';
import { PortfolioLiquidity } from 'src/containers/portfolio/liquidity/PortfolioLiquidity';
import { useCartOpen } from 'src/hooks';

const { Sidebar, Content } = ExtendedLayoutChildren;
const Main = styled(Content)`
  padding: 24px 48px 48px;
`;

export default function PortfolioPage() {
  const { address } = useAccount();

  useCartOpen(false);

  return !address ? (
    <ConnectButton />
  ) : (
    <>
      <Sidebar>
        <PortfolioNav />
      </Sidebar>
      <Main>
        <PortfolioLiquidity />
      </Main>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      layout: 'extended',
    },
  };
}
