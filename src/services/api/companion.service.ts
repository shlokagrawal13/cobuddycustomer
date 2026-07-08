import {apiClient} from './client';
import {API_ENDPOINTS} from '../../constants/api';
export const companionService = {
  list: (params?: Record<string, unknown>) => apiClient.get(API_ENDPOINTS.COMPANIONS_LIST),
  detail: (id: string) => apiClient.get(API_ENDPOINTS.COMPANION_DETAIL.replace(':id', id)),
  availability: (id: string) => apiClient.get(API_ENDPOINTS.COMPANION_AVAILABILITY.replace(':id', id)),
};
