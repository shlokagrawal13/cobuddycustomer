import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {RootStackParamList} from './types';
import {useAuthStore} from '../store/authStore';

import AuthNavigator from './AuthNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import VerifyNavigator from './VerifyNavigator';
import MainTabNavigator from './MainTabNavigator';
import SafetyNavigator from './SafetyNavigator';
import ModalNavigator from './ModalNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const {isAuthenticated, isOnboarded} = useAuthStore();

  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'none'}}>
      {!isAuthenticated ? (
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
      ) : !isOnboarded ? (
        <Stack.Screen name="OnboardingNavigator" component={OnboardingNavigator} />
      ) : (
        <Stack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      )}
      {/* Global overlays accessible from anywhere */}
      <Stack.Screen
        name="VerifyNavigator"
        component={VerifyNavigator}
        options={{presentation: 'modal', animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="SafetyNavigator"
        component={SafetyNavigator}
        options={{presentation: 'modal', animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="ModalNavigator"
        component={ModalNavigator}
        options={{presentation: 'fullScreenModal', animation: 'fade'}}
      />
    </Stack.Navigator>
  );
}
