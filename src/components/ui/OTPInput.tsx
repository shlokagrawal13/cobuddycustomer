import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  autoFocus?: boolean;
  error?: boolean;
}

export default function OTPInput({
  length = 6,
  value,
  onChange,
  autoFocus = true,
  error = false,
}: OTPInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const digits = value.split('');

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => inputRef.current?.focus()}
      style={styles.container}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={text => {
          const cleaned = text.replace(/\D/g, '').slice(0, length);
          onChange(cleaned);
        }}
        keyboardType="number-pad"
        maxLength={length}
        caretHidden
        style={styles.hiddenInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <View style={styles.boxes}>
        {Array.from({length}).map((_, i) => {
          const isActive = isFocused && digits.length === i;
          const isFilled = digits[i] !== undefined;
          return (
            <View
              key={i}
              style={[
                styles.box,
                isFilled && styles.boxFilled,
                isActive && styles.boxActive,
                error && styles.boxError,
              ]}>
              {isFilled ? (
                <Text style={styles.digit}>{digits[i]}</Text>
              ) : isActive ? (
                <View style={styles.cursor} />
              ) : null}
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {alignSelf: 'stretch'},
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  boxes: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  box: {
    width: 48,
    height: 60,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  boxActive: {
    borderColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  boxError: {
    borderColor: Colors.error,
  },
  digit: {
    ...Typography.headlineLarge,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  cursor: {
    width: 2,
    height: 24,
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
});
