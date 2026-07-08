/**
 * IconButton — circular button wrapping the Icon component.
 *
 * Accepts either:
 *   iconName (string) → renders a proper vector icon via <Icon>
 *   emoji   (string)  → renders a <Text> fallback (transitional, for screens not yet migrated)
 *
 * Prefer iconName over emoji for all new usage.
 */
import React from 'react';
import {TouchableOpacity, Text, StyleSheet, ViewStyle} from 'react-native';
import {Colors} from '../../theme/colors';
import Icon, {IconLibrary} from './Icon';

interface IconButtonProps {
  /** Vector icon name (MaterialIcons by default). Preferred over emoji. */
  iconName?: string;
  /** Icon library to use when iconName is provided. */
  library?: IconLibrary;
  /** Emoji/text fallback — use only until migrated to iconName. */
  emoji?: string;
  onPress: () => void;
  size?: number;
  iconSize?: number;
  variant?: 'default' | 'primary' | 'ghost';
  style?: ViewStyle;
  disabled?: boolean;
  color?: string;
}

export default function IconButton({
  iconName,
  library = 'material',
  emoji,
  onPress,
  size = 44,
  iconSize = 22,
  variant = 'default',
  style,
  disabled = false,
  color,
}: IconButtonProps) {
  const iconColor =
    color ??
    (variant === 'primary' ? Colors.onPrimary : Colors.onSurface);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
      style={[
        styles.base,
        {width: size, height: size, borderRadius: size / 2},
        variant === 'primary' && styles.primary,
        variant === 'ghost'   && styles.ghost,
        disabled              && styles.disabled,
        style,
      ]}>
      {iconName ? (
        <Icon name={iconName} library={library} size={iconSize} color={iconColor} />
      ) : (
        <Text style={[styles.emoji, {color: iconColor}]}>{emoji ?? '?'}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  primary: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  disabled: {opacity: 0.4},
  emoji: {fontSize: 18},
});
