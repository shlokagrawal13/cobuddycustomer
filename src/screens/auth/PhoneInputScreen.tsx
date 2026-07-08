import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {AppHeader, PrimaryButton, BottomActionBar} from '../../components/ui';
import {useAuthStore} from '../../store/authStore';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneInput'>;

const COUNTRY_CODES = [
  {flag: '🇮🇳', code: '+91', country: 'India'},
  {flag: '🇺🇸', code: '+1', country: 'United States'},
  {flag: '🇬🇧', code: '+44', country: 'United Kingdom'},
  {flag: '🇦🇪', code: '+971', country: 'UAE'},
  {flag: '🇫🇷', code: '+33', country: 'France'},
  {flag: '🇸🇬', code: '+65', country: 'Singapore'},
  {flag: '🇦🇺', code: '+61', country: 'Australia'},
];

export default function PhoneInputScreen({navigation}: Props) {
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pickerVisible, setPickerVisible] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const {setPhone: storeSetPhone} = useAuthStore();

  const isValid = phone.replace(/\D/g, '').length >= 7;

  const handleChangePhone = (text: string) => {
    const digits = text.replace(/\D/g, '');
    setPhone(digits);
    if (error) {setError('');}
  };

  const handleSendOTP = () => {
    if (!isValid) {
      setError('Please enter a valid phone number.');
      return;
    }
    setError('');
    setLoading(true);
    const full = `${countryCode.code}${phone}`;
    storeSetPhone(full);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTPVerification', {phone: full});
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <AppHeader title="Secure Access" showBack />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.topCopy}>
            <Text style={styles.overline}>IDENTITY VERIFICATION</Text>
            <Text style={styles.title}>Enter Your{'\n'}Phone Number</Text>
            <Text style={styles.subtitle}>
              We'll send a one-time code to verify your identity securely.
            </Text>
          </View>

          {/* Label */}
          <Text style={styles.fieldLabel}>MOBILE NUMBER</Text>

          {/* Phone field — single row with real TextInput */}
          <TouchableOpacity
            activeOpacity={1}
            style={[styles.fieldRow, error ? styles.fieldRowError : null]}
            onPress={() => inputRef.current?.focus()}>
            {/* Country code button */}
            <TouchableOpacity
              style={styles.codeBtn}
              onPress={() => setPickerVisible(true)}
              activeOpacity={0.7}>
              <Text style={styles.codeFlag}>{countryCode.flag}</Text>
              <Text style={styles.codeText}>{countryCode.code}</Text>
              <Icon name="expand-more" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>

            <View style={styles.fieldDivider} />

            {/* Real TextInput */}
            <TextInput
              ref={inputRef}
              style={styles.phoneInput}
              value={phone}
              onChangeText={handleChangePhone}
              placeholder="000 000 0000"
              placeholderTextColor={Colors.outlineVariant}
              keyboardType="phone-pad"
              maxLength={15}
              returnKeyType="done"
              onSubmitEditing={handleSendOTP}
              autoFocus={false}
            />
          </TouchableOpacity>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Trust note */}
          <View style={styles.trustNote}>
            <Icon name="lock" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.trustText}>
              Your number is encrypted and never shared with third parties.
            </Text>
          </View>
        </ScrollView>

        <BottomActionBar>
          <PrimaryButton
            label="Send Verification Code"
            onPress={handleSendOTP}
            loading={loading}
            disabled={!isValid}
          />
        </BottomActionBar>
      </SafeAreaView>

      {/* Country picker modal */}
      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setPickerVisible(false)}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <Text style={styles.pickerTitle}>Select Country</Text>
            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={item => item.code}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.pickerItem,
                    item.code === countryCode.code && styles.pickerItemActive,
                  ]}
                  onPress={() => {
                    setCountryCode(item);
                    setPickerVisible(false);
                  }}>
                  <Text style={styles.pickerFlag}>{item.flag}</Text>
                  <Text style={styles.pickerCountry}>{item.country}</Text>
                  <Text style={styles.pickerCode}>{item.code}</Text>
                  {item.code === countryCode.code && (
                  <Icon name="check" size={16} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: Colors.surface},
  container: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24},

  topCopy: {marginBottom: 32},
  overline: {
    fontSize: 10,
    letterSpacing: 3,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: Colors.onSurface,
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 10,
  },
  subtitle: {fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 21},

  fieldLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 10,
  },

  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.outlineVariant,
    marginBottom: 8,
    overflow: 'hidden',
  },
  fieldRowError: {borderColor: Colors.error},

  codeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 6,
    height: '100%',
  },
  codeFlag: {fontSize: 20},
  codeText: {fontSize: 15, color: Colors.onSurface, fontWeight: '600'},
  chevron: {fontSize: 10, color: Colors.onSurfaceVariant},

  fieldDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.outlineVariant,
    marginHorizontal: 4,
  },

  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 14,
    fontSize: 18,
    color: Colors.onSurface,
    fontWeight: '400',
    letterSpacing: 1,
  },

  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginBottom: 12,
    marginLeft: 4,
  },

  trustNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  trustIcon: {fontSize: 14, marginTop: 1},
  trustText: {flex: 1, fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},

  // Modal picker
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    paddingTop: 12,
    maxHeight: '60%',
  },
  pickerHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: 16,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  pickerItemActive: {backgroundColor: 'rgba(242,202,80,0.08)'},
  pickerFlag: {fontSize: 22},
  pickerCountry: {flex: 1, fontSize: 15, color: Colors.onSurface, fontWeight: '500'},
  pickerCode: {fontSize: 14, color: Colors.onSurfaceVariant},
  pickerCheck: {fontSize: 14, color: Colors.primary, fontWeight: '700'},
});
