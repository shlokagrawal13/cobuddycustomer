import {apiClient} from './client';
import {API_ENDPOINTS} from '../../constants/api';
export const bookingService = {
  create: (body: unknown) => apiClient.post(API_ENDPOINTS.BOOKINGS_CREATE, body),
  list: () => apiClient.get(API_ENDPOINTS.BOOKINGS_LIST),
  detail: (id: string) => apiClient.get(API_ENDPOINTS.BOOKING_DETAIL.replace(':id', id)),
  cancel: (id: string) => apiClient.post(API_ENDPOINTS.BOOKING_CANCEL.replace(':id', id), {}),
  dispute: (id: string, body: unknown) => apiClient.post(API_ENDPOINTS.BOOKING_DISPUTE.replace(':id', id), body),
};
