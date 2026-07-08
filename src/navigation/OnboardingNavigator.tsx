import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {OnboardingStackParamList} from './types';

import LegalConsentScreen from '../screens/onboarding/LegalConsentScreen';
import BasicProfileSetupScreen from '../screens/onboarding/BasicProfileSetupScreen';
import InterestSelectionScreen from '../screens/onboarding/InterestSelectionScreen';
import ComfortPreferencesScreen from '../screens/onboarding/ComfortPreferencesScreen';
import LifestylePersonalizationScreen from '../screens/onboarding/LifestylePersonalizationScreen';
import SafetyTutorialScreen from '../screens/onboarding/SafetyTutorialScreen';
import FirstRecommendationsScreen from '../screens/onboarding/FirstRecommendationsScreen';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}
      initialRouteName="LegalConsent">
      <Stack.Screen name="LegalConsent" component={LegalConsentScreen} />
      <Stack.Screen name="BasicProfileSetup" component={BasicProfileSetupScreen} />
      <Stack.Screen name="InterestSelection" component={InterestSelectionScreen} />
      <Stack.Screen name="ComfortPreferences" component={ComfortPreferencesScreen} />
      <Stack.Screen name="LifestylePersonalization" component={LifestylePersonalizationScreen} />
      <Stack.Screen name="SafetyTutorial" component={SafetyTutorialScreen} />
      <Stack.Screen name="FirstRecommendations" component={FirstRecommendationsScreen} />
    </Stack.Navigator>
  );
}
