import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from './types';

import SessionPrepScreen from '../screens/sessions/SessionPrepScreen';
import BookingConfirmedScreen from '../screens/sessions/BookingConfirmedScreen';
import DigitalPassScreen from '../screens/sessions/DigitalPassScreen';
import UpcomingSessionScreen from '../screens/sessions/UpcomingSessionScreen';
import ArrivalVerificationScreen from '../screens/sessions/ArrivalVerificationScreen';
import ActiveSessionScreen from '../screens/sessions/ActiveSessionScreen';
import SafetyMonitorScreen from '../screens/sessions/SafetyMonitorScreen';
import CompleteSessionScreen from '../screens/sessions/CompleteSessionScreen';
import PostSessionFeedbackScreen from '../screens/sessions/PostSessionFeedbackScreen';
import TipGratuityScreen from '../screens/sessions/TipGratuityScreen';
import SessionHistoryScreen from '../screens/sessions/SessionHistoryScreen';
import PastSessionDetailScreen from '../screens/sessions/PastSessionDetailScreen';
import BookingHistoryScreen from '../screens/sessions/BookingHistoryScreen';
import DisputeRefundScreen from '../screens/sessions/DisputeRefundScreen';
import SessionCancelScreen from '../screens/sessions/SessionCancelScreen';
import ModifyBookingScreen from '../screens/sessions/ModifyBookingScreen';
const Stack = createNativeStackNavigator<SessionsStackParamList>();
export default function SessionsNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="BookingHistory">

      <Stack.Screen name="SessionPrep" component={SessionPrepScreen} />
      <Stack.Screen name="BookingConfirmed" component={BookingConfirmedScreen} />
      <Stack.Screen name="DigitalPass" component={DigitalPassScreen} />
      <Stack.Screen name="UpcomingSession" component={UpcomingSessionScreen} />
      <Stack.Screen name="ArrivalVerification" component={ArrivalVerificationScreen} />
      <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} />
      <Stack.Screen name="SafetyMonitor" component={SafetyMonitorScreen} />
      <Stack.Screen name="CompleteSession" component={CompleteSessionScreen} />
      <Stack.Screen name="PostSessionFeedback" component={PostSessionFeedbackScreen} />
      <Stack.Screen name="TipGratuity" component={TipGratuityScreen} />
      <Stack.Screen name="SessionHistory" component={SessionHistoryScreen} />
      <Stack.Screen name="PastSessionDetail" component={PastSessionDetailScreen} />
      <Stack.Screen name="BookingHistory" component={BookingHistoryScreen} />
      <Stack.Screen name="DisputeRefund" component={DisputeRefundScreen} />
      <Stack.Screen name="SessionCancel" component={SessionCancelScreen} />
      <Stack.Screen name="ModifyBooking" component={ModifyBookingScreen} />
    </Stack.Navigator>
  );
}
