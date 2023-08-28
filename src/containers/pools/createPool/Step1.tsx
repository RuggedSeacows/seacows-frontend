import { Typography } from 'antd';
import React from 'react';
import { TradingPoolIcon } from 'src/components/icons/TradingPoolIcon';
import { NFTPoolIcon } from 'src/components/icons/NFTPoolIcon';
import { TokenPoolIcon } from 'src/components/icons/TokenPoolIcon';
import { PoolType } from 'src/types';
import { Container, OptionBox, TradingPoolBox, TopSection, SectionTitle, SectionText } from './Step1.styled';
import { StepBar } from './StepBar';

const { Title } = Typography;

interface Props {
  onNextStep: (type: PoolType) => unknown;
}

export function CreatePoolStep1({ onNextStep }: Props) {
  return (
    <div>
      <TopSection>
        <Title level={2}>Create Pool</Title>
        <SectionText>Provide liquidity to buy, sell, or trade NFTs on your behalf.</SectionText>
      </TopSection>
      <StepBar step={1} total={2} title="Selecting Pool Type" />
      <Container>
        <TradingPoolBox tabIndex={0} role="button" onClick={() => onNextStep('Trading')}>
          <TradingPoolIcon />
          <SectionTitle>+Create Trading Pool</SectionTitle>
          <SectionText>
            Become a liquidity provider, earn swap fees and SeaCows points. Withdraw your tokens/NFTs whenever you want.
          </SectionText>
        </TradingPoolBox>
        <OptionBox tabIndex={0} role="button" onClick={() => onNextStep('NFT')}>
          <NFTPoolIcon />
          <SectionTitle>+Create NFT Pool</SectionTitle>
          <SectionText>Sell NFTs for tokens</SectionText>
        </OptionBox>
        <OptionBox tabIndex={0} role="button" onClick={() => onNextStep('Token')}>
          <TokenPoolIcon />
          <SectionTitle>+Create Token Pool</SectionTitle>
          <SectionText>Sell NFTs for tokens</SectionText>
        </OptionBox>
      </Container>
    </div>
  );
}
