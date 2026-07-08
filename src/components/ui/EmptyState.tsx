import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import PrimaryButton from './PrimaryButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export default function EmptyState({
  icon = '✦',
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <PrimaryButton label={actionLabel} onPress={onAction} style={styles.btn} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40},
  icon: {fontSize: 40, color: Colors.primary, marginBottom: 16, textAlign: 'center'},
  title: {...Typography.headlineSmall, color: Colors.onSurface, textAlign: 'center', marginBottom: 8},
  message: {...Typography.bodyMedium, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22},
  btn: {marginTop: 24, width: '100%'},
});
