import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {VerifyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<VerifyStackParamList, 'IdentityTrustCenter'>;

// ── Mock data ─────────────────────────────────────────────────────────────────
const TRUST_SCORE = 98;

const VERIFICATIONS = [
  {
    id: 'gov_id',
    icon: 'fingerprint',
    label: 'Identity Verified',
    sub: 'Government ID confirmed. Oct 2023.',
    status: 'verified' as const,
  },
  {
    id: 'selfie',
    icon: 'face',
    label: 'Live Verification Completed',
    sub: 'Biometric check passed. Oct 2023.',
    status: 'verified' as const,
  },
  {
    id: 'liveness',
    icon: 'verified-user',
    label: 'Liveness Detection',
    sub: 'Biometric liveness confirmed.',
    status: 'verified' as const,
  },
  {
    id: 'contacts',
    icon: 'group',
    label: 'Trusted Contact Protected',
    sub: 'Emergency contacts active.',
    status: 'verified' as const,
  },
  {
    id: 'phone',
    icon: 'phone',
    label: 'Phone Verification',
    sub: 'Mobile number confirmed.',
    status: 'verified' as const,
  },
];

const KYC_STEPS = [
  {label: 'Account Created',         done: true},
  {label: 'Phone Verified',          done: true},
  {label: 'Government ID Uploaded',  done: true},
  {label: 'Selfie Captured',         done: true},
  {label: 'Liveness Completed',      done: true},
  {label: 'Review & Approval',       done: true},
];

const TRUST_STATS = [
  {label: 'Session Completion', value: '100%'},
  {label: 'Safety Rating',      value: '5.0'},
  {label: 'Verified Since',     value: 'Oct 2023'},
];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

export default function IdentityTrustCenterScreen({navigation}: Props) {
  const handleContinueKYC = () => {
    navigation.navigate('SelfieCapture');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity Center</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero: Trust Score ─────────────────────────────────────────── */}
        {/* Stitch: identity_hub_screen — trust score ring + status badge */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />

          {/* Verified badge */}
          <View style={styles.verifiedBadge}>
            <Icon name="verified-user" size={13} color={Colors.primary} />
            <Text style={styles.verifiedBadgeText}>Identity Verified</Text>
          </View>

          {/* Score ring (static display — Stitch: shield_person + 98/100) */}
          <View style={styles.scoreWrap}>
            <View style={styles.scoreRingOuter}>
              <View style={styles.scoreRingMid}>
                <View style={styles.scoreRingInner}>
                  <Icon name="security" size={22} color={Colors.primary} />
                </View>
              </View>
            </View>
            <View style={styles.scoreNumberWrap}>
              <Text style={styles.scoreNumber}>{TRUST_SCORE}</Text>
              <Text style={styles.scoreOf}>/100</Text>
            </View>
            <Text style={styles.scoreLabel}>TRUST SCORE</Text>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            {TRUST_STATS.map((s, i) => (
              <View
                key={s.label}
                style={[styles.statCell, i < TRUST_STATS.length - 1 && styles.statCellBorder]}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Verification Checklist ────────────────────────────────────── */}
        {/* Stitch: fingerprint / face / group_add checks with status */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>VERIFICATION STATUS</Text>
          <View style={styles.cardDivider} />
          {VERIFICATIONS.map((v, i) => (
            <View
              key={v.id}
              style={[styles.verifyRow, i < VERIFICATIONS.length - 1 && styles.verifyRowBorder]}>
              <View style={styles.verifyIconWrap}>
                <Icon name={v.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.verifyMeta}>
                <Text style={styles.verifyLabel}>{v.label}</Text>
                <Text style={styles.verifySub}>{v.sub}</Text>
              </View>
              <View style={styles.verifyStatusWrap}>
                <Icon name="check-circle" size={20} color={Colors.success} />
              </View>
            </View>
          ))}
        </View>

        {/* ── KYC Completion Path ───────────────────────────────────────── */}
        {/* Stitch: verification_center_screen step tracker */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>KYC COMPLETION PATH</Text>
          <View style={styles.cardDivider} />
          {KYC_STEPS.map((step, i) => (
            <View key={step.label} style={styles.kycRow}>
              {/* Timeline line */}
              <View style={styles.kycLineWrap}>
                <View style={[styles.kycDot, step.done && styles.kycDotDone]}>
                  {step.done && (
                    <Icon name="check" size={10} color={Colors.onPrimary} />
                  )}
                </View>
                {i < KYC_STEPS.length - 1 && (
                  <View style={[styles.kycLine, step.done && styles.kycLineDone]} />
                )}
              </View>
              <Text
                style={[
                  styles.kycLabel,
                  step.done ? styles.kycLabelDone : styles.kycLabelPending,
                ]}>
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Trust Banner ─────────────────────────────────────────────── */}
        {/* Stitch: trust_verification_identity_center_screen — left-border card */}
        <View style={styles.trustBanner}>
          <View style={styles.trustBannerIcon}>
            <Icon name="shield" size={22} color={Colors.primary} />
          </View>
          <View style={styles.trustBannerMeta}>
            <Text style={styles.trustBannerTitle}>Protected by CoBuddy</Text>
            <Text style={styles.trustBannerSub}>
              Your verified identity is encrypted and never shared without your consent.
            </Text>
          </View>
        </View>

        {/* ── CTA: Continue KYC ────────────────────────────────────────── */}
        {/* Stitch: identity_verification_trust_validation_screen — "Complete Verification" CTA */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleContinueKYC}
          activeOpacity={0.85}>
          <Icon name="verified-user" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Complete Verification</Text>
        </TouchableOpacity>

        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Header
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerSpacer: {width: 40},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // ── Hero card
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: GOLD_BORDER,
    padding: 24, alignItems: 'center', gap: 20,
    overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -40, alignSelf: 'center',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5,
  },
  verifiedBadgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.primary, letterSpacing: 1.2,
  },

  // Score ring (concentric borders, static)
  scoreWrap: {alignItems: 'center', gap: 8},
  scoreRingOuter: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  scoreRingMid: {
    width: 82, height: 82, borderRadius: 41,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreRingInner: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreNumberWrap: {flexDirection: 'row', alignItems: 'baseline', gap: 2},
  scoreNumber: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: Colors.onSurface},
  scoreOf: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurfaceVariant},
  scoreLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 2,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row', width: '100%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
  statCell: {flex: 1, alignItems: 'center', paddingVertical: 14},
  statCellBorder: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: CARD_BORDER,
  },
  statValue: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface, marginBottom: 2},
  statLabel: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, textAlign: 'center'},

  // ── Generic card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14,
  },
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER, marginBottom: 14,
  },

  // Verification rows
  verifyRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12,
  },
  verifyRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  verifyIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  verifyMeta: {flex: 1},
  verifyLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, marginBottom: 2},
  verifySub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  verifyStatusWrap: {flexShrink: 0},

  // KYC step tracker
  kycRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 14, minHeight: 36},
  kycLineWrap: {alignItems: 'center', width: 20},
  kycDot: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  kycDotDone: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  kycLine: {width: 1, flex: 1, backgroundColor: CARD_BORDER, marginVertical: 3},
  kycLineDone: {backgroundColor: 'rgba(242,202,80,0.40)'},
  kycLabel: {fontFamily: 'Inter-Regular', fontSize: 14, paddingTop: 2, flex: 1},
  kycLabelDone: {color: Colors.onSurface},
  kycLabelPending: {color: Colors.onSurfaceVariant},

  // Trust banner (left-border)
  trustBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    padding: 16,
  },
  trustBannerIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.08)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  trustBannerMeta: {flex: 1},
  trustBannerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, marginBottom: 3},
  trustBannerSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},

  // CTA
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  ctaBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
