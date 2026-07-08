import React, {useState} from 'react';
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

// Stitch ref: arrival_verification_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'ArrivalVerification'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';


const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

export default function ArrivalVerificationScreen({navigation, route}: Props) {
  const {sessionId} = route.params;
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      navigation.navigate('ActiveSession', {sessionId});
    }, 1200);
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
        <Text style={styles.headerTitle}>Verified Arrival</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => (navigation as any).navigate('ConciergeNavigator', {screen: 'ConciergeDashboard'})}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="support-agent" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Icon name="verified" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>Verified Arrival</Text>
          <Text style={styles.heroSub}>Secure Activation</Text>
        </View>

        {/* Venue Card */}
        <View style={styles.card}>
          <View style={styles.venueHeaderRow}>
            <View style={styles.venueIconWrap}>
              <Icon name="store" size={20} color={Colors.primary} />
            </View>
            <View style={styles.venueMeta}>
              <Text style={styles.venueName}>The Roastery</Text>
              <View style={styles.trustedChip}>
                <Icon name="shield" size={11} color={Colors.success} />
                <Text style={styles.trustedChipText}>Trusted Public Venue</Text>
              </View>
            </View>
          </View>

          {/* Location check */}
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Icon name="location-on" size={16} color={Colors.onSurfaceVariant} />
            <Text style={styles.locationText}>Checking Venue Location...</Text>
          </View>
        </View>

        {/* QR Scanner */}
        <TouchableOpacity
          style={styles.qrCard}
          onPress={() =>
            Alert.alert(
              'QR Code Scanner',
              'Scanning requires camera permission. Point your device at the venue QR code — this will activate automatically in the production build.',
              [{text: 'OK'}],
            )
          }
          activeOpacity={0.85}>
          <View style={styles.qrIconWrap}>
            <Icon name="qr-code-scanner" size={44} color={Colors.primary} />
          </View>
          <Text style={styles.qrLabel}>Scan venue verification code</Text>
          <View style={styles.openChip}>
            <Text style={styles.openChipText}>Open</Text>
          </View>
        </TouchableOpacity>

        {/* Experience Partner */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>EXPERIENCE PARTNER</Text>
          <View style={styles.partnerRow}>
            <View style={styles.partnerAvatar}>
              <Text style={styles.partnerInitial}>E</Text>
            </View>
            <View style={styles.partnerMeta}>
              <View style={styles.partnerNameRow}>
                <Icon name="verified" size={14} color={Colors.success} />
                <Text style={styles.partnerName}>Elena V.</Text>
              </View>
              <View style={styles.checkedInChip}>
                <View style={styles.checkedInDot} />
                <Text style={styles.checkedInText}>Checked In</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Safety Reminder */}
        <View style={styles.safetyBox}>
          <Icon name="shield" size={18} color={Colors.onSurfaceVariant} />
          <Text style={styles.safetyText}>
            Public Venue Safety Reminder: All CoBuddy experiences begin only after arrival verification at trusted public venues.
          </Text>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Bottom CTAs */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.verifyBtn, verifying && styles.verifyBtnLoading]}
          onPress={handleVerify}
          disabled={verifying}
          activeOpacity={0.88}>
          <Icon name="check-circle" size={18} color={Colors.onPrimary} />
          <Text style={styles.verifyBtnText}>
            {verifying ? 'Verifying...' : 'Verify Arrival'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.assistanceBtn}
          onPress={handleAssistance}
          activeOpacity={0.8}>
          <Icon name="shield" size={15} color={Colors.primary} />
          <Text style={styles.assistanceBtnText}>Need Assistance?</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
    paddingHorizontal: 16, paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},

  // Hero
  hero: {alignItems: 'center', paddingVertical: 24, gap: 10},
  heroIconWrap: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.onSurface},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},

  // Card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5,
  },

  // Venue
  venueHeaderRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  venueIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  venueMeta: {flex: 1, gap: 6},
  venueName: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  trustedChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: SUCCESS_BD,
    alignSelf: 'flex-start',
  },
  trustedChipText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success},
  locationRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  locationDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.warning, opacity: 0.8,
  },
  locationText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // QR
  qrCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', paddingVertical: 28, gap: 10,
  },
  qrIconWrap: {
    width: 80, height: 80, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  qrLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  openChip: {
    backgroundColor: Colors.primary, borderRadius: 100,
    paddingHorizontal: 20, paddingVertical: 7,
  },
  openChipText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onPrimary},

  // Partner
  partnerRow: {flexDirection: 'row', alignItems: 'center', gap: 14},
  partnerAvatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  partnerInitial: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.primary},
  partnerMeta: {flex: 1, gap: 6},
  partnerNameRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  partnerName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  checkedInChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'flex-start', backgroundColor: SUCCESS_BG,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  checkedInDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success},
  checkedInText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success},

  // Safety
  safetyBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 16, padding: 14,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  safetyText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },

  // Bottom
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.97)',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 10,
  },
  verifyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 15,
  },
  verifyBtnLoading: {opacity: 0.7},
  verifyBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
  assistanceBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 10,
  },
  assistanceBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.primary},
});
