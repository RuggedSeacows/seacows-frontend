import { Button, Typography } from 'antd';
import { shallow } from 'zustand/shallow';
import React, { useMemo } from 'react';
import { CloseCircleOutlined } from '@ant-design/icons';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import {
  useAddLiquidity,
  useApproveCollection,
  useApproveToken,
  useBuyNFTs,
  useSellNFTs,
  useConnectedNetwork,
  useRemoveLiquidity,
  useMintLiquidity,
} from 'src/hooks';
import { AMM_ADDRESSES } from 'src/app/config';
import { useQueryClient } from '@tanstack/react-query';
import { WithdrawBox } from './WithdrawBox';
import { useCartStore } from './store';
import { Container, Spacer, CartInbox, CartTable, ActionDetail } from './CartBox.styled';
import { useDepositTokenAmount, useRouterBuyParams, useRouterSellParams, useWithdrawTokenAmount } from './utils';
import { CartAction } from './CartAction';

const { Title, Text } = Typography;

export function CartBox() {
  const queryClient = useQueryClient();
  const { chainId } = useConnectedNetwork();
  const [type, manager, tokenOption, pair, token, tokens, withdrawPercentage, withdrawTokenIn] = useCartStore(
    (state) => [
      state.type,
      state.manager,
      state.tokenOption,
      state.pair,
      state.token,
      state.items[state.type],
      state.withdraw.percentage,
      state.withdraw.maxTokenIn,
    ],
    shallow,
  );
  const [clearAllItems, clearItem] = useCartStore((state) => [state.clearAllItems, state.clearItem], shallow);
  const isWithdraw = type === 'withdraw';
  const isSwap = type === 'buy' || type === 'sell';

  const tokenIds = useMemo(() => tokens.map((t) => BigNumber.from(t.tokenId)), [tokens]);

  const buyParams = useRouterBuyParams();
  const sellParams = useRouterSellParams();
  const depositArgs = useDepositTokenAmount(type === 'deposit', tokenIds);
  const withdrawArgs = useWithdrawTokenAmount(type === 'withdraw', withdrawPercentage);
  const totalPrice =
    type === 'buy'
      ? buyParams.amountsToShow.reduce((acc, amount) => acc.add(amount), BigNumber.from(0))
      : type === 'sell' && sellParams?.tokenOutMin
      ? sellParams.tokenOutMin
      : type === 'deposit'
      ? depositArgs.tokenInMax
      : type === 'withdraw'
      ? withdrawTokenIn
      : BigNumber.from(0);

  const operator =
    chainId === 5 ? (isSwap ? AMM_ADDRESSES[chainId].router : AMM_ADDRESSES[chainId].manager) : undefined;
  const tokenAddress = chainId === 5 ? AMM_ADDRESSES[chainId].weth : undefined;
  const collectionApproveCalls = useApproveCollection(tokens[0]?.collection, operator, true);
  const tokenApproveCalls = useApproveToken(tokenOption === 'ETH' ? undefined : tokenAddress, operator, totalPrice);

  const buyCalls = useBuyNFTs(
    type === 'buy',
    AMM_ADDRESSES[5].router,
    buyParams.pairs,
    buyParams.tokenIds,
    buyParams.amounts,
    useMemo(
      () => ({
        onSuccess: () => {
          clearAllItems('buy');
          queryClient.invalidateQueries({ queryKey: ['subgraph', 'getAMMPoolsByNFTAddress'] });
        },
      }),
      [clearAllItems, queryClient],
    ),
  );
  const sellCalls = useSellNFTs(
    type === 'sell',
    AMM_ADDRESSES[5].router,
    sellParams?.pair,
    tokenIds,
    sellParams?.tokenOutMinWithSlippage,
    useMemo(
      () => ({
        onSuccess: () => {
          clearAllItems('sell');
          queryClient.invalidateQueries({ queryKey: ['api', 'getUserOwnedTokens'] });
        },
      }),
      [clearAllItems, queryClient],
    ),
  );
  const depositCalls = useAddLiquidity(
    type === 'deposit' && !!pair?.tokenId && !!collectionApproveCalls.isApproved,
    manager,
    pair?.collection,
    pair?.fee,
    pair?.tokenId && pair?.tokenId !== null ? BigNumber.from(pair.tokenId) : undefined,
    tokenIds,
    depositArgs.tokenInMax,
    depositArgs.tokenInMaxWithSlippage,
    useMemo(
      () => ({
        onSuccess: () => {
          clearAllItems('deposit');
          queryClient.invalidateQueries({ queryKey: ['api', 'getUserOwnedTokens'] });
        },
      }),
      [clearAllItems, queryClient],
    ),
  );
  const mintCalls = useMintLiquidity(
    type === 'deposit' && pair?.tokenId === null && !!collectionApproveCalls.isApproved,
    tokenOption,
    manager,
    pair?.collection,
    pair?.fee,
    tokenIds,
    depositArgs.tokenInMax,
    depositArgs.tokenInMaxWithSlippage,
    useMemo(
      () => ({
        onSuccess: () => {
          clearAllItems('deposit');
          queryClient.invalidateQueries({ queryKey: ['api', 'getUserOwnedTokens'] });
        },
      }),
      [clearAllItems, queryClient],
    ),
  );

  const withdrawCalls = useRemoveLiquidity(
    type === 'withdraw',
    manager,
    pair?.collection,
    pair?.fee,
    pair?.liquidity ? pair.liquidity.mul(withdrawPercentage).div(100) : BigNumber.from(0),
    BigNumber.from(pair?.tokenId || 0),
    {
      cNftOutMin: withdrawArgs.cNftOutMin,
      cTokenOutMin: withdrawArgs.cTokenOutMin,
      nftIds: tokenIds,
      tokenInMax: withdrawTokenIn,
    },
    useMemo(
      () => ({
        onSuccess: () => {
          clearAllItems('withdraw');
          queryClient.invalidateQueries({ queryKey: ['subgraph', 'getAMMPositionsByOwnerOrSlotIds'] });
        },
      }),
      [clearAllItems, queryClient],
    ),
  );

  // if (type === 'withdraw') console.log('withdrawCalls', pair, withdrawCalls);

  const getCartAction = () => {
    if (
      (type === 'buy' || type === 'deposit' || type === 'withdraw') &&
      tokenOption !== 'ETH' &&
      !tokenApproveCalls.isApproved
    ) {
      return {
        action: 'Approve Token',
        loading: tokenApproveCalls.isLoading,
        disabled: tokenApproveCalls.isLoading || !tokenApproveCalls.approve,
        onClick: tokenApproveCalls.approve,
      };
    }

    if ((type === 'sell' || type === 'deposit') && !collectionApproveCalls.isApproved) {
      return {
        action: 'Approve Collection',
        loading: collectionApproveCalls.isLoading,
        disabled: collectionApproveCalls.isLoading || !collectionApproveCalls.approve,
        onClick: collectionApproveCalls.approve,
      };
    }

    if (type === 'buy') {
      return {
        action: 'Buy Now',
        loading: buyCalls.isLoading,
        disabled: buyCalls.isLoading || !buyCalls.buy,
        onClick: buyCalls.buy,
      };
    }

    if (type === 'deposit') {
      if (pair?.tokenId === null) {
        return {
          action: 'Deposit Now',
          loading: mintCalls.isLoading,
          disabled: mintCalls.isLoading || !mintCalls.mint,
          onClick: mintCalls.mint,
        };
      }

      return {
        action: 'Deposit Now',
        loading: depositCalls.isLoading,
        disabled: depositCalls.isLoading || !depositCalls.addLiquidity,
        onClick: depositCalls.addLiquidity,
      };
    }

    if (type === 'sell') {
      return {
        action: 'Sell Now',
        loading: sellCalls.isLoading,
        disabled: sellCalls.isLoading || !sellCalls.buy,
        onClick: sellCalls.buy,
      };
    }

    if (type === 'withdraw') {
      return {
        action: 'Withdraw Now',
        loading: withdrawCalls.isLoading,
        disabled: withdrawCalls.isLoading || !withdrawCalls.removeLiquidity,
        onClick: withdrawCalls.removeLiquidity,
      };
    }

    return {
      action: '',
      loading: false,
      disabled: false,
      onClick: () => {},
    };
  };

  return (
    <Container>
      <ActionDetail>
        <Title level={4}>
          {type === 'buy'
            ? 'Buy Selected'
            : type === 'sell'
            ? 'Sell Selected'
            : type === 'deposit'
            ? 'Deposit'
            : type === 'withdraw'
            ? 'Withdraw'
            : 'Cart'}
        </Title>
        {!isWithdraw && (
          <Button type="ghost" onClick={() => clearAllItems()}>
            Clear All
          </Button>
        )}
      </ActionDetail>
      <CartInbox>
        {!isWithdraw && tokens.length > 0 ? (
          <CartTable>
            <thead>
              <tr>
                <th>
                  <Text>NFT</Text>
                </th>
                <th>{/* <Text>Price</Text> */}</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((t, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img src={t.image} alt={t.tokenId} style={{ width: 32, marginRight: 8, borderRadius: 2 }} />
                      <Text>{`#${t.tokenId}`}</Text>
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      icon={<CloseCircleOutlined style={{ color: 'rgba(255, 255, 255, 0.45)' }} />}
                      type="ghost"
                      onClick={() => clearItem(t)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </CartTable>
        ) : null}
        {isWithdraw && (
          <WithdrawBox
            args={withdrawArgs}
            action={getCartAction().action}
            actionDisabled={getCartAction().disabled}
            actionLoading={getCartAction().loading}
            onActionClick={getCartAction().onClick}
          />
        )}
        <Spacer />
        {!isWithdraw && (
          <CartAction
            amount={tokens.length}
            averagePrice={tokens.length > 0 ? formatEther(totalPrice.div(BigNumber.from(tokens.length))) : '0'}
            payToken={token || ''}
            tokenBalance={buyCalls.tokenBalance}
            totalPay={formatEther(totalPrice)}
            action={getCartAction().action}
            actionDisabled={getCartAction().disabled}
            actionLoading={getCartAction().loading}
            onActionClick={getCartAction().onClick}
          />
        )}
      </CartInbox>
    </Container>
  );
}
