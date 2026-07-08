import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import {StyleSheet} from 'react-native';
import RootNavigator from '../navigation/RootNavigator';
import {navigationRef} from '../navigation/navigationRef';
import {linking} from '../navigation/linking';

// Must be called before any navigator renders
enableScreens(true);

export default function AppProviders() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef} linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1},
});
