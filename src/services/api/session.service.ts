import {apiClient} from './client';
import {API_ENDPOINTS} from '../../constants/api';
export const sessionService = {
  verifyArrival: (id: string) => apiClient.post(API_ENDPOINTS.SESSION_ARRIVAL.replace(':id', id), {}),
  complete: (id: string) => apiClient.post(API_ENDPOINTS.SESSION_COMPLETE.replace(':id', id), {}),
  safetyCheckIn: (id: string) => apiClient.post(API_ENDPOINTS.SESSION_SAFETY_CHECKIN.replace(':id', id), {}),
  submitFeedback: (id: string, body: unknown) => apiClient.post(API_ENDPOINTS.SESSION_FEEDBACK.replace(':id', id), body),
  tip: (id: string, body: unknown) => apiClient.post(API_ENDPOINTS.SESSION_TIP.replace(':id', id), body),
};
