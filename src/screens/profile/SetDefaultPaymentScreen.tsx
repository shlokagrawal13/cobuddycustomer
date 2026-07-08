import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SetDefaultPayment'>;

const PAYMENT_METHODS = [
  {id: 'pm_visa',   icon: 'credit-card',            title: 'Visa ending in 4242',          sub: 'Expires 12/25',        type: 'card'},
  {id: 'pm_mc',     icon: 'credit-card',            title: 'Mastercard ending in 5531',    sub: 'Expires 08/26',        type: 'card'},
  {id: 'pm_upi',    icon: 'qr-code-scanner',        title: 'UPI / GPay',                   sub: 'GPay, PhonePe',        type: 'upi'},
  {id: 'pm_wallet', icon: 'account-balance-wallet', title: 'CoBuddy Wallet',               sub: 'Balance: GBP 2,400',  type: 'wallet'},
] as const;

type MethodId = typeof PAYMENT_METHODS[number]['id'];

export default function SetDefaultPaymentScreen({navigation, route}: Props) {
  // Pre-select if a methodId was passed, otherwise default to first
  const initial = (route.params?.methodId as MethodId | undefined) ?? 'pm_visa';
  const [selectedId, setSelectedId] = useState<MethodId>(
    PAYMENT_METHODS.find(m => m.id === initial) ? initial : 'pm_visa',
  );

  const selected = PAYMENT_METHODS.find(m => m.id === selectedId)!;

  const handleSave = () => {
    Alert.alert(
      'Default Updated',
      `"${selected.title}" is now your default payment method. Future bookings will be charged to this method when the payment gateway is connected.`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Default Payment</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Current selection preview */}
        <View style={styles.previewCard}>
          <View style={styles.previewIconWrap}>
            <Icon name={selected.icon} size={28} color={Colors.primary} />
          </View>
          <View style={styles.previewMeta}>
            <Text style={styles.previewLabel}>Selected Default</Text>
            <Text style={styles.previewTitle}>{selected.title}</Text>
            <Text style={styles.previewSub}>{selected.sub}</Text>
          </View>
          <View style={styles.defaultIndicator}>
            <Icon name="star" size={14} color={Colors.primary} />
            <Text style={styles.defaultIndicatorText}>Default</Text>
          </View>
        </View>

        {/* Method list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHOOSE DEFAULT METHOD</Text>

          {PAYMENT_METHODS.map(method => {
            const isActive = method.id === selectedId;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodRow, isActive && styles.methodRowActive]}
                onPress={() => setSelectedId(method.id)}
                activeOpacity={0.8}>
                <View style={[styles.methodIconWrap, isActive && styles.methodIconWrapActive]}>
                  <Icon name={method.icon} size={20} color={isActive ? Colors.onPrimary : Colors.onSurfaceVariant} />
                </View>
                <View style={styles.methodMeta}>
                  <Text style={[styles.methodTitle, isActive && styles.methodTitleActive]}>{method.title}</Text>
                  <Text style={styles.methodSub}>{method.sub}</Text>
                </View>
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  {isActive && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info rows */}
        <View style={styles.infoCard}>
          <Text style={styles.infoCardTitle}>HOW DEFAULT PAYMENT WORKS</Text>
          {[
            {icon: 'flash-on',      text: 'Pre-selected at checkout for faster booking'},
            {icon: 'lock',          text: 'Your card details are never stored directly by CoBuddy'},
            {icon: 'swap-horiz',    text: 'You can always change payment method at checkout'},
            {icon: 'notifications', text: 'You will receive a confirmation notification after each charge'},
          ].map(item => (
            <View key={item.text} style={styles.infoRow}>
              <Icon name={item.icon} size={15} color={Colors.primary} />
              <Text style={styles.infoText}>{item.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.trustNote}>
          <Icon name="verified-user" size={15} color={Colors.primary} />
          <Text style={styles.trustNoteText}>
            All payment methods are secured with 256-bit encryption and processed by our PCI-DSS Level 1 certified payment partner.
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleSave} activeOpacity={0.87}>
          <Icon name="star" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Save as Default</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:            {flex: 1, backgroundColor: Colors.surface},
  header:               {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:              {padding: 4},
  headerTitle:          {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:               {flex: 1},
  scrollContent:        {paddingBottom: 24},
  previewCard:          {flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 20, marginTop: 20, padding: 18, backgroundColor: Colors.primaryContainer, borderRadius: 16, borderWidth: 1.5, borderColor: Colors.primary},
  previewIconWrap:      {width: 52, height: 52, borderRadius: 14, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center'},
  previewMeta:          {flex: 1},
  previewLabel:         {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onPrimaryContainer, letterSpacing: 0.8, marginBottom: 3},
  previewTitle:         {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimaryContainer},
  previewSub:           {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onPrimaryContainer, marginTop: 2},
  defaultIndicator:     {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, backgroundColor: Colors.primary},
  defaultIndicatorText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onPrimary},
  section:              {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:         {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  methodRow:            {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14, paddingHorizontal: 16, marginBottom: 8, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  methodRowActive:      {borderColor: Colors.primary, backgroundColor: Colors.primaryContainer},
  methodIconWrap:       {width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center'},
  methodIconWrapActive: {backgroundColor: Colors.primary},
  methodMeta:           {flex: 1},
  methodTitle:          {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  methodTitleActive:    {color: Colors.onPrimaryContainer},
  methodSub:            {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  radio:                {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center'},
  radioActive:          {borderColor: Colors.primary},
  radioDot:             {width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary},
  infoCard:             {marginHorizontal: 20, marginTop: 24, padding: 16, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant},
  infoCardTitle:        {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 12},
  infoRow:              {flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  infoText:             {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  trustNote:            {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 16, padding: 13, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10},
  trustNoteText:        {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 17},
  ctaBtn:               {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnText:           {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
