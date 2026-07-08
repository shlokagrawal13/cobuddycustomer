import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {useAuthStore} from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'Splash'>;
const {width} = Dimensions.get('window');

export default function SplashScreen({navigation}: Props) {
  const logoScale   = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const ringScale   = useRef(new Animated.Value(0.7)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const {isAuthenticated, isOnboarded} = useAuthStore();

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale,   {toValue: 1,    useNativeDriver: true, damping: 14, stiffness: 120}),
        Animated.timing(logoOpacity, {toValue: 1,    duration: 500, useNativeDriver: true}),
        Animated.timing(ringScale,   {toValue: 1.2,  duration: 1400, useNativeDriver: true}),
      ]),
      Animated.timing(textOpacity, {toValue: 1, duration: 450, useNativeDriver: true}),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2800);
    return () => clearTimeout(timer);
  }, [navigation, isAuthenticated, isOnboarded, logoScale, logoOpacity, ringScale, textOpacity]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <View style={styles.glow} />

      {/* Logo */}
      <Animated.View style={[styles.logoWrap, {opacity: logoOpacity, transform: [{scale: logoScale}]}]}>
        <Animated.View style={[styles.ring, {transform: [{scale: ringScale}]}]} />
        <View style={styles.logoCircle}>
          <Text style={styles.logoLetter}>C</Text>
        </View>
      </Animated.View>

      {/* Wordmark */}
      <Animated.View style={[styles.wordmark, {opacity: textOpacity}]}>
        <Text style={styles.brandName}>CoBuddy</Text>
        <Text style={styles.tagline}>SECURE  ·  CURATED  ·  TRUSTED</Text>
      </Animated.View>

      {/* Footer */}
      <Animated.View style={[styles.footer, {opacity: textOpacity}]}>
        <Text style={styles.footerText}>✦  PREMIUM COMPANION PLATFORM  ✦</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(242,202,80,0.04)',
    top: -width * 0.2,
  },
  logoWrap: {alignItems: 'center', justifyContent: 'center', marginBottom: 36},
  ring: {
    position: 'absolute',
    width: 148,
    height: 148,
    borderRadius: 74,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.18)',
  },
  logoCircle: {
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
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 14,
  },
  logoLetter: {
    fontSize: 46,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -1,
    includeFontPadding: false,
  },
  wordmark: {alignItems: 'center', gap: 10},
  brandName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 34,
    color: Colors.onSurface,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    letterSpacing: 2.5,
    textAlign: 'center',
  },
  footer: {position: 'absolute', bottom: 48},
  footerText: {
    fontSize: 9,
    color: Colors.outline,
    letterSpacing: 2,
    textAlign: 'center',
  },
});
