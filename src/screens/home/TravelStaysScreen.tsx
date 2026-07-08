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

type Props = NativeStackScreenProps<HomeStackParamList, 'TravelStays'>;

const CARD_BG = 'rgba(11,13,26,0.55)';
const BORDER  = 'rgba(255,255,255,0.08)';
const GOLD_BG = 'rgba(242,202,80,0.10)';
const GOLD_BD = 'rgba(242,202,80,0.22)';

const TABS = ['Villas', 'Hotels', 'Retreats', 'Yachts'];

const PROPERTIES = [
  {id:'p1', name:'Villa Solange',         location:'Amalfi Coast, Italy',  type:'Villa',   rate:'$4,200 / night', rating:'5.0', icon:'villa'},
  {id:'p2', name:'The Dorchester Suite',  location:'Mayfair, London',      type:'Hotel',   rate:'$1,800 / night', rating:'4.9', icon:'hotel'},
  {id:'p3', name:'Jade Mountain Resort',  location:'St. Lucia',            type:'Retreat', rate:'$2,600 / night', rating:'4.9', icon:'spa'},
  {id:'p4', name:'Oceania Superyacht',    location:'Mediterranean',         type:'Yacht',   rate:'$28,000 / week', rating:'5.0', icon:'directions-boat'},
];

const PACKAGES = [
  {id:'pk1', name:'European Grand Tour',  duration:'14 nights', highlights:'Paris, Monaco, Amalfi Coast', icon:'flight'},
  {id:'pk2', name:'Wellness Escape',      duration:'7 nights',  highlights:'Maldives Overwater Bungalow', icon:'spa'},
];

const travelAlert = () =>
  Alert.alert('Travel Concierge', 'Your dedicated travel concierge will craft a personalised itinerary.');

export default function TravelStaysScreen({navigation}: Props) {
  const [activeTab, setActiveTab] = useState('Villas');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel and Stays</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={travelAlert}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
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
          <Text style={styles.heroHeading}>Curated Retreats</Text>
          <Text style={styles.heroSub}>
            Private villas, luxury suites and bespoke travel experiences arranged by your personal concierge.
          </Text>
        </View>

        {/* Tab filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}>
          {TABS.map(tab => {
            const active = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.tabChip, active && styles.tabChipActive]}
                onPress={() => setActiveTab(tab)}
                activeOpacity={0.8}>
                <Text style={[styles.tabChipText, active && styles.tabChipTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured property */}
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={travelAlert}
          activeOpacity={0.9}>
          <View style={styles.featuredBg}>
            <Icon name="villa" size={56} color={Colors.primaryContainer} />
          </View>
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredBadge}>
            <Icon name="star" size={11} color={Colors.primary} />
            <Text style={styles.featuredBadgeText}>EDITORS CHOICE</Text>
          </View>
          <View style={styles.featuredBottom}>
            <View style={styles.featuredMeta}>
              <Text style={styles.featuredName}>Villa Solange</Text>
              <Text style={styles.featuredLocation}>Amalfi Coast, Italy</Text>
              <View style={styles.featuredRow}>
                <Icon name="star" size={11} color={Colors.primary} />
                <Text style={styles.featuredStat}>5.0</Text>
                <Text style={styles.dot}>  |  </Text>
                <Text style={styles.featuredStat}>$4,200 per night</Text>
              </View>
            </View>
            <View style={styles.featuredCTA}>
              <Text style={styles.featuredCTAText}>Enquire</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Properties list */}
        <Text style={styles.sectionTitle}>All Properties</Text>
        {PROPERTIES.map(p => (
          <TouchableOpacity
            key={p.id}
            style={styles.propertyCard}
            onPress={travelAlert}
            activeOpacity={0.85}>
            <View style={styles.propertyIcon}>
              <Icon name={p.icon} size={22} color={Colors.primary} />
            </View>
            <View style={styles.propertyMeta}>
              <View style={styles.propertyNameRow}>
                <Text style={styles.propertyName}>{p.name}</Text>
                <View style={styles.typePill}>
                  <Text style={styles.typePillText}>{p.type}</Text>
                </View>
              </View>
              <View style={styles.propertyLocationRow}>
                <Icon name="location-on" size={11} color={Colors.onSurfaceVariant} />
                <Text style={styles.propertyLocation}>{p.location}</Text>
              </View>
              <View style={styles.propertyStatsRow}>
                <Icon name="star" size={10} color={Colors.primary} />
                <Text style={styles.propertyStat}>{p.rating}</Text>
                <Text style={styles.dot}> - </Text>
                <Text style={styles.propertyStat}>{p.rate}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}

        {/* Packages */}
        <Text style={styles.sectionTitle}>Concierge Packages</Text>
        {PACKAGES.map(pkg => (
          <TouchableOpacity
            key={pkg.id}
            style={styles.packageCard}
            onPress={travelAlert}
            activeOpacity={0.85}>
            <View style={styles.packageIcon}>
              <Icon name={pkg.icon} size={22} color={Colors.primary} />
            </View>
            <View style={styles.packageMeta}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packageDuration}>{pkg.duration}</Text>
              <Text style={styles.packageHighlights}>{pkg.highlights}</Text>
            </View>
            <View style={styles.packageCTA}>
              <Text style={styles.packageCTAText}>View</Text>
            </View>
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

  tabRow: {gap: 8, paddingRight: 16},
  tabChip: {
    paddingHorizontal: 18, paddingVertical: 9, borderRadius: 100,
    borderWidth: 1, borderColor: BORDER, backgroundColor: CARD_BG,
  },
  tabChipActive: {backgroundColor: GOLD_BG, borderColor: GOLD_BD},
  tabChipText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  tabChipTextActive: {color: Colors.primary},

  featuredCard: {
    borderRadius: 20, overflow: 'hidden', minHeight: 210,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: GOLD_BD, justifyContent: 'flex-end',
  },
  featuredBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(11,13,26,0.25)',
  },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 130,
    backgroundColor: 'rgba(11,13,26,0.8)',
  },
  featuredBadge: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: GOLD_BD,
  },
  featuredBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 1.2},
  featuredBottom: {
    padding: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
  },
  featuredMeta: {flex: 1, gap: 4},
  featuredName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface},
  featuredLocation: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  featuredRow: {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2},
  featuredStat: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  dot: {color: Colors.onSurfaceVariant},
  featuredCTA: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 9, marginLeft: 12,
  },
  featuredCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.surface},

  sectionTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface, marginTop: 4},

  propertyCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  propertyIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  propertyMeta: {flex: 1, gap: 4},
  propertyNameRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  propertyName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  typePill: {
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: GOLD_BD,
  },
  typePillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 0.8},
  propertyLocationRow: {flexDirection: 'row', alignItems: 'center', gap: 3},
  propertyLocation: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  propertyStatsRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  propertyStat: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},

  packageCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: GOLD_BD, padding: 14,
  },
  packageIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  packageMeta: {flex: 1, gap: 3},
  packageName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  packageDuration: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.primary},
  packageHighlights: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  packageCTA: {
    backgroundColor: GOLD_BG, borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: GOLD_BD,
  },
  packageCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},
});
