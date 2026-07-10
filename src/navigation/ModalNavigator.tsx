import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ModalStackParamList} from './types';
import IncomingCallScreen from '../screens/system/IncomingCallScreen';
import AccountDeactivatedScreen from '../screens/system/AccountDeactivatedScreen';
import CheckoutScreen from '../screens/system/CheckoutScreen';
import VIPEventReservationScreen from '../screens/system/VIPEventReservationScreen';
import PaymentProcessingScreen from '../screens/system/PaymentProcessingScreen';
import BookingRequestedScreen from '../screens/system/BookingRequestedScreen';
import BookingDeclinedScreen from '../screens/system/BookingDeclinedScreen';
import DeleteAccountScreen from '../screens/system/DeleteAccountScreen';
const Stack = createNativeStackNavigator<ModalStackParamList>();
export default function ModalNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, presentation: 'fullScreenModal'}} initialRouteName="Checkout">
      <Stack.Screen name="IncomingCall" component={IncomingCallScreen} />
      <Stack.Screen name="AccountDeactivated" component={AccountDeactivatedScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="VIPEventReservation" component={VIPEventReservationScreen} />
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} />
      <Stack.Screen name="BookingRequested" component={BookingRequestedScreen} />
      <Stack.Screen name="BookingDeclined" component={BookingDeclinedScreen} />
    </Stack.Navigator>
  );
}
