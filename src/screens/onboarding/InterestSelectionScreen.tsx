import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {PrimaryButton, BottomActionBar} from '../../components/ui';
import {useUserStore} from '../../store/userStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'InterestSelection'>;

// Exactly matching Stitch: 12 interest tiles in a 2-col grid
const INTERESTS = [
  {id: 'coffee',    label: 'Coffee Conversations', icon: '☕'},
  {id: 'walks',     label: 'City Walks',            icon: '🚶'},
  {id: 'dining',    label: 'Fine Dining',            icon: '🍽'},
  {id: 'art',       label: 'Art & Culture',          icon: '🎨'},
  {id: 'network',   label: 'Networking Meetups',     icon: '🤝'},
  {id: 'cowork',    label: 'Coworking Meetups',      icon: '💼'},
  {id: 'wellness',  label: 'Wellness Activities',    icon: '🧘'},
  {id: 'language',  label: 'Language Exchange',      icon: '🌍'},
  {id: 'shopping',  label: 'Shopping Companions',    icon: '🛍'},
  {id: 'movies',    label: 'Movie Experiences',      icon: '🎬'},
  {id: 'books',     label: 'Book Discussions',       icon: '📖'},
  {id: 'music',     label: 'Music & Culture',        icon: '🎵'},
];

const MIN_SELECT = 3;
const MAX_SELECT = 10;

export default function InterestSelectionScreen({navigation}: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set(['coffee', 'art', 'wellness']));
  const [search, setSearch] = useState('');
  const {updateProfile} = useUserStore();

  const filtered = INTERESTS.filter(i =>
    i.label.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {next.delete(id);}
      else if (next.size < MAX_SELECT) {next.add(id);}
      return next;
    });
  };

  const count = selected.size;
  const isValid = count >= MIN_SELECT;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <OnboardingHeader
        showBack
        onBack={() => navigation.goBack()}
        centerLabel="Interests"
        step="3 / 7"
        showProgress
        currentStep={3}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Progress overline */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>PERSONALIZE YOUR EXPERIENCE</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>What Experiences{'\n'}Interest You?</Text>
        <Text style={styles.subheadline}>
          Select the kinds of trusted public experiences you'd like to explore on CoBuddy.
        </Text>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Icon name="search" size={18} color={Colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search experiences"
            placeholderTextColor={Colors.outlineVariant}
            returnKeyType="search"
          />
        </View>

        {/* Interest grid — 2 columns */}
        <View style={styles.grid}>
          {filtered.map(item => {
            const active = selected.has(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.tile, active && styles.tileActive]}
                onPress={() => toggle(item.id)}
                activeOpacity={0.8}>
                <View style={[styles.tileIconWrap, active && styles.tileIconWrapActive]}>
                  <Text style={styles.tileIcon}>{item.icon}</Text>
                </View>
                <Text style={[styles.tileLabel, active && styles.tileLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer counter */}
        <View style={styles.footer}>
          <View style={styles.footerInfo}>
            <Icon name="info" size={16} color={Colors.primary} />
            <Text style={styles.footerInfoText}>
              Choose at least {MIN_SELECT} interests. ({count} selected)
            </Text>
          </View>
          <Text style={styles.footerMax}>MAXIMUM {MAX_SELECT} SELECTIONS ALLOWED</Text>
        </View>

        <Text style={styles.cue}>
          Your preferences help personalize trusted experiences and recommendations.
        </Text>
      </ScrollView>

      <BottomActionBar>
        <PrimaryButton
          label="CONTINUE"
          onPress={() => {
            updateProfile({interests: Array.from(selected)});
            navigation.navigate('ComfortPreferences');
          }}
          disabled={!isValid}
        />
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},

  header: {},  // kept for TS safety; layout now via OnboardingHeader
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    backgroundColor: Colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: 16, color: Colors.onSurface},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20},

  progressRow: {alignItems: 'center', marginBottom: 24, gap: 10},
  progressLabel: {
    fontSize: 11,
    letterSpacing: 2.5,
    color: Colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressTrack: {
    width: 128,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '66%',
    height: '100%',
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },

  headline: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.onSurface,
    lineHeight: 36,
    letterSpacing: -0.3,
    textAlign: 'center',
    marginBottom: 10,
  },
  subheadline: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    lineHeight: 25,
    textAlign: 'center',
    marginBottom: 24,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    backgroundColor: 'rgba(32,32,26,0.5)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  searchIcon: {fontSize: 18},
  searchInput: {flex: 1, fontSize: 16, color: Colors.onSurface},

  // 2-column grid
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 20},
  tile: {
    width: '47%',
    backgroundColor: 'rgba(20,20,15,0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  tileActive: {
    borderColor: 'rgba(212,175,55,0.5)',
    backgroundColor: 'rgba(242,202,80,0.05)',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 4,
  },
  tileIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileIconWrapActive: {backgroundColor: 'rgba(242,202,80,0.1)'},
  tileIcon: {fontSize: 22},
  tileLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  tileLabelActive: {color: Colors.primary},

  footer: {alignItems: 'center', gap: 6, marginBottom: 14},
  footerInfo: {flexDirection: 'row', alignItems: 'center', gap: 6},
  footerInfoIcon: {fontSize: 16, color: Colors.primary},
  footerInfoText: {fontSize: 14, color: Colors.onSurfaceVariant},
  footerMax: {
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.onSurfaceVariant,
    opacity: 0.4,
    textTransform: 'uppercase',
  },
  cue: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
    opacity: 0.6,
  },
});
