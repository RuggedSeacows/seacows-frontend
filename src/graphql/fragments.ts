import { gql } from 'graphql-request';

export const pairFragment = gql`
  fragment PairFragment on Pair {
    id
    owner
    createdTx
    createdAt
    updatedAt
    nft
    erc20Contract
    bondingCurveAddress
    assetRecipient
    poolType
    delta
    fee
    spotPrice
    lastSalePrice
    nftIdInventory
    inventoryCount
    tokenLiquidity
  }
`;

export const tokenFragment = gql`
  fragment TokenFragment on Token {
    id
    name
    symbol
    decimals
  }
`;

export const collectionFragment = gql`
  fragment CollectionFragment on Collection {
    id
    name
    symbol
  }
`;

export const nftFragment = gql`
  fragment NFTFragment on NFT {
    id
    tokenId
  }
`;
