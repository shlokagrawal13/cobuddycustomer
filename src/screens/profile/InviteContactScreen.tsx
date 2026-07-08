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
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'InviteContact'>;

const RELATIONSHIPS = ['Partner','Spouse','Parent','Sibling','Friend','Colleague','Acquaintance','Other'];
const INVITE_CODE   = 'COBUDDY-ELARA-7X';
const INVITE_LINK   = `https://app.cobuddy.com/invite/${INVITE_CODE}`;

export default function InviteContactScreen({navigation}: Props) {
  const [name, setName]         = useState('');
  const [contact, setContact]   = useState('');
  const [relationship, setRel]  = useState('');
  const [method, setMethod]     = useState<'phone' | 'email'>('phone');
  const [showRelPicker, setRP]  = useState(false);

  const isValid = name.trim().length > 1 && contact.trim().length > 5 && relationship;

  const previewMessage =
    `Hi ${name.trim() || '[Name]'}, I would like to invite you to CoBuddy — the exclusive companion platform for curated social experiences.\n\nUse my invite code ${INVITE_CODE} to join:\n${INVITE_LINK}`;

  const handleSendInvite = () => {
    if (!isValid) {
      Alert.alert('Incomplete', 'Please fill in the name, contact details, and relationship before sending.');
      return;
    }
    Alert.alert(
      'Invite Sent',
      `Your invitation to ${name} has been queued. It will be delivered via ${method === 'phone' ? 'SMS' : 'email'} when the messaging API is connected.\n\nCode: ${INVITE_CODE}`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const handleShareLink = async () => {
    try {
      await Share.share({
        title: 'Join me on CoBuddy',
        message: previewMessage,
        url: INVITE_LINK,
      });
    } catch {
      Alert.alert('Share', 'Unable to open the share sheet. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite a Contact</Text>
        <View style={{width: 36}} />
      </View>

      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Hero */}
          <View style={styles.heroBanner}>
            <Icon name="group-add" size={28} color={Colors.primary} />
            <View style={styles.heroMeta}>
              <Text style={styles.heroTitle}>Invite someone you trust</Text>
              <Text style={styles.heroSub}>CoBuddy grows through trusted referrals. Earn rewards when your contact completes their first session.</Text>
            </View>
          </View>

          {/* Invite code */}
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>YOUR INVITE CODE</Text>
            <Text style={styles.codeValue}>{INVITE_CODE}</Text>
            <TouchableOpacity style={styles.shareCodeBtn} onPress={handleShareLink} activeOpacity={0.8}>
              <Icon name="share" size={16} color={Colors.primary} />
              <Text style={styles.shareCodeText}>Share Invite Link</Text>
            </TouchableOpacity>
          </View>

          {/* Contact details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONTACT DETAILS</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name of person you are inviting"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
              />
            </View>

            {/* Method toggle */}
            <View style={styles.methodToggle}>
              <TouchableOpacity
                style={[styles.methodBtn, method === 'phone' && styles.methodBtnActive]}
                onPress={() => setMethod('phone')}
                activeOpacity={0.8}>
                <Icon name="phone" size={15} color={method === 'phone' ? Colors.onPrimary : Colors.onSurfaceVariant} />
                <Text style={[styles.methodBtnText, method === 'phone' && styles.methodBtnTextActive]}>Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodBtn, method === 'email' && styles.methodBtnActive]}
                onPress={() => setMethod('email')}
                activeOpacity={0.8}>
                <Icon name="email" size={15} color={method === 'email' ? Colors.onPrimary : Colors.onSurfaceVariant} />
                <Text style={[styles.methodBtnText, method === 'email' && styles.methodBtnTextActive]}>Email</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>{method === 'phone' ? 'Phone Number' : 'Email Address'}</Text>
              <TextInput
                style={styles.input}
                value={contact}
                onChangeText={setContact}
                placeholder={method === 'phone' ? '+44 7700 000 000' : 'email@example.com'}
                placeholderTextColor={Colors.outlineVariant}
                keyboardType={method === 'phone' ? 'phone-pad' : 'email-address'}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Your Relationship</Text>
              <TouchableOpacity style={styles.selector} onPress={() => setRP(!showRelPicker)} activeOpacity={0.8}>
                <Text style={relationship ? styles.selectorSet : styles.selectorEmpty}>
                  {relationship || 'Select relationship'}
                </Text>
                <Icon name={showRelPicker ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
              {showRelPicker && (
                <View style={styles.pickerList}>
                  {RELATIONSHIPS.map(r => (
                    <TouchableOpacity key={r} style={styles.pickerOption} onPress={() => {setRel(r); setRP(false);}} activeOpacity={0.75}>
                      <Text style={[styles.pickerText, r === relationship && styles.pickerTextActive]}>{r}</Text>
                      {r === relationship && <Icon name="check" size={15} color={Colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Message preview */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>MESSAGE PREVIEW</Text>
            <View style={styles.previewBubble}>
              <Text style={styles.previewText}>{previewMessage}</Text>
            </View>
          </View>

          <View style={styles.privacyNote}>
            <Icon name="lock" size={14} color={Colors.primary} />
            <Text style={styles.privacyNoteText}>
              Invite links are personal and expire after 30 days. We do not store your contact's details without their consent.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled]}
            onPress={handleSendInvite}
            activeOpacity={0.87}>
            <Icon name="send" size={18} color={Colors.onPrimary} />
            <Text style={styles.ctaBtnText}>Send Invite</Text>
          </TouchableOpacity>

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
  headerTitle:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:           {flex: 1},
  scrollContent:    {paddingBottom: 24},
  heroBanner:       {flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginHorizontal: 20, marginTop: 20, padding: 16, backgroundColor: Colors.primaryContainer, borderRadius: 14, borderWidth: 1, borderColor: Colors.primary},
  heroMeta:         {flex: 1},
  heroTitle:        {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimaryContainer, marginBottom: 4},
  heroSub:          {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onPrimaryContainer, lineHeight: 18},
  codeCard:         {alignItems: 'center', marginHorizontal: 20, marginTop: 16, padding: 18, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant},
  codeLabel:        {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 8},
  codeValue:        {fontFamily: 'Playfair-SemiBold', fontSize: 22, color: Colors.primary, letterSpacing: 2, marginBottom: 14},
  shareCodeBtn:     {flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1.5, borderColor: Colors.primary},
  shareCodeText:    {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
  section:          {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  fieldBlock:       {marginBottom: 16},
  fieldLabel:       {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6, letterSpacing: 0.3},
  input:            {backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface},
  methodToggle:     {flexDirection: 'row', gap: 8, marginBottom: 16},
  methodBtn:        {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  methodBtnActive:  {borderColor: Colors.primary, backgroundColor: Colors.primary},
  methodBtnText:    {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  methodBtnTextActive: {color: Colors.onPrimary},
  selector:         {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 13},
  selectorSet:      {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, flex: 1},
  selectorEmpty:    {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.outlineVariant, flex: 1},
  pickerList:       {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden'},
  pickerOption:     {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  pickerText:       {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},
  pickerTextActive: {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  previewSection:   {paddingHorizontal: 20, paddingTop: 24},
  previewBubble:    {backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: Colors.outlineVariant},
  previewText:      {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 20},
  privacyNote:      {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 16, padding: 12, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10},
  privacyNoteText:  {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 17},
  ctaBtn:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnDisabled:   {opacity: 0.4},
  ctaBtnText:       {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
