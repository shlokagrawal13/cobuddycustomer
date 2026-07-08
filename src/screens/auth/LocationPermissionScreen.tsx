import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'LocationPermission'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const BENEFITS = [
  {icon: 'shield',        title: 'Safety Monitoring',     sub: 'Real-time location shared with trusted contacts during sessions'},
  {icon: 'place',         title: 'Venue Discovery',        sub: 'Find verified luxury venues and experiences near you'},
  {icon: 'navigation',    title: 'Protected Routes',       sub: 'Secure navigation and concierge-verified transit options'},
];

export default function LocationPermissionScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Skip */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => navigation.navigate('NotificationPermission')}
        activeOpacity={0.7}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Icon hero */}
        <View style={styles.iconHeroWrap}>
          <View style={styles.iconGlowOuter} />
          <View style={styles.iconGlowMid} />
          <View style={styles.iconCircle}>
            <Icon name="my-location" size={44} color={Colors.primary} />
          </View>
        </View>

        {/* Text */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>Enable Location</Text>
          <Text style={styles.subtitle}>
            CoBuddy uses your location to keep you safe and help you discover exclusive trusted experiences nearby.
          </Text>
        </View>

        {/* Benefits */}
        <View style={styles.benefitsCard}>
          {BENEFITS.map((b, i) => (
            <View
              key={b.icon}
              style={[styles.benefitRow, i < BENEFITS.length - 1 && styles.benefitRowBorder]}>
              <View style={styles.benefitIconWrap}>
                <Icon name={b.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.benefitMeta}>
                <Text style={styles.benefitTitle}>{b.title}</Text>
                <Text style={styles.benefitSub}>{b.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Privacy note */}
        <View style={styles.privacyRow}>
          <Icon name="lock" size={12} color={Colors.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            Location is only shared during active sessions and never stored beyond 24 hours.
          </Text>
        </View>
      </View>

      {/* CTAs */}
      <View style={styles.ctaBlock}>
        <TouchableOpacity
          style={styles.ctaPrimary}
          onPress={() =>
            Alert.alert(
              'Location Access',
              'Location permission will be requested on your device. This enables safety monitoring and venue discovery.',
              [{text: 'Continue', onPress: () => navigation.navigate('NotificationPermission')}, {text: 'Cancel', style: 'cancel'}],
            )
          }
          activeOpacity={0.88}>
          <Icon name="my-location" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaPrimaryText}>Enable Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.ctaSecondary}
          onPress={() => navigation.navigate('NotificationPermission')}
          activeOpacity={0.7}>
          <Text style={styles.ctaSecondaryText}>Not Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  skipBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20, paddingTop: 8,
  },
  skipText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurfaceVariant},
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 28,
  },
  // Icon hero
  iconHeroWrap: {alignItems: 'center', justifyContent: 'center', marginTop: 16},
  iconGlowOuter: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.10)',
  },
  iconGlowMid: {
    position: 'absolute',
    width: 112, height: 112, borderRadius: 56,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.18)',
  },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(242,202,80,0.15)',
    borderWidth: 1.5, borderColor: 'rgba(242,202,80,0.35)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 6,
  },
  // Text
  textBlock: {alignItems: 'center', gap: 10},
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32, color: Colors.onSurface,
    textAlign: 'center', letterSpacing: -0.3,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15, color: Colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 22,
  },
  // Benefits card
  benefitsCard: {
    width: '100%',
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER,
    paddingVertical: 4,
  },
  benefitRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  benefitRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  benefitIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  benefitMeta: {flex: 1},
  benefitTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, marginBottom: 3},
  benefitSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 15},
  // Privacy
  privacyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 8,
  },
  privacyText: {
    flex: 1, fontFamily: 'Inter-Regular',
    fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16,
  },
  // CTAs
  ctaBlock: {paddingHorizontal: 24, paddingBottom: 16, gap: 12},
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 16,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaPrimaryText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary},
  ctaSecondary: {alignItems: 'center', paddingVertical: 10},
  ctaSecondaryText: {fontFamily: 'Inter-Medium', fontSize: 15, color: Colors.onSurfaceVariant},
});
