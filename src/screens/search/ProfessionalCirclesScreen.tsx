import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SearchStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SearchStackParamList, 'ProfessionalCircles'>;

const CARD_BG = 'rgba(11,13,26,0.55)';
const BORDER  = 'rgba(255,255,255,0.08)';
const GOLD_BG = 'rgba(242,202,80,0.10)';
const GOLD_BD = 'rgba(242,202,80,0.22)';

const INDUSTRIES = ['All', 'Finance', 'Technology', 'Arts', 'Law', 'Medicine'];

const CIRCLES = [
  {
    id: 'pc1',
    name: 'Private Equity Forum',
    industry: 'Finance',
    members: 124,
    tier: 'Platinum',
    description: 'Exclusive networking for senior PE professionals and family office principals.',
    icon: 'trending-up',
  },
  {
    id: 'pc2',
    name: 'Founders Collective',
    industry: 'Technology',
    members: 88,
    tier: 'Gold',
    description: 'Curated community for Series A and beyond founders across emerging markets.',
    icon: 'rocket-launch',
  },
  {
    id: 'pc3',
    name: 'Chambers & Silks',
    industry: 'Law',
    members: 56,
    tier: 'Platinum',
    description: 'Senior barristers and partners from Magic Circle and US-based international firms.',
    icon: 'gavel',
  },
  {
    id: 'pc4',
    name: 'Aesthetic Medicine Society',
    industry: 'Medicine',
    members: 72,
    tier: 'Gold',
    description: 'Leading clinicians specialising in regenerative and aesthetic medicine.',
    icon: 'medical-services',
  },
];

const EVENTS = [
  {id:'e1', name:'Summer Investment Summit',  date:'18 Jul',   type:'In Person', icon:'event'},
  {id:'e2', name:'Digital Art Collectors Eve', date:'22 Jul', type:'Private',   icon:'palette'},
];

const circleAlert = () =>
  Alert.alert('Application Required', 'Membership applications are reviewed by the CoBuddy Trust Board. Contact your concierge to apply.');

export default function ProfessionalCirclesScreen({navigation}: Props) {
  const [activeIndustry, setActiveIndustry] = useState('All');

  const filtered = activeIndustry === 'All'
    ? CIRCLES
    : CIRCLES.filter(c => c.industry === activeIndustry);

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
        <Text style={styles.headerTitle}>Professional Circles</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={circleAlert}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="info-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroHeading}>Curated Networks</Text>
          <Text style={styles.heroSub}>
            By-application professional communities for verified high-calibre members across industry verticals.
          </Text>
        </View>

        {/* Trust badge */}
        <View style={styles.trustBadge}>
          <Icon name="verified-user" size={14} color={Colors.primary} />
          <Text style={styles.trustBadgeText}>All circles are application-only. Membership verified by Trust Board.</Text>
        </View>

        {/* Industry filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {INDUSTRIES.map(ind => {
            const active = activeIndustry === ind;
            return (
              <TouchableOpacity
                key={ind}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveIndustry(ind)}
                activeOpacity={0.8}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{ind}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Circles */}
        {filtered.map(circle => (
          <TouchableOpacity
            key={circle.id}
            style={styles.circleCard}
            onPress={circleAlert}
            activeOpacity={0.85}>
            <View style={styles.circleHeader}>
              <View style={styles.circleIconWrap}>
                <Icon name={circle.icon} size={22} color={Colors.primary} />
              </View>
              <View style={styles.circleTitleBlock}>
                <Text style={styles.circleName}>{circle.name}</Text>
                <View style={styles.circleMetaRow}>
                  <View style={styles.tierPill}>
                    <Text style={styles.tierPillText}>{circle.tier}</Text>
                  </View>
                  <Icon name="group" size={11} color={Colors.onSurfaceVariant} />
                  <Text style={styles.memberCount}>{circle.members} members</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
            </View>
            <Text style={styles.circleDesc}>{circle.description}</Text>
            <TouchableOpacity style={styles.applyBtn} onPress={circleAlert} activeOpacity={0.85}>
              <Text style={styles.applyBtnText}>Request Membership</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {/* Upcoming circle events */}
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {EVENTS.map(ev => (
          <TouchableOpacity
            key={ev.id}
            style={styles.eventCard}
            onPress={circleAlert}
            activeOpacity={0.85}>
            <View style={styles.eventIconWrap}>
              <Icon name={ev.icon} size={20} color={Colors.primary} />
            </View>
            <View style={styles.eventMeta}>
              <Text style={styles.eventName}>{ev.name}</Text>
              <View style={styles.eventRow}>
                <Icon name="calendar-today" size={11} color={Colors.onSurfaceVariant} />
                <Text style={styles.eventDate}>{ev.date}</Text>
                <View style={styles.eventTypePill}>
                  <Text style={styles.eventTypePillText}>{ev.type}</Text>
                </View>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
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
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 14},

  hero: {gap: 8},
  heroHeading: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 30, color: Colors.onSurface},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22},

  trustBadge: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: GOLD_BG, borderRadius: 12,
    borderWidth: 1, borderColor: GOLD_BD, padding: 12,
  },
  trustBadgeText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },

  filterRow: {gap: 8, paddingRight: 16},
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    borderWidth: 1, borderColor: BORDER, backgroundColor: CARD_BG,
  },
  filterChipActive: {backgroundColor: GOLD_BG, borderColor: GOLD_BD},
  filterText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  filterTextActive: {color: Colors.primary},

  circleCard: {
    backgroundColor: CARD_BG, borderRadius: 18,
    borderWidth: 1, borderColor: BORDER, padding: 16, gap: 10,
  },
  circleHeader: {flexDirection: 'row', alignItems: 'center', gap: 12},
  circleIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  circleTitleBlock: {flex: 1, gap: 5},
  circleName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  circleMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 7},
  tierPill: {
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: GOLD_BD,
  },
  tierPillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 0.8},
  memberCount: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  circleDesc: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20},
  applyBtn: {
    backgroundColor: GOLD_BG, borderRadius: 10,
    borderWidth: 1, borderColor: GOLD_BD,
    paddingVertical: 10, alignItems: 'center',
  },
  applyBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},

  sectionTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface, marginTop: 4},

  eventCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  eventIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  eventMeta: {flex: 1, gap: 5},
  eventName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  eventRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  eventDate: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  eventTypePill: {
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: GOLD_BD,
  },
  eventTypePillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 0.8},
});
