import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Linking, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AuthStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<AuthStackParamList, 'PermissionRecovery'>;

const BORDER  = 'rgba(255,255,255,0.08)';
const CARD_BG = 'rgba(11,13,26,0.55)';
const GOLD_BG = 'rgba(242,202,80,0.10)';
const GOLD_BD = 'rgba(242,202,80,0.22)';
const WARN_BG = 'rgba(242,170,60,0.10)';
const WARN_BD = 'rgba(242,170,60,0.25)';

interface Permission {
  id: string;
  title: string;
  description: string;
  icon: string;
  required: boolean;
  status: 'denied' | 'not_requested';
}

const PERMISSIONS: Permission[] = [
  {
    id: 'location',
    title: 'Location Access',
    description: 'Required for venue navigation, trusted contact tracking and arrival verification.',
    icon: 'location-on',
    required: true,
    status: 'denied',
  },
  {
    id: 'notifications',
    title: 'Push Notifications',
    description: 'Required for session reminders, concierge messages and safety alerts.',
    icon: 'notifications',
    required: true,
    status: 'denied',
  },
  {
    id: 'camera',
    title: 'Camera',
    description: 'Used for identity verification and digital pass scanning at venues.',
    icon: 'camera-alt',
    required: false,
    status: 'not_requested',
  },
  {
    id: 'contacts',
    title: 'Contacts',
    description: 'Optional — used to simplify adding trusted contacts to your safety network.',
    icon: 'contacts',
    required: false,
    status: 'not_requested',
  },
];

const openSettings = () => {
  Linking.openSettings().catch(() =>
    Alert.alert('Unable to Open Settings', 'Please open your device Settings and allow the required permissions for CoBuddy.'),
  );
};

export default function PermissionRecoveryScreen({navigation}: Props) {
  const requiredDenied = PERMISSIONS.filter(p => p.required && p.status === 'denied');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Permissions</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Icon name="security" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroHeading}>Permissions Required</Text>
          <Text style={styles.heroSub}>
            CoBuddy requires certain permissions to protect you during sessions and provide a seamless concierge experience.
          </Text>
        </View>

        {/* Alert bar */}
        {requiredDenied.length > 0 && (
          <View style={styles.alertBar}>
            <Icon name="warning-amber" size={18} color={Colors.warning} />
            <Text style={styles.alertBarText}>
              {requiredDenied.length} required {requiredDenied.length === 1 ? 'permission' : 'permissions'} need your attention.
            </Text>
          </View>
        )}

        {/* Permission cards */}
        {PERMISSIONS.map(perm => {
          const isDenied = perm.status === 'denied';
          return (
            <View
              key={perm.id}
              style={[styles.permCard, isDenied && perm.required && styles.permCardWarn]}>
              <View style={styles.permTop}>
                <View style={[styles.permIconWrap, isDenied && perm.required && styles.permIconWarnBg]}>
                  <Icon
                    name={perm.icon}
                    size={22}
                    color={isDenied && perm.required ? Colors.warning : Colors.primary}
                  />
                </View>
                <View style={styles.permInfo}>
                  <View style={styles.permTitleRow}>
                    <Text style={styles.permTitle}>{perm.title}</Text>
                    {perm.required ? (
                      <View style={styles.requiredPill}>
                        <Text style={styles.requiredPillText}>Required</Text>
                      </View>
                    ) : (
                      <View style={styles.optionalPill}>
                        <Text style={styles.optionalPillText}>Optional</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.statusRow}>
                    <Icon
                      name={isDenied ? 'cancel' : 'check-circle'}
                      size={12}
                      color={isDenied ? Colors.error : Colors.success}
                    />
                    <Text style={[styles.statusText, {color: isDenied ? Colors.error : Colors.success}]}>
                      {isDenied ? 'Denied' : 'Not yet requested'}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.permDesc}>{perm.description}</Text>
            </View>
          );
        })}

        {/* Open Settings CTA */}
        <TouchableOpacity style={styles.settingsBtn} onPress={openSettings} activeOpacity={0.87}>
          <Icon name="settings" size={18} color={Colors.surface} />
          <Text style={styles.settingsBtnText}>Open App Settings</Text>
        </TouchableOpacity>

        {/* Help note */}
        <View style={styles.helpNote}>
          <Icon name="support-agent" size={14} color={Colors.primary} />
          <Text style={styles.helpNoteText}>
            If you are having difficulty granting permissions, contact your concierge or our support team.
          </Text>
        </View>

        {/* Continue without (optional perms only) */}
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.skipBtnText}>Continue with Current Settings</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 60, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 14},

  hero: {alignItems: 'center', gap: 12, paddingBottom: 4},
  heroIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center',
  },
  heroHeading: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.onSurface, textAlign: 'center'},
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 22, maxWidth: 300,
  },

  alertBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: WARN_BG, borderRadius: 12,
    borderWidth: 1, borderColor: WARN_BD, padding: 12,
  },
  alertBarText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.warning, flex: 1},

  permCard: {
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 16, gap: 10,
  },
  permCardWarn: {borderColor: WARN_BD, backgroundColor: WARN_BG},
  permTop: {flexDirection: 'row', alignItems: 'flex-start', gap: 12},
  permIconWrap: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  permIconWarnBg: {backgroundColor: WARN_BG, borderColor: WARN_BD},
  permInfo: {flex: 1, gap: 5},
  permTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  permTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  requiredPill: {
    backgroundColor: 'rgba(220,80,80,0.12)', borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: 'rgba(220,80,80,0.28)',
  },
  requiredPillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.error, letterSpacing: 0.8},
  optionalPill: {
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: GOLD_BD,
  },
  optionalPillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 0.8},
  statusRow: {flexDirection: 'row', alignItems: 'center', gap: 5},
  statusText: {fontFamily: 'Inter-Regular', fontSize: 12},
  permDesc: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20},

  settingsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15,
  },
  settingsBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.surface},

  helpNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: GOLD_BG, borderRadius: 12,
    borderWidth: 1, borderColor: GOLD_BD, padding: 12,
  },
  helpNoteText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },

  skipBtn: {paddingVertical: 14, alignItems: 'center'},
  skipBtnText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurfaceVariant},
});
