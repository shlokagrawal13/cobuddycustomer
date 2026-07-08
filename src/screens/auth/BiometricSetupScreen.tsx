import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {AppHeader, PrimaryButton, SecondaryButton, BottomActionBar} from '../../components/ui';
import {useAuthStore} from '../../store/authStore';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'BiometricSetup'>;

export default function BiometricSetupScreen({navigation}: Props) {
  const [loading, setLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const {setBiometricEnabled} = useAuthStore();

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1.1, duration: 1000, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 1,   duration: 1000, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  const handleEnable = () => {
    setLoading(true);
    setTimeout(() => {
      setBiometricEnabled(true);
      setLoading(false);
      navigation.navigate('PINSetup');
    }, 1200);
  };

  const handleSkip = () => {
    setBiometricEnabled(false);
    navigation.navigate('PINSetup');
  };

  const FEATURES = [
    {icon: '⚡', text: 'Instant access — no typing required'},
    {icon: '🛡', text: 'Biometric data never leaves your device'},
    {icon: '🔄', text: 'Falls back to PIN if unavailable'},
  ];

  const featureIconName = (icon: string): string => {
    if (icon === '⚡') {return 'bolt';}
    if (icon === '🛡') {return 'security';}
    if (icon === '🔄') {return 'sync';}
    return 'check';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader title="Security Setup" showBack />

      <View style={styles.body}>
        {/* Illustration */}
        <View style={styles.illustrationWrap}>
          <Animated.View style={[styles.outerRing, {transform: [{scale: pulseAnim}]}]} />
          <View style={styles.middleRing} />
          <View style={styles.innerCircle}>
            <Text style={styles.bioIcon}>⬡</Text>
          </View>
        </View>

        {/* Copy */}
        <Text style={styles.overline}>STEP 2 OF 3</Text>
        <Text style={styles.title}>Enable Biometric{'\n'}Authentication</Text>
        <Text style={styles.subtitle}>
          Use Face ID or Fingerprint to access your account instantly and securely.
        </Text>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map(f => (
            <View key={f.icon} style={styles.featureRow}>
              <View style={styles.featureIconWrap}>
                <Icon name={featureIconName(f.icon)} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.featureText}>{f.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <BottomActionBar>
        <PrimaryButton label="Enable Biometric" onPress={handleEnable} loading={loading} />
        <SecondaryButton label="Skip for Now" onPress={handleSkip} variant="ghost" />
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  body: {flex: 1, paddingHorizontal: 20, paddingTop: 16},
  illustrationWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 28,
  },
  outerRing: {
    position: 'absolute',
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.15)',
  },
  middleRing: {
    position: 'absolute',
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.08)',
  },
  innerCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(242,202,80,0.25)',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  bioIcon: {fontSize: 46, color: Colors.primary},
  overline: {fontSize: 10, letterSpacing: 3, color: Colors.primary, fontWeight: '600', marginBottom: 8},
  title: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.onSurface, letterSpacing: -0.4, lineHeight: 36, marginBottom: 10},
  subtitle: {fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 21, marginBottom: 28},
  features: {gap: 16},
  featureRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIcon: {fontSize: 16},
  featureText: {flex: 1, fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20},
});
