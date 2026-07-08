import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {ModalStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<ModalStackParamList, 'AccountDeactivated'>;

const CARD_BG = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';

const INFO_CARDS = [
  {
    icon: 'gavel',
    label: 'REASON',
    title: 'Policy Violation Review',
    description:
      'Our trust & safety team has flagged activity on your account for review per our community guidelines.',
  },
  {
    icon: 'schedule',
    label: 'DURATION',
    title: 'Under Investigation',
    description:
      'Reviews are typically completed within 3–5 business days. You will be notified by email upon resolution.',
  },
  {
    icon: 'assignment-return',
    label: 'APPEAL',
    title: 'Submit an Appeal',
    description:
      'If you believe this suspension was made in error, you may formally appeal the decision using the button below.',
  },
];

export default function AccountDeactivatedScreen({}: Props) {
  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'Our support team is available at support@cobuddy.com. Please include your registered email address and account details to help us assist you faster.',
      [{text: 'Understood', style: 'default'}],
    );
  };

  const handleAppealDecision = () => {
    Alert.alert(
      'Appeal Decision',
      'To appeal your suspension, please send a detailed statement to appeals@cobuddy.com. Our review board will evaluate your case within 5–7 business days.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Proceed', style: 'default'},
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero Icon */}
        <View style={styles.heroContainer}>
          <View style={styles.iconRingOuter}>
            <View style={styles.iconRingInner}>
              <Icon name="gpp-bad" size={40} color={Colors.error} />
            </View>
          </View>
        </View>

        {/* Title Block */}
        <Text style={styles.title}>Account Suspended</Text>
        <Text style={styles.subtitle}>
          Your account has been temporarily suspended pending review.
        </Text>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Info Cards */}
        {INFO_CARDS.map(card => (
          <View key={card.label} style={styles.infoCard}>
            <View style={styles.infoCardLeft}>
              <View style={styles.infoIconWrap}>
                <Icon name={card.icon} size={20} color={Colors.error} />
              </View>
            </View>
            <View style={styles.infoCardRight}>
              <Text style={styles.infoCardTag}>{card.label}</Text>
              <Text style={styles.infoCardTitle}>{card.title}</Text>
              <Text style={styles.infoCardDesc}>{card.description}</Text>
            </View>
          </View>
        ))}

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContactSupport}
          activeOpacity={0.85}>
          <Icon name="headset-mic" size={18} color={Colors.onSurface} />
          <Text style={styles.primaryButtonText}>Contact Support</Text>
        </TouchableOpacity>

        {/* Secondary CTA */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleAppealDecision}
          activeOpacity={0.8}>
          <Icon name="assignment-return" size={16} color={Colors.error} />
          <Text style={styles.secondaryButtonText}>Appeal Decision</Text>
        </TouchableOpacity>

        {/* Legal Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            By using CoBuddy, you agreed to our{' '}
            <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>. Suspensions
            are issued in accordance with our Community Guidelines.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 44,
    paddingBottom: 36,
  },

  // Hero
  heroContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  iconRingOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,180,171,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,180,171,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Title
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  // Divider
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: CARD_BORDER,
    marginVertical: 28,
  },

  // Info Cards
  infoCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 12,
  },
  infoCardLeft: {
    marginRight: 14,
    marginTop: 2,
  },
  infoIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,180,171,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCardRight: {
    flex: 1,
  },
  infoCardTag: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.error,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  infoCardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 6,
  },
  infoCardDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
  },

  spacer: {
    height: 24,
  },

  // Buttons
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.onSurface,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'rgba(255,180,171,0.08)',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.18)',
  },
  secondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: Colors.error,
    letterSpacing: 0.2,
  },

  // Footer
  footerContainer: {
    paddingHorizontal: 8,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.6,
  },
  footerLink: {
    fontFamily: 'Inter-Medium',
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'underline',
    opacity: 1,
  },
});
