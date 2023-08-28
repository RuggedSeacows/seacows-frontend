import { Typography } from 'antd';
import { ExtendedLayoutChildren } from 'src/components/layouts';
import { AccountHeader } from 'src/containers/accounts/AccountHeader';
import { AccountMenu } from 'src/containers/accounts/AccountMenu';

const { Header, Sidebar, Content } = ExtendedLayoutChildren;
const { Text } = Typography;

function AccountProfilePage() {
  return (
    <>
      <Header>
        <AccountHeader />
      </Header>
      <Sidebar>
        <AccountMenu />
      </Sidebar>
      <Content>
        <Text>This is content</Text>
      </Content>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {
      layout: 'extended',
    },
  };
}
export default AccountProfilePage;
