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
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'TransactionDetail'>;

// ── Mock detail lookup (Stitch: transaction_detail_screen) ────────────────────
const MOCK_DETAILS: Record<string, {
  id: string; icon: string; label: string; category: string;
  date: string; time: string; amount: string; positive: boolean;
  status: 'Successful' | 'Completed' | 'Pending' | 'Failed';
  refId: string; paymentSource: string;
  experience?: string; venue?: string; companion?: string;
  breakdown?: {label: string; value: string}[];
}> = {
  tx_001: {
    id: 'tx_001', icon: 'hotel',
    label: 'The Ritz-Carlton - Kyoto', category: 'Booking',
    date: 'Oct 24, 2023', time: '19:45 PST',
    amount: '-$1,450.00', positive: false, status: 'Successful',
    refId: '#CB-8829-XQ',
    paymentSource: 'Visa ending in 4242',
    experience: 'Heritage Sunset Social',
    venue: 'The Ritz-Carlton, Kyoto',
    companion: 'Elara V.',
    breakdown: [
      {label: 'Experience Fee',  value: '$1,200.00'},
      {label: 'Venue Charges',  value: '$150.00'},
      {label: 'Protection Fee', value: '$60.00'},
      {label: 'Taxes',          value: '$40.00'},
    ],
  },
  tx_002: {
    id: 'tx_002', icon: 'restaurant',
    label: 'Le Bernardin - NYC', category: 'Dining',
    date: 'Oct 22, 2023', time: '14:00 EST',
    amount: '-$850.00', positive: false, status: 'Pending',
    refId: '#CB-7741-RW',
    paymentSource: 'CoBuddy Wallet',
    experience: 'Private Dining Experience',
    venue: 'Le Bernardin, New York',
    companion: 'Sophie M.',
    breakdown: [
      {label: 'Experience Fee',  value: '$700.00'},
      {label: 'Venue Charges',  value: '$80.00'},
      {label: 'Protection Fee', value: '$40.00'},
      {label: 'Taxes',          value: '$30.00'},
    ],
  },
  tx_003: {
    id: 'tx_003', icon: 'workspace-premium',
    label: 'Membership Renewal - Gold Tier', category: 'Subscription',
    date: 'Oct 15, 2023', time: '00:00 UTC',
    amount: '+$5,000.00', positive: true, status: 'Completed',
    refId: '#CB-5500-MG',
    paymentSource: 'Visa ending in 4242',
    breakdown: [
      {label: 'Gold Tier Annual', value: '$5,000.00'},
    ],
  },
  tx_004: {
    id: 'tx_004', icon: 'event-seat',
    label: 'Session Escrow - Private Gallery', category: 'Session',
    date: 'Oct 12, 2023', time: '11:30 PST',
    amount: '-$1,200.00', positive: false, status: 'Successful',
    refId: '#CB-6612-PG',
    paymentSource: 'CoBuddy Wallet',
    experience: 'Private Gallery Evening',
    venue: 'The Oberoi, London',
    companion: 'Mia R.',
    breakdown: [
      {label: 'Experience Fee',  value: '$950.00'},
      {label: 'Venue Charges',  value: '$160.00'},
      {label: 'Protection Fee', value: '$55.00'},
      {label: 'Taxes',          value: '$35.00'},
    ],
  },
  tx_005: {
    id: 'tx_005', icon: 'add-circle',
    label: 'Wallet Top-Up', category: 'Credits',
    date: 'Oct 01, 2023', time: '09:12 UTC',
    amount: '+$2,500.00', positive: true, status: 'Completed',
    refId: '#CB-1001-WU',
    paymentSource: 'Visa ending in 4242',
    breakdown: [{label: 'Credits Added', value: '$2,500.00'}],
  },
  tx_006: {
    id: 'tx_006', icon: 'redeem',
    label: 'Reward Redemption', category: 'Rewards',
    date: 'Sep 28, 2023', time: '16:00 UTC',
    amount: '-500 Pts', positive: false, status: 'Completed',
    refId: '#CB-0928-RD',
    paymentSource: 'Rewards Balance',
    breakdown: [{label: 'Points Redeemed', value: '500 Pts'}],
  },
};

const STATUS_COLOR: Record<string, string> = {
  Successful: Colors.success,
  Completed:  Colors.success,
  Pending:    Colors.warning,
  Failed:     Colors.error,
};
const STATUS_ICON: Record<string, string> = {
  Successful: 'check-circle',
  Completed:  'check-circle',
  Pending:    'schedule',
  Failed:     'cancel',
};

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function TransactionDetailScreen({navigation, route}: Props) {
  const {transactionId} = route.params;
  const tx = MOCK_DETAILS[transactionId];

  // ── Safe error state: unknown transactionId (real UUID from backend) ─────────
  if (!tx) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            activeOpacity={0.7}>
            <Icon name="arrow-back" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transaction Details</Text>
          <View style={styles.headerIconBtn} />
        </View>
        <View style={styles.notFoundWrap}>
          <Icon name="receipt-long" size={48} color={Colors.outlineVariant} />
          <Text style={styles.notFoundTitle}>Transaction Not Found</Text>
          <Text style={styles.notFoundSub}>
            This record could not be loaded. It may be pending sync or unavailable offline.
          </Text>
          <TouchableOpacity
            style={styles.notFoundBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}>
            <Text style={styles.notFoundBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = STATUS_COLOR[tx.status] ?? Colors.onSurfaceVariant;
  const statusIcon  = STATUS_ICON[tx.status]  ?? 'help';

  const total = tx.breakdown
    ? tx.breakdown.reduce((sum, b) => {
        const n = parseFloat(b.value.replace(/[^0-9.]/g, ''));
        return sum + (isNaN(n) ? 0 : n);
      }, 0)
    : null;

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
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.navigate('ReceiptViewer', {transactionId: route.params.transactionId})}
          activeOpacity={0.7}>
          <Icon name="ios-share" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        <Text style={styles.pageSubtitle}>
          Securely manage your premium experience records.
        </Text>

        {/* ── Transaction ID hero card ──────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />

          <View style={styles.heroTop}>
            <View style={styles.receiptIconWrap}>
              <Icon name="receipt-long" size={28} color={Colors.primary} />
            </View>
            <View style={styles.refBlock}>
              <Text style={styles.refLabel}>TRANSACTION ID</Text>
              <Text style={styles.refValue}>{tx.refId}</Text>
              <View style={[styles.statusBadge, {borderColor: `${statusColor}30`}]}>
                <Icon name={statusIcon} size={12} color={statusColor} />
                <Text style={[styles.statusBadgeText, {color: statusColor}]}>
                  {tx.status}
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.heroAmount, tx.positive && styles.heroAmountPos]}>
            {tx.amount}
          </Text>

          <View style={styles.verifiedBanner}>
            <Icon name="verified-user" size={14} color={Colors.success} />
            <View style={styles.verifiedMeta}>
              <Text style={styles.verifiedTitle}>Verified Transaction</Text>
              <Text style={styles.verifiedSub}>Processed via Secure Gateway</Text>
            </View>
          </View>
        </View>

        {/* ── Date / Time / Method ─────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TRANSACTION INFO</Text>
          {[
            {icon: 'event',        label: 'Date',           value: tx.date},
            {icon: 'access-time', label: 'Time',           value: tx.time},
            {icon: 'category',    label: 'Category',       value: tx.category},
            {icon: 'credit-card', label: 'Payment Source', value: tx.paymentSource},
          ].map((row, i, arr) => (
            <View
              key={row.label}
              style={[styles.infoRow, i < arr.length - 1 && styles.infoRowBorder]}>
              <View style={styles.infoIconWrap}>
                <Icon name={row.icon} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* ── Experience details ────────────────────────────────────────── */}
        {(tx.experience || tx.venue || tx.companion) && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>EXPERIENCE DETAILS</Text>
            {tx.experience && (
              <View style={[styles.infoRow, styles.infoRowBorder]}>
                <View style={styles.infoIconWrap}>
                  <Icon name="event-seat" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.infoLabel}>Experience</Text>
                <Text style={styles.infoValue}>{tx.experience}</Text>
              </View>
            )}
            {tx.venue && (
              <View style={[styles.infoRow, tx.companion ? styles.infoRowBorder : undefined]}>
                <View style={styles.infoIconWrap}>
                  <Icon name="location-on" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>{tx.venue}</Text>
              </View>
            )}
            {tx.companion && (
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <Icon name="person" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.infoLabel}>Companion</Text>
                <Text style={styles.infoValue}>{tx.companion}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Payment Summary ───────────────────────────────────────────── */}
        {tx.breakdown && tx.breakdown.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>PAYMENT SUMMARY</Text>
            {tx.breakdown.map((b, i) => (
              <View
                key={b.label}
                style={[styles.summaryRow, i < tx.breakdown!.length - 1 && styles.summaryRowBorder]}>
                <Text style={styles.summaryLabel}>{b.label}</Text>
                <Text style={styles.summaryValue}>{b.value}</Text>
              </View>
            ))}
            {total !== null && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>TOTAL</Text>
                <Text style={styles.totalValue}>
                  {tx.positive ? '+' : '-'}${total.toFixed(2)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Download Receipt CTA ─────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => navigation.navigate('ReceiptViewer', {transactionId: route.params.transactionId})}
          activeOpacity={0.85}>
          <Icon name="download" size={18} color={Colors.onPrimary} />
          <Text style={styles.downloadBtnText}>Download Receipt</Text>
        </TouchableOpacity>

        {/* ── Security footnote ─────────────────────────────────────────── */}
        <View style={styles.securityNote}>
          <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.securityNoteText}>
            This record is encrypted and stored securely by CoBuddy.
          </Text>
        </View>

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
    paddingHorizontal: 16, gap: 12,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface, letterSpacing: 0.2},
  headerIconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },

  // Not-found error state
  notFoundWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 16,
  },
  notFoundTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 18,
    color: Colors.onSurface, textAlign: 'center',
  },
  notFoundSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20,
  },
  notFoundBtn: {
    marginTop: 8, paddingHorizontal: 28, paddingVertical: 12,
    borderRadius: 100, backgroundColor: Colors.primary,
  },
  notFoundBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary,
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16, gap: 16},

  pageSubtitle: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },

  // ── Hero card
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    padding: 22, gap: 16, overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -50, right: -50,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  heroTop: {flexDirection: 'row', alignItems: 'flex-start', gap: 16},
  receiptIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  refBlock: {flex: 1, gap: 6},
  refLabel: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 2},
  refValue: {fontFamily: 'Inter-SemiBold', fontSize: 18, color: Colors.onSurface, letterSpacing: 0.5},
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start',
    borderWidth: 1, borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  statusBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 11, letterSpacing: 0.5},

  heroAmount: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 40, color: Colors.error},
  heroAmountPos: {color: Colors.success},

  verifiedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(109,217,140,0.07)',
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.18)', padding: 12,
  },
  verifiedMeta: {flex: 1},
  verifiedTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success},
  verifiedSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // ── Info card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14,
  },
  infoRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  infoRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  infoIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(242,202,80,0.08)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  infoLabel: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  infoValue: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface, textAlign: 'right', flex: 1},

  // Payment summary
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10},
  summaryRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  summaryLabel: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  summaryValue: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  totalRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: 14, marginTop: 4,
    borderTopWidth: 1, borderTopColor: 'rgba(242,202,80,0.20)',
  },
  totalLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, letterSpacing: 1},
  totalValue: {fontFamily: 'PlayfairDisplay-SemiBold', fontSize: 18, color: Colors.primary},

  // Download CTA
  downloadBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  downloadBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},

  // Security footnote
  securityNote: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, opacity: 0.6,
  },
  securityNoteText: {
    fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, flex: 1, lineHeight: 16,
  },
});
