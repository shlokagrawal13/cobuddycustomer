import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';

interface BottomActionBarProps {
  children: React.ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export default function BottomActionBar({children, style, noPadding = false}: BottomActionBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        !noPadding && {paddingBottom: Math.max(insets.bottom, 16)},
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.outlineVariant,
    paddingTop: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
});
