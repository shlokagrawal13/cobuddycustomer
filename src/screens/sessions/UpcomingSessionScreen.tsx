import React, {useState, useEffect, useRef} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SessionsStackParamList, 'UpcomingSession'>;


const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

// ── Session data shape ────────────────────────────────────────────────────────
interface SessionData {
  id: string;
  companionName: string;
  companionLocation: string;
  matchPct: string;
  languages: string;
  style: string;
  rating: string;
  responseTime: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  sessionDuration: string;
  venue: string;
  venueAddress: string;
  status: string;
  statusColor: string;
  conciergeNote: string;
  price: string;
}

// ── SESSION_MAP — add entries as backend integrates ───────────────────────────
const DEFAULT_SESSION: SessionData = {
  id: 'session_001',
  companionName: 'Elena M.',
  companionLocation: 'London, UK · Verified Companion',
  matchPct: '94%',
  languages: 'Eng, Fre',
  style: 'Editorial',
  rating: '4.9',
  responseTime: '< 1hr',
  sessionTitle: 'Curated Coffee Conversations',
  sessionDate: 'Thursday, 12 June',
  sessionTime: '8:00 PM',
  sessionDuration: '3 hours',
  venue: 'The Roastery — Private Lounge',
  venueAddress: 'Mayfair, London W1K 4NS',
  status: 'UPCOMING',
  statusColor: Colors.success,
  conciergeNote:
    'Your concierge has reserved a private alcove at The Roastery. Dress code: Smart Elegant. Arrival window: 7:45–8:00 PM.',
  price: '£320',
};

const SESSION_MAP: Record<string, SessionData> = {
  session_001: DEFAULT_SESSION,
  session_002: {
    ...DEFAULT_SESSION,
    id: 'session_002',
    companionName: 'Marcus C.',
    sessionTitle: 'Art District Walking Tour',
    sessionDate: 'Friday, 13 June',
    sessionTime: '3:00 PM',
    venue: 'Tate Modern — Members Lounge',
    venueAddress: 'Bankside, London SE1 9TG',
    price: '£240',
  },
  session_003: {
    ...DEFAULT_SESSION,
    id: 'session_003',
    companionName: 'Sophia L.',
    sessionTitle: 'Wellness & Spa Morning',
    sessionDate: 'Saturday, 14 June',
    sessionTime: '10:00 AM',
    venue: 'The Berkeley Spa',
    venueAddress: 'Knightsbridge, London SW1X 7RL',
    price: '£290',
  },
  // booking_* key aliases: BookingConfirmedScreen navigates with bookingId as sessionId.
  // These ensure the confirmed booking routes to correct session data intentionally.
  booking_elena_001: {
    ...DEFAULT_SESSION,
    id: 'booking_elena_001',
    companionName: 'Elena M.',
    sessionTitle: 'Curated Coffee Conversations',
    sessionDate: 'Thursday, 12 June',
    sessionTime: '8:00 PM',
    venue: 'The Roastery – Private Lounge',
    venueAddress: 'Mayfair, London W1K 4NS',
    price: '£320',
  },
  booking_marcus_001: {
    ...DEFAULT_SESSION,
    id: 'booking_marcus_001',
    companionName: 'Marcus C.',
    sessionTitle: 'Art District Walking Tour',
    sessionDate: 'Friday, 13 June',
    sessionTime: '3:00 PM',
    venue: 'Tate Modern – Members Lounge',
    venueAddress: 'Bankside, London SE1 9TG',
    price: '£240',
  },
  booking_sophia_001: {
    ...DEFAULT_SESSION,
    id: 'booking_sophia_001',
    companionName: 'Sophia L.',
    sessionTitle: 'Wellness & Spa Morning',
    sessionDate: 'Saturday, 14 June',
    sessionTime: '10:00 AM',
    venue: 'The Berkeley Spa',
    venueAddress: 'Knightsbridge, London SW1X 7RL',
    price: '£290',
  },
};

// ── Session timeline ──────────────────────────────────────────────────────────
const TIMELINE = [
  {
    id: 'booking',
    icon: 'check-circle',
    label: 'Booking Confirmed',
    sub: 'Concierge has verified all details',
    done: true,
  },
  {
    id: 'arrival',
    icon: 'location-on',
    label: 'Arrival Verification',
    sub: 'Check-in at venue · 7:45 PM',
    done: false,
    active: true,
  },
  {
    id: 'session',
    icon: 'star',
    label: 'Trusted Experience Active',
    sub: 'Live monitoring begins at session start',
    done: false,
    active: false,
  },
];

// ── Preparation checklist ─────────────────────────────────────────────────────
const CHECKLIST = [
  {id: '1', label: 'Identity verified by concierge', done: true},
  {id: '2', label: 'Venue reservation confirmed', done: true},
  {id: '3', label: 'Digital pass issued', done: true},
  {id: '4', label: 'Safety check-in reminder scheduled', done: false},
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function UpcomingSessionScreen({route, navigation}: Props) {
  const {sessionId} = route.params;
  const session = SESSION_MAP[sessionId] ?? DEFAULT_SESSION;

  const [_cancelConfirm, setCancelConfirm] = useState(false);
  void setCancelConfirm; // suppress unused warning

  // ── Countdown to session (demo: session is 3 days, 2 hours from now) ────────
  const TARGET_OFFSET_SECS = 3 * 86400 + 2 * 3600 + 27 * 60 + 45; // 3d 2h 27m 45s
  const [remaining, setRemaining] = useState(TARGET_OFFSET_SECS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    countdownRef.current = setInterval(() => setRemaining(v => Math.max(0, v - 1)), 1000);
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const cdDays  = Math.floor(remaining / 86400);
  const cdHours = Math.floor((remaining % 86400) / 3600);
  const cdMins  = Math.floor((remaining % 3600) / 60);
  const cdSecs  = remaining % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  const handleCancel = () => {
    navigation.navigate('SessionCancel', {sessionId: session.id});
  };

  const handleModify = () => {
    navigation.navigate('ModifyBooking', {sessionId: session.id});
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Icon name="arrow-back" size={22} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Session Details</Text>
          <TouchableOpacity
            style={styles.headerMoreBtn}
            onPress={() =>
              Alert.alert(
                'Session Options',
                undefined,
                [
                  {text: 'Share Session', onPress: async () => { try { await Share.share({title: 'My CoBuddy Session', message: 'I have an upcoming CoBuddy session!'}); } catch { /* cancelled */ } }},
                  {text: 'Contact Concierge', onPress: () => (navigation as any).navigate('ConciergeNavigator', {screen: 'MessagingThread', params: {conversationId: 'concierge_main'}})},
                  {text: 'Cancel', style: 'cancel'},
                ],
              )
            }
            activeOpacity={0.7}>
            <Icon name="more-horiz" size={20} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* ── Hero Title ──────────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, {backgroundColor: session.statusColor}]} />
            <Text style={[styles.statusText, {color: session.statusColor}]}>
              {session.status}
            </Text>
          </View>
          <Text style={styles.heroTitle}>{session.sessionTitle}</Text>
          <Text style={styles.heroSub}>
            Protected by CoBuddy · {session.sessionDate} · {session.sessionTime}
          </Text>

          {/* Countdown strip */}
          <View style={styles.countdownStrip}>
            <View style={styles.countdownUnit}>
              <Text style={styles.countdownNum}>{pad(cdDays)}</Text>
              <Text style={styles.countdownLabel}>DAYS</Text>
            </View>
            <Text style={styles.countdownSep}>:</Text>
            <View style={styles.countdownUnit}>
              <Text style={styles.countdownNum}>{pad(cdHours)}</Text>
              <Text style={styles.countdownLabel}>HRS</Text>
            </View>
            <Text style={styles.countdownSep}>:</Text>
            <View style={styles.countdownUnit}>
              <Text style={styles.countdownNum}>{pad(cdMins)}</Text>
              <Text style={styles.countdownLabel}>MIN</Text>
            </View>
            <Text style={styles.countdownSep}>:</Text>
            <View style={styles.countdownUnit}>
              <Text style={styles.countdownNum}>{pad(cdSecs)}</Text>
              <Text style={styles.countdownLabel}>SEC</Text>
            </View>
          </View>
        </View>

        {/* ── Companion Overview Card ─────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.overviewTop}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Icon name="person" size={28} color={Colors.onSurfaceVariant} />
              </View>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.overviewMeta}>
              <View style={styles.overviewNameRow}>
                <View>
                  <Text style={styles.overviewName}>{session.companionName}</Text>
                  <View style={styles.locationRow}>
                    <Icon name="location-on" size={11} color={Colors.onSurfaceVariant} />
                    <Text style={styles.overviewLocation}>{session.companionLocation}</Text>
                  </View>
                </View>
                <View style={styles.overviewBadges}>
                  <View style={styles.matchBadge}>
                    <Icon name="psychology" size={10} color={Colors.primary} />
                    <Text style={styles.matchBadgeText}>{session.matchPct} Match</Text>
                  </View>
                  <View style={styles.trustedBadge}>
                    <Text style={styles.trustedBadgeText}>Trusted</Text>
                  </View>
                </View>
              </View>
              <View style={styles.statsGrid}>
                {[
                  {label: 'LANGUAGES', value: session.languages},
                  {label: 'STYLE',     value: session.style},
                  {label: 'RATING',    value: session.rating},
                  {label: 'RESPONSE',  value: session.responseTime},
                ].map(s => (
                  <View key={s.label} style={styles.statCell}>
                    <Text style={styles.statCellLabel}>{s.label}</Text>
                    <Text style={styles.statCellValue}>{s.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* ── Session Details Card ────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Details</Text>
          <View style={styles.detailRows}>
            <View style={styles.detailRow}>
              <Icon name="event" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.detailLabel}>DATE &amp; TIME</Text>
                <Text style={styles.detailValue}>
                  {session.sessionDate} · {session.sessionTime}
                </Text>
                <Text style={styles.detailSub}>Duration: {session.sessionDuration}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Icon name="location-on" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.detailLabel}>VENUE</Text>
                <Text style={styles.detailValue}>{session.venue}</Text>
                <Text style={styles.detailSub}>{session.venueAddress}</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Icon name="payments" size={20} color={Colors.primary} />
              <View>
                <Text style={styles.detailLabel}>TOTAL PAID</Text>
                <Text style={styles.detailValue}>{session.price}</Text>
                <Text style={styles.detailSub}>Fully refundable until 24h before</Text>
              </View>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Icon name="support-agent" size={20} color={Colors.primary} />
              <View style={styles.detailTextWrap}>
                <Text style={styles.detailLabel}>CONCIERGE NOTE</Text>
                <Text style={styles.detailValue}>{session.conciergeNote}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Session Timeline ────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Timeline</Text>
          {TIMELINE.map((step, idx) => (
            <View key={step.id} style={styles.timelineRow}>
              <View style={styles.timelineLeft}>
                <View
                  style={[
                    styles.timelineCircle,
                    step.done && styles.timelineCircleDone,
                    step.active && styles.timelineCircleActive,
                  ]}>
                  <Icon
                    name={step.icon}
                    size={14}
                    color={
                      step.done
                        ? Colors.success
                        : step.active
                        ? Colors.primary
                        : Colors.onSurfaceVariant
                    }
                  />
                </View>
                {idx < TIMELINE.length - 1 && (
                  <View
                    style={[
                      styles.timelineLine,
                      step.done && styles.timelineLineDone,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text
                  style={[
                    styles.timelineLabel,
                    step.done && styles.timelineLabelDone,
                    step.active && styles.timelineLabelActive,
                  ]}>
                  {step.label}
                </Text>
                <Text style={styles.timelineSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Preparation Checklist ───────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preparation Checklist</Text>
          {CHECKLIST.map((item, idx) => (
            <View
              key={item.id}
              style={[
                styles.checkRow,
                idx < CHECKLIST.length - 1 && styles.checkRowBorder,
              ]}>
              <View style={[styles.checkCircle, item.done && styles.checkCircleDone]}>
                <Icon
                  name={item.done ? 'check-circle' : 'schedule'}
                  size={16}
                  color={item.done ? Colors.success : Colors.onSurfaceVariant}
                />
              </View>
              <Text style={[styles.checkLabel, !item.done && styles.checkLabelPending]}>
                {item.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Safety Protection Card ──────────────────────────────────────── */}
        <View style={styles.safetyCard}>
          <View style={styles.safetyCardHeader}>
            <Icon name="security" size={18} color={Colors.success} />
            <Text style={styles.safetyCardTitle}>Live Safety Protection</Text>
            <View style={styles.safetyReadyPill}>
              <View style={styles.safetyReadyDot} />
              <Text style={styles.safetyReadyText}>READY</Text>
            </View>
          </View>
          <Text style={styles.safetyCardSub}>
            Concierge-supervised monitoring activates automatically at your arrival window.
          </Text>
          <View style={styles.safetyIconsGrid}>
            {[
              {icon: 'group',               label: 'Trusted\nContacts'},
              {icon: 'sos',                 label: 'SOS\nSupport'},
              {icon: 'domain-verification', label: 'Venue\nVerified'},
              {icon: 'support-agent',       label: 'Concierge\nEnabled'},
            ].map(s => (
              <View key={s.icon} style={styles.safetyIconItem}>
                <View style={styles.safetyIconWrap}>
                  <Icon name={s.icon} size={16} color={Colors.success} />
                </View>
                <Text style={styles.safetyIconLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick Actions ───────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Management</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('ArrivalVerification', {sessionId: session.id})}
              activeOpacity={0.8}>
              <Icon name="location-on" size={24} color={Colors.primary} />
              <Text style={styles.actionCardLabel}>{'Arrival\nVerification'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('DigitalPass', {bookingId: session.id})}
              activeOpacity={0.8}>
              <Icon name="qr-code" size={24} color={Colors.primary} />
              <Text style={styles.actionCardLabel}>{'Digital\nPass'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('SafetyMonitor', {sessionId: session.id})}
              activeOpacity={0.8}>
              <Icon name="security" size={24} color={Colors.primary} />
              <Text style={styles.actionCardLabel}>{'Safety\nMonitor'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Modify / Cancel ─────────────────────────────────────────────── */}
        <View style={[styles.card, styles.modifyCard]}>
          <TouchableOpacity
            style={styles.modifyRow}
            onPress={handleModify}
            activeOpacity={0.8}>
            <Icon name="edit-calendar" size={18} color={Colors.onSurface} />
            <Text style={styles.modifyRowText}>Modify Booking</Text>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
          <View style={styles.modifyDivider} />
          <TouchableOpacity
            style={styles.modifyRow}
            onPress={handleCancel}
            activeOpacity={0.8}>
            <Icon name="cancel" size={18} color={Colors.error} />
            <Text style={[styles.modifyRowText, styles.cancelText]}>Cancel Session</Text>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* Spacing for sticky bar */}
        <View style={{height: 110}} />
      </ScrollView>

      {/* ── Sticky Bottom Bar ─────────────────────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <TouchableOpacity
            style={styles.ghostBtn}
            onPress={() =>
              (navigation as any).navigate('ConciergeNavigator', {
                screen: 'MessagingThread',
                params: {conversationId: 'concierge_main'},
              })
            }
            activeOpacity={0.8}>
            <Icon name="support-agent" size={16} color={Colors.primary} />
            <Text style={styles.ghostBtnText}>TALK TO CONCIERGE</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('SessionPrep', {bookingId: session.id})}
            activeOpacity={0.85}>
            <Text style={styles.primaryBtnText}>PREPARE FOR SESSION</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CARD_BORDER = 'rgba(255,255,255,0.06)';
const GOLD_DIM    = 'rgba(242,202,80,0.12)';

const styles = StyleSheet.create({
  root:         {flex: 1, backgroundColor: Colors.surface},
  scroll:       {flex: 1},
  scrollContent: {paddingBottom: 16},

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.96)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', color: Colors.onSurface,
    fontSize: 16, letterSpacing: 0.5,
  },
  headerMoreBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
  },

  // Hero section
  heroSection:  {paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8},
  statusBadge:  {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12},
  statusDot:    {width: 8, height: 8, borderRadius: 4},
  statusText:   {fontFamily: 'Inter-Bold', fontSize: 11, letterSpacing: 1.2},
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', color: Colors.onSurface,
    fontSize: 26, letterSpacing: -0.3, marginBottom: 6,
  },
  heroSub: {
    fontFamily: 'Inter-Regular', color: Colors.onSurfaceVariant,
    fontSize: 13, lineHeight: 19,
  },

  // Cards
  card: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: Colors.surfaceContainer,
    borderRadius: 20, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 18,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold', color: Colors.onSurface,
    fontSize: 16, marginBottom: 16,
  },

  // Overview companion card
  overviewTop: {flexDirection: 'row', gap: 16, alignItems: 'flex-start'},
  avatarWrap:  {position: 'relative'},
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(242,202,80,0.25)',
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2, borderColor: Colors.surface,
  },
  overviewMeta:    {flex: 1, gap: 12},
  overviewNameRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', flexWrap: 'wrap', gap: 8,
  },
  locationRow: {flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2},
  overviewName: {fontFamily: 'Inter-Bold', color: Colors.onSurface, fontSize: 18, marginBottom: 2},
  overviewLocation: {fontFamily: 'Inter-Regular', color: Colors.onSurfaceVariant, fontSize: 12},
  overviewBadges: {gap: 5, alignItems: 'flex-end'},
  matchBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 100, borderWidth: 1, borderColor: CARD_BORDER,
  },
  matchBadgeText: {fontFamily: 'Inter-SemiBold', color: Colors.primary, fontSize: 11},
  trustedBadge: {
    paddingHorizontal: 8, paddingVertical: 4,
    backgroundColor: GOLD_DIM, borderRadius: 100,
  },
  trustedBadgeText: {fontFamily: 'Inter-SemiBold', color: Colors.primary, fontSize: 11},
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    borderTopWidth: 1, borderTopColor: CARD_BORDER, paddingTop: 12,
  },
  statCell:      {width: '50%', paddingVertical: 5, paddingRight: 8},
  statCellLabel: {fontFamily: 'Inter-Bold', color: Colors.onSurfaceVariant, fontSize: 10, letterSpacing: 1, marginBottom: 2},
  statCellValue: {fontFamily: 'Inter-SemiBold', color: Colors.onSurface, fontSize: 13},

  // Details
  detailRows:    {gap: 0},
  detailRow:     {flexDirection: 'row', gap: 14, alignItems: 'flex-start', paddingVertical: 12},
  detailDivider: {height: 1, backgroundColor: CARD_BORDER},
  detailTextWrap:{flex: 1},
  detailLabel: {
    fontFamily: 'Inter-Bold', color: Colors.onSurfaceVariant,
    fontSize: 10, letterSpacing: 1, marginBottom: 3,
  },
  detailValue: {fontFamily: 'Inter-Medium', color: Colors.onSurface, fontSize: 14, lineHeight: 20},
  detailSub:   {fontFamily: 'Inter-Regular', color: Colors.onSurfaceVariant, fontSize: 12, marginTop: 2},

  // Timeline
  timelineRow: {flexDirection: 'row', gap: 14, paddingBottom: 0},
  timelineLeft: {alignItems: 'center', width: 32},
  timelineCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineCircleDone:   {backgroundColor: 'rgba(109,217,140,0.12)', borderColor: 'rgba(109,217,140,0.3)'},
  timelineCircleActive: {backgroundColor: GOLD_DIM, borderColor: 'rgba(242,202,80,0.4)'},
  timelineLine: {flex: 1, width: 1, backgroundColor: CARD_BORDER, marginVertical: 4, minHeight: 28},
  timelineLineDone:  {backgroundColor: 'rgba(109,217,140,0.3)'},
  timelineContent:   {flex: 1, paddingBottom: 20},
  timelineLabel:     {fontFamily: 'Inter-SemiBold', color: Colors.onSurfaceVariant, fontSize: 14, marginBottom: 3},
  timelineLabelDone: {color: Colors.onSurface},
  timelineLabelActive:{color: Colors.primary},
  timelineSub:       {fontFamily: 'Inter-Regular', color: Colors.onSurfaceVariant, fontSize: 12, lineHeight: 17},

  // Checklist
  checkRow:        {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12},
  checkRowBorder:  {borderBottomWidth: 1, borderBottomColor: CARD_BORDER},
  checkCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  checkCircleDone: {backgroundColor: 'rgba(109,217,140,0.12)', borderColor: 'rgba(109,217,140,0.3)'},
  checkLabel:        {fontFamily: 'Inter-Regular', color: Colors.onSurface, fontSize: 14, flex: 1},
  checkLabelPending: {color: Colors.onSurfaceVariant},

  // Countdown
  countdownStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 6,
    marginTop: 16,
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.18)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countdownUnit: {alignItems: 'center', minWidth: 44},
  countdownNum: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.primary,
    letterSpacing: 1,
  },
  countdownLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 9,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  countdownSep: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: Colors.primary,
    opacity: 0.5,
    marginBottom: 10,
  },

  // Safety card
  safetyCard: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'rgba(109,217,140,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.20)',
    padding: 18,
    gap: 12,
  },
  safetyCardHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  safetyCardTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.success, flex: 1,
  },
  safetyReadyPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(109,217,140,0.12)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
  },
  safetyReadyDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.success},
  safetyReadyText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 1},
  safetyCardSub: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },
  safetyIconsGrid: {flexDirection: 'row', justifyContent: 'space-between'},
  safetyIconItem: {alignItems: 'center', gap: 6, flex: 1},
  safetyIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  safetyIconLabel: {
    fontFamily: 'Inter-Regular', fontSize: 9,
    color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 13,
  },

  // Action grid (Arrival / Digital Pass / Safety)
  actionGrid: {flexDirection: 'row', gap: 10},
  actionCard: {
    flex: 1, backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    paddingVertical: 18, paddingHorizontal: 10,
    alignItems: 'center', gap: 8,
  },
  actionCardLabel: {
    fontFamily: 'Inter-SemiBold', color: Colors.onSurface,
    fontSize: 12, textAlign: 'center', lineHeight: 17,
  },

  // Modify / Cancel card
  modifyCard:    {padding: 0, overflow: 'hidden'},
  modifyRow:     {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingHorizontal: 18},
  modifyDivider: {height: 1, backgroundColor: CARD_BORDER, marginHorizontal: 18},
  modifyRowText: {fontFamily: 'Inter-Medium', color: Colors.onSurface, fontSize: 14, flex: 1},
  cancelText:    {color: Colors.error},

  // Bottom bar
  bottomBar: {
    backgroundColor: 'rgba(20,20,15,0.97)',
    borderTopWidth: 1, borderTopColor: CARD_BORDER,
  },
  bottomBarInner: {
    flexDirection: 'row', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  ghostBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, paddingVertical: 14,
    borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  ghostBtnText: {fontFamily: 'Inter-SemiBold', color: Colors.onSurface, fontSize: 11, letterSpacing: 0.5},
  primaryBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  primaryBtnText: {fontFamily: 'Inter-Bold', color: Colors.onPrimary, fontSize: 11, letterSpacing: 0.5},
});
