import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ConciergeStackParamList} from './types';
import ConciergeDashboardScreen from '../screens/concierge/ConciergeDashboardScreen';
import MessagingThreadScreen from '../screens/concierge/MessagingThreadScreen';
import ChatMediaPickerScreen from '../screens/concierge/ChatMediaPickerScreen';
import VoiceVideoCallScreen from '../screens/concierge/VoiceVideoCallScreen';
import NotificationsScreen from '../screens/concierge/NotificationsScreen';
import NotificationPreferencesScreen from '../screens/concierge/NotificationPreferencesScreen';
import HelpCenterScreen from '../screens/concierge/HelpCenterScreen';
import HelpArticleScreen from '../screens/concierge/HelpArticleScreen';
import MediaPreviewScreen from '../screens/concierge/MediaPreviewScreen';
const Stack = createNativeStackNavigator<ConciergeStackParamList>();
export default function ConciergeNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="ConciergeDashboard">
      <Stack.Screen name="ConciergeDashboard" component={ConciergeDashboardScreen} />
      <Stack.Screen name="MessagingThread" component={MessagingThreadScreen} />
      <Stack.Screen name="ChatMediaPicker" component={ChatMediaPickerScreen} />
      <Stack.Screen name="VoiceVideoCall" component={VoiceVideoCallScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="HelpArticle" component={HelpArticleScreen} />
      <Stack.Screen name="MediaPreview" component={MediaPreviewScreen} />
    </Stack.Navigator>
  );
}
