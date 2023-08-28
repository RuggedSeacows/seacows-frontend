import styled from 'styled-components';

export const ListBox = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  max-height: 424px;
  overflow-y: auto;
`;

export const Toolbar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  box-shadow: inset 0px -1px 0px #222329;
  gap: 16px;
  margin-bottom: 16px;
`;

export const View = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
