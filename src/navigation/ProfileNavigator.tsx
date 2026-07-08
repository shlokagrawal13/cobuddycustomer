import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from './types';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RewardsDashboardScreen from '../screens/profile/RewardsDashboardScreen';
import RewardRedemptionScreen from '../screens/profile/RewardRedemptionScreen';
import MembershipTiersScreen from '../screens/profile/MembershipTiersScreen';
import TierUpgradeScreen from '../screens/profile/TierUpgradeScreen';
import MembershipCancelScreen from '../screens/profile/MembershipCancelScreen';
import WalletScreen from '../screens/profile/WalletScreen';
import TransactionHistoryScreen from '../screens/profile/TransactionHistoryScreen';
import TransactionDetailScreen from '../screens/profile/TransactionDetailScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import ReferralProgramScreen from '../screens/profile/ReferralProgramScreen';
import ReferralTrackingScreen from '../screens/profile/ReferralTrackingScreen';
import SettingsHubScreen from '../screens/profile/SettingsHubScreen';
import LifestylePreferencesScreen from '../screens/profile/LifestylePreferencesScreen';
import AppearanceScreen from '../screens/profile/AppearanceScreen';
import BlockedUsersScreen from '../screens/profile/BlockedUsersScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import PermissionRecoveryScreen from '../screens/auth/PermissionRecoveryScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePhoneScreen from '../screens/profile/ChangePhoneScreen';
import AddPaymentMethodScreen from '../screens/profile/AddPaymentMethodScreen';
import TextSizeScreen from '../screens/profile/TextSizeScreen';
import ReceiptViewerScreen from '../screens/profile/ReceiptViewerScreen';
import DataPortabilityScreen from '../screens/profile/DataPortabilityScreen';
import DataRetentionScreen from '../screens/profile/DataRetentionScreen';
import ConsentManagerScreen from '../screens/profile/ConsentManagerScreen';
import SetDefaultPaymentScreen from '../screens/profile/SetDefaultPaymentScreen';
import InviteContactScreen from '../screens/profile/InviteContactScreen';
const Stack = createNativeStackNavigator<ProfileStackParamList>();
export default function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="RewardsDashboard" component={RewardsDashboardScreen} />
      <Stack.Screen name="RewardRedemption" component={RewardRedemptionScreen} />
      <Stack.Screen name="MembershipTiers" component={MembershipTiersScreen} />
      <Stack.Screen name="TierUpgrade" component={TierUpgradeScreen} />
      <Stack.Screen name="MembershipCancel" component={MembershipCancelScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="ReferralProgram" component={ReferralProgramScreen} />
      <Stack.Screen name="ReferralTracking" component={ReferralTrackingScreen} />
      <Stack.Screen name="SettingsHub" component={SettingsHubScreen} />
      <Stack.Screen name="LifestylePreferences" component={LifestylePreferencesScreen} />
      <Stack.Screen name="Appearance" component={AppearanceScreen} />
      <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="PermissionRecovery" component={PermissionRecoveryScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePhone" component={ChangePhoneScreen} />
      <Stack.Screen name="AddPaymentMethod" component={AddPaymentMethodScreen} />
      <Stack.Screen name="TextSize" component={TextSizeScreen} />
      <Stack.Screen name="ReceiptViewer" component={ReceiptViewerScreen} />
      <Stack.Screen name="DataPortability" component={DataPortabilityScreen} />
      <Stack.Screen name="DataRetention" component={DataRetentionScreen} />
      <Stack.Screen name="ConsentManager" component={ConsentManagerScreen} />
      <Stack.Screen name="SetDefaultPayment" component={SetDefaultPaymentScreen} />
      <Stack.Screen name="InviteContact" component={InviteContactScreen} />
    </Stack.Navigator>
  );
}
