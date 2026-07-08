import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {PrimaryButton, BottomActionBar, AppBottomSheet} from '../../components/ui';
import {useUserStore} from '../../store/userStore';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'BasicProfileSetup'>;

const GENDER_OPTIONS = ['Man', 'Woman', 'Non-binary', 'Prefer not to say'];

// Mock avatar sources — no native dependency needed
type AvatarState = 'none' | 'photo' | 'selfie';
const AVATAR_COLORS: Record<AvatarState, string> = {
  none:   'transparent',
  photo:  '#2a3b5e',
  selfie: '#3b2a5e',
};

export default function BasicProfileSetupScreen({navigation}: Props) {
  const [name, setName]       = useState('');
  const [age, setAge]         = useState('');
  const [gender, setGender]   = useState('');
  const [city, setCity]       = useState('');
  const [bio, setBio]         = useState('');
  const [showGender, setShowGender]     = useState(false);
  const [nameError, setNameError]       = useState('');
  const [avatarState, setAvatarState]   = useState<AvatarState>('none');
  const [showAvatarSheet, setShowAvatarSheet] = useState(false);
  const {setProfile} = useUserStore();

  const isValid = name.trim().length >= 2;

  const handleContinue = () => {
    if (!isValid) {setNameError('Please enter your display name.'); return;}
    setProfile({
      id: 'usr_local_001',
      name: name.trim(),
      bio: bio.trim(),
      phone: '',
      trustScore: 0,
      membershipTier: 'standard',
      verificationStatus: 'pending',
      interests: [],
      language: 'en',
      createdAt: new Date().toISOString(),
    });
    navigation.navigate('InterestSelection');
  };

  const handleAvatarOption = (option: 'photo' | 'selfie' | 'skip') => {
    setShowAvatarSheet(false);
    if (option === 'photo')  {setAvatarState('photo');}
    if (option === 'selfie') {setAvatarState('selfie');}
    // 'skip' → no change
  };

  // Step dots (4 total, step 1 active)
  const StepDots = () => (
    <View style={styles.dotsRow}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>

        {/* Shared header — back always shown from BasicProfile onward */}
        <OnboardingHeader
          showBack
          onBack={() => navigation.goBack()}
          centerLabel="Profile Setup"
          step="2 / 7"
          showProgress
          currentStep={2}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* Ambient glow */}
          <View style={styles.ambientGlow} pointerEvents="none" />

          {/* Step label + headline */}
          <Text style={styles.stepLabel}>STEP 1 OF 4</Text>
          <Text style={styles.title}>Create Your Identity</Text>
          <Text style={styles.subtitle}>
            Help us personalize your trusted CoBuddy experience.
          </Text>

          {/* Glass form card */}
          <View style={styles.formCard}>

            {/* ── Avatar ── */}
            <View style={styles.photoSection}>
              <TouchableOpacity
                style={[
                  styles.photoCircle,
                  avatarState !== 'none' && styles.photoCircleSelected,
                ]}
                onPress={() => setShowAvatarSheet(true)}
                activeOpacity={0.85}>
                {avatarState === 'none' ? (
                  <>
                    <View style={{opacity: 0.5}}>
                      <Icon name="camera-alt" size={30} color={Colors.onSurfaceVariant} />
                    </View>
                    <View style={styles.photoAddBadge}>
                      <Icon name="add" size={16} color={Colors.onPrimary} />
                    </View>
                  </>
                ) : (
                  <>
                    <View
                      style={[
                        styles.avatarFill,
                        {backgroundColor: AVATAR_COLORS[avatarState]},
                      ]}>
                      <View style={{opacity: 0.7}}>
                        <Icon
                          name={avatarState === 'selfie' ? 'camera-front' : 'image'}
                          size={36}
                          color={Colors.onSurface}
                        />
                      </View>
                    </View>
                    {/* Edit badge */}
                    <View style={styles.verifiedBadge}>
                      <Icon name="edit" size={11} color={Colors.onSurfaceVariant} />
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {avatarState === 'none' ? (
                <Text style={styles.photoLabel}>Add Profile Photo</Text>
              ) : (
                <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
                  <Text style={styles.photoLabel}>Photo Added</Text>
                  <Icon name="check" size={14} color={Colors.primary} />
                </View>
              )}
              <Text style={styles.photoHint}>
                {avatarState === 'none'
                  ? 'Use a clear and respectful profile image'
                  : 'Tap to change photo'}
              </Text>
            </View>

            {/* Full Name */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput
                style={[styles.underlineInput, nameError ? styles.underlineInputError : null]}
                value={name}
                onChangeText={t => {setName(t); if (nameError) {setNameError('');}}}
                placeholder="Full Name"
                placeholderTextColor={Colors.outlineVariant}
                autoCapitalize="words"
                returnKeyType="next"
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            {/* Age + Gender row */}
            <View style={styles.ageGenderRow}>
              <View style={[styles.field, {flex: 1}]}>
                <Text style={styles.fieldLabel}>Age</Text>
                <TextInput
                  style={styles.underlineInput}
                  value={age}
                  onChangeText={setAge}
                  placeholder="Age"
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType="number-pad"
                  maxLength={3}
                  returnKeyType="next"
                />
              </View>
              <View style={[styles.field, {flex: 2}]}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <TouchableOpacity
                  style={styles.underlineSelect}
                  onPress={() => setShowGender(s => !s)}>
                  <Text style={gender ? styles.selectValue : styles.selectPlaceholder}>
                    {gender || 'Select Gender'}
                  </Text>
                  <Icon name="expand-more" size={16} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
                {showGender && (
                  <View style={styles.dropdown}>
                    {GENDER_OPTIONS.map(g => (
                      <TouchableOpacity
                        key={g}
                        style={styles.dropdownItem}
                        onPress={() => {setGender(g); setShowGender(false);}}>
                        <Text style={[styles.dropdownText, g === gender && styles.dropdownTextActive]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.ageHint}>Must be 18 or older to join CoBuddy.</Text>

            {/* City */}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>City</Text>
              <View style={styles.underlineSelect}>
                <View style={styles.cityRow}>
                  <View style={{opacity: 0.7}}>
                    <Icon name="location-on" size={16} color={Colors.onSurfaceVariant} />
                  </View>
                  <TextInput
                    style={styles.cityInput}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                    placeholderTextColor={Colors.outlineVariant}
                    returnKeyType="next"
                  />
                </View>
              </View>
            </View>

            {/* Bio */}
            <View style={[styles.field, {marginTop: 8}]}>
              <Text style={styles.fieldLabel}>Short Bio</Text>
              <View style={styles.bioWrap}>
                <TextInput
                  style={styles.bioInput}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us a little about yourself and the experiences you enjoy."
                  placeholderTextColor={Colors.outlineVariant}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  maxLength={300}
                />
              </View>
            </View>
          </View>

          {/* Footer trust note */}
          <View style={styles.trustRow}>
            <View style={{marginTop: 2}}>
              <Icon name="security" size={16} color={Colors.onSurfaceVariant} />
            </View>
            <Text style={styles.trustText}>
              Your identity helps maintain trust, safety, and verified experiences across the CoBuddy community.
            </Text>
          </View>
        </ScrollView>

        <BottomActionBar>
          <PrimaryButton label="Continue" onPress={handleContinue} disabled={!isValid} />
        </BottomActionBar>

        {/* ── Avatar picker bottom sheet ── */}
        <AppBottomSheet
          visible={showAvatarSheet}
          onClose={() => setShowAvatarSheet(false)}
          title="Profile Photo">
          <View style={picker.list}>
            {/* Upload Photo */}
            <TouchableOpacity
              style={picker.option}
              onPress={() => handleAvatarOption('photo')}
              activeOpacity={0.8}>
              <View style={picker.optionIcon}>
                <Icon name="image" size={22} color={Colors.primary} />
              </View>
              <View style={picker.optionMeta}>
                <Text style={picker.optionLabel}>Upload Photo</Text>
                <Text style={picker.optionDesc}>Choose from your photo library</Text>
              </View>
              <Text style={picker.optionArrow}>›</Text>
            </TouchableOpacity>

            <View style={picker.divider} />

            {/* Take Selfie */}
            <TouchableOpacity
              style={picker.option}
              onPress={() => handleAvatarOption('selfie')}
              activeOpacity={0.8}>
              <View style={picker.optionIcon}>
                <Icon name="camera-front" size={22} color={Colors.primary} />
              </View>
              <View style={picker.optionMeta}>
                <Text style={picker.optionLabel}>Take Selfie</Text>
                <Text style={picker.optionDesc}>Use your front camera</Text>
              </View>
              <Text style={picker.optionArrow}>›</Text>
            </TouchableOpacity>

            <View style={picker.divider} />

            {/* Skip */}
            <TouchableOpacity
              style={picker.option}
              onPress={() => handleAvatarOption('skip')}
              activeOpacity={0.8}>
              <View style={[picker.optionIcon, picker.optionIconGhost]}>
                <Icon name="skip-next" size={22} color={Colors.onSurfaceVariant} />
              </View>
              <View style={picker.optionMeta}>
                <Text style={[picker.optionLabel, picker.optionLabelMuted]}>Skip For Now</Text>
                <Text style={picker.optionDesc}>You can add a photo later from your profile</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={picker.bottomNote}>
            <View style={{flexDirection:'row', alignItems:'flex-start', gap:8, paddingBottom: 2}}>
              <View style={{marginTop: 1}}>
                <Icon name="security" size={14} color={Colors.onSurfaceVariant} />
              </View>
              <Text style={[picker.bottomNoteText, {flex:1}]}>Photo will only be visible to verified members during active sessions.</Text>
            </View>
          </View>
        </AppBottomSheet>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: {flex: 1, backgroundColor: Colors.surface},
  container: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24},

  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(212,175,55,0.03)',
  },

  wordmark: {fontSize: 15, fontWeight: '700', color: Colors.primary, letterSpacing: 3},
  dotsRow: {flexDirection: 'row', gap: 5},
  dot: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  dotActive: {backgroundColor: Colors.primary},

  stepLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: 'rgba(212,175,55,0.8)',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: Colors.onSurface,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },

  formCard: {
    backgroundColor: 'rgba(11,13,26,0.6)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 24,
    gap: 18,
    marginBottom: 18,
  },

  // Avatar
  photoSection: {alignItems: 'center', gap: 6},
  photoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: 'rgba(212,175,55,0.4)',
    backgroundColor: Colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  photoCircleSelected: {borderColor: Colors.primary},
  photoIcon: {fontSize: 30, opacity: 0.5},
  photoAddBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoAddIcon: {fontSize: 14, color: Colors.onPrimary, fontWeight: '700', lineHeight: 18},
  avatarFill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFillIcon: {fontSize: 36, opacity: 0.7},
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {fontSize: 11, color: Colors.onSurfaceVariant},
  photoLabel: {fontSize: 14, color: Colors.primary, fontWeight: '600'},
  photoHint: {fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.7},

  // Fields
  field: {gap: 6},
  fieldLabel: {fontSize: 13, color: Colors.onSurfaceVariant},
  underlineInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.onSurface,
  },
  underlineInputError: {borderBottomColor: Colors.error},
  errorText: {fontSize: 12, color: Colors.error},

  ageGenderRow: {flexDirection: 'row', gap: 20},
  underlineSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
  },
  selectValue: {fontSize: 16, color: Colors.onSurface},
  selectPlaceholder: {fontSize: 16, color: Colors.onSurfaceVariant},
  chevron: {fontSize: 14, color: Colors.onSurfaceVariant},
  dropdown: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    zIndex: 100,
    overflow: 'hidden',
  },
  dropdownItem: {paddingVertical: 12, paddingHorizontal: 16},
  dropdownText: {fontSize: 15, color: Colors.onSurfaceVariant},
  dropdownTextActive: {color: Colors.primary},

  ageHint: {fontSize: 10, color: Colors.onSurfaceVariant, opacity: 0.5, marginTop: -10},

  cityRow: {flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8},
  locationIcon: {fontSize: 14, opacity: 0.7},
  cityInput: {flex: 1, fontSize: 16, color: Colors.onSurface, paddingVertical: 0},

  bioWrap: {
    backgroundColor: 'rgba(15,14,10,0.5)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  bioInput: {fontSize: 15, color: Colors.onSurface, minHeight: 80, textAlignVertical: 'top'},

  trustRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 4},
  trustIcon: {fontSize: 14, marginTop: 2},
  trustText: {flex: 1, fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18, opacity: 0.75},
});

// Avatar picker sheet styles
const picker = StyleSheet.create({
  list: {gap: 2, paddingBottom: 8},
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  optionIconGhost: {backgroundColor: 'rgba(255,255,255,0.05)'},
  optionIconText: {fontSize: 20},
  optionMeta: {flex: 1},
  optionLabel: {fontSize: 16, fontWeight: '500', color: Colors.onSurface, marginBottom: 2},
  optionLabelMuted: {color: Colors.onSurfaceVariant},
  optionDesc: {fontSize: 12, color: Colors.onSurfaceVariant},
  optionArrow: {fontSize: 20, color: Colors.onSurfaceVariant},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginLeft: 58,
  },
  bottomNote: {
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  bottomNoteText: {fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
});
