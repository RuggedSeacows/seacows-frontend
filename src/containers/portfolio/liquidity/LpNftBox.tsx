import styled from 'styled-components';
import React from 'react';
import { ExportOutlined } from '@ant-design/icons';
import { Button, Image, Typography } from 'antd';
import { TokenIcon } from 'src/components/common/Token/TokenIcon';
import Link from 'next/link';
import { useCollectFee } from 'src/hooks';
import { formatNumber } from 'src/utils/number';

const Header = styled.div`
  margin: 0 auto;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  border-radius: 2px;
  background: var(--neutral-3, #222329);
  width: 224px;
  height: 100%;
`;

const Footer = styled.div`
  display: flex;
  padding: 8px 12px;
  flex-direction: column;
  justify-content: center;
  /* align-items: center; */
  gap: 8px;
  align-self: stretch;

  border-radius: 2px;
  border: 1px solid var(--neutral-5, #232428);
  /* drop-shadow/button-secondary */
  box-shadow: 0px 2px 0px 0px rgba(0, 0, 0, 0.02);
  height: 100%;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const BetweenFlex = styled(Flex)`
  justify-content: space-between;
`;
const { Text } = Typography;

const CollectionName = styled(Text)`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 140px;
  display: inline;
`;

interface Props {
  collection: {
    name: string;
    image: string;
    address: string;
  };
  rewards: {
    token: string;
    amount: string;
  };
  tokenId: string;
  pool: string;
  image: string;
}
export function LpNftBox({ collection, rewards, tokenId, pool, image }: Props) {
  const isValid = Number(rewards.amount || '0') > 0;
  const { collect, isLoading, hasError } = useCollectFee(isValid, pool, tokenId);

  return (
    <Box>
      <Header>
        <Image
          width={200}
          height={200}
          src={image}
          fallback="https://via.placeholder.com/200"
          alt="Collection"
          preview={false}
          id="lpImage"
        />
      </Header>
      <Footer>
        <Flex>
          <Image
            width={16}
            height={16}
            src={collection.image}
            fallback="https://via.placeholder.com/16"
            alt={collection.name}
            preview={false}
          />
          <Link href={`/collections/${collection.address}`} style={{ display: 'flex', color: '#FFFFFFD9' }}>
            <CollectionName as="div">{collection.name}</CollectionName>
            <ExportOutlined style={{ width: 16, height: 16, marginLeft: 8 }} />
          </Link>
        </Flex>
        <BetweenFlex>
          <Text>Rewards: </Text>
          <Flex>
            <TokenIcon token="ETH" />
            <Text>{formatNumber(rewards.amount, 5)} ETH</Text>
          </Flex>
        </BetweenFlex>
        <Button
          type="primary"
          style={{ borderRadius: 2, marginLeft: 8, marginRight: 8 }}
          loading={isLoading}
          disabled={!isValid || hasError || !collect}
          onClick={() => collect?.()}
        >
          Claim Rewards
        </Button>
      </Footer>
    </Box>
  );
}
