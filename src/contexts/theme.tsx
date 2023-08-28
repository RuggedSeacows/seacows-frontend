import { useContext } from 'react';
import { ConfigProvider, theme as antDTheme } from 'antd';
import { ThemeContext, ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from 'src/constants/theme';

type Props = {
  children?: React.ReactNode;
};

function ThemeProvider({ children }: Props) {
  return (
    <ConfigProvider
      theme={{
        algorithm: antDTheme.darkAlgorithm,

        token: {
          // TODO: Set button global styles
          borderRadius: 0,
          colorPrimary: '#4F75DD',
        },
      }}
    >
      <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
    </ConfigProvider>
  );
}

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
