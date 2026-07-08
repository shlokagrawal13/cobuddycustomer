/**
 * AppHeader — standard detail-screen header.
 *
 * Back button now uses MaterialIcons 'arrow-back' vector icon.
 * rightElement slot accepts any React node (for search/action buttons).
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../theme/colors';
import {Typography} from '../../theme/typography';
import Icon from './Icon';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
  style?: ViewStyle;
}

export default function AppHeader({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightElement,
  transparent = false,
  style,
}: AppHeaderProps) {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, transparent && styles.transparent, style]}>
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backBtn}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <Icon name="arrow-back" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      <View style={styles.right}>{rightElement ?? <View style={styles.placeholder} />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
    minHeight: 56,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  left:   {width: 44, alignItems: 'flex-start'},
  center: {flex: 1,   alignItems: 'center'},
  right:  {width: 44, alignItems: 'flex-end'},
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.titleLarge,
    color: Colors.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.labelSmall,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  placeholder: {width: 36},
});
