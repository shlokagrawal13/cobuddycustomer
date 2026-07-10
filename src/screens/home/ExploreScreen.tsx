import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import {HomeStackParamList} from '../../navigation/types';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'Explore'>;

const CATEGORIES = [
  {
    id: 'dining',
    title: 'Dining',
    sub: 'Fine dining, culinary curation, and private tables',
    icon: 'restaurant',
    filters: ['Fine Dining', 'Culinary'],
  },
  {
    id: 'wellness',
    title: 'Wellness',
    sub: 'Holistic treatments, fitness, and mindfulness',
    icon: 'spa',
    filters: ['Wellness', 'Fitness', 'Mindfulness', 'Architecture'],
  },
  {
    id: 'travel',
    title: 'Travel',
    sub: 'Travel companionship and hospitality',
    icon: 'flight',
    filters: ['Travel', 'Hospitality'],
  },
  {
    id: 'social',
    title: 'Social',
    sub: 'Networking, business, and social events',
    icon: 'people',
    filters: ['Networking', 'Social Events', 'Nightlife', 'Business', 'Finance'],
  },
  {
    id: 'events',
    title: 'Events',
    sub: 'Art, culture, and exclusive galas',
    icon: 'event',
    filters: ['Music & Arts', 'Art & Culture'],
  },
];

export default function ExploreScreen({navigation}: Props) {
  const handleCategoryPress = (category: string, filters: string[]) => {
    navigation.navigate('CompanionListing', {category, filters});
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Explore Companions</Text>
        </View>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>Find Your Companion</Text>
          <Text style={styles.welcomeSub}>
            Select a category to browse curated companions for your next experience.
          </Text>
        </View>

        <View style={styles.grid}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(cat.title, cat.filters)}
              activeOpacity={0.85}>
              <View style={styles.iconWrap}>
                <Icon name={cat.icon} size={24} color={Colors.primary} />
              </View>
              <View style={styles.meta}>
                <Text style={styles.title}>{cat.title}</Text>
                <Text style={styles.sub}>{cat.sub}</Text>
              </View>
              <Icon name="chevron-right" size={20} color={Colors.primary} />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_BG = 'rgba(11,13,26,0.4)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},

  // Header
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', pointerEvents: 'none',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, gap: 16},

  // Welcome
  welcomeSection: {marginBottom: 12},
  welcomeLabel: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.primary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  welcomeSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    lineHeight: 24,
  },

  grid: {gap: 12},

  // Category Card
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: CARD_BG,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  meta: {flex: 1, gap: 4},
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.onSurface,
  },
  sub: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
});
