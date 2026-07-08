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

type Props = NativeStackScreenProps<ProfileStackParamList, 'TierUpgrade'>;

const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

const BENEFITS: Benefit[] = [
  {icon: 'bolt',          title: 'Priority Booking Access',   desc: 'First access to premium companions and events'},
  {icon: 'support-agent', title: 'Dedicated Concierge',       desc: '24/7 personal concierge with fastest response'},
  {icon: 'diamond',       title: 'Exclusive Experiences',     desc: 'Invite-only events and Black Tier venues'},
  {icon: 'security',      title: 'Enhanced Safety Suite',     desc: 'Advanced safety monitoring and trusted network'},
  {icon: 'star',          title: 'Trust Score Boost',         desc: 'Priority visibility and elevated matching'},
];

export default function TierUpgradeScreen({navigation, route}: Props) {
  const {targetTier} = route.params;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleUpgrade = () => {
    Alert.alert(
      `Upgrade to ${targetTier}?`,
      'Proceeding will initiate the upgrade process for your membership.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          onPress: () =>
            Alert.alert(
              'Request Submitted',
              'Your upgrade request has been submitted. Our team will contact you within 24 hours.',
            ),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upgrade Membership</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <View style={styles.heroIconRing}>
            <View style={styles.heroIconInner}>
              <Icon name="workspace-premium" size={28} color={Colors.primary} />
            </View>
          </View>
          <Text style={styles.heroTitle}>Upgrading to {targetTier}</Text>
          <Text style={styles.heroSub}>
            {targetTier} membership unlocks the full CoBuddy experience
          </Text>
          <View style={styles.currentTierBadge}>
            <Icon name="verified" size={13} color={Colors.primary} />
            <Text style={styles.currentTierText}>CURRENT TIER: ELITE MEMBER</Text>
          </View>
        </View>

        {/* What you unlock */}
        <Text style={styles.sectionLabel}>WHAT YOU UNLOCK</Text>
        <View style={styles.card}>
          {BENEFITS.map((b, idx) => (
            <View key={b.icon}>
              <View style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <Icon name={b.icon} size={18} color={Colors.primary} />
                </View>
                <View style={styles.benefitMeta}>
                  <Text style={styles.benefitTitle}>{b.title}</Text>
                  <Text style={styles.benefitDesc}>{b.desc}</Text>
                </View>
                <Icon name="check-circle" size={18} color={Colors.success} />
              </View>
              {idx < BENEFITS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Pricing card */}
        <Text style={styles.sectionLabel}>PRICING</Text>
        <View style={styles.pricingCard}>
          {/* Tabs */}
          <View style={styles.tabs}>
            {(['monthly', 'annual'] as const).map(cycle => (
              <TouchableOpacity
                key={cycle}
                style={[styles.tab, billingCycle === cycle && styles.tabActive]}
                onPress={() => setBillingCycle(cycle)}
                activeOpacity={0.7}>
                <Text style={[styles.tabText, billingCycle === cycle && styles.tabTextActive]}>
                  {cycle === 'monthly' ? 'Monthly' : 'Annual'}
                </Text>
                {cycle === 'annual' && (
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveBadgeText}>SAVE GBP489</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.priceBlock}>
            {billingCycle === 'monthly' ? (
              <Text style={styles.priceText}>From GBP149 <Text style={styles.pricePeriod}>/ month</Text></Text>
            ) : (
              <>
                <Text style={styles.priceText}>From GBP1,299 <Text style={styles.pricePeriod}>/ year</Text></Text>
                <View style={styles.annualSavingPill}>
                  <Icon name="star" size={12} color={Colors.onPrimary} />
                  <Text style={styles.annualSavingText}>Save GBP489 vs monthly</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.pricingNote}>
            <Icon name="info" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.pricingNoteText}>
              Pricing confirmed at checkout. Cancel anytime.
            </Text>
          </View>
        </View>

        {/* Primary CTA */}
        <TouchableOpacity style={styles.primaryBtn} onPress={handleUpgrade} activeOpacity={0.85}>
          <Icon name="workspace-premium" size={18} color={Colors.onPrimary} />
          <Text style={styles.primaryBtnText}>Proceed to Upgrade</Text>
        </TouchableOpacity>

        {/* Secondary */}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.secondaryBtnText}>Learn More About Tiers</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  headerSpacer: {width: 40},

  scroll: {flex: 1},
  scrollContent: {paddingTop: 20, paddingHorizontal: 16},

  heroCard: {
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute',
    top: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(242,202,80,0.08)',
  },
  heroIconRing: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  heroIconInner: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(242,202,80,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 26,
    color: Colors.onSurface, textAlign: 'center',
    marginBottom: 8, lineHeight: 33,
  },
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, textAlign: 'center',
    lineHeight: 20, marginBottom: 16,
  },
  currentTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  currentTierText: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.primary, letterSpacing: 0.8,
  },

  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    letterSpacing: 1.5, color: Colors.onSurfaceVariant,
    marginBottom: 8, paddingLeft: 4, marginTop: 4,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
    marginBottom: 24,
  },

  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  benefitIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(242,202,80,0.1)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  benefitMeta: {flex: 1},
  benefitTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.onSurface, marginBottom: 2,
  },
  benefitDesc: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 17,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 16,
  },

  pricingCard: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
    marginBottom: 20,
    padding: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 10,
    padding: 3,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
  },
  tabText: {
    fontFamily: 'Inter-Medium', fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  tabTextActive: {
    color: Colors.onSurface,
    fontFamily: 'Inter-SemiBold',
  },
  saveBadge: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  saveBadgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 9,
    color: Colors.primary, letterSpacing: 0.5,
  },
  priceBlock: {alignItems: 'center', marginBottom: 14, gap: 8},
  priceText: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 30,
    color: Colors.onSurface,
  },
  pricePeriod: {
    fontFamily: 'Inter-Regular', fontSize: 16,
    color: Colors.onSurfaceVariant,
  },
  annualSavingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  annualSavingText: {
    fontFamily: 'Inter-SemiBold', fontSize: 12,
    color: Colors.onPrimary,
  },
  pricingNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  pricingNoteText: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant,
  },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
  },
  primaryBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 16,
    color: Colors.onPrimary,
  },
  secondaryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  secondaryBtnText: {
    fontFamily: 'Inter-Medium', fontSize: 15,
    color: Colors.onSurfaceVariant,
  },
});
