import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch ref: dispute_resolution_refund_request_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'DisputeRefund'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const WARN_BG     = 'rgba(255,180,171,0.10)';
const WARN_BD     = 'rgba(255,180,171,0.28)';

const ISSUE_TYPES = [
  {icon: 'event-busy',      label: 'SESSION DID NOT HAPPEN'},
  {icon: 'person-cancel',   label: 'COMPANION DID NOT ARRIVE'},
  {icon: 'schedule',        label: 'LATE ARRIVAL / EARLY END'},
  {icon: 'help',            label: 'OTHER CONCERNS'},
];

const RESOLUTION_TYPES = [
  {icon: 'account-balance-wallet', label: 'FULL REFUND',      sub: 'To original payment method'},
  {icon: 'payments',               label: 'PARTIAL REFUND',   sub: 'Adjustment for service quality'},
  {icon: 'confirmation-number',    label: 'SERVICE CREDIT',   sub: 'Immediate credit + 10% bonus'},
];

const RESOLUTION_STEPS = [
  {label: 'SUBMITTED',       sub: 'Your request is logged in our secure vault.', done: true},
  {label: 'CONCIERGE REVIEW',sub: 'Human expert reviews the details within 4 hours.', done: false},
  {label: 'FAIR ASSESSMENT', sub: "Both parties' history and evidence are evaluated.", done: false},
  {label: 'DECISION & RESOLUTION', sub: 'Final outcome and fund release/refund.', done: false},
];


const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

export default function DisputeRefundScreen({navigation, route}: Props) {
  const {bookingId} = route.params;
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [selectedResolution, setSelectedResolution] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  const handleSaveDraft = () => {
    setDraftSaved(true);
    Alert.alert(
      'Draft Saved',
      'Your dispute details have been saved. You can return to this screen to continue and submit when ready.',
      [{text: 'OK'}],
    );
  };

  const handleContactSafety = () => {
    (navigation as any).navigate('SafetyNavigator', {screen: 'EmergencySOS'});
  };

  const handleSubmit = () => {
    if (selectedIssue === null) {
      Alert.alert('Select Issue Type', 'Please select the issue that best describes your experience.');
      return;
    }
    Alert.alert(
      'Request Submitted',
      'Your resolution request has been securely logged. Our concierge team will review within 4 hours.',
      [{text: 'Done', onPress: () => navigation.goBack()}],
    );
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
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Resolution Center</Text>
        <TouchableOpacity style={styles.backBtn}
          onPress={() => (navigation as any).navigate('ConciergeNavigator', {
            screen: 'MessagingThread',
            params: {conversationId: 'concierge_main'},
          })}
          activeOpacity={0.7}>
          <Icon name="support-agent" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Safety Concern Banner */}
        <TouchableOpacity
          style={styles.safetyBanner}
          onPress={handleContactSafety}
          activeOpacity={0.85}>
          <Icon name="warning" size={18} color={Colors.error} />
          <View style={styles.safetyBannerMeta}>
            <Text style={styles.safetyBannerTitle}>Is this a safety concern?</Text>
            <Text style={styles.safetyBannerSub}>
              Your well-being is our highest priority. Immediate safety matters are handled by our dedicated 24/7 team.
            </Text>
          </View>
          <View style={styles.safetyBannerCTA}>
            <Text style={styles.safetyBannerCTAText}>CONTACT SAFETY{'\n'}CONCIERGE</Text>
          </View>
        </TouchableOpacity>

        {/* Booking ref */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingRef}>BOOKING REF: #{bookingId.toUpperCase().slice(0, 8)}</Text>
          </View>
          <Text style={styles.bookingName}>Julianne V.</Text>
          <Text style={styles.bookingVenue}>The Ritz-Carlton, Lounge Area</Text>
          <View style={styles.bookingDateRow}>
            <Icon name="calendar-today" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.bookingDateText}>Oct 24, 2023 — 08:30 PM</Text>
          </View>
          <View style={styles.bookingBadges}>
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={11} color={Colors.success} />
              <Text style={styles.verifiedBadgeText}>VERIFIED BOOKING</Text>
            </View>
            <View style={styles.shieldBadge}>
              <Icon name="shield" size={11} color={Colors.primary} />
              <Text style={styles.shieldBadgeText}>CONCIERGE PROTECTED</Text>
            </View>
          </View>
        </View>

        {/* How can we help */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>How can we help?</Text>
          {ISSUE_TYPES.map((issue, i) => (
            <TouchableOpacity
              key={issue.label}
              style={[
                styles.issueRow,
                i < ISSUE_TYPES.length - 1 && styles.issueRowBorder,
                selectedIssue === i && styles.issueRowSelected,
              ]}
              onPress={() => setSelectedIssue(selectedIssue === i ? null : i)}
              activeOpacity={0.75}>
              <View style={[styles.issueIconWrap, selectedIssue === i && styles.issueIconWrapSelected]}>
                <Icon
                  name={issue.icon}
                  size={18}
                  color={selectedIssue === i ? Colors.onPrimary : Colors.onSurfaceVariant}
                />
              </View>
              <Text style={[styles.issueLabel, selectedIssue === i && {color: Colors.primary}]}>
                {issue.label}
              </Text>
              {selectedIssue === i && (
                <Icon name="check-circle" size={16} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Describe what happened */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Describe what happened</Text>
          <TextInput
            style={styles.describeField}
            placeholder="Describe your experience in detail..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <Text style={styles.evidenceLabel}>Evidence</Text>
          <View style={styles.evidenceRow}>
            <TouchableOpacity style={styles.evidenceBtn} onPress={() => (navigation as any).navigate('SafetyNavigator', {screen: 'IncidentEvidenceUpload', params: {reportId: route.params.bookingId}})} activeOpacity={0.8}>
              <Icon name="add-a-photo" size={18} color={Colors.onSurfaceVariant} />
              <Text style={styles.evidenceBtnText}>ADD PHOTOS</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.evidenceBtn} onPress={() => (navigation as any).navigate('SafetyNavigator', {screen: 'IncidentEvidenceUpload', params: {reportId: route.params.bookingId}})} activeOpacity={0.8}>
              <Icon name="screenshot" size={18} color={Colors.onSurfaceVariant} />
              <Text style={styles.evidenceBtnText}>SCREENSHOTS</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.encryptedNote}>
            <Icon name="lock" size={12} color={Colors.onSurfaceVariant} />
            <Text style={styles.encryptedNoteText}>
              All data is encrypted and reviewed only by authorized specialists.
            </Text>
          </View>
        </View>

        {/* Resolution Path */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resolution Path</Text>
          {RESOLUTION_STEPS.map((step, i) => (
            <View key={step.label} style={styles.stepRow}>
              <View style={[styles.stepDot, step.done && styles.stepDotDone]}>
                {step.done && <Icon name="check" size={10} color={Colors.surface} />}
              </View>
              <View style={styles.stepMeta}>
                <Text style={[styles.stepLabel, step.done && {color: Colors.success}]}>
                  {step.label}
                </Text>
                <Text style={styles.stepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Preferred Resolution */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferred Resolution</Text>
          {RESOLUTION_TYPES.map((res, i) => (
            <TouchableOpacity
              key={res.label}
              style={[
                styles.resolutionRow,
                i < RESOLUTION_TYPES.length - 1 && styles.resolutionRowBorder,
                selectedResolution === i && styles.resolutionRowSelected,
              ]}
              onPress={() => setSelectedResolution(i)}
              activeOpacity={0.75}>
              <View style={[styles.resolutionIconWrap, selectedResolution === i && styles.resolutionIconSelected]}>
                <Icon
                  name={res.icon}
                  size={16}
                  color={selectedResolution === i ? Colors.onPrimary : Colors.primary}
                />
              </View>
              <View style={styles.resolutionMeta}>
                <Text style={[styles.resolutionLabel, selectedResolution === i && {color: Colors.primary}]}>
                  {res.label}
                </Text>
                <Text style={styles.resolutionSub}>{res.sub}</Text>
              </View>
              {selectedResolution === i && (
                <Icon name="check-circle" size={16} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Trust row */}
        <View style={styles.trustRow}>
          <View style={styles.trustItem}>
            <Icon name="balance" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.trustItemText}>FAIR RESOLUTION</Text>
          </View>
          <View style={styles.trustDivider} />
          <View style={styles.trustItem}>
            <Icon name="encrypted" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.trustItemText}>PRIVACY PROTECTED</Text>
          </View>
        </View>

        <Text style={styles.expertNote}>
          Our dedicated Resolution Experts guarantee a fair outcome based on CoBuddy's community standards and privacy protocols.
        </Text>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky CTAs */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.88}>
          <Icon name="send" size={16} color={Colors.onPrimary} />
          <Text style={styles.submitBtnText}>Submit Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft} activeOpacity={0.8}>
          <Text style={[styles.draftBtnText, draftSaved && {color: Colors.primary}]}>
            {draftSaved ? 'Draft Saved' : 'Save Draft'}
          </Text>
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
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface},

  // Safety banner
  safetyBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: WARN_BG, borderRadius: 18,
    borderWidth: 1, borderColor: WARN_BD, padding: 14,
  },
  safetyBannerMeta: {flex: 1},
  safetyBannerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.error, marginBottom: 4},
  safetyBannerSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
  safetyBannerCTA: {
    backgroundColor: Colors.error, borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8, flexShrink: 0,
  },
  safetyBannerCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onError, textAlign: 'center', lineHeight: 13},

  // Booking card
  bookingCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER, padding: 16, gap: 8,
  },
  bookingHeader: {marginBottom: 4},
  bookingRef: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1},
  bookingName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface},
  bookingVenue: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  bookingDateRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  bookingDateText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  bookingBadges: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4},
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(109,217,140,0.10)', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
  },
  verifiedBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.success, letterSpacing: 0.5},
  shieldBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(242,202,80,0.08)', borderRadius: 100,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  shieldBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 0.5},

  // Generic card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  sectionTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},

  // Issue rows
  issueRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  issueRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  issueRowSelected: {
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 12, paddingHorizontal: 8,
  },
  issueIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  issueIconWrapSelected: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  issueLabel: {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurface, letterSpacing: 0.5},

  // Describe field
  describeField: {
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: 14,
    minHeight: 80, padding: 14,
    borderWidth: 1, borderColor: CARD_BORDER,
    fontFamily: 'Inter-Regular', fontSize: 13, color: '#e6e2d9',
  },
  describeFieldPlaceholder: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  evidenceLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  evidenceRow: {flexDirection: 'row', gap: 10},
  evidenceBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12, paddingVertical: 12,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  evidenceBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 0.8},
  encryptedNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  encryptedNoteText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},

  // Resolution steps
  stepRow: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 8},
  stepDot: {
    width: 22, height: 22, borderRadius: 11, marginTop: 2,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  stepDotDone: {backgroundColor: Colors.success, borderColor: Colors.success},
  stepMeta: {flex: 1},
  stepLabel: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurface, letterSpacing: 0.5},
  stepSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Resolution types
  resolutionRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  resolutionRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  resolutionRowSelected: {
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 12, paddingHorizontal: 8,
  },
  resolutionIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  resolutionIconSelected: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  resolutionMeta: {flex: 1},
  resolutionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurface, letterSpacing: 0.5},
  resolutionSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Trust row
  trustRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  trustItem: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6},
  trustDivider: {width: 1, height: 20, backgroundColor: CARD_BORDER},
  trustItemText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  expertNote: {
    fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant,
    textAlign: 'center', lineHeight: 18, paddingHorizontal: 8,
  },

  // Bottom CTAs
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.97)',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 8,
  },
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 15,
  },
  submitBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
  draftBtn: {alignItems: 'center', justifyContent: 'center', paddingVertical: 8},
  draftBtnText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
});
