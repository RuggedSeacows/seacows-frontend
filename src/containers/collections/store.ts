import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type ViewTag = 'buy' | 'sell' | 'deposit' | 'withdraw';

export const isExpectedViewTag = (tag: string): tag is ViewTag =>
  tag === 'buy' || tag === 'sell' || tag === 'deposit' || tag === 'withdraw';

export interface CollectionViewStore {
  searchID: string;
  viewTag: ViewTag;

  setSearchID: (id: string) => unknown;
  setViewTag: (hash: ViewTag) => unknown;
}

export const useCollectionViewStore = create<CollectionViewStore>()(
  devtools((set) => ({
    searchID: '',
    viewTag: 'buy',

    setSearchID: (id) => set(() => ({ searchID: id })),
    setViewTag: (hash) => set(() => ({ viewTag: hash })),
  })),
);
