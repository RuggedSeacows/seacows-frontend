import { useConnectModal } from '@rainbow-me/rainbowkit';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { SecondaryText } from 'src/components/common/Text';
import styled from 'styled-components';
import { useAccount } from 'wagmi';

const PageWrapper = styled.div`
  padding: 24px;
`;

function MyPoolsPage() {
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { push } = useRouter();

  return (
    <PageWrapper>
      <SecondaryText>
        This page is WIP (Work In Progress) <br />
        <br />
      </SecondaryText>
      {address ? (
        <Button type="primary" onClick={() => push('/pools/create')}>
          Create Pool
        </Button>
      ) : (
        <Button type="primary" onClick={openConnectModal}>
          Connect Wallet
        </Button>
      )}
    </PageWrapper>
  );
}

export default MyPoolsPage;
