import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'VenueBrowse'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const demoAlert = () =>
  Alert.alert('Coming Soon', 'Full venue search will be available in the next release.');

const CATEGORIES = ['All', 'Dining', 'Lounges', 'Private', 'Wellness'];

const VENUES = [
  {id: 'atelier',    name: 'The Atelier',           category: 'Dining',  location: 'Mayfair, London',    rating: '4.9', icon: 'restaurant',  verified: true},
  {id: 'obsidian',   name: 'Obsidian Lounge',        category: 'Lounges', location: 'Soho, London',       rating: '4.8', icon: 'local-bar',   verified: true},
  {id: 'sanctuary',  name: 'The Sanctuary',          category: 'Wellness',location: 'Kensington, London', rating: '5.0', icon: 'spa',         verified: true},
  {id: 'grand',      name: 'The Grand Reserve',      category: 'Private', location: 'Belgravia, London',  rating: '4.9', icon: 'hotel',       verified: false},
  {id: 'vault',      name: 'Vault Club',             category: 'Lounges', location: 'Chelsea, London',    rating: '4.7', icon: 'nightlife',   verified: false},
  {id: 'conserve',   name: 'The Conservatory',       category: 'Private', location: 'Notting Hill',       rating: '4.8', icon: 'pool',        verified: true},
];

export default function VenueBrowseScreen({navigation}: Props) {
  const [activeCategory, setCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? VENUES
      : VENUES.filter(v => v.category === activeCategory);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trusted Venues</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() =>
          Alert.alert(
            'Filter Venues',
            'Use the category tabs below to filter venues. Additional sort and price filters will be available in the next release.',
            [{text: 'OK'}],
          )
        } activeOpacity={0.7}>
          <Icon name="tune" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Icon name="verified" size={11} color={Colors.primary} />
              <Text style={styles.heroBadgeText}>CONCIERGE VERIFIED</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Private Venues &{'\n'}Exclusive Spaces</Text>
          <Text style={styles.heroSub}>
            Every venue in our curated network is personally verified by our concierge team for discretion and quality.
          </Text>
        </View>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, cat === activeCategory && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
              activeOpacity={0.8}>
              <Text style={[styles.categoryChipText, cat === activeCategory && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Venue count */}
        <Text style={styles.resultsLabel}>{filtered.length} venues found</Text>

        {/* Venue cards */}
        {filtered.map(venue => (
          <TouchableOpacity
            key={venue.id}
            style={styles.venueCard}
            onPress={() => navigation.navigate('VenueDetail', {venueId: venue.id})}
            activeOpacity={0.88}>
            {/* Venue image placeholder */}
            <View style={styles.venueImgWrap}>
              <View style={styles.venueImgBg}>
                <Icon name={venue.icon} size={52} color={Colors.onSurface} />
              </View>
              {/* Verified badge */}
              {venue.verified && (
                <View style={styles.verifiedBadge}>
                  <Icon name="verified" size={10} color={Colors.onPrimary} />
                  <Text style={styles.verifiedBadgeText}>CONCIERGE VERIFIED</Text>
                </View>
              )}
              {/* Category */}
              <View style={styles.categoryTagBadge}>
                <Text style={styles.categoryTagText}>{venue.category.toUpperCase()}</Text>
              </View>
            </View>
            {/* Venue info */}
            <View style={styles.venueInfo}>
              <Text style={styles.venueName}>{venue.name}</Text>
              <View style={styles.venueMetaRow}>
                <Icon name="place" size={12} color={Colors.onSurfaceVariant} />
                <Text style={styles.venueMetaText}>{venue.location}</Text>
              </View>
              <View style={styles.venueFooter}>
                <View style={styles.ratingBadge}>
                  <Icon name="star" size={11} color={Colors.primary} />
                  <Text style={styles.ratingText}>{venue.rating}</Text>
                </View>
                <View style={styles.arrowBtn}>
                  <Icon name="arrow-forward" size={14} color={Colors.onPrimary} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Browse all CTA */}
        <TouchableOpacity style={styles.browseAllBtn} onPress={() =>
          Alert.alert(
            'Browse All Venues',
            'All available venues are shown above. Contact your concierge to discover exclusive unlisted venues not visible in the app.',
            [{text: 'OK'}],
          )
        } activeOpacity={0.8}>
          <Icon name="search" size={16} color={Colors.onSurfaceVariant} />
          <Text style={styles.browseAllText}>Browse All Venues</Text>
        </TouchableOpacity>

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.92)',
  },
  headerBackBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {flex: 1, textAlign: 'center', fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, gap: 16},
  // Hero
  heroSection: {gap: 10},
  heroBadgeRow: {flexDirection: 'row'},
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(242,202,80,0.10)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: GOLD_BORDER,
  },
  heroBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.5, color: Colors.primary},
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 34, color: Colors.onSurface, lineHeight: 42, letterSpacing: -0.3},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 21},
  // Categories
  categoriesContent: {gap: 8, paddingBottom: 4},
  categoryChip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 999,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
  },
  categoryChipActive: {backgroundColor: 'rgba(242,202,80,0.10)', borderColor: GOLD_BORDER},
  categoryChipText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  categoryChipTextActive: {color: Colors.primary, fontFamily: 'Inter-SemiBold'},
  // Results
  resultsLabel: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  // Venue card
  venueCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, overflow: 'hidden',
  },
  venueImgWrap: {
    height: 160, position: 'relative',
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  venueImgBg: {opacity: 0.15},
  verifiedBadge: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  verifiedBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 8, color: Colors.onPrimary, letterSpacing: 1},
  categoryTagBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  categoryTagText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurface, letterSpacing: 1.2},
  venueInfo: {padding: 16, gap: 8},
  venueName: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},
  venueMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  venueMetaText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  venueFooter: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4},
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(242,202,80,0.10)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: GOLD_BORDER,
  },
  ratingText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
  arrowBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  // Browse all
  browseAllBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 14,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
  },
  browseAllText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurfaceVariant},
});
