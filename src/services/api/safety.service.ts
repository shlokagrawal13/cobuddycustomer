import {apiClient} from './client';
import {API_ENDPOINTS} from '../../constants/api';
export const safetyService = {
  contacts: () => apiClient.get(API_ENDPOINTS.SAFETY_CONTACTS),
  activateSOS: (body: unknown) => apiClient.post(API_ENDPOINTS.SAFETY_SOS, body),
  submitReport: (body: unknown) => apiClient.post(API_ENDPOINTS.SAFETY_REPORT, body),
};
