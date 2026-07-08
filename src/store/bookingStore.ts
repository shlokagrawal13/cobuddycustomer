import {create} from 'zustand';
import type {BookingState, CheckoutState} from '../types/store.types';
import type {Booking} from '../types/models.types';

interface BookingActions {
  setBookingHistory: (list: Booking[]) => void;
  setActiveBooking: (id: string | null) => void;
  updateCheckout: (partial: Partial<CheckoutState>) => void;
  setCheckoutStatus: (status: CheckoutState['status']) => void;
  clearCheckout: () => void;
  setLoading: (val: boolean) => void;
}

const initialCheckout: CheckoutState = {subtotal: 0, creditsApplied: 0, total: 0, status: 'idle'};
const initialState: BookingState = {bookingHistory: [], activeBookingId: null, checkout: initialCheckout, isLoading: false};

export const useBookingStore = create<BookingState & BookingActions>()(set => ({
  ...initialState,
  setBookingHistory: list => set({bookingHistory: list}),
  setActiveBooking: id => set({activeBookingId: id}),
  updateCheckout: partial => set(state => ({checkout: {...state.checkout, ...partial}})),
  setCheckoutStatus: status => set(state => ({checkout: {...state.checkout, status}})),
  clearCheckout: () => set({checkout: initialCheckout}),
  setLoading: val => set({isLoading: val}),
}));
