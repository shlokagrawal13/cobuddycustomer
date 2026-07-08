import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {VerifyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<VerifyStackParamList, 'KYCDocumentUpload'>;

// Stitch: kyc_upload_screen
// VERIFICATION 3 OF 3 | Complete Identity Verification
// Upload a valid government-issued identity document to unlock verified CoBuddy experiences.
// SELECT DOCUMENT TYPE: badge Aadhaar, contact_emergency PAN, menu_book Passport, directions_car Driving License
// cloud_upload Upload Document | image preview | tips: light_mode / aspect_ratio / blur_off
// CTA: Continue Verification
// lock footer: encrypted and securely protected.

const DOC_TYPES = [
  {id: 'aadhaar',  icon: 'badge',              label: 'Aadhaar Card'},
  {id: 'pan',      icon: 'contact-emergency',  label: 'PAN Card'},
  {id: 'passport', icon: 'menu-book',          label: 'Passport'},
  {id: 'license',  icon: 'directions-car',     label: 'Driving License'},
] as const;

type DocTypeId = typeof DOC_TYPES[number]['id'];

const UPLOAD_TIPS = [
  {icon: 'light-mode',    label: 'Use clear lighting'},
  {icon: 'aspect-ratio',  label: 'Keep all corners visible'},
  {icon: 'blur-off',      label: 'No blurry or cropped images'},
];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

type UploadState = 'idle' | 'selected' | 'uploaded';

export default function KYCDocumentUploadScreen({navigation}: Props) {
  const [selectedDocType, setSelectedDocType] = useState<DocTypeId>('aadhaar');
  const [frontState, setFrontState] = useState<UploadState>('idle');
  const [backState, setBackState]   = useState<UploadState>('idle');

  const canSubmit = frontState === 'uploaded' && backState === 'uploaded';

  const handleMockUpload = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontState('selected');
      setTimeout(() => setFrontState('uploaded'), 600);
    } else {
      setBackState('selected');
      setTimeout(() => setBackState('uploaded'), 600);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — Stitch: arrow_back + VERIFICATION 3 OF 3 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.stepLabel}>VERIFICATION 3 OF 3</Text>
          <Text style={styles.headerTitle}>Complete Identity Verification</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Icon name="verified-user" size={20} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Sub-copy — Stitch exact */}
        <Text style={styles.pageSub}>
          Upload a valid government-issued identity document to unlock verified CoBuddy experiences.
        </Text>

        {/* Document type selector — Stitch: badge/PAN/Passport/Driving */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>SELECT DOCUMENT TYPE</Text>
          <View style={styles.docTypeGrid}>
            {DOC_TYPES.map(doc => {
              const selected = selectedDocType === doc.id;
              return (
                <TouchableOpacity
                  key={doc.id}
                  style={[styles.docTypeCard, selected && styles.docTypeCardSelected]}
                  onPress={() => setSelectedDocType(doc.id)}
                  activeOpacity={0.75}>
                  <Icon name={doc.icon} size={24} color={selected ? Colors.primary : Colors.onSurfaceVariant} />
                  <Text style={[styles.docTypeLabel, selected && styles.docTypeLabelSelected]}>
                    {doc.label}
                  </Text>
                  {selected && (
                    <View style={styles.docTypeCheck}>
                      <Icon name="check-circle" size={14} color={Colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Upload area — Stitch: cloud_upload "Upload Document" | image placeholder */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>UPLOAD DOCUMENT</Text>
          <Text style={styles.uploadHint}>
            Clear and readable images work best. Max 5MB (JPG, PNG, PDF).
          </Text>

          {/* Front side */}
          <TouchableOpacity
            style={[
              styles.uploadSlot,
              frontState === 'uploaded' && styles.uploadSlotDone,
            ]}
            onPress={() => handleMockUpload('front')}
            activeOpacity={0.8}>
            <Icon
              name={frontState === 'uploaded' ? 'check-circle' : frontState === 'selected' ? 'hourglass-empty' : 'cloud-upload'}
              size={28}
              color={frontState === 'uploaded' ? Colors.success : Colors.primary}
            />
            <View style={styles.uploadSlotMeta}>
              <Text style={styles.uploadSlotTitle}>
                {frontState === 'uploaded' ? 'Front Side Uploaded' : frontState === 'selected' ? 'Processing...' : 'Upload Front Side'}
              </Text>
              <Text style={styles.uploadSlotSub}>
                {frontState === 'uploaded' ? 'Image accepted' : 'Tap to select image'}
              </Text>
            </View>
            {frontState === 'idle' && (
              <Icon name="add-circle" size={20} color={Colors.primary} />
            )}
          </TouchableOpacity>

          <View style={styles.uploadDivider} />

          {/* Back side */}
          <TouchableOpacity
            style={[
              styles.uploadSlot,
              backState === 'uploaded' && styles.uploadSlotDone,
            ]}
            onPress={() => handleMockUpload('back')}
            activeOpacity={0.8}>
            <Icon
              name={backState === 'uploaded' ? 'check-circle' : backState === 'selected' ? 'hourglass-empty' : 'image'}
              size={28}
              color={backState === 'uploaded' ? Colors.success : Colors.onSurfaceVariant}
            />
            <View style={styles.uploadSlotMeta}>
              <Text style={styles.uploadSlotTitle}>
                {backState === 'uploaded' ? 'Back Side Uploaded' : backState === 'selected' ? 'Processing...' : 'Upload Back Side'}
              </Text>
              <Text style={styles.uploadSlotSub}>
                {backState === 'uploaded' ? 'Image accepted' : 'Tap to select image'}
              </Text>
            </View>
            {backState === 'idle' && (
              <Icon name="add-circle" size={20} color={Colors.onSurfaceVariant} />
            )}
          </TouchableOpacity>
        </View>

        {/* Upload tips — Stitch: light_mode / aspect_ratio / blur_off */}
        <View style={styles.tipsCard}>
          <Text style={styles.sectionLabel}>IMAGE REQUIREMENTS</Text>
          {UPLOAD_TIPS.map((tip, i) => (
            <View
              key={tip.icon}
              style={[styles.tipRow, i < UPLOAD_TIPS.length - 1 && styles.tipRowBorder]}>
              <View style={styles.tipIconWrap}>
                <Icon name={tip.icon} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.tipText}>{tip.label}</Text>
              <Icon name="check" size={14} color={Colors.success} />
            </View>
          ))}
        </View>

        {/* CTA — Stitch: "Continue Verification" */}
        <TouchableOpacity
          style={[styles.ctaBtn, !canSubmit && styles.ctaBtnDisabled]}
          onPress={() => navigation.navigate('VerificationProcessing')}
          activeOpacity={0.85}>
          <Icon name="upload" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Submit Documents</Text>
        </TouchableOpacity>

        {/* Demo shortcut if not uploaded */}
        {!canSubmit && (
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={() => navigation.navigate('VerificationProcessing')}
            activeOpacity={0.7}>
            <Text style={styles.skipBtnText}>Skip Upload (Demo Mode)</Text>
          </TouchableOpacity>
        )}

        {/* Footer — Stitch: lock "encrypted and securely protected" */}
        <View style={styles.securityNote}>
          <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.securityText}>
            Your information is encrypted and securely protected. Documents are used only for verification.
          </Text>
        </View>

        <View style={{height: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 64, flexDirection: 'row', alignItems: 'center',
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
  headerCenter: {flex: 1, alignItems: 'center'},
  stepLabel: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 2, marginBottom: 2},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  headerIconWrap: {width: 40, alignItems: 'flex-end'},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 16, gap: 20},

  pageSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},

  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14,
  },

  // Doc type grid 2x2
  docTypeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  docTypeCard: {
    flex: 1, minWidth: '45%',
    alignItems: 'center', gap: 8, padding: 16,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    backgroundColor: Colors.surfaceContainerHigh, position: 'relative',
  },
  docTypeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.08)',
  },
  docTypeLabel: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center'},
  docTypeLabelSelected: {color: Colors.primary, fontFamily: 'Inter-Medium'},
  docTypeCheck: {position: 'absolute', top: 8, right: 8},

  // Upload slots
  uploadHint: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 16, lineHeight: 17},
  uploadSlot: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER,
    borderStyle: 'dashed', padding: 16,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  uploadSlotDone: {
    borderStyle: 'solid',
    borderColor: 'rgba(109,217,140,0.30)',
    backgroundColor: 'rgba(109,217,140,0.06)',
  },
  uploadSlotMeta: {flex: 1},
  uploadSlotTitle: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  uploadSlotSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  uploadDivider: {height: 10},

  // Tips card
  tipsCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  tipRow: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10},
  tipRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  tipIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(242,202,80,0.08)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tipText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},

  // CTAs
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 17, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  ctaBtnDisabled: {opacity: 0.5},
  ctaBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary, letterSpacing: 0.3},

  skipBtn: {alignItems: 'center', paddingVertical: 4},
  skipBtnText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textDecorationLine: 'underline'},

  // Security note
  securityNote: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, opacity: 0.6},
  securityText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, lineHeight: 16,
  },
});
