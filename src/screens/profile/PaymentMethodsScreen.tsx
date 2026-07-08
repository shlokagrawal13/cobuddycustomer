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
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PaymentMethods'>;

// ── Mock data (Stitch: payment_method_screen) ─────────────────────────────────
// Stitch shows: credit_card Visa ending in 4242 Expires 12/25 (selected),
// add_circle Add New Card, qr_code_scanner UPI, account_balance_wallet Wallet Balance $50
// Price Breakdown: Experience $150, Venue $20, Protection $10, Taxes $14.40 — Total $194.40
// CTA: "Pay Securely" — we repurpose the screen for saved cards management

const PAYMENT_METHODS = [
  {
    id: 'pm_visa',
    icon: 'credit-card',
    title: 'Visa ending in 4242',
    sub: 'Expires 12/25',
    isDefault: true,
    type: 'card',
  },
  {
    id: 'pm_mc',
    icon: 'credit-card',
    title: 'Mastercard ending in 5531',
    sub: 'Expires 08/26',
    isDefault: false,
    type: 'card',
  },
  {
    id: 'pm_upi',
    icon: 'qr-code-scanner',
    title: 'UPI / GPay',
    sub: 'GPay, PhonePe',
    isDefault: false,
    type: 'upi',
  },
  {
    id: 'pm_wallet',
    icon: 'account-balance-wallet',
    title: 'CoBuddy Wallet',
    sub: 'Balance: $2,400.00',
    isDefault: false,
    type: 'wallet',
  },
] as const;

type MethodId = typeof PAYMENT_METHODS[number]['id'];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This feature will be available in the next phase.');

export default function PaymentMethodsScreen({navigation}: Props) {
  const [selectedId, setSelectedId] = useState<MethodId>('pm_visa');

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      {/* Stitch: arrow_back + "Payment Method" + shield_lock */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={styles.headerIconWrap}>
          <Icon name="shield-lock" size={20} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Security hero banner ─────────────────────────────────────── */}
        <View style={styles.securityHero}>
          <View style={styles.securityGlow} pointerEvents="none" />
          <View style={styles.securityIconWrap}>
            <Icon name="lock" size={24} color={Colors.primary} />
          </View>
          <View style={styles.securityMeta}>
            <Text style={styles.securityTitle}>Protected &amp; Encrypted Payments</Text>
            <Text style={styles.securitySub}>
              Your payment information is securely processed. We do not store your full card details.
            </Text>
          </View>
        </View>

        {/* ── Saved payment methods ────────────────────────────────────── */}
        {/* Stitch: select payment method section with cards + UPI + Wallet */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SELECT PAYMENT METHOD</Text>
          {PAYMENT_METHODS.map((method, i) => {
            const isSelected = selectedId === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodRow,
                  i < PAYMENT_METHODS.length - 1 && styles.methodRowBorder,
                  isSelected && styles.methodRowSelected,
                ]}
                onPress={() => setSelectedId(method.id)}
                activeOpacity={0.75}>
                {/* Method icon */}
                <View style={[styles.methodIconWrap, isSelected && styles.methodIconWrapSelected]}>
                  <Icon name={method.icon} size={20} color={isSelected ? Colors.primary : Colors.onSurfaceVariant} />
                </View>
                {/* Text */}
                <View style={styles.methodMeta}>
                  <View style={styles.methodTitleRow}>
                    <Text style={styles.methodTitle}>{method.title}</Text>
                    {method.isDefault && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Default</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.methodSub}>{method.sub}</Text>
                </View>
                {/* Radio */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Add new card row */}
          {/* Stitch: add_circle "Add New Card" */}
          <TouchableOpacity
            style={styles.addMethodRow}
            onPress={() => navigation.navigate('AddPaymentMethod')}
            activeOpacity={0.75}>
            <View style={styles.addIconWrap}>
              <Icon name="add-circle" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.addMethodText}>Add New Card</Text>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>

        {/* ── Current default highlight ─────────────────────────────────── */}
        <View style={styles.defaultCard}>
          <Icon name="verified" size={18} color={Colors.success} />
          <View style={styles.defaultMeta}>
            <Text style={styles.defaultTitle}>Default Payment Method</Text>
            <Text style={styles.defaultSub}>
              {PAYMENT_METHODS.find(m => m.id === selectedId)?.title ?? 'None selected'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('SetDefaultPayment', {methodId: selectedId})} activeOpacity={0.75}>
            <Text style={styles.changeLink}>Change</Text>
          </TouchableOpacity>
        </View>

        {/* ── Security notes ────────────────────────────────────────────── */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SECURITY &amp; TRUST</Text>
          {[
            {icon: 'security',   text: 'End-to-end encrypted with AES-256'},
            {icon: 'shield',     text: 'CoBuddy Escrow protects every payment'},
            {icon: 'undo',       text: 'Full refund support within 48 hours'},
            {icon: 'support-agent', text: '24/7 concierge billing assistance'},
          ].map((item, i, arr) => (
            <View
              key={item.text}
              style={[styles.securityRow, i < arr.length - 1 && styles.securityRowBorder]}>
              <View style={styles.securityRowIcon}>
                <Icon name={item.icon} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.securityRowText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* ── Trust footer ─────────────────────────────────────────────── */}
        {/* Stitch: verified_user "Protected & Encrypted Payments / We do not store your full card details" */}
        <View style={styles.trustFooter}>
          <Icon name="verified-user" size={14} color={Colors.onSurfaceVariant} />
          <Text style={styles.trustFooterText}>
            Your payment information is securely processed. We do not store your full card details.
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
  headerIconWrap: {width: 40, alignItems: 'flex-end'},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // Security hero
  securityHero: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    padding: 18, overflow: 'hidden', position: 'relative',
  },
  securityGlow: {
    position: 'absolute', top: -40, right: -40,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  securityIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  securityMeta: {flex: 1},
  securityTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, marginBottom: 4},
  securitySub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},

  // Payment methods card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 16,
  },
  methodRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingVertical: 14,
    borderRadius: 12, paddingHorizontal: 4,
  },
  methodRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  methodRowSelected: {
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 12,
  },
  methodIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  methodIconWrapSelected: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderColor: 'rgba(242,202,80,0.30)',
  },
  methodMeta: {flex: 1},
  methodTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  methodTitle: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  methodSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2},
  defaultBadge: {
    backgroundColor: 'rgba(242,202,80,0.15)',
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 2,
  },
  defaultBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 0.5},
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  radioOuterSelected: {borderColor: Colors.primary},
  radioInner: {
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  addMethodRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingTop: 14, marginTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
  },
  addIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  addMethodText: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.primary},

  // Default highlight card
  defaultCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(109,217,140,0.06)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.18)', padding: 16,
  },
  defaultMeta: {flex: 1},
  defaultTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success, marginBottom: 2},
  defaultSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurface},
  changeLink: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.primary},

  // Security rows
  securityRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  securityRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  securityRowIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(242,202,80,0.08)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  securityRowText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Trust footer
  trustFooter: {
    flexDirection: 'row', alignItems: 'flex-start',
    gap: 8, opacity: 0.6,
  },
  trustFooterText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, lineHeight: 16,
  },
});
