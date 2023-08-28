/* eslint-disable react/no-unknown-property */
import 'antd/dist/reset.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import { Quantico } from '@next/font/google';
import { Providers } from 'src/contexts';
import { MainLayout, NewLayout, ExtendedLayout } from 'src/components/layouts';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { PageLoader } from 'src/components/common/Page/Loader';
import { useRouteEvents } from 'src/hooks/useRouteEvents';

const quantico = Quantico({ subsets: ['latin'], weight: ['400', '700'] });

export default function App({ Component, pageProps }: AppProps) {
  const mounted = useIsMounted();
  const { isRouteChanging, loadingKey } = useRouteEvents();

  return (
    <Providers pageProps={pageProps}>
      {/* @ts-ignore */}
      <style jsx global>{`
        html {
          font-family: ${quantico.style.fontFamily};
        }
        .ant-typography,
        .ant-col,
        .ant-btn {
          font-family: ${quantico.style.fontFamily};
        }
        .pool-table-row {
          cursor: pointer;
        }
      `}</style>
      <PageLoader isRouteChanging={isRouteChanging} key={loadingKey} />
      {mounted &&
        (pageProps.layout === 'extended' ? (
          <ExtendedLayout>
            <Component {...pageProps} />
          </ExtendedLayout>
        ) : pageProps.layout === 'new' ? (
          <NewLayout>
            <Component {...pageProps} />
          </NewLayout>
        ) : (
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        ))}
    </Providers>
  );
}
