import { BigNumber } from 'ethers';
import { AMM_ADDRESSES } from 'src/app/config';
import { TokenValue } from 'src/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface BuyNote {
  tokenId: string;
  collection: string;
  image: string;
  pool?: {
    reserves: [BigNumber, BigNumber];
    fee: number;
    complementPrecision: BigNumber;
    protocolFeePercent: number;
    rate?: BigNumber | undefined;
    sellRate?: BigNumber | undefined;
    buyRate?: BigNumber | undefined;
    id: string;
  };
  price?: {
    token: TokenValue;
    value?: number;
  };
}

interface DepositNote {
  tokenId: string;
  collection: string;
  image: string;
}

type SellNote = DepositNote;

interface PairInfo {
  address: string;
  collection: string;
  fee: number;
  tokenId: string | null;
  price: number;
  liquidity?: BigNumber;
}

interface CartSettings {
  slippage: 'Auto' | number;
  deadline: number; // minutes
}

type CartType = 'buy' | 'sell' | 'deposit' | 'withdraw';
type ItemNote<T> = T extends 'buy'
  ? BuyNote
  : T extends 'sell'
  ? SellNote
  : T extends 'deposit'
  ? DepositNote
  : DepositNote;

type SelectionStatus = Record<string, boolean>;

export const PayTokenOptions = ['ETH', 'WETH'] as const;
type PayTokenOption = typeof PayTokenOptions[number];

export interface CartStore {
  open: boolean;
  type: CartType;
  manager: string; // Position Manager contract address
  items: {
    buy: BuyNote[];
    sell: SellNote[];
    deposit: DepositNote[];
    withdraw: DepositNote[];
  };
  selections: {
    [type in CartType]: SelectionStatus;
  };
  withdraw: {
    step: number;
    percentage: number;
    maxTokenLimit: number;
    maxTokenIn: BigNumber;
  };
  sell: {
    bestRate?: BigNumber;
    bestPair?: string;
    poolLength?: number;
  };
  pair?: PairInfo;
  token?: TokenValue;
  settings: CartSettings;
  tokenOption: PayTokenOption;
  setCartOpen: (open: boolean) => unknown;
  setCartType: (type: CartType) => unknown;
  setToken: (token: TokenValue) => unknown;
  setManager: (manger: string) => unknown;
  setPairInfo: (info: PairInfo) => unknown;

  setSelection: (arg: SelectionStatus | ((selection: SelectionStatus) => SelectionStatus)) => unknown;

  setWithdrawSettings: (obj: Partial<CartStore['withdraw']>) => unknown;
  setSellData: (obj: Partial<CartStore['sell']>) => unknown;

  // Update Cart Data
  addItemToCart: <T extends CartType>(type: T, note: ItemNote<T>) => unknown;
  removeItemFromCart: (type: CartType, tokenId: string) => unknown;
  fillItemsToCart: <T extends CartType>(type: T, notes: ItemNote<T>[]) => unknown;

  // Update cart Settings
  setSettings: (settings: Partial<CartSettings>) => unknown;

  // Cart inner actions
  clearAllItems: (type?: CartType) => unknown;
  clearItem: (item: BuyNote) => unknown;

  setTokenOption: (tokenOption: PayTokenOption) => unknown;
}

export const useCartStore = create<CartStore>()(
  devtools((set) => ({
    open: false,
    manager: AMM_ADDRESSES[5].manager,
    token: 'ETH',
    type: 'buy',
    settings: {
      slippage: 'Auto',
      deadline: 30,
    },
    items: {
      buy: [],
      sell: [],
      deposit: [],
      withdraw: [],
    },
    selections: {
      buy: {},
      sell: {},
      deposit: {},
      withdraw: {},
    },
    withdraw: {
      step: 0,
      percentage: 0,
      maxTokenLimit: 0,
      maxTokenIn: BigNumber.from(0),
    },
    sell: {},
    tokenOption: 'ETH',
    setCartOpen: (op) => set(() => ({ open: op })),
    setCartType: (type) => set(() => ({ type })),
    setToken: (token) => set(() => ({ token })),
    setManager: (manager) => set(() => ({ manager })),
    setPairInfo: (info) => set(() => ({ pair: info })),

    setWithdrawSettings: (obj: Partial<CartStore['withdraw']>) =>
      set((state) => ({
        ...state,
        withdraw: {
          ...state.withdraw,
          ...obj,
        },
      })),

    setSellData: (obj: Partial<CartStore['sell']>) =>
      set((state) => ({
        ...state,
        sell: {
          ...state.sell,
          ...obj,
        },
      })),

    // Update cart settings
    setSettings: (settings: Partial<CartSettings>) =>
      set((state) => ({
        ...state,
        settings: {
          ...state.settings,
          ...settings,
        },
      })),

    // Update Cart Data
    addItemToCart: <T extends CartType>(type: T, note: ItemNote<T>) =>
      set((state) => ({
        items: {
          ...state.items,
          [type]: [...state.items[type], note].slice(
            0,
            state.type === 'withdraw' ? state.withdraw.maxTokenLimit : state.items[type].length + 1,
          ),
        },
      })),
    removeItemFromCart: (type: CartType, tokenId: string) =>
      set((state) => ({
        items: {
          ...state.items,
          [type]: state.items[type].filter((nft) => nft.tokenId !== tokenId),
        },
      })),
    fillItemsToCart: <T extends CartType>(type: T, notes: ItemNote<T>[]) =>
      set((state) => ({
        type,
        items: {
          ...state.items,
          [type]: notes.slice(0, state.type === 'withdraw' ? state.withdraw.maxTokenLimit : notes.length),
        },
      })),

    // Update item selection
    setSelection: (arg: SelectionStatus | ((selection: SelectionStatus) => SelectionStatus)) => {
      if (typeof arg === 'function') {
        set((state) => {
          const prevState = state.selections[state.type];
          return {
            selections: {
              ...state.selections,
              [state.type]: arg(prevState),
            },
          };
        });
      } else {
        set((state) => ({
          selections: {
            ...state.selections,
            [state.type]: arg,
          },
        }));
      }
    },

    // Inner actions
    clearAllItems: (type?: CartType) =>
      set((state) => ({
        items: {
          ...state.items,
          [type || state.type]: [],
        },
        selections: {
          ...state.selections,
          [type || state.type]: {},
        },
      })),
    clearItem: (item: BuyNote) =>
      set((state) => ({
        items: {
          ...state.items,
          [state.type]: state.items[state.type].filter((nft) => nft.tokenId !== item.tokenId),
        },
        selections: {
          ...state.selections,
          [state.type]: {
            ...state.selections[state.type],
            [item.tokenId]: false,
          },
        },
      })),

    setTokenOption: (tokenOption: PayTokenOption) => set((state) => ({ ...state, tokenOption })),
  })),
);

export const getSlippageNumber = (slippage: CartSettings['slippage']) => (slippage === 'Auto' ? 10 : slippage);
