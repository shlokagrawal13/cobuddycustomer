import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import {useUserStore} from '../../store/userStore';
import type {SearchStackParamList, MainTabParamList} from '../../navigation/types';
import {FeatureFlags} from '../../config/featureFlags';
import Icon from '../../components/ui/Icon';

const FILTER_ICON: Record<string, string> = {
  hospitality: 'restaurant',
  emotional:   'favorite',
  wellness:    'spa',
  safety:      'security',
};

type Props = CompositeScreenProps<
  NativeStackScreenProps<SearchStackParamList, 'SearchHub'>,
  BottomTabScreenProps<MainTabParamList>
>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

// Smart filter chips from Stitch
const FILTERS = [
  {id: 'hospitality', label: 'Hospitality',         icon: '🍽', active: true},
  {id: 'emotional',   label: 'Emotional Atmosphere', icon: '😊', active: false},
  {id: 'wellness',    label: 'Wellness Balance',     icon: '🌿', active: false},
  {id: 'safety',      label: 'Trusted Safety',       icon: '🛡', active: false},
];

// Curated result cards from Stitch
const RESULTS = [
  {id: 'obsidian',    title: 'Obsidian Lounge',    sub: 'Mixology • 0.8 mi',     badge: '◆ VIP-Exclusive',   icon: '🍸'},
  {id: 'aura',        title: 'Aura Wellness',      sub: 'Recovery • 1.2 mi',     badge: '★ Highly Rated',    icon: '🧘'},
  {id: 'vault',       title: 'The Vault Dining',   sub: 'Gastronomy • 2.5 mi',   badge: '🔑 Private Access',  icon: '🍷'},
];

// AI recommendation card from Stitch
const AI_REC = {
  title: 'The Sanctuary Estate',
  match: '98% Match',
  badge: 'Atmosphere Curated',
  quote: '"Perfectly aligns with your preference for absolute privacy and low-sensory environments."',
  footer: 'Verified by CoBuddy AI',
  icon: '🏛',
};

export default function SearchHubScreen({navigation}: Props) {
  const profile = useUserStore(s => s.profile);
  const initial = (profile?.name ?? 'J').charAt(0).toUpperCase();
  const [query, setQuery]         = useState('');
  const [activeFilter, setFilter] = useState('hospitality');

  const openCompanionProfile = (id: string) => {
    // Navigate to companion profile in sibling HomeNavigator
    (navigation as any).navigate('HomeNavigator', {
      screen: 'CompanionProfile',
      params: {companionId: id},
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Standard Root Tab Header: Avatar | Discover | Search + Bell ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAvatar}
          onPress={() => (navigation as any).navigate('ProfileNavigator')}
          activeOpacity={0.8}>
          <Text style={styles.headerAvatarText}>{initial}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleWrap} pointerEvents="none">
          <Text style={styles.headerTitle}>Discover</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'})} activeOpacity={0.7}>
            <Icon name="search" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}
            onPress={() => (navigation as any).navigate('ConciergeNavigator', {screen: 'Notifications'})}
            activeOpacity={0.7}>
            <Icon name="notifications" size={18} color={Colors.onSurface} />
            <View style={styles.headerNotifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Section ── */}
        <View style={styles.heroSection}>
          {/* Radial glow orb */}
          <View style={styles.glowOrb} />

          <Text style={styles.heroTitle}>Discover Trusted{'\n'}Experiences</Text>
          <Text style={styles.heroSub}>
            AI-powered hospitality search, concierge-curated journeys, and emotionally intelligent discovery.
          </Text>

          {/* ── Universal Search Bar ── */}
          <View style={styles.searchWrap}>
            <View style={styles.searchGlow} />
            <View style={styles.searchBar}>
              <Text style={styles.searchAIIcon}>✦</Text>
              <TextInput
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                placeholder="Quiet luxury dining tonight..."
                placeholderTextColor="rgba(208,197,175,0.4)"
                returnKeyType="search"
              />
              <TouchableOpacity style={styles.searchBtn} onPress={() => (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'})} activeOpacity={0.8}>
                <Text style={styles.searchBtnText}>SEARCH</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Smart Filter Chips ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContent}>
            {FILTERS.map(f => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[styles.filterChip, f.id === activeFilter && styles.filterChipActive]}
                activeOpacity={0.8}>
                <Icon name={FILTER_ICON[f.id] ?? 'label'} size={14} color={f.id === activeFilter ? Colors.primary : Colors.onSurfaceVariant} />
                <Text style={[styles.filterChipText, f.id === activeFilter && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Map Placeholder + AI Rec ── */}
        <View style={styles.bentoRow}>
          {/* Map placeholder card */}
          <View style={styles.mapCard}>
            <View style={styles.mapBg}>
              <Text style={styles.mapBgIcon}>🗺</Text>
            </View>
            {/* Map controls */}
            <View style={styles.mapControls}>
              <TouchableOpacity style={styles.mapBtn} onPress={() =>
                Alert.alert('Live Location', 'Location services must be enabled to centre the map on your position. This activates automatically in the production build.')
              } activeOpacity={0.7}>
                <Icon name="my-location" size={14} color={Colors.onSurface} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mapBtn} onPress={() =>
                Alert.alert('Map Layers', 'Switch between standard, venue-density, and heat-map views. Available in the production build.')
              } activeOpacity={0.7}>
                <Icon name="layers" size={14} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>
            {/* Glowing marker */}
            <View style={styles.marker}>
              <View style={styles.markerPulse} />
              <View style={styles.markerDot}>
                <Icon name="restaurant" size={14} color={Colors.primary} />
              </View>
            </View>
            {/* Preview card */}
            <View style={styles.previewCard}>
              <View style={styles.previewImg}>
                <Text style={styles.previewImgIcon}>🍽</Text>
              </View>
              <View style={styles.previewMeta}>
                <Text style={styles.previewTitle}>L'Atelier Noir</Text>
                <View style={{flexDirection:'row', alignItems:'center', gap:3}}>
                  <Icon name="star" size={11} color={Colors.primary} />
                  <Text style={styles.previewSub}>4.9 Emotional Match</Text>
                </View>
                <View style={styles.conciergePickBadge}>
                  <Text style={styles.conciergePickText}>CONCIERGE PICK</Text>
                </View>
              </View>
            </View>
          </View>

          {/* AI Rec card */}
          <TouchableOpacity style={styles.aiCard} onPress={() => navigation.navigate('AIMatchFeed')} activeOpacity={0.85}>
            <View style={styles.aiImgWrap}>
              <Text style={styles.aiImgIcon}>{AI_REC.icon}</Text>
              <View style={styles.aiMatchBadge}>
                <Text style={styles.aiMatchText}>{AI_REC.match}</Text>
              </View>
            </View>
            <View style={styles.aiBody}>
              <View style={styles.aiBadgeRow}>
                <View style={styles.aiDot} />
                <Text style={styles.aiBadgeText}>{AI_REC.badge}</Text>
              </View>
              <Text style={styles.aiTitle}>{AI_REC.title}</Text>
              <Text style={styles.aiQuote}>{AI_REC.quote}</Text>
              <View style={styles.aiFooter}>
                <View style={styles.aiFooterIcon}>
                  <Icon name="check" size={12} color={Colors.onSurfaceVariant} />
                </View>
                <Text style={styles.aiFooterText}>{AI_REC.footer}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Curated Results Grid ── */}
        <View style={styles.resultsSection}>
          <View style={styles.resultsSectionHeader}>
            <Text style={styles.resultsSectionTitle}>Curated For Tonight</Text>
            <TouchableOpacity onPress={() => (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'})} activeOpacity={0.7}>
              <Text style={styles.seeAll}>SEE ALL →</Text>
            </TouchableOpacity>
          </View>
          {RESULTS.map(r => (
            <TouchableOpacity key={r.id} style={styles.resultCard} onPress={() => openCompanionProfile(r.id)} activeOpacity={0.85}>
              <View style={styles.resultImgWrap}>
                <Text style={styles.resultImg}>{r.icon}</Text>
                <View style={styles.resultBadge}>
                  <Text style={styles.resultBadgeText}>{r.badge}</Text>
                </View>
                <View style={styles.resultOverlay} />
                <View style={styles.resultCardLabel}>
                  <Text style={styles.resultTitle}>{r.title}</Text>
                  <Text style={styles.resultSub}>{r.sub}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* -- Community Circles Section -- */}
        {FeatureFlags.PROFESSIONAL_CIRCLES && (
          <>
            <View style={styles.communitySection}>
              <View style={styles.communitySectionHeader}>
                <Text style={styles.communitySectionTitle}>Community Circles</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CommunityBrowse')}
                  activeOpacity={0.7}>
                  <Text style={styles.seeAll}>SEE ALL</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.communityEntryCard}
                onPress={() => navigation.navigate('CommunityBrowse')}
                activeOpacity={0.85}>
                <View style={styles.communityEntryIcon}>
                  <Icon name="groups" size={22} color={Colors.primary} />
                </View>
                <View style={styles.communityEntryMeta}>
                  <Text style={styles.communityEntryTitle}>Browse All Circles</Text>
                  <Text style={styles.communityEntrySub}>Fine dining, wellness, arts and culture groups</Text>
                </View>
                <Icon name="chevron-right" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.communityEntryCard, {marginTop: 8}]}
                onPress={() => navigation.navigate('CommunityDetail', {communityId: 'dining'})}
                activeOpacity={0.85}>
                <View style={styles.communityEntryIcon}>
                  <Icon name="restaurant" size={22} color={Colors.primary} />
                </View>
                <View style={styles.communityEntryMeta}>
                  <Text style={styles.communityEntryTitle}>Fine Dining Society</Text>
                  <Text style={styles.communityEntrySub}>Exclusive tasting events and private dinners</Text>
                </View>
                <Icon name="chevron-right" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Professional Circles Section */}
            <View style={styles.communitySection}>
              <View style={styles.communitySectionHeader}>
                <Text style={styles.communitySectionTitle}>Professional Circles</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProfessionalCircles')}
                  activeOpacity={0.7}>
                  <Text style={styles.seeAll}>VIEW ALL</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.communityEntryCard}
                onPress={() => navigation.navigate('ProfessionalCircles')}
                activeOpacity={0.85}>
                <View style={styles.communityEntryIcon}>
                  <Icon name="business-center" size={20} color={Colors.primary} />
                </View>
                <View style={styles.communityEntryMeta}>
                  <Text style={styles.communityEntryTitle}>Browse Professional Circles</Text>
                  <Text style={styles.communityEntrySub}>By-application networks for verified high-calibre members</Text>
                </View>
                <Icon name="chevron-right" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#050816'},

  // ── Standard Root Tab Header ──
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: {fontSize: 13, fontWeight: '600', color: Colors.primary},
  headerTitleWrap: {position: 'absolute', left: 0, right: 0, alignItems: 'center'},
  headerTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, letterSpacing: 0.2},
  headerRight: {flexDirection: 'row', gap: 8},
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerIconText: {fontSize: 15},
  headerNotifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: Colors.error,
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, gap: 20},

  // Hero section
  heroSection: {alignItems: 'center', position: 'relative'},
  glowOrb: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(212,175,55,0.06)',
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: Colors.onSurface,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  heroSub: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    opacity: 0.9,
  },

  // Search bar
  searchWrap: {width: '100%', position: 'relative'},
  searchGlow: {
    position: 'absolute',
    top: -1, left: -1, right: -1, bottom: -1,
    borderRadius: 999,
    backgroundColor: 'rgba(212,175,55,0.15)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(32,32,26,0.6)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 8,
  },
  searchAIIcon: {fontSize: 20, color: 'rgba(242,202,80,0.7)'},
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.onSurface,
    paddingVertical: 10,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  searchBtnText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onPrimary,
    fontWeight: '700',
  },

  // Filter chips
  filtersScroll: {width: '100%', marginTop: 14},
  filtersContent: {gap: 8, paddingBottom: 4},
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(43,42,36,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  filterChipActive: {
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderColor: 'rgba(242,202,80,0.4)',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  filterChipIcon: {fontSize: 14},
  filterChipText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  filterChipTextActive: {color: Colors.primary},

  // Bento row
  bentoRow: {gap: 14},

  // Map card
  mapCard: {
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  mapBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11,13,26,0.7)',
  },
  mapBgIcon: {fontSize: 80, opacity: 0.1},
  mapControls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 6,
  },
  mapBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(20,20,15,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBtnIcon: {fontSize: 14, color: Colors.onSurface},
  marker: {position: 'absolute', top: '35%', left: '28%'},
  markerPulse: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,175,55,0.3)',
    top: -4,
    left: -4,
  },
  markerDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 4,
  },
  markerIcon: {fontSize: 14},
  previewCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(20,20,15,0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  previewImg: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  previewImgIcon: {fontSize: 24},
  previewMeta: {flex: 1},
  previewTitle: {fontSize: 16, fontWeight: '600', color: Colors.onSurface, marginBottom: 2},
  previewSub: {fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6},
  conciergePickBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  conciergePickText: {fontSize: 9, letterSpacing: 1.5, color: Colors.primary, fontWeight: '600'},

  // AI Rec card
  aiCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  aiImgWrap: {
    height: 140,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  aiImgIcon: {fontSize: 60, opacity: 0.15},
  aiMatchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(20,20,15,0.8)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiMatchText: {fontSize: 11, letterSpacing: 1, color: Colors.onSurface, fontWeight: '600'},
  aiBody: {padding: 16, backgroundColor: Colors.surface},
  aiBadgeRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8},
  aiDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary},
  aiBadgeText: {
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  aiTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, marginBottom: 6},
  aiQuote: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
    opacity: 0.8,
    marginBottom: 12,
  },
  aiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  aiFooterIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiFooterIconText: {fontSize: 12, color: Colors.onSurfaceVariant},
  aiFooterText: {fontSize: 10, letterSpacing: 1.5, color: Colors.onSurfaceVariant, fontWeight: '600'},

  // Results
  resultsSection: {gap: 14},
  resultsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsSectionTitle: {fontSize: 22, fontWeight: '600', color: Colors.onSurface},
  seeAll: {fontSize: 11, letterSpacing: 1.5, color: Colors.onSurfaceVariant, fontWeight: '600'},
  resultCard: {borderRadius: 24, overflow: 'hidden'},
  resultImgWrap: {
    height: 180,
    backgroundColor: Colors.surfaceContainerHigh,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultImg: {fontSize: 64, opacity: 0.2},
  resultOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '60%',
    backgroundColor: 'rgba(20,20,15,0.8)',
  },
  resultBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(20,20,15,0.5)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  resultBadgeText: {fontSize: 9, letterSpacing: 1.5, color: Colors.onSurface, fontWeight: '600'},
  resultCardLabel: {position: 'absolute', bottom: 14, left: 14, right: 14},
  resultTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, marginBottom: 2},
  resultSub: {fontSize: 13, color: Colors.onSurfaceVariant},

  // Community Circles section
  communitySection: {gap: 0, marginTop: 4},
  communitySectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  communitySectionTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 22,
    fontWeight: '600', color: Colors.onSurface,
  },
  communityEntryCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(11,13,26,0.55)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)', padding: 14,
  },
  communityEntryIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.22)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  communityEntryMeta: {flex: 1, gap: 3},
  communityEntryTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface,
  },
  communityEntrySub: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 16,
  },
});

