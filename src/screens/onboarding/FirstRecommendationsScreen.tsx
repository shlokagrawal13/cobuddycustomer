import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {PrimaryButton, SecondaryButton, BottomActionBar} from '../../components/ui';
import {useAuthStore} from '../../store/authStore';
import Icon from '../../components/ui/Icon';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

type Props = NativeStackScreenProps<OnboardingStackParamList, 'FirstRecommendations'>;

// Category filter pills — from Stitch
const CATEGORIES = ['DINING', 'WELLNESS', 'NETWORKING', 'LUXURY SOCIAL', 'CULTURAL'];

// Stitch shows personalization status card + category filter
const INTEREST_TAGS = ['WELLNESS', 'DINING', 'NETWORKING'];

export default function FirstRecommendationsScreen({navigation}: Props) {
  const [activeCategory, setActiveCategory] = useState('DINING');

  const handleExplore = () => {
    // RootNavigator uses conditional rendering based on isOnboarded.
    // MainTabNavigator is NOT in the navigation stack while OnboardingNavigator
    // is shown — they are mutually exclusive children of the root Stack.
    // Calling setOnboarded() triggers a Zustand state update which causes
    // RootNavigator to re-render and automatically swap to MainTabNavigator.
    // No navigate() or reset() call is needed or correct here.
    useAuthStore.getState().setOnboarded();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <OnboardingHeader
        showBack
        onBack={() => navigation.goBack()}
        centerLabel="Curated For You"
        step="7 / 7"
        showProgress
        currentStep={7}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}>

        {/* Hero Section — Stitch: 530px tall, image with gradient overlay */}
        <View style={styles.heroSection}>
          {/* Image placeholder */}
          <View style={styles.heroImagePlaceholder}>
            <View style={{opacity: 0.08}}>
              <Icon name="local-bar" size={80} color={Colors.onSurface} />
            </View>
          </View>
          {/* Gradient overlay */}
          <View style={styles.heroGradient} />
          {/* Hero text */}
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Curated For You</Text>
            <Text style={styles.heroSubtitle}>
              Personalized trusted experiences and premium hospitality recommendations tailored to your interests.
            </Text>
          </View>
        </View>

        {/* Personalization Status Card */}
        <View style={styles.statusSection}>
          <View style={styles.statusCard}>
            {/* Glow blob */}
            <View style={styles.statusGlowBlob} />
            <View style={styles.statusInner}>
              <View style={styles.statusLeft}>
                <View style={styles.statusConfidence}>
                <Icon name="star" size={18} color={Colors.primary} />
                  <Text style={styles.statusConfidenceText}>94% Recommendation Confidence</Text>
                </View>
                <Text style={styles.statusBasedOn}>Based on your recent curation profile.</Text>
                <View style={styles.interestTags}>
                  {INTEREST_TAGS.map(tag => (
                    <View key={tag} style={styles.interestTag}>
                      <Text style={styles.interestTagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.statusBadges}>
                <View style={styles.statusBadge}>
                  <Icon name="verified-user" size={16} color={Colors.primary} />
                  <Text style={styles.statusBadgeText}>CONCIERGE CURATED</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Icon name="lock" size={16} color={Colors.primary} />
                  <Text style={styles.statusBadgeText}>TRUSTED DISCOVERY</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Category filter — horizontal scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
          style={styles.categoryRow}>
          {CATEGORIES.map(cat => {
            const active = cat === activeCategory;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.categoryChip, active && styles.categoryChipActive]}
                activeOpacity={0.8}>
                <Text style={[styles.categoryChipText, active && styles.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Empty space — in the real app this would list recommendation cards */}
        <View style={styles.emptyRecsHint}>
          <Icon name="auto-awesome" size={40} color={Colors.primary} />
          <Text style={styles.emptyRecsTitle}>Your picks are ready</Text>
          <Text style={styles.emptyRecsText}>
            68 curated experiences await you. Explore your personalized feed after joining.
          </Text>
        </View>

        {/* Bottom padding for fixed bar */}
        <View style={{height: 120}} />
      </ScrollView>

      {/* Bottom action bar — Stitch: "Tune Preferences" + "Explore Curated Picks" */}
      <BottomActionBar>
        <Text style={styles.picksLabel}>68 Curated Picks</Text>
        {/* Stack vertically so each button gets full width — prevents CTA text truncation */}
        <View style={styles.bottomBtns}>
          <PrimaryButton
            label="Explore Curated Picks"
            onPress={handleExplore}
          />
          <SecondaryButton
            label="Tune Preferences"
            onPress={() => navigation.navigate('ComfortPreferences')}
            variant="ghost"
          />
        </View>
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 72,
    backgroundColor: 'rgba(11,13,26,0.6)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnIcon: {fontSize: 18, color: Colors.onSurfaceVariant},
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 20,
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  headerRight: {flexDirection: 'row'},

  scroll: {flex: 1},

  heroSection: {
    height: 320,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImageIcon: {fontSize: 80, opacity: 0.08},
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,8,22,0.7)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.primary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },

  statusSection: {paddingHorizontal: 20, paddingTop: 20},
  statusCard: {
    backgroundColor: 'rgba(11,13,26,0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.05,
    shadowRadius: 40,
    elevation: 4,
  },
  statusGlowBlob: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(242,202,80,0.1)',
  },
  statusInner: {
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
    zIndex: 1,
  },
  statusLeft: {gap: 8},
  statusConfidence: {flexDirection: 'row', alignItems: 'center', gap: 8},
  statusConfidenceIcon: {fontSize: 18, color: Colors.primary},
  statusConfidenceText: {fontSize: 14, color: Colors.primary, fontWeight: '500'},
  statusBasedOn: {fontSize: 13, color: Colors.onSurfaceVariant, marginBottom: 4},
  interestTags: {flexDirection: 'row', flexWrap: 'wrap', gap: 6},
  interestTag: {
    backgroundColor: 'rgba(32,32,26,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  interestTagText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  statusBadges: {gap: 8},
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(32,32,26,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  statusBadgeIcon: {fontSize: 16, color: Colors.primary},
  statusBadgeText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurface,
    fontWeight: '600',
  },

  categoryRow: {marginTop: 20},
  categoryScroll: {paddingHorizontal: 20, gap: 10},
  categoryChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(32,32,26,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  categoryChipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  categoryChipText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  categoryChipTextActive: {color: Colors.onPrimary},

  emptyRecsHint: {
    alignItems: 'center',
    padding: 32,
    gap: 10,
    marginTop: 16,
  },
  emptyRecsIcon: {fontSize: 40},
  emptyRecsTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface},
  emptyRecsText: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
  },

  picksLabel: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
  },
  bottomBtns: {
    // Vertical stack: each button occupies full width, no truncation possible
    flexDirection: 'column',
    gap: 10,
    width: '100%',
  },
});
