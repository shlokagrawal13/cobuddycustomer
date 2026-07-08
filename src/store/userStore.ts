import {create} from 'zustand';
import type {UserState} from '../types/store.types';
import type {UserProfile} from '../types/models.types';

interface UserActions {
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  setTrustScore: (score: number) => void;
  setAccountStatus: (status: 'active' | 'under_review' | 'suspended') => void;
  setLoading: (val: boolean) => void;
  clearProfile: () => void;
}

const initialState: UserState = {profile: null, trustScore: null, isLoading: false, accountStatus: 'active'};

export const useUserStore = create<UserState & UserActions>()(set => ({
  ...initialState,
  setProfile: profile => set({profile}),
  updateProfile: partial => set(state => ({profile: state.profile ? {...state.profile, ...partial} : null})),
  setTrustScore: score => set({trustScore: score}),
  setAccountStatus: status => set({accountStatus: status}),
  setLoading: val => set({isLoading: val}),
  clearProfile: () => set({...initialState}),
}));
