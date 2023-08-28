import styled from 'styled-components';
import { Input } from 'antd';

export const Box = styled.div`
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

export const RoyaltyBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SettingsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 0px 8px 12px;

  background: #2a2c33;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 2px;
`;

export const BoxInside = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
`;

export const WhiteInput = styled(Input)`
  input.ant-input {
    color: white;
  }
`;
