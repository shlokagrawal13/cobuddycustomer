import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {ModalStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<ModalStackParamList, 'PaymentSuccess'>;

const CARD_BG = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const CONFIRMATION_CHIPS = [
  {icon: 'support-agent', label: 'Concierge Notified'},
  {icon: 'person-pin-circle', label: 'Companion Confirmed'},
  {icon: 'confirmation-number', label: 'Pass Ready'},
];

export default function PaymentSuccessScreen({navigation, route}: Props) {
  const {bookingId, amount} = route.params;
  const shortBookingId = bookingId.substring(0, 10).toUpperCase();

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  const handleViewPass = () => {
    // PaymentSuccessScreen lives in ModalNavigator (child of RootNavigator).
    // SessionsNavigator is inside MainTabNavigator (also child of RootNavigator).
    // Must navigate through MainTabNavigator first, then SessionsNavigator, then DigitalPass.
    (navigation as any).navigate('MainTabNavigator', {
      screen: 'SessionsNavigator',
      params: {
        screen: 'DigitalPass',
        params: {bookingId: route.params.bookingId},
      },
    });
  };

  const handleBackToSessions = () => {
    // Same cross-stack hop required — Modal → MainTab → Sessions.
    (navigation as any).navigate('MainTabNavigator', {
      screen: 'SessionsNavigator',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Success Circle */}
        <View style={styles.heroContainer}>
          <View style={styles.successRingOuter}>
            <View style={styles.successRingMiddle}>
              <View style={styles.successRingInner}>
                <Icon name="check-circle" size={44} color={Colors.success} />
              </View>
            </View>
          </View>
          {/* Glow dots */}
          <View style={styles.glowDot1} />
          <View style={styles.glowDot2} />
          <View style={styles.glowDot3} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Payment Confirmed</Text>
        <Text style={styles.subtitle}>Your reservation is secured.</Text>

        {/* Amount Display */}
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>TOTAL CHARGED</Text>
          <Text style={styles.amountValue}>{formattedAmount}</Text>
          <View style={styles.amountDivider} />
          {/* Booking Reference */}
          <View style={styles.bookingRow}>
            <View style={styles.bookingRefLeft}>
              <Icon name="receipt-long" size={14} color={Colors.onSurfaceVariant} />
              <Text style={styles.bookingRefLabel}>Booking Ref</Text>
            </View>
            <Text style={styles.bookingRefValue}>{shortBookingId}</Text>
          </View>
        </View>

        {/* Confirmation Chips */}
        <View style={styles.chipsContainer}>
          {CONFIRMATION_CHIPS.map(chip => (
            <View key={chip.label} style={styles.chip}>
              <Icon name={chip.icon} size={16} color={Colors.success} />
              <Text style={styles.chipLabel}>{chip.label}</Text>
            </View>
          ))}
        </View>

        {/* Info Note */}
        <View style={styles.noteRow}>
          <Icon name="info-outline" size={14} color={Colors.info} />
          <Text style={styles.noteText}>
            A receipt has been sent to your registered email.
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleViewPass}
          activeOpacity={0.85}>
          <Icon name="qr-code-2" size={20} color={Colors.onPrimary} />
          <Text style={styles.primaryButtonText}>View Digital Pass</Text>
        </TouchableOpacity>

        {/* Secondary */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleBackToSessions}
          activeOpacity={0.7}>
          <Text style={styles.secondaryButtonText}>Back to Sessions</Text>
        </TouchableOpacity>
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
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    width: 140,
    height: 140,
  },
  successRingOuter: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: 'rgba(109,217,140,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successRingMiddle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(109,217,140,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successRingInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(109,217,140,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowDot1: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
    opacity: 0.5,
  },
  glowDot2: {
    position: 'absolute',
    bottom: 12,
    left: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    opacity: 0.4,
  },
  glowDot3: {
    position: 'absolute',
    top: 20,
    left: 14,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.success,
    opacity: 0.3,
  },

  // Title
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 28,
  },

  // Amount Card
  amountCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    paddingVertical: 24,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  amountLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  amountValue: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 48,
    color: Colors.primary,
    letterSpacing: -1,
    lineHeight: 56,
  },
  amountDivider: {
    width: '100%',
    height: 1,
    backgroundColor: CARD_BORDER,
    marginVertical: 16,
  },
  bookingRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookingRefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bookingRefLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  bookingRefValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.onSurface,
    letterSpacing: 1.5,
  },

  // Chips
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(109,217,140,0.08)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.20)',
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  chipLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.success,
    letterSpacing: 0.3,
  },

  // Note Row
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  noteText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.info,
  },

  spacer: {
    flex: 1,
    minHeight: 28,
  },

  // Buttons
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginBottom: 14,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.onPrimary,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
});
