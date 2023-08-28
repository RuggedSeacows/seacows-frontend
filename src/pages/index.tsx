import React from 'react';
import styled from 'styled-components';
import { Carousel } from 'src/containers/landingPage/Carousel';
import { TopPools } from 'src/containers/landingPage/TopPools';
import { QueryClient, dehydrate } from '@tanstack/react-query';
import { useCartOpen, usePoolStats } from 'src/hooks';

const Container = styled.div``;

export default function Home() {
  const { pools: topPools, isLoading } = usePoolStats(0, 15);
  useCartOpen(false);

  return (
    <Container>
      <Carousel />
      <div>
        <TopPools data={topPools} isLoading={isLoading} />
        {/* <TrendingCollections collections={trendingCollections} /> */}
      </div>
    </Container>
  );
}

export async function getStaticProps() {
  const queryClient = new QueryClient();

  // await queryClient.prefetchQuery(['api', 'topPoolCollections'], () =>
  //   metadataApi.collection.getTrendingCollections(SupportedChain.GOERLI),
  // );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
