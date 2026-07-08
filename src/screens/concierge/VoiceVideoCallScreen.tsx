import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ConciergeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// ─── Stitch references ────────────────────────────────────────────────────────
//   voice_video_concierge_communication_experience
//   voice_concierge_call_live_assistance_screen
//
// Incoming state layout:
//   1. Trusted Communication heading
//   2. Concierge avatar ring (pulsing)
//   3. Name + Elite Concierge + Secure Connection label
//   4. Waveform visual (animated bars)
//   5. Message | Decline | Accept buttons

type Props = NativeStackScreenProps<ConciergeStackParamList, 'VoiceVideoCall'>;

// ─── Call state machine ───────────────────────────────────────────────────────
type CallState = 'incoming' | 'active';

const CARD_BG     = 'rgba(20,20,15,0.90)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';
const DECLINE_BG  = 'rgba(255,180,171,0.12)';
const DECLINE_BD  = 'rgba(255,180,171,0.30)';

// Section 8: Quick action rows (Stitch list style with chevron_right)
const QUICK_ACTIONS = [
  {id: 'venue',     icon: 'restaurant',     label: 'Reserve Venue'},
  {id: 'location',  icon: 'location-on',    label: 'Share Location'},
  {id: 'itinerary', icon: 'flight-takeoff', label: 'Modify Itinerary'},
  {id: 'notes',     icon: 'note-add',       label: 'Concierge Notes'},
];

// Number of waveform bars
const WAVEFORM_BARS = 12;

function formatTimer(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ─── Animated waveform bar ────────────────────────────────────────────────────
function WaveBar({index}: {index: number}) {
  const anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const delay = (index * 80) % 600;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.2 + Math.random() * 0.8,
          duration: 400 + Math.random() * 300,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 400,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: false,
        }),
      ]),
    );
    const t = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [anim, index]);

  const height = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 32],
  });

  return (
    <Animated.View
      style={[
        styles.waveBar,
        {height},
      ]}
    />
  );
}

// ─── Pulsing ring for incoming call ──────────────────────────────────────────
function PulseRing() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {toValue: 1.3, duration: 900, useNativeDriver: true}),
          Animated.timing(scale, {toValue: 1, duration: 900, useNativeDriver: true}),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {toValue: 0, duration: 900, useNativeDriver: true}),
          Animated.timing(opacity, {toValue: 0.6, duration: 900, useNativeDriver: true}),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [scale, opacity]);

  return (
    <Animated.View
      style={[styles.pulseRing, {transform: [{scale}], opacity}]}
      pointerEvents="none"
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function VoiceVideoCallScreen({navigation, route}: Props) {
  const {callType} = route.params;
  const isVideo = callType === 'video';

  // P0: incoming call state — local only, no WebRTC
  const [callState, setCallState] = useState<CallState>('incoming');
  const [elapsed,   setElapsed]   = useState(0);
  const [muted,     setMuted]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start timer only when call is accepted
  useEffect(() => {
    if (callState !== 'active') return;
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callState]);

  const handleAccept = () => setCallState('active');

  const handleDecline = () => {
    Alert.alert(
      'Decline Call',
      'Decline this concierge call? You can message your concierge instead.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Decline', style: 'destructive', onPress: () => navigation.goBack()},
      ],
    );
  };

  const handleMessage = () => {
    navigation.goBack();
    // Caller navigates back to MessagingThread which is already on the stack
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end the concierge session?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'End Session', style: 'destructive', onPress: () => navigation.goBack()},
      ],
    );
  };

  const handleMinimize = () => {
    Alert.alert(
      'Minimize Session',
      'Do you want to return to the app or end this session?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Return to App', style: 'default', onPress: () => navigation.goBack()},
        {text: 'End Session', style: 'destructive', onPress: () => navigation.goBack()},
      ],
    );
  };

  const handleEmergency = () => {
    Alert.alert(
      'Emergency Assistance',
      'This will open the Emergency SOS screen and alert your trusted contacts immediately.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Emergency SOS',
          style: 'destructive',
          onPress: () =>
            (navigation as any).navigate('SafetyNavigator', {
              screen: 'EmergencySOS',
              params: {},
            }),
        },
      ],
    );
  };

  const handleEscalate = () => {
    Alert.alert(
      'Escalate to Safety Team',
      'This will file a priority incident report with the CoBuddy safety team.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'File Report',
          onPress: () =>
            (navigation as any).navigate('SafetyNavigator', {
              screen: 'IncidentReport',
              params: {},
            }),
        },
      ],
    );
  };

  const [bookingApproved, setBookingApproved] = useState(false);

  const handleApproveBooking = () => {
    Alert.alert(
      bookingApproved ? 'Booking Already Approved' : 'Approve Booking',
      bookingApproved
        ? 'You have already approved this booking. Your concierge has been notified.'
        : 'Confirm booking approval? Your concierge will finalise the reservation immediately.',
      bookingApproved
        ? [{text: 'OK'}]
        : [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Approve',
              onPress: () => {
                setBookingApproved(true);
                Alert.alert('Approved', 'Booking confirmed. Your concierge will complete the reservation now.');
              },
            },
          ],
    );
  };

  const handleAction = (label: string) => {
    Alert.alert(label, 'Your concierge is handling this request in the live session.');
  };

  // ── INCOMING CALL LAYOUT ───────────────────────────────────────────────────
  if (callState === 'incoming') {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

        {/* Ambient glow background */}
        <View style={styles.incomingGlow} pointerEvents="none" />

        {/* Top label */}
        <View style={styles.incomingTopBar}>
          <View style={styles.incomingCallTypePill}>
            <Icon name="security" size={11} color={Colors.success} />
            <Text style={styles.incomingCallTypeText}>Trusted Communication</Text>
          </View>
        </View>

        {/* Center section: avatar + name + secure label */}
        <View style={styles.incomingCenter}>
          {/* Incoming chip */}
          <View style={styles.incomingChip}>
            <View style={styles.incomingChipDot} />
            <Text style={styles.incomingChipText}>Incoming {isVideo ? 'Video' : 'Voice'} Call</Text>
          </View>

          {/* Pulsing avatar ring */}
          <View style={styles.incomingAvatarWrap}>
            <PulseRing />
            <View style={styles.incomingRingOuter}>
              <View style={styles.incomingRingMid}>
                <View style={styles.incomingAvatarInner}>
                  <Text style={styles.incomingAvatarInitial}>J</Text>
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.incomingName}>Julian Sterling</Text>
          <Text style={styles.incomingRole}>Elite Concierge</Text>

          {/* Trust chips */}
          <View style={styles.incomingChipsRow}>
            <View style={styles.chip}>
              <Icon name="verified" size={10} color={Colors.success} />
              <Text style={styles.chipText}>Trusted</Text>
            </View>
            <View style={styles.chip}>
              <Icon name="star" size={10} color={Colors.primary} />
              <Text style={styles.chipText}>Premium</Text>
            </View>
            <View style={styles.chip}>
              <Icon name="translate" size={10} color={Colors.info} />
              <Text style={styles.chipText}>Bilingual</Text>
            </View>
          </View>

          {/* Waveform visual */}
          <View style={styles.waveformRow}>
            {Array.from({length: WAVEFORM_BARS}).map((_, i) => (
              <WaveBar key={i} index={i} />
            ))}
          </View>

          {/* Secure connection label */}
          <View style={styles.secureRow}>
            <Icon name="enhanced-encryption" size={11} color={Colors.onSurfaceVariant} />
            <Text style={styles.secureText}>Secure Connection — End-to-end encrypted</Text>
          </View>
        </View>

        {/* Bottom: Message | Decline | Accept */}
        <View style={styles.incomingControls}>
          {/* Message */}
          <View style={styles.incomingControlCol}>
            <TouchableOpacity
              style={styles.incomingControlBtn}
              onPress={handleMessage}
              activeOpacity={0.8}>
              <Icon name="chat-bubble" size={22} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.incomingControlLabel}>Message</Text>
          </View>

          {/* Decline */}
          <View style={styles.incomingControlCol}>
            <TouchableOpacity
              style={[styles.incomingControlBtn, styles.declineBtn]}
              onPress={handleDecline}
              activeOpacity={0.85}>
              <Icon name="call-end" size={26} color={Colors.onError} />
            </TouchableOpacity>
            <Text style={styles.incomingControlLabel}>Decline</Text>
          </View>

          {/* Accept */}
          <View style={styles.incomingControlCol}>
            <TouchableOpacity
              style={[styles.incomingControlBtn, styles.acceptBtn]}
              onPress={handleAccept}
              activeOpacity={0.85}>
              <Icon name="call" size={26} color={Colors.onPrimary} />
            </TouchableOpacity>
            <Text style={[styles.incomingControlLabel, styles.acceptLabel]}>
              Accept Secure Call
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── ACTIVE CALL LAYOUT ────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Section 1: Top bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.minimizeBtn}
          onPress={handleMinimize}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="keyboard-arrow-down" size={22} color={Colors.onSurface} />
          <Text style={styles.minimizeLabel}>Minimize</Text>
        </TouchableOpacity>

        <View style={styles.topCenter}>
          <Text style={styles.topTitle}>
            {isVideo ? 'Live Concierge' : 'Live Voice Concierge'}
          </Text>
          <View style={styles.timerRow}>
            <View style={styles.liveDot} />
            <Text style={styles.timerInline}>
              Trusted hospitality guidance - {formatTimer(elapsed)}
            </Text>
          </View>
        </View>

        <View style={styles.topActions}>
          <TouchableOpacity style={styles.topIconBtn} onPress={() => handleAction('Volume')} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} activeOpacity={0.7}>
            <Icon name="volume-off" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topIconBtn} onPress={() => handleAction('Translate')} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} activeOpacity={0.7}>
            <Icon name="translate" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topIconBtn} onPress={handleEscalate} hitSlop={{top: 8, bottom: 8, left: 8, right: 8}} activeOpacity={0.7}>
            <Icon name="escalator-warning" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Section 2: Status chips ── */}
        <View style={styles.statusRow}>
          <View style={styles.statusChip}>
            <Icon name="verified" size={11} color={Colors.success} />
            <Text style={styles.statusChipText}>Premium Support</Text>
          </View>
          <View style={styles.statusChip}>
            <Icon name="wifi" size={11} color={Colors.info} />
            <Text style={styles.statusChipText}>Excellent Connection</Text>
          </View>
          <View style={styles.statusChip}>
            <Icon name="mood" size={11} color={Colors.primary} />
            <Text style={styles.statusChipText}>Reassuring Mode</Text>
          </View>
        </View>

        {/* ── Section 3 + 4 + 5: Avatar + name + trust chips + timer ── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGlow} pointerEvents="none" />

          <View style={styles.liveChip}>
            <View style={styles.liveChipDot} />
            <Text style={styles.liveChipText}>Concierge</Text>
            <View style={styles.liveChipSep} />
            <Text style={styles.liveChipText}>Live Session</Text>
          </View>

          <View style={styles.avatarActionRow}>
            <TouchableOpacity style={styles.avatarActionBtn} onPress={() => handleAction('Chat')} activeOpacity={0.8}>
              <Icon name="chat-bubble" size={18} color={Colors.onSurface} />
            </TouchableOpacity>
            <View style={styles.avatarRingOuter}>
              <View style={styles.avatarRingMid}>
                <View style={styles.avatarInner}>
                  <Text style={styles.avatarInitial}>J</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={[styles.avatarActionBtn, styles.avatarActionBtnDanger]} onPress={handleEmergency} activeOpacity={0.8}>
              <Icon name="emergency" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>

          <Text style={styles.conciergeName}>Julian Sterling</Text>
          <Text style={styles.conciergeRole}>Elite Concierge</Text>

          <View style={styles.chipsRow}>
            <View style={styles.chip}>
              <Icon name="verified" size={10} color={Colors.success} />
              <Text style={styles.chipText}>Trusted</Text>
            </View>
            <View style={styles.chip}>
              <Icon name="star" size={10} color={Colors.primary} />
              <Text style={styles.chipText}>Premium Hospitality</Text>
            </View>
            <View style={styles.chip}>
              <Icon name="translate" size={10} color={Colors.info} />
              <Text style={styles.chipText}>Bilingual</Text>
            </View>
          </View>

          <Text style={styles.timerLarge}>{formatTimer(elapsed)}</Text>
          <View style={styles.secureRow}>
            <Icon name="enhanced-encryption" size={11} color={Colors.onSurfaceVariant} />
            <Text style={styles.secureText}>Secure Connection - End-to-end encrypted</Text>
          </View>
        </View>

        {/* ── Section 6: Itinerary card ── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTime}>12:45</Text>
            <Text style={styles.cardLabel}>Itinerary Presentation</Text>
          </View>
          <View style={styles.itineraryItem}>
            <Icon name="person" size={14} color={Colors.onSurfaceVariant} />
            <View style={styles.itineraryMeta}>
              <Text style={styles.itineraryVenue}>Aman Tokyo - Suite Reservation</Text>
              <Text style={styles.itineraryDesc}>Confirmation details for your upcoming stay.</Text>
            </View>
          </View>
          <View style={styles.quoteBlock}>
            <Text style={styles.quoteText}>
              "I've secured the corner suite with panoramic views, exactly as requested..."
            </Text>
          </View>
        </View>

        {/* ── Section 7: Live Assistance translation bar ── */}
        <View style={styles.assistanceBar}>
          <Icon name="g-translate" size={16} color={Colors.primary} />
          <View style={styles.assistanceMeta}>
            <Text style={styles.assistanceLabel}>Live Assistance</Text>
            <Text style={styles.assistanceLangs}>English - Japanese</Text>
          </View>
          <View style={styles.activeChip}>
            <Text style={styles.activeChipText}>ACTIVE</Text>
          </View>
        </View>

        {/* ── Section 8: Quick actions (list with chevron_right) ── */}
        <View style={styles.card}>
          <Text style={styles.quickLabel}>QUICK ACTIONS</Text>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity
              key={a.id}
              style={[styles.quickRow, i < QUICK_ACTIONS.length - 1 && styles.quickRowBorder]}
              onPress={() => handleAction(a.label)}
              activeOpacity={0.7}>
              <View style={styles.quickIcon}>
                <Icon name={a.icon} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.quickRowLabel}>{a.label}</Text>
              <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Section 9: Live suggestion card ── */}
        <View style={styles.suggestionCard}>
          <View style={styles.suggestionHeader}>
            <Icon name="recommend" size={14} color={Colors.primary} />
            <Text style={styles.suggestionHeaderText}>Live Suggestion</Text>
          </View>
          <Text style={styles.suggestionVenue}>The Omakase Room</Text>
          <Text style={styles.suggestionDesc}>Available tonight - Premium omakase experience, 8:30 PM.</Text>
          <View style={styles.suggestionActions}>
            <TouchableOpacity
              style={[styles.approveBtn, bookingApproved && {opacity: 0.7}]}
              onPress={handleApproveBooking}
              activeOpacity={0.85}>
              <Icon name="bookmark-add" size={14} color={Colors.onPrimary} />
              <Text style={styles.approveBtnText}>Approve Booking</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => handleAction('View Details')}
              activeOpacity={0.8}>
              <Text style={styles.detailsBtnText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 16}} />
      </ScrollView>

      {/* ── Section 10: Bottom controls ── */}
      <View style={styles.controlsWrap}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlBtn, muted && styles.controlBtnMuted]}
            onPress={() => setMuted(v => !v)}
            activeOpacity={0.8}>
            <Icon name={muted ? 'mic-off' : 'mic'} size={22} color={muted ? Colors.onPrimary : Colors.onSurface} />
            <Text style={[styles.controlLabel, muted && styles.controlLabelMuted]}>{muted ? 'Unmute' : 'Mute'}</Text>
          </TouchableOpacity>

          {isVideo && (
            <TouchableOpacity style={styles.controlBtn} onPress={() => handleAction('Camera')} activeOpacity={0.8}>
              <Icon name="videocam-off" size={22} color={Colors.onSurface} />
              <Text style={styles.controlLabel}>Camera</Text>
            </TouchableOpacity>
          )}

          <View style={styles.phoneLiveWrap}>
            <View style={styles.phoneLiveBtn}>
              <Icon name="phone-in-talk" size={26} color={Colors.onPrimary} />
            </View>
            <Text style={styles.phoneLiveLabel}>Live</Text>
          </View>

          <TouchableOpacity style={styles.endCallBtn} onPress={handleEndCall} activeOpacity={0.85}>
            <Icon name="call-end" size={22} color={Colors.onError} />
            <Text style={styles.endCallLabel}>End</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlBtn} onPress={() => handleAction('Volume')} activeOpacity={0.8}>
            <Icon name="volume-up" size={22} color={Colors.onSurface} />
            <Text style={styles.controlLabel}>Speaker</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.protectedRow}>
          <Icon name="lock" size={11} color={Colors.onSurfaceVariant} />
          <Text style={styles.protectedText}>Protected Session Active</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:          {flex: 1, backgroundColor: Colors.surface},
  scroll:        {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 12, gap: 12},

  // ── Incoming call ──────────────────────────────────────────────────────────
  incomingGlow: {
    position: 'absolute',
    top: -60, alignSelf: 'center',
    width: 320, height: 320, borderRadius: 160,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  incomingTopBar: {
    alignItems: 'center', paddingTop: 20, paddingBottom: 8,
  },
  incomingCallTypePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: SUCCESS_BG,
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  incomingCallTypeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 12,
    color: Colors.success, letterSpacing: 0.5,
  },
  incomingCenter: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 24},
  incomingChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 6,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  incomingChipDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.primary},
  incomingChipText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary, letterSpacing: 0.8},

  // Pulsing avatar
  incomingAvatarWrap: {position: 'relative', alignItems: 'center', justifyContent: 'center', width: 128, height: 128},
  pulseRing: {
    position: 'absolute',
    width: 128, height: 128, borderRadius: 64,
    borderWidth: 2, borderColor: 'rgba(242,202,80,0.40)',
  },
  incomingRingOuter: {
    width: 116, height: 116, borderRadius: 58,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  incomingRingMid: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.30)',
    alignItems: 'center', justifyContent: 'center',
  },
  incomingAvatarInner: {
    width: 78, height: 78, borderRadius: 39,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  incomingAvatarInitial: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 30, color: Colors.primary},

  incomingName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface},
  incomingRole: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  incomingChipsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center'},

  // Waveform
  waveformRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    height: 40, paddingHorizontal: 16,
  },
  waveBar: {
    width: 3, borderRadius: 2,
    backgroundColor: Colors.primary,
    opacity: 0.7,
  },

  // Incoming controls
  incomingControls: {
    flexDirection: 'row', justifyContent: 'space-around',
    alignItems: 'flex-end', paddingBottom: 24, paddingHorizontal: 24,
  },
  incomingControlCol: {alignItems: 'center', gap: 8},
  incomingControlBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  declineBtn: {
    backgroundColor: DECLINE_BG,
    borderColor: DECLINE_BD,
    width: 72, height: 72, borderRadius: 36,
  },
  acceptBtn: {
    backgroundColor: Colors.success,
    borderColor: SUCCESS_BD,
    width: 72, height: 72, borderRadius: 36,
  },
  incomingControlLabel: {
    fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, textAlign: 'center',
    maxWidth: 80,
  },
  acceptLabel: {color: Colors.success},

  // ── Top bar (active) ──────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  minimizeBtn:   {alignItems: 'center', gap: 2, width: 52},
  minimizeLabel: {fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  topCenter:     {flex: 1, alignItems: 'center', gap: 4, paddingHorizontal: 8},
  topTitle:      {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, textAlign: 'center'},
  timerRow:      {flexDirection: 'row', alignItems: 'center', gap: 6},
  liveDot:       {width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success},
  timerInline:   {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  topActions:    {flexDirection: 'row', gap: 2, width: 52, justifyContent: 'flex-end'},
  topIconBtn:    {width: 28, height: 28, alignItems: 'center', justifyContent: 'center'},

  // ── Status chips ──────────────────────────────────────────────────────────
  statusRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center'},
  statusChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  statusChipText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurface},

  // ── Avatar section (active) ───────────────────────────────────────────────
  avatarSection: {alignItems: 'center', gap: 10, position: 'relative', paddingTop: 8},
  avatarGlow: {
    position: 'absolute', top: 0, alignSelf: 'center',
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  liveChip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  liveChipDot:  {width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success},
  liveChipSep:  {width: 1, height: 12, backgroundColor: SUCCESS_BD},
  liveChipText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success, letterSpacing: 0.8},
  avatarActionRow: {flexDirection: 'row', alignItems: 'center', gap: 20},
  avatarActionBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarActionBtnDanger: {
    borderColor: 'rgba(255,180,171,0.30)',
    backgroundColor: 'rgba(255,180,171,0.08)',
  },
  avatarRingOuter: {
    width: 108, height: 108, borderRadius: 54,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarRingMid: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.28)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInner: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarInitial:  {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.primary},
  conciergeName:  {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.onSurface},
  conciergeRole:  {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  chipsRow:       {flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center'},
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  chipText:   {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurface},
  timerLarge: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 40, color: Colors.onSurface, letterSpacing: 2},
  secureRow:  {flexDirection: 'row', alignItems: 'center', gap: 5, opacity: 0.55},
  secureText: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant},

  // ── Generic card ──────────────────────────────────────────────────────────
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16,
  },
  cardHeader:    {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10},
  cardTime:      {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
  cardLabel:     {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  itineraryItem: {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10},
  itineraryMeta: {flex: 1},
  itineraryVenue:{fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, marginBottom: 2},
  itineraryDesc: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  quoteBlock: {
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 10, padding: 12,
    borderLeftWidth: 2, borderLeftColor: Colors.primary,
  },
  quoteText:    {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18, fontStyle: 'italic'},
  quickLabel:   {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 8},
  quickRow:     {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11},
  quickRowBorder:{borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  quickIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.18)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  quickRowLabel: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},

  // ── Live assistance bar ───────────────────────────────────────────────────
  assistanceBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: GOLD_BORDER,
    paddingVertical: 12, paddingHorizontal: 14,
  },
  assistanceMeta:  {flex: 1},
  assistanceLabel: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onSurface},
  assistanceLangs: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  activeChip: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  activeChipText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 1},

  // ── Suggestion card ───────────────────────────────────────────────────────
  suggestionCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER,
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    padding: 16, gap: 8,
  },
  suggestionHeader:     {flexDirection: 'row', alignItems: 'center', gap: 6},
  suggestionHeaderText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary, letterSpacing: 0.5},
  suggestionVenue:      {fontFamily: 'PlayfairDisplay-Bold', fontSize: 16, color: Colors.onSurface},
  suggestionDesc:       {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  suggestionActions:    {flexDirection: 'row', gap: 10, marginTop: 4},
  approveBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 10,
  },
  approveBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onPrimary},
  detailsBtn: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  detailsBtnText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},

  // ── Bottom controls (active) ──────────────────────────────────────────────
  controlsWrap: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.95)',
    paddingTop: 16, paddingBottom: 8, paddingHorizontal: 16, gap: 8,
  },
  controls:     {flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around'},
  controlBtn:   {alignItems: 'center', gap: 6, width: 56},
  controlBtnMuted: {},
  controlLabel:     {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant},
  controlLabelMuted:{color: Colors.primary},
  phoneLiveWrap:{alignItems: 'center', gap: 4},
  phoneLiveBtn: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  phoneLiveLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 1},
  endCallBtn: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.errorContainer,
    borderWidth: 1, borderColor: Colors.error,
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  endCallLabel:  {fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.error},
  protectedRow:  {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, opacity: 0.50},
  protectedText: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant},
});
