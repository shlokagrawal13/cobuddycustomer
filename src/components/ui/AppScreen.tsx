import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ViewStyle,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';

interface AppScreenProps {
  children: React.ReactNode;
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

export default function AppScreen({
  children,
  scrollable = false,
  keyboardAvoiding = false,
  style,
  contentStyle,
  edges = ['top', 'bottom'],
}: AppScreenProps) {
  const content = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, contentStyle]}>{children}</View>
  );

  const wrapped = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={[styles.container, style]} edges={edges}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      {wrapped}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  flex: {flex: 1},
  content: {flex: 1},
  scroll: {flex: 1},
  scrollContent: {flexGrow: 1},
});
