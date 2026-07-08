import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  StatusBar,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SessionsStackParamList, 'PastSessionDetail'>;

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

// ─── Mock Sessions ────────────────────────────────────────────────────────────
interface PastSession {
  id: string;
  companionName: string;
  companionInitials: string;
  /** Real companionId for navigating to CompanionProfile */
  companionId: string;
  /** Real bookingId for navigating to DisputeRefund */
  bookingId: string;
  trustScore: number;
  experienceTitle: string;
  venue: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  reference: string;
  totalPaid: number;
  tipGiven: number;
  status: 'completed' | 'cancelled';
  rating: number;
  feedback: string;
  highlights: string[];
  iconName: string;
  // Reflection / wellness
  reflectionNote: string;
  companionFeedback: string;
  wellnessTag: string;
}

const MOCK_SESSIONS: Record<string, PastSession> = {
  sess_001: {
    id: 'sess_001',
    companionId: 'elena_001',
    bookingId: 'bk_sess_001',
    companionName: 'Elena Vasquez',
    companionInitials: 'EV',
    trustScore: 98,
    experienceTitle: 'Private Dining at The Atrium',
    venue: 'The Atrium Reserve',
    location: 'Mayfair, London',
    date: 'Tuesday, 15 April 2025',
    startTime: '19:00',
    endTime: '21:30',
    duration: '2h 30m',
    reference: '#CB-0942A',
    totalPaid: 285,
    tipGiven: 40,
    status: 'completed',
    rating: 5,
    feedback: 'An extraordinary evening. Elena was exceptionally attentive and made the experience feel truly personal.',
    highlights: ['Reservation secured', 'Safety check-in completed', 'Verified arrival', 'Concierge monitored'],
    iconName: 'restaurant',
    reflectionNote: 'Felt genuinely at ease throughout. The venue atmosphere exceeded expectations.',
    companionFeedback: 'Elena was warm, culturally attuned, and added so much depth to the evening.',
    wellnessTag: 'Relaxed & Present',
  },
  sess_002: {
    id: 'sess_002',
    companionId: 'marcus_001',
    bookingId: 'bk_sess_002',
    companionName: 'Marcus Chen',
    companionInitials: 'MC',
    trustScore: 96,
    experienceTitle: 'Gallery Walk & Cultural Tour',
    venue: 'Tate Modern',
    location: 'Southbank, London',
    date: 'Saturday, 5 April 2025',
    startTime: '14:00',
    endTime: '17:00',
    duration: '3h 00m',
    reference: '#CB-0887B',
    totalPaid: 150,
    tipGiven: 20,
    status: 'completed',
    rating: 4,
    feedback: 'A beautifully curated tour. Marcus has encyclopaedic knowledge of contemporary art.',
    highlights: ['Private gallery access', 'Safety check-in completed', 'Verified arrival'],
    iconName: 'museum',
    reflectionNote: 'Intellectually stimulating. Left with a much broader appreciation for modern art.',
    companionFeedback: 'Marcus brought a rare sense of curiosity and warmth to every gallery space.',
    wellnessTag: 'Inspired & Energised',
  },
  // Past sessions from BookingHistory cards
  sess_atelier: {
    id: 'sess_atelier',
    companionId: 'isabelle_001',
    bookingId: 'bk_CB_1124C',
    companionName: 'Isabelle Laurent',
    companionInitials: 'IL',
    trustScore: 97,
    experienceTitle: "L'Atelier Noir — Private Evening",
    venue: "L'Atelier Noir",
    location: 'Paris, France',
    date: 'Thursday, 18 September 2025',
    startTime: '20:00',
    endTime: '23:00',
    duration: '3h 00m',
    reference: '#CB-1124C',
    totalPaid: 380,
    tipGiven: 55,
    status: 'completed',
    rating: 5,
    feedback: 'A flawlessly curated evening. The atmosphere was incomparable.',
    highlights: ['Reservation secured', 'Safety check-in completed', 'Verified arrival', 'Concierge monitored'],
    iconName: 'local-bar',
    reflectionNote: 'The evening had an effortless elegance I rarely experience.',
    companionFeedback: 'Isabelle was poised, witty, and made every moment feel considered.',
    wellnessTag: 'Joyful & Connected',
  },
  sess_sanctuary: {
    id: 'sess_sanctuary',
    companionId: 'sofia_001',
    bookingId: 'bk_CB_1088D',
    companionName: 'Sofia Ricci',
    companionInitials: 'SR',
    trustScore: 99,
    experienceTitle: 'Sanctuary Estate — Wellness Retreat',
    venue: 'The Sanctuary Estate',
    location: 'Tuscany, Italy',
    date: 'Sunday, 3 August 2025',
    startTime: '10:00',
    endTime: '17:00',
    duration: '7h 00m',
    reference: '#CB-1088D',
    totalPaid: 640,
    tipGiven: 90,
    status: 'completed',
    rating: 5,
    feedback: 'An immersive retreat experience. Sofia made me feel completely at home.',
    highlights: ['Estate access confirmed', 'Safety check-in completed', 'Verified arrival', 'Wellness protocol observed'],
    iconName: 'spa',
    reflectionNote: 'A rare day of genuine stillness. I left feeling deeply restored.',
    companionFeedback: 'Sofia balanced presence and space perfectly — a truly restorative companion.',
    wellnessTag: 'Restored & Centred',
  },
  sess_obsidian: {
    id: 'sess_obsidian',
    companionId: 'james_001',
    bookingId: 'bk_CB_1002E',
    companionName: 'James Whitmore',
    companionInitials: 'JW',
    trustScore: 95,
    experienceTitle: 'Obsidian Lounge — Cocktail Evening',
    venue: 'Obsidian Lounge',
    location: 'London, UK',
    date: 'Monday, 21 July 2025',
    startTime: '19:30',
    endTime: '22:00',
    duration: '2h 30m',
    reference: '#CB-1002E',
    totalPaid: 210,
    tipGiven: 30,
    status: 'completed',
    rating: 4,
    feedback: 'Excellent conversation and a very well-chosen venue. Will book again.',
    highlights: ['Table reservation confirmed', 'Safety check-in completed', 'Verified arrival'],
    iconName: 'nightlife',
    reflectionNote: 'Great balance of energy and ease. Exactly what the evening called for.',
    companionFeedback: 'James was engaging, sharp, and effortlessly social.',
    wellnessTag: 'Uplifted & Social',
  },
};

// Fallback maps BookingHistory IDs (e.g. sess_atelier, sess_sanctuary, sess_obsidian)
const FALLBACK_SESSION = MOCK_SESSIONS.sess_001;

// ─── Session Timeline ─────────────────────────────────────────────────────────
interface TimelineStep {
  label: string;
  sublabel: string;
  timeLabel: string;
  done: boolean;
}

function buildTimeline(session: PastSession): TimelineStep[] {
  const isCompleted = session.status === 'completed';
  return [
    {
      label: 'Booking Confirmed',
      sublabel: 'Payment secured and itinerary verified.',
      timeLabel: session.date.split(',')[1]?.trim() ?? session.date,
      done: true,
    },
    {
      label: 'Arrival & Check-in',
      sublabel: `Companion arrived at ${session.venue}.`,
      timeLabel: session.startTime,
      done: true,
    },
    {
      label: 'Session Completed',
      sublabel: isCompleted
        ? 'Experience concluded. Escort to transport verified.'
        : 'Session was cancelled before completion.',
      timeLabel: session.endTime,
      done: isCompleted,
    },
    {
      label: 'Payment Released',
      sublabel: isCompleted
        ? 'Receipt available. Gratuity processed.'
        : 'Full refund issued within 3–5 business days.',
      timeLabel: 'Receipt Ready',
      done: isCompleted,
    },
  ];
}

// ─── Star rating component ────────────────────────────────────────────────────
function StarRating({rating}: {rating: number}) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map(i => (
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={18}
          color={i <= rating ? Colors.primary : Colors.onSurfaceVariant}
        />
      ))}
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function PastSessionDetailScreen({route, navigation}: Props) {
  const {sessionId} = route.params;

  // BookingHistory passes "sess_atelier", "sess_sanctuary", "sess_obsidian"
  // directly as the ID without the "sess_" prefix wrapping.
  // openPastSession does: navigate('PastSessionDetail', {sessionId: `sess_${id}`})
  // So "atelier" → "sess_atelier" — look up directly, then try fallback.
  const session = MOCK_SESSIONS[sessionId] ?? FALLBACK_SESSION;
  const insets = useSafeAreaInsets();
  const timeline = buildTimeline(session);

  const handleBookAgain = () => {
    // CompanionBrowse is in HomeNavigator. Navigate via parent (MainTab).
    (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'});
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Details</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={async () => {
            try {
              await Share.share({title: 'Session Summary', message: 'Check out my CoBuddy session experience!'});
            } catch { /* cancelled */ }
          }}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="share" size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(32, insets.bottom + 16)}]}
        showsVerticalScrollIndicator={false}>

        {/* ── Status banner ──────────────────────────────────────────────── */}
        <View style={[
          styles.statusBanner,
          session.status === 'completed' ? styles.statusBannerCompleted : styles.statusBannerCancelled,
        ]}>
          <Icon
            name={session.status === 'completed' ? 'check-circle' : 'cancel'}
            size={16}
            color={session.status === 'completed' ? Colors.success : Colors.error}
          />
          <Text style={[
            styles.statusText,
            {color: session.status === 'completed' ? Colors.success : Colors.error},
          ]}>
            {session.status === 'completed' ? 'Session Completed' : 'Session Cancelled'}
          </Text>
          <View style={styles.statusSpacer} />
          <Text style={styles.statusRef}>{session.reference}</Text>
        </View>

        {/* ── Experience hero card ────────────────────────────────────────── */}
        <View style={styles.heroShadow}>
          <View style={styles.heroCard}>
            <View style={styles.heroIconBg}>
              <View style={{opacity: 0.06}}>
                <Icon name={session.iconName} size={80} color={Colors.onSurface} />
              </View>
            </View>
            <View style={styles.heroContent}>
              <Text style={styles.heroCategory}>PAST SESSION</Text>
              <Text style={styles.heroTitle}>{session.experienceTitle}</Text>
              <View style={styles.heroMetaRow}>
                <Icon name="location-on" size={13} color={Colors.onSurfaceVariant} />
                <Text style={styles.heroMeta}>{session.venue} · {session.location}</Text>
              </View>
              <View style={styles.heroMetaRow}>
                <Icon name="event" size={13} color={Colors.onSurfaceVariant} />
                <Text style={styles.heroMeta}>{session.date}</Text>
              </View>
              <View style={styles.heroMetaRow}>
                <Icon name="schedule" size={13} color={Colors.onSurfaceVariant} />
                <Text style={styles.heroMeta}>{session.startTime} – {session.endTime} ({session.duration})</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Live monitoring archived note ───────────────────────────────── */}
        <View style={styles.monitoringNote}>
          <Icon name="security" size={18} color={Colors.success} />
          <View style={styles.monitoringNoteText}>
            <Text style={styles.monitoringTitle}>Live Monitoring Completed</Text>
            <Text style={styles.monitoringSub}>Session securely archived per privacy protocol.</Text>
          </View>
        </View>

        {/* ── Companion card ──────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>YOUR COMPANION</Text>
          <View style={styles.companionRow}>
            <View style={styles.companionAvatar}>
              <Text style={styles.companionInitials}>{session.companionInitials}</Text>
            </View>
            <View style={styles.companionMeta}>
              <Text style={styles.companionName}>{session.companionName}</Text>
              <View style={styles.trustRow}>
                <Icon name="verified-user" size={12} color={Colors.primary} />
                <Text style={styles.trustText}>Trust Score {session.trustScore}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewProfileBtn}
              onPress={() => {
                (navigation as any).navigate('HomeNavigator', {
                  screen: 'CompanionProfile',
                  params: {companionId: session.companionId},
                });
              }}
              activeOpacity={0.7}>
              <Text style={styles.viewProfileText}>View Profile</Text>
              <Icon name="chevron-right" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Session Timeline ────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>SESSION TIMELINE</Text>
          {timeline.map((step, idx) => (
            <View key={step.label} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View style={[
                  styles.timelineCircle,
                  step.done && styles.timelineCircleDone,
                ]}>
                  <Icon
                    name={step.done ? 'check-circle' : 'radio-button-unchecked'}
                    size={14}
                    color={step.done ? Colors.success : Colors.onSurfaceVariant}
                  />
                </View>
                {idx < timeline.length - 1 && (
                  <View style={[styles.timelineLine, step.done && styles.timelineLineDone]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTime}>{step.timeLabel}</Text>
                <Text style={[styles.timelineLabel, step.done && styles.timelineLabelDone]}>
                  {step.label}
                </Text>
                <Text style={styles.timelineSub}>{step.sublabel}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Session Highlights ──────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>SESSION HIGHLIGHTS</Text>
          <View style={styles.highlightsList}>
            {session.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={styles.highlightIconWrap}>
                  <Icon name="check-circle" size={16} color={Colors.success} />
                </View>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Memory & Reflection ─────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>MEMORY & REFLECTION</Text>

          {/* Wellness tag */}
          <View style={styles.wellnessTag}>
            <Icon name="self-improvement" size={14} color={Colors.primary} />
            <Text style={styles.wellnessTagText}>{session.wellnessTag}</Text>
          </View>

          {/* Personal reflection */}
          <Text style={styles.reflectionSubLabel}>YOUR REFLECTION</Text>
          <View style={styles.reflectionCard}>
            <View style={{opacity: 0.5}}>
              <Icon name="format-quote" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.reflectionText}>{session.reflectionNote}</Text>
          </View>

          {/* Companion feedback */}
          <Text style={[styles.reflectionSubLabel, {marginTop: 14}]}>COMPANION NOTE</Text>
          <View style={styles.feedbackCard}>
            <View style={styles.feedbackCompanionRow}>
              <View style={styles.feedbackAvatar}>
                <Text style={styles.feedbackAvatarText}>{session.companionInitials}</Text>
              </View>
              <Text style={styles.feedbackName}>{session.companionName}</Text>
            </View>
            <Text style={styles.companionFeedbackText}>{session.companionFeedback}</Text>
          </View>
        </View>

        {/* ── Rating & Review ─────────────────────────────────────────────── */}
        {session.status === 'completed' && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>YOUR REVIEW</Text>
            <StarRating rating={session.rating} />
            <Text style={styles.feedbackText}>"{session.feedback}"</Text>
          </View>
        )}

        {/* ── Payment Summary ─────────────────────────────────────────────── */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>FINANCIAL SUMMARY</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Session fee</Text>
            <Text style={styles.paymentValue}>£{session.totalPaid - session.tipGiven}</Text>
          </View>
          <View style={[styles.paymentRow, styles.paymentRowBorder]}>
            <Text style={styles.paymentLabel}>Gratuity</Text>
            <Text style={styles.paymentValue}>£{session.tipGiven}</Text>
          </View>
          <View style={styles.paymentDivider} />
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabelBold}>Total paid</Text>
            <Text style={styles.paymentValueBold}>£{session.totalPaid}</Text>
          </View>
          <TouchableOpacity
            style={styles.receiptBtn}
            onPress={() =>
              (navigation as any).navigate('ProfileNavigator', {
                screen: 'ReceiptViewer',
                params: {transactionId: session.bookingId},
              })
            }
            activeOpacity={0.7}>
            <Icon name="receipt-long" size={16} color={Colors.primary} />
            <Text style={styles.receiptBtnText}>Download Receipt</Text>
          </TouchableOpacity>
        </View>

        {/* ── Action buttons ──────────────────────────────────────────────── */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtnSecondary}
            onPress={() => navigation.navigate('DisputeRefund', {bookingId: session.bookingId})}
            activeOpacity={0.7}>
            <Icon name="report-problem" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.actionBtnSecondaryText}>Report Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnPrimary}
            onPress={handleBookAgain}
            activeOpacity={0.8}>
            <Icon name="add" size={16} color={Colors.surface} />
            <Text style={styles.actionBtnPrimaryText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_DIM = 'rgba(242,202,80,0.10)';
const SUCCESS_DIM = 'rgba(109,217,140,0.08)';

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16, gap: 0},

  // Status banner
  statusBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, marginBottom: 16, borderWidth: 1,
  },
  statusBannerCompleted: {backgroundColor: SUCCESS_DIM, borderColor: 'rgba(109,217,140,0.2)'},
  statusBannerCancelled: {backgroundColor: 'rgba(255,180,171,0.08)', borderColor: 'rgba(255,180,171,0.2)'},
  statusText: {fontFamily: 'Inter-Medium', fontSize: 13, letterSpacing: 0.2},
  statusSpacer: {flex: 1},
  statusRef: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.primary},

  // Hero card
  heroShadow: {
    borderRadius: 20, marginBottom: 16,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12, shadowRadius: 12,
  },
  heroCard: {
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    minHeight: 180,
  },
  heroIconBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'flex-end', justifyContent: 'flex-start', padding: 16,
  },
  heroContent: {padding: 24, gap: 8},
  heroCategory: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.primary, letterSpacing: 1.5, marginBottom: 4,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 22,
    color: Colors.onSurface, lineHeight: 30, marginBottom: 8,
  },
  heroMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  heroMeta: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Monitoring note
  monitoringNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: SUCCESS_DIM,
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(109,217,140,0.15)',
    padding: 14, marginBottom: 16,
  },
  monitoringNoteText: {flex: 1},
  monitoringTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface, marginBottom: 2},
  monitoringSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Section card
  sectionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 20, marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 16,
  },

  // Companion
  companionRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  companionAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  companionInitials: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.primary},
  companionMeta: {flex: 1},
  companionName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  trustRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3},
  trustText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  viewProfileBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8, borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    backgroundColor: GOLD_DIM,
  },
  viewProfileText: {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.primary},

  // Session Timeline
  timelineRow: {flexDirection: 'row', gap: 14},
  timelineLeft: {alignItems: 'center', width: 32},
  timelineCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineCircleDone: {
    backgroundColor: SUCCESS_DIM,
    borderColor: 'rgba(109,217,140,0.3)',
  },
  timelineLine: {
    width: 1, flex: 1, backgroundColor: CARD_BORDER,
    marginVertical: 4, minHeight: 24,
  },
  timelineLineDone: {backgroundColor: 'rgba(109,217,140,0.25)'},
  timelineContent: {flex: 1, paddingBottom: 20},
  timelineTime: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1, marginBottom: 3,
  },
  timelineLabel: {
    fontFamily: 'Inter-Medium', fontSize: 14,
    color: Colors.onSurfaceVariant, marginBottom: 2,
  },
  timelineLabelDone: {color: Colors.onSurface},
  timelineSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},

  // Highlights
  highlightsList: {gap: 12},
  highlightRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  highlightIconWrap: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: SUCCESS_DIM,
    alignItems: 'center', justifyContent: 'center',
  },
  highlightText: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface, flex: 1},

  // Memory & Reflection
  wellnessTag: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: GOLD_DIM,
    borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.25)',
    paddingHorizontal: 12, paddingVertical: 6,
    marginBottom: 16,
  },
  wellnessTagText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
  reflectionSubLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.2, marginBottom: 10,
  },
  reflectionCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 14, gap: 8,
  },
  reflectionText: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurface, lineHeight: 21, fontStyle: 'italic',
  },
  feedbackCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 14, gap: 10,
  },
  feedbackCompanionRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  feedbackAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: GOLD_DIM, borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  feedbackAvatarText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
  feedbackName: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  companionFeedbackText: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, lineHeight: 20,
  },

  // Rating
  starRow: {flexDirection: 'row', gap: 4, marginBottom: 14},
  feedbackText: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, lineHeight: 22, fontStyle: 'italic',
  },

  // Payment
  paymentRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6},
  paymentRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
    paddingBottom: 10, marginBottom: 4,
  },
  paymentLabel: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  paymentValue: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  paymentDivider: {height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginVertical: 8},
  paymentLabelBold: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  paymentValueBold: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.primary},
  receiptBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 16, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    backgroundColor: GOLD_DIM, justifyContent: 'center',
  },
  receiptBtnText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.primary},

  // Actions
  actionsRow: {flexDirection: 'row', gap: 12, marginBottom: 8},
  actionBtnSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1, borderColor: CARD_BORDER, backgroundColor: CARD_BG,
  },
  actionBtnSecondaryText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurfaceVariant},
  actionBtnPrimary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  actionBtnPrimaryText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.surface},
});
