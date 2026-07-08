import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {PrimaryButton, SecondaryButton, BottomActionBar} from '../../components/ui';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import Icon from '../../components/ui/Icon';

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LifestylePersonalization'>;

const {width: SW} = Dimensions.get('window');

const LIFESTYLE_CHIPS = [
  {id: 'wellness',    label: 'Wellness & Mindfulness', iconName: 'spa'},
  {id: 'quiet',       label: 'Quiet Luxury Atmosphere', iconName: 'bedtime'},
  {id: 'networking',  label: 'Premium Networking',      iconName: 'handshake'},
  {id: 'dining',      label: 'Luxury Dining',           iconName: 'restaurant'},
];

const SETTINGS = [
  {
    id: 'calm',
    title: 'Calm & Minimal',
    desc: 'Private, unbothered spaces.',
    selected: true,
  },
  {
    id: 'social',
    title: 'Elegant Social',
    desc: 'Curated networking environments.',
    selected: false,
  },
];

export default function LifestylePersonalizationScreen({navigation}: Props) {
  const [selectedChips, setChips] = useState<Set<string>>(new Set(['wellness', 'dining']));
  const [slider, setSlider]       = useState(0.6); // 0 = Reserved, 1 = Dynamic
  const [setting, setSetting]     = useState('calm');

  const toggleChip = (id: string) =>
    setChips(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <OnboardingHeader
        showBack
        onBack={() => navigation.goBack()}
        centerLabel="Lifestyle"
        step="5 / 7"
        showProgress
        currentStep={5}
        rightNode={
          <TouchableOpacity
            onPress={() => navigation.navigate('SafetyTutorial')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero card — full width image placeholder with overlay */}
        <View style={styles.heroCard}>
          {/* Image placeholder */}
          <View style={styles.heroImagePlaceholder}>
            <View style={{opacity: 0.15}}>
              <Icon name="hotel" size={64} color={Colors.onSurface} />
            </View>
          </View>
          <View style={styles.heroOverlay} />
          {/* Hero overlay content */}
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}>
              <Icon name="auto-awesome" size={14} color={Colors.primary} />
              <Text style={styles.heroBadgeText}>PERSONALIZATION</Text>
            </View>
            <Text style={styles.heroTitle}>Curate Your Premium{'\n'}Experience</Text>
            <Text style={styles.heroSubtitle}>
              Personalize trusted hospitality experiences, emotional compatibility, and concierge-guided lifestyle recommendations.
            </Text>
          </View>
        </View>

        {/* Progress glass card */}
        <View style={styles.progressCard}>
          <View style={styles.progressCardRow}>
            <View>
              <Text style={styles.progressCardTitle}>Hospitality Personalization Active</Text>
              <Text style={styles.progressCardSub}>Tailoring your CoBuddy ecosystem.</Text>
            </View>
            <Text style={styles.progressPct}>35<Text style={styles.progressPctUnit}>%</Text></Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: '35%'}]} />
          </View>
        </View>

        {/* Lifestyle Atmosphere chips */}
        <Text style={styles.sectionTitle}>Lifestyle Atmosphere</Text>
        <Text style={styles.sectionSub}>Select the environments that resonate with your energy.</Text>
        <View style={styles.chips}>
          {LIFESTYLE_CHIPS.map(c => {
            const active = selectedChips.has(c.id);
            return (
              <TouchableOpacity
                key={c.id}
                onPress={() => toggleChip(c.id)}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.8}>
                <Icon
                  name={c.iconName}
                  size={18}
                  color={active ? Colors.primary : Colors.onSurfaceVariant}
                />
                <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Social Energy Slider — glass card */}
        <View style={styles.glassCard}>
          <Text style={styles.sliderTitle}>Social Energy Alignment</Text>
          <Text style={styles.sliderSub}>Help us match the pace of your interactions.</Text>

          {/* Visual slider track */}
          <View style={styles.sliderWrap}>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, {width: `${slider * 100}%`}]} />
              <View style={[styles.sliderThumb, {left: `${slider * 100}%`, transform: [{translateX: -12}]}]}>
                <View style={styles.sliderThumbDot} />
              </View>
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>RESERVED</Text>
              <Text style={styles.sliderLabel}>DYNAMIC</Text>
            </View>
          </View>
        </View>

        {/* Preferred Settings cards */}
        <Text style={styles.sectionTitle}>Preferred Settings</Text>
        <View style={styles.settingCards}>
          {SETTINGS.map(s => {
            const active = setting === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                onPress={() => setSetting(s.id)}
                style={[styles.settingCard, active && styles.settingCardActive]}
                activeOpacity={0.8}>
                {/* Placeholder image */}
                <View style={styles.settingImagePlaceholder}>
                  <View style={{opacity: 0.2}}>
                    <Icon
                      name={s.id === 'calm' ? 'nightlight' : 'celebration'}
                      size={48}
                      color={Colors.onSurface}
                    />
                  </View>
                </View>
                <View style={styles.settingOverlay} />
                <View style={styles.settingFooter}>
                  <View>
                    <Text style={styles.settingTitle}>{s.title}</Text>
                    <Text style={styles.settingDesc}>{s.desc}</Text>
                  </View>
                  <View style={[styles.settingCheck, active && styles.settingCheckActive]}>
                    {active && <Icon name="check" size={13} color={Colors.onPrimary} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Concierge banner */}
        <View style={styles.conciergeBanner}>
          <View style={styles.conciergeLeft}>
            <View style={styles.conciergeIconWrap}>
              <Icon name="room-service" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.conciergeTitle}>Require Guidance?</Text>
              <Text style={styles.conciergeDesc}>Our concierge is available to curate your profile personally.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.conciergeBtn}
            onPress={() =>
              (navigation as any).navigate('ConciergeNavigator', {
                screen: 'MessagingThread',
                params: {conversationId: 'concierge_main'},
              })
            }
            activeOpacity={0.7}>
            <Text style={styles.conciergeBtnText}>TALK TO CONCIERGE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomActionBar>
        <PrimaryButton
          label="CONTINUE PERSONALIZATION"
          onPress={() => navigation.navigate('SafetyTutorial')}
        />
        <SecondaryButton
          label="SAVE DRAFT"
          onPress={() => navigation.navigate('SafetyTutorial')}
          variant="ghost"
        />
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},

  header: {},  // layout now via OnboardingHeader
  backBtn: {},
  backIcon: {},
  headerRight: {},
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
  },
  skipText: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },

  scroll: {flex: 1},
  scrollContent: {paddingBottom: 24},

  heroCard: {
    height: 240,
    margin: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderIcon: {fontSize: 64, opacity: 0.15},
  heroOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(20,20,15,0.65)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(20,20,15,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  heroBadgeIcon: {fontSize: 14, color: Colors.primary},
  heroBadgeText: {fontSize: 10, letterSpacing: 2, color: Colors.primary, fontWeight: '600'},
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: Colors.onSurface,
    lineHeight: 30,
    marginBottom: 6,
  },
  heroSubtitle: {fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},

  progressCard: {
    backgroundColor: 'rgba(20,20,15,0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    margin: 20,
    marginBottom: 0,
  },
  progressCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  progressCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 3,
  },
  progressCardSub: {fontSize: 13, color: Colors.onSurfaceVariant},
  progressPct: {fontSize: 28, fontWeight: '600', color: Colors.primary},
  progressPctUnit: {fontSize: 16, color: 'rgba(242,202,80,0.7)'},
  progressTrack: {
    height: 6,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', backgroundColor: Colors.primary, borderRadius: 3},

  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.onSurface,
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    marginHorizontal: 20,
    marginBottom: 14,
    lineHeight: 20,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.1)',
  },
  chipIcon: {fontSize: 16},
  chipLabel: {fontSize: 14, color: Colors.onSurfaceVariant},
  chipLabelActive: {color: Colors.primary},

  glassCard: {
    backgroundColor: 'rgba(20,20,15,0.7)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    margin: 20,
    marginTop: 20,
  },
  sliderTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, marginBottom: 6},
  sliderSub: {fontSize: 13, color: Colors.onSurfaceVariant, marginBottom: 20},
  sliderWrap: {gap: 10},
  sliderTrack: {
    height: 6,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -9,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  sliderThumbDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
  sliderLabels: {flexDirection: 'row', justifyContent: 'space-between'},
  sliderLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },

  settingCards: {gap: 12, paddingHorizontal: 20, marginTop: 12},
  settingCard: {
    height: 160,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    opacity: 0.75,
  },
  settingCardActive: {
    borderColor: 'rgba(242,202,80,0.3)',
    opacity: 1,
  },
  settingImagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingImageIcon: {fontSize: 52, opacity: 0.15},
  settingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,20,15,0.6)',
  },
  settingFooter: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 16,
  },
  settingTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface},
  settingDesc: {fontSize: 13, color: Colors.onSurfaceVariant},
  settingCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingCheckActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  settingCheckMark: {fontSize: 13, color: Colors.onPrimary, fontWeight: '700'},

  conciergeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    borderRadius: 24,
    padding: 16,
    margin: 20,
    marginTop: 20,
    gap: 12,
  },
  conciergeLeft: {flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1},
  conciergeIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  conciergeIcon: {fontSize: 20},
  conciergeTitle: {fontSize: 15, fontWeight: '600', color: Colors.onSurface, marginBottom: 2},
  conciergeDesc: {fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},
  conciergeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.outline,
  },
  conciergeBtnText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.onSurface,
    fontWeight: '600',
  },
});
