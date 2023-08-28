import React from 'react';
import styled from 'styled-components';
import { Layout } from 'antd';
import { CartBox } from 'src/containers/cart/CartBox';
import { useCartStore } from 'src/containers/cart/store';
import PageHeader from './Header';
import { Footer } from './Footer';

const StyledLayout = styled(Layout)`
  width: 100%;
  background: #151619;
`;

const Container = styled(Layout.Content)`
  display: flex;
`;

const MainView = styled.div`
  width: 100%;
  flex: 1;
`;

const Header = styled.div`
  padding: 16px 48px;
  box-shadow: inset 0px -1px 0px #222329;
`;

const Content = styled.div`
  padding: 16px 48px 48px;
`;

interface Props {
  children?: React.ReactNode;
}

export const NewLayoutChildren = {
  Header,
  Content,
};

export function NewLayout({ children }: Props) {
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
