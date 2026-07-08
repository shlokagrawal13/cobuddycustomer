import {Platform} from 'react-native';

const s = (elev: number, op: number) =>
  Platform.select({
    ios: {shadowColor: '#000', shadowOffset: {width: 0, height: elev / 2}, shadowOpacity: op, shadowRadius: elev},
    android: {elevation: elev},
  }) ?? {};

export const Shadows = {
  none: {},
  sm: s(2, 0.15),
  md: s(4, 0.2),
  lg: s(8, 0.25),
  xl: s(16, 0.3),
  gold: Platform.select({
    ios: {shadowColor: '#f2ca50', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 12},
    android: {elevation: 8},
  }) ?? {},
} as const;
