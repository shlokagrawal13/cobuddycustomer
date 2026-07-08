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
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SessionsStackParamList, 'ModifyBooking'>;

// Mock — production replaces with real API data
const MOCK_SESSION = {
  id:        'SES-8829',
  companion: 'Sophia R.',
  currentDate: 'Saturday, 21 June 2026',
  currentTime: '20:00 BST',
  venue:     'The Grand Pavilion, Mayfair',
  duration:  '3 hours',
  totalPaid: 'GBP 508.20',
};

const ALT_DATES = [
  {id: 'd1', label: 'Fri 27 Jun',  available: true},
  {id: 'd2', label: 'Sat 28 Jun',  available: true},
  {id: 'd3', label: 'Sun 29 Jun',  available: false},
  {id: 'd4', label: 'Mon 30 Jun',  available: true},
  {id: 'd5', label: 'Tue 1 Jul',   available: true},
  {id: 'd6', label: 'Wed 2 Jul',   available: false},
];

const ALT_TIMES: Record<string, string[]> = {
  d1: ['18:00', '19:00', '20:00', '21:00'],
  d2: ['17:00', '18:30', '20:00'],
  d4: ['19:00', '20:00', '21:00'],
  d5: ['18:00', '19:30', '21:00'],
};

const DURATION_OPTIONS = ['2 hours', '3 hours', '4 hours', '5 hours'];

export default function ModifyBookingScreen({navigation, route}: Props) {
  const sessionId   = route.params.sessionId;
  const session     = MOCK_SESSION; // In production: look up by sessionId
  void sessionId;

  const [selectedDate, setDate]     = useState('');
  const [selectedTime, setTime]     = useState('');
  const [selectedDuration, setDur]  = useState(session.duration);
  const [showDurPicker, setDurP]    = useState(false);

  const availableTimes = selectedDate ? (ALT_TIMES[selectedDate] ?? []) : [];

  // Calculate price delta for duration change
  const durationHours = parseInt(selectedDuration, 10);
  const originalHours = 3;
  const hourlyRate    = 169.4; // mock GBP per hour
  const delta         = (durationHours - originalHours) * hourlyRate;
  const deltaStr      = delta === 0 ? 'No change' : delta > 0 ? `+GBP ${delta.toFixed(2)}` : `-GBP ${Math.abs(delta).toFixed(2)}`;

  const isReady = selectedDate && selectedTime;

  const handleSubmit = () => {
    if (!isReady) {
      Alert.alert('Incomplete', 'Please select an alternate date and time slot.');
      return;
    }
    const chosenDateLabel = ALT_DATES.find(d => d.id === selectedDate)?.label ?? selectedDate;
    Alert.alert(
      'Modification Requested',
      `Your request to reschedule to ${chosenDateLabel} at ${selectedTime} (${selectedDuration}) has been submitted.\n\nYour concierge will confirm availability within 24 hours. This feature will process automatically when the booking modification API is connected.`,
      [{text: 'OK', onPress: () => { navigation.goBack(); }}],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modify Booking</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Current booking summary */}
        <View style={styles.currentCard}>
          <View style={styles.currentCardTop}>
            <Icon name="event" size={16} color={Colors.primary} />
            <Text style={styles.currentCardLabel}>CURRENT BOOKING</Text>
          </View>
          <Text style={styles.currentDate}>{session.currentDate} at {session.currentTime}</Text>
          <Text style={styles.currentMeta}>{session.companion}  •  {session.venue}</Text>
          <Text style={styles.currentMeta}>{session.duration}  •  {session.totalPaid}</Text>
        </View>

        {/* Companion note */}
        <View style={styles.availNote}>
          <Icon name="info" size={15} color={Colors.primary} />
          <Text style={styles.availNoteText}>
            Changes are subject to companion availability. Dates marked unavailable are already booked for {session.companion}.
          </Text>
        </View>

        {/* Date chips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT NEW DATE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateChips}>
            {ALT_DATES.map(d => {
              const active   = d.id === selectedDate;
              const disabled = !d.available;
              return (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.dateChip, active && styles.dateChipActive, disabled && styles.dateChipDisabled]}
                  onPress={() => {if (!disabled) {setDate(d.id); setTime('');} }}
                  activeOpacity={disabled ? 1 : 0.8}>
                  <Text style={[styles.dateChipText, active && styles.dateChipTextActive, disabled && styles.dateChipTextDisabled]}>{d.label}</Text>
                  {disabled && <Text style={styles.dateChipUnavail}>Unavail.</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time slots */}
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT TIME SLOT</Text>
            {availableTimes.length === 0
              ? <Text style={styles.noSlots}>No time slots available for this date.</Text>
              : (
                <View style={styles.timeGrid}>
                  {availableTimes.map(t => {
                    const active = t === selectedTime;
                    return (
                      <TouchableOpacity
                        key={t}
                        style={[styles.timeChip, active && styles.timeChipActive]}
                        onPress={() => setTime(t)}
                        activeOpacity={0.8}>
                        <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>{t}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
          </View>
        )}

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SESSION DURATION</Text>
          <TouchableOpacity style={styles.selector} onPress={() => setDurP(!showDurPicker)} activeOpacity={0.8}>
            <Text style={styles.selectorSet}>{selectedDuration}</Text>
            <Icon name={showDurPicker ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
          {showDurPicker && (
            <View style={styles.pickerList}>
              {DURATION_OPTIONS.map(d => (
                <TouchableOpacity key={d} style={styles.pickerOption} onPress={() => {setDur(d); setDurP(false);}} activeOpacity={0.75}>
                  <Text style={[styles.pickerText, d === selectedDuration && styles.pickerTextActive]}>{d}</Text>
                  {d === selectedDuration && <Icon name="check" size={15} color={Colors.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Price delta card */}
        <View style={styles.deltaCard}>
          <Text style={styles.deltaCardTitle}>PRICE DIFFERENCE</Text>
          <View style={styles.deltaRow}>
            <Text style={styles.deltaLabel}>Original booking</Text>
            <Text style={styles.deltaValue}>{session.totalPaid}</Text>
          </View>
          <View style={styles.deltaRow}>
            <Text style={styles.deltaLabel}>Duration adjustment</Text>
            <Text style={[styles.deltaValue, delta > 0 && {color: Colors.error}, delta < 0 && {color: Colors.success}]}>{deltaStr}</Text>
          </View>
          <View style={[styles.deltaRow, styles.deltaTotalRow]}>
            <Text style={styles.deltaTotalLabel}>Estimated New Total</Text>
            <Text style={styles.deltaTotalValue}>
              GBP {(508.20 + delta).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.deltaNoteText}>Final pricing confirmed by concierge on modification approval.</Text>
        </View>

        <TouchableOpacity
          style={[styles.ctaBtn, !isReady && styles.ctaBtnDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.87}>
          <Icon name="event-available" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Submit Modification Request</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:         {flex: 1, backgroundColor: Colors.surface},
  header:            {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:           {padding: 4},
  headerTitle:       {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:            {flex: 1},
  scrollContent:     {paddingBottom: 24},
  currentCard:       {marginHorizontal: 20, marginTop: 20, padding: 16, backgroundColor: Colors.primaryContainer, borderRadius: 14, borderWidth: 1, borderColor: Colors.primary},
  currentCardTop:    {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10},
  currentCardLabel:  {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onPrimaryContainer, letterSpacing: 1.4},
  currentDate:       {fontFamily: 'Playfair-SemiBold', fontSize: 15, color: Colors.onPrimaryContainer, marginBottom: 4},
  currentMeta:       {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onPrimaryContainer, marginBottom: 2},
  availNote:         {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 14, padding: 12, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10},
  availNoteText:     {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  section:           {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:      {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  dateChips:         {gap: 8, paddingRight: 20},
  dateChip:          {paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow, alignItems: 'center'},
  dateChipActive:    {borderColor: Colors.primary, backgroundColor: Colors.primary},
  dateChipDisabled:  {opacity: 0.4},
  dateChipText:      {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onSurface},
  dateChipTextActive:{color: Colors.onPrimary},
  dateChipTextDisabled: {color: Colors.outlineVariant},
  dateChipUnavail:   {fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.outlineVariant, marginTop: 2},
  timeGrid:          {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  timeChip:          {paddingHorizontal: 18, paddingVertical: 12, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  timeChipActive:    {borderColor: Colors.primary, backgroundColor: Colors.primary},
  timeChipText:      {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  timeChipTextActive:{color: Colors.onPrimary},
  noSlots:           {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.outlineVariant},
  selector:          {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 13},
  selectorSet:       {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, flex: 1},
  pickerList:        {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden'},
  pickerOption:      {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  pickerText:        {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface, flex: 1},
  pickerTextActive:  {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  deltaCard:         {marginHorizontal: 20, marginTop: 24, padding: 16, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant},
  deltaCardTitle:    {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 12},
  deltaRow:          {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
  deltaLabel:        {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  deltaValue:        {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  deltaTotalRow:     {borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingTop: 10, marginBottom: 8},
  deltaTotalLabel:   {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  deltaTotalValue:   {fontFamily: 'Playfair-SemiBold', fontSize: 16, color: Colors.primary},
  deltaNoteText:     {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.outlineVariant},
  ctaBtn:            {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 24, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnDisabled:    {opacity: 0.4},
  ctaBtnText:        {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
