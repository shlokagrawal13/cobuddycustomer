import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SafetyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SafetyStackParamList, 'EmergencySOS'>;

// Stitch: emergency_assistance_screen
// location_on Location Sharing Active
// "Emergency Assistance Active" | support_agent | local_police | System Escalated
// shield Protected | priority_high Priority Assistance | location_on Location Active
// emergency "Emergency Mode Active"
// share_location Live Location Sharing | group Trusted Contacts Alerted | support_agent Concierge Connected
// Countdown: 00:45 — "Cancel If Safe" / "Continue Support"
// Trusted Network Status: Sarah Jenkins Sister Viewed | Michael Chen Partner Delivered
// "I'm Safe" | "Open Emergency Chat"

// Demo disclaimer — no real emergency services, SMS, GPS.

const TRUSTED_NETWORK = [
  {id: 'n1', name: 'Sarah Jenkins',  relation: 'Sister',  readStatus: 'Viewed',    readIcon: 'done-all'},
  {id: 'n2', name: 'Michael Chen',   relation: 'Partner', readStatus: 'Delivered', readIcon: 'check'},
];

const ESCALATION_STEPS = [
  {icon: 'share-location', label: 'Live Location Sharing',    sub: 'Broadcasting to trusted network.'},
  {icon: 'group',          label: 'Trusted Contacts Alerted', sub: 'Notifications delivered.'},
  {icon: 'support-agent',  label: 'Concierge Safety Connected', sub: 'Agent assigned to your session.'},
];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function EmergencySOSScreen({navigation}: Props) {
  const [activated, setActivated] = useState(false);
  const [countdown, setCountdown] = useState(45);
  const [cancelled, setCancelled] = useState(false);
  const pulseAnim   = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pulse animation on the SOS ring
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1.12, duration: 700, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 1.0,  duration: 700, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulseAnim]);

  // Countdown when activated
  useEffect(() => {
    if (activated && !cancelled) {
      intervalRef.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activated, cancelled]);

  const handleActivateSOS = () => {
    Alert.alert(
      'DEMO MODE - Emergency SOS',
      'This is a simulation. In a real situation, this would immediately alert your trusted contacts, share your live location, and connect you with the CoBuddy Concierge safety team.\n\nNo actual emergency services will be contacted.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Activate (Demo)', onPress: () => setActivated(true)},
      ],
    );
  };

  const handleCancelSafe = () => {
    Alert.alert(
      'Stand Down Confirmation',
      'Confirm you are safe and wish to cancel the emergency response.',
      [
        {text: 'Keep Active', style: 'cancel'},
        {
          text: 'I Am Safe - Cancel',
          onPress: () => {
            setCancelled(true);
            setActivated(false);
            setCountdown(45);
            Alert.alert('Emergency Cancelled', 'Your trusted contacts have been notified that you are safe.');
          },
        },
      ],
    );
  };

  const handleCallServices = () => {
    Alert.alert('DEMO: Call Emergency Services', 'In a real device, this would dial your local emergency number (e.g. 911). No call is being made in demo mode.', [{text: 'OK'}]);
  };

  const handleNotifyContacts = () => {
    Alert.alert('DEMO: Notify Trusted Contacts', 'In production, this sends an immediate SMS and push notification to all trusted contacts with your location.', [{text: 'OK'}]);
  };

  const handleShareLocation = () => {
    Alert.alert('DEMO: Share Live Location', 'In production, this broadcasts your GPS coordinates to your trusted safety network in real time.', [{text: 'OK'}]);
  };

  const handleImSafe = () => {
    Alert.alert('You Are Safe', 'Glad you are safe. Your session is now marked as resolved.', [
      {text: 'OK', onPress: () => navigation.goBack()},
    ]);
  };

  const padTime = (n: number) => n.toString().padStart(2, '0');

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
        <View style={styles.headerCenter}>
          {/* Stitch: location_on Location Sharing Active */}
          <View style={styles.locationPill}>
            <Icon name="location-on" size={13} color={activated ? Colors.success : Colors.onSurfaceVariant} />
            <Text style={styles.locationPillText}>
              {activated ? 'Location Sharing Active' : 'Location Sharing Standby'}
            </Text>
          </View>
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* DEMO disclaimer banner */}
        <View style={styles.demoBanner}>
          <Icon name="info" size={15} color={Colors.warning} />
          <Text style={styles.demoBannerText}>
            DEMO MODE - No real calls, SMS, or GPS are used. This is a simulation.
          </Text>
        </View>

        {/* SOS Hero — Stitch: emergency + "Emergency Assistance Active" */}
        <View style={styles.sosHeroCard}>
          <View style={styles.sosGlow} pointerEvents="none" />

          <View style={styles.sosIconsRow}>
            <Icon name="support-agent" size={20} color={Colors.primary} />
            <Icon name="local-police"  size={20} color={Colors.onSurfaceVariant} />
          </View>

          <Text style={styles.sosStatusLabel}>
            {activated ? 'SYSTEM ESCALATED' : 'EMERGENCY ASSISTANCE'}
          </Text>

          {/* Large pulsing SOS button */}
          <Animated.View style={[styles.sosRingOuter, {transform: [{scale: pulseAnim}]}]}>
            <View style={styles.sosRingInner}>
              <TouchableOpacity
                style={[styles.sosBtnCore, activated && styles.sosBtnCoreActive]}
                onPress={activated ? handleCancelSafe : handleActivateSOS}
                activeOpacity={0.8}>
                <Icon name="emergency" size={36} color={activated ? Colors.onSurface : Colors.error} />
                <Text style={[styles.sosBtnLabel, activated && styles.sosBtnLabelActive]}>
                  {activated ? 'ACTIVE' : 'SOS'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Text style={styles.sosSubCopy}>
            {activated
              ? 'CoBuddy safety systems are protecting your session and connecting trusted support.'
              : 'Tap to activate emergency assistance.'}
          </Text>

          {/* Status pills — Stitch: shield Protected | priority_high | location_on */}
          <View style={styles.statusPillsRow}>
            <View style={[styles.statusPill, activated && styles.statusPillActive]}>
              <Icon name="shield" size={12} color={activated ? Colors.success : Colors.onSurfaceVariant} />
              <Text style={[styles.statusPillText, activated && styles.statusPillTextActive]}>Protected</Text>
            </View>
            <View style={[styles.statusPill, activated && styles.statusPillWarn]}>
              <Icon name="priority-high" size={12} color={activated ? Colors.error : Colors.onSurfaceVariant} />
              <Text style={[styles.statusPillText, activated && styles.statusPillTextWarn]}>Priority</Text>
            </View>
            <View style={[styles.statusPill, activated && styles.statusPillActive]}>
              <Icon name="location-on" size={12} color={activated ? Colors.success : Colors.onSurfaceVariant} />
              <Text style={[styles.statusPillText, activated && styles.statusPillTextActive]}>Location</Text>
            </View>
          </View>
        </View>

        {/* Escalation steps — Stitch: share_location / group / support_agent */}
        {activated && (
          <View style={styles.escalationCard}>
            <View style={styles.escalationHeader}>
              <Icon name="emergency" size={16} color={Colors.error} />
              <Text style={styles.escalationTitle}>Emergency Mode Active</Text>
              <Text style={styles.escalationSub}>System is fully escalated.</Text>
            </View>
            {ESCALATION_STEPS.map((step, i) => (
              <View
                key={step.icon}
                style={[styles.escalationRow, i < ESCALATION_STEPS.length - 1 && styles.escalationRowBorder]}>
                <View style={styles.escalationIconWrap}>
                  <Icon name={step.icon} size={18} color={Colors.success} />
                </View>
                <View style={styles.escalationMeta}>
                  <Text style={styles.escalationLabel}>{step.label}</Text>
                  <Text style={styles.escalationItemSub}>{step.sub}</Text>
                </View>
                <Icon name="check-circle" size={16} color={Colors.success} />
              </View>
            ))}
          </View>
        )}

        {/* Countdown — Stitch: "Escalating to Emergency Services in 00:45" */}
        {activated && !cancelled && (
          <View style={styles.countdownCard}>
            <Text style={styles.countdownLabel}>Escalating to Emergency Services in</Text>
            <Text style={styles.countdownTimer}>{padTime(Math.floor(countdown / 60))}:{padTime(countdown % 60)}</Text>
            <Text style={styles.countdownNote}>
              If you are safe and this was triggered accidentally, please cancel below to stand down emergency response teams.
            </Text>
            <View style={styles.countdownActions}>
              <TouchableOpacity style={styles.cancelSafeBtn} onPress={handleCancelSafe} activeOpacity={0.85}>
                <Icon name="cancel" size={16} color={Colors.onSurface} />
                <Text style={styles.cancelSafeBtnText}>Cancel If Safe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueBtn} activeOpacity={0.85}>
                <Icon name="emergency" size={16} color={Colors.onPrimary} />
                <Text style={styles.continueBtnText}>Continue Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Action buttons (pre-activation) */}
        {!activated && (
          <View style={styles.actionsCard}>
            <Text style={styles.sectionLabel}>EMERGENCY ACTIONS</Text>
            <TouchableOpacity style={styles.actionBtn} onPress={handleCallServices} activeOpacity={0.85}>
              <View style={[styles.actionBtnIcon, {backgroundColor: 'rgba(255,75,75,0.15)'}]}>
                <Icon name="local-phone" size={20} color={Colors.error} />
              </View>
              <Text style={styles.actionBtnText}>Call Emergency Services</Text>
              <Icon name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity style={styles.actionBtn} onPress={handleNotifyContacts} activeOpacity={0.85}>
              <View style={[styles.actionBtnIcon, {backgroundColor: 'rgba(242,202,80,0.12)'}]}>
                <Icon name="group" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.actionBtnText}>Notify Trusted Contacts</Text>
              <Icon name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity style={styles.actionBtn} onPress={handleShareLocation} activeOpacity={0.85}>
              <View style={[styles.actionBtnIcon, {backgroundColor: 'rgba(109,217,140,0.12)'}]}>
                <Icon name="share-location" size={20} color={Colors.success} />
              </View>
              <Text style={styles.actionBtnText}>Share Live Location</Text>
              <Icon name="chevron-right" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        )}

        {/* Trusted Network Status — Stitch: Sarah Jenkins Sister Viewed | Michael Chen Partner Delivered */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TRUSTED NETWORK STATUS</Text>
          {TRUSTED_NETWORK.map((p, i) => (
            <View
              key={p.id}
              style={[styles.networkRow, i < TRUSTED_NETWORK.length - 1 && styles.networkRowBorder]}>
              <View style={styles.networkAvatar}>
                <Icon name="person" size={18} color={Colors.onSurfaceVariant} />
              </View>
              <View style={styles.networkMeta}>
                <Text style={styles.networkName}>{p.name}</Text>
                <Text style={styles.networkRelation}>{p.relation}</Text>
              </View>
              <View style={styles.networkStatus}>
                <Icon name={p.readIcon} size={14} color={Colors.success} />
                <Text style={styles.networkStatusText}>{p.readStatus}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bottom CTAs — Stitch: "I'm Safe" | "Open Emergency Chat" */}
        <TouchableOpacity style={styles.safeCTA} onPress={handleImSafe} activeOpacity={0.85}>
          <Icon name="check-circle" size={18} color={Colors.onPrimary} />
          <Text style={styles.safeCTAText}>I Am Safe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatCTA}
          onPress={() => Alert.alert('DEMO: Emergency Chat', 'Emergency chat requires a live concierge connection. Not available in demo mode.', [{text: 'OK'}])}
          activeOpacity={0.8}>
          <Icon name="chat" size={18} color={Colors.primary} />
          <Text style={styles.chatCTAText}>Open Emergency Chat</Text>
        </TouchableOpacity>

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 16, gap: 16},

  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 12,
    backgroundColor: 'rgba(20,20,15,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: {flex: 1, alignItems: 'center'},
  headerSpacer: {width: 40},
  locationPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  locationPillText: {fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.onSurface},

  // Demo banner
  demoBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  demoBannerText: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.warning, lineHeight: 16},

  // SOS Hero
  sosHeroCard: {
    backgroundColor: CARD_BG, borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(255,75,75,0.25)',
    padding: 28, alignItems: 'center', gap: 18,
    position: 'relative', overflow: 'hidden',
  },
  sosGlow: {
    position: 'absolute', top: -60, alignSelf: 'center',
    width: 260, height: 260, borderRadius: 130,
    backgroundColor: 'rgba(255,75,75,0.04)',
  },
  sosIconsRow: {flexDirection: 'row', gap: 16},
  sosStatusLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 2},

  sosRingOuter: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,75,75,0.08)',
    borderWidth: 2, borderColor: 'rgba(255,75,75,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  sosRingInner: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: 'rgba(255,75,75,0.10)',
    borderWidth: 1, borderColor: 'rgba(255,75,75,0.35)',
    alignItems: 'center', justifyContent: 'center',
  },
  sosBtnCore: {
    width: 86, height: 86, borderRadius: 43,
    backgroundColor: 'rgba(255,75,75,0.15)',
    borderWidth: 2, borderColor: 'rgba(255,75,75,0.50)',
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  sosBtnCoreActive: {
    backgroundColor: 'rgba(255,75,75,0.30)',
    borderColor: Colors.error,
  },
  sosBtnLabel: {fontFamily: 'Inter-Bold', fontSize: 13, color: Colors.error, letterSpacing: 2},
  sosBtnLabelActive: {color: Colors.onSurface},

  sosSubCopy: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 18},

  statusPillsRow: {flexDirection: 'row', gap: 8},
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  statusPillActive: {backgroundColor: 'rgba(109,217,140,0.10)', borderColor: 'rgba(109,217,140,0.25)'},
  statusPillWarn:   {backgroundColor: 'rgba(255,75,75,0.10)', borderColor: 'rgba(255,75,75,0.25)'},
  statusPillText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant},
  statusPillTextActive: {color: Colors.success},
  statusPillTextWarn:   {color: Colors.error},

  // Escalation card
  escalationCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,75,75,0.20)',
    borderLeftWidth: 3, borderLeftColor: Colors.error, padding: 16, gap: 0,
  },
  escalationHeader: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14},
  escalationTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.error, flex: 1},
  escalationSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  escalationRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  escalationRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)'},
  escalationIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(109,217,140,0.10)', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  escalationMeta: {flex: 1},
  escalationLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  escalationItemSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Countdown
  countdownCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(255,75,75,0.25)', padding: 20, gap: 12, alignItems: 'center',
  },
  countdownLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  countdownTimer: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 52, color: Colors.error},
  countdownNote: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 17},
  countdownActions: {flexDirection: 'row', gap: 10, width: '100%'},
  cancelSafeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 13, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  cancelSafeBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  continueBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 13, borderRadius: 100, backgroundColor: Colors.error,
  },
  continueBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onPrimary},

  // Pre-activation actions
  actionsCard: {
    backgroundColor: CARD_BG, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 16,
  },
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14},
  actionBtn: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12},
  actionBtnIcon: {width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  actionBtnText: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  actionDivider: {height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.08)'},

  // Network status
  card: {backgroundColor: CARD_BG, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', padding: 16},
  networkRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10},
  networkRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.08)'},
  networkAvatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  networkMeta: {flex: 1},
  networkName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  networkRelation: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  networkStatus: {flexDirection: 'row', alignItems: 'center', gap: 4},
  networkStatusText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.success},

  // Bottom CTAs
  safeCTA: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 17, borderRadius: 100, backgroundColor: Colors.success,
  },
  safeCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary, letterSpacing: 0.3},
  chatCTA: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 15, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
  },
  chatCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.primary},
});
