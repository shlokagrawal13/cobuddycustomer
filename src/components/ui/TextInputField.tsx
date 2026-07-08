import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Animated,
  Platform,
} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'phone-pad' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoFocus?: boolean;
  maxLength?: number;
  editable?: boolean;
  style?: ViewStyle;
  rightElement?: React.ReactNode;
  onSubmitEditing?: () => void;
  returnKeyType?: 'done' | 'next' | 'go' | 'search' | 'send';
}

export default function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoFocus = false,
  maxLength,
  editable = true,
  style,
  rightElement,
  onSubmitEditing,
  returnKeyType = 'done',
}: TextInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const focusAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? Colors.error : Colors.outlineVariant,
      error ? Colors.error : Colors.primary,
    ],
  });

  return (
    <View style={[styles.wrapper, style]}>
      <Text style={[styles.label, isFocused && styles.labelFocused, error ? styles.labelError : null]}>
        {label}
      </Text>
      <Animated.View style={[styles.inputContainer, {borderColor}]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.outlineVariant}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          maxLength={maxLength}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          selectionColor={Colors.primary}
        />
        <View style={styles.right}>
          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setIsSecure(s => !s)}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Text style={styles.eyeIcon}>{isSecure ? '👁' : '🙈'}</Text>
            </TouchableOpacity>
          )}
          {rightElement}
        </View>
      </Animated.View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {marginBottom: 8},
  label: {
    ...Typography.labelMedium,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    letterSpacing: 0.8,
  },
  labelFocused: {color: Colors.primary},
  labelError: {color: Colors.error},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    ...Typography.bodyLarge,
    color: Colors.onSurface,
    paddingVertical: Platform.OS === 'ios' ? 0 : 4,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  eyeIcon: {fontSize: 16},
  error: {
    ...Typography.labelSmall,
    color: Colors.error,
    marginTop: 6,
    marginLeft: 4,
  },
  hint: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    marginTop: 6,
    marginLeft: 4,
  },
});
