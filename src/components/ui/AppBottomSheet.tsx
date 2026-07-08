import React, {useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
  ViewStyle,
  PanResponder,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface AppBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapHeight?: number;
  style?: ViewStyle;
}

export default function AppBottomSheet({
  visible,
  onClose,
  title,
  children,
  snapHeight,
  style,
}: AppBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(600)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 22,
          stiffness: 260,
        }),
        Animated.timing(backdropOpacity, {toValue: 1, duration: 250, useNativeDriver: true}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {toValue: 600, duration: 280, useNativeDriver: true}),
        Animated.timing(backdropOpacity, {toValue: 0, duration: 220, useNativeDriver: true}),
      ]).start();
    }
  }, [visible, translateY, backdropOpacity]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, state) => {
        if (state.dy > 0) {translateY.setValue(state.dy);}
      },
      onPanResponderRelease: (_, state) => {
        if (state.dy > 80) {
          onClose();
        } else {
          Animated.spring(translateY, {toValue: 0, useNativeDriver: true, damping: 22, stiffness: 260}).start();
        }
      },
    }),
  ).current;

  // snapHeight is always number now

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={StyleSheet.absoluteFill as object} onPress={onClose}>
        <Animated.View style={[StyleSheet.absoluteFill as object, styles.backdrop, {opacity: backdropOpacity}]} />
      </Pressable>
      <Animated.View style={[styles.sheet, typeof snapHeight === 'number' ? {height: snapHeight} : {}, {transform: [{translateY}], paddingBottom: Math.max(insets.bottom, 24)}, style]}>
        <View {...panResponder.panHandlers} style={styles.dragArea}>
          <View style={styles.handle} />
        </View>
        {title ? (
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {backgroundColor: 'rgba(0,0,0,0.65)'},
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceContainerHigh,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  dragArea: {alignItems: 'center', paddingTop: 12, paddingBottom: 8},
  handle: {width: 40, height: 4, borderRadius: 2, backgroundColor: Colors.outlineVariant},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
    marginBottom: 16,
  },
  title: {...Typography.headlineSmall, color: Colors.onSurface},
  closeBtn: {fontSize: 16, color: Colors.onSurfaceVariant},
});
