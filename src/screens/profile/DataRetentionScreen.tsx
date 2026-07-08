import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'DataRetention'>;

type Period = '6m' | '1y' | '2y' | '5y' | 'forever';

interface PeriodOption {
  id: Period;
  label: string;
  sub: string;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  {id: '6m',     label: '6 Months',    sub: 'Older data is automatically anonymised'},
  {id: '1y',     label: '1 Year',      sub: 'Recommended for most members'},
  {id: '2y',     label: '2 Years',     sub: 'Suitable for frequent travellers with rich history'},
  {id: '5y',     label: '5 Years',     sub: 'Full history preserved for premium members'},
  {id: 'forever',label: 'Keep Forever',sub: 'Data retained until account deletion'},
];

interface RetentionCategory {
  id: string;
  icon: string;
  label: string;
  sub: string;
  autoDelete: boolean;
  protectable: boolean;
}

export default function DataRetentionScreen({navigation}: Props) {
  const [selectedPeriod, setPeriod] = useState<Period>('2y');
  const [categories, setCategories] = useState<RetentionCategory[]>([
    {id: 'sessions',     icon: 'event-available', label: 'Session Records',         sub: 'Booking history, companion interactions',          autoDelete: false, protectable: true},
    {id: 'messages',     icon: 'chat',            label: 'Concierge Messages',       sub: 'All message threads and attachments',              autoDelete: false, protectable: true},
    {id: 'transactions', icon: 'receipt-long',    label: 'Transaction Data',         sub: 'Payment history (legal minimum: 7 years)',         autoDelete: false, protectable: false},
    {id: 'location',     icon: 'location-on',     label: 'Location History',         sub: 'Session check-in and route data',                  autoDelete: true,  protectable: true},
    {id: 'analytics',    icon: 'bar-chart',       label: 'Usage Analytics',          sub: 'Feature usage and app interaction data',           autoDelete: true,  protectable: true},
    {id: 'safety',       icon: 'shield',          label: 'Safety Logs',              sub: 'SOS events and incident reports (kept 3 years)',   autoDelete: false, protectable: false},
  ]);

  const toggleAutoDelete = (id: string) => {
    setCategories(prev => prev.map(c =>
      c.id === id && c.protectable ? {...c, autoDelete: !c.autoDelete} : c,
    ));
  };

  const handleSave = () => {
    Alert.alert(
      'Retention Settings Saved',
      `Your data retention period has been set to "${PERIOD_OPTIONS.find(p => p.id === selectedPeriod)?.label}". These preferences will take effect when the data management pipeline is connected.`,
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
        <Text style={styles.headerTitle}>Data Retention</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.infoBanner}>
          <Icon name="history" size={18} color={Colors.primary} />
          <Text style={styles.infoBannerText}>
            Choose how long CoBuddy retains your personal data. Some categories are governed by legal requirements and cannot be adjusted.
          </Text>
        </View>

        {/* Period selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GLOBAL RETENTION PERIOD</Text>
          {PERIOD_OPTIONS.map(opt => {
            const active = opt.id === selectedPeriod;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.periodRow, active && styles.periodRowActive]}
                onPress={() => setPeriod(opt.id)}
                activeOpacity={0.8}>
                <View style={styles.periodLeft}>
                  <Text style={[styles.periodLabel, active && styles.periodLabelActive]}>{opt.label}</Text>
                  <Text style={styles.periodSub}>{opt.sub}</Text>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Per-category auto-delete */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AUTO-DELETE BY CATEGORY</Text>
          <Text style={styles.sectionSub}>Enable to automatically delete specific data categories after your chosen retention period.</Text>

          {categories.map(cat => (
            <View key={cat.id} style={styles.categoryRow}>
              <View style={[styles.catIconWrap, !cat.protectable && styles.catIconLocked]}>
                <Icon name={cat.icon} size={16} color={cat.protectable ? Colors.primary : Colors.outlineVariant} />
              </View>
              <View style={styles.catMeta}>
                <View style={styles.catLabelRow}>
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  {!cat.protectable && (
                    <View style={styles.legalBadge}>
                      <Icon name="lock" size={10} color={Colors.outlineVariant} />
                      <Text style={styles.legalBadgeText}>Legal</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.catSub}>{cat.sub}</Text>
              </View>
              <Switch
                value={cat.autoDelete}
                onValueChange={() => {
                  if (!cat.protectable) {
                    Alert.alert('Protected Data', 'This data category is governed by legal requirements and cannot be auto-deleted.');
                    return;
                  }
                  toggleAutoDelete(cat.id);
                }}
                trackColor={{false: Colors.outlineVariant, true: Colors.primaryContainer}}
                thumbColor={cat.autoDelete ? Colors.primary : Colors.onSurfaceVariant}
              />
            </View>
          ))}
        </View>

        <View style={styles.warningNote}>
          <Icon name="warning" size={16} color={Colors.warning} />
          <Text style={styles.warningNoteText}>
            Auto-deleted data cannot be recovered. Transaction records are exempt for a minimum of 7 years as required by UK financial regulations.
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleSave} activeOpacity={0.87}>
          <Icon name="check" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Save Retention Settings</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        {flex: 1, backgroundColor: Colors.surface},
  header:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:          {padding: 4},
  headerTitle:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:           {flex: 1},
  scrollContent:    {paddingBottom: 24},
  infoBanner:       {flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginHorizontal: 20, marginTop: 20, padding: 14, backgroundColor: Colors.primaryContainer, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary},
  infoBannerText:   {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onPrimaryContainer, lineHeight: 19},
  section:          {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  sectionSub:       {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 14, lineHeight: 18},
  periodRow:        {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  periodRowActive:  {borderColor: Colors.primary, backgroundColor: Colors.primaryContainer},
  periodLeft:       {flex: 1},
  periodLabel:      {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  periodLabelActive:{color: Colors.onPrimaryContainer},
  periodSub:        {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  radio:            {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center'},
  radioActive:      {borderColor: Colors.primary},
  radioDot:         {width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary},
  categoryRow:      {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  catIconWrap:      {width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center'},
  catIconLocked:    {backgroundColor: Colors.surfaceContainerHigh},
  catMeta:          {flex: 1},
  catLabelRow:      {flexDirection: 'row', alignItems: 'center', gap: 8},
  catLabel:         {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  catSub:           {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  legalBadge:       {flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: Colors.outlineVariant},
  legalBadgeText:   {fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.outlineVariant, letterSpacing: 0.5},
  warningNote:      {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 24, padding: 13, backgroundColor: Colors.errorContainer, borderRadius: 10},
  warningNoteText:  {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onErrorContainer, lineHeight: 18},
  ctaBtn:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnText:       {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
