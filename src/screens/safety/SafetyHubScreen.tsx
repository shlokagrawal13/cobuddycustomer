import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SafetyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SafetyStackParamList, 'SafetyHub'>;

// ── Safety toggles (local state, no backend) ──────────────────────────────────
const TOGGLE_ITEMS = [
  {
    id: 'contact_share',
    label: 'Trusted Contact Sharing',
    sub: 'Share location during active sessions.',
    defaultOn: true,
  },
  {
    id: 'live_monitor',
    label: 'Live Session Monitoring',
    sub: 'Concierge oversight on active bookings.',
    defaultOn: true,
  },
  {
    id: 'arrival_verify',
    label: 'Arrival Verification',
    sub: 'Require check-in at designated venues.',
    defaultOn: true,
  },
  {
    id: 'concierge_priority',
    label: 'Concierge Priority Support',
    sub: 'Direct line for immediate assistance.',
    defaultOn: true,
  },
];

// ── Safety status indicators ──────────────────────────────────────────────────
// Stitch: safety_hub_screen — verified_user, radar, group icons
const STATUS_ITEMS = [
  {icon: 'verified-user', label: 'Identity Verified',       color: Colors.success},
  {icon: 'radar',         label: 'Live Monitoring Active',  color: Colors.primary},
  {icon: 'group',         label: 'Trusted Contacts Linked', color: Colors.info},
];

// ── Quick-action cards ────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  {
    icon: 'group',
    label: 'Trusted Contacts',
    sub: 'Manage your safety circle',
    action: 'contacts' as const,
    color: Colors.info,
  },
  {
    icon: 'report',
    label: 'Report Incident',
    sub: 'Flag a safety concern',
    action: 'incident' as const,
    color: Colors.error,
  },
] as const;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function SafetyHubScreen({navigation}: Props) {
  const initToggles = Object.fromEntries(
    TOGGLE_ITEMS.map(t => [t.id, t.defaultOn]),
  );
  const [toggles, setToggles] = useState<Record<string, boolean>>(initToggles);

  const flip = (id: string) =>
    setToggles(prev => ({...prev, [id]: !prev[id]}));

  const handleAction = (action: typeof QUICK_ACTIONS[number]['action']) => {
    if (action === 'contacts') {navigation.navigate('TrustedContacts');}
    if (action === 'incident') {navigation.navigate('IncidentReport', {});}
  };

  const handleSOS = () => {
    navigation.navigate('EmergencySOS', {});
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      {/* Stitch: arrow_back + "Safety Hub" + support_agent icon right */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety Hub</Text>
        <View style={styles.headerRight}>
          <Icon name="support-agent" size={22} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Protection ecosystem hero ─────────────────────────────────── */}
        {/* Stitch: shield icon + "Your Protection Ecosystem" heading */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />

          {/* Shield icon */}
          <View style={styles.shieldIconWrap}>
            <View style={styles.shieldRing} />
            <Icon name="shield" size={32} color={Colors.primary} />
          </View>

          <Text style={styles.heroHeading}>Your Protection Ecosystem</Text>
          <Text style={styles.heroSub}>
            Advanced safety systems monitoring your social experiences.
          </Text>

          {/* Status: Protected badge */}
          <View style={styles.statusBadge}>
            <Icon name="verified-user" size={14} color={Colors.success} />
            <Text style={styles.statusBadgeText}>Status: Protected</Text>
          </View>
          <Text style={styles.statusNote}>All safety systems are operational.</Text>

          {/* Status indicators row */}
          <View style={styles.indicatorsRow}>
            {STATUS_ITEMS.map(s => (
              <View key={s.label} style={styles.indicator}>
                <Icon name={s.icon} size={18} color={s.color} />
                <Text style={styles.indicatorLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Quick action cards ────────────────────────────────────────── */}
        <View style={styles.quickRow}>
          {QUICK_ACTIONS.map(qa => (
            <TouchableOpacity
              key={qa.action}
              style={styles.quickCard}
              onPress={() => handleAction(qa.action)}
              activeOpacity={0.75}>
              <View style={[styles.quickIconWrap, {borderColor: `${qa.color}30`}]}>
                <Icon name={qa.icon} size={20} color={qa.color} />
              </View>
              <Text style={styles.quickLabel}>{qa.label}</Text>
              <Text style={styles.quickSub}>{qa.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Safety toggles ────────────────────────────────────────────── */}
        {/* Stitch: 4 safety setting rows with toggle controls */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SAFETY SETTINGS</Text>
          {TOGGLE_ITEMS.map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.toggleRow,
                i < TOGGLE_ITEMS.length - 1 && styles.toggleRowBorder,
              ]}>
              <View style={styles.toggleMeta}>
                <Text style={styles.toggleLabel}>{item.label}</Text>
                <Text style={styles.toggleSub}>{item.sub}</Text>
              </View>
              <TouchableOpacity
                onPress={() => flip(item.id)}
                style={[styles.track, toggles[item.id] && styles.trackOn]}
                activeOpacity={0.8}>
                <View style={[styles.thumb, toggles[item.id] && styles.thumbOn]} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Trust / concierge banner ──────────────────────────────────── */}
        <View style={styles.trustBanner}>
          <View style={styles.trustIconWrap}>
            <Icon name="security" size={22} color={Colors.primary} />
          </View>
          <View style={styles.trustMeta}>
            <Text style={styles.trustTitle}>24/7 Concierge Protection</Text>
            <Text style={styles.trustSub}>
              Our dedicated concierge team monitors every session in real time.
            </Text>
          </View>
        </View>

        {/* ── Emergency SOS CTA ─────────────────────────────────────────── */}
        {/* Stitch: emergency icon + "Activate SOS" — primary-danger CTA */}
        <View style={styles.sosCard}>
          <View style={styles.sosMeta}>
            <Icon name="emergency" size={22} color={Colors.error} />
            <View style={styles.sosTextWrap}>
              <Text style={styles.sosTitle}>Emergency Assistance</Text>
              <Text style={styles.sosSub}>
                Immediate connection to concierge and trusted contacts.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.sosBtn}
            onPress={handleSOS}
            activeOpacity={0.85}>
            <Icon name="emergency" size={16} color={Colors.white} />
            <Text style={styles.sosBtnText}>Activate SOS</Text>
          </TouchableOpacity>
        </View>

        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Header
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface, letterSpacing: 0.2},
  headerRight: {width: 40, alignItems: 'flex-end'},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // ── Hero card
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    padding: 24, alignItems: 'center', gap: 12,
    overflow: 'hidden', position: 'relative',
  },
  heroGlow: {
    position: 'absolute', top: -40, alignSelf: 'center',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(242,202,80,0.04)',
  },
  shieldIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center',
    position: 'relative',
  },
  shieldRing: {
    position: 'absolute', width: 88, height: 88, borderRadius: 44,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.12)',
  },
  heroHeading: {
    fontFamily: 'PlayfairDisplay-SemiBold', fontSize: 20,
    color: Colors.onSurface, textAlign: 'center',
  },
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20,
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.25)',
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5,
  },
  statusBadgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    color: Colors.success, letterSpacing: 1.0,
  },
  statusNote: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, textAlign: 'center',
  },
  indicatorsRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center'},
  indicator: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  indicatorLabel: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurface},

  // ── Quick action cards (2-column)
  quickRow: {flexDirection: 'row', gap: 12},
  quickCard: {
    flex: 1, backgroundColor: CARD_BG,
    borderRadius: 18, borderWidth: 1, borderColor: CARD_BORDER,
    padding: 18, gap: 8,
  },
  quickIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
  },
  quickLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  quickSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},

  // ── Safety toggles card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, gap: 14,
  },
  toggleRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  toggleMeta: {flex: 1},
  toggleLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, marginBottom: 2},
  toggleSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},
  track: {
    width: 48, height: 26, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center', paddingHorizontal: 3, flexShrink: 0,
  },
  trackOn: {backgroundColor: Colors.primary},
  thumb: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.onSurface, elevation: 2, alignSelf: 'flex-start',
  },
  thumbOn: {alignSelf: 'flex-end'},

  // Trust banner
  trustBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    borderLeftWidth: 3, borderLeftColor: Colors.primary, padding: 16,
  },
  trustIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.08)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  trustMeta: {flex: 1},
  trustTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, marginBottom: 2},
  trustSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},

  // SOS card
  sosCard: {
    backgroundColor: 'rgba(147,0,10,0.08)',
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.20)',
    padding: 20, gap: 16,
  },
  sosMeta: {flexDirection: 'row', alignItems: 'flex-start', gap: 14},
  sosTextWrap: {flex: 1},
  sosTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.error, marginBottom: 4},
  sosSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18},
  sosBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 14, borderRadius: 100,
    backgroundColor: Colors.error,
  },
  sosBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.white, letterSpacing: 0.3},
});
