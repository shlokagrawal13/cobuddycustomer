import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {SafetyStackParamList} from './types';
import SafetyHubScreen from '../screens/safety/SafetyHubScreen';
import TrustedContactsScreen from '../screens/safety/TrustedContactsScreen';
import EmergencySOSScreen from '../screens/safety/EmergencySOSScreen';
import IncidentReportScreen from '../screens/safety/IncidentReportScreen';
import EditTrustedContactScreen from '../screens/safety/EditTrustedContactScreen';
import IncidentEvidenceUploadScreen from '../screens/safety/IncidentEvidenceUploadScreen';
const Stack = createNativeStackNavigator<SafetyStackParamList>();
export default function SafetyNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false, presentation: 'modal'}} initialRouteName="SafetyHub">
      <Stack.Screen name="SafetyHub" component={SafetyHubScreen} />
      <Stack.Screen name="TrustedContacts" component={TrustedContactsScreen} />
      <Stack.Screen name="EmergencySOS" component={EmergencySOSScreen} />
      <Stack.Screen name="IncidentReport" component={IncidentReportScreen} />
      <Stack.Screen name="EditTrustedContact" component={EditTrustedContactScreen} />
      <Stack.Screen name="IncidentEvidenceUpload" component={IncidentEvidenceUploadScreen} />
    </Stack.Navigator>
  );
}
