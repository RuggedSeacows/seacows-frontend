import { constants } from 'ethers';
import { TokenValue } from 'src/types';
import { Address } from 'wagmi';
import { mainnet, goerli } from 'wagmi/chains';
import { addresses, Environment } from '@yolominds/seacows-sdk';

export const supportedChains = [mainnet, goerli];
export const SITE_NAME = 'Seacows';
export type SupportedChainId = typeof supportedChains[number]['id'];

// AMM Trade Pair addresses
export const AMM_ADDRESSES = addresses[Environment.DEV];

console.log('AMM_ADDRESSES', AMM_ADDRESSES);

// Below are for Token, NFT pairs (v1.5 contracts)
export const ADDRESSES = {
  [goerli.id]: {
    LinearCurve: '0xb734610e62397c270a07dcB01D2230dc82b66e11' as Address,

    ExponentialCurve: '0x42235Ab4451FD3E4FF3f78f0d7AA20402F240160' as Address,

    TestWETH: '0x89382dba134a714B5121e7Fa6dc4C7783652ebc3' as Address,

    SeacowsPairERC721: '0xFaFAcF66361842044a035caB6d945Fac66243db6' as Address,

    SeacowsPairERC721Factory: '0xb8274191d606faf44d2465488e9a90093786069f' as Address,

    SeacowsRouterV1: '0xc144a6b4a1F616B53525166D660EDf5828f19f04' as Address,
  },
  // TO BE UPDATED
  [mainnet.id]: {
    LinearCurve: '0xb734610e62397c270a07dcB01D2230dc82b66e11' as Address,

    ExponentialCurve: '0x42235Ab4451FD3E4FF3f78f0d7AA20402F240160' as Address,

    TestWETH: '0x89382dba134a714B5121e7Fa6dc4C7783652ebc3' as Address,

    SeacowsPairERC721: '0xFaFAcF66361842044a035caB6d945Fac66243db6' as Address,

    SeacowsPairERC721Factory: '0xb8274191d606faf44d2465488e9a90093786069f' as Address,

    SeacowsRouterV1: '0xc144a6b4a1F616B53525166D660EDf5828f19f04' as Address,
  },
} as const;

const TOKEN_ADDRESSES = {
  [mainnet.id]: {
    ETH: constants.AddressZero as Address,
    WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    // NOT ENABLED
    USDT: undefined,
    USDC: undefined,
  },
  [goerli.id]: {
    ETH: constants.AddressZero as Address,
    // USDT: `0xbF42fb20703d2B32d4580EFA4BB20F2D4FacbBca` as Address,
    USDT: `0x2786bfda0764ec13bf58ee147fa385e08e92d533` as Address, // Used by Matt
    WETH: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6' as Address,
    // NOT ENABLED
    USDC: undefined,
  },
} as const;

export const getTokenAddress = (chainId: SupportedChainId | undefined, token: TokenValue | undefined) =>
  token && chainId ? TOKEN_ADDRESSES[chainId][token] : undefined;
