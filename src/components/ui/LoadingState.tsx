import React from 'react';
import {View, Text, ActivityIndicator, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
  overlay?: boolean;
}

export default function LoadingState({
  message = 'Loading...',
  size = 'large',
  style,
  overlay = false,
}: LoadingStateProps) {
  return (
    <View style={[styles.container, overlay && styles.overlay, style]}>
      <View style={styles.card}>
        <ActivityIndicator color={Colors.primary} size={size} />
        {message ? <Text style={styles.message}>{message}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20,20,15,0.8)',
    zIndex: 100,
  },
  card: {alignItems: 'center', gap: 16},
  message: {
    ...Typography.bodyMedium,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
