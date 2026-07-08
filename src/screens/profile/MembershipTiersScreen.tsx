import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MembershipTiers'>;

interface Tier {
  id: string;
  name: string;
  price: number;
  period: string;
  color: string;
  iconName: string;
  current: boolean;
  perks: string[];
}

const TIERS: Tier[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 0,
    period: 'Free',
    color: '#998e77',
    iconName: 'verified-user',
    current: false,
    perks: [
      'Companion browsing',
      'Basic safety monitoring',
      'Standard concierge access',
      '3 sessions/month',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: '/month',
    color: '#f2ca50',
    iconName: 'workspace-premium',
    current: true,
    perks: [
      'Priority concierge',
      'Enhanced safety monitoring',
      'Premium venue access',
      'Unlimited sessions',
      'Trust score boost',
    ],
  },
  {
    id: 'black',
    name: 'Black',
    price: 299,
    period: '/month',
    color: '#e5e4e2',
    iconName: 'diamond',
    current: false,
    perks: [
      'Dedicated concierge',
      '24/7 safety team',
      'Exclusive black-tier venues',
      'VIP event access',
      'Personal lifestyle manager',
    ],
  },
  {
    id: 'signature',
    name: 'Signature',
    price: 599,
    period: '/month',
    color: '#b8860b',
    iconName: 'auto-awesome',
    current: false,
    perks: [
      'White-glove concierge',
      'Jet & yacht access',
      'Global network',
      'Custom experience curation',
      'Priority SOS response',
    ],
  },
];

const currentTierIndex = TIERS.findIndex(t => t.current);

// ─── Hero card ────────────────────────────────────────────────────────────────
function HeroCard(): React.ReactElement {
  return (
    <View style={styles.heroShadow}>
      <View style={styles.heroCard}>
        <View style={styles.heroBadgeRow}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>PREMIUM MEMBER</Text>
          </View>
          <Icon name="workspace-premium" size={36} color={Colors.primary} />
        </View>
        <Text style={styles.heroTitle}>Your Membership</Text>
        <View style={styles.heroRenewalRow}>
          <Icon name="autorenew" size={14} color={Colors.onSurfaceVariant} />
          <Text style={styles.heroRenewalText}>Renews on July 15, 2025</Text>
        </View>
        <View style={styles.heroAccentLine} />
      </View>
    </View>
  );
}

// ─── Tier card ────────────────────────────────────────────────────────────────
function TierCard({
  tier,
  tierIndex,
  onUpgrade,
  onDowngrade,
}: {
  tier: Tier;
  tierIndex: number;
  onUpgrade: () => void;
  onDowngrade: () => void;
}): React.ReactElement {
  const isUpgrade   = tierIndex > currentTierIndex;
  const isDowngrade = tierIndex < currentTierIndex;

  return (
    <View style={[styles.tierShadow, tier.current && styles.tierShadowCurrent]}>
      <View style={[styles.tierCard, tier.current && styles.tierCardCurrent]}>

        {/* Current plan badge */}
        {tier.current && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>CURRENT PLAN</Text>
          </View>
        )}

        {/* Header row */}
        <View style={styles.tierHeader}>
          <View style={[styles.tierIconCircle, {borderColor: tier.color}]}>
            <Icon name={tier.iconName} size={22} color={tier.color} />
          </View>
          <Text style={[styles.tierName, {color: tier.color}]}>{tier.name}</Text>
          <View style={styles.tierPriceBlock}>
            {tier.price === 0 ? (
              <Text style={[styles.tierPriceFree, {color: tier.color}]}>Free</Text>
            ) : (
              <View style={styles.tierPriceRow}>
                <Text style={[styles.tierPriceCurrency, {color: tier.color}]}>$</Text>
                <Text style={[styles.tierPriceAmount, {color: tier.color}]}>{tier.price}</Text>
                <Text style={styles.tierPricePeriod}>{tier.period}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.tierDivider} />

        {/* Perks */}
        <View style={styles.perksList}>
          {tier.perks.map((perk, i) => (
            <View key={i} style={styles.perkRow}>
              <Icon name="check-circle" size={16} color={tier.color} />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        {!tier.current && (
          <View style={styles.tierCta}>
            {isUpgrade && (
              <TouchableOpacity style={styles.upgradeBtn} onPress={onUpgrade} activeOpacity={0.8}>
                <Text style={styles.upgradeBtnText}>Upgrade to {tier.name}</Text>
                <Icon name="arrow-forward" size={16} color={Colors.surface} />
              </TouchableOpacity>
            )}
            {isDowngrade && (
              <TouchableOpacity style={styles.downgradeBtn} onPress={onDowngrade} activeOpacity={0.7}>
                <Text style={styles.downgradeBtnText}>Downgrade to {tier.name}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function MembershipTiersScreen({navigation}: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Membership</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(32, insets.bottom + 16)}]}
        showsVerticalScrollIndicator={false}>

        <HeroCard />

        <Text style={styles.sectionLabel}>AVAILABLE PLANS</Text>

        {TIERS.map((tier, idx) => (
          <TierCard
            key={tier.id}
            tier={tier}
            tierIndex={idx}
            onUpgrade={() => navigation.navigate('TierUpgrade', {targetTier: tier.id})}
            onDowngrade={() => navigation.navigate('TierUpgrade', {targetTier: tier.id})}
          />
        ))}

        {/* Cancel */}
        <View style={styles.cancelSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MembershipCancel')}
            activeOpacity={0.7}
            style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel Membership</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 8}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root:   {flex: 1, backgroundColor: Colors.surface},
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerSpacer: {width: 40},

  scroll:        {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20},

  // Hero
  heroShadow: {
    borderRadius: 20, marginBottom: 28,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.18, shadowRadius: 12,
  },
  heroCard: {
    borderRadius: 20, overflow: 'hidden',
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    padding: 24,
  },
  heroBadgeRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 14,
  },
  heroBadge: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.3)',
  },
  heroBadgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.primary, letterSpacing: 1.4,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 26,
    color: Colors.onSurface, marginBottom: 10, letterSpacing: 0.3,
  },
  heroRenewalRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  heroRenewalText: {
    fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant,
  },
  heroAccentLine: {
    height: 3, borderRadius: 2, marginTop: 20, width: '40%',
    backgroundColor: Colors.primary,
  },

  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5,
    marginBottom: 14, paddingLeft: 2,
  },

  // Tier card — Fabric-safe: outer shadow only, inner clips
  tierShadow: {
    borderRadius: 18, marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2, shadowRadius: 8,
  },
  tierShadowCurrent: {
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.28, shadowRadius: 14,
  },
  tierCard: {
    borderRadius: 18, overflow: 'hidden',
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 20,
  },
  tierCardCurrent: {
    borderColor: 'rgba(242,202,80,0.5)',
    backgroundColor: 'rgba(11,13,26,0.95)',
  },
  currentBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 12, borderTopRightRadius: 18,
    paddingHorizontal: 12, paddingVertical: 5, zIndex: 1,
  },
  currentBadgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 9,
    color: Colors.surface, letterSpacing: 1.2,
  },
  tierHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12},
  tierIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center', justifyContent: 'center',
  },
  tierName: {
    flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 18, letterSpacing: 0.2,
  },
  tierPriceBlock: {alignItems: 'flex-end'},
  tierPriceFree: {fontFamily: 'Inter-SemiBold', fontSize: 16},
  tierPriceRow:  {flexDirection: 'row', alignItems: 'flex-end'},
  tierPriceCurrency: {
    fontFamily: 'Inter-SemiBold', fontSize: 13, marginBottom: 3,
  },
  tierPriceAmount: {
    fontFamily: 'Inter-SemiBold', fontSize: 22, lineHeight: 26,
  },
  tierPricePeriod: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, marginBottom: 3, marginLeft: 1,
  },
  tierDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginBottom: 16,
  },
  perksList: {gap: 10, marginBottom: 8},
  perkRow:   {flexDirection: 'row', alignItems: 'center', gap: 10},
  perkText:  {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurface, flex: 1, lineHeight: 20,
  },
  tierCta: {marginTop: 20},
  upgradeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary,
    borderRadius: 12, paddingVertical: 13,
  },
  upgradeBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.surface, letterSpacing: 0.3,
  },
  downgradeBtn:     {alignItems: 'center', paddingVertical: 10},
  downgradeBtnText: {
    fontFamily: 'Inter-Medium', fontSize: 13,
    color: Colors.onSurfaceVariant, textDecorationLine: 'underline',
  },

  // Cancel
  cancelSection: {
    alignItems: 'center', marginTop: 8,
    paddingTop: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CARD_BORDER,
  },
  cancelBtn:  {paddingVertical: 8, paddingHorizontal: 16},
  cancelText: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.error, letterSpacing: 0.2,
  },
});
