import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {PrimaryButton, SecondaryButton} from '../../components/ui';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;
const {height: SCREEN_H, width: SCREEN_W} = Dimensions.get('window');

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This section will be available in the next release.');

const TRUST_PILLARS = [
  {icon: '🛡', label: 'Verified'},
  {icon: '🔐', label: 'Encrypted'},
  {icon: '✦',  label: 'Curated'},
];

export default function WelcomeScreen({navigation}: Props) {
  const PillarIcon = ({icon}: {icon: string}) => {
    if (icon === '🛡') {return <Icon name="security" size={20} color={Colors.onSurfaceVariant} />;}
    if (icon === '🔐') {return <Icon name="lock" size={20} color={Colors.onSurfaceVariant} />;}
    return <Icon name="auto-awesome" size={20} color={Colors.onSurfaceVariant} />;
  };
  const heroOpacity   = useRef(new Animated.Value(0)).current;
  const heroY         = useRef(new Animated.Value(24)).current;
  const actionsOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(heroOpacity, {toValue: 1, duration: 550, useNativeDriver: true}),
        Animated.timing(heroY,       {toValue: 0, duration: 550, useNativeDriver: true}),
      ]),
      Animated.timing(actionsOpacity, {toValue: 1, duration: 450, useNativeDriver: true}),
    ]).start();
  }, [heroOpacity, heroY, actionsOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <View style={styles.bgGlow} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom', 'left', 'right']}>
        {/* Hero */}
        <Animated.View style={[styles.hero, {opacity: heroOpacity, transform: [{translateY: heroY}]}]}>
          <View style={styles.heroImageBox}>
            <Text style={styles.heroGlyph}>✦</Text>
            <View style={styles.heroOverlay} />
          </View>

          <Text style={styles.overline}>PREMIUM COMPANION PLATFORM</Text>
          <Text style={styles.heroTitle}>{'Your Premium\nAccess'}</Text>
          <Text style={styles.heroSubtitle}>
            Concierge-curated experiences, trusted connections, and emotionally intelligent hospitality.
          </Text>
        </Animated.View>

        {/* Trust pillars */}
        <Animated.View style={[styles.pillars, {opacity: actionsOpacity}]}>
          {TRUST_PILLARS.map(p => (
            <View key={p.label} style={styles.pillar}>
              <PillarIcon icon={p.icon} />
              <Text style={styles.pillarLabel}>{p.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Actions */}
        <Animated.View style={[styles.actions, {opacity: actionsOpacity}]}>
          <PrimaryButton
            label="Create Premium Account"
            onPress={() => navigation.navigate('RoleSelection')}
          />
          <SecondaryButton
            label="I Already Have an Account"
            onPress={() => navigation.navigate('PhoneInput')}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('Waitlist')}
            style={styles.waitlistBtn}>
            <Text style={styles.waitlistText}>Request Invitation Access</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer links */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={comingSoon} activeOpacity={0.7}>
            <Text style={styles.footerItem}>Privacy</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}> · </Text>
          <TouchableOpacity onPress={comingSoon} activeOpacity={0.7}>
            <Text style={styles.footerItem}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.footerDot}> · </Text>
          <TouchableOpacity onPress={comingSoon} activeOpacity={0.7}>
            <Text style={styles.footerItem}>Support</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  bgGlow: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: SCREEN_W * 0.8,
    height: SCREEN_W * 0.8,
    borderRadius: SCREEN_W * 0.4,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  safe: {flex: 1, paddingHorizontal: 20},

  hero: {flex: 1, justifyContent: 'flex-end', paddingBottom: 20},
  heroImageBox: {
    height: SCREEN_H * 0.36,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroGlyph: {fontSize: 72, color: Colors.primary, opacity: 0.18},
  heroOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '60%',
    backgroundColor: 'rgba(20,20,15,0.5)',
  },
  overline: {
    fontSize: 10,
    letterSpacing: 3,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: Colors.onSurface,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 21,
  },

  pillars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.outlineVariant,
    marginBottom: 20,
  },
  pillar: {alignItems: 'center', gap: 5},
  pillarIcon: {fontSize: 18},
  pillarLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },

  actions: {gap: 10, marginBottom: 12},
  waitlistBtn: {alignItems: 'center', paddingVertical: 8},
  waitlistText: {fontSize: 12, color: Colors.outline, letterSpacing: 0.5, textDecorationLine: 'underline'},

  footer: {flexDirection: 'row', justifyContent: 'center', paddingBottom: 4},
  footerItem: {fontSize: 11, color: Colors.outline},
  footerDot: {color: Colors.outline},
});
