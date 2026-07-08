import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {Colors} from '../../theme/colors';

interface PINInputProps {
  length?: number;
  value: string;
  onPress: (digit: string) => void;
  onDelete: () => void;
  onSubmit?: () => void;
  error?: boolean;
  label?: string;
}

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', '⌫'],
];

export default function PINInput({
  length = 6,
  value,
  onPress,
  onDelete,
  onSubmit,
  error = false,
  label,
}: PINInputProps) {
  const shakeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (error) {
      Animated.sequence([
        Animated.timing(shakeAnim, {toValue: 10, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: -10, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: 8, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: -8, duration: 60, useNativeDriver: true}),
        Animated.timing(shakeAnim, {toValue: 0, duration: 60, useNativeDriver: true}),
      ]).start();
    }
  }, [error, shakeAnim]);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Dots */}
      <Animated.View style={[styles.dots, {transform: [{translateX: shakeAnim}]}]}>
        {Array.from({length}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < value.length && styles.dotFilled,
              error && styles.dotError,
            ]}
          />
        ))}
      </Animated.View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {KEYS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((key, ki) => {
              if (key === '') {
                return <View key={ki} style={styles.keyPlaceholder} />;
              }
              const isDelete = key === '⌫';
              return (
                <TouchableOpacity
                  key={ki}
                  style={[styles.key, isDelete && styles.keyDelete]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (isDelete) {
                      onDelete();
                    } else {
                      onPress(key);
                      if (value.length + 1 === length && onSubmit) {
                        setTimeout(onSubmit, 150);
                      }
                    }
                  }}>
                  <Text style={[styles.keyText, isDelete && styles.keyDeleteText]}>
                    {key}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  label: {
    color: Colors.onSurfaceVariant,
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 40,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dotError: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  keypad: {gap: 12},
  row: {flexDirection: 'row', gap: 20},
  key: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  keyDelete: {backgroundColor: Colors.surfaceContainerHighest},
  keyPlaceholder: {width: 72, height: 72},
  keyText: {fontSize: 22, color: Colors.onSurface, fontWeight: '300'},
  keyDeleteText: {fontSize: 20, color: Colors.primary},
});
