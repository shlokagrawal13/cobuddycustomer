import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
}

export default function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  labelStyle,
  size = 'lg',
}: PrimaryButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          styles.base,
          size === 'sm' && styles.sm,
          size === 'md' && styles.md,
          isDisabled && styles.disabled,
          style,
        ]}>
        {loading ? (
          <ActivityIndicator color={Colors.onPrimary} size="small" />
        ) : (
          <Text style={[styles.label, size === 'sm' && styles.labelSm, labelStyle]}>
            {label.toUpperCase()}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  sm: {height: 40, paddingHorizontal: 20},
  md: {height: 48, paddingHorizontal: 24},
  disabled: {
    backgroundColor: Colors.primaryContainer,
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  label: {
    ...Typography.labelLarge,
    color: Colors.onPrimary,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  labelSm: {
    ...Typography.labelSmall,
    letterSpacing: 1.2,
  },
});
