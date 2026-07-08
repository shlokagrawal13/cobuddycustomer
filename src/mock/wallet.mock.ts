import type {Transaction, PaymentMethod} from '../types/models.types';
export const MOCK_TRANSACTIONS: Transaction[] = [
  {id: 'tx_001', type: 'charge', amount: 55000, currency: 'USD',
   description: 'Session with Sophia Laurent', date: new Date().toISOString(),
   status: 'completed', bookingId: 'bk_001'},
];
export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {id: 'pm_001', type: 'card', last4: '4242', brand: 'Visa',
   expiryMonth: 12, expiryYear: 2027, isDefault: true},
];
