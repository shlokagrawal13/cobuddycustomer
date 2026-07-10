import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {FeatureFlags} from '../../config/featureFlags';

type Props = NativeStackScreenProps<HomeStackParamList, 'DiningDiscovery'>;

const CARD_BG    = 'rgba(11,13,26,0.55)';
const BORDER     = 'rgba(255,255,255,0.08)';
const GOLD_BG    = 'rgba(242,202,80,0.10)';
const GOLD_BD    = 'rgba(242,202,80,0.22)';

const CATEGORIES = ['All', 'Fine Dining', 'Private Chef', 'Tasting Menu', 'Rooftop'];

const RESTAURANTS = [
  {id: 'r1', name: 'The Atrium Reserve',   cuisine: 'Modern European',      rating: '4.9', tier: '$$$$$', distance: '0.3 mi', icon: 'restaurant'},
  {id: 'r2', name: "L'Atelier Noir",       cuisine: 'French Contemporary',  rating: '4.8', tier: '$$$$',  distance: '0.7 mi', icon: 'local-dining'},
  {id: 'r3', name: 'Obsidian Kitchen',     cuisine: 'Japanese Omakase',     rating: '5.0', tier: '$$$$$', distance: '1.2 mi', icon: 'ramen-dining'},
  {id: 'r4', name: 'The Gilded Room',      cuisine: 'Modern British',       rating: '4.9', tier: '$$$$',  distance: '0.5 mi', icon: 'dinner-dining'},
];

const CHEF_EXPERIENCES = [
  {id: 'c1', name: 'Private 7-Course Journey', chef: 'Chef Marco Rossi', guests: 'Up to 8 guests',  icon: 'star'},
  {id: 'c2', name: 'Intimate Tasting Evening', chef: 'Chef Yuki Tanaka', guests: 'Up to 4 guests', icon: 'verified'},
];

const demoAlert = () =>
  Alert.alert('Reservations', 'Contact your concierge to arrange this experience.');

export default function DiningDiscoveryScreen({navigation}: Props) {
  const [selectedCat, setSelectedCat] = useState('All');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dining Discovery</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() =>
            Alert.alert(
              'Filter Dining',
              'Use the category chips below to filter by Fine Dining, Private Chef, Tasting Menu, or Rooftop. Additional filters will be available in the next release.',
              [{text: 'OK'}],
            )
          }
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="tune" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroHeading}>Curated Dining</Text>
          <Text style={styles.heroSub}>
            Private tables, chef experiences and exclusive reservations curated by your concierge.
          </Text>
        </View>

        {/* Category filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}>
          {CATEGORIES.map(cat => {
            const active = selectedCat === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, active && styles.catChipActive]}
                onPress={() => setSelectedCat(cat)}
                activeOpacity={0.8}>
                <Text style={[styles.catChipText, active && styles.catChipTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured card */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredBg}>
            <Icon name="restaurant" size={48} color={Colors.primaryContainer} />
          </View>
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredBadge}>
            <Icon name="star" size={11} color={Colors.primary} />
            <Text style={styles.featuredBadgeText}>CONCIERGE SELECT</Text>
          </View>
          <View style={styles.featuredBottom}>
            <View style={styles.featuredMeta}>
              <Text style={styles.featuredName}>The Atrium Reserve</Text>
              <Text style={styles.featuredCuisine}>Modern European - Mayfair</Text>
              <View style={styles.featuredStats}>
                <Icon name="star" size={12} color={Colors.primary} />
                <Text style={styles.featuredStat}>4.9</Text>
                <Text style={styles.featuredStatDiv}>|</Text>
                <Text style={styles.featuredStat}>$$$$$</Text>
                <Text style={styles.featuredStatDiv}>|</Text>
                <Text style={styles.featuredStat}>Private dining available</Text>
              </View>
            </View>
            {FeatureFlags.VIP_EVENTS && (
              <TouchableOpacity
                style={styles.featuredCTA}
                onPress={() =>
                  (navigation as any).navigate('ModalNavigator', {
                    screen: 'VIPEventReservation',
                    params: {eventId: 'featured_atrium_001'},
                  })
                }
                activeOpacity={0.87}>
                <Text style={styles.featuredCTAText}>Reserve</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Restaurant list */}
        <Text style={styles.sectionTitle}>Curated Restaurants</Text>
        {RESTAURANTS.map(r => (
          <TouchableOpacity
            key={r.id}
            style={styles.restaurantCard}
            onPress={() =>
              (navigation as any).navigate('HomeNavigator', {
                screen: 'VenueDetail',
                params: {venueId: r.id},
              })
            }
            activeOpacity={0.85}>
            <View style={styles.restaurantIcon}>
              <Icon name={r.icon} size={20} color={Colors.primary} />
            </View>
            <View style={styles.restaurantMeta}>
              <Text style={styles.restaurantName}>{r.name}</Text>
              <Text style={styles.restaurantCuisine}>{r.cuisine}</Text>
              <View style={styles.restaurantStats}>
                <Icon name="star" size={10} color={Colors.primary} />
                <Text style={styles.restaurantStat}>{r.rating}</Text>
                <Text style={styles.restaurantStatDiv}> - </Text>
                <Text style={styles.restaurantStat}>{r.tier}</Text>
                <Text style={styles.restaurantStatDiv}> - </Text>
                <Text style={styles.restaurantStat}>{r.distance}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}

        {/* Private Chef */}
        <Text style={styles.sectionTitle}>Private Chef Experiences</Text>
        {CHEF_EXPERIENCES.map(c => (
          <TouchableOpacity
            key={c.id}
            style={styles.chefCard}
            onPress={() =>
              (navigation as any).navigate('ModalNavigator', {
                screen: 'VIPEventReservation',
                params: {eventId: c.id},
              })
            }
            activeOpacity={0.85}>
            <View style={styles.chefIconWrap}>
              <Icon name={c.icon} size={22} color={Colors.primary} />
            </View>
            <View style={styles.chefMeta}>
              <Text style={styles.chefName}>{c.name}</Text>
              <Text style={styles.chefSub}>{c.chef}</Text>
              <View style={styles.chefGuestRow}>
                <Icon name="group" size={12} color={Colors.onSurfaceVariant} />
                <Text style={styles.chefGuests}>{c.guests}</Text>
              </View>
            </View>
            {FeatureFlags.VIP_EVENTS && (
              <TouchableOpacity
                style={styles.chefBookBtn}
                onPress={() =>
                  (navigation as any).navigate('ModalNavigator', {
                    screen: 'VIPEventReservation',
                    params: {eventId: c.id},
                  })
                }
                activeOpacity={0.8}>
                <Text style={styles.chefBookText}>Book</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 60, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  hero: {gap: 8},
  heroHeading: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 30, color: Colors.onSurface},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22},

  catRow: {paddingRight: 16, gap: 8},
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 100, borderWidth: 1, borderColor: BORDER,
    backgroundColor: CARD_BG,
  },
  catChipActive: {backgroundColor: GOLD_BG, borderColor: GOLD_BD},
  catChipText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  catChipTextActive: {color: Colors.primary},

  featuredCard: {
    borderRadius: 20, overflow: 'hidden', minHeight: 200,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: GOLD_BD,
    justifyContent: 'flex-end',
  },
  featuredBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(11,13,26,0.3)',
  },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
    backgroundColor: 'rgba(11,13,26,0.75)',
  },
  featuredBadge: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: GOLD_BD,
  },
  featuredBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 1.2},
  featuredBottom: {padding: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between'},
  featuredMeta: {flex: 1, gap: 4},
  featuredName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.onSurface},
  featuredCuisine: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  featuredStats: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2},
  featuredStat: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  featuredStatDiv: {color: Colors.onSurfaceVariant, fontSize: 11},
  featuredCTA: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 9, marginLeft: 12,
  },
  featuredCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.surface},

  sectionTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface, marginTop: 4},

  restaurantCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  restaurantIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  restaurantMeta: {flex: 1, gap: 3},
  restaurantName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  restaurantCuisine: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  restaurantStats: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2},
  restaurantStat: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  restaurantStatDiv: {color: Colors.onSurfaceVariant, fontSize: 11},

  chefCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: GOLD_BD, padding: 14,
  },
  chefIconWrap: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  chefMeta: {flex: 1, gap: 3},
  chefName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  chefSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  chefGuestRow: {flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2},
  chefGuests: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  chefBookBtn: {
    backgroundColor: GOLD_BG, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: GOLD_BD,
  },
  chefBookText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
});
