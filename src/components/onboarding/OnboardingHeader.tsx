/**
 * OnboardingHeader — shared header for all 7 onboarding screens.
 *
 * Props:
 *  showBack     – show arrow-back button (left)
 *  onBack       – back handler
 *  centerLabel  – screen title rendered in Inter-SemiBold (NOT Playfair — Playfair is for body headlines)
 *  step         – e.g. "1 / 7" shown right-aligned
 *  showProgress – show thin gold progress bar below header
 *  totalSteps   – denominator for progress bar (default 7)
 *  currentStep  – numerator for progress bar (1-based)
 *  rightNode    – escape hatch for custom right content (overrides step)
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {Colors} from '../../theme/colors';
import Icon from '../ui/Icon';

interface OnboardingHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  centerLabel?: string;
  step?: string;           // e.g. "3 / 7"
  showProgress?: boolean;
  currentStep?: number;    // 1-based
  totalSteps?: number;     // default 7
  rightNode?: React.ReactNode;
  style?: ViewStyle;
}

export default function OnboardingHeader({
  showBack = false,
  onBack,
  centerLabel,
  step,
  showProgress = false,
  currentStep = 1,
  totalSteps = 7,
  rightNode,
  style,
}: OnboardingHeaderProps) {
  const progressPct = Math.min(1, currentStep / totalSteps);

  return (
    <View style={[styles.wrapper, style]}>
      {/* ── Row ── */}
      <View style={styles.container}>
        {/* Left — back button or spacer */}
        <View style={styles.side}>
          {showBack ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              activeOpacity={0.7}>
              <Icon name="arrow-back" size={18} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backPlaceholder} />
          )}
        </View>

        {/* Center — screen title */}
        <View style={styles.center}>
          {centerLabel ? (
            <Text style={styles.centerLabel} numberOfLines={1}>
              {centerLabel}
            </Text>
          ) : null}
        </View>

        {/* Right — step indicator or custom node */}
        <View style={[styles.side, styles.rightSide]}>
          {rightNode ?? (
            step ? (
              <Text style={styles.stepLabel}>{step}</Text>
            ) : (
              <View style={styles.backPlaceholder} />
            )
          )}
        </View>
      </View>

      {/* ── Progress bar (below header) ── */}
      {showProgress && (
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: `${progressPct * 100}%`}]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  side: {
    width: 56,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  rightSide: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {width: 40, height: 40},
  centerLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.onSurface,
    letterSpacing: 0.3,
  },
  stepLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.5,
  },
  // Progress bar
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
