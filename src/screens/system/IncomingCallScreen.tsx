import React, {useEffect, useRef, useState} from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Alert, Animated, Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ModalStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ModalStackParamList, 'IncomingCall'>;

const GOLD_BG  = 'rgba(242,202,80,0.12)';
const GOLD_BD  = 'rgba(242,202,80,0.28)';
const RED_BG   = 'rgba(220,80,80,0.12)';
const RED_BD   = 'rgba(220,80,80,0.30)';
const JADE_BG  = 'rgba(109,217,140,0.12)';
const JADE_BD  = 'rgba(109,217,140,0.30)';

// Caller lookup keyed by conversationId / callId
// In production this data comes from the WebSocket call:incoming event payload.
// For known demo IDs we show real names; for any real UUID we show a safe generic fallback.
const CALLER_MAP: Record<string, {name: string; role: string; callType: string; sessionRef: string; initial: string}> = {
  concierge_main: {name: 'CoBuddy Concierge', role: 'Concierge Team',       callType: 'Secure Voice Call', sessionRef: 'General Assistance', initial: 'C'},
  booking_assistance: {name: 'Bookings Support', role: 'Concierge Team',    callType: 'Secure Voice Call', sessionRef: 'Booking Assistance', initial: 'B'},
  safety_support: {name: 'Safety & Trust Team', role: 'Safety Team',        callType: 'Priority Voice Call', sessionRef: 'Safety Escalation', initial: 'S'},
  payment_help: {name: 'Payments Support',  role: 'Concierge Team',         callType: 'Secure Voice Call', sessionRef: 'Payment Query', initial: 'P'},
  account_support: {name: 'Account Support', role: 'Concierge Team',        callType: 'Secure Voice Call', sessionRef: 'Account Query', initial: 'A'},
  demo_companion: {name: 'Sofia R.',         role: 'Your Companion',         callType: 'Secure Voice Call', sessionRef: 'Session Tonight, 20:00', initial: 'S'},
};

const FALLBACK_CALLER = {
  name: 'Incoming Call',
  role: 'CoBuddy Network',
  callType: 'Secure Voice Call',
  sessionRef: 'Tap accept to connect',
  initial: '?',
};

// Pulse ring animation helper
function usePulse(delay: number) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scale, {toValue: 1.55, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true}),
          Animated.timing(opacity, {toValue: 0, duration: 1400, easing: Easing.out(Easing.ease), useNativeDriver: true}),
        ]),
        Animated.parallel([
          Animated.timing(scale, {toValue: 1, duration: 0, useNativeDriver: true}),
          Animated.timing(opacity, {toValue: 0.6, duration: 0, useNativeDriver: true}),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, scale, opacity]);
  return {scale, opacity};
}

export default function IncomingCallScreen({navigation, route}: Props) {
  const {callId} = route.params;
  const caller = CALLER_MAP[callId] ?? FALLBACK_CALLER;
  const pulse1 = usePulse(0);
  const pulse2 = usePulse(500);

  const [callDuration, setCallDuration] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (accepted) {
      timerRef.current = setInterval(() => setCallDuration(v => v + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [accepted]);

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setAccepted(true);
    Alert.alert(
      'Secure Call Connected',
      'Audio routing is handled by the native call layer in the production build.',
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Call Declined',
      'The caller will be notified. You can message them through the Concierge tab.',
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    Alert.alert(
      'Call Ended',
      `Duration: ${formatDuration(callDuration)}`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const handleMute = () =>
    Alert.alert('Mute', 'Microphone mute is handled by the native audio layer in the production build.');

  const handleSpeaker = () =>
    Alert.alert('Speaker', 'Speaker toggle is handled by the native audio layer in the production build.');

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>

        {/* Top status */}
        <View style={styles.topBar}>
          <View style={styles.secureBadge}>
            <Icon name="lock" size={11} color={Colors.success} />
            <Text style={styles.secureBadgeText}>ENCRYPTED CALL</Text>
          </View>
          {accepted && (
            <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
          )}
        </View>

        {/* Caller section */}
        <View style={styles.callerSection}>
          {/* Pulse rings */}
          {!accepted && (
            <>
              <Animated.View
                style={[styles.pulseRing, {transform: [{scale: pulse1.scale}], opacity: pulse1.opacity}]}
              />
              <Animated.View
                style={[styles.pulseRing, styles.pulseRing2, {transform: [{scale: pulse2.scale}], opacity: pulse2.opacity}]}
              />
            </>
          )}

          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarInitial}>{caller.initial}</Text>
          </View>

          <Text style={styles.callerName}>{caller.name}</Text>
          <Text style={styles.callerRole}>{caller.role}</Text>

          <View style={styles.callTypeBadge}>
            <Icon name="phone-in-talk" size={13} color={Colors.primary} />
            <Text style={styles.callTypeBadgeText}>{caller.callType}</Text>
          </View>

          <Text style={styles.sessionRef}>{caller.sessionRef}</Text>

          {accepted ? (
            <Text style={styles.connectedLabel}>Connected</Text>
          ) : (
            <Text style={styles.incomingLabel}>Incoming secure call</Text>
          )}
        </View>

        {/* Action row */}
        {accepted ? (
          /* In-call controls */
          <View style={styles.inCallControls}>
            <View style={styles.controlsRow}>
              <TouchableOpacity style={styles.controlBtn} onPress={handleMute} activeOpacity={0.8}>
                <Icon name="mic-off" size={24} color={Colors.onSurface} />
                <Text style={styles.controlLabel}>Mute</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={handleSpeaker} activeOpacity={0.8}>
                <Icon name="volume-up" size={24} color={Colors.onSurface} />
                <Text style={styles.controlLabel}>Speaker</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlBtn} onPress={() =>
                Alert.alert('Keypad', 'DTMF keypad available in the production build.')
              } activeOpacity={0.8}>
                <Icon name="dialpad" size={24} color={Colors.onSurface} />
                <Text style={styles.controlLabel}>Keypad</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.endCallBtn} onPress={handleEnd} activeOpacity={0.87}>
              <Icon name="call-end" size={28} color={Colors.onPrimary} />
            </TouchableOpacity>
          </View>
        ) : (
          /* Incoming call controls */
          <View style={styles.incomingControls}>
            <View style={styles.incomingBtn}>
              <TouchableOpacity style={styles.declineBtn} onPress={handleDecline} activeOpacity={0.87}>
                <Icon name="call-end" size={28} color={Colors.onPrimary} />
              </TouchableOpacity>
              <Text style={styles.incomingBtnLabel}>Decline</Text>
            </View>
            <View style={styles.incomingBtn}>
              <TouchableOpacity style={styles.acceptBtn} onPress={handleAccept} activeOpacity={0.87}>
                <Icon name="call" size={28} color={Colors.onPrimary} />
              </TouchableOpacity>
              <Text style={styles.incomingBtnLabel}>Accept</Text>
            </View>
          </View>
        )}

        {/* Ref ID */}
        <Text style={styles.refId}>Ref: {callId}</Text>

      </SafeAreaView>
    </View>
  );
}

const AVATAR_SIZE = 110;
const PULSE_SIZE  = AVATAR_SIZE + 50;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  safeArea: {flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24},

  topBar: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingTop: 8,
  },
  secureBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(109,217,140,0.10)', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: JADE_BD,
  },
  secureBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 1.2},
  durationText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.primary, letterSpacing: 1},

  callerSection: {alignItems: 'center', gap: 10, marginTop: 40},
  pulseRing: {
    position: 'absolute',
    width: PULSE_SIZE, height: PULSE_SIZE, borderRadius: PULSE_SIZE / 2,
    borderWidth: 2, borderColor: Colors.primary,
    backgroundColor: GOLD_BG,
  },
  pulseRing2: {width: PULSE_SIZE + 40, height: PULSE_SIZE + 40, borderRadius: (PULSE_SIZE + 40) / 2},
  avatar: {
    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 3, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  avatarInitial: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 42, color: Colors.primary},
  callerName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 30, color: Colors.onSurface, marginTop: 8},
  callerRole: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  callTypeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: GOLD_BD,
  },
  callTypeBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary},
  sessionRef: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  incomingLabel: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  connectedLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.success},

  // In-call
  inCallControls: {width: '100%', alignItems: 'center', gap: 32, paddingBottom: 24},
  controlsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    width: '100%', backgroundColor: 'rgba(11,13,26,0.55)',
    borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 20,
  },
  controlBtn: {alignItems: 'center', gap: 8},
  controlLabel: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  endCallBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.error, borderWidth: 2, borderColor: RED_BD,
    alignItems: 'center', justifyContent: 'center',
  },

  // Incoming
  incomingControls: {flexDirection: 'row', gap: 56, paddingBottom: 24},
  incomingBtn: {alignItems: 'center', gap: 12},
  declineBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.error, alignItems: 'center', justifyContent: 'center',
  },
  acceptBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center',
  },
  incomingBtnLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},

  refId: {
    fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant,
    letterSpacing: 0.5, paddingBottom: 4,
  },
});
