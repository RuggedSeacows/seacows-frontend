import React from 'react';

import Link from 'next/link';
import { SecondaryText } from 'src/components/common/Text';
import { Typography } from 'antd';
import { NavBox, NavOption } from './PortfolioNav.styled';

const { Text } = Typography;

export function PortfolioNav() {
  return (
    <NavBox>
      <NavOption>
        <Link href="/portfolio">
          <Text>My Liquidity</Text>
        </Link>
      </NavOption>
      <NavOption>
        {/* <Link href="/portfolio/activity"> */}
        <SecondaryText>My Activity</SecondaryText>
        {/* </Link> */}
      </NavOption>
      <NavOption>
        {/* <Link href="/portfolio/nfts"> */}
        <SecondaryText>My NFTs</SecondaryText>
        {/* </Link> */}
      </NavOption>
    </NavBox>
  );
}
