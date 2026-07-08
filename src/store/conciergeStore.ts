import {create} from 'zustand';
import type {ConciergeState} from '../types/store.types';
import type {Conversation, Message, IncomingCall} from '../types/models.types';

interface ConciergeActions {
  setConversations: (list: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  appendMessage: (conversationId: string, message: Message) => void;
  markConversationRead: (id: string) => void;
  setIncomingCall: (call: IncomingCall | null) => void;
  clearIncomingCall: () => void;
  setActiveCall: (callId: string) => void;
  endCall: () => void;
  computeUnreadTotal: () => void;
  setLoadingConversations: (val: boolean) => void;
}

const initialState: ConciergeState = {
  conversations: [], activeConversationId: null, messages: {},
  incomingCall: null, activeCallId: null, unreadTotal: 0, isLoadingConversations: false,
};

export const useConciergeStore = create<ConciergeState & ConciergeActions>()(set => ({
  ...initialState,
  setConversations: list => set({conversations: list, unreadTotal: list.reduce((acc, c) => acc + c.unreadCount, 0)}),
  setActiveConversation: id => set({activeConversationId: id}),
  appendMessage: (conversationId, message) => set(state => ({messages: {...state.messages, [conversationId]: [...(state.messages[conversationId] ?? []), message]}})),
  markConversationRead: id => set(state => ({conversations: state.conversations.map(c => c.id === id ? {...c, unreadCount: 0} : c), unreadTotal: Math.max(0, state.unreadTotal - (state.conversations.find(c => c.id === id)?.unreadCount ?? 0))})),
  setIncomingCall: call => set({incomingCall: call}),
  clearIncomingCall: () => set({incomingCall: null}),
  setActiveCall: callId => set({activeCallId: callId, incomingCall: null}),
  endCall: () => set({activeCallId: null}),
  computeUnreadTotal: () => set(state => ({unreadTotal: state.conversations.reduce((acc, c) => acc + c.unreadCount, 0)})),
  setLoadingConversations: val => set({isLoadingConversations: val}),
}));
