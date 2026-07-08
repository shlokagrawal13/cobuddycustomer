import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Svg, {Circle} from 'react-native-svg';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import {useUserStore} from '../../store/userStore';
import Icon from '../../components/ui/Icon';
import type {ProfileStackParamList, MainTabParamList} from '../../navigation/types';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, 'Profile'>,
  BottomTabScreenProps<MainTabParamList>
>;

// Stitch verification items
const VERIFICATIONS = [
  {id: 'identity', icon: 'check',         title: 'Identity Verified',          sub: 'Government ID confirmed. Oct 2023.'},
  {id: 'liveness', icon: 'verified-user', title: 'Live Verification Completed', sub: 'Biometric check passed. Oct 2023.'},
  {id: 'contacts', icon: 'group',         title: 'Trusted Contact Protected',  sub: 'Emergency contacts active.'},
];

const SAFETY_SETTINGS = [
  {id: 'contact_share', title: 'Trusted Contact Sharing',   sub: 'Automatically share session details.'},
  {id: 'live_monitor',  title: 'Live Safety Monitoring',    sub: 'Active tracking during sessions.'},
  {id: 'concierge_24',  title: 'Concierge Priority Support', sub: '24/7 dedicated assistance.'},
];

const PERKS = ['Priority concierge', 'Enhanced safety', 'Premium experiences'];

// SVG ring constants (matches Stitch: 98/100 gold ring)
const RING_SIZE = 110;
const RING_RADIUS = 45;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS; // ≈ 282.7
const TRUST_SCORE = 98;
const RING_OFFSET = RING_CIRCUMFERENCE * (1 - TRUST_SCORE / 100); // ≈ 5.65

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

export default function ProfileScreen({navigation}: Props) {
  const profile = useUserStore(s => s.profile);
  const displayName = profile?.name ?? 'Julian Vane';

  const handleShareProfile = async () => {
    try {
      await Share.share({
        title: `${displayName} on CoBuddy`,
        message: `Join me on CoBuddy — the exclusive companion platform.\nhttps://app.cobuddy.com/profile/${displayName.toLowerCase().replace(/\s+/g, '-')}`,
      });
    } catch {
      Alert.alert('Share', 'Unable to open the share sheet. Please try again.');
    }
  };
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    contact_share: true,
    live_monitor: true,
    concierge_24: true,
  });

  const toggle = (id: string) =>
    setToggles(prev => ({...prev, [id]: !prev[id]}));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Profile Banner ──
            Stitch: contained card with horizontal margin, rounded on all 4 sides.
            aspect-[4/3] on mobile (NOT full-width, NOT fixed 280px).
            SAFE PATTERN: outer shadow wrapper (elevation, no overflow) +
            inner clipped card (overflow:hidden, no elevation). */}
        <View style={styles.heroBannerShadow}>
          <View style={styles.heroBanner}>
            {/* Portrait bg — dark navy placeholder matching Stitch cinematic feel */}
            <View style={styles.heroImgBg}>
              <View style={{opacity: 0.12}}>
                <Icon name="person" size={80} color={Colors.onSurface} />
              </View>
            </View>

            {/* Single gradient overlay: transparent at top → dark at bottom (Stitch pattern) */}
            <View style={styles.heroGradient} />

            {/* Share + Settings — top-right of card (Stitch: top-4 right-4) */}
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.heroActionBtn} onPress={handleShareProfile} activeOpacity={0.7}>
                <Icon name="share" size={16} color={Colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroActionBtn} onPress={() => navigation.navigate('SettingsHub')} activeOpacity={0.7}>
                <Icon name="settings" size={16} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>

            {/* Bottom content — COLUMN layout on mobile (Stitch: flex-col):
                Name → badges row → language pills row (all left-aligned) */}
            <View style={styles.heroBottom}>
              {/* Name */}
              <Text style={styles.heroName}>{displayName}</Text>

              {/* Identity Verified + Location — horizontal row */}
              <View style={styles.heroBadgesRow}>
                <View style={styles.heroBadge}>
                  <Icon name="check" size={12} color={Colors.primary} />
                  <Text style={styles.heroBadgeText}>Identity Verified</Text>
                </View>
                <View style={styles.heroLocationBadge}>
                  <Icon name="location-on" size={13} color={Colors.onSurfaceVariant} />
                  <Text style={styles.heroLocationText}>London, UK</Text>
                </View>
              </View>

              {/* Language pills — horizontal row BELOW badges (Stitch: flex gap-2) */}
              <View style={styles.langTags}>
                <View style={styles.langTag}>
                  <Text style={styles.langTagText}>English</Text>
                </View>
                <View style={styles.langTag}>
                  <Text style={styles.langTagText}>French</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* ── Content Section (vertical stack on mobile — fixes overflow) ── */}
        <View style={styles.contentSection}>

          {/* Trust Score Card */}
          <View style={styles.trustCard}>
            <View style={styles.trustCardGlow} />
            <View style={styles.trustCardHeader}>
              <Text style={styles.trustCardTitle}>Trust Score</Text>
              <Icon name="security" size={20} color={Colors.primary} />
            </View>

            {/* Proper SVG circular progress ring (replaces broken CSS border trick) */}
            <View style={styles.trustCircleWrap}>
              <Svg
                width={RING_SIZE}
                height={RING_SIZE}
                style={styles.trustRingSvg}>
                {/* Track circle */}
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={6}
                  fill="none"
                />
                {/* Progress arc — rotated -90° via transform on the SVG container */}
                <Circle
                  cx={RING_SIZE / 2}
                  cy={RING_SIZE / 2}
                  r={RING_RADIUS}
                  stroke="#D4AF37"
                  strokeWidth={6}
                  fill="none"
                  strokeDasharray={`${RING_CIRCUMFERENCE}`}
                  strokeDashoffset={RING_OFFSET}
                  strokeLinecap="round"
                />
              </Svg>
              {/* Score label centred inside the ring */}
              <View style={styles.trustRingLabel}>
                <Text style={styles.trustScore}>{TRUST_SCORE}</Text>
                <Text style={styles.trustScoreOf}>/100</Text>
              </View>
            </View>

            {/* Stats */}
            <View style={styles.trustStats}>
              <View style={styles.trustStatRow}>
                <Text style={styles.trustStatLabel}>Session Completion</Text>
                <Text style={styles.trustStatValue}>100%</Text>
              </View>
              <View style={[styles.trustStatRow, {borderTopWidth: 0}]}>
                <Text style={styles.trustStatLabel}>Safety Rating</Text>
                <View style={{flexDirection:'row', alignItems:'center', gap:4}}>
                  <Text style={styles.trustStatValue}>5.0</Text>
                  <Icon name="star" size={13} color={Colors.primary} />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.viewTrustBtn}
              onPress={() => (navigation as any).navigate('VerifyNavigator', {screen: 'TrustScoreDashboard'})}
              activeOpacity={0.8}>
              <Text style={styles.viewTrustBtnText}>View Trust Details</Text>
            </TouchableOpacity>
          </View>

          {/* Verification Status */}
          <View style={styles.verificationCard}>
            <Text style={styles.sectionTitle}>Verification Status</Text>
            {VERIFICATIONS.map(v => (
              <View key={v.id} style={styles.verifyItem}>
                <View style={styles.verifyIconWrap}>
                  <Icon name={v.icon} size={16} color={Colors.primary} />
                </View>
                <View style={styles.verifyMeta}>
                  <Text style={styles.verifyTitle}>{v.title}</Text>
                  <Text style={styles.verifySub}>{v.sub}</Text>
                </View>
              </View>
            ))}
            {/* Manage Identity Verification CTA — unlocks VerifyNavigator/IdentityTrustCenter */}
            <TouchableOpacity
              style={styles.manageIdentityBtn}
              onPress={() => (navigation as any).navigate('VerifyNavigator', {screen: 'IdentityTrustCenter'})}
              activeOpacity={0.8}>
              <Icon name="verified-user" size={14} color={Colors.primary} />
              <Text style={styles.manageIdentityText}>Manage Identity Verification</Text>
              <Icon name="chevron-right" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Premium Banner */}
          {/* SAFE PATTERN: outer shadow wrapper (elevation, no overflow) +
              inner clipped card (overflow:hidden, no elevation) */}
          <View style={styles.premiumCardShadow}>
            <View style={styles.premiumCard}>
              <View style={styles.premiumGlow} />
              <View style={styles.premiumHeader}>
                <View style={styles.premiumIconWrap}>
                  <Icon name="diamond" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.premiumTitle}>Premium Trusted Member</Text>
              </View>
              {PERKS.map(p => (
                <View key={p} style={styles.perkRow}>
                  <Icon name="check" size={13} color={Colors.primary} />
                  <Text style={styles.perkText}>{p}</Text>
                </View>
              ))}
              <TouchableOpacity style={styles.manageBtn} onPress={() => navigation.navigate('MembershipTiers')} activeOpacity={0.8}>
                <Text style={styles.manageBtnText}>Manage Membership</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Wallet & Rewards — unlocks Wallet, RewardsDashboard, ReferralProgram ── */}
          <View style={styles.quickLinksCard}>
            <Text style={styles.sectionTitle}>Wallet & Rewards</Text>
            {([
              {id: 'wallet',   icon: 'account-balance-wallet', label: 'My Wallet',        sub: 'Credits, transactions & payments', action: () => navigation.navigate('Wallet')},
              {id: 'rewards',  icon: 'stars',                  label: 'Rewards & Credits', sub: 'Loyalty points & redemptions',     action: () => navigation.navigate('RewardsDashboard')},
              {id: 'referral', icon: 'group-add',              label: 'Refer a Friend',    sub: 'Invite trusted members & earn',   action: () => navigation.navigate('ReferralProgram')},
              {id: 'wishlist', icon: 'favorite',               label: 'Saved / Wishlist',  sub: 'Your saved companions, venues & events', action: () => (navigation as any).navigate('HomeNavigator', {screen: 'Wishlist'})},
            ] as const).map((item, i, arr) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.quickLinkRow, i < arr.length - 1 && styles.quickLinkRowBorder]}
                onPress={item.action}
                activeOpacity={0.75}>
                <View style={styles.quickLinkIconWrap}>
                  <Icon name={item.icon} size={18} color={Colors.primary} />
                </View>
                <View style={styles.quickLinkMeta}>
                  <Text style={styles.quickLinkLabel}>{item.label}</Text>
                  <Text style={styles.quickLinkSub}>{item.sub}</Text>
                </View>
                <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Safety Settings */}
          <View style={styles.safetyCard}>
            <Text style={styles.sectionTitle}>Safety Settings</Text>
            {SAFETY_SETTINGS.map((s, i) => (
              <View
                key={s.id}
                style={[
                  styles.safetyRow,
                  i < SAFETY_SETTINGS.length - 1 && styles.safetyRowBorder,
                ]}>
                <View style={styles.safetyMeta}>
                  <Text style={styles.safetyRowTitle}>{s.title}</Text>
                  <Text style={styles.safetyRowSub}>{s.sub}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggle(s.id)}
                  style={[styles.toggleTrack, toggles[s.id] && styles.toggleTrackOn]}
                  activeOpacity={0.8}>
                  <View style={[styles.toggleThumb, toggles[s.id] && styles.toggleThumbOn]} />
                </TouchableOpacity>
              </View>
            ))}
            {/* Open Safety Hub CTA — unlocks SafetyNavigator */}
            <TouchableOpacity
              style={styles.safetyHubBtn}
              onPress={() => (navigation as any).navigate('SafetyNavigator')}
              activeOpacity={0.8}>
              <Icon name="security" size={15} color={Colors.primary} />
              <Text style={styles.safetyHubBtnText}>Open Safety Hub</Text>
              <Icon name="chevron-right" size={15} color={Colors.primary} />
            </TouchableOpacity>
          </View>

        </View>

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#050816'},
  scroll: {flex: 1},
  scrollContent: {paddingBottom: 20, gap: 16},

  // ── Hero banner (Stitch-accurate) ──
  // Outer shadow wrapper: elevation, no overflow, has horizontal margin (contained card)
  heroBannerShadow: {
    marginHorizontal: 16,        // card is inset from screen edges
    aspectRatio: 4 / 3,          // Stitch: aspect-[4/3] on mobile
    borderRadius: 24,            // Stitch: rounded-2xl
    backgroundColor: Colors.surfaceContainerHigh,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 4,
  },
  // Inner clipped card: overflow:hidden, matches outer shape exactly, NO elevation
  heroBanner: {
    flex: 1,                     // fill the shadow wrapper
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  heroImgBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0b0d1a',  // deep navy matching Stitch cinematic bg
  },
  heroImgIcon: {fontSize: 80, opacity: 0.12},
  // Single gradient overlay: transparent at top → semi-dark midpoint → fully dark at bottom
  // Stitch: from-background via-background/50 to-transparent (bottom-to-top)
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // Approximated as a solid dark overlay on the lower portion
    // Bottom third fully dark, middle semi-transparent
    backgroundColor: 'rgba(11,13,26,0.55)',
  },
  heroActions: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    gap: 8,
    zIndex: 2,
  },
  heroActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(11,13,26,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroActionIcon: {fontSize: 14, color: Colors.onSurface},
  // Bottom content: COLUMN layout (Stitch: flex-col on mobile)
  heroBottom: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'column',     // Stitch: flex-col on mobile (NOT row)
    gap: 10,
    zIndex: 2,
  },
  heroName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.onSurface,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  // Badges row: Identity Verified pill + Location — horizontal
  heroBadgesRow: {flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap'},
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.25)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeIcon: {fontSize: 11, color: Colors.primary},
  heroBadgeText: {fontSize: 11, letterSpacing: 1.2, color: Colors.primary, fontWeight: '600'},
  heroLocationBadge: {flexDirection: 'row', alignItems: 'center', gap: 4},
  heroLocationIcon: {fontSize: 12, color: Colors.onSurfaceVariant},
  heroLocationText: {fontSize: 12, color: Colors.onSurfaceVariant},
  // Language pills — horizontal row below badges (Stitch: flex gap-2, left-aligned)
  langTags: {flexDirection: 'row', gap: 8, alignItems: 'center'},
  langTag: {
    backgroundColor: 'rgba(11,13,26,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  langTagText: {fontSize: 11, letterSpacing: 0.8, color: Colors.onSurfaceVariant, fontWeight: '500'},

  // ── Content section (vertical stack — no side-by-side overflow on mobile) ──
  contentSection: {
    paddingHorizontal: 16,
    gap: 16,
  },

  // Trust score card
  trustCard: {
    backgroundColor: 'rgba(11,13,26,0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
    gap: 16,
  },
  trustCardGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  trustCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trustCardTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface},
  trustShieldIcon: {fontSize: 18, color: Colors.primary},

  // SVG ring layout
  trustCircleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  // Rotate the SVG so that arc starts from top (12 o'clock)
  trustRingSvg: {transform: [{rotate: '-90deg'}]},
  // Absolute label centred over the SVG ring
  trustRingLabel: {
    position: 'absolute',
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trustScore: {fontSize: 32, fontWeight: '600', color: Colors.onSurface},
  trustScoreOf: {fontSize: 11, letterSpacing: 1.5, color: Colors.onSurfaceVariant, fontWeight: '600'},

  trustStats: {gap: 12},
  trustStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  trustStatLabel: {fontSize: 13, color: Colors.onSurfaceVariant},
  trustStatValue: {fontSize: 13, fontWeight: '600', color: Colors.onSurface},
  viewTrustBtn: {
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewTrustBtnText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Verification card
  verificationCard: {
    backgroundColor: 'rgba(11,13,26,0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    gap: 12,
  },
  sectionTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, marginBottom: 4},
  verifyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  verifyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  verifyIcon: {fontSize: 18, color: Colors.primary},
  verifyMeta: {flex: 1},
  verifyTitle: {fontSize: 14, fontWeight: '600', color: Colors.onSurface, marginBottom: 3},
  verifySub: {fontSize: 12, color: Colors.onSurfaceVariant},

  // Premium card (safe shadow/clip split)
  // Outer: elevation only — NO overflow
  premiumCardShadow: {
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHigh,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 4,
  },
  // Inner: overflow:hidden — NO elevation
  premiumCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    padding: 20,
    position: 'relative',
    gap: 10,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  premiumGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(242,202,80,0.2)',
  },
  premiumHeader: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4},
  premiumIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {fontSize: 16, color: Colors.primary},
  premiumTitle: {fontSize: 15, fontWeight: '600', color: Colors.onSurface, lineHeight: 22, flex: 1},
  perkRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  perkCheck: {fontSize: 13, color: Colors.primary},
  perkText: {fontSize: 13, color: Colors.onSurfaceVariant},
  manageBtn: {
    marginTop: 6,
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
  },
  manageBtnText: {fontSize: 12, letterSpacing: 1.5, color: Colors.onPrimary, fontWeight: '700'},

  // Safety settings card
  safetyCard: {
    backgroundColor: 'rgba(11,13,26,0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    gap: 16,
  },
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
  },
  safetyRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  safetyMeta: {flex: 1, marginRight: 12},
  safetyRowTitle: {fontSize: 14, fontWeight: '600', color: Colors.onSurface, marginBottom: 3},
  safetyRowSub: {fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},
  toggleTrack: {
    width: 48,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 3,
    flexShrink: 0,
  },
  toggleTrackOn: {
    backgroundColor: Colors.primary,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.onSurface,
    elevation: 2,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {alignSelf: 'flex-end'},

  // ── Manage Identity btn (bottom of verificationCard)
  manageIdentityBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.2)',
    borderRadius: 999, paddingVertical: 11, paddingHorizontal: 16,
  },
  manageIdentityText: {
    flex: 1, fontSize: 12, letterSpacing: 0.8,
    color: Colors.primary, fontFamily: 'Inter-SemiBold',
  },

  // ── Wallet & Rewards quick-links card
  quickLinksCard: {
    backgroundColor: 'rgba(11,13,26,0.8)',
    borderRadius: 24, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  quickLinkRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, paddingVertical: 14,
  },
  quickLinkRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  quickLinkIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  quickLinkMeta: {flex: 1},
  quickLinkLabel: {fontSize: 14, fontWeight: '600', color: Colors.onSurface, marginBottom: 2},
  quickLinkSub: {fontSize: 12, color: Colors.onSurfaceVariant},

  // ── Open Safety Hub btn (bottom of safetyCard)
  safetyHubBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.2)',
    borderRadius: 999, paddingVertical: 11, paddingHorizontal: 16,
    marginTop: 4,
  },
  safetyHubBtnText: {
    flex: 1, fontSize: 12, letterSpacing: 0.8,
    color: Colors.primary, fontFamily: 'Inter-SemiBold',
  },
});
