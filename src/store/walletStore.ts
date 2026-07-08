import {create} from 'zustand';
import type {WalletState} from '../types/store.types';
import type {Transaction, PaymentMethod, Reward} from '../types/models.types';
import type {MembershipTier} from '../types/common.types';

interface WalletActions {
  setBalance: (amount: number) => void;
  setCredits: (amount: number) => void;
  setTransactions: (list: Transaction[]) => void;
  prependTransaction: (tx: Transaction) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  setRewards: (list: Reward[]) => void;
  redeemReward: (id: string) => void;
  setLoyaltyPoints: (pts: number) => void;
  setMembershipTier: (tier: MembershipTier) => void;
  setLoading: (val: boolean) => void;
}

const initialState: WalletState = {
  balance: 0, currency: 'USD', credits: 0, transactions: [],
  paymentMethods: [], rewards: [], loyaltyPoints: 0, membershipTier: 'standard', isLoading: false,
};

export const useWalletStore = create<WalletState & WalletActions>()(set => ({
  ...initialState,
  setBalance: amount => set({balance: amount}),
  setCredits: amount => set({credits: amount}),
  setTransactions: list => set({transactions: list}),
  prependTransaction: tx => set(state => ({transactions: [tx, ...state.transactions]})),
  setPaymentMethods: methods => set({paymentMethods: methods}),
  addPaymentMethod: method => set(state => ({paymentMethods: [...state.paymentMethods, method]})),
  removePaymentMethod: id => set(state => ({paymentMethods: state.paymentMethods.filter(m => m.id !== id)})),
  setDefaultPaymentMethod: id => set(state => ({paymentMethods: state.paymentMethods.map(m => ({...m, isDefault: m.id === id}))})),
  setRewards: list => set({rewards: list}),
  redeemReward: id => set(state => ({rewards: state.rewards.map(r => r.id === id ? {...r, redeemed: true} : r)})),
  setLoyaltyPoints: pts => set({loyaltyPoints: pts}),
  setMembershipTier: tier => set({membershipTier: tier}),
  setLoading: val => set({isLoading: val}),
}));
