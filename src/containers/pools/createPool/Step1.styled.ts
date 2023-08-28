import styled from 'styled-components';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

export const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding-top: 32px;
  padding-bottom: 32px;
`;

export const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-column-gap: 0px;
  grid-row-gap: 24px;
  border-bottom-width: 0px;
  margin-bottom: 100px;
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
  height: 100%;
  justify-content: center;
  gap: 24px;
  cursor: pointer;
`;

export const OptionBox = styled(Box)`
  background: #191a1f;
  border: 1px solid #1e1f23;
  border-radius: 2px;
  :hover {
    background: #222329;
  }
`;

export const TradingPoolBox = styled(OptionBox)`
  grid-area: 1 / 1 / 3 / 2;
  margin-right: 24px;
`;

export const SectionTitle = styled(Title).attrs({ level: 3 })`
  font-weight: 700;
  margin-top: 28px;
  margin-bottom: 4px;
`;

export const SectionText = styled(Title).attrs({ level: 5 })`
  font-weight: 400 !important;
  opacity: 0.45;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
`;
