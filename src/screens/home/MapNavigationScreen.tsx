import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList, MainTabParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'MapNavigation'>,
  BottomTabScreenProps<MainTabParamList>
>;

const CARD_BG     = 'rgba(32,32,26,0.96)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';

const demoAlert = () =>
  Alert.alert('Navigation', 'Live navigation requires device GPS and will be enabled in the full release.');

const ROUTE_STEPS = [
  {icon: 'verified-user', label: 'Verified Driver Confirmed',      sub: 'Licence plate: GB-44-XYZ', color: Colors.success},
  {icon: 'support-agent', label: 'Concierge Monitoring Active',     sub: 'Live oversight enabled',   color: Colors.info},
  {icon: 'group',         label: 'Trusted Contacts Notified',       sub: '2 guardians standing by', color: Colors.primary},
];

export default function MapNavigationScreen({navigation, route}: Props) {
  const {sessionId} = route.params;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Map placeholder ── */}
      <View style={styles.mapPlaceholder}>
        {/* Grid overlay */}
        <View style={styles.mapGrid} />
        {/* Ambient glow */}
        <View style={styles.mapGlow} />
        {/* Center marker */}
        <View style={styles.markerWrap}>
          <View style={styles.markerPulseOuter} />
          <View style={styles.markerPulseMid} />
          <View style={styles.markerDot}>
            <Icon name="directions-car" size={18} color={Colors.onPrimary} />
          </View>
        </View>
        {/* Destination marker */}
        <View style={styles.destMarkerWrap}>
          <View style={styles.destMarkerDot}>
            <Icon name="place" size={16} color={Colors.onPrimary} />
          </View>
          <View style={styles.destLabel}>
            <Text style={styles.destLabelText}>The Grand Reserve</Text>
          </View>
        </View>
        {/* Dashed route line */}
        <View style={styles.routeLine} />
      </View>

      {/* ── Top Header (floating) ── */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.activeDot} />
          <Text style={styles.headerTitle}>Protected Route</Text>
        </View>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => (navigation as any).navigate('SafetyNavigator', {screen: 'SafetyHub'})}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="shield" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* ── Bottom route card ── */}
      <SafeAreaView edges={['bottom']} style={styles.bottomSheet}>
        {/* ETA strip */}
        <View style={styles.etaRow}>
          <View style={styles.etaMain}>
            <Text style={styles.etaValue}>14</Text>
            <Text style={styles.etaUnit}>min</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaMain}>
            <Text style={styles.etaValue}>3.2</Text>
            <Text style={styles.etaUnit}>km</Text>
          </View>
          <View style={styles.etaDivider} />
          <View style={styles.etaBadge}>
            <Icon name="verified-user" size={12} color={Colors.success} />
            <Text style={styles.etaBadgeText}>SECURE ROUTE</Text>
          </View>
        </View>

        {/* Destination */}
        <View style={styles.destRow}>
          <Icon name="place" size={16} color={Colors.primary} />
          <Text style={styles.destText}>The Grand Reserve, Mayfair</Text>
        </View>

        {/* Route steps */}
        <ScrollView
          style={styles.stepsScroll}
          showsVerticalScrollIndicator={false}>
          {ROUTE_STEPS.map((step, i) => (
            <View
              key={step.icon}
              style={[styles.stepRow, i < ROUTE_STEPS.length - 1 && styles.stepRowBorder]}>
              <View style={[styles.stepIconWrap, {backgroundColor: `${step.color}18`, borderColor: `${step.color}44`}]}>
                <Icon name={step.icon} size={16} color={step.color} />
              </View>
              <View style={styles.stepMeta}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
              <Icon name="check" size={14} color={Colors.success} />
            </View>
          ))}
        </ScrollView>

        {/* CTAs */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaSecondary} onPress={() => Linking.openURL('geo:0,0?q=destination').catch(() => Alert.alert('Maps', 'Unable to open Maps on this device.'))} activeOpacity={0.8}>
            <Icon name="map" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.ctaSecondaryText}>Open in Maps</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaPrimary} onPress={() => Linking.openURL('google.navigation:q=destination').catch(() => Linking.openURL('maps://?daddr=destination').catch(() => Alert.alert('Navigation', 'Unable to open navigation on this device.')))} activeOpacity={0.88}>
            <Icon name="navigation" size={16} color={Colors.onPrimary} />
            <Text style={styles.ctaPrimaryText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Map area
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#0a0d1a',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGrid: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    // Subtle grid via border pattern
    borderWidth: 0,
    opacity: 0.06,
    backgroundColor: 'transparent',
  },
  mapGlow: {
    position: 'absolute',
    top: '30%', left: '20%',
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(242,202,80,0.06)',
  },
  markerWrap: {
    position: 'absolute',
    bottom: '38%', left: '35%',
    alignItems: 'center', justifyContent: 'center',
  },
  markerPulseOuter: {
    position: 'absolute',
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
  },
  markerPulseMid: {
    position: 'absolute',
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(242,202,80,0.12)',
  },
  markerDot: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 8,
  },
  destMarkerWrap: {
    position: 'absolute',
    top: '22%', right: '25%',
    alignItems: 'center',
  },
  destMarkerDot: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.error,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.error, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  destLabel: {
    marginTop: 6,
    backgroundColor: 'rgba(20,20,15,0.85)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  destLabelText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurface},
  routeLine: {
    position: 'absolute',
    top: '29%', left: '42%',
    width: 2, height: '12%',
    backgroundColor: Colors.primary,
    opacity: 0.5,
    transform: [{rotate: '40deg'}],
  },

  // Header
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(20,20,15,0.85)',
  },
  headerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: CARD_BG,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: {flexDirection: 'row', alignItems: 'center', gap: 8},
  activeDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.success,
    shadowColor: Colors.success, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8, shadowRadius: 6,
  },
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},

  // Bottom sheet
  bottomSheet: {
    backgroundColor: CARD_BG,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1, borderColor: GOLD_BORDER,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 16,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  etaMain: {flexDirection: 'row', alignItems: 'baseline', gap: 3},
  etaValue: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.onSurface},
  etaUnit: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  etaDivider: {width: 1, height: 24, backgroundColor: CARD_BORDER},
  etaBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: SUCCESS_BG, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  etaBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 1},
  destRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  destText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  stepsScroll: {maxHeight: 160},
  stepRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10,
  },
  stepRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  stepIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
  },
  stepMeta: {flex: 1},
  stepLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  stepSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  ctaRow: {flexDirection: 'row', gap: 10, paddingTop: 4},
  ctaSecondary: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  ctaSecondaryText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurfaceVariant},
  ctaPrimary: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 14,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaPrimaryText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary},
});
