import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'VenueDetail'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const demoAlert = () =>
  Alert.alert('Coming Soon', 'This feature will be available in the next release.');

const VENUE_DATA: Record<string, {
  name: string; category: string; location: string; address: string;
  hours: string; dresscode: string; rating: string; description: string;
  icon: string; verified: boolean;
  amenities: Array<{icon: string; label: string}>;
  gallery: Array<{icon: string; label: string}>;
}> = {
  atelier: {
    name: 'The Atelier',
    category: 'Fine Dining',
    location: 'Mayfair, London',
    address: '14 Mount Street, Mayfair, W1K 3NR',
    hours: 'Mon–Sat 18:00–23:00',
    dresscode: 'Smart Formal',
    rating: '4.9',
    verified: true,
    description: 'The Atelier is an intimate dining room tucked within a Mayfair townhouse. Seven private tables, a Michelin-recommended kitchen, and discreet service define every evening. Reservations are exclusively managed through our concierge.',
    icon: 'restaurant',
    amenities: [
      {icon: 'wifi',         label: 'Private Wi-Fi'},
      {icon: 'spa',          label: 'Wellness Suite'},
      {icon: 'restaurant',   label: 'Private Chef'},
      {icon: 'security',     label: 'Discrete Entry'},
    ],
    gallery: [
      {icon: 'dining',       label: 'Dining Room'},
      {icon: 'wine-bar',     label: 'Wine Cellar'},
      {icon: 'local-florist',label: 'Garden Terrace'},
    ],
  },
  obsidian: {
    name: 'Obsidian Lounge',
    category: 'Members Bar',
    location: 'Soho, London',
    address: '3 Wardour Street, Soho, W1D 6PB',
    hours: 'Tue–Sun 19:00–02:00',
    dresscode: 'Smart Casual',
    rating: '4.8',
    verified: true,
    description: 'A subterranean members bar with a curated cocktail list, live jazz on weekends, and an exclusive atmosphere. The private Onyx Room accommodates up to 10 guests for reserved evenings.',
    icon: 'local-bar',
    amenities: [
      {icon: 'music-note',   label: 'Live Jazz'},
      {icon: 'local-bar',    label: 'Craft Cocktails'},
      {icon: 'security',     label: 'Members Only'},
      {icon: 'wifi',         label: 'Private Wi-Fi'},
    ],
    gallery: [
      {icon: 'local-bar',    label: 'Bar Area'},
      {icon: 'meeting-room', label: 'Private Room'},
      {icon: 'music-note',   label: 'Stage'},
    ],
  },
  sanctuary: {
    name: 'The Sanctuary',
    category: 'Wellness & Spa',
    location: 'Kensington, London',
    address: '8 Cromwell Road, Kensington, SW7 2JN',
    hours: 'Daily 07:00–21:00',
    dresscode: 'Relaxed',
    rating: '5.0',
    verified: true,
    description: 'The Sanctuary is a private wellness retreat offering bespoke spa treatments, guided meditation, hydrotherapy circuits, and holistic health consultations. Day use and private event bookings available.',
    icon: 'spa',
    amenities: [
      {icon: 'spa',          label: 'Spa Treatments'},
      {icon: 'pool',         label: 'Hydrotherapy'},
      {icon: 'self-improvement', label: 'Meditation'},
      {icon: 'restaurant',   label: 'Healthy Café'},
    ],
    gallery: [
      {icon: 'spa',          label: 'Treatment Room'},
      {icon: 'pool',         label: 'Thermal Pool'},
      {icon: 'deck',         label: 'Relaxation Deck'},
    ],
  },
};

const DEFAULT_VENUE = VENUE_DATA.atelier;

const TIME_SLOTS = ['19:00', '20:00', '21:30'];

export default function VenueDetailScreen({navigation, route}: Props) {
  const {venueId} = route.params;
  const venue = VENUE_DATA[venueId] ?? DEFAULT_VENUE;
  const [selectedSlot, setSlot] = useState(TIME_SLOTS[1]);

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
        <Text style={styles.headerTitle} numberOfLines={1}>{venue.name}</Text>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() =>
            Share.share({
              title: venue.name,
              message:
                'Discover this exclusive venue on CoBuddy: ' +
                venue.name +
                ' — ' +
                venue.category +
                ' — ' +
                venue.location +
                '. Book through the CoBuddy app.',
            }).catch(() => {})
          }
          activeOpacity={0.7}>
          <Icon name="share" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero image placeholder */}
        <View style={styles.heroCard}>
          <View style={styles.heroImgWrap}>
            <View style={styles.heroImgBg}>
              <Icon name={venue.icon} size={80} color={Colors.onSurface} />
            </View>
            <View style={styles.heroOverlay} />
            {/* Verified badge */}
            {venue.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="verified" size={11} color={Colors.onPrimary} />
                <Text style={styles.verifiedBadgeText}>CONCIERGE VERIFIED</Text>
              </View>
            )}
            {/* Rating */}
            <View style={styles.ratingBadge}>
              <Icon name="star" size={11} color={Colors.primary} />
              <Text style={styles.ratingText}>{venue.rating}</Text>
            </View>
          </View>
          {/* Venue name + location */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroTitle}>{venue.name}</Text>
            <View style={styles.heroMetaRow}>
              <Icon name="place" size={13} color={Colors.onSurfaceVariant} />
              <Text style={styles.heroMetaText}>{venue.location}</Text>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryPillText}>{venue.category}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick info row */}
        <View style={styles.quickInfoRow}>
          {[
            {icon: 'place',    label: venue.address,   short: 'Address'},
            {icon: 'schedule', label: venue.hours,     short: 'Hours'},
            {icon: 'checkroom',label: venue.dresscode, short: 'Dress Code'},
          ].map(item => (
            <View key={item.short} style={styles.quickInfoItem}>
              <View style={styles.quickInfoIconWrap}>
                <Icon name={item.icon} size={14} color={Colors.primary} />
              </View>
              <Text style={styles.quickInfoLabel}>{item.short}</Text>
              <Text style={styles.quickInfoValue} numberOfLines={2}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{venue.description}</Text>
        </View>

        {/* Amenities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesRow}>
            {venue.amenities.map(a => (
              <View key={a.icon} style={styles.amenityItem}>
                <View style={styles.amenityIconWrap}>
                  <Icon name={a.icon} size={18} color={Colors.primary} />
                </View>
                <Text style={styles.amenityLabel}>{a.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Gallery placeholders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <View style={styles.galleryRow}>
            {venue.gallery.map(g => (
              <View key={g.icon} style={styles.galleryItem}>
                <View style={styles.galleryItemBg}>
                  <Icon name={g.icon} size={28} color={Colors.onSurface} />
                </View>
                <Text style={styles.galleryLabel}>{g.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Availability */}
        <View style={styles.section}>
          <View style={styles.availableRow}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Available Tonight</Text>
          </View>
          <View style={styles.slotRow}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, slot === selectedSlot && styles.slotChipActive]}
                onPress={() => setSlot(slot)}
                activeOpacity={0.8}>
                <Text style={[styles.slotChipText, slot === selectedSlot && styles.slotChipTextActive]}>{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reserve CTA */}
        <TouchableOpacity
          style={styles.ctaPrimary}
          onPress={() => (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'})}
          activeOpacity={0.88}>
          <Icon name="person-add" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaPrimaryText}>Reserve This Venue</Text>
        </TouchableOpacity>

        {/* Concierge footer */}
        <TouchableOpacity
          style={styles.conciergeRow}
          onPress={() =>
            (navigation as any).navigate('ConciergeNavigator', {
              screen: 'MessagingThread',
              params: {conversationId: 'concierge_main'},
            })
          }
          activeOpacity={0.8}>
          <View style={styles.conciergeIconWrap}>
            <Icon name="support-agent" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.conciergeText}>Need help with this venue? Chat with your concierge</Text>
          <Icon name="chevron-right" size={14} color={Colors.primary} />
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
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, gap: 20},
  // Hero
  heroCard: {borderRadius: 24, overflow: 'hidden', backgroundColor: Colors.surfaceContainerHigh},
  heroImgWrap: {height: 220, position: 'relative', alignItems: 'center', justifyContent: 'center'},
  heroImgBg: {opacity: 0.12},
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
    backgroundColor: 'rgba(14,14,10,0.90)',
  },
  verifiedBadge: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4,
  },
  verifiedBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 8, color: Colors.onPrimary, letterSpacing: 1},
  ratingBadge: {
    position: 'absolute', top: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(242,202,80,0.12)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: GOLD_BORDER,
  },
  ratingText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
  heroBottom: {padding: 18, gap: 6},
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: Colors.onSurface},
  heroMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap'},
  heroMetaText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, flex: 1},
  categoryPill: {
    backgroundColor: Colors.surfaceContainerHighest, borderRadius: 12,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  categoryPillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 1},
  // Quick info
  quickInfoRow: {flexDirection: 'row', gap: 10},
  quickInfoItem: {
    flex: 1, backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 12, gap: 5, alignItems: 'center',
  },
  quickInfoIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  quickInfoLabel: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 1, textTransform: 'uppercase'},
  quickInfoValue: {fontFamily: 'Inter-Medium', fontSize: 10, color: Colors.onSurface, textAlign: 'center', lineHeight: 14},
  // Section
  section: {gap: 12},
  sectionTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  description: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22},
  // Amenities
  amenitiesRow: {flexDirection: 'row', gap: 12, flexWrap: 'wrap'},
  amenityItem: {alignItems: 'center', gap: 8, width: '21%'},
  amenityIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  amenityLabel: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, textAlign: 'center'},
  // Gallery
  galleryRow: {flexDirection: 'row', gap: 10},
  galleryItem: {flex: 1, gap: 6},
  galleryItemBg: {
    height: 90, backgroundColor: CARD_BG, borderRadius: 14,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', opacity: 0.7,
  },
  galleryLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, textAlign: 'center'},
  // Availability
  availableRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  availableDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.success,
    shadowColor: Colors.success, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6, shadowRadius: 6,
  },
  availableText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.success},
  slotRow: {flexDirection: 'row', gap: 10},
  slotChip: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
  },
  slotChipActive: {backgroundColor: 'rgba(242,202,80,0.12)', borderColor: GOLD_BORDER},
  slotChipText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurfaceVariant},
  slotChipTextActive: {color: Colors.primary, fontFamily: 'Inter-SemiBold'},
  // CTAs
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 16, backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaPrimaryText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary},
  conciergeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(242,202,80,0.06)', borderRadius: 14,
    borderWidth: 1, borderColor: GOLD_BORDER, padding: 14,
  },
  conciergeIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.12)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  conciergeText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
});
