import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ModalStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ModalStackParamList, 'PaymentProcessing'>;

// MOCK_AMOUNT: fallback for demo mode when caller does not pass amount
const MOCK_AMOUNT = 285;

// ── Status step types ─────────────────────────────────────────────────────────
type StepState = 'done' | 'active' | 'pending';
interface Step {num: string; label: string; state: StepState}

const STEPS: Step[] = [
  {num: '01', label: 'Payment Authorization', state: 'done'},
  {num: '02', label: 'Secure Verification',   state: 'active'},
  {num: '03', label: 'Escrow Protection',      state: 'pending'},
  {num: '04', label: 'Booking Confirmation',   state: 'pending'},
];

const TRUST_PILLS = [
  {icon: 'security',          label: 'Encrypted'},
  {icon: 'account-balance',   label: 'Escrow'},
  {icon: 'assignment-return', label: 'Refund Support'},
];

export default function PaymentProcessingScreen({route, navigation}: Props) {
  const {bookingId, amount} = route.params;
  const resolvedAmount = amount ?? MOCK_AMOUNT;

  // Auto-advance after 1.5 s
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('PaymentSuccess', {bookingId, amount: resolvedAmount});
    }, 1500);
    return () => clearTimeout(timer);
  }, [bookingId, resolvedAmount, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        {/* Disabled back arrow — transactional layout, no back */}
        <View style={styles.headerBack}>
          <Icon name="arrow-back" size={24} color={Colors.onSurface} />
        </View>
        <Text style={styles.headerTitle}>Payment Processing</Text>
        <View style={styles.headerRight}>
          <Icon name="security" size={22} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}>

        {/* ── Ambient glow ──────────────────────────────────────────────── */}
        <View style={styles.ambientGlow} pointerEvents="none" />

        {/* ── Concentric rings + lock icon ──────────────────────────────── */}
        <View style={styles.ringsWrap}>
          {/* Ring 1 — outermost, faintest */}
          <View style={[styles.ring, styles.ring1]} />
          {/* Ring 2 — mid, slightly stronger */}
          <View style={[styles.ring, styles.ring2]} />
          {/* Ring 3 — innermost visible ring */}
          <View style={[styles.ring, styles.ring3]} />
          {/* Central icon circle */}
          <View style={styles.lockCircle}>
            <Icon name="lock" size={36} color={Colors.primary} />
          </View>
        </View>

        {/* ── Heading + sub ─────────────────────────────────────────────── */}
        <Text style={styles.heading}>Securely Processing Payment</Text>
        <Text style={styles.sub}>
          We're confirming your trusted booking and securely processing your
          reservation.
        </Text>

        {/* ── 4-Step transaction status stack ───────────────────────────── */}
        <View style={styles.stepsWrap}>
          {STEPS.map(step => (
            <StepCard key={step.num} step={step} />
          ))}
        </View>

        {/* ── Live pulse status label ───────────────────────────────────── */}
        <Text style={styles.pulseLabel}>
          Verifying secure transaction...
        </Text>

        {/* ── Trust banner ──────────────────────────────────────────────── */}
        <View style={styles.trustBanner}>
          <View style={styles.trustBannerRow}>
            <Icon name="shield" size={18} color={Colors.primary} />
            <Text style={styles.trustBannerTitle}>
              Protected By CoBuddy Secure Payments
            </Text>
          </View>
          <View style={styles.pillsRow}>
            {TRUST_PILLS.map(p => (
              <View key={p.label} style={styles.pill}>
                <Icon name={p.icon} size={13} color={Colors.onSurfaceVariant} />
                <Text style={styles.pillText}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── StepCard sub-component ────────────────────────────────────────────────────
function StepCard({step}: {step: Step}) {
  const isDone    = step.state === 'done';
  const isActive  = step.state === 'active';
  const isPending = step.state === 'pending';

  return (
    <View
      style={[
        styles.stepCard,
        isActive  && styles.stepCardActive,
        isPending && styles.stepCardPending,
      ]}>
      {/* Number badge */}
      <View
        style={[
          styles.stepNumWrap,
          isDone   && styles.stepNumDone,
          isActive && styles.stepNumActive,
        ]}>
        <Text
          style={[
            styles.stepNum,
            isActive && styles.stepNumTextActive,
          ]}>
          {step.num}
        </Text>
      </View>

      {/* Label */}
      <Text
        style={[
          styles.stepLabel,
          (isDone || isActive) && styles.stepLabelActive,
        ]}>
        {step.label}
      </Text>

      {/* Right indicator */}
      <View style={styles.stepIndicator}>
        {isDone && (
          <Icon name="check-circle" size={22} color={Colors.primary} />
        )}
        {isActive && (
          <ActivityIndicator size="small" color={Colors.primary} />
        )}
        {isPending && (
          <Icon
            name="radio-button-unchecked"
            size={22}
            color={Colors.onSurfaceVariant}
          />
        )}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CARD_BG     = 'rgba(11,13,26,0.6)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const RING_SIZE   = 192; // outermost ring diameter

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Header
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.92)',
  },
  headerBack: {opacity: 0.3, width: 40}, // disabled — not pressable
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerRight: {width: 40, alignItems: 'flex-end'},

  scroll: {flex: 1},
  scrollContent: {
    alignItems: 'center', paddingHorizontal: 20,
    paddingTop: 32, paddingBottom: 32, gap: 20,
  },

  // Ambient glow
  ambientGlow: {
    position: 'absolute', top: -60, alignSelf: 'center',
    width: 340, height: 340, borderRadius: 170,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },

  // Concentric rings
  ringsWrap: {
    width: RING_SIZE, height: RING_SIZE,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderRadius: RING_SIZE / 2,
    backgroundColor: 'transparent',
  },
  ring1: {
    width: RING_SIZE, height: RING_SIZE,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
  },
  ring2: {
    width: RING_SIZE - 32, height: RING_SIZE - 32,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.30)',
  },
  ring3: {
    width: RING_SIZE - 64, height: RING_SIZE - 64,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.40)',
  },
  lockCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.12, shadowRadius: 24, elevation: 6,
  },

  // Heading
  heading: {
    fontFamily: 'PlayfairDisplay-SemiBold',
    fontSize: 24, color: Colors.onSurface,
    textAlign: 'center', lineHeight: 32, letterSpacing: -0.3,
  },
  sub: {
    fontFamily: 'Inter-Regular', fontSize: 15,
    color: Colors.onSurfaceVariant, lineHeight: 22,
    textAlign: 'center', maxWidth: 320,
  },

  // Steps
  stepsWrap: {width: '100%', gap: 10},
  stepCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  stepCardActive: {
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderColor: 'rgba(242,202,80,0.30)',
  },
  stepCardPending: {opacity: 0.5},
  stepNumWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  stepNumDone: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: CARD_BORDER,
  },
  stepNumActive: {
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderColor: 'rgba(242,202,80,0.30)',
  },
  stepNum: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.onSurfaceVariant, letterSpacing: 0.5,
  },
  stepNumTextActive: {color: Colors.primary},
  stepLabel: {
    flex: 1, fontFamily: 'Inter-Medium', fontSize: 15,
    color: Colors.onSurfaceVariant,
  },
  stepLabelActive: {color: Colors.onSurface},
  stepIndicator: {width: 24, alignItems: 'center'},

  // Pulse label
  pulseLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.primary, letterSpacing: 1.8,
    textTransform: 'uppercase', textAlign: 'center',
  },

  // Trust banner
  trustBanner: {
    width: '100%', backgroundColor: CARD_BG,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 18, gap: 14,
  },
  trustBannerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    justifyContent: 'center',
  },
  trustBannerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.onSurface, letterSpacing: 1.2,
    textTransform: 'uppercase', textAlign: 'center',
    flexShrink: 1,
  },
  pillsRow: {flexDirection: 'row', justifyContent: 'center', gap: 10},
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  pillText: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
});
