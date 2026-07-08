/**
 * BookingSummaryScreen
 *
 * Stitch Reference (SOLE):
 *   _extracted/stitch_cobuddy_premium_companion_platform_9/
 *   stitch_cobuddy_premium_companion_platform/
 *   secure_checkout_reservation_payment_screen/code.html
 *
 * Audit fixes applied (2026-06-06):
 *   P0 — CTA button color (#d4af37 bg, #554300 text), VIP Lounge Access line
 *   P1 — Label renames, savings separator, total = 24px both sides, GUESTS/2 VIP
 *   P2 — All font sizes aligned to Stitch body-md (16px) / display-lg-mobile (32px)
 *   P3 — Badge size 48, currency $, bullet •, border 0.05, upward shadow, radius 12
 */
import React, {useState} from 'react';
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
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SessionsStackParamList, 'BookingSummary'>;
const comingSoon = () =>
  Alert.alert('Coming Soon', 'Payment processing will be connected in the next phase.');


// ─── Companion mock data ───────────────────────────────────────────────────────
interface CompanionInfo {
  name: string;
  speciality: string;
  priceFrom: number;
  trustScore: number;
  rating: string;
}
const COMPANIONS: Record<string, CompanionInfo> = {
  default:   {name: 'Elena M.',  speciality: 'Fine Dining & Cultural Curator',   priceFrom: 180, trustScore: 98, rating: '4.9'},
  comp_001:  {name: 'Elena M.',  speciality: 'Fine Dining & Cultural Curator',   priceFrom: 180, trustScore: 98, rating: '4.9'},
  comp_002:  {name: 'Marcus C.', speciality: 'Art Historian & Cultural Guide',   priceFrom: 140, trustScore: 96, rating: '4.9'},
  comp_003:  {name: 'Sophia L.', speciality: 'Wellness Coach & Spa Specialist',  priceFrom: 165, trustScore: 99, rating: '5.0'},
  comp_006:  {name: 'Ravi M.',   speciality: 'Travel & Hospitality Concierge',  priceFrom: 125, trustScore: 94, rating: '4.9'},
  elena_001: {name: 'Elena M.',  speciality: 'Fine Dining & Cultural Curator',   priceFrom: 180, trustScore: 98, rating: '4.9'},
};

// Parses slotId ("YYYY-MM-DD_HH:MM") into display strings
function parseSlot(slotId: string): {dateLabel: string; timeLabel: string} {
  const parts = slotId.split('_');
  const dateStr = parts[0] ?? '';
  const time = parts[1] ?? '19:30';
  let dateLabel = 'Selected Date';
  if (dateStr) {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      const weekday = d.toLocaleDateString('en-GB', {weekday: 'short'});
      const dateShort = d.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
      dateLabel = `${weekday} ${dateShort}`;
    } catch {}
  }
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr ?? '19', 10);
  const m = parseInt(mStr ?? '30', 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const timeLabel = `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  return {dateLabel, timeLabel};
}

// Payment methods (Stitch: Concierge Black Card selected + Luxury Wallet Credits)
// P3: wallet balance uses $ (Stitch: "$1,250.00")
const PAYMENT_METHODS = [
  {id: 'card',   icon: 'credit-card',           label: 'Concierge Black Card',   sub: '•••• 4242'},
  {id: 'wallet', icon: 'account-balance-wallet', label: 'Luxury Wallet Credits', sub: 'Balance: $1,250.00'},
];

// ─── CTA colour constants (Stitch primary-container / on-primary-container)  ──
// NOTE: App colors.ts has wrong values for these tokens (#3d3200 / #f2ca50).
// Stitch defines: primary-container=#d4af37, on-primary-container=#554300.
// Hardcoded here to avoid global token change.
const CTA_BG   = '#d4af37'; // Stitch: bg-primary-container
const CTA_TEXT = '#554300'; // Stitch: text-on-primary-container

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function BookingSummaryScreen({route, navigation}: Props) {
  const {companionId, slotId, venueId} = route.params;
  const companion = COMPANIONS[companionId] ?? COMPANIONS.default;
  const {dateLabel, timeLabel} = parseSlot(slotId);
  const insets = useSafeAreaInsets();

  const [selectedPayment, setSelectedPayment] = useState('card');

  // P0: 4-line pricing — Experience Base + VIP Lounge Access + Concierge Fee − Membership Savings
  const experienceBase    = companion.priceFrom;
  const vipLoungeAccess   = Math.round(experienceBase * 0.15); // P0: new line
  const conciergeFee      = Math.round(experienceBase * 0.10); // P1: renamed
  const membershipSavings = Math.round(experienceBase * 0.06); // P1: renamed
  const total = experienceBase + vipLoungeAccess + conciergeFee - membershipSavings;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      {/* Stitch: h-16 (64px), back=primary, "Checkout" 20px primary, support=primary */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.primary} />
        </TouchableOpacity>
        {/* P2: headerTitle 20px */}
        <Text style={styles.headerTitle}>Checkout</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => (navigation as any).navigate('ConciergeNavigator', {
            screen: 'MessagingThread',
            params: {conversationId: 'concierge_main'},
          })}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="support-agent" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: Math.max(110, insets.bottom + 90)},
        ]}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Section ────────────────────────────────────────────────── */}
        {/* Stitch: px-margin-mobile pt-6 pb-8, gradient from-primary/5 to-transparent */}
        {/* P2: heading 32px, sub 16px */}
        <View style={styles.heroSection}>
          <View style={styles.heroGradient} />
          <Text style={styles.heroHeading}>Secure Hospitality Checkout</Text>
          <Text style={styles.heroSub}>
            Protected premium reservations, concierge-supported billing, and trusted hospitality
            transactions.
          </Text>
        </View>

        {/* ── Reservation Summary Card ─────────────────────────────────────── */}
        {/* Stitch: glass-panel ambient-glow rounded-3xl p-6 relative overflow-hidden */}
        <View style={styles.reservationCard}>
          {/* Gradient overlay layer (simulates Stitch from-surface-dim gradient) */}
          <View style={styles.reservationOverlay} />

          <View style={styles.reservationContent}>
            {/* Top: pill + venue name + verified badge */}
            <View style={styles.reservationTop}>
              <View style={styles.reservationTitleBlock}>
                {/* P2: categoryPillText 12px */}
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryPillText}>Hospitality</Text>
                </View>
                {/* P2: venueName 24px */}
                <Text style={styles.venueName}>
                  {venueId ? `Venue #${venueId}` : 'The Gilded Atelier'}
                </Text>
              </View>
              {/* P3: verifiedBadge 48×48 */}
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={24} color={Colors.primary} />
              </View>
            </View>

            {/* Date/time + Guests grid (2-col) */}
            {/* P1: GUESTS / 2 VIP */}
            <View style={styles.reservationGrid}>
              <View style={styles.reservationCell}>
                <Text style={styles.reservationKey}>DATE & TIME</Text>
                {/* P2: reservationVal 16px */}
                <Text style={styles.reservationVal}>{dateLabel} • {timeLabel}</Text>
              </View>
              <View style={styles.reservationCell}>
                {/* P1: label "GUESTS", value "2 VIP" */}
                <Text style={styles.reservationKey}>GUESTS</Text>
                <Text style={styles.reservationVal}>2 VIP</Text>
              </View>
            </View>

            {/* Trusted note */}
            {/* P3: separator char • (bullet) */}
            <View style={styles.trustedNote}>
              <Icon name="shield" size={14} color={Colors.primary} />
              <Text style={styles.trustedNoteText}>Trusted Reservation • Secure Checkout</Text>
            </View>
          </View>
        </View>

        {/* ── Payment Method Section ───────────────────────────────────────── */}
        {/* Stitch: font-headline-sm text-[20px] = Playfair 20px */}
        <View style={styles.paymentSection}>
          {/* P2: paymentHeading 20px */}
          <Text style={styles.paymentHeading}>Payment Method</Text>
          {PAYMENT_METHODS.map(method => {
            const isActive = selectedPayment === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, isActive && styles.paymentCardActive]}
                onPress={() => setSelectedPayment(method.id)}
                activeOpacity={0.8}>
                <View style={styles.paymentLeft}>
                  <View style={[
                    styles.paymentIconWrap,
                    isActive && styles.paymentIconWrapActive,
                    // P3: unselected gets border-white/5
                    !isActive && styles.paymentIconWrapUnselected,
                  ]}>
                    <Icon
                      name={method.icon}
                      size={20}
                      color={isActive ? Colors.primary : Colors.onSurfaceVariant}
                    />
                  </View>
                  <View>
                    {/* P2: paymentLabel 16px */}
                    <Text style={styles.paymentLabel}>{method.label}</Text>
                    {/* P2: paymentSub 14px */}
                    <Text style={styles.paymentSub}>{method.sub}</Text>
                  </View>
                </View>
                {/* Radio indicator: circle with gold dot when selected */}
                <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                  {isActive && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Summary / Total Breakdown Card ──────────────────────────────── */}
        {/* Stitch: glass-panel rounded-3xl p-6, "Summary" heading 20px     */}
        <View style={styles.summaryCard}>
          {/* P2: summaryHeading 20px */}
          <Text style={styles.summaryHeading}>Summary</Text>

          {/* Line items — Stitch: font-body-md = 16px, text-on-surface-variant */}
          {/* P2: lineKey/lineVal 16px */}

          {/* Line 1: Experience Base */}
          <View style={styles.lineRow}>
            <Text style={styles.lineKey}>Experience Base</Text>
            <Text style={styles.lineVal}>${experienceBase}</Text>
          </View>

          {/* Line 2: VIP Lounge Access (P0: new line) */}
          <View style={styles.lineRow}>
            <Text style={styles.lineKey}>VIP Lounge Access</Text>
            <Text style={styles.lineVal}>${vipLoungeAccess}</Text>
          </View>

          {/* Line 3: Concierge Fee (P1: renamed from "Concierge Protection Fee") */}
          <View style={styles.lineRow}>
            <Text style={styles.lineKey}>Concierge Fee</Text>
            <Text style={styles.lineVal}>${conciergeFee}</Text>
          </View>

          {/* Line 4: Membership Savings — gold, with top border separator */}
          {/* P1: renamed from "Member Credits Applied", added border-t */}
          <View style={[styles.lineRow, styles.lineRowSavings]}>
            <Text style={styles.lineKeySavings}>Membership Savings</Text>
            <Text style={styles.lineValSavings}>-${membershipSavings}</Text>
          </View>

          {/* Total — Stitch: mt-6 pt-6 border-t, both 24px headline-sm */}
          {/* P1: both label + value 24px (was 22 + 28) */}
          <View style={styles.totalRow}>
            <Text style={styles.totalKey}>Total</Text>
            <Text style={styles.totalVal}>${total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* ── Sticky Bottom Bar ────────────────────────────────────────────────── */}
      {/* Stitch: bg-surface-container/95, border-white/5, upward shadow        */}
      {/* P0: CTA uses #d4af37 bg + #554300 text (not Colors.primaryContainer)  */}
      {/* P3: border rgba(0.05), upward shadow, radius 12                        */}
      <View style={[styles.bottomBar, {paddingBottom: Math.max(20, insets.bottom + 8)}]}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => {
              // Navigate to Checkout modal — full payment flow:
              // BookingSummary → Checkout → PaymentProcessing → PaymentSuccess
              (navigation as any).navigate('ModalNavigator', {
                screen: 'Checkout',
                params: {
                  companionId: route.params.companionId,
                  slotId:      route.params.slotId,
                  venueId:     route.params.venueId,
                },
              });
            }}
          activeOpacity={0.87}>
          {/* P0: lock icon size 20, color CTA_TEXT */}
          <Icon name="lock" size={20} color={CTA_TEXT} />
          {/* P2: payBtnText 16px; P0: color CTA_TEXT */}
          <Text style={styles.payBtnText}>Continue To Secure Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const GLASS_BG    = 'rgba(11,13,26,0.4)';
const BORDER      = 'rgba(255,255,255,0.08)';
const BORDER_FINE = 'rgba(255,255,255,0.05)'; // P3: Stitch border-white/5
const BORDER_MID  = 'rgba(255,255,255,0.10)'; // Stitch border-white/10 for savings

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // ── Header ──────────────────────────────────────────────────────────────────
  // Stitch: h-16 = 64px, bg-surface/80, border-b border-white/10
  header: {
    height: 64,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.8)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  // P2: 20px (was 18) | Stitch: text-[20px] text-primary font-medium
  headerTitle: {
    fontFamily: 'Inter-Medium', fontSize: 20,
    color: Colors.primary,
  },

  // ── Scroll ──────────────────────────────────────────────────────────────────
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 0},

  // ── Hero Section ────────────────────────────────────────────────────────────
  // Stitch: px-margin-mobile pt-6 pb-8 (24/32px), gradient from-primary/5 to-transparent
  heroSection: {
    position: 'relative', paddingTop: 24, paddingBottom: 32, overflow: 'hidden',
  },
  heroGradient: {
    position: 'absolute', top: 0, left: -20, right: -20, height: 130,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  // P2: 32px (was 28) | Stitch: font-display-lg-mobile = 32px lineHeight 1.2 Playfair
  heroHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 32,
    lineHeight: 38, color: Colors.onSurface, marginBottom: 12, zIndex: 1,
  },
  // P2: 16px (was 14) | Stitch: font-body-md = 16px lineHeight 1.6 Inter
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 16,
    color: Colors.onSurfaceVariant, lineHeight: 26,
  },

  // ── Reservation Card ────────────────────────────────────────────────────────
  // Stitch: glass-panel ambient-glow rounded-3xl (24px) p-6 relative overflow-hidden
  reservationCard: {
    backgroundColor: GLASS_BG,
    borderRadius: 24, borderWidth: 1, borderColor: BORDER,
    marginBottom: 20, overflow: 'hidden',
    // ambient-glow: box-shadow rgba(212,175,55,0.05)
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.05, shadowRadius: 40,
    elevation: 3,
  },
  reservationOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%',
    backgroundColor: 'rgba(20,20,15,0.6)',
  },
  reservationContent: {padding: 24, zIndex: 1},
  reservationTop: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 16,
  },
  reservationTitleBlock: {flex: 1, marginRight: 12},
  // Category pill: rounded-full bg-primary/10 border border-primary/20
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    borderRadius: 999, paddingHorizontal: 12, paddingVertical: 4,
    marginBottom: 8,
  },
  // P2: 12px (was 10) | Stitch: font-label-caps = 12px Inter SemiBold
  categoryPillText: {
    fontFamily: 'Inter-SemiBold', fontSize: 12,
    color: Colors.primary, letterSpacing: 1,
  },
  // P2: 24px (was 20) | Stitch: font-headline-sm = 24px Playfair weight 500
  venueName: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24,
    color: Colors.onSurface,
  },
  // P3: 48×48 (was 44) | Stitch: w-12 h-12 rounded-full bg-surface-container
  verifiedBadge: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  // Grid
  reservationGrid: {flexDirection: 'row', marginBottom: 16},
  reservationCell: {flex: 1},
  reservationKey: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.onSurfaceVariant, opacity: 0.7,
    letterSpacing: 0.8, marginBottom: 4,
  },
  // P2: 16px (was 14) | Stitch: font-body-md = 16px
  reservationVal: {
    fontFamily: 'Inter-Medium', fontSize: 16, color: Colors.onSurface,
  },
  // Trusted note — P3: bullet • (was ·)
  trustedNote: {
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER_MID,
    paddingTop: 16,
  },
  // Stitch: font-body-md text-sm = 14px
  trustedNoteText: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, marginLeft: 10,
  },

  // ── Payment Method Section ───────────────────────────────────────────────────
  paymentSection: {marginBottom: 20},
  // P2: 20px (was 18) | Stitch: text-[20px] Playfair
  paymentHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 20,
    color: Colors.onSurface, marginBottom: 12,
  },
  // Stitch: glass-panel rounded-2xl (16px) p-4
  paymentCard: {
    backgroundColor: GLASS_BG,
    borderRadius: 16, borderWidth: 1, borderColor: BORDER,
    padding: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 10,
  },
  // Selected: border-primary/40, bg-primary/5
  paymentCardActive: {
    borderColor: 'rgba(242,202,80,0.40)',
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  paymentLeft: {flexDirection: 'row', alignItems: 'center'},
  // Selected icon circle: bg-surface-container-high (no extra border per Stitch)
  paymentIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 14,
  },
  paymentIconWrapActive: {
    backgroundColor: Colors.surfaceContainerHigh,
  },
  // P3: unselected circle gets border-white/5
  paymentIconWrapUnselected: {
    borderWidth: 1, borderColor: BORDER_FINE,
  },
  // P2: 16px (was 14) | Stitch: font-body-md font-medium
  paymentLabel: {
    fontFamily: 'Inter-Medium', fontSize: 16, color: Colors.onSurface,
  },
  // P2: 14px (was 12) | Stitch: text-sm = 14px
  paymentSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, marginTop: 2,
  },
  // Radio: Stitch w-5 h-5 = 20px, border-2, inner w-2.5 h-2.5 = 10px
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: {borderColor: Colors.primary},
  radioInner: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  // ── Summary Card ────────────────────────────────────────────────────────────
  // Stitch: glass-panel rounded-3xl (24px) p-6 mt-4
  summaryCard: {
    backgroundColor: GLASS_BG,
    borderRadius: 24, borderWidth: 1, borderColor: BORDER,
    padding: 24, marginBottom: 8,
  },
  // P2: 20px (was 18) | Stitch: font-headline-sm text-[20px] mb-6
  summaryHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 20,
    color: Colors.onSurface, marginBottom: 20,
  },
  // Line items — Stitch: font-body-md = 16px, text-on-surface-variant, gap-4 (16px)
  // P2: 16px (was 14)
  lineRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 16,
  },
  // P1: Membership Savings row — border-t border-white/10 pt-4 mt-2 text-primary
  lineRowSavings: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER_MID,
    paddingTop: 16, marginTop: 2,
  },
  lineKey: {
    fontFamily: 'Inter-Regular', fontSize: 16, color: Colors.onSurfaceVariant,
    flex: 1, paddingRight: 8,
  },
  lineVal: {
    fontFamily: 'Inter-Regular', fontSize: 16, color: Colors.onSurfaceVariant,
  },
  // Savings — gold text
  lineKeySavings: {
    fontFamily: 'Inter-Regular', fontSize: 16, color: Colors.primary,
    flex: 1, paddingRight: 8,
  },
  lineValSavings: {
    fontFamily: 'Inter-Regular', fontSize: 16, color: Colors.primary,
  },
  // Total — Stitch: mt-6 pt-6 border-t border-white/10
  // P1: both label + value 24px (was 22 + 28)
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER_MID,
    marginTop: 8, paddingTop: 24,
  },
  // Stitch: font-headline-sm text-[24px] text-on-surface
  totalKey: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: Colors.onSurface,
  },
  // Stitch: font-headline-sm text-[24px] text-primary (same size as label)
  totalVal: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: Colors.primary,
  },

  // ── Bottom Bar ──────────────────────────────────────────────────────────────
  // Stitch: fixed bottom-0, bg-surface-container/95, border-white/5,
  //         shadow-[0_-8px_32px_rgba(0,0,0,0.5)], px-margin-mobile pt-4
  bottomBar: {
    backgroundColor: 'rgba(32,32,26,0.95)',
    // P3: border-white/5 (was 0.08)
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER_FINE,
    // P3: upward shadow
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -8},
    shadowOpacity: 0.5, shadowRadius: 32,
    elevation: 20,
    paddingHorizontal: 20, paddingTop: 16,
  },
  // P0: bg = #d4af37 (Stitch primary-container), text = #554300 (on-primary-container)
  // P3: rounded-xl = 12px (was 14)
  payBtn: {
    width: '100%',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: CTA_BG,           // P0: '#d4af37'
    borderRadius: 12,                  // P3: was 14
    paddingVertical: 16,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15, shadowRadius: 20,
    elevation: 4,
  },
  // P2: 16px (was 15) | P0: color CTA_TEXT = '#554300'
  payBtnText: {
    fontFamily: 'Inter-Medium', fontSize: 16,
    color: CTA_TEXT,                   // P0: '#554300'
    marginLeft: 10,
  },
});
