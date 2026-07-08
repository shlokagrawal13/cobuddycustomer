import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ReceiptViewer'>;

// Mock transaction lookup
const MOCK_RECEIPT = {
  id:           'TXN-CB-8829-XQ',
  status:       'Completed',
  date:         'Saturday, 14 June 2026',
  time:         '20:15 BST',
  merchant:     'CoBuddy Companions Ltd.',
  description:  'Premium Companion Session — Fine Dining Experience',
  companion:    'Sophia R.',
  venue:        'The Grand Pavilion, Mayfair',
  duration:     '3 hours',
  subtotal:     '£420.00',
  serviceFee:   '£42.00',
  vat:          '£46.20',
  total:        '£508.20',
  paymentMethod:'Visa •••• 4521',
  authCode:     'AUTH-928XB3',
  reference:    'CB-REF-20260614-8829',
};

export default function ReceiptViewerScreen({navigation, route}: Props) {
  const txId = route.params?.transactionId ?? MOCK_RECEIPT.id;
  const r = MOCK_RECEIPT; // In production: look up by txId

  const handleDownload = () => {
    Alert.alert(
      'Download Receipt',
      'PDF receipt generation will be available when the document API is connected. You can share this receipt now.',
      [{text: 'Share Instead', onPress: handleShare}, {text: 'OK', style: 'cancel'}],
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Receipt — ${r.id}`,
        message: `CoBuddy Receipt\n\n${r.description}\nDate: ${r.date} ${r.time}\nTotal: ${r.total}\nReference: ${r.reference}\nAuth: ${r.authCode}`,
      });
    } catch {
      Alert.alert('Share', 'Unable to open share sheet. Please try again.');
    }
  };

  const StatusBadge = () => (
    <View style={styles.statusBadge}>
      <Icon name="check-circle" size={13} color={Colors.success} />
      <Text style={styles.statusText}>{r.status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipt</Text>
        <TouchableOpacity onPress={handleShare} activeOpacity={0.7} style={styles.shareBtn}>
          <Icon name="share" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Receipt header */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <View style={styles.logoMark}>
              <Icon name="diamond" size={22} color={Colors.primary} />
            </View>
            <View style={styles.receiptHeaderMeta}>
              <Text style={styles.receiptMerchant}>{r.merchant}</Text>
              <Text style={styles.receiptId}>#{r.id}</Text>
            </View>
            <StatusBadge />
          </View>

          <View style={styles.receiptDivider} />

          <Text style={styles.receiptDesc}>{r.description}</Text>

          <View style={styles.receiptMeta}>
            {([
              {icon: 'person',       label: 'Companion',  value: r.companion},
              {icon: 'location-on',  label: 'Venue',      value: r.venue},
              {icon: 'calendar-today', label: 'Date',     value: `${r.date} at ${r.time}`},
              {icon: 'timer',        label: 'Duration',   value: r.duration},
            ] as const).map(row => (
              <View key={row.label} style={styles.receiptMetaRow}>
                <Icon name={row.icon} size={15} color={Colors.primary} />
                <Text style={styles.receiptMetaLabel}>{row.label}</Text>
                <Text style={styles.receiptMetaValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Line items */}
        <View style={styles.lineItemsCard}>
          <Text style={styles.lineItemsTitle}>PAYMENT BREAKDOWN</Text>

          {([
            {label: 'Session Fee',   value: r.subtotal},
            {label: 'Service Fee',   value: r.serviceFee},
            {label: 'VAT (20%)',     value: r.vat},
          ] as const).map(item => (
            <View key={item.label} style={styles.lineItemRow}>
              <Text style={styles.lineItemLabel}>{item.label}</Text>
              <Text style={styles.lineItemValue}>{item.value}</Text>
            </View>
          ))}

          <View style={styles.totalDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Charged</Text>
            <Text style={styles.totalValue}>{r.total}</Text>
          </View>
        </View>

        {/* Payment method */}
        <View style={styles.paymentCard}>
          <Text style={styles.lineItemsTitle}>PAYMENT DETAILS</Text>
          {([
            {label: 'Method',     value: r.paymentMethod, icon: 'credit-card'},
            {label: 'Auth Code',  value: r.authCode,      icon: 'lock'},
            {label: 'Reference',  value: r.reference,     icon: 'receipt'},
          ] as const).map(row => (
            <View key={row.label} style={styles.paymentRow}>
              <Icon name={row.icon} size={15} color={Colors.outlineVariant} />
              <Text style={styles.paymentLabel}>{row.label}</Text>
              <Text style={styles.paymentValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.8}>
            <Icon name="share" size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={handleDownload} activeOpacity={0.8}>
            <Icon name="download" size={18} color={Colors.onPrimary} />
            <Text style={[styles.actionBtnText, {color: Colors.onPrimary}]}>Download PDF</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.legalNote}>
          <Text style={styles.legalNoteText}>
            This receipt is a record of your transaction with CoBuddy Companions Ltd. For disputes, use the Dispute & Refund option in your session history.
          </Text>
        </View>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       {flex: 1, backgroundColor: Colors.surface},
  header:          {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:         {padding: 4},
  headerTitle:     {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  shareBtn:        {padding: 4},
  scroll:          {flex: 1},
  scrollContent:   {padding: 20, gap: 16},
  receiptCard:     {backgroundColor: Colors.surfaceContainerLow, borderRadius: 16, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 18},
  receiptHeader:   {flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16},
  logoMark:        {width: 44, height: 44, borderRadius: 12, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center'},
  receiptHeaderMeta: {flex: 1},
  receiptMerchant: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  receiptId:       {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  statusBadge:     {flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(109,217,140,0.15)', borderWidth: 1, borderColor: Colors.success},
  statusText:      {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success, letterSpacing: 0.5},
  receiptDivider:  {height: 1, backgroundColor: Colors.outlineVariant, marginBottom: 14},
  receiptDesc:     {fontFamily: 'Playfair-SemiBold', fontSize: 15, color: Colors.onSurface, marginBottom: 16},
  receiptMeta:     {gap: 10},
  receiptMetaRow:  {flexDirection: 'row', alignItems: 'center', gap: 10},
  receiptMetaLabel:{fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, width: 75},
  receiptMetaValue:{flex: 1, fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurface},
  lineItemsCard:   {backgroundColor: Colors.surfaceContainerLow, borderRadius: 16, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 18},
  lineItemsTitle:  {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  lineItemRow:     {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10},
  lineItemLabel:   {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  lineItemValue:   {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  totalDivider:    {height: 1, backgroundColor: Colors.outlineVariant, marginVertical: 12},
  totalRow:        {flexDirection: 'row', justifyContent: 'space-between'},
  totalLabel:      {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  totalValue:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.primary},
  paymentCard:     {backgroundColor: Colors.surfaceContainerLow, borderRadius: 16, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 18},
  paymentRow:      {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12},
  paymentLabel:    {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, width: 80},
  paymentValue:    {flex: 1, fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurface},
  actionRow:       {flexDirection: 'row', gap: 12},
  actionBtn:       {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.primary},
  actionBtnPrimary:{backgroundColor: Colors.primary, borderColor: Colors.primary},
  actionBtnText:   {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.primary},
  legalNote:       {padding: 14, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10},
  legalNoteText:   {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.outlineVariant, lineHeight: 17, textAlign: 'center'},
});
