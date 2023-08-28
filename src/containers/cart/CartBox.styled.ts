import styled from 'styled-components';
import { Typography } from 'antd';

export const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 48px 0px;
`;

export const SectionText = styled(Typography.Title).attrs({ level: 5 })`
  font-weight: 400 !important;
  opacity: 0.45;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
`;

export const Spacer = styled.div`
  flex-grow: 1;
`;

export const Container = styled.div`
  width: 312px;
  height: calc(100vh - 96px);
  background: #151619;
  box-shadow: inset 1px 0px 0px #222329;
  padding: 24px 16px;
`;

export const CartInbox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-bottom: 24px;
`;

export const CartTable = styled.table`
  border-collapse: collapse;

  tr {
    box-shadow: 0px -1px 0px 0px rgba(34, 35, 41, 1) inset;
  }
  thead {
    background: #191a1f;
    box-shadow: inset 0px 1px 0px #222329, inset 0px -1px 0px #222329;
  }
  td,
  th {
    padding: 8px 8px;
    text-align: left;
  }
  th {
    font-weight: 500;
  }
`;

export const CartActionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 8px;
`;

export const ActionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
