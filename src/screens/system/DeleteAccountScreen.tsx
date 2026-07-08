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
import type {ModalStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ModalStackParamList, 'DeleteAccount'>;

const DELETE_REASONS = [
  'I no longer need the service',
  'I found a better alternative',
  'Privacy or data concerns',
  'I had a negative experience',
  'The service is too expensive',
  'Technical issues',
  'I prefer not to say',
];

const DATA_LOSS_ITEMS = [
  {icon: 'event-available', label: 'All session history and bookings'},
  {icon: 'receipt-long',    label: 'Transaction records and receipts'},
  {icon: 'star',            label: 'Reviews and feedback submitted'},
  {icon: 'diamond',         label: 'Rewards points and membership tier'},
  {icon: 'chat',            label: 'Concierge message history'},
  {icon: 'person',          label: 'Profile, identity verification, and trust score'},
  {icon: 'shield',          label: 'Safety data and trusted contact network'},
];

export default function DeleteAccountScreen({navigation}: Props) {
  const [reason, setReason]         = useState('');
  const [confirmation, setConfirm]  = useState('');
  const [showReasons, setShowR]     = useState(false);

  const isReady = confirmation === 'DELETE' && reason.length > 0;

  const handleDelete = () => {
    Alert.alert(
      'Account Deletion Queued',
      'Your account deletion request has been logged. In production, your account will be permanently deleted within 30 days. You will receive a confirmation email. If you change your mind, contact support within 7 days.',
      [
        {text: 'Cancel Request', style: 'cancel'},
        {text: 'Confirm', style: 'destructive', onPress: () => navigation.goBack()},
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="close" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
        <View style={{width: 36}} />
      </View>

      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Strong warning hero */}
          <View style={styles.warningHero}>
            <View style={styles.warningIconRing}>
              <Icon name="delete-forever" size={36} color={Colors.error} />
            </View>
            <Text style={styles.warningTitle}>This Cannot Be Undone</Text>
            <Text style={styles.warningSub}>
              Permanently deleting your account will erase all your data from CoBuddy systems. This action is irreversible.
            </Text>
          </View>

          {/* Data loss list */}
          <View style={styles.lossCard}>
            <Text style={styles.lossTitle}>YOU WILL PERMANENTLY LOSE</Text>
            {DATA_LOSS_ITEMS.map(item => (
              <View key={item.label} style={styles.lossRow}>
                <View style={styles.lossIconWrap}>
                  <Icon name={item.icon} size={16} color={Colors.error} />
                </View>
                <Text style={styles.lossLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Alternatives */}
          <View style={styles.alternativeCard}>
            <Icon name="lightbulb" size={18} color={Colors.primary} />
            <View style={styles.alternativeMeta}>
              <Text style={styles.alternativeTitle}>Consider an alternative</Text>
              <Text style={styles.alternativeSub}>
                You can deactivate your account temporarily, adjust your privacy settings, or take a membership pause instead of deleting permanently.
              </Text>
            </View>
          </View>

          {/* Reason selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>REASON FOR LEAVING</Text>
            <TouchableOpacity style={styles.selector} onPress={() => setShowR(!showReasons)} activeOpacity={0.8}>
              <Text style={reason ? styles.selectorSet : styles.selectorEmpty}>
                {reason || 'Select a reason'}
              </Text>
              <Icon name={showReasons ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
            {showReasons && (
              <View style={styles.reasonList}>
                {DELETE_REASONS.map(r => (
                  <TouchableOpacity
                    key={r}
                    style={styles.reasonOption}
                    onPress={() => {setReason(r); setShowR(false);}}
                    activeOpacity={0.75}>
                    <Text style={[styles.reasonText, r === reason && styles.reasonTextActive]}>{r}</Text>
                    {r === reason && <Icon name="check" size={15} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Confirmation input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONFIRM DELETION</Text>
            <Text style={styles.confirmInstruction}>
              Type <Text style={styles.confirmWord}>DELETE</Text> in the field below to enable the deletion button.
            </Text>
            <TextInput
              style={[styles.confirmInput, confirmation === 'DELETE' && styles.confirmInputReady]}
              value={confirmation}
              onChangeText={v => setConfirm(v.toUpperCase())}
              placeholder="Type DELETE here"
              placeholderTextColor={Colors.outlineVariant}
              autoCapitalize="characters"
              maxLength={6}
            />
            {confirmation.length > 0 && confirmation !== 'DELETE' && (
              <Text style={styles.confirmError}>Type exactly: DELETE</Text>
            )}
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.deleteBtn, !isReady && styles.deleteBtnDisabled]}
            onPress={isReady ? handleDelete : undefined}
            activeOpacity={isReady ? 0.8 : 1}>
            <Icon name="delete-forever" size={18} color={isReady ? Colors.onError : Colors.outlineVariant} />
            <Text style={[styles.deleteBtnText, !isReady && styles.deleteBtnTextDisabled]}>
              Permanently Delete My Account
            </Text>
          </TouchableOpacity>

          <Text style={styles.footNote}>
            By proceeding, you acknowledge this action is permanent and cannot be reversed. CoBuddy retains transaction records for 7 years as required by law.
          </Text>

          <View style={{height: 32}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:           {flex: 1, backgroundColor: Colors.surface},
  header:              {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:             {padding: 4},
  headerTitle:         {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.error},
  scroll:              {flex: 1},
  scrollContent:       {paddingBottom: 24},
  warningHero:         {alignItems: 'center', paddingHorizontal: 28, paddingTop: 32, paddingBottom: 28, borderBottomWidth: 1, borderBottomColor: Colors.errorContainer},
  warningIconRing:     {width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.errorContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 18, borderWidth: 2, borderColor: Colors.error},
  warningTitle:        {fontFamily: 'Playfair-SemiBold', fontSize: 22, color: Colors.error, marginBottom: 12, textAlign: 'center'},
  warningSub:          {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20, textAlign: 'center'},
  lossCard:            {marginHorizontal: 20, marginTop: 20, padding: 16, backgroundColor: Colors.errorContainer, borderRadius: 14, borderWidth: 1, borderColor: Colors.error},
  lossTitle:           {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onErrorContainer, letterSpacing: 1.4, marginBottom: 12},
  lossRow:             {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,180,171,0.2)'},
  lossIconWrap:        {width: 32, height: 32, borderRadius: 8, backgroundColor: 'rgba(147,0,10,0.4)', alignItems: 'center', justifyContent: 'center'},
  lossLabel:           {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onErrorContainer, flex: 1},
  alternativeCard:     {flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginHorizontal: 20, marginTop: 16, padding: 14, backgroundColor: Colors.primaryContainer, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary},
  alternativeMeta:     {flex: 1},
  alternativeTitle:    {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onPrimaryContainer, marginBottom: 4},
  alternativeSub:      {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onPrimaryContainer, lineHeight: 18},
  section:             {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:        {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 12},
  selector:            {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 13},
  selectorSet:         {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, flex: 1},
  selectorEmpty:       {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.outlineVariant, flex: 1},
  reasonList:          {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden'},
  reasonOption:        {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  reasonText:          {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface, flex: 1},
  reasonTextActive:    {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  confirmInstruction:  {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20, marginBottom: 12},
  confirmWord:         {fontFamily: 'Inter-SemiBold', color: Colors.error},
  confirmInput:        {backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 14, fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface, textAlign: 'center', letterSpacing: 4},
  confirmInputReady:   {borderColor: Colors.error, backgroundColor: Colors.errorContainer},
  confirmError:        {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.error, marginTop: 6},
  deleteBtn:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 28, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.error},
  deleteBtnDisabled:   {backgroundColor: Colors.surfaceContainerHigh},
  deleteBtnText:       {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onError, letterSpacing: 0.3},
  deleteBtnTextDisabled: {color: Colors.outlineVariant},
  footNote:            {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.outlineVariant, textAlign: 'center', paddingHorizontal: 24, marginTop: 16, lineHeight: 17},
});
