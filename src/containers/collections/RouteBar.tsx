import { Button, Space } from 'antd';
import { shallow } from 'zustand/shallow';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { isExpectedViewTag, useCollectionViewStore } from './store';
import { useCartStore } from '../cart/store';

const buttonStyle = { width: 160 };

export function RouteBar() {
  const { asPath, push, query } = useRouter();
  const [viewTag, setViewTag] = useCollectionViewStore((state) => [state.viewTag, state.setViewTag], shallow);
  const setCartType = useCartStore(state => state.setCartType);

  useEffect(() => {
    const hash = asPath.split('#')[1];

    if (isExpectedViewTag(hash)) {
      setViewTag(hash);
      setCartType(hash);
    } else if (hash) {
      push('/404');
    }
  }, [asPath, push, setViewTag, setCartType]);

  // const { viewTag } = query;

  const pushToRoute = (tag: string) => {
    push(`/collections/${query.address}#${tag}`);
  };

  return (
    <Space size="middle" direction="horizontal">
      <Button type={viewTag === 'buy' ? 'primary' : undefined} onClick={() => pushToRoute('buy')} style={buttonStyle}>
        Buy
      </Button>
      <Button type={viewTag === 'sell' ? 'primary' : undefined} onClick={() => pushToRoute('sell')} style={buttonStyle}>
        Sell
      </Button>
      <Button
        type={viewTag === 'deposit' ? 'primary' : undefined}
        onClick={() => pushToRoute('deposit')}
        style={buttonStyle}
      >
        Deposit
      </Button>
      <Button
        type={viewTag === 'withdraw' ? 'primary' : undefined}
        onClick={() => pushToRoute('withdraw')}
        style={buttonStyle}
      >
        Withdraw
      </Button>
    </Space>
  );
}
