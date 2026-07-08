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

// Stitch refs: active_session_screen + active_session_detail_live_coordination_safety_experience

type Props = NativeStackScreenProps<SessionsStackParamList, 'ActiveSession'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');


function formatElapsed(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const TIMELINE = [
  {id: 'arrival', icon: 'check-circle', label: 'Arrival Verified', time: '14:00 PM', done: true},
  {id: 'started', icon: 'check-circle', label: 'Experience Started', time: '14:15 PM', done: true},
  {id: 'active',  icon: 'radio-button-checked', label: 'Session Active', time: 'Currently in progress', done: false, active: true},
  {id: 'end',     icon: 'flag',         label: 'Experience Completion', time: 'Estimated 16:00 PM', done: false},
];

const JOURNEY = [
  {time: '14:00', status: 'Completed', title: 'Arrived at Venue', note: null},
  {time: 'Current', status: 'Active', title: 'Afternoon Social', note: 'Concierge verified presence at Main Lounge.'},
  {time: '18:30', status: 'Scheduled', title: 'Evening Reservation', note: null},
];

const SAFETY_ICONS = [
  {icon: 'group',              label: 'Trusted contact\nmonitoring'},
  {icon: 'sos',                label: 'SOS support'},
  {icon: 'domain-verification',label: 'Venue\nverification'},
  {icon: 'support-agent',      label: 'Concierge\nenabled'},
];

const ACTION_ROWS = [
  {icon: 'update',         label: 'Extend Session',     fn: 'extend'},
  {icon: 'edit-calendar',  label: 'Modify Experience',  fn: 'modify'},
  {icon: 'chat-bubble',    label: 'Connect Concierge',  fn: 'concierge'},
  {icon: 'share-location', label: 'Share Location',     fn: 'demo'},
];

export default function ActiveSessionScreen({navigation, route}: Props) {
  const {sessionId} = route.params;
  const [elapsed, setElapsed] = useState(4530); // start at 1h 15m 30s to show demo
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(v => v + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const [showExtendBanner, setShowExtendBanner] = useState(true);

  const handleSOS = () => {
    Alert.alert(
      'SOS',
      'Emergency services contact — this is a demo session. In production this triggers your emergency protocol.',
      [{text: 'OK'}],
    );
  };

  const handleComplete = () => {
    navigation.navigate('CompleteSession', {sessionId});
  };

  const handleActionRow = (fn: string) => {
    if (fn === 'concierge') {
      (navigation as any).navigate('ConciergeNavigator', {
        screen: 'MessagingThread',
        params: {conversationId: 'concierge_main'},
      });
    } else if (fn === 'extend') {
      setShowExtendBanner(true);
    } else if (fn === 'modify') {
      navigation.navigate('ModifyBooking', {sessionId});
    } else {
      demoAlert();
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          activeOpacity={0.7}>
          <Icon name="expand-more" size={26} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Icon name="support-agent" size={16} color={Colors.primary} />
          <Text style={styles.headerTitle}>Trusted Hospitality Session</Text>
          <Icon name="shield" size={16} color={Colors.info} />
        </View>
        <TouchableOpacity
          style={[styles.sosBtn]}
          onPress={handleSOS}
          activeOpacity={0.85}>
          <Icon name="sos" size={16} color={Colors.error} />
          <Text style={styles.sosBtnText}>SOS</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Live chip + timer */}
        <View style={styles.liveRow}>
          <View style={styles.liveChip}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
          <Text style={styles.sessionActiveLabel}>Session Active</Text>
        </View>

        <Text style={styles.elapsedTimer}>{formatElapsed(elapsed)}</Text>

        {/* Session + venue */}
        <View style={styles.sessionInfoCard}>
          <Text style={styles.sessionTitle}>Curated Coffee Conversations</Text>
          <View style={styles.venueRow}>
            <Icon name="location-on" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.venueText}>The Roastery, Soho</Text>
          </View>
        </View>

        {/* Companion */}
        <View style={styles.card}>
          <View style={styles.companionRow}>
            <View style={styles.companionAvatar}>
              <Text style={styles.companionInitial}>E</Text>
            </View>
            <View style={styles.companionMeta}>
              <View style={styles.companionNameRow}>
                <Icon name="verified" size={14} color={Colors.success} />
                <Text style={styles.companionName}>Elena V.</Text>
              </View>
              <Text style={styles.companionRole}>Elite Companion - Verified Since 2022</Text>
            </View>
            <View style={styles.activeChip}>
              <View style={styles.activeDot} />
              <Text style={styles.activeChipText}>Active</Text>
            </View>
          </View>
          <View style={styles.wellnessRow}>
            <Icon name="favorite" size={14} color={Colors.error} />
            <Text style={styles.wellnessText}>Emotional Wellness: Balanced & Secure</Text>
          </View>
        </View>

        {/* Extension Banner */}
        {showExtendBanner && (
          <View style={styles.extensionBanner}>
            <View style={styles.extensionBannerHeader}>
              <Icon name="update" size={16} color={Colors.primary} />
              <Text style={styles.extensionBannerTitle}>Session Extension Available</Text>
              <View style={styles.extensionBannerTimePill}>
                <Text style={styles.extensionBannerTimeText}>+60 min</Text>
              </View>
            </View>
            <Text style={styles.extensionBannerSub}>
              Your companion is available for an additional hour. Extend now to continue the experience seamlessly.
            </Text>
            <View style={styles.extensionBannerActions}>
              <TouchableOpacity
                style={styles.extensionAcceptBtn}
                onPress={() => {
                  Alert.alert('Session Extended', 'Your session has been extended by 60 minutes.');
                  setShowExtendBanner(false);
                }}
                activeOpacity={0.85}>
                <Icon name="check" size={14} color={Colors.onPrimary} />
                <Text style={styles.extensionAcceptText}>Extend Session</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.extensionDeclineBtn}
                onPress={() => setShowExtendBanner(false)}
                activeOpacity={0.8}>
                <Text style={styles.extensionDeclineText}>Decline</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Session Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Timeline</Text>
          {TIMELINE.map((item, i) => (
            <View key={item.id} style={styles.timelineWrap}>
              {/* Vertical connector line — left gutter */}
              <View style={styles.timelineGutter}>
                <View style={[
                  styles.timelineIconCircle,
                  item.done && styles.timelineIconCircleDone,
                  item.active && styles.timelineIconCircleActive,
                ]}>
                  <Icon
                    name={item.icon}
                    size={14}
                    color={item.active ? Colors.primary : item.done ? Colors.success : Colors.onSurfaceVariant}
                  />
                </View>
                {i < TIMELINE.length - 1 && (
                  <View style={[styles.timelineConnector, item.done && styles.timelineConnectorDone]} />
                )}
              </View>
              {/* Content */}
              <View style={[styles.timelineMeta, i < TIMELINE.length - 1 && {paddingBottom: 16}]}>
                <Text style={[styles.timelineLabel, item.active && {color: Colors.primary}]}>
                  {item.label}
                </Text>
                <Text style={styles.timelineTime}>{item.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Journey Protocol */}
        <View style={styles.card}>
          <View style={styles.journeyHeader}>
            <Icon name="sync" size={14} color={Colors.primary} />
            <Text style={styles.cardTitle}>Concierge Monitoring Active</Text>
            <View style={styles.liveSmallChip}>
              <Text style={styles.liveSmallText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.journeySub}>Synced with 2 trusted contacts.</Text>
          {JOURNEY.map(j => (
            <View key={j.time} style={styles.journeyRow}>
              <View style={[
                styles.journeyDot,
                j.status === 'Active' && styles.journeyDotActive,
                j.status === 'Completed' && styles.journeyDotDone,
              ]} />
              <View style={styles.journeyMeta}>
                <View style={styles.journeyTopRow}>
                  <Text style={styles.journeyTime}>{j.time}</Text>
                  <Text style={[
                    styles.journeyStatus,
                    j.status === 'Active' && {color: Colors.primary},
                    j.status === 'Completed' && {color: Colors.success},
                  ]}>{j.status}</Text>
                </View>
                <Text style={styles.journeyTitle}>{j.title}</Text>
                {j.note ? <Text style={styles.journeyNote}>{j.note}</Text> : null}
              </View>
            </View>
          ))}
        </View>

        {/* Live Safety Protection */}
        <View style={[styles.card, styles.safetyCard]}>
          <View style={styles.safetyHeader}>
            <Icon name="security" size={18} color={Colors.success} />
            <Text style={styles.safetyTitle}>Live Safety Protection Active</Text>
          </View>
          <View style={styles.safetyIconsGrid}>
            {SAFETY_ICONS.map(s => (
              <View key={s.icon} style={styles.safetyIconItem}>
                <View style={styles.safetyIconWrap}>
                  <Icon name={s.icon} size={16} color={Colors.success} />
                </View>
                <Text style={styles.safetyIconLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Rows */}
        <View style={styles.card}>
          {ACTION_ROWS.map((a, i) => (
            <TouchableOpacity
              key={a.icon}
              style={[styles.actionRow, i < ACTION_ROWS.length - 1 && styles.actionRowBorder]}
              onPress={() => handleActionRow(a.fn)}
              activeOpacity={0.7}>
              <View style={styles.actionIconWrap}>
                <Icon name={a.icon} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
              <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Need Help */}
        <TouchableOpacity style={styles.helpRow}
          onPress={() => (navigation as any).navigate('ConciergeNavigator', {
            screen: 'MessagingThread',
            params: {conversationId: 'concierge_main'},
          })}
          activeOpacity={0.7}>
          <Icon name="help" size={16} color={Colors.onSurfaceVariant} />
          <Text style={styles.helpText}>Need Help?</Text>
        </TouchableOpacity>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete} activeOpacity={0.88}>
          <Icon name="check-circle" size={18} color={Colors.onPrimary} />
          <Text style={styles.completeBtnText}>Complete Experience</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 8, gap: 12},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  headerIconBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerCenter: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  sosBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,180,171,0.12)',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1, borderColor: 'rgba(255,180,171,0.30)',
  },
  sosBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.error},

  // Live + timer
  liveRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 8},
  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(109,217,140,0.10)', borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
  },
  liveDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success},
  liveText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success, letterSpacing: 1},
  sessionActiveLabel: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  elapsedTimer: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 48,
    color: Colors.onSurface, letterSpacing: 2, marginTop: 4,
  },

  // Session info
  sessionInfoCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER,
    padding: 16, gap: 8,
  },
  sessionTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface},
  venueRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  venueText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Generic card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  cardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},

  // Companion
  companionRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  companionAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  companionInitial: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.primary},
  companionMeta: {flex: 1},
  companionNameRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3},
  companionName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  companionRole: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  activeChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  activeDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.success},
  activeChipText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success},
  wellnessRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,180,171,0.06)',
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: 'rgba(255,180,171,0.15)',
  },
  wellnessText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurface},

  // Extension banner
  extensionBanner: {
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    padding: 16,
    gap: 10,
  },
  extensionBannerHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  extensionBannerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, flex: 1},
  extensionBannerTimePill: {
    backgroundColor: 'rgba(242,202,80,0.15)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  extensionBannerTimeText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary},
  extensionBannerSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  extensionBannerActions: {flexDirection: 'row', gap: 10},
  extensionAcceptBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 10,
  },
  extensionAcceptText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onPrimary},
  extensionDeclineBtn: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  extensionDeclineText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},

  // Timeline (connector-based)
  timelineWrap: {flexDirection: 'row', gap: 12},
  timelineGutter: {alignItems: 'center', width: 32},
  timelineIconCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  timelineIconCircleDone:   {backgroundColor: 'rgba(109,217,140,0.12)', borderColor: 'rgba(109,217,140,0.30)'},
  timelineIconCircleActive: {backgroundColor: 'rgba(242,202,80,0.12)', borderColor: GOLD_BORDER},
  timelineConnector:     {flex: 1, width: 1, backgroundColor: CARD_BORDER, marginVertical: 3, minHeight: 16},
  timelineConnectorDone: {backgroundColor: 'rgba(109,217,140,0.30)'},

  // Timeline (legacy — kept for other uses)
  timelineRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10},
  timelineRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  timelineMeta: {flex: 1},
  timelineLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  timelineTime: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Journey
  journeyHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  journeySub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: -4},
  liveSmallChip: {
    backgroundColor: 'rgba(109,217,140,0.10)', borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
  },
  liveSmallText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 0.8},
  journeyRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 6},
  journeyDot: {
    width: 10, height: 10, borderRadius: 5, marginTop: 4,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  journeyDotActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  journeyDotDone: {backgroundColor: Colors.success, borderColor: Colors.success},
  journeyMeta: {flex: 1},
  journeyTopRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  journeyTime: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onSurface},
  journeyStatus: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  journeyTitle: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface, marginTop: 2},
  journeyNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Safety card
  safetyCard: {borderColor: 'rgba(109,217,140,0.20)', backgroundColor: 'rgba(109,217,140,0.04)'},
  safetyHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  safetyTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success},
  safetyIconsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  safetyIconItem: {alignItems: 'center', gap: 6, width: '22%'},
  safetyIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: SUCCESS_BG, borderWidth: 1, borderColor: SUCCESS_BD,
    alignItems: 'center', justifyContent: 'center',
  },
  safetyIconLabel: {
    fontFamily: 'Inter-Regular', fontSize: 9,
    color: Colors.onSurfaceVariant, textAlign: 'center',
  },

  // Action rows
  actionRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11},
  actionRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  actionIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  helpRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 4},
  helpText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Bottom CTA
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.97)',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 15,
  },
  completeBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
});
