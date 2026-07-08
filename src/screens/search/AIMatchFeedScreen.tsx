import React, {useState, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SearchStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SearchStackParamList, 'AIMatchFeed'>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This feature will be available in the next phase.');

// ─── Types & Mock Data ─────────────────────────────────────────────────────────
interface MatchCompanion {
  id: string;
  name: string;
  initials: string;
  tagline: string;
  matchPct: number;
  trustScore: number;
  rating: number;
  reviewCount: number;
  specialities: string[];
  available: boolean;
  priceFrom: number;
  reason: string;
  badge: 'Top Match' | 'Verified' | 'New';
}

const MATCHES: MatchCompanion[] = [
  {
    id: 'comp_003', name: 'Sophia Laurent', initials: 'SL',
    tagline: 'Wellness coach & luxury spa specialist',
    matchPct: 97, trustScore: 99, rating: 5.0, reviewCount: 67,
    specialities: ['Wellness', 'Fitness', 'Mindfulness'],
    available: true, priceFrom: 165,
    reason: 'Perfect alignment in wellness lifestyle and preference for intimate, premium experiences.',
    badge: 'Top Match',
  },
  {
    id: 'comp_001', name: 'Elena Vasquez', initials: 'EV',
    tagline: 'Fine dining specialist & cultural curator',
    matchPct: 94, trustScore: 98, rating: 4.97, reviewCount: 124,
    specialities: ['Fine Dining', 'Art & Culture', 'Networking'],
    available: true, priceFrom: 180,
    reason: 'Shared passion for Michelin-starred dining and exclusive cultural events.',
    badge: 'Top Match',
  },
  {
    id: 'comp_002', name: 'Marcus Chen', initials: 'MC',
    tagline: 'Art historian & cultural experience guide',
    matchPct: 88, trustScore: 96, rating: 4.92, reviewCount: 89,
    specialities: ['Art & Culture', 'Architecture', 'Wellness'],
    available: true, priceFrom: 140,
    reason: 'Strong compatibility in appreciation for architecture, contemporary art, and cultural depth.',
    badge: 'Verified',
  },
  {
    id: 'comp_005', name: 'Isabelle Moreau', initials: 'IM',
    tagline: 'Luxury social & event companion',
    matchPct: 83, trustScore: 95, rating: 4.88, reviewCount: 156,
    specialities: ['Social Events', 'Music & Arts', 'Nightlife'],
    available: true, priceFrom: 155,
    reason: 'High resonance in preference for exclusive social gatherings and live music events.',
    badge: 'Verified',
  },
  {
    id: 'comp_004', name: 'James Okafor', initials: 'JO',
    tagline: 'Business networking & finance professional',
    matchPct: 76, trustScore: 97, rating: 4.87, reviewCount: 43,
    specialities: ['Business', 'Networking', 'Finance'],
    available: false, priceFrom: 200,
    reason: 'Compatible professional networking style and finance industry background.',
    badge: 'Verified',
  },
  {
    id: 'comp_006', name: 'Ravi Mehta', initials: 'RM',
    tagline: 'Travel companion & hospitality concierge',
    matchPct: 71, trustScore: 94, rating: 4.85, reviewCount: 38,
    specialities: ['Travel', 'Hospitality', 'Culinary'],
    available: true, priceFrom: 125,
    reason: 'Emerging match based on recent culinary interest signals and travel preferences.',
    badge: 'New',
  },
];

type FilterKey = 'ALL' | 'AVAILABLE' | 'TOP_MATCH' | 'VERIFIED';
const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'ALL', label: 'All Matches'},
  {key: 'AVAILABLE', label: 'Available Now'},
  {key: 'TOP_MATCH', label: 'Top Match'},
  {key: 'VERIFIED', label: 'Verified'},
];

function applyFilter(items: MatchCompanion[], filter: FilterKey, query: string): MatchCompanion[] {
  let result = [...items];
  if (query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.specialities.some(s => s.toLowerCase().includes(q)),
    );
  }
  switch (filter) {
    case 'AVAILABLE':  return result.filter(c => c.available);
    case 'TOP_MATCH':  return result.filter(c => c.matchPct >= 90);
    case 'VERIFIED':   return result.filter(c => c.badge === 'Verified' || c.badge === 'Top Match');
    default:           return result;
  }
}

// ─── Match Card ───────────────────────────────────────────────────────────────
function MatchCard({
  companion,
  onViewProfile,
}: {
  companion: MatchCompanion;
  onViewProfile: () => void;
}) {
  const matchColor = companion.matchPct >= 90
    ? Colors.primary
    : companion.matchPct >= 80
    ? Colors.success
    : Colors.onSurfaceVariant;

  return (
    <View style={cStyles.cardShadow}>
      <View style={cStyles.card}>
        {/* Match % badge */}
        <View style={[cStyles.matchBadge, {borderColor: matchColor + '40'}]}>
          <Text style={[cStyles.matchPct, {color: matchColor}]}>{companion.matchPct}%</Text>
          <Text style={cStyles.matchLabel}>Match</Text>
        </View>

        {/* Top row */}
        <View style={cStyles.topRow}>
          <View style={cStyles.avatar}>
            <Text style={cStyles.avatarInitials}>{companion.initials}</Text>
          </View>
          <View style={cStyles.meta}>
            <View style={cStyles.nameRow}>
              <Text style={cStyles.name}>{companion.name}</Text>
              {companion.available && <View style={cStyles.availDot} />}
            </View>
            <Text style={cStyles.tagline} numberOfLines={1}>{companion.tagline}</Text>
            <View style={cStyles.statsRow}>
              <Icon name="star" size={11} color={Colors.primary} />
              <Text style={cStyles.statVal}>{companion.rating.toFixed(2)}</Text>
              <Text style={cStyles.statSep}>·</Text>
              <Text style={cStyles.statLabel}>{companion.reviewCount} reviews</Text>
              <Text style={cStyles.statSep}>·</Text>
              <Icon name="verified-user" size={11} color={Colors.primary} />
              <Text style={cStyles.statLabel}> {companion.trustScore}</Text>
            </View>
          </View>
        </View>

        {/* AI reason */}
        <View style={cStyles.reasonWrap}>
          <Icon name="auto-awesome" size={12} color={Colors.primary} />
          <Text style={cStyles.reasonText} numberOfLines={2}>{companion.reason}</Text>
        </View>

        {/* Specialities */}
        <View style={cStyles.specialitiesRow}>
          {companion.specialities.slice(0, 3).map((s, i) => (
            <View key={i} style={cStyles.specialityChip}>
              <Text style={cStyles.specialityText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Bottom */}
        <View style={cStyles.bottom}>
          <View style={cStyles.priceBlock}>
            <Text style={cStyles.priceFrom}>From</Text>
            <Text style={cStyles.priceVal}>£{companion.priceFrom}</Text>
            <Text style={cStyles.priceUnit}>/session</Text>
          </View>
          <TouchableOpacity
            style={[cStyles.profileBtn, !companion.available && cStyles.profileBtnDisabled]}
            onPress={companion.available ? onViewProfile : comingSoon}
            activeOpacity={0.8}>
            <Text style={[cStyles.profileBtnText, !companion.available && cStyles.profileBtnTextDisabled]}>
              {companion.available ? 'View Profile' : 'Unavailable'}
            </Text>
            {companion.available && <Icon name="arrow-forward" size={13} color="#14140f" />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const cStyles = StyleSheet.create({
  cardShadow: {borderRadius: 18, elevation: 4, shadowColor: '#000', shadowOffset: {width:0, height:3}, shadowOpacity: 0.2, shadowRadius: 8},
  card: {borderRadius: 18, overflow: 'hidden', backgroundColor: 'rgba(20,20,15,0.9)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 18},
  matchBadge: {
    position: 'absolute', top: 16, right: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(20,20,15,0.8)',
    borderWidth: 1, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  matchPct: {fontFamily: 'Inter-Bold', fontSize: 16},
  matchLabel: {fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  topRow: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12, paddingRight: 60},
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    marginRight: 12, flexShrink: 0,
  },
  avatarInitials: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.primary},
  meta: {flex: 1},
  nameRow: {flexDirection: 'row', alignItems: 'center'},
  name: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  availDot: {width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.success, marginLeft: 8},
  tagline: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2, lineHeight: 16},
  statsRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  statVal: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary, marginLeft: 3},
  statSep: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginHorizontal: 4},
  statLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  reasonWrap: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(242,202,80,0.12)',
    padding: 10, marginBottom: 12,
  },
  reasonText: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, marginLeft: 7, flex: 1, lineHeight: 17,
  },
  specialitiesRow: {flexDirection: 'row', flexWrap: 'wrap', marginBottom: 14},
  specialityChip: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)', marginRight: 6, marginBottom: 4,
  },
  specialityText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  bottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: 12,
  },
  priceBlock: {flexDirection: 'row', alignItems: 'baseline'},
  priceFrom: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginRight: 4},
  priceVal: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},
  priceUnit: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginLeft: 3},
  profileBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 9, paddingHorizontal: 14,
  },
  profileBtnDisabled: {backgroundColor: Colors.surfaceContainerHighest},
  profileBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: '#14140f', marginRight: 4},
  profileBtnTextDisabled: {color: Colors.onSurfaceVariant},
});

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function AIMatchFeedScreen({navigation}: Props) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);

  const filteredMatches = useMemo(
    () => applyFilter(MATCHES, activeFilter, query),
    [activeFilter, query],
  );

  const handleViewProfile = (companionId: string) => {
    // CompanionProfile is in HomeNavigator. We are in SearchNavigator.
    navigation.getParent()?.navigate(
      'HomeNavigator' as any,
      {screen: 'CompanionProfile', params: {companionId}},
    );
  };

  const renderItem = ({item}: {item: MatchCompanion}) => (
    <MatchCard
      companion={item}
      onViewProfile={() => handleViewProfile(item.id)}
    />
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Icon name="auto-awesome" size={16} color={Colors.primary} />
          <Text style={styles.headerTitle}>AI Match Feed</Text>
        </View>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => {
            const keys = FILTERS.map(f => f.key);
            const currentIdx = keys.indexOf(activeFilter);
            const nextFilter = keys[(currentIdx + 1) % keys.length];
            setActiveFilter(nextFilter);
          }}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="tune" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Icon name="search" size={18} color={Colors.onSurfaceVariant} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search by name, interest, or speciality…"
          placeholderTextColor={Colors.onSurfaceVariant}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
            <Icon name="close" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      {/* AI banner */}
      <View style={styles.aiBanner}>
        <Icon name="psychology" size={15} color={Colors.primary} />
        <Text style={styles.aiBannerText}>
          {filteredMatches.length} AI-curated matches based on your profile
        </Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersRow}>
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
      </View>

      {/* List */}
      <FlatList
        key={activeFilter}
        data={filteredMatches}
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
              <Icon name="search-off" size={30} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No matches found</Text>
            <Text style={styles.emptySub}>Try adjusting your filters or search term.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 56, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: {flexDirection: 'row', alignItems: 'center'},
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, marginLeft: 6,
  },

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginVertical: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 14, paddingVertical: 11,
  },
  searchInput: {
    flex: 1, marginLeft: 10,
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurface,
    paddingVertical: 0,
  },

  // AI banner
  aiBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 6,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 10, borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    paddingHorizontal: 12, paddingVertical: 8,
  },
  aiBannerText: {
    fontFamily: 'Inter-Medium', fontSize: 12,
    color: Colors.primary, marginLeft: 7,
  },

  // Filters
  filtersRow: {
    flexDirection: 'row', paddingHorizontal: 16,
    paddingVertical: 8, flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 999, flexShrink: 0,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: CARD_BORDER,
    marginRight: 8, marginBottom: 6,
  },
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 12,
    color: Colors.onSurface,
  },
  chipLabelActive: {color: '#14140f'},

  listContent: {paddingHorizontal: 16, paddingTop: 8},

  emptyState: {alignItems: 'center', justifyContent: 'center', paddingVertical: 60},
  emptyIconCircle: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  emptyTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 19, color: Colors.onSurface, marginBottom: 6},
  emptySub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center'},
});
