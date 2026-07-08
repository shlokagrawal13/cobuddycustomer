import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {AuthStackParamList} from './types';

// Placeholder screens — will be replaced with real implementations
import SplashScreen from '../screens/auth/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import WaitlistScreen from '../screens/auth/WaitlistScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import PhoneInputScreen from '../screens/auth/PhoneInputScreen';
import OTPVerificationScreen from '../screens/auth/OTPVerificationScreen';
import BiometricSetupScreen from '../screens/auth/BiometricSetupScreen';
import PINSetupScreen from '../screens/auth/PINSetupScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import LocationPermissionScreen from '../screens/auth/LocationPermissionScreen';
import NotificationPermissionScreen from '../screens/auth/NotificationPermissionScreen';
import PermissionRecoveryScreen from '../screens/auth/PermissionRecoveryScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Waitlist" component={WaitlistScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
      <Stack.Screen name="PINSetup" component={PINSetupScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="LocationPermission" component={LocationPermissionScreen} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
      <Stack.Screen name="PermissionRecovery" component={PermissionRecoveryScreen} />
    </Stack.Navigator>
  );
}
