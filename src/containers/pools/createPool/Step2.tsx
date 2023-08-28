import { Button, Typography, Drawer, Divider } from 'antd';
import React, { useMemo, useState } from 'react';
import { shallow } from 'zustand/shallow';
import { SecondaryText } from 'src/components/common/Text';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { TokenBalanceInput } from 'src/components/common/Token/TokenBalanceInput';
import { AMM_ADDRESSES } from 'src/app/config';
import { useUserTokens, useConnectedNetwork, useApproveCollection, useMintLiquidity } from 'src/hooks';
import { BigNumber } from 'ethers';
import { notEmpty } from 'src/utils/types';
import { parseEther } from 'ethers/lib/utils';
import { StepBar } from './StepBar';
import { TokenCollectionForm } from './TokenCollectionForm';
import { PoolRulesBox } from './PoolRulesBox';
import { SelectNFTBox } from './SelectNFTBox';
import { NFTCounterBox } from './NFTCounterBox';
import { PriceGraphBox } from './PriceGraphBox';
import { useCreatePoolStore } from './store';
import {
  Container,
  SectionText,
  TitleBox,
  Spacer,
  DrawerInbox,
  DrawerTable,
  DrawerActionBox,
  ActionDetail,
  TokenInputBox,
} from './Step2.styled';

const { Title, Text } = Typography;

interface Props {
  title: string;
  description: string;
  onBack?: () => unknown;
}

export function CreatePoolStep2({ title, description, onBack }: Props) {
  const [poolType, curveType, collection, token, swapFee, startPrice] = useCreatePoolStore(
    (state) => [state.poolType, state.curveType, state.collection, state.token, state.swapFee, state.startPrice],
    shallow,
  );
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = React.useState('');
  const [filterId, setFilterId] = React.useState<string>();
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const { push } = useRouter();
  const { chainId } = useConnectedNetwork();
  const collectionAddress = collection?.value;
  const { tokens: originalTokens, isLoading } = useUserTokens(collectionAddress);

  const tokens = useMemo(
    () => (filterId ? originalTokens.filter((t) => t.tokenId === filterId) : originalTokens),
    [filterId, originalTokens],
  );

  const selectedTokens = Object.keys(selected)
    .filter((index) => selected[Number(index)] === true)
    .map((index) => tokens.find((t) => t.tokenId === index))
    .filter(notEmpty);

  const selectedTokenIds = useMemo(
    () =>
      Object.keys(selected)
        .filter((index) => selected[Number(index)] === true)
        .map((index) => BigNumber.from(index)),
    [selected],
  );

  const operator = chainId === 5 ? AMM_ADDRESSES[chainId].manager : undefined;
  const approveCalls = useApproveCollection(collection?.value, operator, true);
  const ethAmount = amount ? parseEther(amount) : BigNumber.from(0);
  const mintCalls = useMintLiquidity(
    approveCalls?.isApproved,
    'ETH',
    operator,
    collection?.value,
    (swapFee || 0) * 100,
    selectedTokenIds,
    ethAmount,
    ethAmount,
  );

  const showDrawer = () => {
    if (selectedTokens.length > 0 && startPrice) {
      setAmount((startPrice * selectedTokens.length).toString());
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleNextClick = () => {
    showDrawer();
  };

  const handleCreatePoolClick = () => {
    mintCalls.mint?.();
  };

  const handleApproveClick = () => {
    approveCalls.approve?.();
  };

  return (
    <>
      <TitleBox>
        <Title level={3}>{title}</Title>
        <SectionText>{description}</SectionText>
      </TitleBox>
      <Drawer
        title={<Title level={4}>Added to Swap Pool</Title>}
        placement="right"
        onClose={onClose}
        open={open}
        closable={false}
        style={{ background: '#151619', boxShadow: 'inset 1px 0px 0px #222329' }}
      >
        <DrawerInbox>
          {selectedTokens.length > 0 ? (
            <TokenInputBox>
              <Text>Deposit NFT</Text>
              <DrawerTable>
                <thead>
                  <tr>
                    <th>
                      <Text>Item</Text>
                    </th>
                    <th>
                      <Text>Clear All</Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTokens.map((t, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <img src={t.image} alt={t.name} style={{ width: 32, marginRight: 8, borderRadius: 2 }} />
                          <Text>{t.name}</Text>
                        </div>
                      </td>
                      <td>
                        <Text>{`#${t.tokenId}`}</Text>
                        {mintCalls.isSuccess ? (
                          <CheckCircleOutlined style={{ color: '#49AA19', marginLeft: 8 }} />
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DrawerTable>
            </TokenInputBox>
          ) : null}
          {!!token && (
            <TokenInputBox>
              <Text>Deposit Token</Text>
              <TokenBalanceInput tokenType={token} amount={amount} setAmount={setAmount} disabled />
            </TokenInputBox>
          )}
          <Spacer />
          <Divider />
          <DrawerActionBox>
            <ActionDetail>
              <SecondaryText>Selected:</SecondaryText>
              <Text>{selectedTokens.length}</Text>
            </ActionDetail>
            {!approveCalls.isApproved ? (
              <Button type="primary" onClick={handleApproveClick} loading={approveCalls.isLoading}>
                Approve Collection
              </Button>
            ) : !mintCalls.isSuccess ? (
              <Button
                type="primary"
                onClick={handleCreatePoolClick}
                loading={mintCalls.isLoading}
                disabled={mintCalls.hasError || !mintCalls.mint}
              >
                Create Pool
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => push(`/collections/${collection?.value}`)}
                icon={<CheckCircleOutlined />}
              >
                View Collection
              </Button>
            )}
          </DrawerActionBox>
        </DrawerInbox>
      </Drawer>
      <StepBar
        step={2}
        total={2}
        title="Selecting Assets"
        cta={
          <Button type="primary" onClick={handleNextClick}>
            Create
          </Button>
        }
        onBack={onBack}
      />
      <Container>
        <TokenCollectionForm className="div1" title="Collection & Crypto" />
        <PoolRulesBox className="div2" title="Pool Rules" />
        {poolType === 'Token' ? null : (
          <SelectNFTBox
            className="div3"
            tokens={tokens}
            tokenLoading={isLoading}
            selected={selected}
            setSelected={setSelected}
            onSearch={setFilterId}
          />
        )}
        {poolType !== 'Trading' ? (
          <>
            <NFTCounterBox className="div4" />
            <PriceGraphBox className="div5" numPoints={20} />
          </>
        ) : null}
      </Container>
    </>
  );
}
