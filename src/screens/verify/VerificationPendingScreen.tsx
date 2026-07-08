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

type Props = NativeStackScreenProps<VerifyStackParamList, 'VerificationPending'>;

// Stitch: verification_pending_screen
// verified_user "Verification In Review"
// Status: Verification Pending
// schedule Estimated Time: Usually completed within a few minutes.
// Checklist:
//   check Selfie Verification Completed
//   check Live Identity Check Completed
//   (pending) Document Verification Under Review
//   (pending) Trusted Member Access Pending
// "Continue Setting Up Your Experience"
// "You can continue personalizing while verification is reviewed."
// Continue arrow_forward
// "Need help with verification? Contact Concierge Support"

const REVIEW_STEPS = [
  {icon: 'check-circle', label: 'Selfie Verification',  status: 'Completed',   done: true},
  {icon: 'check-circle', label: 'Live Identity Check',   status: 'Completed',   done: true},
  {icon: 'hourglass-empty', label: 'Document Verification', status: 'Under Review', done: false},
  {icon: 'schedule',    label: 'Trusted Member Access', status: 'Pending',     done: false},
] as const;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function VerificationPendingScreen({navigation}: Props) {
  const handleGoToIdentity = () => {
    // Reset stack to IdentityTrustCenter only — prevents duplicate push
    // and ensures back-gesture cleanly closes the VerifyNavigator modal.
    navigation.reset({index: 0, routes: [{name: 'IdentityTrustCenter'}]});
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — back button returns to identity center */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleGoToIdentity}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verification Status</Text>
        <View style={styles.headerIconWrap}>
          <Icon name="verified-user" size={20} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero — Stitch: verified_user + "Verification In Review" */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <View style={styles.heroIconRing}>
            <View style={styles.heroIconInner}>
              <Icon name="verified-user" size={44} color={Colors.primary} />
            </View>
          </View>

          <Text style={styles.heroTitle}>Verification In Review</Text>

          {/* Status badge — Stitch: Status: Verification Pending */}
          <View style={styles.statusBadge}>
            <Icon name="schedule" size={14} color={Colors.warning} />
            <Text style={styles.statusBadgeLabel}>STATUS</Text>
            <View style={styles.statusBadgeDivider} />
            <Text style={styles.statusBadgeValue}>Verification Pending</Text>
          </View>

          {/* ETA — Stitch: "Estimated Time: Usually completed within a few minutes." */}
          <View style={styles.etaRow}>
            <Icon name="schedule" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.etaText}>
              Estimated Time: Usually completed within a few minutes.
            </Text>
          </View>
        </View>

        {/* Review step checklist — Stitch: check/check/pending/pending */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>VERIFICATION PROGRESS</Text>
          {REVIEW_STEPS.map((step, i) => (
            <View
              key={step.label}
              style={[styles.reviewRow, i < REVIEW_STEPS.length - 1 && styles.reviewRowBorder]}>
              <View style={[styles.reviewIconWrap, step.done && styles.reviewIconWrapDone]}>
                <Icon
                  name={step.icon}
                  size={16}
                  color={step.done ? Colors.success : Colors.onSurfaceVariant}
                />
              </View>
              <View style={styles.reviewMeta}>
                <Text style={styles.reviewLabel}>{step.label}</Text>
                <Text style={[
                  styles.reviewStatus,
                  step.done && styles.reviewStatusDone,
                ]}>
                  {step.status}
                </Text>
              </View>
              {step.done ? (
                <Icon name="check-circle" size={18} color={Colors.success} />
              ) : (
                <Icon name="hourglass-empty" size={16} color={Colors.warning} />
              )}
            </View>
          ))}
        </View>

        {/* What happens next — Stitch: "Continue Setting Up Your Experience" */}
        <View style={styles.nextCard}>
          <View style={styles.nextIconWrap}>
            <Icon name="info" size={20} color={Colors.primary} />
          </View>
          <View style={styles.nextMeta}>
            <Text style={styles.nextTitle}>Continue Setting Up Your Experience</Text>
            <Text style={styles.nextSub}>
              You can continue personalizing your CoBuddy experience while verification is reviewed.
            </Text>
          </View>
        </View>

        {/* Primary CTA — Stitch: "Continue" + arrow_forward */}
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleGoToIdentity}
          activeOpacity={0.85}>
          <Icon name="verified-user" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Back to Identity Center</Text>
          <Icon name="arrow-forward" size={18} color={Colors.onPrimary} />
        </TouchableOpacity>

        {/* Concierge support — Stitch: "Need help with verification? Contact Concierge Support" */}
        <View style={styles.conciergeCard}>
          <Icon name="support-agent" size={18} color={Colors.onSurfaceVariant} />
          <View style={styles.conciergeMeta}>
            <Text style={styles.conciergeTitle}>Need help with verification?</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.conciergeLink}>Contact Concierge Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security note */}
        <View style={styles.securityNote}>
          <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.securityText}>
            All verification data is protected with end-to-end encryption and never shared without consent.
          </Text>
        </View>

        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 12,
    backgroundColor: 'rgba(20,20,15,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface, letterSpacing: 0.2},
  headerIconWrap: {width: 40, alignItems: 'flex-end'},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, gap: 20},

  // Hero card
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    padding: 28, alignItems: 'center', gap: 16,
    position: 'relative', overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute', top: -80, left: 0, right: 0,
    height: 220, backgroundColor: 'rgba(242,202,80,0.03)', borderRadius: 200,
  },
  heroIconRing: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 2, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroIconInner: {
    width: 76, height: 76, borderRadius: 38,
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.30)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.onSurface, textAlign: 'center'},

  // Status badge
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 100, borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    paddingHorizontal: 16, paddingVertical: 8,
  },
  statusBadgeLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5},
  statusBadgeDivider: {width: 1, height: 12, backgroundColor: CARD_BORDER},
  statusBadgeValue: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.warning},

  // ETA
  etaRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  etaText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, flex: 1, lineHeight: 17},

  // Review steps card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14,
  },
  reviewRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12},
  reviewRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  reviewIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  reviewIconWrapDone: {
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderColor: 'rgba(109,217,140,0.25)',
  },
  reviewMeta: {flex: 1},
  reviewLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  reviewStatus: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.warning, marginTop: 2},
  reviewStatusDone: {color: Colors.success},

  // What happens next card
  nextCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    borderLeftWidth: 3, borderLeftColor: Colors.primary, padding: 16,
  },
  nextIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.10)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  nextMeta: {flex: 1},
  nextTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface, marginBottom: 6},
  nextSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},

  // CTA
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 17, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  ctaBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary, letterSpacing: 0.3, flex: 1, textAlign: 'center'},

  // Concierge card
  conciergeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER, padding: 14,
  },
  conciergeMeta: {flex: 1},
  conciergeTitle: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  conciergeLink: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary, marginTop: 2},

  // Security note
  securityNote: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, opacity: 0.6},
  securityText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
});
