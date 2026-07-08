import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {SearchStackParamList} from './types';
import SearchHubScreen from '../screens/search/SearchHubScreen';
import AIMatchFeedScreen from '../screens/search/AIMatchFeedScreen';
import CommunityBrowseScreen from '../screens/search/CommunityBrowseScreen';
import CommunityDetailScreen from '../screens/search/CommunityDetailScreen';
import ProfessionalCirclesScreen from '../screens/search/ProfessionalCirclesScreen';
const Stack = createNativeStackNavigator<SearchStackParamList>();
export default function SearchNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="SearchHub">
      <Stack.Screen name="SearchHub" component={SearchHubScreen} />
      <Stack.Screen name="AIMatchFeed" component={AIMatchFeedScreen} />
      <Stack.Screen name="CommunityBrowse" component={CommunityBrowseScreen} />
      <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
      <Stack.Screen name="ProfessionalCircles" component={ProfessionalCirclesScreen} />
    </Stack.Navigator>
  );
}
