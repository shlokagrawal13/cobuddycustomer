import React from 'react';
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
import type {ConciergeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {useNotificationPrefsStore} from '../../store/notificationPrefsStore';

// Stitch: notifications_activity_preferences_screen
// "Notification Preferences" | "Control trusted updates, concierge communications, and premium experience reminders."
// verified_user System Status Protected & Connected | Concierge Active | Trusted Updates
// emergency Priority Safety Notifications (always on)
// event Session Reminders | support_agent Concierge Messages | group Trusted Contacts
// stars Premium Experiences | card_membership Reward Updates | forum Community Networking
// bedtime Quiet Hours 10PM-7AM | info Emergency override enabled | Edit Quiet Hours
// Preview: concierge notification sample
// Daily Summary / Weekly Curated / Monthly Overview
// Reset Defaults | Save Preferences

type Props = NativeStackScreenProps<ConciergeStackParamList, 'NotificationPreferences'>;

const CARD_BG     = 'rgba(11,13,26,0.85)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

type Toggle = {
  id: string;
  icon: string;
  label: string;
  sub: string;
  locked?: boolean;
};

const NOTIFICATION_TOGGLES: Toggle[] = [
  {id: 'session',    icon: 'event',           label: 'Session Reminders',      sub: 'Upcoming scheduled sessions'},
  {id: 'concierge',  icon: 'support-agent',   label: 'Concierge Messages',     sub: 'Direct support & planning'},
  {id: 'contacts',   icon: 'group',           label: 'Trusted Contacts',       sub: 'Status updates & alerts'},
  {id: 'premium',    icon: 'stars',           label: 'Premium Experiences',    sub: 'Exclusive invitations'},
  {id: 'rewards',    icon: 'card-membership', label: 'Reward Updates',         sub: 'Loyalty tier & benefits'},
  {id: 'community',  icon: 'forum',           label: 'Community Networking',   sub: 'Verified member activity'},
];

const DIGEST_OPTIONS = ['Daily Summary', 'Weekly Curated', 'Monthly Overview'];

export default function NotificationPreferencesScreen({navigation}: Props) {
  // Persist toggles and digest to Zustand store — survives screen unmount/remount
  const {toggles, digest, setToggle, setDigest, resetToDefaults} =
    useNotificationPrefsStore();

  const flipToggle = (id: string) => {
    setToggle(id, !toggles[id]);
  };

  const handleSave = () => {
    // Preferences already written to store on each toggle/digest change.
    // Show confirmation to the user.
    Alert.alert(
      'Preferences Saved',
      'Your notification preferences have been updated and will take effect immediately.',
      [{text: 'OK'}],
    );
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Defaults',
      'This will restore all notification settings to recommended defaults.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Reset', onPress: () => resetToDefaults()},
      ],
    );
  };

  const handleEditQuietHours = () => {
    Alert.alert(
      'Quiet Hours',
      'Quiet hours: 10:00 PM to 7:00 AM daily. Full time-picker control will be available in the next release.',
      [{text: 'OK'}],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero — Stitch: "Control trusted updates, concierge communications, and premium experience reminders." */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <View style={styles.heroTop}>
            <Icon name="notifications" size={28} color={Colors.primary} />
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Notification Preferences</Text>
              <Text style={styles.heroSub}>
                Control trusted updates, concierge communications, and premium experience reminders.
              </Text>
            </View>
          </View>

          {/* System status chips — Stitch: verified_user Protected | Concierge Active | Trusted Updates */}
          <View style={styles.statusRow}>
            <View style={styles.statusChip}>
              <Icon name="verified-user" size={11} color={Colors.success} />
              <Text style={styles.statusChipText}>Protected</Text>
            </View>
            <View style={styles.statusChip}>
              <Icon name="support-agent" size={11} color={Colors.primary} />
              <Text style={styles.statusChipText}>Concierge Active</Text>
            </View>
            <View style={styles.statusChip}>
              <Icon name="check-circle" size={11} color={Colors.info} />
              <Text style={styles.statusChipText}>Trusted Updates</Text>
            </View>
          </View>
        </View>

        {/* Priority Safety — Stitch: emergency always on, locked */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PRIORITY</Text>
          <View style={styles.safetyRow}>
            <View style={styles.safetyIcon}>
              <Icon name="emergency" size={20} color={Colors.error} />
            </View>
            <View style={styles.safetyMeta}>
              <Text style={styles.safetyLabel}>Priority Safety Notifications</Text>
              <Text style={styles.safetySub}>Emergency alerts cannot be disabled for your protection.</Text>
            </View>
            <View style={styles.alwaysOnChip}>
              <Text style={styles.alwaysOnText}>Always On</Text>
            </View>
          </View>
        </View>

        {/* Communication Channels — 6 toggles */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>COMMUNICATION CHANNELS</Text>
          {NOTIFICATION_TOGGLES.map((item, i) => (
            <View
              key={item.id}
              style={[styles.toggleRow, i < NOTIFICATION_TOGGLES.length - 1 && styles.toggleRowBorder]}>
              <View style={styles.toggleIcon}>
                <Icon name={item.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.toggleMeta}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <Text style={styles.toggleSub}>{item.sub}</Text>
              </View>
              <TouchableOpacity
                style={[styles.toggleSwitch, toggles[item.id] && styles.toggleSwitchOn]}
                onPress={() => flipToggle(item.id)}
                activeOpacity={0.8}>
                <View style={[styles.toggleKnob, toggles[item.id] && styles.toggleKnobOn]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Quiet Hours — Stitch: bedtime Quiet Hours 10PM-7AM */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>FOCUS & QUIET</Text>
          <View style={styles.quietRow}>
            <View style={styles.quietIcon}>
              <Icon name="bedtime" size={18} color={Colors.info} />
            </View>
            <View style={styles.quietMeta}>
              <Text style={styles.quietLabel}>Quiet Hours Active</Text>
              <Text style={styles.quietSub}>10:00 PM - 7:00 AM Daily</Text>
              <View style={styles.quietInfoRow}>
                <Icon name="info" size={11} color={Colors.onSurfaceVariant} />
                <Text style={styles.quietInfoText}>Emergency override is enabled</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.editQuietBtn}
              onPress={handleEditQuietHours}
              activeOpacity={0.8}>
              <Text style={styles.editQuietText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preview — Stitch: concierge + session notification sample */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PREVIEW</Text>
          <View style={styles.previewItem}>
            <View style={styles.previewIconWrap}>
              <Icon name="support-agent" size={16} color={Colors.primary} />
            </View>
            <View style={styles.previewMeta}>
              <Text style={styles.previewTitle}>Concierge Desk</Text>
              <Text style={styles.previewSub}>
                Your verified companion for tomorrow's session has confirmed the itinerary.
              </Text>
              <Text style={styles.previewTime}>Just now</Text>
            </View>
          </View>
          <View style={[styles.previewItem, styles.previewItemBorder]}>
            <View style={styles.previewIconWrap}>
              <Icon name="event" size={16} color={Colors.info} />
            </View>
            <View style={styles.previewMeta}>
              <Text style={styles.previewTitle}>Session Reminder</Text>
              <Text style={styles.previewSub}>
                Upcoming session starting at 6:30 PM tonight.
              </Text>
              <Text style={styles.previewTime}>2h ago</Text>
            </View>
          </View>
        </View>

        {/* Activity Digest — Stitch: Daily Summary / Weekly Curated / Monthly Overview */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>ACTIVITY DIGEST</Text>
          <Text style={styles.digestDesc}>Receive a curated summary of non-urgent updates.</Text>
          <View style={styles.digestRow}>
            {DIGEST_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.digestChip, digest === opt && styles.digestChipSelected]}
                onPress={() => setDigest(opt)}
                activeOpacity={0.8}>
                <Text style={[styles.digestChipText, digest === opt && styles.digestChipTextSelected]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{height: 16}} />
      </ScrollView>

      {/* Footer — Stitch: Reset Defaults | Save Preferences */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
          <Text style={styles.resetBtnText}>Reset Defaults</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // Header
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(20,20,15,0.95)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerSpacer: {width: 40},

  // Hero
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER,
    padding: 20, gap: 14, overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -40, alignSelf: 'center',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  heroTop: {flexDirection: 'row', alignItems: 'flex-start', gap: 14},
  heroText: {flex: 1, gap: 4},
  heroTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  statusRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  statusChipText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurface},

  // Generic card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 20,
  },
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14},

  // Safety row
  safetyRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  safetyIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,180,171,0.08)',
    borderWidth: 1, borderColor: 'rgba(255,180,171,0.20)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  safetyMeta: {flex: 1},
  safetyLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface, marginBottom: 2},
  safetySub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
  alwaysOnChip: {
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.30)', flexShrink: 0,
  },
  alwaysOnText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success},

  // Toggle rows
  toggleRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12},
  toggleRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  toggleIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  toggleMeta: {flex: 1},
  toggleLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface, marginBottom: 2},
  toggleSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  toggleSwitch: {
    width: 44, height: 24, borderRadius: 12,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    justifyContent: 'center', paddingHorizontal: 2, flexShrink: 0,
  },
  toggleSwitchOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  toggleKnob: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.onSurfaceVariant,
    alignSelf: 'flex-start',
  },
  toggleKnobOn: {backgroundColor: Colors.onPrimary, alignSelf: 'flex-end'},

  // Quiet hours
  quietRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 14},
  quietIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(137,180,224,0.10)',
    borderWidth: 1, borderColor: 'rgba(137,180,224,0.25)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    marginTop: 2,
  },
  quietMeta: {flex: 1, gap: 4},
  quietLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  quietSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  quietInfoRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  quietInfoText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  editQuietBtn: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: CARD_BORDER, flexShrink: 0,
  },
  editQuietText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onSurface},

  // Preview items
  previewItem: {flexDirection: 'row', gap: 12, paddingVertical: 10},
  previewItemBorder: {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER},
  previewIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  previewMeta: {flex: 1, gap: 2},
  previewTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  previewSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 16},
  previewTime: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.primary},

  // Digest
  digestDesc: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 12, lineHeight: 18},
  digestRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  digestChip: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  digestChipSelected: {backgroundColor: 'rgba(242,202,80,0.10)', borderColor: GOLD_BORDER},
  digestChipText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  digestChipTextSelected: {color: Colors.primary, fontFamily: 'Inter-SemiBold'},

  // Footer
  footer: {
    flexDirection: 'row', gap: 12,
    paddingHorizontal: 16, paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(20,20,15,0.95)',
  },
  resetBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  resetBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  saveBtn: {
    flex: 2, paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary},
});
