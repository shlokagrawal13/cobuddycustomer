import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {VerifyStackParamList} from './types';
import SelfieCaptureScreen from '../screens/verify/SelfieCaptureScreen';
import LivenessDetectionScreen from '../screens/verify/LivenessDetectionScreen';
import KYCDocumentUploadScreen from '../screens/verify/KYCDocumentUploadScreen';
import VerificationProcessingScreen from '../screens/verify/VerificationProcessingScreen';
import VerificationPendingScreen from '../screens/verify/VerificationPendingScreen';
import IdentityTrustCenterScreen from '../screens/verify/IdentityTrustCenterScreen';
import TrustScoreDashboardScreen from '../screens/verify/TrustScoreDashboardScreen';
const Stack = createNativeStackNavigator<VerifyStackParamList>();
export default function VerifyNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, presentation: 'modal'}} initialRouteName="IdentityTrustCenter">
      <Stack.Screen name="SelfieCapture" component={SelfieCaptureScreen} />
      <Stack.Screen name="LivenessDetection" component={LivenessDetectionScreen} />
      <Stack.Screen name="KYCDocumentUpload" component={KYCDocumentUploadScreen} />
      <Stack.Screen name="VerificationProcessing" component={VerificationProcessingScreen} />
      <Stack.Screen name="VerificationPending" component={VerificationPendingScreen} />
      <Stack.Screen name="IdentityTrustCenter" component={IdentityTrustCenterScreen} />
      <Stack.Screen name="TrustScoreDashboard" component={TrustScoreDashboardScreen} />
    </Stack.Navigator>
  );
}
