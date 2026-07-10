import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'CompanionBrowse'>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Companion {
  id: string;
  name: string;
  initials: string;
  tagline: string;
  trustScore: number;
  rating: number;
  reviewCount: number;
  sessionCount: number;
  badges: string[];
  specialities: string[];
  available: boolean;
  priceFrom: number;
  iconName: string;
}

type FilterKey = 'ALL' | 'AVAILABLE' | 'TOP_RATED' | 'NEW';

// ─── Mock Data ────────────────────────────────────────────────────────────────
export const COMPANIONS: Companion[] = [
  {
    id: 'comp_001',
    name: 'Elena Vasquez',
    initials: 'EV',
    tagline: 'Fine dining specialist & cultural curator',
    trustScore: 98,
    rating: 4.97,
    reviewCount: 124,
    sessionCount: 312,
    badges: ['Top Companion', 'Verified'],
    specialities: ['Fine Dining', 'Art & Culture', 'Networking'],
    available: true,
    priceFrom: 180,
    iconName: 'restaurant',
  },
  {
    id: 'comp_002',
    name: 'Marcus Chen',
    initials: 'MC',
    tagline: 'Art historian & cultural experience guide',
    trustScore: 96,
    rating: 4.92,
    reviewCount: 89,
    sessionCount: 205,
    badges: ['Verified'],
    specialities: ['Art & Culture', 'Architecture', 'Wellness'],
    available: true,
    priceFrom: 140,
    iconName: 'museum',
  },
  {
    id: 'comp_003',
    name: 'Sophia Laurent',
    initials: 'SL',
    tagline: 'Wellness coach & luxury spa specialist',
    trustScore: 99,
    rating: 5.0,
    reviewCount: 67,
    sessionCount: 178,
    badges: ['Top Companion', 'Verified', 'Wellness Expert'],
    specialities: ['Wellness', 'Fitness', 'Mindfulness'],
    available: true,
    priceFrom: 165,
    iconName: 'spa',
  },
  {
    id: 'comp_004',
    name: 'James Okafor',
    initials: 'JO',
    tagline: 'Business networking & finance professional',
    trustScore: 97,
    rating: 4.87,
    reviewCount: 43,
    sessionCount: 112,
    badges: ['Verified', 'Business Pro'],
    specialities: ['Business', 'Networking', 'Finance'],
    available: false,
    priceFrom: 200,
    iconName: 'business-center',
  },
  {
    id: 'comp_005',
    name: 'Isabelle Moreau',
    initials: 'IM',
    tagline: 'Luxury social & event companion',
    trustScore: 95,
    rating: 4.88,
    reviewCount: 156,
    sessionCount: 394,
    badges: ['Verified'],
    specialities: ['Social Events', 'Music & Arts', 'Nightlife'],
    available: true,
    priceFrom: 155,
    iconName: 'music-note',
  },
  {
    id: 'comp_006',
    name: 'Ravi Mehta',
    initials: 'RM',
    tagline: 'Travel companion & hospitality concierge',
    trustScore: 94,
    rating: 4.85,
    reviewCount: 38,
    sessionCount: 92,
    badges: ['Verified', 'New'],
    specialities: ['Travel', 'Hospitality', 'Culinary'],
    available: true,
    priceFrom: 125,
    iconName: 'flight',
  },
];

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'ALL', label: 'All'},
  {key: 'AVAILABLE', label: 'Available Now'},
  {key: 'TOP_RATED', label: 'Top Rated'},
  {key: 'NEW', label: 'New'},
];

function applyFilter(items: Companion[], filter: FilterKey): Companion[] {
  switch (filter) {
    case 'AVAILABLE': return items.filter(c => c.available);
    case 'TOP_RATED': return [...items].sort((a, b) => b.rating - a.rating);
    case 'NEW':       return items.filter(c => c.badges.includes('New'));
    // 'ALL': spread to always produce a new array reference so FlatList re-renders
    default:          return [...items];
  }
}

// ─── Companion Card ───────────────────────────────────────────────────────────
export function CompanionCard({
  companion,
  onPress,
}: {
  companion: Companion;
  onPress: () => void;
}) {
  return (
    <View style={styles.cardShadow}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.78}>
        {/* Availability dot */}
        {companion.available && <View style={styles.availDot} />}

        {/* Top row */}
        <View style={styles.cardTop}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>{companion.initials}</Text>
          </View>

          {/* Meta */}
          <View style={styles.cardMeta}>
            <Text style={styles.cardName}>{companion.name}</Text>
            <Text style={styles.cardTagline} numberOfLines={1}>{companion.tagline}</Text>
            <View style={styles.cardStatsRow}>
              <Icon name="star" size={13} color={Colors.primary} />
              <Text style={styles.statValue}>{companion.rating.toFixed(2)}</Text>
              <Text style={styles.statSep}>·</Text>
              <Text style={styles.statLabel}>{companion.reviewCount} reviews</Text>
              <Text style={styles.statSep}>·</Text>
              <Text style={styles.statLabel}>{companion.sessionCount} sessions</Text>
            </View>
          </View>

          {/* Trust badge */}
          <View style={styles.trustBadge}>
            <Icon name="verified-user" size={12} color={Colors.primary} />
            <Text style={styles.trustScore}>{companion.trustScore}</Text>
          </View>
        </View>

        {/* Specialities */}
        <View style={styles.specialitiesRow}>
          {companion.specialities.slice(0, 3).map((s, i) => (
            <View key={i} style={styles.specialityChip}>
              <Text style={styles.specialityText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Bottom row */}
        <View style={styles.cardBottom}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceFrom}>From</Text>
            <Text style={styles.priceValue}>${companion.priceFrom}</Text>
            <Text style={styles.priceUnit}>/session</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, !companion.available && styles.bookBtnDisabled]}
            onPress={companion.available ? onPress : undefined}
            activeOpacity={0.8}
            disabled={!companion.available}>
            <Text style={[styles.bookBtnText, !companion.available && styles.bookBtnTextDisabled]}>
              {companion.available ? 'View Profile' : 'Unavailable'}
            </Text>
            {companion.available && (
              <Icon name="arrow-forward" size={14} color={Colors.surface} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function CompanionBrowseScreen({navigation}: Props) {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');
  const insets = useSafeAreaInsets();

  // useMemo so filteredCompanions recomputes whenever activeFilter changes
  const filteredCompanions = useMemo(
    () => applyFilter(COMPANIONS, activeFilter),
    [activeFilter],
  );

  const handleSelect = (comp: Companion) => {
    // CompanionProfile is in same HomeNavigator stack
    navigation.navigate('CompanionProfile', {companionId: comp.id});
  };

  // No useCallback — renderItem must NOT be memoized across filter changes
  // because FlatList would reuse the stale render function and skip re-renders.
  // key={activeFilter} on FlatList forces full remount on every filter change.
  const renderItem = ({item}: {item: Companion}) => (
    <CompanionCard companion={item} onPress={() => handleSelect(item)} />
  );

  const availableCount = COMPANIONS.filter(c => c.available).length;

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
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Browse Companions</Text>
        </View>
        <TouchableOpacity
          style={styles.filterIconBtn}
          onPress={() => navigation.navigate('CompanionFilter')}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="tune" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      {/* Availability banner */}
      <View style={styles.availBanner}>
        <View style={styles.availDotBig} />
        <Text style={styles.availBannerText}>
          {availableCount} companions available now
        </Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScroll}>
        {FILTERS.map(f => {
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.75}>
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── DEBUG BANNER — shows active filter + count for QA verification ── */}
      <View style={styles.debugBanner}>
        <Text style={styles.debugText}>
          Filter: {activeFilter}{'  '}|{'  '}Showing: {filteredCompanions.length} of {COMPANIONS.length}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* List — key={activeFilter} forces full remount on every filter change */}
      <FlatList
        key={activeFilter}
        data={filteredCompanions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        extraData={activeFilter}
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: Math.max(32, insets.bottom + 16)},
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: 14}} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Icon name="person-search" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No companions found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Header — absolute center title
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
  headerCenter: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  filterIconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Availability banner
  availBanner: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 10,
    backgroundColor: 'rgba(109,217,140,0.06)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(109,217,140,0.12)',
  },
  availDotBig: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.success,
    marginRight: 8,
  },
  availBannerText: {
    fontFamily: 'Inter-Medium', fontSize: 13,
    color: Colors.success, letterSpacing: 0.2,
  },

  // Filter chips
  filtersScroll: {
    flexGrow: 0,
    flexShrink: 0,   // prevent the scroll bar itself from collapsing
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginRight: 10,
    flexShrink: 0,        // never let chip compress
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: Colors.onSurface,   // light on dark — clearly readable
    // No uppercase, no letterSpacing — both caused clipping on 'Available Now'
  },
  chipLabelActive: {
    color: '#14140f',          // dark on gold — high contrast
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 16, marginBottom: 4,
  },

  listContent: {paddingHorizontal: 16, paddingTop: 12},

  // Companion card — Fabric-safe shadow pattern
  cardShadow: {
    borderRadius: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2, shadowRadius: 8,
  },
  card: {
    borderRadius: 18, overflow: 'hidden',
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 18,
  },

  // Available dot (top-right absolute)
  availDot: {
    position: 'absolute', top: 16, right: 16,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.success,
  },

  // Top row
  cardTop: {flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 14},
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarInitials: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.primary},
  cardMeta: {flex: 1},
  cardName: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  cardTagline: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, marginTop: 2, lineHeight: 17,
  },
  cardStatsRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6},
  statValue: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
  statSep: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  statLabel: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},

  // Trust badge
  trustBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.2)',
    borderRadius: 99, paddingHorizontal: 8, paddingVertical: 4,
    flexShrink: 0,
  },
  trustScore: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},

  // Specialities
  specialitiesRow: {flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 14},
  specialityChip: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  specialityText: {
    fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, letterSpacing: 0.2,
  },

  // Bottom row
  cardBottom: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 14,
  },
  priceBlock: {flexDirection: 'row', alignItems: 'baseline', gap: 4},
  priceFrom: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  priceValue: {fontFamily: 'Inter-SemiBold', fontSize: 18, color: Colors.onSurface},
  priceUnit: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  bookBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16,
  },
  bookBtnDisabled: {backgroundColor: Colors.surfaceContainerHighest},
  bookBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.surface},
  bookBtnTextDisabled: {color: Colors.onSurfaceVariant},

  // Empty
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 20,
    color: Colors.onSurface,
  },
  emptySub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant,
  },

  // Debug banner — QA only, remove after sign-off
  debugBanner: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(242,202,80,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  debugText: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    color: Colors.primary,
    letterSpacing: 0.3,
  },
});
