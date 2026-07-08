import {createNavigationContainerRef} from '@react-navigation/native';
import type {RootStackParamList} from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name as any, params);
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function resetToAuth() {
  if (navigationRef.isReady()) {
    navigationRef.reset({index: 0, routes: [{name: 'AuthNavigator'}]});
  }
}

export function resetToMain() {
  if (navigationRef.isReady()) {
    navigationRef.reset({index: 0, routes: [{name: 'MainTabNavigator'}]});
  }
}
