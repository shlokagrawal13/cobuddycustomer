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
import {PrimaryButton, BottomActionBar} from '../../components/ui';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import Icon from '../../components/ui/Icon';

const FeatureIcon = ({icon}: {icon: string}) => {
  if (icon === '✓') {return <Icon name="check" size={15} color={Colors.primary} />;}
  if (icon === '📍') {return <Icon name="location-on" size={15} color={Colors.primary} />;}
  if (icon === '🛡') {return <Icon name="security" size={15} color={Colors.primary} />;}
  return <Icon name="check" size={15} color={Colors.primary} />;
};

const DiscIcon = ({icon, active}: {icon: string; active: boolean}) => {
  const color = active ? Colors.primary : Colors.onSurfaceVariant;
  if (icon === '📍') {return <Icon name="location-on" size={20} color={color} />;}
  if (icon === '✨') {return <Icon name="auto-awesome" size={20} color={color} />;}
  if (icon === '⭐') {return <Icon name="star" size={20} color={color} />;}
  if (icon === '🆕') {return <Icon name="fiber-new" size={20} color={color} />;}
  return <Icon name="explore" size={20} color={color} />;
};

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ComfortPreferences'>;

// Card 1: Experience type chips
const EXP_TYPES = [
  {id: 'conversations', label: 'CONVERSATIONS'},
  {id: 'city',          label: 'CITY ACTIVITIES'},
  {id: 'dining',        label: 'DINING'},
  {id: 'networking',    label: 'NETWORKING'},
  {id: 'study',         label: 'STUDY'},
  {id: 'wellness',      label: 'WELLNESS'},
];

// Card 2: Interaction style radio
const INTERACTION_STYLES = [
  {id: 'casual',       label: 'CASUAL CONVERSATIONS',      desc: 'Low-pressure, relaxed social exchanges.'},
  {id: 'professional', label: 'PROFESSIONAL NETWORKING',   desc: 'Focused on career and growth.'},
  {id: 'shared',       label: 'SHARED ACTIVITIES',         desc: 'Collaborative tasks and hobbies.'},
];

// Card 3: Comfort feature toggles
const COMFORT_FEATURES = [
  {id: 'verified', label: 'Verified members only',     icon: '✓', defaultOn: true},
  {id: 'venue',    label: 'Trusted venue suggestions', icon: '📍', defaultOn: true},
  {id: 'safety',   label: 'Enhanced safety reminders', icon: '🛡', defaultOn: false},
];

// Card 4: Discovery 2×2 grid
const DISCOVERY = [
  {id: 'nearby',   label: 'NEARBY',   icon: '📍'},
  {id: 'curated',  label: 'CURATED',  icon: '✨'},
  {id: 'premium',  label: 'PREMIUM',  icon: '⭐'},
  {id: 'newest',   label: 'NEWEST',   icon: '🆕'},
];

export default function ComfortPreferencesScreen({navigation}: Props) {
  const [expTypes, setExpTypes]  = useState<Set<string>>(new Set(['conversations', 'networking']));
  const [style, setStyle]        = useState('casual');
  const [features, setFeatures]  = useState<Record<string, boolean>>({verified: true, venue: true, safety: false});
  const [discovery, setDisc]     = useState('nearby');

  const toggleExp = (id: string) =>
    setExpTypes(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleFeature = (id: string) =>
    setFeatures(prev => ({...prev, [id]: !prev[id]}));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <OnboardingHeader
        showBack
        onBack={() => navigation.goBack()}
        centerLabel="Comfort"
        step="4 / 7"
        showProgress
        currentStep={4}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Section header */}
        <Text style={styles.overline}>PERSONALIZE YOUR EXPERIENCE</Text>
        <Text style={styles.title}>Set Your Comfort Preferences</Text>
        <Text style={styles.subtitle}>
          Customize your experience settings to create safer and more comfortable public interactions.
        </Text>

        {/* Card 1: Experience Types */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>EXPERIENCE TYPES</Text>
            <Text style={styles.infoIcon}>ℹ</Text>
          </View>
          <View style={styles.chips}>
            {EXP_TYPES.map(t => {
              const active = expTypes.has(t.id);
              return (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => toggleExp(t.id)}
                  style={[styles.chip, active && styles.chipActive]}
                  activeOpacity={0.8}>
                  <Text style={[styles.chipText, active && styles.chipTextActive]}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Card 2: Interaction Style */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>INTERACTION STYLE</Text>
          <View style={styles.radioList}>
            {INTERACTION_STYLES.map(s => {
              const active = style === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  onPress={() => setStyle(s.id)}
                  style={[styles.radioRow, active && styles.radioRowActive]}
                  activeOpacity={0.8}>
                  <View style={styles.radioMeta}>
                    <Text style={[styles.radioLabel, active && styles.radioLabelActive]}>
                      {s.label}
                    </Text>
                    <Text style={styles.radioDesc}>{s.desc}</Text>
                  </View>
                  <Text style={[styles.radioBtn, active && styles.radioBtnActive]}>
                    {active ? '⊙' : '○'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Card 3: Comfort Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>COMFORT FEATURES</Text>
          <View style={styles.featureList}>
            {COMFORT_FEATURES.map(f => {
              const on = !!features[f.id];
              return (
                <View key={f.id} style={styles.featureRow}>
                  <View style={styles.featureLeft}>
                    <View style={[styles.featureIconWrap, on && styles.featureIconWrapOn]}>
                      <FeatureIcon icon={f.icon} />
                    </View>
                    <Text style={styles.featureLabel}>{f.label}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleFeature(f.id)}
                    style={[styles.toggle, on && styles.toggleOn]}>
                    <View style={[styles.toggleThumb, on && styles.toggleThumbOn]} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Card 4: Discovery Preferences 2×2 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>DISCOVERY PREFERENCES</Text>
          <View style={styles.discGrid}>
            {DISCOVERY.map(d => {
              const active = discovery === d.id;
              return (
                <TouchableOpacity
                  key={d.id}
                  onPress={() => setDisc(d.id)}
                  style={[styles.discTile, active && styles.discTileActive]}
                  activeOpacity={0.8}>
                  <DiscIcon icon={d.icon} active={active} />
                  <Text style={[styles.discLabel, active && styles.discLabelActive]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity
            style={styles.howLink}
            onPress={() =>
              Alert.alert(
                'How This Works',
                'Your comfort preferences help our AI match you with companions who align with your personal boundaries, communication style, and experience expectations. Settings can be updated anytime from your profile.',
                [{text: 'Got it'}],
              )
            }
            activeOpacity={0.7}>
            <Text style={styles.howLinkText}>How this works  →</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomActionBar>
        <PrimaryButton
          label="CONTINUE"
          onPress={() => navigation.navigate('LifestylePersonalization')}
        />
        <Text style={styles.footerNote}>
          Your preferences help personalize trusted and safety-first experiences within the CoBuddy ecosystem.
        </Text>
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},

  header: {},  // layout now via OnboardingHeader
  headerLeft: {},
  logo: {fontSize: 18, fontWeight: '700', color: Colors.primary, letterSpacing: -0.3},
  stepInfo: {alignItems: 'flex-end', gap: 4},
  stepText: {fontSize: 10, letterSpacing: 2, color: Colors.primary, fontWeight: '600'},
  stepDots: {flexDirection: 'row', gap: 4},
  stepDot: {
    width: 16,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  stepDotActive: {backgroundColor: Colors.primary},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, paddingBottom: 20},

  overline: {
    fontSize: 11,
    letterSpacing: 2.5,
    color: Colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: Colors.onSurface,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 24,
  },

  card: {
    backgroundColor: 'rgba(11,13,26,0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 14,
  },
  infoIcon: {fontSize: 16, color: Colors.outlineVariant, marginTop: -14},

  chips: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.1)',
  },
  chipText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  chipTextActive: {color: Colors.primary},

  radioList: {gap: 8},
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  radioRowActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  radioMeta: {flex: 1},
  radioLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurface,
    fontWeight: '600',
    marginBottom: 3,
  },
  radioLabelActive: {color: Colors.primary},
  radioDesc: {fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.7},
  radioBtn: {fontSize: 20, color: Colors.outlineVariant},
  radioBtnActive: {color: Colors.primary},

  featureList: {gap: 20},
  featureRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  featureLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  featureIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconWrapOn: {backgroundColor: 'rgba(242,202,80,0.1)'},
  featureIcon: {fontSize: 15},
  featureLabel: {fontSize: 14, color: Colors.onSurface},
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleOn: {backgroundColor: Colors.primary},
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.onSurface,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: {alignSelf: 'flex-end'},

  discGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  discTile: {
    width: '46%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    gap: 6,
  },
  discTileActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  discIcon: {fontSize: 20, color: Colors.onSurfaceVariant},
  discIconActive: {color: Colors.primary},
  discLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  discLabelActive: {color: Colors.primary},
  howLink: {alignItems: 'center', marginTop: 12},
  howLinkText: {
    fontSize: 11,
    color: Colors.primary,
    textDecorationLine: 'underline',
    letterSpacing: 0.3,
  },

  footerNote: {
    fontSize: 11,
    textAlign: 'center',
    color: Colors.onSurfaceVariant,
    opacity: 0.6,
    paddingTop: 4,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});
