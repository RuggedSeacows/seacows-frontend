import { GetServerSideProps } from 'next';
import React from 'react';
import { shallow } from 'zustand/shallow';
import { Skeleton } from 'antd';
import styled from 'styled-components';
import { NewLayoutChildren } from 'src/components/layouts';
import { CollectionHeader } from 'src/containers/collections/CollectionHeader';
import { isAddress } from 'ethers/lib/utils';
import { metadataApi } from 'src/utils/api';
import { SupportedChain } from '@yolominds/metadata-service-api';
import { useCollectionViewStore } from 'src/containers/collections/store';
import { RouteBar } from 'src/containers/collections/RouteBar';
import { BuyView } from 'src/containers/collections/BuyView';
import { TransactionTable } from 'src/containers/collections/TransactionTable';
import { DepositView } from 'src/containers/collections/DepositView';
import { WithdrawView } from 'src/containers/collections/WithdrawView';
import { SellView } from 'src/containers/collections/SellView';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useCollection } from 'src/hooks/api/useCollection';

const { Header, Content } = NewLayoutChildren;

const StyledContent = styled(Content)`
  display: flex;
  gap: 24px;
  flex-direction: column;
`;

interface Props {
  address: string;
}

function CollectionDetailPage({ address }: Props) {
  const [viewTag] = useCollectionViewStore((state) => [state.viewTag], shallow);

  const { collection, isLoading } = useCollection(address);

  return (
    <>
      <Header>
        <Skeleton active loading={isLoading}>
          <CollectionHeader name={collection?.name!} image={collection?.logo!} />
        </Skeleton>
      </Header>
      <StyledContent>
        <RouteBar />

        {isLoading || !collection ? (
          [1, 2, 3].map((i) => <Skeleton loading={isLoading} paragraph key={i} />)
        ) : (
          <>
            {viewTag === 'deposit' ? (
              <DepositView collection={collection} />
            ) : viewTag === 'withdraw' ? (
              <WithdrawView collection={collection} />
            ) : viewTag === 'buy' ? (
              <BuyView collection={collection} />
            ) : viewTag === 'sell' ? (
              <SellView collection={collection} />
            ) : null}
            <TransactionTable collection={collection.address} />
          </>
        )}
      </StyledContent>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const address = (query?.address as string).toLowerCase();
  const isValidAddress = isAddress(address ?? '');

  if (!isValidAddress) {
    return {
      notFound: true,
    };
  }

  // TODO: Move to useSWR (frontend call) since we don't know the connected chain id on the server yet

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['api', 'getCollection', SupportedChain.GOERLI, address], () =>
    metadataApi.collection.getCollection(SupportedChain.GOERLI, address).then((r) => r.collection),
  );

  return {
    props: {
      layout: 'new',
      address,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default CollectionDetailPage;
