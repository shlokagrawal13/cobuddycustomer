import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import type {MainTabParamList} from './types';
import HomeNavigator from './HomeNavigator';
import SearchNavigator from './SearchNavigator';
import SessionsNavigator from './SessionsNavigator';
import ConciergeNavigator from './ConciergeNavigator';
import ProfileNavigator from './ProfileNavigator';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Colors} from '../theme/colors';
import {useConciergeStore} from '../store/conciergeStore';
import {useSessionStore} from '../store/sessionStore';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Stitch icon set: explore / group / event_seat / support_agent / fingerprint
// Using emoji equivalents that match the Stitch visual language
const TAB_ICONS: Record<string, {active: string; inactive: string}> = {
  HomeNavigator:     {active: '⊕', inactive: '⊕'},
  SearchNavigator:   {active: '⊙', inactive: '⊙'},
  SessionsNavigator: {active: '◈', inactive: '◈'},
  ConciergeNavigator:{active: '✦', inactive: '✦'},
  ProfileNavigator:  {active: '◉', inactive: '◉'},
};

function TabIcon({
  routeName,
  focused,
  badge,
}: {
  routeName: string;
  focused: boolean;
  badge?: string | number;
}) {
  const icons = TAB_ICONS[routeName] ?? {active: '●', inactive: '○'};
  return (
    <View style={styles.iconWrap}>
      <Text style={[styles.iconText, focused && styles.iconFocused]}>
        {focused ? icons.active : icons.inactive}
      </Text>
      {badge !== undefined && badge !== null && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {typeof badge === 'number' && badge > 9 ? '9+' : String(badge)}
          </Text>
        </View>
      )}
    </View>
  );
}

export default function MainTabNavigator() {
  const unreadTotal  = useConciergeStore(s => s.unreadTotal);
  const activeSession = useSessionStore(s => s.activeSession);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.onSurfaceVariant,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
      }}>

      <Tab.Screen
        name="HomeNavigator"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({focused}) => (
            <TabIcon routeName="HomeNavigator" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="SearchNavigator"
        component={SearchNavigator}
        options={{
          tabBarLabel: 'Companions',
          tabBarIcon: ({focused}) => (
            <TabIcon routeName="SearchNavigator" focused={focused} />
          ),
        }}
      />

      <Tab.Screen
        name="SessionsNavigator"
        component={SessionsNavigator}
        options={{
          tabBarLabel: 'Sessions',
          tabBarIcon: ({focused}) => (
            <TabIcon
              routeName="SessionsNavigator"
              focused={focused}
              badge={activeSession ? '●' : undefined}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ConciergeNavigator"
        component={ConciergeNavigator}
        options={{
          tabBarLabel: 'Concierge',
          tabBarIcon: ({focused}) => (
            <TabIcon
              routeName="ConciergeNavigator"
              focused={focused}
              badge={unreadTotal > 0 ? unreadTotal : undefined}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileNavigator"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Identity',
          tabBarIcon: ({focused}) => (
            <TabIcon routeName="ProfileNavigator" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(28,28,22,0.92)',
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderTopWidth: StyleSheet.hairlineWidth,
    height: Platform.OS === 'ios' ? 88 : 72,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 10,
    // Stitch: floating pill style shadow
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 20,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconText: {
    fontSize: 20,
    color: Colors.onSurfaceVariant,
  },
  iconFocused: {
    color: Colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerLow,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 12,
  },
});
