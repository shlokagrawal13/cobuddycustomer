import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

type StatusType = 'active' | 'pending' | 'verified' | 'error' | 'warning' | 'success' | 'info' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const STATUS_MAP: Record<StatusType, {bg: string; text: string; dot: string}> = {
  active:   {bg: 'rgba(109,217,140,0.15)', text: Colors.success,          dot: Colors.success},
  success:  {bg: 'rgba(109,217,140,0.15)', text: Colors.success,          dot: Colors.success},
  verified: {bg: 'rgba(242,202,80,0.15)',  text: Colors.primary,          dot: Colors.primary},
  pending:  {bg: 'rgba(137,180,224,0.15)', text: Colors.info,             dot: Colors.info},
  info:     {bg: 'rgba(137,180,224,0.15)', text: Colors.info,             dot: Colors.info},
  warning:  {bg: 'rgba(242,202,80,0.12)', text: Colors.warning,           dot: Colors.warning},
  error:    {bg: 'rgba(255,180,171,0.15)', text: Colors.error,            dot: Colors.error},
  neutral:  {bg: Colors.surfaceContainerHigh, text: Colors.onSurfaceVariant, dot: Colors.outlineVariant},
};

const STATUS_LABELS: Record<StatusType, string> = {
  active: 'Active', pending: 'Pending', verified: 'Verified',
  error: 'Error', warning: 'Warning', success: 'Success', info: 'Info', neutral: 'Neutral',
};

export default function StatusBadge({status, label, size = 'sm', style}: StatusBadgeProps) {
  const {bg, text, dot} = STATUS_MAP[status];
  const displayLabel = label ?? STATUS_LABELS[status];

  return (
    <View style={[styles.base, {backgroundColor: bg}, size === 'md' && styles.md, style]}>
      <View style={[styles.dot, {backgroundColor: dot}]} />
      <Text style={[styles.label, {color: text}, size === 'md' && styles.labelMd]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 5,
    alignSelf: 'flex-start',
  },
  md: {paddingHorizontal: 12, paddingVertical: 6},
  dot: {width: 5, height: 5, borderRadius: 3},
  label: {...Typography.labelSmall, fontWeight: '600', letterSpacing: 0.5},
  labelMd: {fontSize: 12},
});
