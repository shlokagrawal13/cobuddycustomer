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
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const PREFERENCE_CHIPS = [
  'Fine Dining','Cultural Events','Private Aviation','Wellness',
  'Art & Galleries','Sports & Fitness','Music & Opera','Theatre',
  'Luxury Travel','Architecture','Business Networking','Philanthropy',
];

const LANGUAGES = ['English (UK)','English (US)','French','Arabic','Mandarin','Spanish','German','Japanese'];

export default function EditProfileScreen({navigation}: Props) {
  const [displayName, setDisplayName] = useState('Alexander M.');
  const [bio, setBio]                 = useState('Discerning professional who values curated, high-trust experiences across London, Dubai, and Singapore.');
  const [city, setCity]               = useState('London, United Kingdom');
  const [language, setLanguage]       = useState('English (UK)');
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['Fine Dining','Cultural Events','Wellness']);
  const [showLangPicker, setShowLangPicker] = useState(false);

  const togglePref = (p: string) => {
    setSelectedPrefs(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : prev.length < 5 ? [...prev, p] : prev,
    );
  };

  const handleSave = () => {
    if (!displayName.trim()) {
      Alert.alert('Required', 'Display name cannot be empty.');
      return;
    }
    Alert.alert(
      'Profile Updated',
      'Your profile changes are ready. This will sync to your account when the backend API is connected.',
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} activeOpacity={0.8} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Icon name="person" size={40} color={Colors.primary} />
            </View>
            <TouchableOpacity
              style={styles.changePhotoBtn}
              activeOpacity={0.8}
              onPress={() => Alert.alert('Photo Upload', 'Camera and photo library access will be available when native permissions are connected.')}>
              <Icon name="camera-alt" size={14} color={Colors.onPrimary} />
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
            <Text style={styles.avatarNote}>JPG or PNG, max 5 MB. Moderated for quality.</Text>
          </View>

          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>BASIC INFORMATION</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Display Name</Text>
              <TextInput
                style={styles.input}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Your name as shown to companions"
                placeholderTextColor={Colors.outlineVariant}
                maxLength={40}
              />
              <Text style={styles.charCount}>{displayName.length}/40</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={bio}
                onChangeText={setBio}
                placeholder="A short introduction visible to your companions"
                placeholderTextColor={Colors.outlineVariant}
                multiline
                maxLength={180}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{bio.length}/180</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>City / Location</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Your primary city"
                placeholderTextColor={Colors.outlineVariant}
              />
            </View>
          </View>

          {/* Language */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>LANGUAGE PREFERENCE</Text>
            <TouchableOpacity
              style={styles.languageRow}
              onPress={() => setShowLangPicker(!showLangPicker)}
              activeOpacity={0.8}>
              <View style={styles.languageRowLeft}>
                <Icon name="language" size={18} color={Colors.primary} />
                <Text style={styles.languageValue}>{language}</Text>
              </View>
              <Icon name={showLangPicker ? 'expand-less' : 'expand-more'} size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
            {showLangPicker && (
              <View style={styles.languagePicker}>
                {LANGUAGES.map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={styles.langOption}
                    onPress={() => {setLanguage(lang); setShowLangPicker(false);}}
                    activeOpacity={0.75}>
                    <Text style={[styles.langOptionText, lang === language && styles.langOptionSelected]}>
                      {lang}
                    </Text>
                    {lang === language && (
                      <Icon name="check" size={16} color={Colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <View style={styles.prefHeader}>
              <Text style={styles.sectionTitle}>INTERESTS</Text>
              <Text style={styles.prefCount}>{selectedPrefs.length}/5 selected</Text>
            </View>
            <Text style={styles.prefSub}>These help us curate your companion matches.</Text>
            <View style={styles.chipsWrap}>
              {PREFERENCE_CHIPS.map(chip => {
                const active = selectedPrefs.includes(chip);
                return (
                  <TouchableOpacity
                    key={chip}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => togglePref(chip)}
                    activeOpacity={0.75}>
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Verification note */}
          <View style={styles.verifyNote}>
            <Icon name="verified-user" size={16} color={Colors.primary} />
            <Text style={styles.verifyNoteText}>
              Your verified identity details (name, phone, ID) are managed through the Trust Center and cannot be changed here.
            </Text>
          </View>

          <TouchableOpacity style={styles.ctaBtn} onPress={handleSave} activeOpacity={0.87}>
            <Icon name="check" size={18} color={Colors.onPrimary} />
            <Text style={styles.ctaBtnText}>Save Profile</Text>
          </TouchableOpacity>

          <View style={{height: 32}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:      {flex: 1, backgroundColor: Colors.surface},
  header:         {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:        {padding: 4},
  headerTitle:    {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  saveBtn:        {paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.primary},
  saveBtnText:    {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onPrimary, letterSpacing: 1.2},
  scroll:         {flex: 1},
  scrollContent:  {paddingTop: 8, paddingBottom: 24},
  avatarSection:  {alignItems: 'center', paddingVertical: 28, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  avatar:         {width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: 14, borderWidth: 2, borderColor: Colors.primary},
  changePhotoBtn: {flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.primary, marginBottom: 8},
  changePhotoText:{fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onPrimary},
  avatarNote:     {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  section:        {paddingHorizontal: 20, paddingTop: 24, paddingBottom: 4},
  sectionTitle:   {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 16},
  fieldBlock:     {marginBottom: 18},
  fieldLabel:     {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 6, letterSpacing: 0.3},
  input:          {backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface},
  inputMulti:     {minHeight: 90, paddingTop: 12},
  charCount:      {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.outlineVariant, textAlign: 'right', marginTop: 4},
  languageRow:    {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surfaceContainerLow, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 13},
  languageRowLeft:{flexDirection: 'row', alignItems: 'center', gap: 10},
  languageValue:  {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  languagePicker: {marginTop: 4, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: Colors.outlineVariant},
  langOption:     {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  langOptionText: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface},
  langOptionSelected: {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  prefHeader:     {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6},
  prefCount:      {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  prefSub:        {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 14},
  chipsWrap:      {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip:           {paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  chipActive:     {borderColor: Colors.primary, backgroundColor: Colors.primaryContainer},
  chipText:       {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  chipTextActive: {fontFamily: 'Inter-SemiBold', color: Colors.primary},
  verifyNote:     {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 24, padding: 14, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant},
  verifyNoteText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  ctaBtn:         {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 28, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnText:     {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
