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
import type {VerifyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<VerifyStackParamList, 'SelfieCapture'>;

// Stitch: selfie_verification_screen
// VERIFICATION 1 OF 3 | Verify Your Identity | Center your face within the frame
// Tips: light_mode Use good lighting | visibility_off Remove accessories | face Face visible
// CTA: photo_camera CAPTURE SELFIE
// Footer: YOUR SELFIE IS USED ONLY FOR IDENTITY AND SAFETY VERIFICATION.

const TIPS = [
  {icon: 'light-mode',      label: 'Use good lighting'},
  {icon: 'visibility-off',  label: 'Remove accessories'},
  {icon: 'face',            label: 'Face visible in frame'},
];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function SelfieCaptureScreen({route, navigation}: Props) {
  const [captured, setCaptured] = useState(false);

  const handleCapture = () => {
    setCaptured(true);
    setTimeout(() => navigation.navigate('LivenessDetection', route.params), 800);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — Stitch: shield_lock left + CoBuddy centered */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          {/* Stitch: "VERIFICATION 1 OF 3" */}
          <Text style={styles.stepLabel}>VERIFICATION 1 OF 3</Text>
          <Text style={styles.headerTitle}>Verify Your Identity</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Icon name="shield-lock" size={20} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Selfie frame placeholder — Stitch: oval face-frame with mask overlay */}
        <View style={styles.frameCard}>
          <View style={styles.frameGlow} pointerEvents="none" />
          <View style={styles.ovalFrame}>
            {/* Oval border via border radius */}
            <View style={styles.ovalInner}>
              {captured ? (
                <View style={styles.capturedState}>
                  <Icon name="check-circle" size={48} color={Colors.success} />
                  <Text style={styles.capturedText}>Selfie Captured</Text>
                </View>
              ) : (
                <View style={styles.faceGuide}>
                  <Icon name="face" size={64} color={'rgba(242,202,80,0.35)'} />
                  <Text style={styles.frameHint}>Center your face within the frame</Text>
                </View>
              )}
            </View>
          </View>

          {/* Corner brackets */}
          <View style={[styles.bracket, styles.bracketTL]} />
          <View style={[styles.bracket, styles.bracketTR]} />
          <View style={[styles.bracket, styles.bracketBL]} />
          <View style={[styles.bracket, styles.bracketBR]} />
        </View>

        {/* Tips — Stitch: light_mode / visibility_off / face */}
        <View style={styles.tipsCard}>
          <Text style={styles.sectionLabel}>POSITIONING TIPS</Text>
          {TIPS.map((tip, i) => (
            <View
              key={tip.icon}
              style={[styles.tipRow, i < TIPS.length - 1 && styles.tipRowBorder]}>
              <View style={styles.tipIconWrap}>
                <Icon name={tip.icon} size={18} color={Colors.primary} />
              </View>
              <Text style={styles.tipText}>{tip.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA — Stitch: photo_camera CAPTURE SELFIE */}
        <TouchableOpacity
          style={[styles.captureBtn, captured && styles.captureBtnDone]}
          onPress={handleCapture}
          disabled={captured}
          activeOpacity={0.85}>
          <Icon
            name={captured ? 'check-circle' : 'photo-camera'}
            size={20}
            color={Colors.onPrimary}
          />
          <Text style={styles.captureBtnText}>
            {captured ? 'Selfie Captured - Moving On...' : 'Capture Selfie'}
          </Text>
        </TouchableOpacity>

        {/* Footer — Stitch: "YOUR SELFIE IS USED ONLY FOR IDENTITY AND SAFETY VERIFICATION." */}
        <View style={styles.privacyNote}>
          <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.privacyText}>
            Your selfie is used only for identity and safety verification. It is never shared
            with other members.
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
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, gap: 20},

  // Selfie frame card
  frameCard: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 32, paddingHorizontal: 20,
    backgroundColor: CARD_BG, borderRadius: 28,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    position: 'relative', overflow: 'hidden',
  },
  frameGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(242,202,80,0.02)',
  },
  ovalFrame: {
    width: 240, height: 280, borderRadius: 120,
    borderWidth: 2, borderColor: 'rgba(242,202,80,0.40)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(242,202,80,0.03)',
    overflow: 'hidden',
  },
  ovalInner: {flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%'},
  faceGuide: {alignItems: 'center', gap: 12, paddingHorizontal: 20},
  frameHint: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center'},
  capturedState: {alignItems: 'center', gap: 8},
  capturedText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success},

  // Corner brackets — decorative alignment guides
  bracket: {position: 'absolute', width: 24, height: 24, borderColor: Colors.primary},
  bracketTL: {top: 20, left: 20, borderTopWidth: 2, borderLeftWidth: 2, borderTopLeftRadius: 4},
  bracketTR: {top: 20, right: 20, borderTopWidth: 2, borderRightWidth: 2, borderTopRightRadius: 4},
  bracketBL: {bottom: 20, left: 20, borderBottomWidth: 2, borderLeftWidth: 2, borderBottomLeftRadius: 4},
  bracketBR: {bottom: 20, right: 20, borderBottomWidth: 2, borderRightWidth: 2, borderBottomRightRadius: 4},

  // Tips card
  tipsCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14,
  },
  tipRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10},
  tipRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  tipIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tipText: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface, flex: 1},

  // CTA
  captureBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 17, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  captureBtnDone: {backgroundColor: Colors.success, opacity: 0.85},
  captureBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary, letterSpacing: 0.3},

  // Privacy note
  privacyNote: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8, opacity: 0.6,
  },
  privacyText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant, lineHeight: 16,
  },
});
