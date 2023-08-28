import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { CartBox } from 'src/containers/cart/CartBox';
import { useCartStore } from 'src/containers/cart/store';
import PageHeader from './Header';
import { Footer } from './Footer';

const StyledLayout = styled(Layout)`
  width: 100%;
  background: #17181c;
`;

const Container = styled(Layout.Content)`
  display: flex;
  min-height: calc(100vh - 48px - 48px);
`;

const MainView = styled.div`
  width: 100%;
  flex: 1;

  display: grid;
  grid-template-columns: 312px 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  grid-auto-rows: max-content;
`;

const Header = styled.div`
  grid-area: 1 / 1 / 2 / 3;
`;
const Sidebar = styled.div`
  grid-area: 2 / 1 / 3 / 2;
`;
const Content = styled.div`
  grid-area: 2 / 2 / 3 / 3;
`;

interface Props {
  children?: React.ReactNode;
}

export const ExtendedLayoutChildren = {
  Header,
  Sidebar,
  Content,
};

export function ExtendedLayout({ children }: Props) {
  const cartOpen = useCartStore((state) => state.open);
  return (
    <StyledLayout>
      <PageHeader />
      <Container>
        <MainView>{children}</MainView>
        {cartOpen ? <CartBox /> : null}
      </Container>
      <Footer />
    </StyledLayout>
  );
}
