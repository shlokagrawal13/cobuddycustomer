import {create} from 'zustand';
import type {UIState} from '../types/store.types';
import type {Toast} from '../types/common.types';

interface UIActions {
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setResolvedTheme: (theme: 'dark' | 'light') => void;
  showTabBar: () => void;
  hideTabBar: () => void;
  showSOSButton: () => void;
  hideSOSButton: () => void;
  pushToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  setActiveModal: (name: string | null) => void;
  setKeyboardVisible: (val: boolean) => void;
  setNetworkStatus: (status: 'online' | 'offline') => void;
}

const initialState: UIState = {
  theme: 'dark', resolvedTheme: 'dark', tabBarVisible: true, sosButtonVisible: false,
  toastQueue: [], activeModal: null, isKeyboardVisible: false, networkStatus: 'online',
};

let toastId = 0;

export const useUIStore = create<UIState & UIActions>()(set => ({
  ...initialState,
  setTheme: theme => set({theme}),
  setResolvedTheme: theme => set({resolvedTheme: theme}),
  showTabBar: () => set({tabBarVisible: true}),
  hideTabBar: () => set({tabBarVisible: false}),
  showSOSButton: () => set({sosButtonVisible: true}),
  hideSOSButton: () => set({sosButtonVisible: false}),
  pushToast: toast => set(state => ({toastQueue: [...state.toastQueue, {...toast, id: String(++toastId)}]})),
  dismissToast: id => set(state => ({toastQueue: state.toastQueue.filter(t => t.id !== id)})),
  setActiveModal: name => set({activeModal: name}),
  setKeyboardVisible: val => set({isKeyboardVisible: val}),
  setNetworkStatus: status => set({networkStatus: status}),
}));
