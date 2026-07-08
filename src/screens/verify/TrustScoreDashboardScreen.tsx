import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {VerifyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch: identity_trust_score_dashboard
// menu | CoBuddy | shield_person "Identity & Trust"
// "Your verified reputation within the CoBuddy ecosystem."
// star Elite Tier | Trust Score 920 / Out of 1000
// fingerprint Verification Strength - Biometric & ID matched.
// verified_user Safety Participation - 100% incident-free sessions.
// groups Community Reputation - 4.9/5 from verified peers.

type Props = NativeStackScreenProps<VerifyStackParamList, 'TrustScoreDashboard'>;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.22)';

// ── Trust score data (Stitch: 920/1000) ──────────────────────────────────────
const TRUST_SCORE     = 920;
const TRUST_MAX       = 1000;
const TRUST_PCT       = TRUST_SCORE / TRUST_MAX;

// ── Score breakdown - Stitch: fingerprint / verified_user / groups ────────────
const BREAKDOWN = [
  {icon:'fingerprint',    label:'Verification Strength',  sub:'Biometric & ID matched.',             pct:100, pts:280},
  {icon:'verified-user',  label:'Safety Participation',   sub:'100% incident-free sessions.',         pct:100, pts:260},
  {icon:'groups',         label:'Community Reputation',   sub:'4.9/5 from verified peers.',           pct:98,  pts:245},
  {icon:'event-available',label:'Session Reliability',    sub:'12 of 12 sessions completed.',         pct:100, pts:230},
  {icon:'schedule',       label:'Platform Tenure',        sub:'Active member since October 2023.',     pct:80,  pts:105},
];

// ── Trust timeline milestones ──────────────────────────────────────────────────
const TIMELINE = [
  {icon:'check-circle',   label:'Account Created',           date:'Oct 2023', done:true},
  {icon:'phone',          label:'Phone Verified',            date:'Oct 2023', done:true},
  {icon:'fingerprint',    label:'Government ID Uploaded',    date:'Oct 2023', done:true},
  {icon:'face',           label:'Selfie & Liveness Passed',  date:'Oct 2023', done:true},
  {icon:'stars',          label:'Elite Tier Unlocked',       date:'Nov 2023', done:true},
  {icon:'verified-user',  label:'100 Trust Score Milestone', date:'Dec 2023', done:true},
  {icon:'workspace-premium', label:'Black Signature Eligible', date:'2024 Goal', done:false},
];

// ── Trust benefits ─────────────────────────────────────────────────────────────
const BENEFITS = [
  {icon:'visibility',     label:'Higher Visibility',         sub:'Your profile appears first in companion searches.'},
  {icon:'bolt',           label:'Faster Approvals',          sub:'Priority review for session and venue requests.'},
  {icon:'diamond',        label:'Premium Experiences',       sub:'Access to invite-only and Black Tier events.'},
  {icon:'support-agent',  label:'Concierge Priority',        sub:'24/7 dedicated concierge with fastest response.'},
];

// ── Improvement suggestions ───────────────────────────────────────────────────
const INSIGHTS = [
  {icon:'add-circle',   label:'Complete 3 more sessions', pts:'+30 pts', sub:'Reach 15 total sessions for max session score.'},
  {icon:'star',         label:'Maintain 5.0 safety rating', pts:'+20 pts', sub:'One more perfect session rating boosts your score.'},
  {icon:'share',        label:'Refer 2 more members', pts:'+50 pts', sub:'Platform Tenure score increases with community growth.'},
];

export default function TrustScoreDashboardScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header - Stitch: arrow_back | "Identity & Trust" | shield_person */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identity & Trust</Text>
        <View style={styles.headerIcon}>
          <Icon name="security" size={22} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero - Stitch: shield_person | "Your verified reputation within the CoBuddy ecosystem." */}
        {/* star Elite Tier | Trust Score 920 | Out of 1000 */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />

          <View style={styles.eliteBadge}>
            <Icon name="star" size={13} color={Colors.primary} />
            <Text style={styles.eliteBadgeText}>ELITE TIER</Text>
          </View>

          <Text style={styles.heroSub}>
            Your verified reputation within the CoBuddy ecosystem.
          </Text>

          {/* Score display with ring */}
          <View style={styles.scoreSection}>
            {/* Concentric score ring */}
            <View style={styles.scoreRingOuter}>
              <View style={styles.scoreRingMid}>
                <View style={styles.scoreRingInner}>
                  <Icon name="security" size={22} color={Colors.primary} />
                </View>
              </View>
            </View>

            <View style={styles.scoreTextWrap}>
              <View style={styles.scoreRow}>
                <Text style={styles.scoreNumber}>{TRUST_SCORE}</Text>
                <Text style={styles.scoreMax}>/{TRUST_MAX}</Text>
              </View>
              <Text style={styles.scoreLabel}>TRUST SCORE</Text>
              <View style={styles.scoreBarBg}>
                <View style={[styles.scoreBarFill, {width: `${Math.round(TRUST_PCT * 100)}%`}]} />
              </View>
              <Text style={styles.scoreNote}>{TRUST_MAX - TRUST_SCORE} pts to perfect score</Text>
            </View>
          </View>

          {/* Verified chips row */}
          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Icon name="verified" size={13} color={Colors.success} />
              <Text style={styles.chipText}>Identity Verified</Text>
            </View>
            <View style={styles.chip}>
              <Icon name="how-to-reg" size={13} color={Colors.info} />
              <Text style={styles.chipText}>Trusted Member</Text>
            </View>
            <View style={styles.chip}>
              <Icon name="security" size={13} color={Colors.primary} />
              <Text style={styles.chipText}>Safety Protected</Text>
            </View>
          </View>
        </View>

        {/* CTA to Identity Center */}
        <TouchableOpacity
          style={styles.manageCta}
          onPress={() => navigation.navigate('IdentityTrustCenter')}
          activeOpacity={0.85}>
          <Icon name="verified-user" size={18} color={Colors.onPrimary} />
          <Text style={styles.manageCtaText}>Manage Identity Verification</Text>
        </TouchableOpacity>

        {/* Trust Breakdown - Stitch: fingerprint / verified_user / groups with scores */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TRUST SCORE BREAKDOWN</Text>
          {BREAKDOWN.map((b, i) => (
            <View key={b.icon} style={[styles.breakRow, i < BREAKDOWN.length - 1 && styles.breakRowBorder]}>
              <View style={styles.breakIcon}>
                <Icon name={b.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.breakMeta}>
                <View style={styles.breakTitleRow}>
                  <Text style={styles.breakLabel}>{b.label}</Text>
                  <Text style={styles.breakPts}>{b.pts} pts</Text>
                </View>
                <Text style={styles.breakSub}>{b.sub}</Text>
                <View style={styles.miniBarBg}>
                  <View style={[styles.miniBarFill, {width: `${b.pct}%`}]} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Trust Benefits */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TRUST BENEFITS</Text>
          {BENEFITS.map((b, i) => (
            <View key={b.icon} style={[styles.benefitRow, i < BENEFITS.length - 1 && styles.benefitRowBorder]}>
              <View style={styles.benefitIcon}>
                <Icon name={b.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.benefitMeta}>
                <Text style={styles.benefitLabel}>{b.label}</Text>
                <Text style={styles.benefitSub}>{b.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Trust Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TRUST TIMELINE</Text>
          {TIMELINE.map((t, i) => (
            <View key={`${t.label}-${i}`} style={styles.timelineRow}>
              <View style={styles.timelineLineCol}>
                <View style={[styles.timelineDot, t.done && styles.timelineDotDone, !t.done && styles.timelineDotFuture]}>
                  {t.done && <Icon name={i === TIMELINE.length - 2 ? 'stars' : 'check'} size={10} color={Colors.onPrimary} />}
                  {!t.done && <Icon name="schedule" size={10} color={Colors.onSurfaceVariant} />}
                </View>
                {i < TIMELINE.length - 1 && (
                  <View style={[styles.timelineLine, t.done && styles.timelineLineDone]} />
                )}
              </View>
              <View style={styles.timelineMeta}>
                <Text style={[styles.timelineLabel, !t.done && styles.timelineLabelFuture]}>{t.label}</Text>
                <Text style={styles.timelineDate}>{t.date}</Text>
              </View>
              {t.done && (
                <View style={styles.timelineDonePill}>
                  <Text style={styles.timelineDoneText}>Done</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Trust Insights */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>IMPROVEMENT INSIGHTS</Text>
          <View style={styles.nextMilestone}>
            <Icon name="emoji-events" size={18} color={Colors.primary} />
            <View style={styles.nextMilestoneMeta}>
              <Text style={styles.nextMilestoneTitle}>Next: Perfect Score</Text>
              <Text style={styles.nextMilestoneSub}>80 more points to reach 1,000 trust score</Text>
            </View>
          </View>
          {INSIGHTS.map((ins, i) => (
            <View key={ins.icon} style={[styles.insightRow, i < INSIGHTS.length - 1 && styles.insightRowBorder]}>
              <View style={styles.insightIcon}>
                <Icon name={ins.icon} size={16} color={Colors.primary} />
              </View>
              <View style={styles.insightMeta}>
                <Text style={styles.insightLabel}>{ins.label}</Text>
                <Text style={styles.insightSub}>{ins.sub}</Text>
              </View>
              <View style={styles.insightPts}>
                <Text style={styles.insightPtsText}>{ins.pts}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Icon name="lock" size={12} color={Colors.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            Your trust data is encrypted and never shared without explicit consent.
            Scores are computed using verified platform activity only.
          </Text>
        </View>

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // Header
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerIcon: {width: 40, alignItems: 'flex-end'},

  // Hero
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: GOLD_BORDER,
    padding: 24, alignItems: 'center', gap: 16,
    overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -40, alignSelf: 'center',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  eliteBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5,
  },
  eliteBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 1.5},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 19},

  // Score section
  scoreSection: {flexDirection: 'row', alignItems: 'center', gap: 20, width: '100%'},
  scoreRingOuter: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  scoreRingMid: {
    width: 74, height: 74, borderRadius: 37,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreRingInner: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.42)',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreTextWrap: {flex: 1, gap: 4},
  scoreRow: {flexDirection: 'row', alignItems: 'baseline', gap: 2},
  scoreNumber: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 40, color: Colors.onSurface},
  scoreMax: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurfaceVariant},
  scoreLabel: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 2},
  scoreBarBg: {height: 4, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 2, overflow: 'hidden'},
  scoreBarFill: {height: 4, backgroundColor: Colors.primary, borderRadius: 2},
  scoreNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},

  // Chips
  chipsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center'},
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  chipText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurface},

  // Manage CTA
  manageCta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  manageCtaText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},

  // Generic card
  card: {backgroundColor: CARD_BG, borderRadius: 20, borderWidth: 1, borderColor: CARD_BORDER, padding: 20},
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14},

  // Breakdown rows
  breakRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 14, paddingVertical: 10},
  breakRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  breakIcon: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  breakMeta: {flex: 1, gap: 4},
  breakTitleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  breakLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  breakPts: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
  breakSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  miniBarBg: {height: 3, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 2, overflow: 'hidden', marginTop: 4},
  miniBarFill: {height: 3, backgroundColor: Colors.primary, borderRadius: 2},

  // Benefits
  benefitRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10},
  benefitRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  benefitIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  benefitMeta: {flex: 1},
  benefitLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, marginBottom: 2},
  benefitSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},

  // Timeline
  timelineRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 14, minHeight: 40},
  timelineLineCol: {alignItems: 'center', width: 22},
  timelineDot: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  timelineDotDone: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  timelineDotFuture: {borderColor: Colors.outlineVariant, borderStyle: 'dashed'},
  timelineLine: {width: 1, flex: 1, backgroundColor: CARD_BORDER, marginVertical: 3},
  timelineLineDone: {backgroundColor: 'rgba(242,202,80,0.40)'},
  timelineMeta: {flex: 1, paddingTop: 2},
  timelineLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface, marginBottom: 2},
  timelineLabelFuture: {color: Colors.onSurfaceVariant},
  timelineDate: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  timelineDonePill: {
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.25)',
  },
  timelineDoneText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 0.5},

  // Next milestone banner
  nextMilestone: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderRadius: 14, borderWidth: 1, borderColor: GOLD_BORDER,
    padding: 14, marginBottom: 16,
  },
  nextMilestoneMeta: {flex: 1},
  nextMilestoneTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.primary, marginBottom: 2},
  nextMilestoneSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},

  // Insights
  insightRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10},
  insightRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  insightIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  insightMeta: {flex: 1},
  insightLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, marginBottom: 2},
  insightSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
  insightPts: {
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.25)', flexShrink: 0,
  },
  insightPtsText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.success},

  // Privacy note
  privacyNote: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, opacity: 0.6},
  privacyText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
});

