import {create} from 'zustand';
import type {AuthState} from '../types/store.types';

interface AuthActions {
  setAuthenticated: (token: string, userId: string, role: 'customer' | 'companion') => void;
  setOnboarded: () => void;
  setVerified: () => void;
  setLanguage: (lang: string) => void;
  setBiometricEnabled: (val: boolean) => void;
  setPINEnabled: (val: boolean) => void;
  setWaitlistStatus: (status: 'pending' | 'approved' | 'rejected') => void;
  setPhone: (phone: string) => void;
  logout: () => void;
}

const initialState: AuthState = {
  isAuthenticated: false, isOnboarded: false, isVerified: false,
  role: 'customer', userId: '', phone: '', sessionToken: '',
  biometricEnabled: false, pinEnabled: false, language: 'en', waitlistStatus: 'pending',
};

export const useAuthStore = create<AuthState & AuthActions>()(set => ({
  ...initialState,
  setAuthenticated: (token, userId, role) => set({isAuthenticated: true, sessionToken: token, userId, role}),
  setOnboarded: () => set({isOnboarded: true}),
  setVerified: () => set({isVerified: true}),
  setLanguage: lang => set({language: lang}),
  setBiometricEnabled: val => set({biometricEnabled: val}),
  setPINEnabled: val => set({pinEnabled: val}),
  setWaitlistStatus: status => set({waitlistStatus: status}),
  setPhone: phone => set({phone}),
  logout: () => set({...initialState}),
}));
