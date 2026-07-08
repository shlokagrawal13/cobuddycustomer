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

// No direct Stitch match — built from CoBuddy product logic and design system

type Props = NativeStackScreenProps<SessionsStackParamList, 'DigitalPass'>;

const CARD_BG      = 'rgba(32,32,26,0.95)';
const CARD_BORDER  = 'rgba(255,255,255,0.07)';
const GOLD_BORDER  = 'rgba(242,202,80,0.20)';
const SUCCESS_BG   = 'rgba(109,217,140,0.10)';
const SUCCESS_BD   = 'rgba(109,217,140,0.28)';

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

// Simulated QR refresh tick — updates visually every 30 seconds
function useQRTimer(initialSecs: number = 30) {
  const [secs, setSecs] = useState(initialSecs);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    ref.current = setInterval(() => {
      setSecs(v => {
        if (v <= 1) return 30; // reset
        return v - 1;
      });
    }, 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, []);
  return secs;
}

const PASS_FEATURES = [
  {icon: 'verified',      label: 'Identity Verified',       note: 'Trust score: 97 / 100'},
  {icon: 'shield',        label: 'Concierge Protected',      note: 'Active monitoring enabled'},
  {icon: 'health-and-safety', label: 'Safety Systems Active', note: '2 trusted contacts notified'},
  {icon: 'place',         label: 'Venue Pre-Authorized',    note: 'The Roastery — Trusted Partner'},
];

export default function DigitalPassScreen({navigation, route}: Props) {
  const {bookingId} = route.params;

  const handleSharePass = async () => {
    try {
      await Share.share({
        title: 'CoBuddy Digital Pass',
        message: `Your CoBuddy Digital Pass\nBooking Ref: #${bookingId.toUpperCase().slice(0, 10)}\n\nPresent this pass at the venue. For questions contact your concierge via the CoBuddy app.`,
      });
    } catch {
      Alert.alert('Share', 'Unable to open the share sheet. Please try again.');
    }
  };

  const handleSavePass = () => {
    Alert.alert(
      'Save Pass',
      'Digital pass export will be enabled with native file storage integration. Your pass will be saved to your device when this feature is connected.',
      [{text: 'OK'}],
    );
  };

  const qrSecs = useQRTimer(30);

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
          <Icon name="qr-code" size={16} color={Colors.primary} />
          <Text style={styles.headerTitle}>Digital Pass</Text>
        </View>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleSharePass}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="share" size={18} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Pass hero */}
        <View style={styles.passCard}>
          {/* Pass header strip */}
          <View style={styles.passHeader}>
            <View style={styles.passLogoRow}>
              <Icon name="shield" size={16} color={Colors.onPrimary} />
              <Text style={styles.passLogoText}>COBUDDY VERIFIED PASS</Text>
            </View>
            <View style={styles.passBadge}>
              <View style={styles.passActiveDot} />
              <Text style={styles.passBadgeText}>ACTIVE</Text>
            </View>
          </View>

          {/* Booking details */}
          <View style={styles.passBody}>
            <Text style={styles.passRef}>
              REF: #{bookingId.toUpperCase().slice(0, 10)}
            </Text>
            <Text style={styles.passTitle}>Curated Coffee Conversations</Text>
            <View style={styles.passDetailRow}>
              <Icon name="calendar-today" size={13} color={Colors.onSurfaceVariant} />
              <Text style={styles.passDetailText}>Thursday, 12 June — 8:00 PM</Text>
            </View>
            <View style={styles.passDetailRow}>
              <Icon name="location-on" size={13} color={Colors.onSurfaceVariant} />
              <Text style={styles.passDetailText}>The Roastery, Mayfair — Private Lounge</Text>
            </View>
            <View style={styles.passDetailRow}>
              <Icon name="schedule" size={13} color={Colors.onSurfaceVariant} />
              <Text style={styles.passDetailText}>3 hours · Smart Elegant dress code</Text>
            </View>
          </View>

          {/* Companion info */}
          <View style={styles.companionStrip}>
            <View style={styles.companionAvatar}>
              <Text style={styles.companionInitial}>E</Text>
            </View>
            <View style={styles.companionMeta}>
              <View style={styles.companionNameRow}>
                <Icon name="verified" size={12} color={Colors.success} />
                <Text style={styles.companionName}>Elena M.</Text>
              </View>
              <Text style={styles.companionSub}>Verified Companion · London, UK</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchBadgeText}>94%{'\n'}Match</Text>
            </View>
          </View>

          {/* QR code area */}
          <View style={styles.qrSection}>
            <View style={styles.qrFrame}>
              {/* Simulated QR grid */}
              <View style={styles.qrGrid}>
                {Array.from({length: 25}).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrCell,
                      // Corner markers + random fill pattern
                      (i === 0 || i === 4 || i === 20 || i === 24 ||
                       i === 6 || i === 7 || i === 8 || i === 11 || i === 13 || i === 16 || i === 17 || i === 18) && styles.qrCellFilled,
                    ]}
                  />
                ))}
              </View>
              {/* Corner brackets */}
              <View style={[styles.qrCorner, styles.qrCornerTL]} />
              <View style={[styles.qrCorner, styles.qrCornerTR]} />
              <View style={[styles.qrCorner, styles.qrCornerBL]} />
              <View style={[styles.qrCorner, styles.qrCornerBR]} />
            </View>
            <Text style={styles.qrInstruction}>Show to venue staff at arrival</Text>
            <View style={styles.qrRefreshRow}>
              <Icon name="sync" size={12} color={Colors.onSurfaceVariant} />
              <Text style={styles.qrRefreshText}>Refreshes in {qrSecs}s</Text>
            </View>
          </View>

          {/* Pass footer */}
          <View style={styles.passFooter}>
            <View style={styles.passFooterLeft}>
              <Text style={styles.passFooterLabel}>VALID FOR ONE SESSION</Text>
              <Text style={styles.passFooterSub}>Non-transferable · Concierge issued</Text>
            </View>
            <Icon name="qr-code" size={28} color={Colors.primary} />
          </View>
        </View>

        {/* Protection features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pass Protection</Text>
          {PASS_FEATURES.map((feat, i) => (
            <View
              key={feat.icon}
              style={[styles.featureRow, i < PASS_FEATURES.length - 1 && styles.featureRowBorder]}>
              <View style={styles.featureIconWrap}>
                <Icon name={feat.icon} size={16} color={Colors.success} />
              </View>
              <View style={styles.featureMeta}>
                <Text style={styles.featureLabel}>{feat.label}</Text>
                <Text style={styles.featureNote}>{feat.note}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSavePass} activeOpacity={0.8}>
            <Icon name="download" size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Save Pass</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleSharePass} activeOpacity={0.8}>
            <Icon name="share" size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => (navigation as any).navigate('ConciergeNavigator', {
              screen: 'MessagingThread',
              params: {conversationId: 'concierge_main'},
            })}
            activeOpacity={0.8}>
            <Icon name="support-agent" size={18} color={Colors.primary} />
            <Text style={styles.actionBtnText}>Concierge</Text>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.disclaimerText}>
            This pass is cryptographically signed and expires after your session. It cannot be transferred or reused.
          </Text>
        </View>

        <View style={{height: 24}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 12, gap: 16},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerCenter: {flexDirection: 'row', alignItems: 'center', gap: 8},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},

  // Pass card
  passCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: GOLD_BORDER, overflow: 'hidden',
  },
  passHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(242,202,80,0.15)',
    borderBottomWidth: 1, borderBottomColor: GOLD_BORDER,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  passLogoRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  passLogoText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary, letterSpacing: 1.2},
  passBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  passActiveDot: {width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.success},
  passBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 1},
  passBody: {padding: 16, gap: 10},
  passRef: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1},
  passTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.onSurface, marginBottom: 4},
  passDetailRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  passDetailText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, flex: 1},
  companionStrip: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  companionAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  companionInitial: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.primary},
  companionMeta: {flex: 1},
  companionNameRow: {flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3},
  companionName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  companionSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  matchBadge: {
    backgroundColor: 'rgba(242,202,80,0.12)', borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: GOLD_BORDER, alignItems: 'center',
  },
  matchBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary, textAlign: 'center'},

  // QR
  qrSection: {alignItems: 'center', paddingVertical: 24, gap: 12},
  qrFrame: {
    width: 160, height: 160, borderRadius: 12, padding: 16,
    backgroundColor: Colors.onSurface,
    position: 'relative', justifyContent: 'center', alignItems: 'center',
  },
  qrGrid: {flexDirection: 'row', flexWrap: 'wrap', width: 90, gap: 3},
  qrCell: {width: 14, height: 14, borderRadius: 2, backgroundColor: 'rgba(20,20,15,0.15)'},
  qrCellFilled: {backgroundColor: Colors.surface},
  qrCorner: {position: 'absolute', width: 24, height: 24, borderColor: Colors.surface, borderWidth: 3, borderRadius: 4},
  qrCornerTL: {top: 12, left: 12, borderRightWidth: 0, borderBottomWidth: 0},
  qrCornerTR: {top: 12, right: 12, borderLeftWidth: 0, borderBottomWidth: 0},
  qrCornerBL: {bottom: 12, left: 12, borderRightWidth: 0, borderTopWidth: 0},
  qrCornerBR: {bottom: 12, right: 12, borderLeftWidth: 0, borderTopWidth: 0},
  qrInstruction: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  qrRefreshRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  qrRefreshText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},

  // Pass footer
  passFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderTopWidth: 1, borderTopColor: GOLD_BORDER,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  passFooterLeft: {gap: 3},
  passFooterLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 0.8},
  passFooterSub: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant},

  // Features
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  cardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  featureRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  featureRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  featureIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: SUCCESS_BG, borderWidth: 1, borderColor: SUCCESS_BD,
    alignItems: 'center', justifyContent: 'center',
  },
  featureMeta: {flex: 1},
  featureLabel: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  featureNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Actions
  actionsRow: {flexDirection: 'row', gap: 10},
  actionBtn: {
    flex: 1, alignItems: 'center', gap: 8, paddingVertical: 14,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  actionBtnText: {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.primary},

  // Disclaimer
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: CARD_BORDER,
  },
  disclaimerText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
});
