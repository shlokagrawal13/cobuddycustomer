import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {AppHeader, PINInput} from '../../components/ui';
import {useAuthStore} from '../../store/authStore';

type Props = NativeStackScreenProps<AuthStackParamList, 'PINSetup'>;
type Stage = 'create' | 'confirm';

export default function PINSetupScreen({navigation}: Props) {
  const [stage, setStage]         = useState<Stage>('create');
  const [pin, setPin]             = useState('');
  const [confirmPin, setConfirm]  = useState('');
  const [pinError, setPinError]   = useState(false);
  const shakeAnim                 = useRef(new Animated.Value(0)).current;
  const {setPINEnabled, setOnboarded} = useAuthStore();

  const active = stage === 'create' ? pin : confirmPin;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue: 12,  duration: 60, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -12, duration: 60, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 8,   duration: 60, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0,   duration: 60, useNativeDriver: true}),
    ]).start();
  };

  const handleDigit = (d: string) => {
    if (stage === 'create') {
      if (pin.length < 6) {setPin(p => p + d);}
    } else {
      if (confirmPin.length < 6) {setConfirm(p => p + d);}
    }
  };

  const handleDelete = () => {
    setPinError(false);
    if (stage === 'create') {setPin(p => p.slice(0, -1));}
    else {setConfirm(p => p.slice(0, -1));}
  };

  const handleSubmit = () => {
    if (stage === 'create' && pin.length === 6) {
      setStage('confirm');
    } else if (stage === 'confirm' && confirmPin.length === 6) {
      if (confirmPin === pin) {
        setPINEnabled(true);
        setOnboarded();
        navigation.navigate('LocationPermission');
      } else {
        setPinError(true);
        shake();
        setTimeout(() => { setConfirm(''); setPinError(false); }, 700);
      }
    }
  };

  // Auto-advance when full
  useEffect(() => {
    if (stage === 'create' && pin.length === 6) {
      const t = setTimeout(() => setStage('confirm'), 280);
      return () => clearTimeout(t);
    }
    if (stage === 'confirm' && confirmPin.length === 6) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, confirmPin]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader
        title="Security PIN"
        showBack
        onBack={stage === 'confirm'
          ? () => { setStage('create'); setConfirm(''); }
          : undefined}
      />

      <View style={styles.body}>
        {/* Stage pills */}
        <View style={styles.stages}>
          <View style={[styles.stagePill, styles.stagePillActive]} />
          <View style={[styles.stagePill, stage === 'confirm' && styles.stagePillActive]} />
        </View>

        <Text style={styles.overline}>STEP 3 OF 3</Text>
        <Text style={styles.title}>
          {stage === 'create' ? 'Create Your PIN' : 'Confirm Your PIN'}
        </Text>
        <Text style={styles.subtitle}>
          {stage === 'create'
            ? 'Choose a 6-digit PIN to protect your account.'
            : 'Re-enter your PIN to confirm it.'}
        </Text>

        <Animated.View style={{transform: [{translateX: shakeAnim}], alignItems: 'center', marginTop: 16}}>
          <PINInput
            value={active}
            onPress={handleDigit}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            error={pinError}
            label={stage === 'create' ? 'Create PIN' : 'Confirm PIN'}
          />
        </Animated.View>

        {pinError && (
          <Text style={styles.errorText}>PINs don't match. Try again.</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},
  body: {flex: 1, paddingHorizontal: 20, paddingTop: 8},
  stages: {flexDirection: 'row', gap: 8, marginBottom: 20},
  stagePill: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  stagePillActive: {backgroundColor: Colors.primary},
  overline: {fontSize: 10, letterSpacing: 3, color: Colors.primary, fontWeight: '600', marginBottom: 8},
  title: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.onSurface, letterSpacing: -0.3, marginBottom: 8},
  subtitle: {fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},
  errorText: {
    textAlign: 'center',
    color: Colors.error,
    fontSize: 13,
    marginTop: 12,
  },
});
