import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Dimensions,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'CompanionProfile'>;

const {width: SW} = Dimensions.get('window');

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This feature will be available in the next update.');

// ── Mock companion data ───────────────────────────────────────────────────────
const COMPANION = {
  id: 'elena_001',
  name: 'Elena',
  tagline: 'Trusted hospitality experiences, emotionally intelligent networking, and premium lifestyle compatibility.',
  location: 'London, UK',
  languages: ['English', 'French'],
  style: 'Editorial',
  rating: '4.9',
  responseTime: '< 1hr',
  sessions: 47,
  verificationTier: 'Tier 1 Platinum',
  trustScore: 94,
};

const COMPATIBILITY = [
  {
    id: '1',
    label: 'ATMOSPHERE ALIGNMENT',
    value: '94%',
    sub: 'Match',
    bar: 0.94,
    desc: 'Exceptional alignment in preference for quiet luxury, intimate dining, and exclusive ambient settings.',
  },
  {
    id: '2',
    label: 'COMMUNICATION ENERGY',
    value: 'High',
    sub: 'Resonance',
    bar: null,
    desc: 'Conversational style favors deep, emotionally intelligent dialogue over superficial networking.',
  },
];

const INTERESTS = [
  {id: '1', icon: '🍽', title: 'Luxury Dining', sub: 'Michelin-starred & omakase focus', match: 'Strong Match'},
  {id: '2', icon: '🧘', title: 'Wellness Experiences', sub: 'Private retreats & holistic spas', match: 'Aligned'},
  {id: '3', icon: '🎭', title: 'Cultural Events', sub: 'Private gallery openings & theatre', match: 'Compatible'},
];

const BADGES = [
  {id: '1', icon: '🛡', label: 'TRUSTED MEMBER', sub: 'Background & Identity Verified'},
  {id: '2', icon: '🎩', label: 'CONCIERGE VERIFIED', sub: 'High-touch references'},
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function CompanionProfileScreen({route, navigation}: Props) {
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Card ──────────────────────────────────────────────────── */}
        <View style={styles.heroOuter}>
          {/* Gradient placeholder for hero image */}
          <View style={styles.heroBg}>
            <View style={styles.heroImgPlaceholder}>
              <Text style={styles.heroImgIcon}>👤</Text>
            </View>
          </View>

          {/* Dark overlay */}
          <View style={styles.heroOverlay} />

          {/* Top controls row */}
          <SafeAreaView edges={['top']} style={styles.heroTopBar}>
            <TouchableOpacity
              style={styles.heroBackBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <Icon name="arrow-back" size={22} color="#e6e2d9" />
            </TouchableOpacity>
            <View style={styles.heroTopRight}>
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={() => { setSaved(s => !s); }}
                activeOpacity={0.8}>
                <Icon name={saved ? 'bookmark' : 'bookmark-border'} size={20} color="#e6e2d9" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.heroIconBtn}
                onPress={async () => {
                  try {
                    await Share.share({title: COMPANION.name, message: `Check out ${COMPANION.name} on CoBuddy — ${COMPANION.tagline}`});
                  } catch { /* cancelled */ }
                }}
                activeOpacity={0.8}>
                <Icon name="share" size={20} color="#e6e2d9" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Bottom name block */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroName}>{COMPANION.name}</Text>
            <Text style={styles.heroTagline}>{COMPANION.tagline}</Text>
          </View>
        </View>

        {/* ── Profile Overview Card ───────────────────────────────────────── */}
        <View style={styles.card}>
          {/* Verification tier row */}
          <View style={styles.tierRow}>
            <Text style={styles.tierLabel}>VERIFICATION LEVEL</Text>
            <View style={styles.tierBadge}>
              <Icon name="check" size={12} color="#f2ca50" />
              <Text style={styles.tierBadgeText}>{COMPANION.verificationTier}</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>⭐ {COMPANION.rating}</Text>
              <Text style={styles.statLabel}>RATING</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{COMPANION.sessions}</Text>
              <Text style={styles.statLabel}>SESSIONS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{COMPANION.responseTime}</Text>
              <Text style={styles.statLabel}>RESPONSE</Text>
            </View>
          </View>

          {/* Meta pills row */}
          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <Icon name="location-on" size={14} color="#d0c5af" />
              <Text style={styles.metaPillText}>{COMPANION.location}</Text>
            </View>
            {COMPANION.languages.map(l => (
              <View key={l} style={styles.metaPill}>
                <Text style={styles.metaPillText}>{l}</Text>
              </View>
            ))}
          </View>

          {/* Verification badges */}
          <View style={styles.badgeGrid}>
            {BADGES.map(b => (
              <View key={b.id} style={styles.badgeCard}>
                <Icon name={b.id === '1' ? 'security' : 'workspace-premium'} size={20} color="#f2ca50" />
                <View style={styles.badgeText}>
                  <Text style={styles.badgeTitle}>{b.label}</Text>
                  <Text style={styles.badgeSub}>{b.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Compatibility Insights ──────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Icon name="psychology" size={20} color="#f2ca50" />
            <Text style={styles.sectionTitle}>Compatibility Insights</Text>
          </View>
          <View style={styles.compatGrid}>
            {COMPATIBILITY.map(c => (
              <View key={c.id} style={styles.compatCard}>
                <View style={styles.compatGlow} />
                <Text style={styles.compatLabel}>{c.label}</Text>
                <View style={styles.compatValueRow}>
                  <Text style={styles.compatValue}>{c.value}</Text>
                  <Text style={styles.compatSub}> {c.sub}</Text>
                </View>
                {c.bar !== null && (
                  <View style={styles.compatBarTrack}>
                    <View style={[styles.compatBarFill, {width: `${c.bar * 100}%` as any}]} />
                  </View>
                )}
                <Text style={styles.compatDesc}>{c.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Shared Lifestyle Affinity ───────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Icon name="favorite" size={20} color="#f2ca50" />
            <Text style={styles.sectionTitle}>Shared Lifestyle Affinity</Text>
          </View>
          {INTERESTS.map(item => (
            <View key={item.id} style={styles.interestRow}>
              <View style={styles.interestLeft}>
                <View style={styles.interestIconWrap}>
                  <Text style={styles.interestIcon}>{item.icon}</Text>
                </View>
                <View style={styles.interestText}>
                  <Text style={styles.interestTitle}>{item.title}</Text>
                  <Text style={styles.interestSub}>{item.sub}</Text>
                </View>
              </View>
              <View style={styles.interestMatchPill}>
                <Text style={styles.interestMatchText}>{item.match}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Concierge Banner ────────────────────────────────────────────── */}
        <View style={styles.conciergeBanner}>
          <View style={styles.conciergeGlow} />
          <View style={styles.conciergeContent}>
            <View style={styles.conciergeLeft}>
              <Icon name="support-agent" size={24} color="#f2ca50" />
              <View style={styles.conciergeText}>
                <Text style={styles.conciergeTitle}>Curated Introductions</Text>
                <Text style={styles.conciergeDesc}>
                  Allow our dedicated concierge to arrange a seamless, verified
                  introduction tailored to your mutual lifestyle preferences.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.conciergeBtn}
              onPress={() => (navigation as any).navigate('ConciergeNavigator', {screen: 'MessagingThread', params: {conversationId: 'concierge_main'}})}
              activeOpacity={0.8}>
              <Text style={styles.conciergeBtnText}>REQUEST CONCIERGE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom padding for sticky bar */}
        <View style={{height: 110}} />
      </ScrollView>

      {/* ── Sticky Bottom Action Bar ─────────────────────────────────────── */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.bottomBarInner}>
          <View style={styles.alignStatus}>
            <Text style={styles.alignLabel}>ALIGNMENT STATUS</Text>
            <Text style={styles.alignValue}>Highly Compatible</Text>
          </View>
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.ghostBtn}
              onPress={() =>
                (navigation as any).navigate('MessagingThread', {conversationId: 'concierge_main'})
              }
              activeOpacity={0.8}>
              <Text style={styles.ghostBtnText}>CONCIERGE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() =>
                navigation.navigate('CompanionCalendar', {
                  companionId: route.params.companionId,
                })
              }
              activeOpacity={0.85}>
              <Text style={styles.primaryBtnText}>REQUEST INTRO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const C = {
  bg: '#14140f',
  surface: '#20201a',
  surfaceHigh: '#2b2a24',
  gold: '#f2ca50',
  onGold: '#14140f',
  text: '#e6e2d9',
  textMuted: '#d0c5af',
  outline: '#4d4639',
  goldDim: 'rgba(242,202,80,0.15)',
  goldGlow: 'rgba(242,202,80,0.08)',
};

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: C.bg},
  scroll: {flex: 1},
  scrollContent: {paddingBottom: 16},

  // Hero
  heroOuter: {width: '100%', height: SW * 1.15, position: 'relative'},
  heroBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: C.surfaceHigh,
  },
  heroImgPlaceholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c16',
  },
  heroImgIcon: {fontSize: 80},
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(20,20,15,0.55)',
  },
  heroTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  heroBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,20,15,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBackIcon: {color: C.text, fontSize: 20},
  heroTopRight: {flexDirection: 'row', gap: 10},
  heroIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(20,20,15,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIconBtnText: {fontSize: 18},
  heroBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  heroName: {
    color: C.gold,
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroTagline: {
    color: C.textMuted,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: '90%',
  },

  // Cards
  card: {
    margin: 16,
    marginBottom: 0,
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 20,
  },

  // Tier row
  tierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 14,
    marginBottom: 16,
  },
  tierLabel: {color: C.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1.2},
  tierBadge: {flexDirection: 'row', alignItems: 'center', gap: 6},
  tierBadgeIcon: {color: C.gold, fontSize: 14},
  tierBadgeText: {color: C.gold, fontSize: 13, fontWeight: '600'},

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {alignItems: 'center'},
  statValue: {color: C.text, fontSize: 16, fontWeight: '700', marginBottom: 4},
  statLabel: {color: C.textMuted, fontSize: 10, letterSpacing: 1},
  statDivider: {width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.08)'},

  // Meta pills
  metaRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16},
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  metaPillIcon: {fontSize: 12},
  metaPillText: {color: C.textMuted, fontSize: 12, fontWeight: '500'},

  // Badges
  badgeGrid: {flexDirection: 'row', gap: 10},
  badgeCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 12,
  },
  badgeIcon: {fontSize: 20, marginTop: 2},
  badgeText: {flex: 1},
  badgeTitle: {color: C.gold, fontSize: 11, fontWeight: '600', letterSpacing: 0.8, marginBottom: 3},
  badgeSub: {color: C.textMuted, fontSize: 11, lineHeight: 16},

  // Section header
  sectionHeader: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16},
  sectionIcon: {fontSize: 18},
  sectionTitle: {color: C.text, fontSize: 18, fontWeight: '600'},

  // Compatibility
  compatGrid: {gap: 12},
  compatCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    overflow: 'hidden',
  },
  compatGlow: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.goldDim,
  },
  compatLabel: {color: C.textMuted, fontSize: 11, fontWeight: '600', letterSpacing: 1.2, marginBottom: 8},
  compatValueRow: {flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8},
  compatValue: {color: C.gold, fontSize: 28, fontWeight: '700'},
  compatSub: {color: C.textMuted, fontSize: 13, marginBottom: 4},
  compatBarTrack: {
    height: 4,
    backgroundColor: C.surfaceHigh,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  compatBarFill: {height: '100%', backgroundColor: C.gold, borderRadius: 2},
  compatDesc: {color: C.textMuted, fontSize: 13, lineHeight: 18},

  // Interests
  interestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 8,
  },
  interestLeft: {flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1},
  interestIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestIcon: {fontSize: 20},
  interestText: {flex: 1},
  interestTitle: {color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 2},
  interestSub: {color: C.textMuted, fontSize: 12},
  interestMatchPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: C.goldDim,
    borderRadius: 100,
    marginLeft: 8,
  },
  interestMatchText: {color: C.gold, fontSize: 11, fontWeight: '600'},

  // Concierge banner
  conciergeBanner: {
    margin: 16,
    marginBottom: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    backgroundColor: '#1c1c16',
    padding: 20,
    overflow: 'hidden',
  },
  conciergeGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: C.goldGlow,
  },
  conciergeContent: {gap: 16},
  conciergeLeft: {flexDirection: 'row', gap: 14, alignItems: 'flex-start'},
  conciergeIcon: {fontSize: 28, marginTop: 2},
  conciergeText: {flex: 1},
  conciergeTitle: {color: C.gold, fontSize: 16, fontWeight: '600', marginBottom: 6},
  conciergeDesc: {color: C.textMuted, fontSize: 13, lineHeight: 19},
  conciergeBtn: {
    alignSelf: 'stretch',
    backgroundColor: C.gold,
    borderRadius: 100,
    paddingVertical: 14,
    alignItems: 'center',
  },
  conciergeBtnText: {color: C.onGold, fontSize: 13, fontWeight: '700', letterSpacing: 1.2},

  // Bottom bar
  bottomBar: {
    backgroundColor: 'rgba(20,20,15,0.96)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  alignStatus: {flex: 1},
  alignLabel: {color: C.textMuted, fontSize: 10, letterSpacing: 1, marginBottom: 3},
  alignValue: {color: C.gold, fontSize: 14, fontWeight: '600'},
  bottomActions: {flexDirection: 'row', gap: 10},
  ghostBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghostBtnText: {color: C.text, fontSize: 12, fontWeight: '600', letterSpacing: 0.8},
  primaryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    backgroundColor: C.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {color: C.onGold, fontSize: 12, fontWeight: '700', letterSpacing: 0.8},
});
