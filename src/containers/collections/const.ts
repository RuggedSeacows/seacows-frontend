import { useCollectionPoolTokens } from 'src/hooks/api/usePools';
import { PoolType, TokenValue } from 'src/types';
import { randomInRange } from 'src/utils/number';

export const priceSortOptions = [
  {
    value: 'lowToHigh',
    label: 'Price: Low to high',
  },
  {
    value: 'highToLow',
    label: 'Price: High to low',
  },
];

export const buyPoolFilterOptions = [
  {
    value: 'All',
    label: 'All Pools',
  },
  {
    value: 'NFT' as PoolType,
    label: 'NFT Pools Only',
  },
  {
    value: 'Trading' as PoolType,
    label: 'Trading Pools Only',
  },
];

export const placeholderNFTs = new Array(10).fill(0);
export const placeholderStyle = {
  width: 240,
  height: 300,
};

const WITHDRAW_PLACHOLDER = 'https://seacows-amm.s3.ap-southeast-1.amazonaws.com/withdraw-nft-placeholder.png';

export function makeNFTData(usePlaceholderImage = false, count = 25, poolType = 'NFT') {
  const images = [
    '0xdf0c6c2594926cbba34dc8631864b3cef36a3e1b8fb2624757187a14df324ce4',
    '0x682b198b900483cdbe1a031683df0195fa898e06a9d13403a4bd2db6c6ba6b87',
    '0xc1db97545ed4f72d382ef051859626abce73525d9bd53f3e4076a0b9520287d9',
    '0xcb32d31f12f7cc4719c345fc08a7266399696d51d3dd9ccb48192257abc04a15',
    '0xb7072bb771b356d68e77a2a64de87c3c48ee3fc258d9b81c1ad3d7310300c858',
    '0xd2ed97017b9eb0c4f2de884ff0a4b787e442cf5200d13701bb64217f7e61618a',
  ];

  return Array(count)
    .fill(0)
    .map((_, index) => ({
      image: usePlaceholderImage
        ? WITHDRAW_PLACHOLDER
        : `https://static.looksnice.org/0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258/${
            images[randomInRange(0, images.length - 1)]
          }`,
      name: usePlaceholderImage ? '# ?????' : `Otherdeed #${93723 + index}`,
      key: (93723 + index).toString(),
      tokenId: (93723 + index).toString(),
      price: {
        // value: (1.23 + index * randomInRange(1, 10) * 0.02) as number | undefined,
        token: 'ETH',
      } as { value: number; token: TokenValue },
      lastSale: {
        value: (1.11 + index * randomInRange(1, 8) * 0.03) as number | undefined,
        token: 'ETH',
      } as { value: number; token: TokenValue },
      rarity: randomInRange(100, 100000),
      poolType: (randomInRange(1, 1000) % 2 === 0 ? poolType : 'Trading') as PoolType,
    }));
}

type Data = ReturnType<typeof useCollectionPoolTokens>['pooledTokens'];

export const filterData = (data: Data, poolFilter?: string) =>
  data.filter((nft) =>
    poolFilter === 'NFT' ? nft.poolType === 'NFT' : poolFilter === 'Trading' ? nft.poolType === 'Trading' : true,
  );

export const sortData = (data: Data, sort?: string) =>
  data.sort((a, b) =>
    a?.price.value && b?.price.value
      ? (a.price.value - b.price.value) * (sort === 'lowToHigh' ? 1 : -1)
      : !a?.price
      ? -1
      : 1,
  );
