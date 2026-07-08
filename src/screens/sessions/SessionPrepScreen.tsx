import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch ref: protected_session_preparation_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'SessionPrep'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';
const WARN_BG     = 'rgba(242,202,80,0.10)';
const WARN_BD     = 'rgba(242,202,80,0.28)';

const DIRECTIVES = ['Networking Focus', 'No Photography', 'Discreet Exit'];


const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

// Countdown from 45:00 (2700 seconds), static display per Stitch
function formatCountdown(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function SessionPrepScreen({navigation, route}: Props) {
  const {bookingId} = route.params;
  const [remaining, setRemaining] = useState(2700);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining(v => Math.max(0, v - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleBegin = () => {
    navigation.navigate('ArrivalVerification', {sessionId: bookingId});
  };

  const handleMessage = () => {
    (navigation as any).navigate('ConciergeNavigator', {
      screen: 'MessagingThread',
      params: {conversationId: 'concierge_main'},
    });
  };

  const handleOpenRoute = () => {
    // MapNavigation is in HomeNavigator (HomeStack).
    // SessionPrepScreen is in SessionsNavigator.
    // Cross-tab path: MainTabNavigator > HomeNavigator > MapNavigation.
    (navigation as any).navigate('MainTabNavigator', {
      screen: 'HomeNavigator',
      params: {
        screen: 'MapNavigation',
        params: {sessionId: bookingId},
      },
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
          <Icon name="support-agent" size={18} color={Colors.primary} />
          <Text style={styles.headerTitle}>Session Prep</Text>
        </View>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={async () => {
            try {
              await Share.share({
                title: 'CoBuddy Session Prep',
                message: 'I am preparing for an exclusive CoBuddy session. Check out CoBuddy at https://app.cobuddy.com',
              });
            } catch {
              Alert.alert('Share', 'Unable to open the share sheet. Please try again.');
            }
          }}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="ios-share" size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Prepare For</Text>
          <Text style={styles.heroTitle}>Trusted Experience</Text>
          <Text style={styles.heroSub}>
            Your premium session is protected with concierge support and live safety systems.
          </Text>
        </View>

        {/* Countdown */}
        <View style={styles.countdownCard}>
          <Text style={styles.countdownTimer}>{formatCountdown(remaining)}</Text>
          <Text style={styles.countdownLabel}>Remaining</Text>
          {/* Status chips */}
          <View style={styles.chipsRow}>
            <View style={[styles.chip, styles.chipSuccess]}>
              <Icon name="verified-user" size={12} color={Colors.success} />
              <Text style={[styles.chipText, {color: Colors.success}]}>Protected Session</Text>
            </View>
            <View style={[styles.chip, styles.chipGold]}>
              <Icon name="headset-mic" size={12} color={Colors.primary} />
              <Text style={[styles.chipText, {color: Colors.primary}]}>Concierge Ready</Text>
            </View>
          </View>
        </View>

        {/* Venue Card */}
        <View style={styles.card}>
          <View style={styles.venueRow}>
            <View style={styles.venueIconWrap}>
              <Icon name="pin-drop" size={20} color={Colors.primary} />
            </View>
            <View style={styles.venueMeta}>
              <Text style={styles.venueName}>The Grand Reserve</Text>
              <Text style={styles.venueETA}>ETA: 15 mins via secure route</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.routeBtn} onPress={handleOpenRoute} activeOpacity={0.8}>
            <Text style={styles.routeBtnText}>Open Protected Route</Text>
            <Icon name="arrow-forward" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Safety Systems */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Safety Systems</Text>

          {/* Live monitoring — ACTIVE */}
          <View style={styles.safetyRow}>
            <View style={[styles.safetyIcon, styles.safetyIconSuccess]}>
              <Icon name="check" size={14} color={Colors.success} />
            </View>
            <Text style={styles.safetyLabel}>Live monitoring enabled</Text>
          </View>

          {/* Trusted contacts — ACTIVE */}
          <View style={[styles.safetyRow, styles.safetyRowBorder]}>
            <View style={[styles.safetyIcon, styles.safetyIconSuccess]}>
              <Icon name="check" size={14} color={Colors.success} />
            </View>
            <View style={styles.safetyMeta}>
              <Text style={styles.safetyLabel}>Trusted contacts notified</Text>
              <View style={styles.safetySubRow}>
                <Text style={styles.safetySubLabel}>2 active guardians</Text>
                <TouchableOpacity
                  onPress={() => (navigation as any).navigate('SafetyNavigator', {screen: 'TrustedContacts'})}
                  activeOpacity={0.7}>
                  <Text style={styles.manageLink}>Manage</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Venue verification — PENDING */}
          <View style={[styles.safetyRow, styles.safetyRowBorder, styles.safetyRowWarn]}>
            <View style={[styles.safetyIcon, styles.safetyIconWarn]}>
              <Icon name="schedule" size={14} color={Colors.warning} />
            </View>
            <View style={styles.safetyMeta}>
              <Text style={[styles.safetyLabel, {color: Colors.warning}]}>Venue verification pending</Text>
              <Text style={styles.safetySubLabel}>Awaiting arrival confirmation</Text>
            </View>
          </View>
        </View>

        {/* Concierge Brief */}
        <View style={[styles.card, styles.conciergeCard]}>
          <Text style={styles.sectionTitle}>Concierge Brief</Text>
          <Text style={styles.conciergeSub}>Your dedicated support agent</Text>
          <TouchableOpacity
            style={styles.messageBtn}
            onPress={handleMessage}
            activeOpacity={0.85}>
            <Icon name="chat-bubble" size={16} color={Colors.onPrimary} />
            <Text style={styles.messageBtnText}>Message Concierge</Text>
          </TouchableOpacity>
        </View>

        {/* Session Directives */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Session Directives</Text>
          <View style={styles.directivesRow}>
            {DIRECTIVES.map(d => (
              <View key={d} style={styles.directiveChip}>
                <Text style={styles.directiveText}>{d}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.beginBtn}
          onPress={handleBegin}
          activeOpacity={0.88}>
          <Icon name="verified-user" size={18} color={Colors.onPrimary} />
          <Text style={styles.beginBtnText}>Begin Protected Session</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 12, gap: 12},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerCenter: {flexDirection: 'row', alignItems: 'center', gap: 8},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},

  // Hero
  hero: {paddingTop: 8, paddingBottom: 4, gap: 6},
  heroLabel: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.onSurface},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20},

  // Countdown
  countdownCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', paddingVertical: 28, gap: 8,
  },
  countdownTimer: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 52, color: Colors.onSurface, letterSpacing: 2},
  countdownLabel: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onSurfaceVariant, letterSpacing: 2, textTransform: 'uppercase'},
  chipsRow: {flexDirection: 'row', gap: 10, marginTop: 4},
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
    borderWidth: 1,
  },
  chipSuccess: {backgroundColor: SUCCESS_BG, borderColor: SUCCESS_BD},
  chipGold: {backgroundColor: 'rgba(242,202,80,0.08)', borderColor: GOLD_BORDER},
  chipText: {fontFamily: 'Inter-SemiBold', fontSize: 11},

  // Generic card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  sectionTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, letterSpacing: 0.3},

  // Venue
  venueRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  venueIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  venueMeta: {flex: 1},
  venueName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  venueETA: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2},
  routeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  routeBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},

  // Safety
  safetyRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 6},
  safetyRowBorder: {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER},
  safetyRowWarn: {backgroundColor: WARN_BG, borderRadius: 10, paddingHorizontal: 10},
  safetyIcon: {width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  safetyIconSuccess: {backgroundColor: SUCCESS_BG, borderWidth: 1, borderColor: SUCCESS_BD},
  safetyIconWarn: {backgroundColor: WARN_BG, borderWidth: 1, borderColor: WARN_BD},
  safetyMeta: {flex: 1},
  safetyLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  safetySubRow: {flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2},
  safetySubLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  manageLink: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary},

  // Concierge
  conciergeCard: {borderColor: GOLD_BORDER},
  conciergeSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: -4},
  messageBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 11,
  },
  messageBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary},

  // Directives
  directivesRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  directiveChip: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  directiveText: {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurface},

  // Bottom CTA
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.97)', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },
  beginBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 15,
  },
  beginBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
