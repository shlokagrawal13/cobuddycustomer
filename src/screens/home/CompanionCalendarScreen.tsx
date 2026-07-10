/**
 * CompanionCalendarScreen
 *
 * Stitch Reference (SOLE):
 *   _extracted/stitch_cobuddy_premium_companion_platform_6/
 *   stitch_cobuddy_premium_companion_platform/
 *   session_booking_confirmation_screen/code.html
 *
 * Layout (mobile-collapsed single-column adaptation):
 *   Header  : back arrow (left) | bookmark + notifications (right)
 *   Hero    : glass panel, gradient overlay, "Reserve Trusted Experience" display heading + sub
 *   Card 1  : scheduling glass-panel
 *               • "Schedule Session" heading (calendar_month icon)
 *               • Companion mini-card (avatar + name + speciality + 2 badges)
 *               • 7-day date strip (horizontal scroll)
 *               • "Concierge Recommended Times" + time pills
 *   Card 2  : Reservation Summary glass-panel
 *               • Experience Duration / Concierge Fee / Member Credits / Total
 *   Footer  : full-width gold "Continue To Secure Payment" + "Fully Refundable" note
 */
import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {useUserStore} from '../../store/userStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'CompanionCalendar'>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be available in the next phase.');

// ─── Mock data ────────────────────────────────────────────────────────────────
interface CompanionData {
  name: string;
  initials: string;
  speciality: string;
  priceFrom: number;
}
const COMPANIONS: Record<string, CompanionData> = {
  default:   {name: 'Elena M.',  initials: 'EM', speciality: 'Fine Dining & Cultural Curator',   priceFrom: 180},
  elena_001: {name: 'Elena M.',  initials: 'EM', speciality: 'Fine Dining & Cultural Curator',   priceFrom: 180},
  comp_001:  {name: 'Elena M.',  initials: 'EM', speciality: 'Fine Dining & Cultural Curator',   priceFrom: 180},
  comp_002:  {name: 'Marcus C.', initials: 'MC', speciality: 'Art Historian & Cultural Guide',   priceFrom: 140},
  comp_003:  {name: 'Sophia L.', initials: 'SL', speciality: 'Wellness Coach & Spa Specialist',  priceFrom: 165},
  comp_006:  {name: 'Ravi M.',   initials: 'RM', speciality: 'Travel & Hospitality Concierge',  priceFrom: 125},
};

// Build next 7 days
const DAY_ABBRS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
function getNext7Days() {
  const today = new Date();
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      dayAbbr: DAY_ABBRS[d.getDay()] ?? 'MON',
      date: d.getDate(),
      dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
    };
  });
}

// Time slots — 24h format per Stitch (18:00 / 19:30 / 21:00 pattern)
const TIME_SLOTS = [
  {id: '12:00', label: '12:00'},
  {id: '14:00', label: '14:00'},
  {id: '16:30', label: '16:30'},
  {id: '18:00', label: '18:00'},
  {id: '19:30', label: '19:30'},
  {id: '21:00', label: '21:00'},
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CompanionCalendarScreen({route, navigation}: Props) {
  const {companionId} = route.params;
  const companion = COMPANIONS[companionId] ?? COMPANIONS.default;
  const insets = useSafeAreaInsets();

  const DAYS = useMemo(() => getNext7Days(), []);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[1]?.dateStr ?? DAYS[0]?.dateStr ?? '');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [wishlisted, setWishlisted] = useState(false);

  // Pricing (Stitch: Experience Duration + Concierge Fee - Member Credits = Total)
  const DURATION_HRS = 3;
  const experienceBase = companion.priceFrom;
  const conciergeFee = Math.round(experienceBase * 0.10);
  const memberCredits = Math.round(experienceBase * 0.06);
  const total = experienceBase + conciergeFee - memberCredits;

  const isIdentityVerified = useUserStore(s => s.isIdentityVerified);

  const handleContinue = () => {
    if (!selectedTime) {
      Alert.alert('Select Time', 'Please choose a time slot to continue.');
      return;
    }
    const slotId = `${selectedDay}_${selectedTime}`;

    if (!isIdentityVerified) {
      (navigation as any).navigate('ModalNavigator', {
        screen: 'VerifyNavigator',
        params: {
          screen: 'SelfieCapture',
          params: {
            returnTo: 'BookingSummary',
            returnParams: {companionId, slotId},
          },
        },
      });
      return;
    }

    // BookingSummary is registered directly inside HomeNavigator (same stack).
    navigation.navigate('BookingSummary', {companionId, slotId});
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Header: back (left) + bookmark / notifications (right) ──────────── */}
      {/* Matches Stitch nav: back-arrow left + bookmark + notifications right  */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => {
              setWishlisted(w => !w);
              Alert.alert(
                wishlisted ? 'Removed from Wishlist' : 'Added to Wishlist',
                wishlisted ? 'Companion removed from your saved list.' : 'Companion saved to your wishlist.',
                [{text: 'OK'}],
              );
            }}
            hitSlop={{top: 10, bottom: 10, left: 4, right: 10}}
            activeOpacity={0.7}>
            <Icon name={wishlisted ? 'bookmark' : 'bookmark-border'} size={20} color={wishlisted ? Colors.primary : Colors.onSurfaceVariant} />
          </TouchableOpacity>
          <View style={styles.iconSep} />
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => (navigation as any).navigate('ConciergeNavigator', {screen: 'Notifications'})}
            hitSlop={{top: 10, bottom: 10, left: 4, right: 10}}
            activeOpacity={0.7}>
            <Icon name="notifications" size={20} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: Math.max(140, insets.bottom + 120)},
        ]}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero section ─────────────────────────────────────────────────── */}
        {/* Stitch: rounded-xl glass-panel min-h-[300px] with bg image + gradient overlay */}
        {/* RN: elevation shadow wrapper + inner clip for Fabric safety            */}
        <View style={styles.heroShadow}>
          <View style={styles.heroCard}>
            {/* Gradient layers simulating the image bg + overlay */}
            <View style={styles.heroImgLayer} />
            <View style={styles.heroOverlayBottom} />
            <View style={styles.heroOverlayTop} />

            {/* Text content (Stitch: bottom-aligned within the hero card) */}
            <View style={styles.heroContent}>
              <Text style={styles.heroHeading}>Reserve Trusted{'\n'}Experience</Text>
              <Text style={styles.heroSub}>
                Securely schedule premium hospitality experiences with concierge-supported protection.
              </Text>
            </View>
          </View>
        </View>

        {/* ── Scheduling card ───────────────────────────────────────────────── */}
        {/* Stitch: glass-panel rounded-xl p-8 — left column content on desktop */}
        <View style={styles.cardShadow}>
          <View style={styles.glassCard}>

            {/* "Schedule Session" heading with calendar_month icon */}
            <View style={styles.scheduleHeadingRow}>
              <Icon name="calendar-month" size={20} color={Colors.primary} />
              <Text style={styles.scheduleHeading}>Schedule Session</Text>
            </View>

            {/* Companion mini-card ────────────────────────────────────────── */}
            {/* Stitch: 80×80 circle avatar + name + speciality + 2 badge pills */}
            <View style={styles.companionRow}>
              {/* Outer shadow wrapper (Fabric-safe) */}
              <View style={styles.avatarShadow}>
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarInitials}>{companion.initials}</Text>
                </View>
              </View>
              <View style={styles.companionMeta}>
                <Text style={styles.companionName}>{companion.name}</Text>
                <Text style={styles.companionSpeciality} numberOfLines={1}>
                  {companion.speciality}
                </Text>
                <View style={styles.companionBadges}>
                  {/* "Trusted Session" — gold badge (Stitch: bg-primary/10 border-primary/20) */}
                  <View style={styles.badgeTrusted}>
                    <Icon name="verified" size={11} color={Colors.primary} />
                    <Text style={styles.badgeTrustedText}>Trusted Session</Text>
                  </View>
                  {/* "Concierge Protected" — muted badge (Stitch: bg-surface-variant/50) */}
                  <View style={styles.badgeProtected}>
                    <Icon name="shield" size={11} color={Colors.onSurfaceVariant} />
                    <Text style={styles.badgeProtectedText}>Concierge Protected</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.cardDivider} />

            {/* Date strip ─────────────────────────────────────────────────── */}
            {/* Stitch: grid-cols-4 — THU 12 / FRI 13 [selected] / SAT 14 / SUN 15 */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateStripContent}>
              {DAYS.map(day => {
                const isActive = selectedDay === day.dateStr;
                return (
                  <TouchableOpacity
                    key={day.dateStr}
                    style={[styles.dayCard, isActive && styles.dayCardActive]}
                    onPress={() => {
                      setSelectedDay(day.dateStr);
                      setSelectedTime(null);
                    }}
                    activeOpacity={0.75}>
                    <Text style={[styles.dayAbbr, isActive && styles.dayAbbrActive]}>
                      {day.dayAbbr}
                    </Text>
                    <Text style={[styles.dayNum, isActive && styles.dayNumActive]}>
                      {day.date}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Concierge Recommended Times ─────────────────────────────────── */}
            {/* Stitch: auto_awesome icon + label + flex-wrap round pills       */}
            <View style={styles.timesSection}>
              <View style={styles.timesLabelRow}>
                <Icon name="auto-awesome" size={13} color={Colors.primary} />
                <Text style={styles.timesLabel}>Concierge Recommended Times</Text>
              </View>
              <View style={styles.timePillsWrap}>
                {TIME_SLOTS.map(slot => {
                  const isActive = selectedTime === slot.id;
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      style={[styles.timePill, isActive && styles.timePillActive]}
                      onPress={() => setSelectedTime(slot.id)}
                      activeOpacity={0.75}>
                      <Text style={[styles.timePillText, isActive && styles.timePillTextActive]}>
                        {slot.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* ── Reservation Summary card ──────────────────────────────────────── */}
        {/* Stitch: right-column sticky card — "Reservation Summary" heading    */}
        {/* + line items + Total (display-lg Playfair gold)                     */}
        <View style={styles.cardShadow}>
          <View style={[styles.glassCard, styles.summaryCardPad]}>
            <Text style={styles.summaryHeading}>Reservation Summary</Text>

            {/* Line items */}
            <View style={styles.lineRow}>
              <Text style={styles.lineKey}>Experience Duration ({DURATION_HRS}h)</Text>
              <Text style={styles.lineVal}>£{experienceBase}</Text>
            </View>
            <View style={styles.lineRow}>
              <Text style={styles.lineKey}>Concierge Protection Fee</Text>
              <Text style={styles.lineVal}>£{conciergeFee}</Text>
            </View>
            {/* Member credits — gold text per Stitch */}
            <View style={styles.lineRow}>
              <Text style={styles.lineKeyGold}>Member Credits Applied</Text>
              <Text style={styles.lineValGold}>-£{memberCredits}</Text>
            </View>

            {/* Total divider + row */}
            <View style={styles.totalDivider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalKey}>Total</Text>
              <Text style={styles.totalVal}>£{total}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky footer ──────────────────────────────────────────────────── */}
      {/* Stitch: full-width gold button "Continue To Secure Payment"          */}
      {/* + "Fully Refundable up to 24h prior" below (verified_user icon)      */}
      <View style={[styles.footer, {paddingBottom: Math.max(20, insets.bottom + 10)}]}>
        <TouchableOpacity
          style={[styles.continueBtn, !selectedTime && styles.continueBtnDisabled]}
          onPress={handleContinue}
          activeOpacity={0.85}>
          <Icon
            name="lock"
            size={18}
            color={selectedTime ? Colors.onPrimary : Colors.onSurfaceVariant}
          />
          <Text style={[styles.continueBtnText, !selectedTime && styles.continueBtnTextDisabled]}>
            {selectedTime ? 'Continue To Secure Payment' : 'Select a Time to Continue'}
          </Text>
        </TouchableOpacity>

        {/* "Fully Refundable up to 24h prior" — Stitch: verified_user icon + label-caps */}
        <View style={styles.refundRow}>
          <Icon name="verified-user" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.refundText}>Fully Refundable up to 24h prior</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const GLASS_BG  = 'rgba(11,13,26,0.6)';
const BORDER    = 'rgba(255,255,255,0.08)';
const GOLD      = Colors.primary;            // #f2ca50
const GOLD_DIM  = 'rgba(242,202,80,0.10)';
const GOLD_BORD = 'rgba(242,202,80,0.20)';

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerActions: {flexDirection: 'row', alignItems: 'center'},
  iconSep: {width: 8},

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, paddingBottom: 140},

  // ── Hero ────────────────────────────────────────────────────────────────────
  // Fabric-safe: outer for elevation, inner overflow:hidden for borderRadius clip
  heroShadow: {
    borderRadius: 16, marginBottom: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  heroCard: {
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: BORDER,
    minHeight: 200,
    backgroundColor: 'rgba(5,8,22,0.9)',
    justifyContent: 'flex-end',
  },
  // Simulated bg image layers
  heroImgLayer: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(15,14,30,1)',
  },
  heroOverlayBottom: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%',
    backgroundColor: 'rgba(5,8,22,0.85)',
  },
  heroOverlayTop: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  heroContent: {padding: 28, zIndex: 2},
  heroHeading: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30, lineHeight: 38,
    color: Colors.onSurface, marginBottom: 10,
  },
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, lineHeight: 21,
  },

  // ── Shared card wrapper (Fabric-safe) ───────────────────────────────────────
  cardShadow: {
    borderRadius: 16, marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  glassCard: {
    backgroundColor: GLASS_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER,
    overflow: 'hidden', padding: 24,
  },
  summaryCardPad: {padding: 28},

  // ── Schedule heading ────────────────────────────────────────────────────────
  scheduleHeadingRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 20,
  },
  scheduleHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 22,
    color: Colors.onSurface, marginLeft: 10,
  },

  // ── Companion mini-card ─────────────────────────────────────────────────────
  companionRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    marginBottom: 20,
  },
  // Fabric-safe avatar: outer elevation, inner clip
  avatarShadow: {
    width: 72, height: 72, borderRadius: 36,
    marginRight: 16, flexShrink: 0,
    elevation: 4,
    shadowColor: GOLD,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  avatarInner: {
    width: 72, height: 72, borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2, borderColor: GOLD_BORD,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitials: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22, color: GOLD,
  },
  companionMeta: {flex: 1, paddingTop: 2},
  companionName: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 18,
    color: Colors.onSurface, marginBottom: 4,
  },
  companionSpeciality: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, marginBottom: 10,
  },
  companionBadges: {flexDirection: 'row', flexWrap: 'wrap'},
  // "Trusted Session" — Stitch: bg-primary/10 border-primary/20
  badgeTrusted: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: GOLD_DIM, borderWidth: 1, borderColor: GOLD_BORD,
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4,
    marginRight: 6, marginBottom: 4,
  },
  badgeTrustedText: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: GOLD, marginLeft: 4, letterSpacing: 0.3,
  },
  // "Concierge Protected" — Stitch: bg-surface-variant/50 border-white/5
  badgeProtected: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(54,53,47,0.5)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999, paddingHorizontal: 8, paddingVertical: 4,
    marginBottom: 4,
  },
  badgeProtectedText: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, marginLeft: 4, letterSpacing: 0.3,
  },

  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER, marginBottom: 20,
  },

  // ── Date strip ──────────────────────────────────────────────────────────────
  dateStripContent: {paddingRight: 4, marginBottom: 24},
  dayCard: {
    minWidth: 60, paddingHorizontal: 10, paddingVertical: 14,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1, borderColor: BORDER,
    borderRadius: 12, alignItems: 'center',
    justifyContent: 'center', marginRight: 10,
  },
  // Stitch selected: bg-primary/10 border-primary/50 gold-glow
  dayCardActive: {
    backgroundColor: GOLD_DIM,
    borderColor: 'rgba(242,202,80,0.50)',
  },
  dayAbbr: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dayAbbrActive: {color: GOLD},
  dayNum: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 22,
    color: Colors.onSurface, marginTop: 4,
  },
  dayNumActive: {color: GOLD},

  // ── Time pills ──────────────────────────────────────────────────────────────
  timesSection: {marginTop: 4},
  timesLabelRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 14},
  timesLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.onSurfaceVariant, marginLeft: 6,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
  timePillsWrap: {flexDirection: 'row', flexWrap: 'wrap'},
  // Stitch: bg-surface-dim border-white/10 rounded-full px-6 py-3
  timePill: {
    paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 999, borderWidth: 1, borderColor: BORDER,
    backgroundColor: Colors.surfaceContainerLowest,
    marginRight: 10, marginBottom: 10,
  },
  // Stitch selected: bg-primary text-on-primary shadow-[0_0_20px_rgba(212,175,55,0.3)]
  timePillActive: {
    backgroundColor: GOLD, borderColor: GOLD,
  },
  timePillText: {
    fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface,
  },
  timePillTextActive: {
    fontFamily: 'Inter-SemiBold', color: Colors.onPrimary,
  },

  // ── Reservation Summary ─────────────────────────────────────────────────────
  // Stitch: "Reservation Summary" heading (headline-sm Playfair)
  //         line items font-body-md + pt-6 divider + total (display-lg-mobile)
  summaryHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 20,
    color: Colors.onSurface, marginBottom: 20,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
    paddingBottom: 16,
  },
  lineRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  lineKey: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, flex: 1, paddingRight: 8,
  },
  lineVal: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurface,
  },
  // Member credits — gold per Stitch
  lineKeyGold: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: GOLD, flex: 1, paddingRight: 8,
  },
  lineValGold: {fontFamily: 'Inter-Regular', fontSize: 14, color: GOLD},
  totalDivider: {
    height: StyleSheet.hairlineWidth, backgroundColor: BORDER,
    marginBottom: 20, marginTop: 4,
  },
  // Stitch: Total label (headline-sm) + price (display-lg-mobile Playfair gold)
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalKey: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 22,
    color: Colors.onSurface,
  },
  totalVal: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 30,
    color: GOLD,
  },

  // ── Footer ──────────────────────────────────────────────────────────────────
  footer: {
    backgroundColor: 'rgba(20,20,15,0.95)',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER,
    paddingHorizontal: 20, paddingTop: 14,
  },
  // Stitch: full-width bg-primary rounded-lg py-4 flex items-center justify-center gap-2
  continueBtn: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', paddingVertical: 16,
    borderRadius: 12, backgroundColor: GOLD,
    marginBottom: 12,
  },
  continueBtnDisabled: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  continueBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 15,
    color: Colors.onPrimary, marginLeft: 8,
  },
  continueBtnTextDisabled: {color: Colors.onSurfaceVariant},
  // Stitch: "Fully Refundable up to 24h prior" — verified_user icon + label-caps
  refundRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center',
  },
  refundText: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.onSurfaceVariant, marginLeft: 6,
    letterSpacing: 0.8, textTransform: 'uppercase',
  },
});
