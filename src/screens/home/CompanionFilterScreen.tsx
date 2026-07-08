import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'CompanionFilter'>;

// ── Filter Data ───────────────────────────────────────────────────────────────

const AVAILABILITY_OPTIONS = ['Available Now', 'Today', 'This Week', 'Any'];
const PRICE_OPTIONS = ['Under £200/hr', '£200–400/hr', '£400–800/hr', '£800+/hr', 'Any'];
const LANGUAGE_OPTIONS = ['English', 'French', 'Spanish', 'Mandarin', 'Arabic', 'Japanese', 'Italian', 'German'];
const INTEREST_OPTIONS  = ['Fine Dining', 'Art & Culture', 'Business', 'Travel', 'Wellness', 'Events', 'Nightlife', 'Sports'];
const RATING_OPTIONS    = ['4.9+', '4.7+', '4.5+', 'Any'];
const DISTANCE_OPTIONS  = ['Within 5 km', 'Within 15 km', 'Within 30 km', 'Any'];

interface Filters {
  availability: string;
  price: string;
  languages: string[];
  interests: string[];
  rating: string;
  distance: string;
  verifiedOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
  availability: 'Any',
  price:        'Any',
  languages:    [],
  interests:    [],
  rating:       'Any',
  distance:     'Any',
  verifiedOnly: false,
};

// ── Screen ────────────────────────────────────────────────────────────────────

export default function CompanionFilterScreen({navigation}: Props) {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const setScalar = useCallback(
    <K extends keyof Filters>(key: K, val: Filters[K]) =>
      setFilters(prev => ({...prev, [key]: val})),
    [],
  );

  const toggleMulti = useCallback(
    (key: 'languages' | 'interests', val: string) =>
      setFilters(prev => {
        const arr = prev[key] as string[];
        return {
          ...prev,
          [key]: arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val],
        };
      }),
    [],
  );

  const activeCount = (() => {
    let n = 0;
    if (filters.availability !== 'Any')  n++;
    if (filters.price !== 'Any')         n++;
    if (filters.languages.length > 0)   n++;
    if (filters.interests.length > 0)   n++;
    if (filters.rating !== 'Any')        n++;
    if (filters.distance !== 'Any')      n++;
    if (filters.verifiedOnly)            n++;
    return n;
  })();

  const handleReset = () => setFilters(DEFAULT_FILTERS);

  // In production, filters are passed back via navigation params or a store.
  // For now navigate back — backend will consume the filters object.
  const handleApply = () => navigation.goBack();

  // ── Render helpers ───────────────────────────────────────────────────────

  const renderSingleChips = (
    options: string[],
    selected: string,
    onSelect: (v: string) => void,
  ) => (
    <View style={styles.chipsRow}>
      {options.map(opt => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}
          activeOpacity={0.75}>
          <Text style={[styles.chipText, selected === opt && styles.chipTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMultiChips = (
    options: string[],
    selected: string[],
    onToggle: (v: string) => void,
  ) => (
    <View style={styles.chipsRow}>
      {options.map(opt => {
        const on = selected.includes(opt);
        return (
          <TouchableOpacity
            key={opt}
            style={[styles.chip, on && styles.chipActive]}
            onPress={() => onToggle(opt)}
            activeOpacity={0.75}>
            {on && (
              <Icon name="check" size={12} color={Colors.onPrimary} />
            )}
            <Text style={[styles.chipText, on && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="close" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Filter Companions</Text>
          {activeCount > 0 && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>{activeCount}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleReset}
          activeOpacity={0.7}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Filter Sheet */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: Math.max(120, insets.bottom + 104)},
        ]}
        showsVerticalScrollIndicator={false}>

        {/* Availability */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AVAILABILITY</Text>
          {renderSingleChips(
            AVAILABILITY_OPTIONS,
            filters.availability,
            v => setScalar('availability', v),
          )}
        </View>

        <View style={styles.divider} />

        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PRICE RANGE</Text>
          {renderSingleChips(
            PRICE_OPTIONS,
            filters.price,
            v => setScalar('price', v),
          )}
        </View>

        <View style={styles.divider} />

        {/* Languages */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>LANGUAGES</Text>
            {filters.languages.length > 0 && (
              <Text style={styles.sectionCount}>{filters.languages.length} selected</Text>
            )}
          </View>
          {renderMultiChips(
            LANGUAGE_OPTIONS,
            filters.languages,
            v => toggleMulti('languages', v),
          )}
        </View>

        <View style={styles.divider} />

        {/* Interests */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>INTERESTS</Text>
            {filters.interests.length > 0 && (
              <Text style={styles.sectionCount}>{filters.interests.length} selected</Text>
            )}
          </View>
          {renderMultiChips(
            INTEREST_OPTIONS,
            filters.interests,
            v => toggleMulti('interests', v),
          )}
        </View>

        <View style={styles.divider} />

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>MINIMUM RATING</Text>
          {renderSingleChips(
            RATING_OPTIONS,
            filters.rating,
            v => setScalar('rating', v),
          )}
        </View>

        <View style={styles.divider} />

        {/* Distance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DISTANCE</Text>
          {renderSingleChips(
            DISTANCE_OPTIONS,
            filters.distance,
            v => setScalar('distance', v),
          )}
        </View>

        <View style={styles.divider} />

        {/* Verified Only toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleMeta}>
              <View style={styles.toggleIconWrap}>
                <Icon name="verified-user" size={18} color={Colors.primary} />
              </View>
              <View style={styles.toggleTextWrap}>
                <Text style={styles.toggleLabel}>Verified companions only</Text>
                <Text style={styles.toggleSub}>Show only identity-verified companions</Text>
              </View>
            </View>
            <Switch
              value={filters.verifiedOnly}
              onValueChange={v => setScalar('verifiedOnly', v)}
              trackColor={{false: Colors.outlineVariant, true: Colors.primary}}
              thumbColor={filters.verifiedOnly ? Colors.onPrimary : Colors.onSurfaceVariant}
            />
          </View>
        </View>
      </ScrollView>

      {/* Sticky Apply Button */}
      <View style={[styles.applyBar, {paddingBottom: Math.max(20, insets.bottom + 8)}]}>
        <View style={styles.applyMeta}>
          {activeCount > 0 ? (
            <Text style={styles.applyMetaText}>
              {activeCount} filter{activeCount !== 1 ? 's' : ''} applied
            </Text>
          ) : (
            <Text style={styles.applyMetaText}>No filters applied</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.applyBtn}
          onPress={handleApply}
          activeOpacity={0.87}>
          <Icon name="tune" size={18} color={Colors.onPrimary} />
          <Text style={styles.applyBtnText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:            {flex: 1, backgroundColor: Colors.surface},
  scroll:          {flex: 1},
  scrollContent:   {paddingHorizontal: 16, paddingTop: 8},

  // Header
  header:          {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  closeBtn:        {width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)'},
  headerCenter:    {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8},
  headerTitle:     {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  activeBadge:     {backgroundColor: Colors.primary, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6},
  activeBadgeText: {fontFamily: 'Inter-Bold', fontSize: 11, color: Colors.onPrimary},
  resetBtn:        {paddingHorizontal: 10, paddingVertical: 6},
  resetText:       {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},

  // Sections
  section:         {paddingVertical: 18},
  sectionLabel:    {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 12},
  sectionHeaderRow:{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12},
  sectionCount:    {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.primary},
  divider:         {height: 1, backgroundColor: Colors.outlineVariant},

  // Chips
  chipsRow:        {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip:            {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainer},
  chipActive:      {backgroundColor: Colors.primary, borderColor: Colors.primary},
  chipCheck:       {},
  chipText:        {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  chipTextActive:  {color: Colors.onPrimary},

  // Verified toggle
  toggleRow:       {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12},
  toggleMeta:      {flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1},
  toggleIconWrap:  {width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.goldOverlay10, borderWidth: 1, borderColor: Colors.goldOverlay20, alignItems: 'center', justifyContent: 'center'},
  toggleTextWrap:  {flex: 1, gap: 2},
  toggleLabel:     {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  toggleSub:       {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},

  // Apply bar
  applyBar:        {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surfaceContainerHigh, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingHorizontal: 16, paddingTop: 12, gap: 10},
  applyMeta:       {alignItems: 'center'},
  applyMetaText:   {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  applyBtn:        {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14},
  applyBtnText:    {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
});
