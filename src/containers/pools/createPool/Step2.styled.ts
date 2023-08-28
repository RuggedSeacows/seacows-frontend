import styled from 'styled-components';
import { Typography, Drawer } from 'antd';

export const TitleBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 48px 0px;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: 0.36fr 0.64fr;
  grid-column-gap: 24px;
  grid-row-gap: 24px;

  > * {
    padding: 24px;
    border: 1px solid #222329;
    border-radius: 2px;
  }

  .div1 {
    grid-area: 1 / 1 / 2 / 2;
    background: #191a1f;
  }
  .div2 {
    grid-area: 1 / 2 / 2 / 3;
  }
  .div3 {
    grid-area: 2 / 1 / 3 / 3;
    background: #191a1f;
  }
  .div4 {
    grid-area: 3 / 1 / 4 / 2;
  }
  .div5 {
    grid-area: 3 / 2 / 4 / 3;
  }
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

export const DrawerInbox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const DrawerTable = styled.table`
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
    padding: 8px;
  }
  th {
    font-weight: 500;
  }
`;

export const DrawerActionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding-bottom: 16px;
`;

export const ActionDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TokenInputBox = styled.div`
  margin-top: 0px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
