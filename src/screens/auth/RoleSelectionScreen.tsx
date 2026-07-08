import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {AppHeader, PrimaryButton, BottomActionBar} from '../../components/ui';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'RoleSelection'>;

const ROLES = [
  {
    id: 'customer' as const,
    title: 'Premium Member',
    subtitle: 'Book exclusive companion experiences',
    description: 'Access curated companions, luxury venues, and concierge services tailored to your lifestyle.',
    icon: '◈',
    badge: 'MEMBER',
  },
  {
    id: 'companion' as const,
    title: 'Companion',
    subtitle: 'Offer premium hospitality services',
    description: 'Join our verified network of elite companions and connect with premium clientele.',
    icon: '✦',
    badge: 'PARTNER',
  },
];

export default function RoleSelectionScreen({navigation}: Props) {
  const [selected, setSelected] = useState<'customer' | 'companion' | null>(null);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {toValue: 1, duration: 450, delay: 100, useNativeDriver: true}),
      Animated.timing(cardY, {toValue: 0, duration: 450, delay: 100, useNativeDriver: true}),
    ]).start();
  }, [cardOpacity, cardY]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader title="Join CoBuddy" showBack />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topCopy}>
          <Text style={styles.overline}>STEP 1 OF 3</Text>
          <Text style={styles.title}>Select Your Role</Text>
          <Text style={styles.subtitle}>Choose how you want to experience CoBuddy.</Text>
        </View>

        <Animated.View style={[styles.cards, {opacity: cardOpacity, transform: [{translateY: cardY}]}]}>
          {ROLES.map(role => {
            const active = selected === role.id;
            return (
              <TouchableOpacity
                key={role.id}
                activeOpacity={0.85}
                onPress={() => setSelected(role.id)}
                style={[styles.card, active && styles.cardActive]}>
                {/* Top row */}
                <View style={styles.cardTop}>
                  <View style={[styles.iconCircle, active && styles.iconCircleActive]}>
                    <Text style={[styles.cardIcon, active && styles.cardIconActive]}>
                      {role.icon}
                    </Text>
                  </View>
                  <View style={[styles.badge, active && styles.badgeActive]}>
                    <Text style={[styles.badgeText, active && styles.badgeTextActive]}>
                      {role.badge}
                    </Text>
                  </View>
                </View>

                {/* Text */}
                <Text style={[styles.roleName, active && styles.roleNameActive]}>
                  {role.title}
                </Text>
                <Text style={styles.roleSubtitle}>{role.subtitle}</Text>
                <Text style={styles.roleDesc}>{role.description}</Text>

                {/* Radio */}
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>

        <Text style={styles.disclaimer}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </Text>
      </ScrollView>

      <BottomActionBar>
        <PrimaryButton
          label="Continue"
          onPress={() => navigation.navigate('PhoneInput')}
          disabled={!selected}
        />
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20},

  topCopy: {marginBottom: 24},
  overline: {fontSize: 10, letterSpacing: 3, color: Colors.primary, fontWeight: '600', marginBottom: 8},
  title: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.onSurface, letterSpacing: -0.3, marginBottom: 6},
  subtitle: {fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20},

  cards: {gap: 14, marginBottom: 20},
  card: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
  },
  cardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceContainer,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  cardTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActive: {backgroundColor: Colors.primaryContainer},
  cardIcon: {fontSize: 20, color: Colors.onSurfaceVariant},
  cardIconActive: {color: Colors.primary},
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
  },
  badgeActive: {backgroundColor: Colors.primaryContainer, borderColor: Colors.primary},
  badgeText: {fontSize: 9, letterSpacing: 1.5, color: Colors.onSurfaceVariant, fontWeight: '700'},
  badgeTextActive: {color: Colors.primary},
  roleName: {fontSize: 17, fontWeight: '700', color: Colors.onSurface, marginBottom: 3},
  roleNameActive: {color: Colors.primary},
  roleSubtitle: {fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '500', marginBottom: 6},
  roleDesc: {fontSize: 12, color: Colors.outline, lineHeight: 18},
  radio: {
    position: 'absolute',
    bottom: 18,
    right: 18,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {borderColor: Colors.primary},
  radioDot: {width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary},
  disclaimer: {
    fontSize: 11,
    color: Colors.outline,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});
