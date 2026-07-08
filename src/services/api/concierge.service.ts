import {apiClient} from './client';
import {API_ENDPOINTS} from '../../constants/api';
export const conciergeService = {
  conversations: () => apiClient.get(API_ENDPOINTS.CONVERSATIONS_LIST),
  messages: (id: string) => apiClient.get(API_ENDPOINTS.CONVERSATION_MESSAGES.replace(':id', id)),
  sendMessage: (id: string, body: unknown) => apiClient.post(API_ENDPOINTS.MESSAGE_SEND.replace(':id', id), body),
  initiateCall: (body: unknown) => apiClient.post(API_ENDPOINTS.CALL_INITIATE, body),
  endCall: (id: string) => apiClient.post(API_ENDPOINTS.CALL_END.replace(':id', id), {}),
};
