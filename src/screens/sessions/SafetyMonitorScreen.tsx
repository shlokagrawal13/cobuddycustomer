import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch ref: live_session_safety_monitor_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'SafetyMonitor'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';
const ERR_BG      = 'rgba(255,180,171,0.10)';
const ERR_BD      = 'rgba(255,180,171,0.28)';


const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

function formatElapsed(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const TIMELINE = [
  {icon: 'person-pin-circle', time: 'Just Now',      label: 'Safety Monitoring Enabled',        note: 'Continuous protection protocol active.'},
  {icon: 'meeting-room',      time: '01:20:00 Ago',  label: 'Session Commenced',                 note: 'Initial check-in completed successfully.'},
  {icon: 'where-to-vote',    time: '01:35:00 Ago',  label: 'Arrival Verified',                  note: 'User located at trusted venue perimeter.'},
];

export default function SafetyMonitorScreen({navigation, route}: Props) {
  const {sessionId} = route.params;
  const [elapsed, setElapsed] = useState(5055); // 01:24:15
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSafe = () => {
    Alert.alert(
      'Check-In Confirmed',
      'Your trusted contacts have been notified that you are safe. Stay protected.',
      [{text: 'Thank you', style: 'default'}],
    );
  };

  const handleAssistance = () => {
    (navigation as any).navigate('ConciergeNavigator', {
      screen: 'MessagingThread',
      params: {conversationId: 'concierge_main'},
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.liveDot} />
          <Text style={styles.headerTitle}>Live Monitoring Active</Text>
        </View>
        <View style={styles.backBtn} />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIconWrap}>
            <Icon name="shield" size={32} color={Colors.success} />
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroTitle}>Protected Session Active</Text>
            <Text style={styles.heroSub}>
              Your trusted experience is currently monitored with live safety protection systems.
            </Text>
          </View>
        </View>

        {/* Session Security card */}
        <View style={[styles.card, styles.securityCard]}>
          <View style={styles.securityHeader}>
            <Icon name="shield" size={18} color={Colors.success} />
            <Text style={styles.securityTitle}>Session Security</Text>
            <View style={styles.activePill}>
              <View style={styles.activeDot} />
              <Text style={styles.activePillText}>ACTIVE</Text>
            </View>
          </View>
          <Text style={styles.securitySub}>Comprehensive protection active</Text>

          {/* Elapsed timer */}
          <View style={styles.elapsedRow}>
            <Text style={styles.elapsedLabel}>ELAPSED TIME</Text>
            <Text style={styles.elapsedTimer}>{formatElapsed(elapsed)}</Text>
          </View>

          {/* Security items */}
          <View style={styles.securityItemsWrap}>
            <View style={styles.securityItem}>
              <View style={styles.securityIconWrap}>
                <Icon name="verified" size={16} color={Colors.success} />
              </View>
              <View style={styles.securityItemMeta}>
                <Text style={styles.securityItemTitle}>Trusted Venue</Text>
                <Text style={styles.securityItemNote}>Location verified against safety database.</Text>
              </View>
            </View>
            <View style={[styles.securityItem, styles.securityItemBorder]}>
              <View style={styles.securityIconWrap}>
                <Icon name="support-agent" size={16} color={Colors.primary} />
              </View>
              <View style={styles.securityItemMeta}>
                <Text style={styles.securityItemTitle}>Concierge Active</Text>
                <Text style={styles.securityItemNote}>Dedicated agent monitoring timeline.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Operational Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Operational Timeline</Text>
          {TIMELINE.map((item, i) => (
            <View
              key={item.label}
              style={[styles.timelineRow, i < TIMELINE.length - 1 && styles.timelineRowBorder]}>
              <View style={styles.timelineIconWrap}>
                <Icon name={item.icon} size={18} color={i === 0 ? Colors.primary : Colors.success} />
              </View>
              <View style={styles.timelineMeta}>
                <Text style={styles.timelineTime}>{item.time}</Text>
                <Text style={styles.timelineLabel}>{item.label}</Text>
                <Text style={styles.timelineNote}>{item.note}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Live Safety Check */}
        <View style={[styles.card, styles.checkInCard]}>
          <View style={styles.checkInHeader}>
            <Icon name="health-and-safety" size={20} color={Colors.primary} />
            <Text style={styles.checkInTitle}>Live Safety Check</Text>
          </View>
          <Text style={styles.checkInSub}>
            Please confirm your trusted experience is proceeding comfortably.
          </Text>
          <TouchableOpacity style={styles.safeBtn} onPress={handleSafe} activeOpacity={0.88}>
            <Icon name="check-circle" size={16} color={Colors.onPrimary} />
            <Text style={styles.safeBtnText}>I'm Safe & Comfortable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.assistanceBtn}
            onPress={handleAssistance}
            activeOpacity={0.8}>
            <Icon name="sos" size={15} color={Colors.error} />
            <Text style={styles.assistanceBtnText}>Request Assistance</Text>
          </TouchableOpacity>
        </View>

        {/* Concierge */}
        <View style={styles.card}>
          <View style={styles.conciergeRow}>
            <View style={styles.conciergeAvatar}>
              <Icon name="person" size={20} color={Colors.primary} />
            </View>
            <View style={styles.conciergeMeta}>
              <Text style={styles.conciergeLabel}>Concierge Assigned</Text>
              <Text style={styles.conciergeNote}>Agent Sarah is monitoring.</Text>
            </View>
            <TouchableOpacity
              style={styles.chatBtn}
              onPress={handleAssistance}
              activeOpacity={0.8}>
              <Icon name="chat" size={15} color={Colors.primary} />
              <Text style={styles.chatBtnText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trusted Contacts */}
        <View style={styles.card}>
          <View style={styles.contactsHeader}>
            <Text style={styles.cardTitle}>Trusted Contacts</Text>
            <View style={styles.securePill}>
              <Icon name="lock" size={10} color={Colors.success} />
              <Text style={styles.securePillText}>Secure</Text>
            </View>
          </View>
          <View style={styles.contactsAvatarRow}>
            {[0, 1].map(i => (
              <View key={i} style={styles.contactAvatar}>
                <Icon name="person" size={20} color={Colors.onSurfaceVariant} />
              </View>
            ))}
            <View style={styles.notifiedBadge}>
              <Text style={styles.notifiedText}>2 Notified</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.manageContactsBtn}
            onPress={() => (navigation as any).navigate('SafetyNavigator', {screen: 'TrustedContacts'})}
            activeOpacity={0.8}>
            <Text style={styles.manageContactsBtnText}>Manage Contacts</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 24}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 12, gap: 14},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerCenter: {flexDirection: 'row', alignItems: 'center', gap: 8},
  liveDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},

  // Hero
  heroBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 14,
    backgroundColor: SUCCESS_BG, borderRadius: 20,
    borderWidth: 1, borderColor: SUCCESS_BD, padding: 16,
  },
  heroIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: SUCCESS_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  heroMeta: {flex: 1, gap: 6},
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 16, color: Colors.onSurface},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},

  // Security card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  cardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  securityCard: {borderColor: 'rgba(109,217,140,0.20)', backgroundColor: 'rgba(109,217,140,0.04)'},
  securityHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  securityTitle: {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.success},
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  activeDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.success},
  activePillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 0.8},
  securitySub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: -4},
  elapsedRow: {
    backgroundColor: 'rgba(109,217,140,0.08)',
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.18)',
    alignItems: 'center', gap: 4,
  },
  elapsedLabel: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5},
  elapsedTimer: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: Colors.onSurface, letterSpacing: 2},
  securityItemsWrap: {gap: 0},
  securityItem: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  securityItemBorder: {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER},
  securityIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(109,217,140,0.12)',
    borderWidth: 1, borderColor: SUCCESS_BD,
    alignItems: 'center', justifyContent: 'center',
  },
  securityItemMeta: {flex: 1},
  securityItemTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  securityItemNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Timeline
  timelineRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10},
  timelineRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  timelineIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  timelineMeta: {flex: 1, gap: 2},
  timelineTime: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary, letterSpacing: 0.3},
  timelineLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  timelineNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},

  // Check-in card
  checkInCard: {borderColor: GOLD_BORDER},
  checkInHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  checkInTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  checkInSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20},
  safeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.success, borderRadius: 100, paddingVertical: 13,
  },
  safeBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.surface},
  assistanceBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: ERR_BD,
    backgroundColor: ERR_BG, borderRadius: 100, paddingVertical: 11,
  },
  assistanceBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.error},

  // Concierge
  conciergeRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  conciergeAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  conciergeMeta: {flex: 1},
  conciergeLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  conciergeNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  chatBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderColor: GOLD_BORDER,
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7,
  },
  chatBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},

  // Contacts
  contactsHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  securePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  securePillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success},
  contactsAvatarRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  contactAvatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  notifiedBadge: {
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  notifiedText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.success},
  manageContactsBtn: {
    alignItems: 'center', paddingVertical: 6,
  },
  manageContactsBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
});
