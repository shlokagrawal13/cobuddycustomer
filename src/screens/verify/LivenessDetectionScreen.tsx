import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {VerifyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<VerifyStackParamList, 'LivenessDetection'>;

// Stitch: liveness_detection_screen
// Verification 2 of 3 | Complete Live Verification
// Follow instructions — visibility (Look straight), FRONT / LEFT / RIGHT / BLINK
// shield — liveness helps protect trusted experiences

const STEPS = [
  {id: 'front',  icon: 'face',       label: 'Look straight at the camera', code: 'FRONT'},
  {id: 'left',   icon: 'redo',       label: 'Turn your head left',          code: 'LEFT'},
  {id: 'right',  icon: 'undo',       label: 'Turn your head right',         code: 'RIGHT'},
  {id: 'blink',  icon: 'visibility', label: 'Blink naturally',              code: 'BLINK'},
] as const;

type StepId = typeof STEPS[number]['id'];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function LivenessDetectionScreen({route, navigation}: Props) {
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [activeStep, setActiveStep] = useState<StepId>('front');

  const allDone = completedSteps.size === STEPS.length;

  const handleStepComplete = (stepId: StepId) => {
    const next = new Set(completedSteps);
    next.add(stepId);
    setCompletedSteps(next);
    // advance to next incomplete step
    const nextStep = STEPS.find(s => !next.has(s.id));
    if (nextStep) { setActiveStep(nextStep.id); }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — Stitch: menu + CoBuddy + "Verification 2 of 3" */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.stepLabel}>VERIFICATION 2 OF 3</Text>
          <Text style={styles.headerTitle}>Complete Live Verification</Text>
        </View>
        <View style={styles.headerIconWrap}>
          <Icon name="shield" size={20} color={Colors.primary} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Sub-copy — Stitch: "Follow the instructions below to confirm a real and secure identity." */}
        <Text style={styles.pageSub}>
          Follow the instructions below to confirm a real and secure identity.
        </Text>

        {/* Scan viewport — Stitch: visibility icon + direction codes FRONT/LEFT/RIGHT/BLINK */}
        <View style={styles.scanCard}>
          <View style={styles.scanGlow} pointerEvents="none" />

          <View style={styles.scanFrame}>
            {allDone ? (
              <View style={styles.scanSuccess}>
                <Icon name="check-circle" size={56} color={Colors.success} />
                <Text style={styles.scanSuccessText}>Liveness Verified</Text>
              </View>
            ) : (
              <View style={styles.scanPrompt}>
                <Icon name="face" size={56} color={'rgba(242,202,80,0.5)'} />
                <Text style={styles.scanCode}>
                  {STEPS.find(s => s.id === activeStep)?.code}
                </Text>
                <Text style={styles.scanInstruction}>
                  {STEPS.find(s => s.id === activeStep)?.label}
                </Text>
              </View>
            )}
          </View>

          {/* Step direction chips */}
          <View style={styles.stepChipsRow}>
            {STEPS.map(step => {
              const done = completedSteps.has(step.id);
              const active = activeStep === step.id && !allDone;
              return (
                <View
                  key={step.id}
                  style={[
                    styles.stepChip,
                    done && styles.stepChipDone,
                    active && styles.stepChipActive,
                  ]}>
                  <Icon
                    name={done ? 'check' : step.icon}
                    size={14}
                    color={done ? Colors.success : active ? Colors.primary : Colors.onSurfaceVariant}
                  />
                  <Text style={[
                    styles.stepChipText,
                    done && styles.stepChipTextDone,
                    active && styles.stepChipTextActive,
                  ]}>
                    {step.code}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Step checklist */}
        <View style={styles.checklistCard}>
          <Text style={styles.sectionLabel}>VERIFICATION STEPS</Text>
          {STEPS.map((step, i) => {
            const done = completedSteps.has(step.id);
            const active = activeStep === step.id && !allDone;
            return (
              <TouchableOpacity
                key={step.id}
                style={[
                  styles.checkRow,
                  i < STEPS.length - 1 && styles.checkRowBorder,
                ]}
                onPress={() => !done && handleStepComplete(step.id)}
                disabled={done || (!active && !allDone)}
                activeOpacity={0.75}>
                <View style={[styles.checkIconWrap, done && styles.checkIconWrapDone, active && styles.checkIconWrapActive]}>
                  <Icon
                    name={done ? 'check' : step.icon}
                    size={16}
                    color={done ? Colors.success : active ? Colors.primary : Colors.onSurfaceVariant}
                  />
                </View>
                <View style={styles.checkMeta}>
                  <Text style={[styles.checkLabel, done && styles.checkLabelDone]}>{step.label}</Text>
                  <Text style={styles.checkCode}>{step.code}</Text>
                </View>
                {done ? (
                  <Icon name="check-circle" size={18} color={Colors.success} />
                ) : active ? (
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>TAP TO CONFIRM</Text>
                  </View>
                ) : (
                  <Icon name="radio-button-unchecked" size={18} color={CARD_BORDER} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Trust note — Stitch: shield "liveness verification helps protect trusted experiences" */}
        <View style={styles.trustCard}>
          <Icon name="shield" size={18} color={Colors.primary} />
          <Text style={styles.trustText}>
            Your liveness verification helps protect trusted experiences and prevent fraudulent accounts.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, !allDone && styles.ctaBtnDisabled]}
          onPress={() => navigation.navigate('KYCDocumentUpload', route.params)}
          disabled={!allDone}
          activeOpacity={0.85}>
          <Icon name="verified-user" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Continue</Text>
        </TouchableOpacity>

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

  // Scan card
  scanCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    padding: 24, alignItems: 'center', gap: 20,
    position: 'relative', overflow: 'hidden',
  },
  scanGlow: {
    position: 'absolute', top: -80, left: 0, right: 0,
    height: 200, backgroundColor: 'rgba(242,202,80,0.03)',
  },
  scanFrame: {
    width: 200, height: 200, borderRadius: 100,
    borderWidth: 2, borderColor: 'rgba(242,202,80,0.35)',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(242,202,80,0.02)',
  },
  scanPrompt: {alignItems: 'center', gap: 8},
  scanCode: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.primary, letterSpacing: 2},
  scanInstruction: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center'},
  scanSuccess: {alignItems: 'center', gap: 10},
  scanSuccessText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.success},

  stepChipsRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'center'},
  stepChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  stepChipDone: {
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderColor: 'rgba(109,217,140,0.30)',
  },
  stepChipActive: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderColor: 'rgba(242,202,80,0.40)',
  },
  stepChipText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1},
  stepChipTextDone: {color: Colors.success},
  stepChipTextActive: {color: Colors.primary},

  // Checklist
  checklistCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20,
  },
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginBottom: 14,
  },
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12},
  checkRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  checkIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkIconWrapDone: {
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderColor: 'rgba(109,217,140,0.25)',
  },
  checkIconWrapActive: {
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderColor: 'rgba(242,202,80,0.25)',
  },
  checkMeta: {flex: 1},
  checkLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  checkLabelDone: {color: Colors.onSurfaceVariant, textDecorationLine: 'line-through'},
  checkCode: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginTop: 2},
  activePill: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.30)',
  },
  activePillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 1},

  // Trust card
  trustCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 16, borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    padding: 16,
  },
  trustText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},

  // CTA
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, paddingVertical: 17, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  ctaBtnDisabled: {opacity: 0.4},
  ctaBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary, letterSpacing: 0.3},
});
