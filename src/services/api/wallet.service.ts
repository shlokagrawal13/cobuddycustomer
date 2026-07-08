import {apiClient} from './client';
import {API_ENDPOINTS} from '../../constants/api';
export const walletService = {
  balance: () => apiClient.get(API_ENDPOINTS.WALLET_BALANCE),
  transactions: () => apiClient.get(API_ENDPOINTS.WALLET_TRANSACTIONS),
  paymentMethods: () => apiClient.get(API_ENDPOINTS.WALLET_PAYMENT_METHODS),
  addPaymentMethod: (body: unknown) => apiClient.post(API_ENDPOINTS.WALLET_ADD_PAYMENT_METHOD, body),
};
