import styled from 'styled-components';
import { Typography } from 'antd';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
`;

export const NavigationBox = styled.div<{ onClick?: Function }>`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'not-allowed')};
`;

export const StepTitle = styled(Typography.Title)`
  margin-bottom: 0px !important;
  margin-left: 16px;
  margin-right: 12px;
`;
