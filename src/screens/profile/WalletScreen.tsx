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

type Props = NativeStackScreenProps<ProfileStackParamList, 'Wallet'>;

// ── Mock wallet data ──────────────────────────────────────────────────────────
// Stitch: wallet_credits_screen
// Available Credits: 2,400 CRD | Reward Points: 1,200 | Pending Refunds: 0 CRD

const BALANCE = {credits: 2400, points: 1200, pendingRefund: 0};

const TRANSACTIONS = [
  {
    id: 'tx_001',
    icon: 'event-seat',
    label: 'Session Payment',
    sub: 'Oct 24, 2023 · Elite Package',
    amount: '-450 CRD',
    positive: false,
  },
  {
    id: 'tx_002',
    icon: 'add',
    label: 'Credits Added',
    sub: 'Oct 20, 2023 · via Premium Card',
    amount: '+1,000 CRD',
    positive: true,
  },
  {
    id: 'tx_003',
    icon: 'redeem',
    label: 'Reward Redemption',
    sub: 'Oct 15, 2023 · Profile Upgrade',
    amount: '-500 Pts',
    positive: false,
  },
  {
    id: 'tx_004',
    icon: 'add',
    label: 'Welcome Credits',
    sub: 'Sep 28, 2023 · New Member Bonus',
    amount: '+500 CRD',
    positive: true,
  },
];

const QUICK_ACTIONS = [
  {icon: 'account-balance-wallet', label: 'Add Credits',      action: 'add'},
  {icon: 'redeem',                 label: 'Redeem Reward',    action: 'redeem'},
  {icon: 'download',               label: 'Download Invoice', action: 'invoice'},
] as const;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function WalletScreen({navigation}: Props) {
  const handleTransactionHistory = () => navigation.navigate('TransactionHistory');
  const handlePaymentMethods     = () => navigation.navigate('PaymentMethods');

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      {/* Stitch: sticky top bar — arrow_back + "Your Premium Wallet" */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Premium Wallet</Text>
        <TouchableOpacity
          style={styles.headerActionBtn}
          onPress={handlePaymentMethods}
          activeOpacity={0.7}>
          <Icon name="credit-card" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Balance hero card ─────────────────────────────────────────── */}
        {/* Stitch: "Available Credits 2,400 CRD" + "Reward Points 1,200" + "Pending Refunds 0 CRD" */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />

          {/* Sub-headline */}
          <Text style={styles.heroCopy}>Manage your credits and rewards with elegance.</Text>

          {/* Primary balance */}
          <View style={styles.primaryBalance}>
            <Text style={styles.primaryBalanceLabel}>AVAILABLE CREDITS</Text>
            <View style={styles.primaryBalanceRow}>
              <Text style={styles.primaryBalanceAmount}>
                {BALANCE.credits.toLocaleString()}
              </Text>
              <Text style={styles.primaryBalanceUnit}>CRD</Text>
            </View>
          </View>

          {/* Secondary balances row */}
          <View style={styles.secondaryRow}>
            <View style={styles.secondaryCell}>
              <Text style={styles.secondaryLabel}>Reward Points</Text>
              <View style={styles.secondaryValueRow}>
                <Icon name="stars" size={14} color={Colors.primary} />
                <Text style={styles.secondaryValue}>
                  {BALANCE.points.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={[styles.secondaryCell, styles.secondaryCellBorder]}>
              <Text style={styles.secondaryLabel}>Pending Refunds</Text>
              <Text style={[styles.secondaryValue, {color: Colors.onSurfaceVariant}]}>
                {BALANCE.pendingRefund} CRD
              </Text>
            </View>
          </View>
        </View>

        {/* ── Quick actions row ─────────────────────────────────────────── */}
        {/* Stitch: add / redeem / download buttons below balance */}
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map(qa => (
            <TouchableOpacity key={qa.action} style={styles.quickBtn} activeOpacity={0.78}>
              <View style={styles.quickIconWrap}>
                <Icon name={qa.icon} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.quickBtnLabel}>{qa.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Recent Transactions ───────────────────────────────────────── */}
        {/* Stitch: "Recent Transactions" header + "View All" link */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionLabel}>RECENT TRANSACTIONS</Text>
            <TouchableOpacity onPress={handleTransactionHistory} activeOpacity={0.75}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map((tx, i) => (
            <TouchableOpacity
              key={tx.id}
              style={[styles.txRow, i < TRANSACTIONS.length - 1 && styles.txRowBorder]}
              onPress={handleTransactionHistory}
              activeOpacity={0.75}>
              <View style={[styles.txIconWrap, tx.positive && styles.txIconWrapPos]}>
                <Icon name={tx.icon} size={18} color={tx.positive ? Colors.success : Colors.primary} />
              </View>
              <View style={styles.txMeta}>
                <Text style={styles.txLabel}>{tx.label}</Text>
                <Text style={styles.txSub}>{tx.sub}</Text>
              </View>
              <View style={styles.txRight}>
                <Text style={[styles.txAmount, tx.positive && styles.txAmountPos]}>
                  {tx.amount}
                </Text>
                <Icon name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Payment Methods shortcut ──────────────────────────────────── */}
        <TouchableOpacity
          style={styles.paymentCard}
          onPress={handlePaymentMethods}
          activeOpacity={0.78}>
          <View style={styles.paymentIconWrap}>
            <Icon name="credit-card" size={20} color={Colors.primary} />
          </View>
          <View style={styles.paymentMeta}>
            <Text style={styles.paymentTitle}>Payment Methods</Text>
            <Text style={styles.paymentSub}>Manage cards and billing details</Text>
          </View>
          <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>

        {/* ── Trust footer ──────────────────────────────────────────────── */}
        <View style={styles.trustFooter}>
          <Icon name="security" size={14} color={Colors.onSurfaceVariant} />
          <Text style={styles.trustFooterText}>
            Secured by CoBuddy Escrow Protection · Refund Support Available
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
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface, letterSpacing: 0.2},
  headerActionBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // ── Hero balance card
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    padding: 24, gap: 20, overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -50, right: -50,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  heroCopy: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },

  // Primary balance display
  primaryBalance: {gap: 4},
  primaryBalanceLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 2,
  },
  primaryBalanceRow: {flexDirection: 'row', alignItems: 'baseline', gap: 8},
  primaryBalanceAmount: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 48,
    color: Colors.onSurface, lineHeight: 56,
  },
  primaryBalanceUnit: {
    fontFamily: 'Inter-SemiBold', fontSize: 18,
    color: Colors.primary, letterSpacing: 0.5,
  },

  // Secondary balances
  secondaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
  secondaryCell: {flex: 1, padding: 14, gap: 4},
  secondaryCellBorder: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: CARD_BORDER,
  },
  secondaryLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  secondaryValueRow: {flexDirection: 'row', alignItems: 'center', gap: 5},
  secondaryValue: {fontFamily: 'Inter-SemiBold', fontSize: 18, color: Colors.onSurface},

  // Quick actions
  quickRow: {flexDirection: 'row', gap: 12},
  quickBtn: {
    flex: 1, alignItems: 'center', gap: 8,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER, paddingVertical: 16,
  },
  quickIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  quickBtnLabel: {
    fontFamily: 'Inter-Medium', fontSize: 11,
    color: Colors.onSurface, textAlign: 'center', letterSpacing: 0.3,
  },

  // Transactions card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 16,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5,
  },
  viewAllLink: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.primary},
  txRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12},
  txRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  txIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  txIconWrapPos: {
    backgroundColor: 'rgba(109,217,140,0.08)',
    borderColor: 'rgba(109,217,140,0.20)',
  },
  txMeta: {flex: 1},
  txLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, marginBottom: 2},
  txSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  txRight: {flexDirection: 'row', alignItems: 'center', gap: 4},
  txAmount: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.error},
  txAmountPos: {color: Colors.success},

  // Payment methods card row
  paymentCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16,
  },
  paymentIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  paymentMeta: {flex: 1},
  paymentTitle: {fontFamily: 'Inter-Medium', fontSize: 15, color: Colors.onSurface, marginBottom: 2},
  paymentSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},

  // Trust footer
  trustFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 6, opacity: 0.6,
  },
  trustFooterText: {
    fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, textAlign: 'center', flex: 1, lineHeight: 16,
  },
});
