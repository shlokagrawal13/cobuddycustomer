import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ChangePhone'>;

const COUNTRY_CODES = [
  {flag: 'GB', code: '+44', label: 'United Kingdom'},
  {flag: 'AE', code: '+971', label: 'UAE'},
  {flag: 'US', code: '+1',  label: 'United States'},
  {flag: 'SG', code: '+65', label: 'Singapore'},
  {flag: 'FR', code: '+33', label: 'France'},
  {flag: 'DE', code: '+49', label: 'Germany'},
  {flag: 'IN', code: '+91', label: 'India'},
  {flag: 'AU', code: '+61', label: 'Australia'},
];

export default function ChangePhoneScreen({navigation}: Props) {
  const [selectedCode, setSelectedCode] = useState(COUNTRY_CODES[0]);
  const [newPhone, setNewPhone]         = useState('');
  const [showPicker, setShowPicker]     = useState(false);
  const [step, setStep]                 = useState<'entry' | 'confirm'>('entry');

  const handleContinue = () => {
    if (newPhone.trim().length < 7) {
      Alert.alert('Invalid Number', 'Please enter a valid phone number.');
      return;
    }
    setStep('confirm');
  };

  const handleSendOTP = () => {
    Alert.alert(
      'OTP Verification',
      `An OTP will be sent to ${selectedCode.code} ${newPhone} when the SMS gateway is connected. Your existing verified number remains active until confirmation.`,
      [{text: 'Understood', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => {if (step === 'confirm') {setStep('entry');} else {navigation.goBack();}}} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Phone Number</Text>
        <View style={{width: 36}} />
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Current number */}
          <View style={styles.currentCard}>
            <Icon name="verified" size={18} color={Colors.success} />
            <View style={styles.currentMeta}>
              <Text style={styles.currentLabel}>Current Verified Number</Text>
              <Text style={styles.currentNumber}>+44 •••• ••• 821</Text>
            </View>
            <Icon name="check-circle" size={18} color={Colors.success} />
          </View>

          {step === 'entry' ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>NEW PHONE NUMBER</Text>
                <Text style={styles.sectionSub}>
                  Enter your new number. You will receive an OTP to verify ownership before the change takes effect.
                </Text>

                {/* Country code selector */}
                <Text style={styles.fieldLabel}>Country Code</Text>
                <TouchableOpacity
                  style={styles.codeSelector}
                  onPress={() => setShowPicker(!showPicker)}
                  activeOpacity={0.8}>
                  <Text style={styles.codeSelectorText}>{selectedCode.code}  {selectedCode.label}</Text>
                  <Icon name={showPicker ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>

                {showPicker && (
                  <View style={styles.codePicker}>
                    {COUNTRY_CODES.map(c => (
                      <TouchableOpacity
                        key={c.code + c.label}
                        style={styles.codeOption}
                        onPress={() => {setSelectedCode(c); setShowPicker(false);}}
                        activeOpacity={0.75}>
                        <Text style={styles.codeOptionCode}>{c.code}</Text>
                        <Text style={styles.codeOptionLabel}>{c.label}</Text>
                        {c.code === selectedCode.code && c.label === selectedCode.label && (
                          <Icon name="check" size={16} color={Colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <Text style={[styles.fieldLabel, {marginTop: 16}]}>Phone Number</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.codeTag}>
                    <Text style={styles.codeTagText}>{selectedCode.code}</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    value={newPhone}
                    onChangeText={setNewPhone}
                    placeholder="000 000 0000"
                    placeholderTextColor={Colors.outlineVariant}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
              </View>

              <View style={styles.securityNote}>
                <Icon name="shield" size={16} color={Colors.primary} />
                <Text style={styles.securityNoteText}>
                  For your security, changing your phone number requires OTP verification. Your existing number remains active during this process.
                </Text>
              </View>

              <TouchableOpacity style={styles.ctaBtn} onPress={handleContinue} activeOpacity={0.87}>
                <Text style={styles.ctaBtnText}>Continue</Text>
                <Icon name="arrow-forward" size={18} color={Colors.onPrimary} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>CONFIRM YOUR REQUEST</Text>

                <View style={styles.confirmCard}>
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>New Number</Text>
                    <Text style={styles.confirmValue}>{selectedCode.code} {newPhone}</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>Verification Method</Text>
                    <Text style={styles.confirmValue}>SMS OTP</Text>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.confirmRow}>
                    <Text style={styles.confirmLabel}>Takes Effect</Text>
                    <Text style={styles.confirmValue}>After OTP confirmed</Text>
                  </View>
                </View>

                <View style={styles.otpNote}>
                  <Icon name="message" size={16} color={Colors.primary} />
                  <Text style={styles.otpNoteText}>
                    A 6-digit OTP will be sent to {selectedCode.code} {newPhone}. This will expire in 5 minutes.
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.ctaBtn} onPress={handleSendOTP} activeOpacity={0.87}>
                <Icon name="send" size={18} color={Colors.onPrimary} />
                <Text style={styles.ctaBtnText}>Send Verification Code</Text>
              </TouchableOpacity>
            </>
          )}

          <View style={{height: 32}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       {flex: 1, backgroundColor: Colors.surface},
  header:          {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:         {padding: 4},
  headerTitle:     {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:          {flex: 1},
  scrollContent:   {paddingBottom: 24},
  currentCard:     {flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 20, marginTop: 20, padding: 16, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant},
  currentMeta:     {flex: 1},
  currentLabel:    {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 2},
  currentNumber:   {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  section:         {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:    {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 8},
  sectionSub:      {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20, marginBottom: 20},
  fieldLabel:      {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6, letterSpacing: 0.3},
  codeSelector:    {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12},
  codeSelectorText:{fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  codePicker:      {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden'},
  codeOption:      {flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  codeOptionCode:  {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary, width: 40},
  codeOptionLabel: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},
  phoneInputRow:   {flexDirection: 'row', alignItems: 'center', gap: 8},
  codeTag:         {paddingHorizontal: 12, paddingVertical: 13, backgroundColor: Colors.primaryContainer, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary},
  codeTagText:     {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.primary},
  phoneInput:      {flex: 1, backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface},
  securityNote:    {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 20, padding: 14, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant},
  securityNoteText:{flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  confirmCard:     {backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden', marginTop: 16},
  confirmRow:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14},
  confirmLabel:    {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  confirmValue:    {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  divider:         {height: 1, backgroundColor: Colors.outlineVariant},
  otpNote:         {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginTop: 16, padding: 14, backgroundColor: Colors.primaryContainer, borderRadius: 10, borderWidth: 1, borderColor: Colors.primary},
  otpNoteText:     {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onPrimaryContainer, lineHeight: 18},
  ctaBtn:          {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 28, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnText:      {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
