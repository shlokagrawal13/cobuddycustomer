import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  glow?: boolean;
  variant?: 'default' | 'elevated' | 'outlined';
}

export default function GlassCard({
  children,
  style,
  glow = false,
  variant = 'default',
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.base,
        variant === 'elevated' && styles.elevated,
        variant === 'outlined' && styles.outlined,
        glow && styles.glow,
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  elevated: {
    backgroundColor: Colors.surfaceContainerHigh,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  outlined: {
    backgroundColor: 'rgba(20,20,15,0.6)',
    borderColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
});
