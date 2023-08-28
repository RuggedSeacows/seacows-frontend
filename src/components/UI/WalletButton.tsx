import { DownOutlined, WalletOutlined } from '@ant-design/icons';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button } from 'antd';
import React from 'react';

export function WalletButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button type="primary" onClick={openConnectModal}>
                    Connect wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} danger>
                    Wrong network
                  </Button>
                );
              }
              return (
                <div>
                  <Button onClick={openChainModal} style={{ marginRight: 16 }}>
                    {chain.name}
                    <DownOutlined style={{ fontSize: 12 }} />
                  </Button>
                  <Button onClick={openAccountModal}>
                    <WalletOutlined />
                    {account.displayName}
                    {account.displayBalance ? ` (${account.displayBalance})` : ''}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
