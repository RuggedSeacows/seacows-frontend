import React from 'react';
import { useCartStore } from 'src/containers/cart/store';
import { shallow } from 'zustand/shallow';

export function useCartOpen(open = false) {
  const [setCartOpen] = useCartStore((state) => [state.setCartOpen], shallow);

  React.useEffect(() => {
    setCartOpen(open);
  }, [setCartOpen, open]);
}
