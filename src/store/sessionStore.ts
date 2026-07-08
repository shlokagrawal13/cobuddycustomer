import {create} from 'zustand';
import type {SessionState, BookingDraft} from '../types/store.types';
import type {Session} from '../types/models.types';

interface SessionActions {
  setActiveSession: (session: Session | null) => void;
  clearActiveSession: () => void;
  setUpcomingSessions: (sessions: Session[]) => void;
  appendHistorySession: (session: Session) => void;
  setBookingDraft: (draft: BookingDraft) => void;
  updateBookingDraft: (partial: Partial<BookingDraft>) => void;
  clearBookingDraft: () => void;
  setArrivalVerified: () => void;
  setSafetyCheckIn: (time: string) => void;
  setLoading: (val: boolean) => void;
}

const initialState: SessionState = {
  activeSession: null, upcomingSessions: [], sessionHistory: [],
  currentBookingDraft: null, isLoading: false,
};

export const useSessionStore = create<SessionState & SessionActions>()(set => ({
  ...initialState,
  setActiveSession: session => set({activeSession: session}),
  clearActiveSession: () => set({activeSession: null}),
  setUpcomingSessions: sessions => set({upcomingSessions: sessions}),
  appendHistorySession: session => set(state => ({sessionHistory: [session, ...state.sessionHistory]})),
  setBookingDraft: draft => set({currentBookingDraft: draft}),
  updateBookingDraft: partial => set(state => ({currentBookingDraft: state.currentBookingDraft ? {...state.currentBookingDraft, ...partial} : (partial as BookingDraft)})),
  clearBookingDraft: () => set({currentBookingDraft: null}),
  setArrivalVerified: () => set(state => ({activeSession: state.activeSession ? {...state.activeSession, arrivalVerified: true} : null})),
  setSafetyCheckIn: time => set(state => ({activeSession: state.activeSession ? {...state.activeSession, safetyCheckInTime: time} : null})),
  setLoading: val => set({isLoading: val}),
}));
