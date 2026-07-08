import React, {useState} from 'react';
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

type Props = NativeStackScreenProps<ProfileStackParamList, 'TransactionHistory'>;

// ── Mock data (Stitch: premium_wallet_transaction_history) ─────────────────────
// Stitch shows: hotel (Ritz-Carlton Kyoto -$1,450 Successful), restaurant (Le Bernardin -$850 Pending),
// workspace_premium (Membership Renewal +$5,000), schedule (Pending), check_circle (Successful)
const ALL_TRANSACTIONS = [
  {
    id: 'tx_001',
    icon: 'hotel',
    label: 'The Ritz-Carlton - Kyoto',
    category: 'Booking',
    date: 'Oct 24, 2023',
    amount: '-$1,450.00',
    positive: false,
    status: 'Successful' as const,
    statusIcon: 'check-circle',
    type: 'booking',
  },
  {
    id: 'tx_002',
    icon: 'restaurant',
    label: 'Le Bernardin - NYC',
    category: 'Dining',
    date: 'Oct 22, 2023',
    amount: '-$850.00',
    positive: false,
    status: 'Pending' as const,
    statusIcon: 'schedule',
    type: 'dining',
  },
  {
    id: 'tx_003',
    icon: 'workspace-premium',
    label: 'Membership Renewal - Gold Tier',
    category: 'Subscription',
    date: 'Oct 15, 2023',
    amount: '+$5,000.00',
    positive: true,
    status: 'Completed' as const,
    statusIcon: 'check-circle',
    type: 'credits',
  },
  {
    id: 'tx_004',
    icon: 'event-seat',
    label: 'Session Escrow - Private Gallery',
    category: 'Session',
    date: 'Oct 12, 2023',
    amount: '-$1,200.00',
    positive: false,
    status: 'Successful' as const,
    statusIcon: 'check-circle',
    type: 'booking',
  },
  {
    id: 'tx_005',
    icon: 'add-circle',
    label: 'Wallet Top-Up',
    category: 'Credits',
    date: 'Oct 01, 2023',
    amount: '+$2,500.00',
    positive: true,
    status: 'Completed' as const,
    statusIcon: 'check-circle',
    type: 'credits',
  },
  {
    id: 'tx_006',
    icon: 'redeem',
    label: 'Reward Redemption',
    category: 'Rewards',
    date: 'Sep 28, 2023',
    amount: '-500 Pts',
    positive: false,
    status: 'Successful' as const,
    statusIcon: 'check-circle',
    type: 'rewards',
  },
];

const FILTERS = ['All', 'Booking', 'Credits', 'Dining', 'Rewards'] as const;
type FilterType = typeof FILTERS[number];

const STATUS_COLOR: Record<string, string> = {
  Successful: Colors.success,
  Completed:  Colors.success,
  Pending:    Colors.warning,
  Failed:     Colors.error,
};

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function TransactionHistoryScreen({navigation}: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  const filtered = activeFilter === 'All'
    ? ALL_TRANSACTIONS
    : ALL_TRANSACTIONS.filter(
        t => t.type.toLowerCase() === activeFilter.toLowerCase() ||
             t.category.toLowerCase() === activeFilter.toLowerCase(),
      );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      {/* Stitch: arrow_back + "Premium Wallet & Transactions" + download + filter_list */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <Icon name="download" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
            <Icon name="filter-list" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Balance summary hero ─────────────────────────────────────── */}
        {/* Stitch: Premium Wallet Balance $12,450 + Trusted Payments Active + Concierge Billing Protected */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <Text style={styles.heroTitle}>Premium Wallet &amp; Transactions</Text>
          <Text style={styles.heroSub}>
            Trusted hospitality payments, concierge-assisted billing, and secure financial visibility.
          </Text>

          {/* Balance */}
          <View style={styles.balanceRow}>
            <Text style={styles.balanceLabel}>PREMIUM WALLET BALANCE</Text>
            <Text style={styles.balanceAmount}>$12,450.00</Text>
          </View>

          {/* Trust pills */}
          <View style={styles.trustPillsRow}>
            <View style={styles.trustPill}>
              <Icon name="verified" size={12} color={Colors.success} />
              <Text style={styles.trustPillText}>Trusted Payments Active</Text>
            </View>
            <View style={styles.trustPill}>
              <Icon name="support-agent" size={12} color={Colors.primary} />
              <Text style={styles.trustPillText}>Concierge Billing Protected</Text>
            </View>
          </View>

          {/* Summary stats */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCell}>
              <Text style={styles.summaryCaption}>ACTIVE PAYMENTS</Text>
              <Text style={styles.summaryValue}>$3,200.00</Text>
            </View>
            <View style={[styles.summaryCell, styles.summaryCellBorder]}>
              <Text style={styles.summaryCaption}>REFUND PROCESSING</Text>
              <Text style={styles.summaryValue}>$0.00</Text>
            </View>
          </View>
        </View>

        {/* ── Filter chips ─────────────────────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.75}>
              <Text style={[styles.filterChipText, activeFilter === f && styles.filterChipTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Transaction list ─────────────────────────────────────────── */}
        {/* Stitch: "Recent Activity" header + "VIEW ALL" link */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
            <Text style={styles.txCount}>{filtered.length} transactions</Text>
          </View>

          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="receipt-long" size={32} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>No transactions in this category.</Text>
            </View>
          ) : (
            filtered.map((tx, i) => (
              <TouchableOpacity
                key={tx.id}
                style={[styles.txRow, i < filtered.length - 1 && styles.txRowBorder]}
                onPress={() => navigation.navigate('TransactionDetail', {transactionId: tx.id})}
                activeOpacity={0.75}>
                {/* Icon */}
                <View style={[styles.txIconWrap, tx.positive && styles.txIconWrapPos]}>
                  <Icon name={tx.icon} size={18} color={tx.positive ? Colors.success : Colors.primary} />
                </View>
                {/* Meta */}
                <View style={styles.txMeta}>
                  <Text style={styles.txLabel} numberOfLines={1}>{tx.label}</Text>
                  <Text style={styles.txSub}>{tx.category} - {tx.date}</Text>
                </View>
                {/* Right: amount + status */}
                <View style={styles.txRight}>
                  <Text style={[styles.txAmount, tx.positive && styles.txAmountPos]}>
                    {tx.amount}
                  </Text>
                  <View style={styles.txStatusRow}>
                    <Icon
                      name={tx.statusIcon}
                      size={12}
                      color={STATUS_COLOR[tx.status] ?? Colors.onSurfaceVariant}
                    />
                    <Text style={[styles.txStatus, {color: STATUS_COLOR[tx.status] ?? Colors.onSurfaceVariant}]}>
                      {tx.status}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ── Trust footer ─────────────────────────────────────────────── */}
        <View style={styles.trustFooter}>
          <Icon name="security" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.trustFooterText}>
            All transactions secured by CoBuddy Escrow - Refund Support Available
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
  headerTitle: {
    flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerActions: {flexDirection: 'row', gap: 8},
  headerIconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: {flex: 1},
  scrollContent: {paddingTop: 20, gap: 16, paddingBottom: 8},

  // Hero balance card
  heroCard: {
    marginHorizontal: 16,
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    padding: 22, gap: 14, overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -60, right: -60,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  heroTitle: {fontFamily: 'PlayfairDisplay-SemiBold', fontSize: 20, color: Colors.onSurface},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18},
  balanceRow: {gap: 4},
  balanceLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 2},
  balanceAmount: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: Colors.onSurface},

  trustPillsRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  trustPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  trustPillText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurface},

  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12, borderWidth: 1, borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
  summaryCell: {flex: 1, padding: 12, gap: 3},
  summaryCellBorder: {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: CARD_BORDER},
  summaryCaption: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 1.5},
  summaryValue: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},

  // Filters
  filtersContent: {paddingHorizontal: 16, gap: 8},
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  filterChipActive: {
    backgroundColor: 'rgba(242,202,80,0.15)',
    borderColor: 'rgba(242,202,80,0.40)',
  },
  filterChipText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  filterChipTextActive: {color: Colors.primary},

  // Transaction list card
  card: {
    marginHorizontal: 16,
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5},
  txCount: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},

  // Empty state
  emptyState: {alignItems: 'center', gap: 10, paddingVertical: 32},
  emptyText: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},

  // Transaction row
  txRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 13},
  txRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  txIconWrap: {
    width: 40, height: 40, borderRadius: 20, flexShrink: 0,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  txIconWrapPos: {
    backgroundColor: 'rgba(109,217,140,0.08)',
    borderColor: 'rgba(109,217,140,0.20)',
  },
  txMeta: {flex: 1, minWidth: 0},
  txLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, marginBottom: 2},
  txSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  txRight: {alignItems: 'flex-end', gap: 3, flexShrink: 0},
  txAmount: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.error},
  txAmountPos: {color: Colors.success},
  txStatusRow: {flexDirection: 'row', alignItems: 'center', gap: 3},
  txStatus: {fontFamily: 'Inter-Regular', fontSize: 11},

  // Trust footer
  trustFooter: {
    marginHorizontal: 16,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, opacity: 0.6,
    paddingBottom: 4,
  },
  trustFooterText: {
    fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, textAlign: 'center', flex: 1, lineHeight: 16,
  },
});
