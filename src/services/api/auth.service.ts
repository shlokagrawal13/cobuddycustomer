import {apiClient} from './client';
import {API_ENDPOINTS} from '../../constants/api';
export const authService = {
  sendOTP: (phone: string) => apiClient.post(API_ENDPOINTS.AUTH_SEND_OTP, {phone}),
  verifyOTP: (sessionId: string, otp: string) => apiClient.post(API_ENDPOINTS.AUTH_VERIFY_OTP, {sessionId, otp}),
  logout: () => apiClient.post(API_ENDPOINTS.AUTH_LOGOUT, {}),
};
