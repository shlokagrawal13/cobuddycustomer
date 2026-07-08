import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SafetyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SafetyStackParamList, 'IncidentReport'>;

// Stitch: safety_incident_report_screen
// menu | "Safety & Incident Support"
// "Securely report trusted experience concerns and receive concierge-level assistance immediately. Your privacy is paramount."
// shield "Safety Protection Active" | "Concierge Monitoring Enabled" | verified Protected
// Select Incident Category: storefront Venue Concern | warning Safety Issue | report_problem Harassment | more_horiz Other
// Need Immediate Help? | Submit Report

const CATEGORIES = [
  {id: 'venue',        icon: 'storefront',      label: 'Venue Concern'},
  {id: 'safety',       icon: 'warning',         label: 'Safety Issue'},
  {id: 'harassment',   icon: 'report-problem',  label: 'Harassment'},
  {id: 'other',        icon: 'more-horiz',      label: 'Other'},
] as const;

type CategoryId = typeof CATEGORIES[number]['id'];

const SEVERITY_LEVELS = [
  {id: 'low',      label: 'Low',      color: Colors.success,  icon: 'info'},
  {id: 'medium',   label: 'Medium',   color: Colors.warning,  icon: 'warning'},
  {id: 'high',     label: 'High',     color: Colors.error,    icon: 'priority-high'},
  {id: 'critical', label: 'Critical', color: Colors.error,    icon: 'emergency'},
] as const;

type SeverityId = typeof SEVERITY_LEVELS[number]['id'];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function IncidentReportScreen({navigation}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityId | null>(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = selectedCategory !== null && description.trim().length >= 10;

  const handleImmediateHelp = () => {
    Alert.alert(
      'Immediate Help',
      'For immediate safety assistance, please activate the Emergency SOS from the Safety Hub, or contact your local emergency services directly.',
      [{text: 'OK'}],
    );
  };

  const handleEvidenceUpload = () => {
    navigation.navigate('IncidentEvidenceUpload', {});
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      Alert.alert('Incomplete Report', 'Please select an incident category and provide a description (at least 10 characters).');
      return;
    }
    Alert.alert(
      'Report Submitted',
      'Your incident report has been securely submitted. A CoBuddy Concierge safety specialist will review it within 24 hours. Your privacy is fully protected.',
      [
        {
          text: 'OK',
          onPress: () => {
            setSubmitted(true);
          },
        },
      ],
    );
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Icon name="arrow-back" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Safety & Incident Support</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.successBody}>
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={56} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successSub}>
            Your report has been securely submitted. A safety specialist will review it within 24 hours.
          </Text>
          <View style={styles.successNote}>
            <Icon name="lock" size={14} color={Colors.onSurfaceVariant} />
            <Text style={styles.successNoteText}>Your privacy is fully protected.</Text>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Back to Safety Hub</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — Stitch: menu + "Safety & Incident Support" */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Safety & Incident Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Sub-copy — Stitch exact */}
          <Text style={styles.pageSub}>
            Securely report trusted experience concerns and receive concierge-level assistance immediately. Your privacy is paramount.
          </Text>

          {/* Trust status banner — Stitch: shield "Safety Protection Active" | "Concierge Monitoring Enabled" | verified Protected */}
          <View style={styles.trustBanner}>
            <View style={styles.trustBannerRow}>
              <Icon name="shield" size={16} color={Colors.primary} />
              <Text style={styles.trustBannerText}>Safety Protection Active</Text>
            </View>
            <View style={styles.trustBannerDivider} />
            <View style={styles.trustBannerRow}>
              <Icon name="support-agent" size={16} color={Colors.primary} />
              <Text style={styles.trustBannerText}>Concierge Monitoring Enabled</Text>
            </View>
            <View style={styles.trustBannerDivider} />
            <View style={styles.trustBannerRow}>
              <Icon name="verified" size={16} color={Colors.success} />
              <Text style={styles.trustBannerText}>Protected</Text>
            </View>
          </View>

          {/* Category selector — Stitch: storefront / warning / report_problem / more_horiz */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SELECT INCIDENT CATEGORY</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => {
                const selected = selectedCategory === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.categoryCard, selected && styles.categoryCardSelected]}
                    onPress={() => setSelectedCategory(cat.id)}
                    activeOpacity={0.75}>
                    <Icon name={cat.icon} size={24} color={selected ? Colors.primary : Colors.onSurfaceVariant} />
                    <Text style={[styles.categoryLabel, selected && styles.categoryLabelSelected]}>
                      {cat.label}
                    </Text>
                    {selected && (
                      <View style={styles.categoryCheck}>
                        <Icon name="check-circle" size={14} color={Colors.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Severity selector */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SEVERITY LEVEL</Text>
            <View style={styles.severityRow}>
              {SEVERITY_LEVELS.map(sev => {
                const selected = selectedSeverity === sev.id;
                return (
                  <TouchableOpacity
                    key={sev.id}
                    style={[
                      styles.severityChip,
                      selected && {backgroundColor: sev.color + '20', borderColor: sev.color + '60'},
                    ]}
                    onPress={() => setSelectedSeverity(sev.id)}
                    activeOpacity={0.75}>
                    <Icon name={sev.icon} size={14} color={selected ? sev.color : Colors.onSurfaceVariant} />
                    <Text style={[styles.severityLabel, selected && {color: sev.color}]}>
                      {sev.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Description */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>INCIDENT DESCRIPTION</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describe the incident in detail. Include location, time, and any relevant context..."
              placeholderTextColor={Colors.onSurfaceVariant}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{description.length} characters{description.length < 10 ? ' (minimum 10)' : ''}</Text>
          </View>

          {/* Evidence upload placeholder */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>SUPPORTING EVIDENCE</Text>
            <Text style={styles.evidenceHint}>
              Attach photos or screenshots to support your report. Max 10MB each.
            </Text>
            <TouchableOpacity style={styles.uploadSlot} onPress={handleEvidenceUpload} activeOpacity={0.8}>
              <Icon name="cloud-upload" size={28} color={Colors.onSurfaceVariant} />
              <View style={styles.uploadSlotMeta}>
                <Text style={styles.uploadSlotTitle}>Upload Evidence</Text>
                <Text style={styles.uploadSlotSub}>JPG, PNG, PDF - coming soon</Text>
              </View>
              <Icon name="add-circle" size={20} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Review section */}
          {canSubmit && (
            <View style={styles.reviewCard}>
              <Text style={styles.sectionLabel}>REPORT SUMMARY</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewKey}>Category</Text>
                <Text style={styles.reviewVal}>
                  {CATEGORIES.find(c => c.id === selectedCategory)?.label}
                </Text>
              </View>
              {selectedSeverity && (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewKey}>Severity</Text>
                  <Text style={styles.reviewVal}>
                    {SEVERITY_LEVELS.find(s => s.id === selectedSeverity)?.label}
                  </Text>
                </View>
              )}
              <View style={styles.reviewRow}>
                <Text style={styles.reviewKey}>Description</Text>
                <Text style={styles.reviewVal} numberOfLines={2}>{description}</Text>
              </View>
            </View>
          )}

          {/* Immediate Help banner — Stitch: "Need Immediate Help?" */}
          <TouchableOpacity style={styles.immediateHelpCard} onPress={handleImmediateHelp} activeOpacity={0.8}>
            <Icon name="priority-high" size={20} color={Colors.error} />
            <View style={styles.immediateHelpMeta}>
              <Text style={styles.immediateHelpTitle}>Need Immediate Help?</Text>
              <Text style={styles.immediateHelpSub}>Activate Emergency SOS for real-time assistance</Text>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.error} />
          </TouchableOpacity>

          {/* Submit button — Stitch: "Submit Report" */}
          <TouchableOpacity
            style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.85}>
            <Icon name="send" size={18} color={Colors.onPrimary} />
            <Text style={styles.submitBtnText}>Submit Report</Text>
          </TouchableOpacity>

          {/* Privacy note */}
          <View style={styles.privacyNote}>
            <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.privacyText}>
              Reports are encrypted and reviewed only by authorized CoBuddy safety personnel. Your identity is protected.
            </Text>
          </View>

          <View style={{height: 24}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  flex: {flex: 1},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 16, gap: 16},

  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 12,
    backgroundColor: 'rgba(20,20,15,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  headerSpacer: {width: 40},

  pageSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},

  // Trust banner
  trustBanner: {
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    borderLeftWidth: 3, borderLeftColor: Colors.primary, padding: 14, gap: 10,
  },
  trustBannerRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  trustBannerText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  trustBannerDivider: {height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER},

  // Generic card
  card: {backgroundColor: CARD_BG, borderRadius: 20, borderWidth: 1, borderColor: CARD_BORDER, padding: 20},
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14},

  // Category grid 2x2
  categoryGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  categoryCard: {
    flex: 1, minWidth: '45%', alignItems: 'center', gap: 8, padding: 14,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    backgroundColor: Colors.surfaceContainerHigh, position: 'relative',
  },
  categoryCardSelected: {borderColor: Colors.primary, backgroundColor: 'rgba(242,202,80,0.08)'},
  categoryLabel: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center'},
  categoryLabelSelected: {color: Colors.primary, fontFamily: 'Inter-Medium'},
  categoryCheck: {position: 'absolute', top: 8, right: 8},

  // Severity
  severityRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  severityChip: {
    flex: 1, minWidth: '22%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  severityLabel: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant},

  // Description
  descriptionInput: {
    borderRadius: 12, borderWidth: 1, borderColor: CARD_BORDER,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface,
    minHeight: 120,
  },
  charCount: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 6, textAlign: 'right'},

  // Evidence upload
  evidenceHint: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 12, lineHeight: 17},
  uploadSlot: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER,
    borderStyle: 'dashed', padding: 16, backgroundColor: Colors.surfaceContainerHigh,
  },
  uploadSlotMeta: {flex: 1},
  uploadSlotTitle: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  uploadSlotSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Review
  reviewCard: {
    backgroundColor: CARD_BG, borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.25)', padding: 16, gap: 10,
  },
  reviewRow: {flexDirection: 'row', gap: 12},
  reviewKey: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant, width: 84},
  reviewVal: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},

  // Immediate help
  immediateHelpCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(255,75,75,0.06)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,75,75,0.20)',
    borderLeftWidth: 3, borderLeftColor: Colors.error, padding: 14,
  },
  immediateHelpMeta: {flex: 1},
  immediateHelpTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.error},
  immediateHelpSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2},

  // Submit
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 17, borderRadius: 100, backgroundColor: Colors.primary,
  },
  submitBtnDisabled: {opacity: 0.45},
  submitBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary, letterSpacing: 0.3},

  // Privacy note
  privacyNote: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, opacity: 0.6},
  privacyText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},

  // Success state
  successBody: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 20},
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderWidth: 2, borderColor: 'rgba(109,217,140,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  successTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.onSurface},
  successSub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20},
  successNote: {flexDirection: 'row', alignItems: 'center', gap: 8, opacity: 0.7},
  successNoteText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  doneBtn: {
    width: '100%', paddingVertical: 17, borderRadius: 100,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  doneBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary, letterSpacing: 0.3},
});
