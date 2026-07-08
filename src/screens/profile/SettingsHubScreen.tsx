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
import {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'SettingsHub'>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This feature will be connected in the next phase.');

// ─── Section data ────────────────────────────────────────────────────────────
interface SettingRow {
  id: string;
  iconName: string;
  label: string;
  sub?: string;
  type: 'nav' | 'toggle' | 'danger';
  onPress?: () => void;
}

interface Section {
  title: string;
  rows: SettingRow[];
}

export default function SettingsHubScreen({navigation}: Props) {
  const [toggles, setToggles] = useState({
    push: true,
    email: true,
    reminders: true,
  });

  const flipToggle = (key: keyof typeof toggles) =>
    setToggles(prev => ({...prev, [key]: !prev[key]}));

  const SECTIONS: Section[] = [
    {
      title: 'ACCOUNT',
      rows: [
        {id: 'profile', iconName: 'person',   label: 'Edit Profile',          sub: 'Update name, bio, photo',        type: 'nav', onPress: () => navigation.navigate('EditProfile')},
        {id: 'phone',   iconName: 'phone',    label: 'Change Phone Number',    sub: 'Update your verified number',    type: 'nav', onPress: () => navigation.navigate('ChangePhone')},
        {id: 'lang',    iconName: 'language', label: 'Language & Region',      sub: 'English (UK)',                   type: 'nav', onPress: () => navigation.navigate('LanguageSelection')},
        {id: 'perms',   iconName: 'admin-panel-settings', label: 'App Permissions', sub: 'Review and recover permissions', type: 'nav', onPress: () => navigation.navigate('PermissionRecovery')},
      ],
    },
    {
      title: 'PRIVACY & SAFETY',
      rows: [
        {id: 'privacy',  iconName: 'lock',     label: 'Privacy Controls', sub: 'Manage data & visibility', type: 'nav', onPress: () => navigation.navigate('LifestylePreferences')},
        {id: 'blocked',  iconName: 'block',    label: 'Blocked Users', sub: 'Manage your block list', type: 'nav', onPress: () => navigation.navigate('BlockedUsers')},
        {id: 'safety',   iconName: 'security', label: 'Safety Settings', sub: 'SOS, trusted contacts', type: 'nav', onPress: () => (navigation as any).navigate('SafetyNavigator')},
      ],
    },
    {
      title: 'DATA CONTROL',
      rows: [
        {id: 'portability', iconName: 'download',   label: 'Data Portability', sub: 'Download a copy of your data',      type: 'nav', onPress: () => navigation.navigate('DataPortability')},
        {id: 'retention',   iconName: 'history',    label: 'Data Retention',   sub: 'Control how long data is kept',     type: 'nav', onPress: () => navigation.navigate('DataRetention')},
        {id: 'consent',     iconName: 'fact-check', label: 'Consent Manager',  sub: 'Review third-party permissions',    type: 'nav', onPress: () => navigation.navigate('ConsentManager')},
      ],
    },
    {
      title: 'NOTIFICATIONS',
      rows: [
        {id: 'push',      iconName: 'notifications', label: 'Push Notifications', sub: 'Alerts & updates on device', type: 'toggle'},
        {id: 'email',     iconName: 'email',          label: 'Email Notifications', sub: 'Booking confirmations & news', type: 'toggle'},
        {id: 'reminders', iconName: 'event',          label: 'Session Reminders', sub: 'Pre-session alerts', type: 'toggle'},
        {id: 'notifprefs', iconName: 'tune',           label: 'Notification Preferences', sub: 'Fine-tune all notification types', type: 'nav', onPress: () => (navigation as any).navigate('ConciergeNavigator', {screen: 'NotificationPreferences'})},
      ],
    },
    {
      title: 'APPEARANCE',
      rows: [
        {id: 'theme', iconName: 'palette',     label: 'App Theme', sub: 'Dark (default)', type: 'nav', onPress: () => navigation.navigate('Appearance')},
        {id: 'text',  iconName: 'text-fields', label: 'Text Size', sub: 'Standard', type: 'nav', onPress: () => navigation.navigate('TextSize')},
      ],
    },
    {
      title: 'SUPPORT',
      rows: [
        {id: 'help',    iconName: 'help',        label: 'Help Center', sub: 'FAQs & guides', type: 'nav', onPress: () => (navigation as any).navigate('ConciergeNavigator', {screen: 'HelpCenter'})},
        {id: 'contact', iconName: 'headset-mic', label: 'Contact Support', sub: 'Talk to our team', type: 'nav', onPress: () => (navigation as any).navigate('ConciergeNavigator', {screen: 'MessagingThread', params: {conversationId: 'concierge_main'}})},
        {id: 'report',  iconName: 'report',      label: 'Report a Problem', sub: 'Flag an issue or bug', type: 'nav', onPress: () => (navigation as any).navigate('ConciergeNavigator', {screen: 'MessagingThread', params: {conversationId: 'concierge_main'}})},
      ],
    },
  ];

  const DANGER_ROWS: SettingRow[] = [
    {
      id: 'deactivate',
      iconName: 'warning',
      label: 'Deactivate Account',
      sub: 'Temporarily disable your account',
      type: 'danger',
      onPress: () =>
        Alert.alert(
          'Deactivate Account',
          'Your account will be temporarily disabled. You can reactivate at any time.',
          [{text: 'Cancel', style: 'cancel'}, {text: 'Deactivate', style: 'destructive', onPress: () => (navigation as any).navigate('ModalNavigator', {screen: 'AccountDeactivated'})}],
        ),
    },
    {
      id: 'delete',
      iconName: 'delete-forever',
      label: 'Delete Account',
      sub: 'Permanently remove all your data',
      type: 'danger',
      onPress: () =>
        Alert.alert(
          'Delete Account',
          'This action is permanent and cannot be undone. All data will be erased.',
          [{text: 'Cancel', style: 'cancel'}, {text: 'Delete', style: 'destructive', onPress: () => (navigation as any).navigate('ModalNavigator', {screen: 'DeleteAccount'})}],
        ),
    },
  ];

  const getToggleKey = (id: string): keyof typeof toggles | null => {
    if (id === 'push') {return 'push';}
    if (id === 'email') {return 'email';}
    if (id === 'reminders') {return 'reminders';}
    return null;
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Privacy-first banner */}
        <View style={styles.privacyBanner}>
          <View style={styles.privacyBannerHeader}>
            <View style={styles.privacyBannerIconWrap}>
              <Icon name="shield" size={16} color={Colors.success} />
            </View>
            <View style={styles.privacyBannerMeta}>
              <Text style={styles.privacyBannerTitle}>Your Privacy, Our Priority</Text>
              <Text style={styles.privacyBannerSub}>CoBuddy is built on a privacy-first architecture.</Text>
            </View>
          </View>
          <View style={styles.privacyPillarsRow}>
            <View style={styles.privacyPillar}>
              <Icon name="storage" size={14} color={Colors.primary} />
              <Text style={styles.privacyPillarLabel}>Data Sovereignty</Text>
              <Text style={styles.privacyPillarSub}>You own your data</Text>
            </View>
            <View style={styles.privacyPillarDivider} />
            <View style={styles.privacyPillar}>
              <Icon name="do-not-disturb-on" size={14} color={Colors.primary} />
              <Text style={styles.privacyPillarLabel}>Zero-Share Protocol</Text>
              <Text style={styles.privacyPillarSub}>Never sold to third parties</Text>
            </View>
            <View style={styles.privacyPillarDivider} />
            <View style={styles.privacyPillar}>
              <Icon name="enhanced-encryption" size={14} color={Colors.primary} />
              <Text style={styles.privacyPillarLabel}>Encrypted Vault</Text>
              <Text style={styles.privacyPillarSub}>AES-256 at rest</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        {SECTIONS.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.rows.map((row, idx) => {
                const isLast = idx === section.rows.length - 1;
                const toggleKey = getToggleKey(row.id);
                const isToggle = row.type === 'toggle' && toggleKey !== null;

                return (
                  <TouchableOpacity
                    key={row.id}
                    style={[styles.row, !isLast && styles.rowBorder]}
                    onPress={isToggle ? () => flipToggle(toggleKey!) : row.onPress}
                    activeOpacity={isToggle ? 1 : 0.7}>
                    {/* Left icon */}
                    <View style={styles.rowIconWrap}>
                      <Icon name={row.iconName} size={18} color={Colors.primary} />
                    </View>
                    {/* Text */}
                    <View style={styles.rowMeta}>
                      <Text style={styles.rowLabel}>{row.label}</Text>
                      {row.sub ? <Text style={styles.rowSub}>{row.sub}</Text> : null}
                    </View>
                    {/* Right control */}
                    {isToggle ? (
                      <Switch
                        value={toggles[toggleKey!]}
                        onValueChange={() => flipToggle(toggleKey!)}
                        trackColor={{false: Colors.surfaceContainerHighest, true: Colors.primaryContainer}}
                        thumbColor={toggles[toggleKey!] ? Colors.primary : Colors.onSurfaceVariant}
                      />
                    ) : (
                      <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: Colors.error}]}>DANGER ZONE</Text>
          <View style={[styles.sectionCard, styles.dangerCard]}>
            {DANGER_ROWS.map((row, idx) => {
              const isLast = idx === DANGER_ROWS.length - 1;
              return (
                <TouchableOpacity
                  key={row.id}
                  style={[styles.row, !isLast && styles.rowBorder]}
                  onPress={row.onPress}
                  activeOpacity={0.7}>
                  <View style={[styles.rowIconWrap, styles.rowIconWrapDanger]}>
                    <Icon name={row.iconName} size={18} color={Colors.error} />
                  </View>
                  <View style={styles.rowMeta}>
                    <Text style={[styles.rowLabel, {color: Colors.error}]}>{row.label}</Text>
                    {row.sub ? <Text style={styles.rowSub}>{row.sub}</Text> : null}
                  </View>
                  <Icon name="chevron-right" size={18} color={Colors.error} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Version footer */}
        <Text style={styles.version}>CoBuddy v1.0.0</Text>
        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Header
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.onSurface,
    letterSpacing: 0.2,
  },
  headerSpacer: {width: 40},

  scroll: {flex: 1},
  scrollContent: {paddingTop: 16, paddingHorizontal: 16},

  // Privacy-first banner
  privacyBanner: {
    backgroundColor: 'rgba(109,217,140,0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.18)',
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  privacyBannerHeader: {flexDirection: 'row', alignItems: 'center', gap: 12},
  privacyBannerIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(109,217,140,0.12)',
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  privacyBannerMeta: {flex: 1},
  privacyBannerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.onSurface, marginBottom: 2,
  },
  privacyBannerSub: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 17,
  },
  privacyPillarsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  privacyPillar: {
    flex: 1, alignItems: 'center', gap: 4,
    paddingVertical: 12, paddingHorizontal: 6,
  },
  privacyPillarDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    marginVertical: 10,
  },
  privacyPillarLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurface, textAlign: 'center', letterSpacing: 0.2,
  },
  privacyPillarSub: {
    fontFamily: 'Inter-Regular', fontSize: 9,
    color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 13,
  },

  // Sections
  section: {marginBottom: 24},
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    marginBottom: 8,
    paddingLeft: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(11,13,26,0.8)',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  dangerCard: {
    borderColor: 'rgba(255,180,171,0.15)',
    backgroundColor: 'rgba(147,0,10,0.06)',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  rowIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(242,202,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowIconWrapDanger: {
    backgroundColor: 'rgba(255,180,171,0.08)',
  },
  rowMeta: {flex: 1},
  rowLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: Colors.onSurface,
    marginBottom: 2,
  },
  rowSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 17,
  },

  version: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    opacity: 0.5,
    marginTop: 8,
  },
});

