/**
 * CheckoutScreen — ModalNavigator entry point
 *
 * Route: ModalStackParamList.Checkout
 * Params: {companionId, slotId, venueId?, eventId?}
 *
 * Flow: BookingSummary → Checkout (this screen) → PaymentProcessing → PaymentSuccess
 *
 * Rules:
 *  - No real payment API
 *  - Colors tokens only (+ 2 Stitch CTA overrides noted inline)
 *  - Icon component only — no emoji
 *  - Inter + PlayfairDisplay fonts
 *  - No bare hex outside CTA_BG / CTA_TEXT constants
 *  - No non-ASCII rendered strings
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
  TextInput,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ModalStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = NativeStackScreenProps<ModalStackParamList, 'Checkout'>;

// ─── Design Tokens ────────────────────────────────────────────────────────────
const GLASS_BG    = 'rgba(11,13,26,0.55)';
const BORDER      = 'rgba(255,255,255,0.08)';
const BORDER_GOLD = 'rgba(242,202,80,0.22)';
const BORDER_FINE = 'rgba(255,255,255,0.05)';

// Stitch primary-container / on-primary-container (same as BookingSummary)
const CTA_BG   = '#d4af37';
const CTA_TEXT = '#554300';

// ─── Mock Data ────────────────────────────────────────────────────────────────
interface CompanionInfo {
  name: string;
  speciality: string;
  priceFrom: number;
  trustScore: number;
  rating: string;
  avatarInitial: string;
}

const COMPANIONS: Record<string, CompanionInfo> = {
  default:   {name: 'Elena M.',  speciality: 'Fine Dining & Cultural Curator',  priceFrom: 180, trustScore: 98, rating: '4.9', avatarInitial: 'E'},
  comp_001:  {name: 'Elena M.',  speciality: 'Fine Dining & Cultural Curator',  priceFrom: 180, trustScore: 98, rating: '4.9', avatarInitial: 'E'},
  comp_002:  {name: 'Marcus C.', speciality: 'Art Historian & Cultural Guide',  priceFrom: 140, trustScore: 96, rating: '4.9', avatarInitial: 'M'},
  comp_003:  {name: 'Sophia L.', speciality: 'Wellness Coach & Spa Specialist', priceFrom: 165, trustScore: 99, rating: '5.0', avatarInitial: 'S'},
  comp_006:  {name: 'Ravi M.',   speciality: 'Travel & Hospitality Concierge', priceFrom: 125, trustScore: 94, rating: '4.9', avatarInitial: 'R'},
  elena_001: {name: 'Elena M.',  speciality: 'Fine Dining & Cultural Curator',  priceFrom: 180, trustScore: 98, rating: '4.9', avatarInitial: 'E'},
};

// Parses slotId ("YYYY-MM-DD_HH:MM") into display strings
function parseSlot(slotId: string): {dateLabel: string; timeLabel: string} {
  const parts   = slotId.split('_');
  const dateStr = parts[0] ?? '';
  const time    = parts[1] ?? '19:30';
  let dateLabel = 'Selected Date';
  if (dateStr) {
    try {
      const d       = new Date(dateStr + 'T12:00:00');
      const weekday = d.toLocaleDateString('en-GB', {weekday: 'short'});
      const short   = d.toLocaleDateString('en-GB', {day: 'numeric', month: 'short'});
      dateLabel = `${weekday} ${short}`;
    } catch {}
  }
  const [hStr, mStr] = time.split(':');
  const h    = parseInt(hStr ?? '19', 10);
  const m    = parseInt(mStr ?? '30', 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;
  return {dateLabel, timeLabel: `${h12}:${String(m).padStart(2, '0')} ${ampm}`};
}

const PAYMENT_METHODS = [
  {id: 'card',   icon: 'credit-card',            label: 'Concierge Black Card',    sub: 'Visa xxxx 4242'},
  {id: 'wallet', icon: 'account-balance-wallet',  label: 'Luxury Wallet Credits',   sub: 'Balance: $1,250.00'},
  {id: 'apple',  icon: 'smartphone',              label: 'Digital Pay',             sub: 'Tap to authenticate'},
];

const VALID_PROMO_CODES: Record<string, number> = {
  WELCOME10: 10,
  VIP20:     20,
  CONCIERGE: 15,
};

const TRUST_FEATURES = [
  {icon: 'lock',             label: 'End-to-End Encrypted'},
  {icon: 'account-balance',  label: 'Escrow Protected'},
  {icon: 'assignment-return',label: 'Refund Guaranteed'},
  {icon: 'verified-user',    label: 'Identity Verified'},
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function CheckoutScreen({route, navigation}: Props) {
  const {companionId, slotId, venueId, eventId} = route.params;
  const companion = COMPANIONS[companionId] ?? COMPANIONS.default;
  const {dateLabel, timeLabel} = parseSlot(slotId);
  const insets = useSafeAreaInsets();

  const [selectedPayment, setSelectedPayment] = useState('card');
  const [promoCode,       setPromoCode]        = useState('');
  const [promoApplied,    setPromoApplied]      = useState<string | null>(null);
  const [promoError,      setPromoError]        = useState(false);

  // Pricing
  const experienceBase    = companion.priceFrom;
  const vipLoungeAccess   = Math.round(experienceBase * 0.15);
  const conciergeFee      = Math.round(experienceBase * 0.10);
  const membershipSavings = Math.round(experienceBase * 0.06);
  const promoDiscount     = promoApplied ? VALID_PROMO_CODES[promoApplied] ?? 0 : 0;
  const subtotal          = experienceBase + vipLoungeAccess + conciergeFee - membershipSavings;
  const total             = Math.max(0, subtotal - promoDiscount);

  // Promo code apply handler
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (VALID_PROMO_CODES[code] !== undefined) {
      setPromoApplied(code);
      setPromoError(false);
    } else {
      setPromoApplied(null);
      setPromoError(true);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode('');
    setPromoError(false);
  };

  // Navigate to PaymentProcessing with a mock bookingId
  const handleContinue = () => {
    const mockBookingId = `bk_${companionId}_${slotId}${venueId ? `_${venueId}` : ''}${eventId ? `_${eventId}` : ''}`;
    navigation.navigate('PaymentProcessing', {bookingId: mockBookingId});
  };

  const handleConciergeSupport = () =>
    (navigation as any).navigate('ConciergeNavigator', {
      screen: 'MessagingThread',
      params: {conversationId: 'concierge_main'},
    });

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Icon name="lock" size={14} color={Colors.primary} />
          <Text style={styles.headerTitle}>Secure Checkout</Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={handleConciergeSupport}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="support-agent" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(120, insets.bottom + 100)}]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          <View style={styles.heroGlow} />
          <Text style={styles.heroHeading}>Confirm & Pay</Text>
          <Text style={styles.heroSub}>
            Protected by CoBuddy Secure Payments. Your funds are held in escrow until your experience is confirmed.
          </Text>
        </View>

        {/* ── Companion Card ────────────────────────────────────────────────── */}
        <View style={styles.companionCard}>
          <View style={styles.companionAvatar}>
            <Text style={styles.companionAvatarText}>{companion.avatarInitial}</Text>
          </View>
          <View style={styles.companionMeta}>
            <View style={styles.companionNameRow}>
              <Text style={styles.companionName}>{companion.name}</Text>
              <View style={styles.verifiedPill}>
                <Icon name="verified" size={11} color={Colors.primary} />
                <Text style={styles.verifiedPillText}>VERIFIED</Text>
              </View>
            </View>
            <Text style={styles.companionSpeciality} numberOfLines={1}>{companion.speciality}</Text>
            <View style={styles.companionStatsRow}>
              <View style={styles.companionStatItem}>
                <Icon name="shield" size={11} color={Colors.primary} />
                <Text style={styles.companionStatText}>{companion.trustScore} Trust</Text>
              </View>
              <View style={styles.companionStatItem}>
                <Icon name="star" size={11} color={Colors.primary} />
                <Text style={styles.companionStatText}>{companion.rating}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Booking Details Card ──────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Icon name="event-note" size={16} color={Colors.primary} />
            <Text style={styles.cardHeading}>Booking Details</Text>
          </View>

          <View style={styles.detailGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>DATE</Text>
              <Text style={styles.detailVal}>{dateLabel}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>TIME</Text>
              <Text style={styles.detailVal}>{timeLabel}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>VENUE</Text>
              <Text style={styles.detailVal} numberOfLines={1}>
                {venueId ? `Venue ${venueId}` : 'The Gilded Atelier'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailKey}>GUESTS</Text>
              <Text style={styles.detailVal}>2 VIP</Text>
            </View>
          </View>

          <View style={styles.cardDivider} />
          <View style={styles.trustedNote}>
            <Icon name="shield" size={13} color={Colors.primary} />
            <Text style={styles.trustedNoteText}>Trusted Reservation | Concierge Supported</Text>
          </View>
        </View>

        {/* ── Payment Method Section ────────────────────────────────────────── */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>Payment Method</Text>
          {PAYMENT_METHODS.map(method => {
            const isActive = selectedPayment === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, isActive && styles.paymentCardActive]}
                onPress={() => setSelectedPayment(method.id)}
                activeOpacity={0.8}>
                <View style={styles.paymentLeft}>
                  <View style={[styles.paymentIconWrap, isActive && styles.paymentIconWrapActive]}>
                    <Icon
                      name={method.icon}
                      size={20}
                      color={isActive ? Colors.primary : Colors.onSurfaceVariant}
                    />
                  </View>
                  <View>
                    <Text style={styles.paymentLabel}>{method.label}</Text>
                    <Text style={styles.paymentSub}>{method.sub}</Text>
                  </View>
                </View>
                <View style={[styles.radioOuter, isActive && styles.radioOuterActive]}>
                  {isActive && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Promo Code ────────────────────────────────────────────────────── */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionHeading}>Promo Code</Text>
          <View style={[styles.promoRow, promoError && styles.promoRowError, promoApplied && styles.promoRowSuccess]}>
            {promoApplied ? (
              <>
                <View style={styles.promoAppliedLeft}>
                  <Icon name="local-offer" size={18} color={Colors.success} />
                  <Text style={styles.promoAppliedText}>{promoApplied} applied — -${promoDiscount} off</Text>
                </View>
                <TouchableOpacity onPress={handleRemovePromo} activeOpacity={0.7}>
                  <Icon name="close" size={18} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Icon name="local-offer" size={18} color={promoError ? Colors.error : Colors.onSurfaceVariant} />
                <TextInput
                  style={styles.promoInput}
                  value={promoCode}
                  onChangeText={text => {setPromoCode(text); setPromoError(false);}}
                  placeholder="Enter promo code"
                  placeholderTextColor={Colors.onSurfaceVariant}
                  autoCapitalize="characters"
                  returnKeyType="done"
                  onSubmitEditing={handleApplyPromo}
                />
                <TouchableOpacity
                  style={[styles.promoApplyBtn, !promoCode.trim() && styles.promoApplyBtnDisabled]}
                  onPress={handleApplyPromo}
                  disabled={!promoCode.trim()}
                  activeOpacity={0.8}>
                  <Text style={styles.promoApplyText}>Apply</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {promoError && (
            <View style={styles.promoErrorRow}>
              <Icon name="error-outline" size={13} color={Colors.error} />
              <Text style={styles.promoErrorText}>Invalid code. Try WELCOME10, VIP20, or CONCIERGE.</Text>
            </View>
          )}
        </View>

        {/* ── Price Breakdown ───────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Icon name="receipt-long" size={16} color={Colors.primary} />
            <Text style={styles.cardHeading}>Price Breakdown</Text>
          </View>

          <View style={styles.lineRow}>
            <Text style={styles.lineKey}>Experience Base</Text>
            <Text style={styles.lineVal}>${experienceBase}</Text>
          </View>
          <View style={styles.lineRow}>
            <Text style={styles.lineKey}>VIP Lounge Access</Text>
            <Text style={styles.lineVal}>${vipLoungeAccess}</Text>
          </View>
          <View style={styles.lineRow}>
            <Text style={styles.lineKey}>Concierge Fee</Text>
            <Text style={styles.lineVal}>${conciergeFee}</Text>
          </View>

          <View style={[styles.lineRow, styles.lineRowSavings]}>
            <Text style={styles.lineKeySavings}>Membership Savings</Text>
            <Text style={styles.lineValSavings}>-${membershipSavings}</Text>
          </View>

          {promoApplied && (
            <View style={[styles.lineRow, styles.lineRowPromo]}>
              <Text style={styles.lineKeyPromo}>Promo ({promoApplied})</Text>
              <Text style={styles.lineValPromo}>-${promoDiscount}</Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalKey}>Total Due</Text>
            <Text style={styles.totalVal}>${total}</Text>
          </View>
        </View>

        {/* ── Trust + Escrow Section ────────────────────────────────────────── */}
        <View style={styles.trustCard}>
          <View style={styles.trustCardHeader}>
            <View style={styles.trustShieldWrap}>
              <Icon name="security" size={20} color={Colors.primary} />
            </View>
            <View style={styles.trustCardTitleBlock}>
              <Text style={styles.trustCardTitle}>CoBuddy Secure Payment</Text>
              <Text style={styles.trustCardSub}>Your payment is protected at every step</Text>
            </View>
          </View>

          <View style={styles.trustFeaturesGrid}>
            {TRUST_FEATURES.map(feat => (
              <View key={feat.icon} style={styles.trustFeatureItem}>
                <View style={styles.trustFeatureIconWrap}>
                  <Icon name={feat.icon} size={14} color={Colors.primary} />
                </View>
                <Text style={styles.trustFeatureLabel}>{feat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.trustNote}>
            <Icon name="info-outline" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.trustNoteText}>
              Funds are held in escrow and released only after your experience begins. Full refund available up to 24 hours before your booking.
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Sticky Bottom Bar ──────────────────────────────────────────────────── */}
      <View style={[styles.bottomBar, {paddingBottom: Math.max(20, insets.bottom + 8)}]}>
        {/* Mini total above CTA */}
        <View style={styles.bottomBarTotal}>
          <Text style={styles.bottomBarTotalLabel}>Total</Text>
          <Text style={styles.bottomBarTotalValue}>${total}</Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.87}>
          <Icon name="lock" size={18} color={CTA_TEXT} />
          <Text style={styles.ctaBtnText}>Continue To Secure Payment</Text>
        </TouchableOpacity>

        <View style={styles.bottomBarNote}>
          <Icon name="shield" size={12} color={Colors.onSurfaceVariant} />
          <Text style={styles.bottomBarNoteText}>Encrypted  |  Escrow Protected  |  Instant Refund Support</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // ── Header
  header: {
    height: 64,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.85)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  headerIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.primary, letterSpacing: 0.2,
  },

  // ── Scroll
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 0, gap: 16},

  // ── Hero
  heroSection: {
    paddingTop: 24, paddingBottom: 8, position: 'relative', overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute', top: -20, left: -20, right: -20, height: 140,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  heroHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 30,
    lineHeight: 36, color: Colors.onSurface, marginBottom: 10, zIndex: 1,
  },
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, lineHeight: 22,
  },

  // ── Companion Card
  companionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: GLASS_BG, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER_GOLD,
    padding: 16,
  },
  companionAvatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  companionAvatarText: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.primary,
  },
  companionMeta: {flex: 1, gap: 4},
  companionNameRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  companionName: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  verifiedPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(242,202,80,0.10)', borderRadius: 20,
    paddingHorizontal: 7, paddingVertical: 3,
    borderWidth: 1, borderColor: BORDER_GOLD,
  },
  verifiedPillText: {fontFamily: 'Inter-SemiBold', fontSize: 8, color: Colors.primary, letterSpacing: 1},
  companionSpeciality: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  companionStatsRow: {flexDirection: 'row', gap: 12, marginTop: 2},
  companionStatItem: {flexDirection: 'row', alignItems: 'center', gap: 4},
  companionStatText: {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurface},

  // ── Generic card
  card: {
    backgroundColor: GLASS_BG, borderRadius: 20,
    borderWidth: 1, borderColor: BORDER, padding: 20, gap: 14,
  },
  cardHeaderRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  cardHeading: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface},
  cardDivider: {height: StyleSheet.hairlineWidth, backgroundColor: BORDER},

  // Booking detail grid
  detailGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 14,
  },
  detailItem: {width: '47%', gap: 4},
  detailKey: {
    fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.2,
    color: Colors.onSurfaceVariant, opacity: 0.7,
  },
  detailVal: {fontFamily: 'Inter-Medium', fontSize: 15, color: Colors.onSurface},

  // Trusted note
  trustedNote: {flexDirection: 'row', alignItems: 'center', gap: 8},
  trustedNoteText: {
    fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant,
  },

  // ── Section block (heading + items)
  sectionBlock: {gap: 10},
  sectionHeading: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface,
  },

  // Payment method cards
  paymentCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: GLASS_BG, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  paymentCardActive: {
    borderColor: 'rgba(242,202,80,0.40)',
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  paymentLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  paymentIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  paymentIconWrapActive: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderColor: BORDER_GOLD,
  },
  paymentLabel: {fontFamily: 'Inter-Medium', fontSize: 15, color: Colors.onSurface},
  paymentSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2},
  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.outlineVariant,
    alignItems: 'center', justifyContent: 'center',
  },
  radioOuterActive: {borderColor: Colors.primary},
  radioInner: {width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary},

  // Promo code
  promoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: GLASS_BG, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER, paddingHorizontal: 14, paddingVertical: 12,
  },
  promoRowError: {borderColor: 'rgba(255,100,100,0.40)'},
  promoRowSuccess: {borderColor: 'rgba(109,217,140,0.40)', backgroundColor: 'rgba(109,217,140,0.04)'},
  promoInput: {
    flex: 1, fontFamily: 'Inter-Medium', fontSize: 14,
    color: Colors.onSurface, letterSpacing: 1,
  },
  promoApplyBtn: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: BORDER_GOLD,
  },
  promoApplyBtnDisabled: {opacity: 0.4},
  promoApplyText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
  promoAppliedLeft: {flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1},
  promoAppliedText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.success},
  promoErrorRow: {flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 2},
  promoErrorText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.error, flex: 1},

  // Price breakdown line items
  lineRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  lineRowSavings: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER,
    paddingTop: 12, marginTop: 2,
  },
  lineRowPromo: {marginTop: 0},
  lineKey: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, flex: 1},
  lineVal: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  lineKeySavings: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.primary, flex: 1},
  lineValSavings: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.primary},
  lineKeyPromo:   {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.success, flex: 1},
  lineValPromo:   {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.success},
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER,
    paddingTop: 16, marginTop: 4,
  },
  totalKey: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface},
  totalVal: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.primary},

  // Trust card
  trustCard: {
    backgroundColor: GLASS_BG, borderRadius: 20,
    borderWidth: 1, borderColor: BORDER_GOLD, padding: 20, gap: 16,
  },
  trustCardHeader: {flexDirection: 'row', alignItems: 'center', gap: 12},
  trustShieldWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: BORDER_GOLD,
    alignItems: 'center', justifyContent: 'center',
  },
  trustCardTitleBlock: {flex: 1},
  trustCardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  trustCardSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 3},
  trustFeaturesGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  trustFeatureItem: {
    flexDirection: 'row', alignItems: 'center', gap: 6, width: '47%',
  },
  trustFeatureIconWrap: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: BORDER_GOLD,
    alignItems: 'center', justifyContent: 'center',
  },
  trustFeatureLabel: {fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.onSurface, flex: 1},
  trustNote: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 10, padding: 12,
  },
  trustNoteText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},

  // ── Bottom sticky bar
  bottomBar: {
    backgroundColor: 'rgba(32,32,26,0.97)',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: BORDER_FINE,
    shadowColor: '#000', shadowOffset: {width: 0, height: -8},
    shadowOpacity: 0.5, shadowRadius: 32, elevation: 20,
    paddingHorizontal: 20, paddingTop: 12, gap: 10,
  },
  bottomBarTotal: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  bottomBarTotalLabel: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  bottomBarTotalValue: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.primary},
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: CTA_BG, borderRadius: 12, paddingVertical: 16,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 4,
  },
  ctaBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 16,
    color: CTA_TEXT, letterSpacing: 0.2,
  },
  bottomBarNote: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingBottom: 2,
  },
  bottomBarNoteText: {
    fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
