import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CommonActions} from '@react-navigation/native';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SessionsStackParamList, 'BookingConfirmed'>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');


// ── Mock data helpers ────────────────────────────────────────────────────────
// Derives readable session data from mock bookingId format:
//   "booking_{companionId}_{slotId}"
interface CompanionMock {
  name: string;
  shortName: string;
  initials: string;
  title: string;
  trustScore: number;
  venue: string;
  dateTime: string;
}

const COMPANIONS: Record<string, CompanionMock> = {
  elena_001: {
    name: 'Elena Vasquez',
    shortName: 'Elena V.',
    initials: 'EV',
    title: 'Curated Coffee Conversations',
    trustScore: 98,
    venue: 'The Roastery · Public Venue',
    dateTime: 'Today · 7:30 PM (2 hours)',
  },
  marcus_002: {
    name: 'Marcus Chen',
    shortName: 'Marcus C.',
    initials: 'MC',
    title: 'Cultural Atelier Experience',
    trustScore: 96,
    venue: "L'Atelier Noir · Public Venue",
    dateTime: 'Today · 6:00 PM (3 hours)',
  },
  sofia_003: {
    name: 'Sofia Ricci',
    shortName: 'Sofia R.',
    initials: 'SR',
    title: 'Private Sanctuary Session',
    trustScore: 99,
    venue: 'The Sanctuary · Public Venue',
    dateTime: 'Tomorrow · 3:00 PM (2 hours)',
  },
};
const FALLBACK = COMPANIONS.elena_001;

function resolveSession(bookingId: string): CompanionMock & {ref: string} {
  const stripped = bookingId.replace('booking_', '');
  const companionKey = Object.keys(COMPANIONS).find(k =>
    stripped.startsWith(k),
  );
  const companion = companionKey ? COMPANIONS[companionKey] : FALLBACK;
  const ref = `#CB-${Math.abs(stripped.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 90000 + 10000)}`;
  return {...companion, ref};
}

// ── What Happens Next steps ───────────────────────────────────────────────────
// Preserved from prior implementation — product-critical next-step clarity.
// Not in Stitch but improves booking trust. Does not break Stitch layout.
const NEXT_STEPS = [
  {
    icon: 'notifications',
    title: 'Concierge Notified',
    sub: 'Your dedicated concierge has your booking and will coordinate all details.',
    done: true,
  },
  {
    icon: 'location-on',
    title: 'Arrival Coordination',
    sub: 'Venue and companion briefed 2 hours before your session.',
    done: false,
  },
  {
    icon: 'security',
    title: 'Live Safety Monitoring',
    sub: 'Secure monitoring activates 30 minutes before your start time.',
    done: false,
  },
];

// ── Quick actions ─────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {icon: 'event',      label: 'Add to Calendar',   action: 'calendar'},
  {icon: 'share',      label: 'Share Booking',      action: 'share'},
  {icon: 'headset-mic',label: 'Contact Concierge',  action: 'concierge'},
] as const;

// ── Trust banner icons (Stitch: group_add, domain_verification, support_agent)
const TRUST_ICONS = ['group-add', 'domain', 'support-agent'] as const;

export default function BookingConfirmedScreen({route, navigation}: Props) {
  const {bookingId} = route.params;
  const session = resolveSession(bookingId);

  const handleViewSession = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'UpcomingSession', params: {sessionId: bookingId}}],
      })
    );
  };

  const handleExploreMore = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'BookingHistory'}],
      })
    );
    (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'});
  };

  const handleContactConcierge = () => {
    (navigation as any).navigate('ConciergeNavigator', {
      screen: 'MessagingThread',
      params: {conversationId: 'concierge_main'},
    });
  };

  const handleQuickAction = (action: string) => {
    if (action === 'concierge') {
      handleContactConcierge();
    } else if (action === 'share') {
      Share.share({
        title: 'CoBuddy Booking',
        message:
          'I have a booking confirmed on CoBuddy.\n' +
          'Booking ref: ' + bookingId + '\n' +
          'Manage via the CoBuddy app.',
      }).catch(() => {});
    } else if (action === 'calendar') {
      Alert.alert(
        'Add to Calendar',
        'Calendar integration requires device permission and will be available in the next release. Your booking details have been saved to the app.',
        [{text: 'OK'}],
      );
    } else {
      Alert.alert('Action', 'This action will be available in the next release.');
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Booking Confirmed</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <View style={styles.hero}>
          {/* check_circle icon — gold, Stitch: primary-container color */}
          <View style={styles.iconWrap}>
            <View style={styles.iconRingOuter} />
            <View style={styles.iconCircle}>
              <Icon name="check-circle" size={40} color={Colors.primary} />
            </View>
          </View>

          {/* Stitch: h1 "Booking Confirmed" */}
          <Text style={styles.heroHeading}>Booking Confirmed</Text>

          {/* Stitch: sub "Your trusted CoBuddy experience has been successfully reserved." */}
          <Text style={styles.heroSub}>
            Your trusted CoBuddy experience has been{'\n'}successfully reserved.
          </Text>
        </View>

        {/* ── Session / Booking card ────────────────────────────────────── */}
        <View style={styles.bookingCard}>
          {/* Background ambient glow */}
          <View style={styles.cardGlow} pointerEvents="none" />

          {/* Status badges — Stitch: "Verified Session" + "Trusted Venue" */}
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Icon name="verified" size={12} color={Colors.primary} />
              <Text style={styles.badgeText}>Verified Session</Text>
            </View>
            <View style={styles.badge}>
              <Icon name="storefront" size={12} color={Colors.onSurface} />
              <Text style={styles.badgeTextMuted}>Trusted Venue</Text>
            </View>
          </View>

          {/* Companion row */}
          <View style={styles.companionRow}>
            {/* Premium initials avatar — 96×96 equivalent */}
            <View style={styles.companionAvatar}>
              <Text style={styles.companionInitials}>{session.initials}</Text>
              <View style={styles.avatarStarWrap}>
                <Icon name="star" size={12} color={Colors.primary} />
              </View>
            </View>

            <View style={styles.companionMeta}>
              {/* Session / experience title */}
              <Text style={styles.sessionTitle}>{session.title}</Text>
              {/* Companion name — Stitch: "with Elena V." */}
              <View style={styles.companionNameRow}>
                <Icon name="person" size={16} color={Colors.primary} />
                <Text style={styles.companionName}>with {session.shortName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Session details grid — Stitch: Venue Location / Date & Time / Booking Reference */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>VENUE LOCATION</Text>
              <Text style={styles.detailValue}>{session.venue}</Text>
            </View>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>DATE & TIME</Text>
              <Text style={styles.detailValue}>{session.dateTime}</Text>
            </View>
            <View style={[styles.detailCell, styles.detailCellFull]}>
              <Text style={styles.detailLabel}>BOOKING REFERENCE</Text>
              <Text style={styles.detailValueMono}>{session.ref}</Text>
            </View>
          </View>
        </View>

        {/* ── Trust / Safety banner ─────────────────────────────────────── */}
        {/* Stitch: shield_locked icon, "Protected By CoBuddy",
            "Your safety and privacy are our highest priority."
            icons: group_add, domain_verification, support_agent */}
        <View style={styles.trustBanner}>
          <View style={styles.trustBannerLeft}>
            <View style={styles.trustIconWrap}>
              <Icon name="shield" size={24} color={Colors.primary} />
            </View>
            <View style={styles.trustTextWrap}>
              <Text style={styles.trustTitle}>Protected By CoBuddy</Text>
              <Text style={styles.trustSub}>
                Your safety and privacy are our highest priority.
              </Text>
            </View>
          </View>
          <View style={styles.trustIconsRow}>
            {TRUST_ICONS.map(ic => (
              <Icon
                key={ic}
                name={ic}
                size={22}
                color={Colors.onSurfaceVariant}
              />
            ))}
          </View>
        </View>

        {/* ── What Happens Next ─────────────────────────────────────────── */}
        {/* Preserved: not in Stitch, but product-critical for next-step
            clarity and booking trust. Does not break Stitch visual layout. */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>WHAT HAPPENS NEXT</Text>
          {NEXT_STEPS.map((step, idx) => (
            <View
              key={step.title}
              style={[styles.nextRow, idx < NEXT_STEPS.length - 1 && styles.nextRowGap]}>
              <View style={[styles.nextCircle, step.done && styles.nextCircleDone]}>
                <Icon
                  name={step.icon}
                  size={16}
                  color={step.done ? Colors.success : Colors.onSurfaceVariant}
                />
              </View>
              <View style={styles.nextContent}>
                <Text style={[styles.nextTitle, step.done && styles.nextTitleDone]}>
                  {step.title}
                </Text>
                <Text style={styles.nextSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Quick Actions 3-column grid ───────────────────────────────── */}
        {/* Stitch: calendar_add_on / ios_share / headset_mic */}
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map(qa => (
            <TouchableOpacity
              key={qa.label}
              style={styles.quickCell}
              onPress={() => handleQuickAction(qa.action)}
              activeOpacity={0.75}>
              <Icon name={qa.icon} size={22} color={Colors.onSurfaceVariant} />
              <Text style={styles.quickLabel}>{qa.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{height: 16}} />
      </ScrollView>

      {/* ── Sticky bottom CTAs ───────────────────────────────────────────── */}
      {/* Stitch: "View Upcoming Session" (primary) + "Explore More Experiences" (secondary) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleViewSession}
          activeOpacity={0.85}>
          <Icon name="event-note" size={18} color={Colors.onPrimary} />
          <Text style={styles.primaryBtnText}>View Upcoming Session</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={handleExploreMore}
          activeOpacity={0.78}>
          <Text style={styles.secondaryBtnText}>Explore More Experiences</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Header
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  headerSpacer: {width: 40},
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // ── Hero
  hero: {alignItems: 'center', gap: 12, paddingBottom: 4},

  iconWrap: {
    width: 96, height: 96,
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  iconRingOuter: {
    position: 'absolute',
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.20, shadowRadius: 20, elevation: 4,
  },
  heroHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 28,
    color: Colors.onSurface, textAlign: 'center', lineHeight: 36,
  },
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 15,
    color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 22,
  },

  // ── Booking card
  bookingCard: {
    backgroundColor: CARD_BG,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.12)',
    padding: 20, gap: 16,
    overflow: 'hidden', position: 'relative',
  },
  cardGlow: {
    position: 'absolute', top: -30, right: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },

  // Status badges
  badgesRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: CARD_BG,
    borderRadius: 100, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.primary, letterSpacing: 0.8,
  },
  badgeTextMuted: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurface, letterSpacing: 0.8,
  },

  // Companion row
  companionRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  companionAvatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2, borderColor: 'rgba(242,202,80,0.30)',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  companionInitials: {
    fontFamily: 'Inter-Bold', fontSize: 22, color: Colors.primary,
  },
  avatarStarWrap: {
    position: 'absolute', bottom: -4, right: -4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  companionMeta: {flex: 1, gap: 4},
  sessionTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 16,
    color: Colors.onSurface, lineHeight: 22,
  },
  companionNameRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  companionName: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
  },

  // Details grid
  detailsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16,
  },
  detailCell: {flex: 1, minWidth: '44%'},
  detailCellFull: {width: '100%', flex: 0},
  detailLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.2, marginBottom: 4,
  },
  detailValue: {
    fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface,
  },
  detailValueMono: {
    fontFamily: 'Inter-Medium', fontSize: 13,
    color: Colors.onSurface, opacity: 0.85,
    letterSpacing: 0.5,
  },

  // ── Trust banner
  trustBanner: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD_BG,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    padding: 16, gap: 12,
  },
  trustBannerLeft: {flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1},
  trustIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.08)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  trustTextWrap: {flex: 1},
  trustTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 15,
    color: Colors.onSurface, marginBottom: 2,
  },
  trustSub: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 17,
  },
  trustIconsRow: {flexDirection: 'row', gap: 12, opacity: 0.6},

  // ── What Happens Next
  sectionCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 16,
  },
  nextRow: {flexDirection: 'row', gap: 14},
  nextRowGap: {marginBottom: 16},
  nextCircle: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  nextCircleDone: {
    backgroundColor: 'rgba(109,217,140,0.08)',
    borderColor: 'rgba(109,217,140,0.25)',
  },
  nextContent: {flex: 1},
  nextTitle: {
    fontFamily: 'Inter-Medium', fontSize: 14,
    color: Colors.onSurfaceVariant, marginBottom: 2,
  },
  nextTitleDone: {color: Colors.onSurface},
  nextSub: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },

  // ── Quick actions 3-column grid
  quickGrid: {flexDirection: 'row', gap: 10},
  quickCell: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16,
    backgroundColor: CARD_BG,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER,
  },
  quickLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurface, letterSpacing: 0.6,
    textAlign: 'center',
  },

  // ── Bottom bar
  bottomBar: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.96)', gap: 10,
  },
  primaryBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 4,
  },
  primaryBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 15,
    color: Colors.onPrimary, letterSpacing: 0.3,
  },
  secondaryBtn: {
    paddingVertical: 14, borderRadius: 100,
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Inter-Medium', fontSize: 14,
    color: Colors.onSurface,
  },
});
