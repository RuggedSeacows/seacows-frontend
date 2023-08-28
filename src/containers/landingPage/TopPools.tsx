import styled from 'styled-components';
import React from 'react';
import { H2Title } from 'src/components/common/Text';
import { PoolList } from 'src/components/common/Pools/PoolList';
import { getPoolStats } from 'src/graphql/amm';
import { formatEther } from 'ethers/lib/utils';
import { Skeleton } from 'antd';
import { calculateAPR } from 'src/utils/pool';

const Container = styled.div`
  margin-bottom: 48px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

interface Props {
  data: Awaited<ReturnType<typeof getPoolStats>>;
  isLoading?: boolean;
}

export function TopPools({ data, isLoading }: Props) {
  const pools = data.map((p) => ({
    collection: {
      id: p.collection.id,
      name: p.collection.name,
      image: null,
    },
    totalValueLocked: p.totalValueLocked,
    totalFee: p.totalFee,
    createdAt: p.createdAt,
    token: p.token.id,
    id: p.id,
    apr: calculateAPR(p.totalFee, p.totalValueLocked, p.createdAt),
    liquidity: Number(formatEther(p.liquidity)),
    day: {
      change: p.poolDayData?.priceChange || 0,
      volume: p.poolDayData?.volume || 0,
    },
    price: p.poolDayData?.price || 0,
    week: {
      change: p.poolWeekData?.priceChange || 0,
      volume: p.poolWeekData?.volume || 0,
    },
  }));

  return (
    <Container>
      <Header>
        <H2Title>Top Pools</H2Title>
        {/* <Button onClick={handleViewAllClick}>View All</Button> */}
      </Header>
      {isLoading ? (
        [1, 2, 3].map((i) => <Skeleton loading={isLoading} paragraph key={i} />)
      ) : (
        <PoolList pools={pools} />
      )}
    </Container>
  );
}
