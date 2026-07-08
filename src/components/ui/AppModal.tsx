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
} from 'react-native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  closeOnBackdrop?: boolean;
}

export default function AppModal({
  visible,
  onClose,
  title,
  children,
  style,
  closeOnBackdrop = true,
}: AppModalProps) {
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {toValue: 1, useNativeDriver: true, damping: 18, stiffness: 200}),
        Animated.timing(opacityAnim, {toValue: 1, duration: 220, useNativeDriver: true}),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {toValue: 0.92, duration: 160, useNativeDriver: true}),
        Animated.timing(opacityAnim, {toValue: 0, duration: 160, useNativeDriver: true}),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent>
      <Pressable
        style={styles.backdrop}
        onPress={closeOnBackdrop ? onClose : undefined}>
        <Animated.View
          style={[styles.card, {transform: [{scale: scaleAnim}], opacity: opacityAnim}, style]}>
          <Pressable>
            {title ? (
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                  <Text style={styles.closeBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 28,
    padding: 24,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {...Typography.headlineSmall, color: Colors.onSurface},
  closeBtn: {fontSize: 16, color: Colors.onSurfaceVariant, padding: 4},
});
