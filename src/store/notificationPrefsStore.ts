import {create} from 'zustand';

export type NotifToggles = Record<string, boolean>;
export type DigestOption = string;

interface NotificationPrefsState {
  toggles: NotifToggles;
  digest: DigestOption;
}

interface NotificationPrefsActions {
  setToggle: (id: string, value: boolean) => void;
  setDigest: (digest: DigestOption) => void;
  resetToDefaults: () => void;
}

const DEFAULT_TOGGLES: NotifToggles = {
  session: true,
  concierge: true,
  contacts: true,
  premium: true,
  rewards: true,
  community: false,
};

const DEFAULT_DIGEST: DigestOption = 'Daily Summary';

export const useNotificationPrefsStore = create<
  NotificationPrefsState & NotificationPrefsActions
>()(set => ({
  toggles: {...DEFAULT_TOGGLES},
  digest: DEFAULT_DIGEST,
  setToggle: (id, value) =>
    set(state => ({toggles: {...state.toggles, [id]: value}})),
  setDigest: digest => set({digest}),
  resetToDefaults: () =>
    set({toggles: {...DEFAULT_TOGGLES}, digest: DEFAULT_DIGEST}),
}));
