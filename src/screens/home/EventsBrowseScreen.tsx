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

type Props = NativeStackScreenProps<HomeStackParamList, 'EventsBrowse'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const demoAlert = () =>
  Alert.alert('Coming Soon', 'This feature will be available in the next phase.');

const CATEGORIES = ['All', 'Galas', 'Music', 'Gastronomy', 'Art', 'Wellness'];

const FEATURED_EVENTS = [
  {
    id: 'atrium_gala',
    title: 'The Atrium Gala',
    subtitle: 'An intimate evening of haute cuisine and live jazz',
    date: 'Dec 15, 2024',
    time: '20:00',
    venue: 'The Atrium Reserve, Mayfair',
    badge: 'VIP EXCLUSIVE',
    capacity: '48 seats remaining',
    iconName: 'celebration',
    category: 'Galas',
  },
  {
    id: 'jazz_evening',
    title: 'Private Jazz Evening',
    subtitle: 'Curated acoustic jazz in a heritage jazz club',
    date: 'Nov 28, 2024',
    time: '21:30',
    venue: 'The Blue Note Vault, Soho',
    badge: 'MEMBERS ONLY',
    capacity: '24 seats remaining',
    iconName: 'music-note',
    category: 'Music',
  },
  {
    id: 'sommelier',
    title: 'Sommelier Masterclass',
    subtitle: 'A private tasting with Michelin-starred sommelier',
    date: 'Dec 05, 2024',
    time: '19:00',
    venue: 'The Vault Dining Room',
    badge: 'CURATED',
    capacity: '16 seats remaining',
    iconName: 'wine-bar',
    category: 'Gastronomy',
  },
];

const MORE_EVENTS = [
  {id: 'art_preview',    title: 'Private Gallery Preview',     date: 'Dec 08', iconName: 'palette',   badge: 'INVITATION ONLY'},
  {id: 'wellness_dawn',  title: 'Sunrise Wellness Ritual',     date: 'Dec 12', iconName: 'spa',       badge: 'EXCLUSIVE'},
  {id: 'chef_table',    title: "Chef's Table Experience",      date: 'Dec 20', iconName: 'restaurant', badge: 'LIMITED SEATS'},
];

export default function EventsBrowseScreen({navigation}: Props) {
  const [activeCategory, setCategory] = useState('All');

  const filtered =
    activeCategory === 'All'
      ? FEATURED_EVENTS
      : FEATURED_EVENTS.filter(e => e.category === activeCategory);

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
        <Text style={styles.headerTitle}>Exclusive Events</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() =>
          Alert.alert(
            'Filter Events',
            'Use the category chips to filter events. Date range and location filters will be available in the next release.',
            [{text: 'OK'}],
          )
        } activeOpacity={0.7}>
          <Icon name="tune" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Icon name="verified" size={11} color={Colors.primary} />
              <Text style={styles.heroBadgeText}>CONCIERGE CURATED</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>Curated{'\n'}Experiences</Text>
          <Text style={styles.heroSub}>
            Exclusive events, intimate gatherings, and private access experiences — curated for discerning members.
          </Text>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}>
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

        {/* Featured events */}
        <Text style={styles.sectionLabel}>FEATURED EVENTS</Text>

        {filtered.map(event => (
          <TouchableOpacity
            key={event.id}
            style={styles.featuredCard}
            onPress={() => navigation.navigate('EventDetail', {eventId: event.id})}
            activeOpacity={0.88}>
            {/* Image placeholder */}
            <View style={styles.featuredCardImg}>
              <View style={styles.featuredCardImgBg}>
                <Icon name={event.iconName} size={64} color={Colors.onSurface} />
              </View>
              <View style={styles.featuredCardOverlay} />
              {/* Badge */}
              <View style={styles.eventBadge}>
                <Text style={styles.eventBadgeText}>{event.badge}</Text>
              </View>
              {/* Date chip */}
              <View style={styles.dateBadge}>
                <Icon name="event" size={11} color={Colors.primary} />
                <Text style={styles.dateBadgeText}>{event.date}</Text>
              </View>
            </View>
            {/* Body */}
            <View style={styles.featuredCardBody}>
              <Text style={styles.featuredCardTitle}>{event.title}</Text>
              <Text style={styles.featuredCardSubtitle}>{event.subtitle}</Text>
              <View style={styles.featuredCardMeta}>
                <View style={styles.featuredCardMetaRow}>
                  <Icon name="schedule" size={12} color={Colors.onSurfaceVariant} />
                  <Text style={styles.featuredCardMetaText}>{event.time}</Text>
                </View>
                <View style={styles.featuredCardMetaRow}>
                  <Icon name="place" size={12} color={Colors.onSurfaceVariant} />
                  <Text style={styles.featuredCardMetaText} numberOfLines={1}>{event.venue}</Text>
                </View>
              </View>
              <View style={styles.featuredCardFooter}>
                <View style={styles.capacityBadge}>
                  <View style={styles.capacityDot} />
                  <Text style={styles.capacityText}>{event.capacity}</Text>
                </View>
                <View style={styles.arrowBtn}>
                  <Icon name="arrow-forward" size={14} color={Colors.onPrimary} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* More events */}
        <Text style={styles.sectionLabel}>MORE EVENTS</Text>

        {MORE_EVENTS.map((e, i) => (
          <TouchableOpacity
            key={e.id}
            style={[styles.moreCard, i < MORE_EVENTS.length - 1 && styles.moreCardBorder]}
            onPress={() => navigation.navigate('EventDetail', {eventId: e.id})}
            activeOpacity={0.85}>
            <View style={styles.moreIconWrap}>
              <Icon name={e.iconName} size={22} color={Colors.primary} />
            </View>
            <View style={styles.moreMeta}>
              <Text style={styles.moreTitle}>{e.title}</Text>
              <Text style={styles.moreSub}>{e.date}</Text>
            </View>
            <View style={styles.moreBadge}>
              <Text style={styles.moreBadgeText}>{e.badge}</Text>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.92)',
  },
  headerBackBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface,
  },
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
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  heroBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.5, color: Colors.primary},
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: Colors.onSurface,
    lineHeight: 44, letterSpacing: -0.3,
  },
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
  // Section label
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 2,
    color: Colors.onSurfaceVariant, paddingTop: 8,
  },
  // Featured card
  featuredCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: CARD_BORDER, overflow: 'hidden',
  },
  featuredCardImg: {
    height: 180, position: 'relative',
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  featuredCardImgBg: {opacity: 0.15},
  featuredCardOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
    backgroundColor: 'rgba(20,20,15,0.85)',
  },
  eventBadge: {
    position: 'absolute', top: 14, left: 14,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  eventBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurface, letterSpacing: 1.5},
  dateBadge: {
    position: 'absolute', top: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(242,202,80,0.10)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  dateBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary},
  featuredCardBody: {padding: 18, gap: 10},
  featuredCardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 18, color: Colors.onSurface},
  featuredCardSubtitle: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},
  featuredCardMeta: {gap: 5},
  featuredCardMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  featuredCardMetaText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, flex: 1},
  featuredCardFooter: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4},
  capacityBadge: {flexDirection: 'row', alignItems: 'center', gap: 6},
  capacityDot: {width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.success},
  capacityText: {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant},
  arrowBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  // More card
  moreCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG, paddingVertical: 14, paddingHorizontal: 16,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
  },
  moreCardBorder: {},
  moreIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  moreMeta: {flex: 1},
  moreTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  moreSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 3},
  moreBadge: {
    backgroundColor: CARD_BG, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  moreBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 1},
});
