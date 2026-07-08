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
  Switch,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'AddPaymentMethod'>;

const BILLING_COUNTRIES = ['United Kingdom','United Arab Emirates','United States','Singapore','France','Germany','Australia','Switzerland'];

export default function AddPaymentMethodScreen({navigation}: Props) {
  const [cardHolder, setCardHolder]     = useState('');
  const [cardNumber, setCardNumber]     = useState('');
  const [expiry, setExpiry]             = useState('');
  const [cvv, setCvv]                   = useState('');
  const [billingCountry, setBilling]    = useState('United Kingdom');
  const [isDefault, setIsDefault]       = useState(false);
  const [showCountryPicker, setShowCP]  = useState(false);

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) {return digits.slice(0, 2) + '/' + digits.slice(2);}
    return digits;
  };

  const isFormValid = cardHolder.trim().length > 2 &&
    cardNumber.replace(/\s/g, '').length === 16 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  const handleSave = () => {
    if (!isFormValid) {
      Alert.alert('Incomplete Details', 'Please fill in all card details correctly before saving.');
      return;
    }
    Alert.alert(
      'Payment Method Ready',
      `Your card ending in ${cardNumber.replace(/\s/g, '').slice(-4)} has been prepared. It will be securely stored when the payment gateway (Stripe/Adyen) is connected.`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const maskedDisplay = () => {
    const raw = cardNumber.replace(/\s/g, '');
    if (raw.length <= 4) {return cardNumber;}
    return raw.slice(0, 4).replace(/./g, '*') + ' **** **** ' + raw.slice(-4).padStart(4, '*');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Payment Method</Text>
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

          {/* Card preview */}
          <View style={styles.cardPreview}>
            <View style={styles.cardPreviewTop}>
              <Icon name="credit-card" size={22} color={Colors.primary} />
              <Text style={styles.cardNetwork}>VISA / MASTERCARD</Text>
            </View>
            <Text style={styles.cardPreviewNumber}>
              {cardNumber.trim() ? maskedDisplay() : '**** **** **** ****'}
            </Text>
            <View style={styles.cardPreviewBottom}>
              <Text style={styles.cardPreviewHolder}>
                {cardHolder.trim() || 'CARDHOLDER NAME'}
              </Text>
              <Text style={styles.cardPreviewExpiry}>{expiry || 'MM/YY'}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CARD DETAILS</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.input}
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholder="Name as it appears on card"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Card Number</Text>
              <View style={styles.inputIconRow}>
                <TextInput
                  style={[styles.input, {flex: 1, paddingRight: 42}]}
                  value={cardNumber}
                  onChangeText={v => setCardNumber(formatCard(v))}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType="number-pad"
                  maxLength={19}
                />
                <View style={styles.lockIconWrap}>
                  <Icon name="lock" size={18} color={Colors.outlineVariant} />
                </View>
              </View>
            </View>

            <View style={styles.rowFields}>
              <View style={[styles.fieldBlock, {flex: 1}]}>
                <Text style={styles.fieldLabel}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  value={expiry}
                  onChangeText={v => setExpiry(formatExpiry(v))}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={[styles.fieldBlock, {flex: 1}]}>
                <Text style={styles.fieldLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  value={cvv}
                  onChangeText={v => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="CVV"
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BILLING</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Billing Country</Text>
              <TouchableOpacity
                style={styles.countrySelector}
                onPress={() => setShowCP(!showCountryPicker)}
                activeOpacity={0.8}>
                <Icon name="location-on" size={16} color={Colors.primary} />
                <Text style={styles.countrySelectorText}>{billingCountry}</Text>
                <Icon name={showCountryPicker ? 'expand-less' : 'expand-more'} size={18} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
              {showCountryPicker && (
                <View style={styles.countryPicker}>
                  {BILLING_COUNTRIES.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={styles.countryOption}
                      onPress={() => {setBilling(c); setShowCP(false);}}
                      activeOpacity={0.75}>
                      <Text style={[styles.countryOptionText, c === billingCountry && styles.countryOptionSelected]}>{c}</Text>
                      {c === billingCountry && <Icon name="check" size={15} color={Colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.defaultRow}>
              <View style={styles.defaultMeta}>
                <Text style={styles.defaultLabel}>Set as Default Payment Method</Text>
                <Text style={styles.defaultSub}>Use this card for all future bookings</Text>
              </View>
              <Switch
                value={isDefault}
                onValueChange={setIsDefault}
                trackColor={{false: Colors.outlineVariant, true: Colors.primaryContainer}}
                thumbColor={isDefault ? Colors.primary : Colors.onSurfaceVariant}
              />
            </View>
          </View>

          {/* PCI note */}
          <View style={styles.pciNote}>
            <Icon name="security" size={16} color={Colors.primary} />
            <Text style={styles.pciNoteText}>
              Card data is never stored on our servers. All payment information is tokenised and processed by our certified PCI-DSS Level 1 payment partner.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.ctaBtn, !isFormValid && styles.ctaBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.87}>
            <Icon name="lock" size={18} color={Colors.onPrimary} />
            <Text style={styles.ctaBtnText}>Save Card Securely</Text>
          </TouchableOpacity>

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
  cardPreview:     {marginHorizontal: 20, marginTop: 20, borderRadius: 16, padding: 22, backgroundColor: Colors.primaryContainer, borderWidth: 1, borderColor: Colors.primary, minHeight: 160},
  cardPreviewTop:  {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20},
  cardNetwork:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onPrimaryContainer, letterSpacing: 2},
  cardPreviewNumber: {fontFamily: 'Inter-Medium', fontSize: 18, color: Colors.onPrimaryContainer, letterSpacing: 3, marginBottom: 16},
  cardPreviewBottom: {flexDirection: 'row', justifyContent: 'space-between'},
  cardPreviewHolder: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onPrimaryContainer, letterSpacing: 1},
  cardPreviewExpiry: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onPrimaryContainer},
  section:         {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:    {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 16},
  fieldBlock:      {marginBottom: 16},
  fieldLabel:      {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6, letterSpacing: 0.3},
  input:           {backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface},
  inputIconRow:    {position: 'relative', flexDirection: 'row', alignItems: 'center'},
  lockIconWrap:    {position: 'absolute', right: 14, top: 0, bottom: 0, justifyContent: 'center'},
  rowFields:       {flexDirection: 'row', gap: 12},
  countrySelector: {flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12},
  countrySelectorText: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  countryPicker:   {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, maxHeight: 220},
  countryOption:   {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  countryOptionText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},
  countryOptionSelected: {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  defaultRow:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4},
  defaultMeta:     {flex: 1},
  defaultLabel:    {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  defaultSub:      {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2},
  pciNote:         {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 20, padding: 14, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant},
  pciNoteText:     {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 17},
  ctaBtn:          {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 24, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnDisabled:  {opacity: 0.4},
  ctaBtnText:      {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
