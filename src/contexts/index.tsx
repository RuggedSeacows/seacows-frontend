import React from 'react';
import { RainbowKitProvider, getDefaultWallets, lightTheme, darkTheme } from '@rainbow-me/rainbowkit';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { AppProps } from 'next/app';
import { ThemeProvider } from './theme';
import { SITE_NAME, supportedChains } from '../app/config';

const { chains, provider, webSocketProvider } = configureChains(supportedChains, [publicProvider()]);

export const { connectors } = getDefaultWallets({
  appName: SITE_NAME,
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

interface Props {
  children: React.ReactNode;
  pageProps: AppProps['pageProps'];
}

export function Providers({ children, pageProps }: Props) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        theme={{
          lightMode: lightTheme(),
          darkMode: darkTheme(),
        }}
      >
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>{children}</Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ThemeProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
