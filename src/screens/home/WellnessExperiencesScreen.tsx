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

type Props = NativeStackScreenProps<HomeStackParamList, 'WellnessExperiences'>;

const CARD_BG = 'rgba(11,13,26,0.55)';
const BORDER  = 'rgba(255,255,255,0.08)';
const GOLD_BG = 'rgba(242,202,80,0.10)';
const GOLD_BD = 'rgba(242,202,80,0.22)';
const JADE_BG = 'rgba(109,217,140,0.08)';
const JADE_BD = 'rgba(109,217,140,0.25)';

const CATEGORIES = ['All', 'Spa', 'Meditation', 'Fitness', 'Nutrition', 'Therapy'];

const EXPERIENCES = [
  {id:'w1', name:'Four Hands Luxury Massage',    type:'Spa',        duration:'90 min',  provider:'The Wellness Atelier', icon:'spa'},
  {id:'w2', name:'Private Sunrise Yoga',          type:'Meditation', duration:'60 min',  provider:'Mindful Spaces',       icon:'self-improvement'},
  {id:'w3', name:'Nutrigenomics Consultation',    type:'Nutrition',  duration:'75 min',  provider:'BioOptimal Clinic',    icon:'local-pharmacy'},
  {id:'w4', name:'Cold Plunge and Sauna Ritual',  type:'Fitness',    duration:'120 min', provider:'Nordic Wellness',      icon:'fitness-center'},
];

const SPECIALISTS = [
  {id:'s1', name:'Dr. Aria Chen',  speciality:'Holistic Medicine',   rating:'4.9', initial:'A'},
  {id:'s2', name:'Marcus Webb',    speciality:'Performance Coach',   rating:'5.0', initial:'M'},
  {id:'s3', name:'Priya Nair',     speciality:'Ayurvedic Therapy',   rating:'4.8', initial:'P'},
];

const wellnessAlert = () =>
  Alert.alert('Wellness Booking', 'Your concierge will arrange this wellness experience.');

export default function WellnessExperiencesScreen({navigation}: Props) {
  const [selectedCat, setSelectedCat] = useState('All');

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
        <Text style={styles.headerTitle}>Wellness</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={wellnessAlert}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="self-improvement" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroHeading}>Curated Wellness</Text>
          <Text style={styles.heroSub}>
            Holistic treatments, performance coaching and restorative rituals curated for your lifestyle.
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
                <Text style={[styles.catText, active && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured card */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredBg}>
            <Icon name="spa" size={52} color={Colors.primaryContainer} />
          </View>
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredBadge}>
            <Icon name="verified-user" size={11} color={Colors.success} />
            <Text style={styles.featuredBadgeText}>CONCIERGE VERIFIED</Text>
          </View>
          <View style={styles.featuredContent}>
            <View style={styles.featuredMeta}>
              <Text style={styles.featuredName}>Signature Wellness Journey</Text>
              <Text style={styles.featuredSub}>Full-day holistic programme designed for you</Text>
              <View style={styles.featuredPills}>
                <View style={styles.featuredPill}>
                  <Icon name="schedule" size={10} color={Colors.onSurfaceVariant} />
                  <Text style={styles.featuredPillText}>6 hours</Text>
                </View>
                <View style={styles.featuredPill}>
                  <Icon name="group" size={10} color={Colors.onSurfaceVariant} />
                  <Text style={styles.featuredPillText}>Private</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.featuredCTA} onPress={wellnessAlert} activeOpacity={0.87}>
              <Text style={styles.featuredCTAText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Experiences */}
        <Text style={styles.sectionTitle}>Experiences</Text>
        {EXPERIENCES.map(exp => (
          <TouchableOpacity
            key={exp.id}
            style={styles.expCard}
            onPress={wellnessAlert}
            activeOpacity={0.85}>
            <View style={styles.expIcon}>
              <Icon name={exp.icon} size={22} color={Colors.primary} />
            </View>
            <View style={styles.expMeta}>
              <Text style={styles.expName}>{exp.name}</Text>
              <Text style={styles.expProvider}>{exp.provider}</Text>
              <View style={styles.expRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{exp.type}</Text>
                </View>
                <Icon name="schedule" size={11} color={Colors.onSurfaceVariant} />
                <Text style={styles.expDuration}>{exp.duration}</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}

        {/* Specialists */}
        <Text style={styles.sectionTitle}>Wellness Specialists</Text>
        {SPECIALISTS.map(sp => (
          <TouchableOpacity
            key={sp.id}
            style={styles.specialistCard}
            onPress={wellnessAlert}
            activeOpacity={0.85}>
            <View style={styles.specialistAvatar}>
              <Text style={styles.specialistInitial}>{sp.initial}</Text>
            </View>
            <View style={styles.specialistMeta}>
              <Text style={styles.specialistName}>{sp.name}</Text>
              <Text style={styles.specialistRole}>{sp.speciality}</Text>
            </View>
            <View style={styles.ratingPill}>
              <Icon name="star" size={11} color={Colors.primary} />
              <Text style={styles.ratingText}>{sp.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Trust note */}
        <View style={styles.trustNote}>
          <Icon name="verified-user" size={14} color={Colors.success} />
          <Text style={styles.trustNoteText}>
            All wellness providers are vetted and certified by CoBuddy Health Standards.
          </Text>
        </View>

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

  catRow: {gap: 8, paddingRight: 16},
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    borderWidth: 1, borderColor: BORDER, backgroundColor: CARD_BG,
  },
  catChipActive: {backgroundColor: GOLD_BG, borderColor: GOLD_BD},
  catText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  catTextActive: {color: Colors.primary},

  featuredCard: {
    borderRadius: 20, overflow: 'hidden', minHeight: 190,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: JADE_BD, justifyContent: 'flex-end',
  },
  featuredBg: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(11,13,26,0.3)',
  },
  featuredOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
    backgroundColor: 'rgba(11,13,26,0.82)',
  },
  featuredBadge: {
    position: 'absolute', top: 14, left: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: JADE_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: JADE_BD,
  },
  featuredBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 1.2},
  featuredContent: {
    padding: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between',
  },
  featuredMeta: {flex: 1, gap: 4},
  featuredName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface},
  featuredSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  featuredPills: {flexDirection: 'row', gap: 8, marginTop: 4},
  featuredPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: CARD_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: BORDER,
  },
  featuredPillText: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant},
  featuredCTA: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingHorizontal: 16, paddingVertical: 9, marginLeft: 12,
  },
  featuredCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.surface},

  sectionTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface, marginTop: 4},

  expCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  expIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  expMeta: {flex: 1, gap: 4},
  expName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  expProvider: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  expRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  typeBadge: {
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: GOLD_BD,
  },
  typeBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 0.8},
  expDuration: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},

  specialistCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: JADE_BD, padding: 14,
  },
  specialistAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  specialistInitial: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.primary},
  specialistMeta: {flex: 1, gap: 3},
  specialistName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  specialistRole: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: GOLD_BD,
  },
  ratingText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},

  trustNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: JADE_BG, borderRadius: 14,
    borderWidth: 1, borderColor: JADE_BD, padding: 14,
  },
  trustNoteText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },
});
