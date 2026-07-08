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

type Props = NativeStackScreenProps<ProfileStackParamList, 'DataPortability'>;

interface DataCategory {
  id: string;
  icon: string;
  label: string;
  description: string;
  size: string;
}

const DATA_CATEGORIES: DataCategory[] = [
  {id: 'profile',       icon: 'person',          label: 'Profile & Identity',    description: 'Name, bio, photo, preferences, verification status',                    size: '~2 MB'},
  {id: 'sessions',      icon: 'event-available',  label: 'Session History',       description: 'All past bookings, companions, dates, durations, locations',            size: '~8 MB'},
  {id: 'transactions',  icon: 'receipt-long',     label: 'Transaction Records',   description: 'Payment history, receipts, refunds, tips',                              size: '~4 MB'},
  {id: 'messages',      icon: 'chat',             label: 'Concierge Messages',    description: 'Message threads, attachments, media shared with concierge',             size: '~15 MB'},
  {id: 'safety',        icon: 'shield',           label: 'Safety Data',           description: 'Trusted contacts, incident reports, SOS logs',                          size: '~1 MB'},
  {id: 'reviews',       icon: 'star',             label: 'Reviews & Feedback',    description: 'All reviews you submitted and received',                                size: '~500 KB'},
  {id: 'preferences',   icon: 'tune',             label: 'App Preferences',       description: 'Settings, notification preferences, appearance choices',                size: '~200 KB'},
];

const FORMAT_OPTIONS = [
  {id: 'json',  label: 'JSON',  description: 'Machine-readable. Suitable for developers or data tools.'},
  {id: 'csv',   label: 'CSV',   description: 'Spreadsheet-compatible. Opens in Excel or Google Sheets.'},
  {id: 'pdf',   label: 'PDF',   description: 'Human-readable. Best for personal records or printing.'},
];

export default function DataPortabilityScreen({navigation}: Props) {
  const [selected, setSelected]   = useState<Set<string>>(new Set(DATA_CATEGORIES.map(c => c.id)));
  const [format, setFormat]       = useState('json');

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {next.delete(id);} else {next.add(id);}
      return next;
    });
  };

  const totalSize = DATA_CATEGORIES
    .filter(c => selected.has(c.id))
    .reduce((acc, c) => acc + parseFloat(c.size.replace(/[^0-9.]/g, '')), 0)
    .toFixed(1);

  const handleRequest = () => {
    if (selected.size === 0) {
      Alert.alert('Nothing Selected', 'Please select at least one data category to export.');
      return;
    }
    Alert.alert(
      'Export Requested',
      `Your data export request has been queued. You will receive an email with a secure download link within 48 hours when the export pipeline is connected.\n\nSelected: ${selected.size} categories  |  Format: ${format.toUpperCase()}`,
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
        <Text style={styles.headerTitle}>Data Portability</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIcon}>
            <Icon name="download" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Export Your Data</Text>
          <Text style={styles.heroSub}>
            Under GDPR and your rights as a CoBuddy member, you can request a complete copy of all data we hold about you. Exports are delivered to your registered email address.
          </Text>
        </View>

        {/* Category selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DATA CATEGORIES</Text>
            <TouchableOpacity onPress={() => setSelected(selected.size === DATA_CATEGORIES.length ? new Set() : new Set(DATA_CATEGORIES.map(c => c.id)))} activeOpacity={0.7}>
              <Text style={styles.toggleAll}>{selected.size === DATA_CATEGORIES.length ? 'Deselect All' : 'Select All'}</Text>
            </TouchableOpacity>
          </View>

          {DATA_CATEGORIES.map(cat => {
            const active = selected.has(cat.id);
            return (
              <TouchableOpacity key={cat.id} style={styles.categoryRow} onPress={() => toggle(cat.id)} activeOpacity={0.8}>
                <View style={[styles.categoryIconWrap, active && styles.categoryIconWrapActive]}>
                  <Icon name={cat.icon} size={18} color={active ? Colors.onPrimary : Colors.onSurfaceVariant} />
                </View>
                <View style={styles.categoryMeta}>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                  <Text style={styles.categoryDesc}>{cat.description}</Text>
                  <Text style={styles.categorySize}>{cat.size}</Text>
                </View>
                <View style={[styles.checkbox, active && styles.checkboxActive]}>
                  {active && <Icon name="check" size={14} color={Colors.onPrimary} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Format */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPORT FORMAT</Text>
          {FORMAT_OPTIONS.map(f => (
            <TouchableOpacity key={f.id} style={[styles.formatRow, format === f.id && styles.formatRowActive]} onPress={() => setFormat(f.id)} activeOpacity={0.8}>
              <View style={styles.formatLeft}>
                <Text style={[styles.formatLabel, format === f.id && styles.formatLabelActive]}>{f.label}</Text>
                <Text style={styles.formatDesc}>{f.description}</Text>
              </View>
              <View style={[styles.radio, format === f.id && styles.radioActive]}>
                {format === f.id && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Categories selected</Text>
            <Text style={styles.summaryValue}>{selected.size} / {DATA_CATEGORIES.length}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Estimated size</Text>
            <Text style={styles.summaryValue}>~{totalSize} MB</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery method</Text>
            <Text style={styles.summaryValue}>Email (secure link)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Processing time</Text>
            <Text style={styles.summaryValue}>Up to 48 hours</Text>
          </View>
        </View>

        <View style={styles.legalNote}>
          <Icon name="verified-user" size={15} color={Colors.primary} />
          <Text style={styles.legalNoteText}>
            Export links expire after 7 days and are protected by your account credentials. You can request an export once every 30 days.
          </Text>
        </View>

        <TouchableOpacity style={[styles.ctaBtn, selected.size === 0 && styles.ctaBtnDisabled]} onPress={handleRequest} activeOpacity={0.87}>
          <Icon name="download" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Request Data Export</Text>
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
  heroBanner:           {alignItems: 'center', paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  heroIcon:             {width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1.5, borderColor: Colors.primary},
  heroTitle:            {fontFamily: 'Playfair-SemiBold', fontSize: 20, color: Colors.onSurface, marginBottom: 10, textAlign: 'center'},
  heroSub:              {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20, textAlign: 'center'},
  section:              {paddingHorizontal: 20, paddingTop: 24},
  sectionHeader:        {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14},
  sectionTitle:         {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4},
  toggleAll:            {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.primary},
  categoryRow:          {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  categoryIconWrap:     {width: 40, height: 40, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center'},
  categoryIconWrapActive: {backgroundColor: Colors.primary},
  categoryMeta:         {flex: 1},
  categoryLabel:        {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  categoryDesc:         {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2, lineHeight: 16},
  categorySize:         {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.outlineVariant, marginTop: 3},
  checkbox:             {width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center'},
  checkboxActive:       {backgroundColor: Colors.primary, borderColor: Colors.primary},
  formatRow:            {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13, paddingHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  formatRowActive:      {borderColor: Colors.primary, backgroundColor: Colors.primaryContainer},
  formatLeft:           {flex: 1},
  formatLabel:          {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  formatLabelActive:    {color: Colors.onPrimaryContainer},
  formatDesc:           {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  radio:                {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center'},
  radioActive:          {borderColor: Colors.primary},
  radioDot:             {width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary},
  summaryCard:          {marginHorizontal: 20, marginTop: 24, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden'},
  summaryRow:           {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  summaryLabel:         {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  summaryValue:         {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  legalNote:            {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 16, padding: 13, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10},
  legalNoteText:        {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 17},
  ctaBtn:               {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnDisabled:       {opacity: 0.4},
  ctaBtnText:           {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
