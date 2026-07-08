import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
  onDismiss,
  style,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.actions}>
        {onRetry && <PrimaryButton label="Try Again" onPress={onRetry} style={styles.btn} />}
        {onDismiss && <SecondaryButton label="Dismiss" onPress={onDismiss} style={styles.btn} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32},
  icon: {fontSize: 48, marginBottom: 16},
  title: {...Typography.headlineSmall, color: Colors.onSurface, textAlign: 'center', marginBottom: 8},
  message: {...Typography.bodyMedium, color: Colors.onSurfaceVariant, textAlign: 'center'},
  actions: {gap: 12, width: '100%', marginTop: 24},
  btn: {},
});
