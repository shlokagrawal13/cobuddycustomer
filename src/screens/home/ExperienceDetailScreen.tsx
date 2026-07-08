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
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'ExperienceDetail'>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

// ─── Mock data ────────────────────────────────────────────────────────────────
interface Experience {
  id: string;
  title: string;
  category: string;
  venue: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  companion: {name: string; trustScore: number};
  description: string;
  highlights: string[];
  iconName: string;
  available: boolean;
}

const EXPERIENCES: Experience[] = [
  {
    id: 'exp_001',
    title: 'Private Dining at The Atrium',
    category: 'FINE DINING',
    venue: 'The Atrium Reserve',
    location: 'Mayfair, London',
    duration: '2.5 hours',
    price: 285,
    rating: 4.9,
    reviewCount: 124,
    companion: {name: 'Elena Vasquez', trustScore: 98},
    description:
      'An intimate private dining experience in one of London\'s most exclusive suites. Features a curated 7-course tasting menu with wine pairings and concierge service throughout.',
    highlights: ['Private dining room', '7-course tasting menu', 'Sommelier service', 'Verified companion'],
    iconName: 'restaurant',
    available: true,
  },
  {
    id: 'exp_002',
    title: 'Gallery Walk & Cultural Tour',
    category: 'CULTURAL',
    venue: 'Tate Modern & Surrounds',
    location: 'Southbank, London',
    duration: '3 hours',
    price: 150,
    rating: 4.8,
    reviewCount: 89,
    companion: {name: 'Marcus Chen', trustScore: 96},
    description:
      'A curated cultural journey through London\'s finest galleries with an expert companion. Includes exclusive access to private collections and a post-tour afternoon tea.',
    highlights: ['Private gallery access', 'Expert cultural guide', 'Afternoon tea included', 'Small group max 2'],
    iconName: 'museum',
    available: true,
  },
  {
    id: 'exp_003',
    title: 'Wellness Morning Ritual',
    category: 'WELLNESS',
    venue: 'The Berkeley Spa',
    location: 'Knightsbridge, London',
    duration: '2 hours',
    price: 195,
    rating: 5.0,
    reviewCount: 67,
    companion: {name: 'Sophia Laurent', trustScore: 99},
    description:
      'Begin your day with a luxurious wellness ritual. Guided meditation, spa treatment, and nourishing breakfast in the iconic Berkeley rooftop pool suite.',
    highlights: ['Rooftop pool access', 'Guided meditation', 'Spa treatment', 'Healthy breakfast'],
    iconName: 'spa',
    available: true,
  },
  {
    id: 'exp_004',
    title: 'Business Networking Evening',
    category: 'NETWORKING',
    venue: 'The Ned Private Members Club',
    location: 'City of London',
    duration: '2 hours',
    price: 220,
    rating: 4.7,
    reviewCount: 43,
    companion: {name: 'James Okafor', trustScore: 97},
    description:
      'Navigate a curated networking event with a polished professional companion. Perfect for business travellers seeking trusted introductions in London\'s financial district.',
    highlights: ['Members club access', 'Professional companion', 'Curated introductions', 'Premium bar access'],
    iconName: 'business-center',
    available: false,
  },
  {
    id: 'exp_005',
    title: 'Rooftop Jazz Evening',
    category: 'LUXURY SOCIAL',
    venue: 'Skylight Rooftop Bar',
    location: 'Shoreditch, London',
    duration: '3 hours',
    price: 175,
    rating: 4.8,
    reviewCount: 156,
    companion: {name: 'Isabelle Moreau', trustScore: 95},
    description:
      'An enchanting evening of live jazz on one of London\'s most stunning rooftops. Cocktails, great conversation, and breathtaking city views with a charming companion.',
    highlights: ['Live jazz performance', 'Panoramic city views', 'Cocktail package included', 'Reserved seating'],
    iconName: 'music-note',
    available: true,
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ExperienceDetailScreen({route, navigation}: Props): React.ReactElement {
  const {experienceId} = route.params;
  const exp = EXPERIENCES.find(e => e.id === experienceId) ?? EXPERIENCES[0];
  const [wishlisted, setWishlisted] = useState(false);
  const insets = useSafeAreaInsets();

  const companionInitials = exp.companion.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Hero ── */}
      <View style={styles.hero}>
        {/* Ambient icon bg */}
        <View style={styles.heroBg}>
          <View style={{opacity: 0.08}}>
            <Icon name={exp.iconName} size={120} color={Colors.onSurface} />
          </View>
        </View>
        {/* Dark overlay */}
        <View style={styles.heroOverlay} />

        {/* Floating header — absolute */}
        <View style={styles.floatingHeader}>
          <TouchableOpacity
            style={styles.floatingBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}>
            <Icon name="arrow-back" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.floatingRight}>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={() => setWishlisted(w => !w)}
              activeOpacity={0.8}>
              <Icon
                name={wishlisted ? 'favorite' : 'favorite-border'}
                size={20}
                color={wishlisted ? Colors.error : Colors.onSurface}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.floatingBtn}
              onPress={() =>
                Share.share({
                  title: exp.title,
                  message:
                    'Check out this exclusive experience on CoBuddy: ' +
                    exp.title +
                    ' — ' +
                    exp.category +
                    '. Book through the CoBuddy app.',
                }).catch(() => {})
              }
              activeOpacity={0.8}>
              <Icon name="share" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero bottom content */}
        <View style={styles.heroBottom}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{exp.category}</Text>
          </View>
          <Text style={styles.heroTitle}>{exp.title}</Text>
          <View style={styles.heroLocationRow}>
            <Icon name="location-on" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.heroLocation}>{exp.venue} · {exp.location}</Text>
          </View>
        </View>
      </View>

      {/* ── Body ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="star" size={16} color={Colors.primary} />
            <Text style={styles.statValue}>{exp.rating.toFixed(1)}</Text>
            <Text style={styles.statSub}>({exp.reviewCount})</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon name="schedule" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.statValue}>{exp.duration}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Icon name="attach-money" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.statValue}>${exp.price}</Text>
            <Text style={styles.statSub}>per person</Text>
          </View>
        </View>

        {/* Companion card */}
        <View style={styles.companionCard}>
          <View style={styles.companionAvatar}>
            <Text style={styles.companionInitials}>{companionInitials}</Text>
          </View>
          <View style={styles.companionMeta}>
            <Text style={styles.companionName}>{exp.companion.name}</Text>
            <Text style={styles.companionSub}>Your Companion</Text>
          </View>
          <View style={styles.trustBadge}>
            <Icon name="verified-user" size={13} color={Colors.primary} />
            <Text style={styles.trustScore}>{exp.companion.trustScore}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Experience</Text>
          <Text style={styles.description}>{exp.description}</Text>
        </View>

        {/* Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          <View style={styles.highlightsList}>
            {exp.highlights.map((h, i) => (
              <View key={i} style={styles.highlightRow}>
                <View style={styles.highlightIcon}>
                  <Icon name="check-circle" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.highlightText}>{h}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Availability badge */}
        <View style={styles.availabilityRow}>
          <View style={[styles.availDot, {backgroundColor: exp.available ? Colors.success : Colors.warning}]} />
          <Text style={styles.availText}>
            {exp.available ? 'Available Now' : 'Next Available: Tomorrow'}
          </Text>
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* ── Bottom action bar ── */}
      <View style={[styles.bottomBarShadow, {paddingBottom: insets.bottom}]}>
        <View style={styles.bottomBar}>
          <View style={styles.bottomPrice}>
            <Text style={styles.bottomPriceLabel}>From</Text>
            <Text style={styles.bottomPriceValue}>${exp.price}</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookBtn, !exp.available && styles.bookBtnDisabled]}
            onPress={exp.available ? () => navigation.navigate('CompanionBrowse') : undefined}
            activeOpacity={exp.available ? 0.8 : 1}
            disabled={!exp.available}>
            <Text style={[styles.bookBtnText, !exp.available && styles.bookBtnTextDisabled]}>
              {exp.available ? 'Book Experience' : 'Unavailable'}
            </Text>
            {exp.available && <Icon name="arrow-forward" size={16} color={Colors.surface} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Hero
  hero: {
    height: 300,
    backgroundColor: Colors.surfaceContainerHigh,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  heroOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20,20,15,0.65)',
  },
  floatingHeader: {
    position: 'absolute', top: 12, left: 16, right: 16,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', zIndex: 10,
  },
  floatingRight: {flexDirection: 'row', gap: 10},
  floatingBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(11,13,26,0.65)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBottom: {padding: 20, gap: 8},
  categoryPill: {
    alignSelf: 'flex-start',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.4)',
    borderRadius: 999,
    paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: 'rgba(242,202,80,0.08)',
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.primary, letterSpacing: 1.5,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24,
    color: Colors.onSurface, lineHeight: 32,
  },
  heroLocationRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  heroLocation: {
    fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant,
  },

  // Scroll body
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20},

  // Stats row
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD_BG,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    paddingVertical: 16, paddingHorizontal: 20,
    marginBottom: 16, gap: 0,
  },
  statItem: {flexDirection: 'row', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 5},
  statValue: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  statSub:   {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  statDivider: {width: 1, height: 28, backgroundColor: CARD_BORDER},

  // Companion card
  companionCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 16, marginBottom: 20,
  },
  companionAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  companionInitials: {
    fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.primary,
  },
  companionMeta: {flex: 1},
  companionName: {
    fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface,
  },
  companionSub: {
    fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant,
  },
  trustBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5,
  },
  trustScore: {
    fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary,
  },

  // Sections
  section: {marginBottom: 24},
  sectionTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface,
    marginBottom: 12, letterSpacing: 0.2,
  },
  description: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, lineHeight: 22,
  },

  // Highlights
  highlightsList: {gap: 12},
  highlightRow:   {flexDirection: 'row', alignItems: 'center', gap: 12},
  highlightIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(242,202,80,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  highlightText: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurface, flex: 1, lineHeight: 20,
  },

  // Availability
  availabilityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginBottom: 16,
  },
  availDot: {width: 8, height: 8, borderRadius: 4},
  availText: {
    fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface,
  },

  // Bottom action bar — Fabric-safe
  bottomBarShadow: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.3, shadowRadius: 12,
    backgroundColor: 'rgba(20,20,15,0.97)',
    borderTopWidth: 1, borderTopColor: CARD_BORDER,
  },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 16, gap: 16,
  },
  bottomPrice: {flex: 1},
  bottomPriceLabel: {
    fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant,
  },
  bottomPriceValue: {
    fontFamily: 'Inter-SemiBold', fontSize: 22, color: Colors.onSurface,
  },
  bookBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14, paddingVertical: 15,
  },
  bookBtnDisabled: {backgroundColor: Colors.surfaceContainerHighest},
  bookBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.surface, letterSpacing: 0.3,
  },
  bookBtnTextDisabled: {color: Colors.onSurfaceVariant},
});
