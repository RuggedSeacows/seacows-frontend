import type { PoolType } from 'src/types';
import React from 'react';
import { useAccount } from 'wagmi';
import { CreatePoolStep1 } from 'src/containers/pools/createPool/Step1';
import { CreatePoolStep2 } from 'src/containers/pools/createPool/Step2';
import { useCreatePoolStore } from 'src/containers/pools/createPool/store';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useCartStore } from 'src/containers/cart/store';

export default function CreatePool() {
  const [step, setStep] = React.useState(2);
  const setPoolType = useCreatePoolStore((state) => state.setPoolType);
  const setCartOpen = useCartStore((state) => state.setCartOpen);
  const { address, status } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleToStep2Click = (type: PoolType) => {
    if (!address) {
      if (openConnectModal) {
        openConnectModal();
      }
      return;
    }

    setStep((s) => s + 1);
    setPoolType(type);
  };

  React.useEffect(() => {
    if (status === 'disconnected' && openConnectModal) {
      openConnectModal();
    }
  }, [status, openConnectModal]);

  React.useEffect(() => {
    setCartOpen(false);
  }, [setCartOpen]);

  return (
    <div style={{ width: '100%' }}>
      {step === 1 ? (
        <CreatePoolStep1 onNextStep={handleToStep2Click} />
      ) : step === 2 ? (
        <CreatePoolStep2
          title="Create Swap Pool"
          description="Provide liquidity to earn a swap fee."
          onBack={() => setStep(1)}
        />
      ) : null}
    </div>
  );
}
