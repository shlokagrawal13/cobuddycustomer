import React from 'react';
import {View, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface TrustBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  style?: ViewStyle;
}

function getTrustTier(score: number): {label: string; color: string} {
  if (score >= 95) {return {label: 'Signature', color: '#e5e4e2'};}
  if (score >= 85) {return {label: 'Black', color: '#c9a227'};}
  if (score >= 70) {return {label: 'Verified', color: Colors.primary};}
  return {label: 'Standard', color: Colors.onSurfaceVariant};
}

export default function TrustBadge({score, size = 'md', showLabel = true, style}: TrustBadgeProps) {
  const {label, color} = getTrustTier(score);
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <View style={[styles.container, isSmall && styles.containerSm, isLarge && styles.containerLg, style]}>
      <View style={[styles.ring, {borderColor: color}]}>
        <Text style={[styles.score, {color}, isSmall && styles.scoreSm, isLarge && styles.scoreLg]}>
          {score.toFixed(0)}
        </Text>
      </View>
      {showLabel && (
        <View style={styles.meta}>
          <Text style={[styles.label, {color}]}>{label}</Text>
          <Text style={styles.sublabel}>Trust Score</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flexDirection: 'row', alignItems: 'center', gap: 10},
  containerSm: {gap: 6},
  containerLg: {gap: 14},
  ring: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
  },
  score: {...Typography.titleMedium, fontWeight: '700'},
  scoreSm: {fontSize: 11},
  scoreLg: {fontSize: 18},
  meta: {},
  label: {...Typography.labelLarge, fontWeight: '600', letterSpacing: 1},
  sublabel: {...Typography.labelSmall, color: Colors.onSurfaceVariant, marginTop: 2},
});
