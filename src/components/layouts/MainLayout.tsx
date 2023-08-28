import { Layout } from 'antd';
import { ReactNode } from 'react';
import styled from 'styled-components';

import { useCartStore } from 'src/containers/cart/store';
import { CartBox } from 'src/containers/cart/CartBox';
import Header from './Header';
import { Footer } from './Footer';

const { Content } = Layout;

const StyledLayout = styled(Layout)`
  width: 100%;
  background: #17181c;
`;

const Container = styled(Content)`
  display: flex;
`;

const MainView = styled.div`
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;
  padding: 48px;
  min-height: calc(100vh - 96px);
`;

type Props = {
  children: ReactNode;
};

export function MainLayout({ children }: Props) {
  const cartOpen = useCartStore((state) => state.open);

  return (
    <StyledLayout>
      <Header />
      <Container>
        <MainView>{children}</MainView>
        {cartOpen ? <CartBox /> : null}
      </Container>
      <Footer />
    </StyledLayout>
  );
}
