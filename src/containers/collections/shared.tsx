import styled from 'styled-components';
import { Button, Typography } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #191a1f;
  /* Neutral/3 */

  border: 1px solid #222329;
  border-radius: 2px;
  padding: 16px 24px 24px;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PositionBox = styled.div<{ active?: boolean }>`
  display: flex;
  text-align: center;
  flex-direction: column;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 17px;
  gap: 8px;
  border-radius: 2px;
  color: #fff;
  cursor: pointer;

  background: ${(props) => (props.active ? '#4F75DD' : '#1E1F23')};
  /* Neutral/5 */

  border: 1px solid ${(props) => (props.active ? '#4F75DD' : '#232428')};
  /* drop-shadow/button-secondary */

  box-shadow: 0px 2px 0px ${(props) => (props.active ? 'rgba(0, 0, 0, 0.043)' : 'rgba(0, 0, 0, 0.016)')};
`;

export const EmptyPoolBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 32px;
  padding-top: 48px;
  padding-bottom: 120px;
`;
export const EmptyPoolShow = () => {
  const { push } = useRouter();
  const handleCreatePoolClick = () => {
    push('/pools/create');
  };

  return (
    <EmptyPoolBox>
      <Typography.Text>
        This collection does not yet have a swap pool. Want to earn trading fees? Create one!
      </Typography.Text>
      <Button icon={<PlusCircleOutlined />} onClick={handleCreatePoolClick} type="primary">
        Create Pool
      </Button>
    </EmptyPoolBox>
  );
};
