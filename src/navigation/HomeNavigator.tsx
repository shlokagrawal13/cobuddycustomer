import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {HomeStackParamList} from './types';
import HomeDashboardScreen from '../screens/home/HomeDashboardScreen';
import CompanionBrowseScreen from '../screens/home/CompanionBrowseScreen';
import ExploreScreen from '../screens/home/ExploreScreen';
import CompanionListingScreen from '../screens/home/CompanionListingScreen';
import CompanionProfileScreen from '../screens/home/CompanionProfileScreen';
import CompanionCalendarScreen from '../screens/home/CompanionCalendarScreen';
// BookingSummaryScreen registered here so CompanionCalendar → BookingSummary
// navigation works without fragile cross-tab getParent() chains.
import BookingSummaryScreen from '../screens/sessions/BookingSummaryScreen';
import VenueBrowseScreen from '../screens/home/VenueBrowseScreen';
import VenueDetailScreen from '../screens/home/VenueDetailScreen';
import ExperienceDetailScreen from '../screens/home/ExperienceDetailScreen';
import EventsBrowseScreen from '../screens/home/EventsBrowseScreen';
import EventDetailScreen from '../screens/home/EventDetailScreen';
import DiningDiscoveryScreen from '../screens/home/DiningDiscoveryScreen';
import TravelStaysScreen from '../screens/home/TravelStaysScreen';
import WellnessExperiencesScreen from '../screens/home/WellnessExperiencesScreen';
import MapNavigationScreen from '../screens/home/MapNavigationScreen';
import WishlistScreen from '../screens/home/WishlistScreen';
import CompanionFilterScreen from '../screens/home/CompanionFilterScreen';
const Stack = createNativeStackNavigator<HomeStackParamList>();
export default function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="HomeDashboard">
      <Stack.Screen name="HomeDashboard" component={HomeDashboardScreen} />
      <Stack.Screen name="Explore" component={ExploreScreen} />
      <Stack.Screen name="CompanionListing" component={CompanionListingScreen} />
      <Stack.Screen name="CompanionBrowse" component={CompanionBrowseScreen} />
      <Stack.Screen name="CompanionProfile" component={CompanionProfileScreen} />
      <Stack.Screen name="CompanionCalendar" component={CompanionCalendarScreen} />
      {/* BookingSummary in HomeStack: direct push from CompanionCalendar */}
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="VenueBrowse" component={VenueBrowseScreen} />
      <Stack.Screen name="VenueDetail" component={VenueDetailScreen} />
      <Stack.Screen name="ExperienceDetail" component={ExperienceDetailScreen} />
      <Stack.Screen name="EventsBrowse" component={EventsBrowseScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
      <Stack.Screen name="DiningDiscovery" component={DiningDiscoveryScreen} />
      <Stack.Screen name="TravelStays" component={TravelStaysScreen} />
      <Stack.Screen name="WellnessExperiences" component={WellnessExperiencesScreen} />
      <Stack.Screen name="MapNavigation" component={MapNavigationScreen} />
      <Stack.Screen name="CompanionFilter" component={CompanionFilterScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
    </Stack.Navigator>
  );
}
