import React from 'react';
import { Layout, Typography, Badge, Button, Space } from 'antd';
import styled from 'styled-components';
import { shallow } from 'zustand/shallow';
import Link from 'next/link';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCartStore } from 'src/containers/cart/store';
import { useRouter } from 'next/router';
import { WalletButton } from '../UI/WalletButton';
import Logo from '../../assets/logo.svg';
import { SearchCollection } from '../common/Collection/SearchCollection';

const { Text } = Typography;
const TopRightWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderWrapper = styled(Layout.Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #000000aa;
  height: 48px;
  line-height: 48px;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 24px;
  }
`;

function Header() {
  const [itemCount, open, setCartOpen] = useCartStore(
    (state) => [state.items[state.type].length, state.open, state.setCartOpen],
    shallow,
  );
  const { push } = useRouter();

  const handleCartClick = () => {
    setCartOpen(!open);
  };

  const handleCollectionSelect = (option: any) => {
    push(`/collections/${option.value}`);
  };

  return (
    <HeaderWrapper>
      <Menu>
        <Link href="/" style={{ display: 'inline-flex' }}>
          <Logo />
        </Link>
        <SearchCollection style={{ width: 264 }} onSelect={handleCollectionSelect} checkPool={false} />
        <Link href="/portfolio">
          <Text>Portfolio</Text>
        </Link>
        {/* <Link href="/activity">
          <Text>Activity</Text>
        </Link>
        <Link href="/my-pools">
          <Text>My Pools</Text>
        </Link> */}
        <Link href="/pools/create">
          <Text>Create pool</Text>
        </Link>
      </Menu>
      <Space size="middle">
        <TopRightWrapper>
          <WalletButton />
        </TopRightWrapper>
        {/* <Badge size="default" count={itemCount}>
          <Button type="primary" icon={<ShoppingCartOutlined />} onClick={handleCartClick} />
        </Badge> */}
      </Space>
    </HeaderWrapper>
  );
}

export default Header;
