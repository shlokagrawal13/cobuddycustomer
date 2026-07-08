import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'ghost';
}

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
  style,
  labelStyle,
  size = 'lg',
  variant = 'outline',
}: SecondaryButtonProps) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scaleAnim, {toValue: 0.97, useNativeDriver: true, speed: 50, bounciness: 0}).start();

  const onPressOut = () =>
    Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, speed: 50, bounciness: 4}).start();

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={[
          styles.base,
          variant === 'ghost' && styles.ghost,
          size === 'sm' && styles.sm,
          size === 'md' && styles.md,
          disabled && styles.disabled,
          style,
        ]}>
        <Text style={[styles.label, disabled && styles.labelDisabled, labelStyle]}>
          {label.toUpperCase()}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 999,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  sm: {height: 40, paddingHorizontal: 20},
  md: {height: 48, paddingHorizontal: 24},
  disabled: {opacity: 0.4},
  label: {
    ...Typography.labelLarge,
    color: Colors.onSurface,
    letterSpacing: 1.5,
  },
  labelDisabled: {color: Colors.onSurfaceVariant},
});
