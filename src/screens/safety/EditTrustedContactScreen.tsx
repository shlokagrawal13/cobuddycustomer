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
import type {SafetyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SafetyStackParamList, 'EditTrustedContact'>;

const RELATIONSHIPS = ['Partner','Spouse','Parent','Sibling','Friend','Colleague','Manager','Other'];
const PRIORITIES    = ['Primary — First to be notified','Secondary — Notified if primary unreachable','Emergency — Only in critical situations'];

export default function EditTrustedContactScreen({navigation, route}: Props) {
  const contactId = route.params?.contactId;

  // Pre-fill with mock data if editing, empty if adding
  const isEdit = Boolean(contactId);
  const [name, setName]           = useState(isEdit ? 'James Thornton' : '');
  const [phone, setPhone]         = useState(isEdit ? '+44 7700 900 821' : '');
  const [relationship, setRel]    = useState(isEdit ? 'Friend' : '');
  const [priority, setPriority]   = useState(0);
  const [showRelPicker, setShowRel]  = useState(false);
  const [showPriPicker, setShowPri]  = useState(false);
  const [canCall, setCanCall]        = useState(true);
  const [canSMS, setCanSMS]          = useState(true);
  const [canLocation, setCanLocation]= useState(false);

  const isValid = name.trim().length > 1 && phone.trim().length > 6 && relationship;

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Incomplete', 'Please fill in the name, phone number, and relationship before saving.');
      return;
    }
    Alert.alert(
      isEdit ? 'Contact Updated' : 'Contact Added',
      `${name} has been ${isEdit ? 'updated in' : 'added to'} your trusted safety network. They will be notified according to your session safety settings.`,
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
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Contact' : 'Add Trusted Contact'}</Text>
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

          {/* Safety context banner */}
          <View style={styles.safetyBanner}>
            <Icon name="shield" size={18} color={Colors.primary} />
            <Text style={styles.safetyBannerText}>
              Trusted contacts are notified during active sessions, SOS events, or if you miss a safety check-in.
            </Text>
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
                placeholder="Full name of your trusted contact"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+44 7700 000 000"
                placeholderTextColor={Colors.outlineVariant}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Relationship</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowRel(!showRelPicker)}
                activeOpacity={0.8}>
                <Text style={relationship ? styles.selectorValueSet : styles.selectorValueEmpty}>
                  {relationship || 'Select relationship'}
                </Text>
                <Icon name={showRelPicker ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
              {showRelPicker && (
                <View style={styles.pickerList}>
                  {RELATIONSHIPS.map(r => (
                    <TouchableOpacity
                      key={r}
                      style={styles.pickerOption}
                      onPress={() => {setRel(r); setShowRel(false);}}
                      activeOpacity={0.75}>
                      <Text style={[styles.pickerOptionText, r === relationship && styles.pickerOptionSelected]}>{r}</Text>
                      {r === relationship && <Icon name="check" size={15} color={Colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Priority level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>NOTIFICATION PRIORITY</Text>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowPri(!showPriPicker)}
              activeOpacity={0.8}>
              <Text style={styles.selectorValueSet}>{PRIORITIES[priority]}</Text>
              <Icon name={showPriPicker ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
            {showPriPicker && (
              <View style={styles.pickerList}>
                {PRIORITIES.map((p, i) => (
                  <TouchableOpacity
                    key={p}
                    style={styles.pickerOption}
                    onPress={() => {setPriority(i); setShowPri(false);}}
                    activeOpacity={0.75}>
                    <Text style={[styles.pickerOptionText, i === priority && styles.pickerOptionSelected]}>{p}</Text>
                    {i === priority && <Icon name="check" size={15} color={Colors.primary} />}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Permissions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PERMISSIONS</Text>

            {([
              {label: 'Allow phone calls during emergencies', sub: 'They can receive automated safety calls', value: canCall,    set: setCanCall},
              {label: 'Allow SMS notifications',             sub: 'They receive text alerts and check-ins', value: canSMS,     set: setCanSMS},
              {label: 'Share live location',                 sub: 'Your GPS is shared during active sessions', value: canLocation, set: setCanLocation},
            ] as const).map((item, i) => (
              <View key={i} style={styles.permRow}>
                <View style={styles.permMeta}>
                  <Text style={styles.permLabel}>{item.label}</Text>
                  <Text style={styles.permSub}>{item.sub}</Text>
                </View>
                <Switch
                  value={item.value}
                  onValueChange={item.set}
                  trackColor={{false: Colors.outlineVariant, true: Colors.primaryContainer}}
                  thumbColor={item.value ? Colors.primary : Colors.onSurfaceVariant}
                />
              </View>
            ))}
          </View>

          {isEdit && (
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => Alert.alert('Remove Contact', `Remove ${name} from your trusted contacts?`, [
                {text: 'Cancel', style: 'cancel'},
                {text: 'Remove', style: 'destructive', onPress: () => navigation.goBack()},
              ])}
              activeOpacity={0.8}>
              <Icon name="person-remove" size={16} color={Colors.error} />
              <Text style={styles.removeBtnText}>Remove from Trusted Contacts</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.ctaBtn, !isValid && styles.ctaBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.87}>
            <Icon name="check" size={18} color={Colors.onPrimary} />
            <Text style={styles.ctaBtnText}>{isEdit ? 'Save Changes' : 'Add Contact'}</Text>
          </TouchableOpacity>

          <View style={{height: 32}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          {flex: 1, backgroundColor: Colors.surface},
  header:             {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:            {padding: 4},
  headerTitle:        {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:             {flex: 1},
  scrollContent:      {paddingBottom: 24},
  safetyBanner:       {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 20, padding: 14, backgroundColor: Colors.primaryContainer, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary},
  safetyBannerText:   {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onPrimaryContainer, lineHeight: 18},
  section:            {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:       {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 16},
  fieldBlock:         {marginBottom: 16},
  fieldLabel:         {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6, letterSpacing: 0.3},
  input:              {backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface},
  selector:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 13},
  selectorValueSet:   {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, flex: 1},
  selectorValueEmpty: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.outlineVariant, flex: 1},
  pickerList:         {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, overflow: 'hidden'},
  pickerOption:       {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  pickerOptionText:   {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},
  pickerOptionSelected: {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  permRow:            {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  permMeta:           {flex: 1, paddingRight: 12},
  permLabel:          {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  permSub:            {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  removeBtn:          {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 24, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.error},
  removeBtnText:      {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.error},
  ctaBtn:             {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 16, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnDisabled:     {opacity: 0.4},
  ctaBtnText:         {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
