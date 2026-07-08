import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {AppHeader, OTPInput, PrimaryButton, BottomActionBar} from '../../components/ui';
import {useAuthStore} from '../../store/authStore';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;
const OTP_EXPIRY = 60;

export default function OTPVerificationScreen({navigation, route}: Props) {
  const {phone} = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(OTP_EXPIRY);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const {setAuthenticated} = useAuthStore();

  // Countdown
  useEffect(() => {
    if (countdown <= 0) {return;}
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  // Auto-verify
  useEffect(() => {
    if (otp.length === 6) {handleVerify();}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue: 10,  duration: 60, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -10, duration: 60, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 6,   duration: 60, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0,   duration: 60, useNativeDriver: true}),
    ]).start();
  };

  const handleVerify = () => {
    if (otp.length < 6) {return;}
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      // Mock: any 6 digits pass in dev
      setAuthenticated('mock-token-123', 'usr_001', 'customer');
      navigation.navigate('BiometricSetup');
    }, 900);
  };

  const handleResend = () => {
    setResending(true);
    setOtp('');
    setError('');
    setTimeout(() => {
      setResending(false);
      setCountdown(OTP_EXPIRY);
    }, 1200);
  };

  const maskedPhone = phone.length > 5
    ? `${'•'.repeat(Math.max(0, phone.length - 4))}${phone.slice(-4)}`
    : phone;

  const timerStr = `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader title="Verify Identity" showBack />

      <View style={styles.body}>
        <View style={styles.topCopy}>
          <Text style={styles.overline}>SECURE HANDSHAKE</Text>
          <Text style={styles.title}>Enter Your Code</Text>
          <Text style={styles.subtitle}>
            A 6-digit code was sent to{'\n'}
            <Text style={styles.phoneHighlight}>{maskedPhone}</Text>
          </Text>
        </View>

        {/* OTP boxes */}
        <Animated.View style={{transform: [{translateX: shakeAnim}]}}>
          <OTPInput
            value={otp}
            onChange={v => { setOtp(v); if (error) {setError('');} }}
            error={!!error}
            autoFocus
          />
        </Animated.View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Resend */}
        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <Text style={styles.timerText}>
              Resend in <Text style={styles.timerValue}>{timerStr}</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending} style={{flexDirection:'row', alignItems:'center', gap:6}}>
              <Icon name="refresh" size={16} color={Colors.primary} />
              <Text style={styles.resendBtn}>
                {resending ? 'Sending...' : 'Resend verification code'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {__DEV__ && (
          <View style={styles.devHint}>
            <Text style={styles.devText}>Dev mode: any 6-digit code works</Text>
          </View>
        )}

        <View style={styles.trustNote}>
          <View style={{flexDirection:'row', alignItems:'flex-start', gap:8}}>
            <Icon name="lock" size={14} color={Colors.onSurfaceVariant} />
            <Text style={[styles.trustText, {flex:1}]}>This code expires in 10 minutes and can only be used once.</Text>
          </View>
        </View>
      </View>

      <BottomActionBar>
        <PrimaryButton
          label="Verify Code"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length < 6}
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeRow}>
          <Text style={styles.changeText}>Change phone number</Text>
        </TouchableOpacity>
      </BottomActionBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  body: {flex: 1, paddingHorizontal: 20, paddingTop: 8},
  topCopy: {marginBottom: 36},
  overline: {fontSize: 10, letterSpacing: 3, color: Colors.primary, fontWeight: '600', marginBottom: 8},
  title: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.onSurface, letterSpacing: -0.4, marginBottom: 10},
  subtitle: {fontSize: 15, color: Colors.onSurfaceVariant, lineHeight: 22},
  phoneHighlight: {color: Colors.primary, fontWeight: '600'},
  errorText: {color: Colors.error, fontSize: 13, textAlign: 'center', marginTop: 12},
  resendRow: {alignItems: 'center', marginTop: 20, marginBottom: 28},
  timerText: {fontSize: 13, color: Colors.onSurfaceVariant},
  timerValue: {color: Colors.primary, fontWeight: '600'},
  resendBtn: {fontSize: 14, color: Colors.primary, fontWeight: '500'},
  devHint: {
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  devText: {fontSize: 11, color: Colors.primary, textAlign: 'center', fontStyle: 'italic'},
  trustNote: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
  },
  trustText: {fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  changeRow: {alignItems: 'center', paddingVertical: 6},
  changeText: {fontSize: 13, color: Colors.onSurfaceVariant, textDecorationLine: 'underline'},
});
