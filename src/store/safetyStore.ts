import {create} from 'zustand';
import type {SafetyState} from '../types/store.types';
import type {TrustedContact, IncidentReport} from '../types/models.types';

interface SafetyActions {
  setTrustedContacts: (list: TrustedContact[]) => void;
  addTrustedContact: (contact: TrustedContact) => void;
  removeTrustedContact: (id: string) => void;
  activateSOS: (sessionId?: string) => void;
  deactivateSOS: () => void;
  setLastCheckIn: (time: string) => void;
  setIncidentDraft: (draft: IncidentReport) => void;
  clearIncidentDraft: () => void;
  setSafetyScore: (score: number) => void;
}

const initialState: SafetyState = {
  trustedContacts: [], sosActive: false, sosSessionId: null,
  lastCheckIn: null, incidentDraft: null, safetyScore: null,
};

export const useSafetyStore = create<SafetyState & SafetyActions>()(set => ({
  ...initialState,
  setTrustedContacts: list => set({trustedContacts: list}),
  addTrustedContact: contact => set(state => ({trustedContacts: [...state.trustedContacts, contact]})),
  removeTrustedContact: id => set(state => ({trustedContacts: state.trustedContacts.filter(c => c.id !== id)})),
  activateSOS: sessionId => set({sosActive: true, sosSessionId: sessionId ?? null}),
  deactivateSOS: () => set({sosActive: false, sosSessionId: null}),
  setLastCheckIn: time => set({lastCheckIn: time}),
  setIncidentDraft: draft => set({incidentDraft: draft}),
  clearIncidentDraft: () => set({incidentDraft: null}),
  setSafetyScore: score => set({safetyScore: score}),
}));
