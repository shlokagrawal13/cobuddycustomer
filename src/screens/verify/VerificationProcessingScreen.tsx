import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {VerifyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {useUserStore} from '../../store/userStore';

type Props = NativeStackScreenProps<VerifyStackParamList, 'VerificationProcessing'>;

// Stitch: verification_processing_screen
// verified_user — "Securely Verifying Your Identity"
// face Selfie Verification COMPLETED check_circle
// badge Live Identity Check COMPLETED check_circle
// description Document Verification PROCESSING — "Reviewing verification details..."
// lock verified — "Your Information Is Protected"
// "military-grade end-to-end encryption..."

const STEPS = [
  {icon: 'face',        label: 'Selfie Verification',  status: 'COMPLETED', done: true},
  {icon: 'badge',       label: 'Live Identity Check',   status: 'COMPLETED', done: true},
  {icon: 'description', label: 'Document Verification', status: 'PROCESSING', done: false},
  {icon: 'verified',    label: 'Booking Authorization', status: 'PENDING',    done: false},
] as const;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function VerificationProcessingScreen({route, navigation}: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const setIdentityVerified = useUserStore(s => s.setIdentityVerified);

  useEffect(() => {
    // Pulse animation for the processing icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1.15, duration: 900, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 1.0,  duration: 900, useNativeDriver: true}),
      ]),
    ).start();

    // Auto-navigate after 1.5s
    const timer = setTimeout(() => {
      setIdentityVerified(true);
      if (route.params?.returnTo) {
        // Return to the exact screen in the HomeStack
        (navigation as any).navigate('MainTabNavigator', {
          screen: 'HomeNavigator',
          params: {
            screen: route.params.returnTo,
            params: route.params.returnParams,
          },
        });
      } else {
        navigation.replace('VerificationPending');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation, pulseAnim, route.params, setIdentityVerified]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — no back button (processing, can't interrupt) */}
      <View style={styles.header}>
        <View style={styles.headerIconWrap}>
          <Icon name="lock" size={18} color={Colors.primary} />
        </View>
        <Text style={styles.headerTitle}>Secure Verification</Text>
        <View style={styles.headerIconWrap}>
          <Icon name="verified-user" size={18} color={Colors.primary} />
        </View>
      </View>

      <View style={styles.body}>
        {/* Hero glow */}
        <View style={styles.bgGlow} pointerEvents="none" />

        {/* Pulsing icon — Stitch: verified_user in gold glow circle */}
        <Animated.View style={[styles.heroRing, {transform: [{scale: pulseAnim}]}]}>
          <View style={styles.heroInnerRing}>
            <Icon name="verified-user" size={52} color={Colors.primary} />
          </View>
        </Animated.View>

        {/* Heading — Stitch: "Securely Verifying Your Identity" */}
        <Text style={styles.heroTitle}>Securely Verifying{'\n'}Your Identity</Text>
        <Text style={styles.heroSub}>Reviewing verification details...</Text>

        {/* Shimmer progress bar */}
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill]} />
        </View>

        {/* Step stack — Stitch: face/badge/description with COMPLETED/PROCESSING */}
        <View style={styles.stepStack}>
          {STEPS.map((step, i) => (
            <View
              key={step.label}
              style={[styles.stepRow, i < STEPS.length - 1 && styles.stepRowBorder]}>
              {/* Icon */}
              <View style={[
                styles.stepIconWrap,
                step.done && styles.stepIconWrapDone,
                step.status === 'PROCESSING' && styles.stepIconWrapActive,
              ]}>
                <Icon
                  name={step.icon}
                  size={18}
                  color={
                    step.done
                      ? Colors.success
                      : step.status === 'PROCESSING'
                      ? Colors.primary
                      : Colors.onSurfaceVariant
                  }
                />
              </View>
              {/* Label */}
              <Text style={styles.stepLabel}>{step.label}</Text>
              {/* Status badge */}
              <View style={[
                styles.statusBadge,
                step.status === 'COMPLETED'  && styles.statusBadgeDone,
                step.status === 'PROCESSING' && styles.statusBadgeActive,
              ]}>
                {step.done ? (
                  <Icon name="check-circle" size={12} color={Colors.success} />
                ) : step.status === 'PROCESSING' ? (
                  <Icon name="sync" size={12} color={Colors.primary} />
                ) : (
                  <Icon name="radio-button-unchecked" size={12} color={Colors.onSurfaceVariant} />
                )}
                <Text style={[
                  styles.statusText,
                  step.status === 'COMPLETED'  && styles.statusTextDone,
                  step.status === 'PROCESSING' && styles.statusTextActive,
                ]}>
                  {step.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Trust banner — Stitch: lock verified "Your Information Is Protected" */}
        <View style={styles.trustBanner}>
          <Icon name="lock" size={16} color={Colors.primary} />
          <View style={styles.trustMeta}>
            <Text style={styles.trustTitle}>Your Information Is Protected</Text>
            <Text style={styles.trustSub}>
              We use military-grade end-to-end encryption to secure your identity data.
              Your documents are strictly used for verification purposes and are never shared
              with third parties or other members without your explicit consent.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 20,
    backgroundColor: 'rgba(20,20,15,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  headerIconWrap: {width: 36, alignItems: 'center'},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, letterSpacing: 0.5},

  body: {
    flex: 1, alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 40, gap: 28,
    position: 'relative',
  },
  bgGlow: {
    position: 'absolute', top: -100, left: 0, right: 0,
    height: 320, backgroundColor: 'rgba(242,202,80,0.03)',
    borderRadius: 200,
  },

  // Hero ring
  heroRing: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 2, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroInnerRing: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },

  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 26,
    color: Colors.onSurface, textAlign: 'center', lineHeight: 34,
  },
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.primary, letterSpacing: 0.5},

  // Progress bar
  progressBarTrack: {
    width: '100%', height: 3, borderRadius: 2,
    backgroundColor: Colors.surfaceContainerHigh, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', borderRadius: 2,
    backgroundColor: Colors.primary, width: '65%',
    opacity: 0.8,
  },

  // Step stack
  stepStack: {
    width: '100%',
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16,
  },
  stepRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  stepRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  stepIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepIconWrapDone: {backgroundColor: 'rgba(109,217,140,0.10)'},
  stepIconWrapActive: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.30)',
  },
  stepLabel: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  statusBadgeDone: {backgroundColor: 'rgba(109,217,140,0.08)', borderColor: 'rgba(109,217,140,0.20)'},
  statusBadgeActive: {backgroundColor: 'rgba(242,202,80,0.10)', borderColor: 'rgba(242,202,80,0.25)'},
  statusText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 1},
  statusTextDone: {color: Colors.success},
  statusTextActive: {color: Colors.primary},

  // Trust banner
  trustBanner: {
    width: '100%',
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    padding: 16,
  },
  trustMeta: {flex: 1, gap: 6},
  trustTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  trustSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
});
