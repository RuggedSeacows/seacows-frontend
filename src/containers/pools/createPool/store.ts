import { CollectionValue } from 'src/components/common/Collection/SearchCollection';
import { TokenValue, PoolType, CurveType } from 'src/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

(BigInt.prototype as any).toJSON = function jsonToString() {
  return this.toString();
};

export interface CreatePoolState {
  poolType?: PoolType;
  curveType?: CurveType;
  startPrice?: number;
  delta?: number;
  swapFee?: number;
  token?: TokenValue;
  collection?: CollectionValue;
  collectionLoading: boolean;

  setPoolType: (type: PoolType) => unknown;
  setCurveType: (type: CurveType) => unknown;
  setStartPrice: (price: number) => unknown;
  setDelta: (delta: number) => unknown;
  setSwapFee: (fee: number) => unknown;
  setToken: (token: TokenValue) => unknown;
  setCollection: (collection: CollectionValue) => unknown;
  setCollectionLoading: (loading: boolean) => unknown;
}

export const useCreatePoolStore = create<CreatePoolState>()(
  devtools((set) => ({
    poolType: 'Trading',
    collectionLoading: false,
    swapFee: 1,
    curveType: 'cpmm',

    setPoolType: (type) =>
      set(() => ({
        poolType: type,
        curveType: type === 'Trading' ? 'cpmm' : type === 'NFT' || type === 'Token' ? 'linear' : undefined,
      })),
    setCurveType: (type) => set(() => ({ curveType: type })),
    setStartPrice: (price) => set(() => ({ startPrice: price })),
    setDelta: (delta) => set(() => ({ delta })),
    setSwapFee: (swapFee) => set(() => ({ swapFee })),
    setToken: (token) => set(() => ({ token })),
    setCollection: (collection) => set(() => ({ collection })),
    setCollectionLoading: (loading) => set(() => ({ collectionLoading: loading })),
  })),
);
