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
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SessionsStackParamList, 'SessionCancel'>;

const CANCEL_REASONS = [
  'Change of plans',
  'Conflict in schedule',
  'Personal emergency',
  'Booked by mistake',
  'Found alternative arrangements',
  'Companion concern',
  'I prefer not to say',
];

// Mock session data (replaced by real data from route params / API)
const MOCK_SESSION = {
  id:         'SES-8829',
  companion:  'Sophia R.',
  date:       'Saturday, 21 June 2026',
  time:       '20:00 BST',
  venue:      'The Grand Pavilion, Mayfair',
  duration:   '3 hours',
  totalPaid:  'GBP 508.20',
  policyHours: 24,
};

export default function SessionCancelScreen({navigation, route}: Props) {
  const sessionId = route.params.sessionId;
  const session   = MOCK_SESSION; // In production: look up by sessionId

  const [reason, setReason]    = useState('');
  const [note, setNote]        = useState('');
  const [showPicker, setShow]  = useState(false);

  const hoursUntil = 34; // Mock: production derives from session.date
  const isFullRefund   = hoursUntil >= session.policyHours;
  const refundAmount   = isFullRefund ? session.totalPaid : `GBP 0 (less than ${session.policyHours}h notice)`;
  const refundTimeline = isFullRefund ? '3–5 business days' : 'No refund applicable';

  const handleConfirmCancel = () => {
    if (!reason) {
      Alert.alert('Reason Required', 'Please select a reason for cancellation.');
      return;
    }
    Alert.alert(
      'Session Cancelled',
      `Your session on ${session.date} with ${session.companion} has been cancelled.\n\nRefund: ${refundAmount}\nTimeline: ${refundTimeline}\n\nA confirmation will be sent to your email when the cancellation API is connected.`,
      [{text: 'OK', onPress: () => { navigation.goBack(); navigation.goBack(); }}],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancel Session</Text>
        <View style={{width: 36}} />
      </View>

      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Session summary */}
          <View style={styles.sessionCard}>
            <Text style={styles.sessionCardLabel}>SESSION TO CANCEL</Text>
            {([
              {icon: 'event',        label: 'Date',      value: `${session.date} at ${session.time}`},
              {icon: 'person',       label: 'Companion', value: session.companion},
              {icon: 'location-on',  label: 'Venue',     value: session.venue},
              {icon: 'timer',        label: 'Duration',  value: session.duration},
              {icon: 'receipt-long', label: 'Total Paid',value: session.totalPaid},
            ] as const).map(row => (
              <View key={row.label} style={styles.sessionRow}>
                <Icon name={row.icon} size={15} color={Colors.primary} />
                <Text style={styles.sessionRowLabel}>{row.label}</Text>
                <Text style={styles.sessionRowValue} numberOfLines={1}>{row.value}</Text>
              </View>
            ))}
          </View>

          {/* Refund policy card */}
          <View style={[styles.policyCard, isFullRefund ? styles.policyCardGood : styles.policyCardBad]}>
            <View style={styles.policyTop}>
              <Icon name={isFullRefund ? 'check-circle' : 'warning'} size={20} color={isFullRefund ? Colors.success : Colors.warning} />
              <Text style={[styles.policyTitle, {color: isFullRefund ? Colors.success : Colors.warning}]}>
                {isFullRefund ? 'Full Refund Eligible' : 'No Refund Applicable'}
              </Text>
            </View>
            <Text style={styles.policyDesc}>
              {isFullRefund
                ? `You are cancelling more than ${session.policyHours} hours before the session. A full refund of ${session.totalPaid} will be processed.`
                : `Cancellations within ${session.policyHours} hours of the session are non-refundable per CoBuddy's cancellation policy.`}
            </Text>
            <View style={styles.policyRows}>
              <View style={styles.policyRow}>
                <Text style={styles.policyRowLabel}>Refund Amount</Text>
                <Text style={styles.policyRowValue}>{refundAmount}</Text>
              </View>
              <View style={styles.policyRow}>
                <Text style={styles.policyRowLabel}>Processing Time</Text>
                <Text style={styles.policyRowValue}>{refundTimeline}</Text>
              </View>
            </View>
          </View>

          {/* Reason selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REASON FOR CANCELLATION</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShow(!showPicker)} activeOpacity={0.8}>
              <Text style={reason ? styles.selectorSet : styles.selectorEmpty}>{reason || 'Select a reason'}</Text>
              <Icon name={showPicker ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
            {showPicker && (
              <View style={styles.pickerList}>
                {CANCEL_REASONS.map(r => (
                  <TouchableOpacity key={r} style={styles.pickerOption} onPress={() => {setReason(r); setShow(false);}} activeOpacity={0.75}>
                    <Text style={[styles.pickerText, r === reason && styles.pickerTextActive]}>{r}</Text>
                    {r === reason && <Icon name="check" size={15} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Optional note */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADDITIONAL NOTE (OPTIONAL)</Text>
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              placeholder="Any additional context for your concierge..."
              placeholderTextColor={Colors.outlineVariant}
              multiline
              numberOfLines={3}
              maxLength={300}
            />
            <Text style={styles.charCount}>{note.length}/300</Text>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.cancelBtn, !reason && styles.cancelBtnDisabled]}
            onPress={handleConfirmCancel}
            activeOpacity={0.87}>
            <Icon name="cancel" size={18} color={reason ? Colors.onError : Colors.outlineVariant} />
            <Text style={[styles.cancelBtnText, !reason && styles.cancelBtnTextDisabled]}>
              Confirm Cancellation
            </Text>
          </TouchableOpacity>

          <Text style={styles.footNote}>
            Cancelling a session cannot be undone. For emergency changes, contact your concierge directly through the messaging tab.
          </Text>

          <View style={{height: 32}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        {flex: 1, backgroundColor: Colors.surface},
  header:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:          {padding: 4},
  headerTitle:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.error},
  scroll:           {flex: 1},
  scrollContent:    {paddingBottom: 24},
  sessionCard:      {marginHorizontal: 20, marginTop: 20, padding: 16, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant},
  sessionCardLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  sessionRow:       {flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  sessionRowLabel:  {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, width: 78},
  sessionRowValue:  {flex: 1, fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurface},
  policyCard:       {marginHorizontal: 20, marginTop: 16, padding: 16, borderRadius: 14, borderWidth: 1.5},
  policyCardGood:   {backgroundColor: 'rgba(109,217,140,0.08)', borderColor: Colors.success},
  policyCardBad:    {backgroundColor: Colors.errorContainer, borderColor: Colors.error},
  policyTop:        {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8},
  policyTitle:      {fontFamily: 'Inter-SemiBold', fontSize: 14},
  policyDesc:       {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18, marginBottom: 12},
  policyRows:       {gap: 6},
  policyRow:        {flexDirection: 'row', justifyContent: 'space-between'},
  policyRowLabel:   {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  policyRowValue:   {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onSurface},
  section:          {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 12},
  selector:         {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 13},
  selectorSet:      {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, flex: 1},
  selectorEmpty:    {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.outlineVariant, flex: 1},
  pickerList:       {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden'},
  pickerOption:     {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  pickerText:       {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface, flex: 1},
  pickerTextActive: {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  noteInput:        {backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface, textAlignVertical: 'top', minHeight: 80},
  charCount:        {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.outlineVariant, textAlign: 'right', marginTop: 4},
  cancelBtn:        {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 28, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.error},
  cancelBtnDisabled:{backgroundColor: Colors.surfaceContainerHigh},
  cancelBtnText:    {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onError, letterSpacing: 0.3},
  cancelBtnTextDisabled: {color: Colors.outlineVariant},
  footNote:         {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.outlineVariant, textAlign: 'center', paddingHorizontal: 24, marginTop: 16, lineHeight: 17},
});
