import styled from 'styled-components';
import { Typography } from 'antd';

export const SecondaryTitle = styled(Typography.Title)`
  opacity: 0.45;
`;

export const SecondaryText = styled(Typography.Text)`
  opacity: 0.45;
`;

export const H1Title = styled(Typography.Title).attrs({ level: 1 })`
  font-weight: 700;
  font-size: 38px;
  line-height: 46px;
`;

export const H2Title = styled(Typography.Title).attrs({ level: 2 })`
  font-weight: 700;
  font-size: 32px;
  line-height: 46px;
`;
