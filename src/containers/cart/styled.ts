import { Typography } from 'antd';
import styled from 'styled-components';

const { Title } = Typography;

export const Step2List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const WithdrawStepTitle = styled(Title).attrs({ level: 5 })`
  span {
    opacity: 0.45;
  }
  span.highlight {
    opacity: 1;
  }
`;

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
