import styled from 'styled-components';

export const NavBox = styled.div`
  display: flex;
  width: 312px;
  padding: 24px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  height: 100%;

  background: var(--background, #151619);
  box-shadow: -1px 0px 0px 0px #222329 inset;
`;

export const NavOption = styled.div`
  padding: 8px 16px;
`;
