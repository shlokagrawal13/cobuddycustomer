import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch ref: session_reflection_feedback_emotional_wellness_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'PostSessionFeedback'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';

const TRUST_CHIPS = [
  {icon: 'verified',      label: 'Trusted Experience Completed',   sub: 'ID VERIFIED COMPANION',       color: Colors.success, bg: SUCCESS_BG, bd: SUCCESS_BD},
  {icon: 'support-agent', label: 'Concierge Protected',             sub: 'DISCREET MONITORING LOGGED',  color: Colors.info,    bg: 'rgba(137,180,224,0.10)', bd: 'rgba(137,180,224,0.28)'},
  {icon: 'favorite',      label: 'Emotional Wellness Active',       sub: 'CHECK-IN INITIATED',          color: Colors.error,   bg: 'rgba(255,180,171,0.10)', bd: 'rgba(255,180,171,0.28)'},
];

const SLIDERS = [
  {id: 'comfort',       label: 'Emotional Comfort', leftLabel: 'TENSE',   rightLabel: 'AT EASE',    info: 'How secure and relaxed did you feel during the experience?'},
  {id: 'communication', label: 'Communication',     leftLabel: 'FORCED',  rightLabel: 'EFFORTLESS', info: 'Did the conversation flow naturally and respectfully?'},
  {id: 'connection',    label: 'Connection',         leftLabel: 'SURFACE', rightLabel: 'PROFOUND',   info: 'Rate the depth of meaningful engagement.'},
];

function SliderDots({value, onChange}: {value: number; onChange: (v: number) => void}) {
  return (
    <View style={dotStyles.row}>
      {[0, 1, 2, 3, 4].map(i => (
        <TouchableOpacity
          key={i}
          style={[dotStyles.dot, i <= value && dotStyles.dotFilled]}
          onPress={() => onChange(i)}
          activeOpacity={0.7}
          hitSlop={{top: 10, bottom: 10, left: 6, right: 6}}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 12},
  dot: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  dotFilled: {backgroundColor: Colors.primary, borderColor: Colors.primary},
});

export default function PostSessionFeedbackScreen({navigation, route}: Props) {
  const {sessionId} = route.params;
  const [sliderValues, setSliderValues] = useState({comfort: 2, communication: 2, connection: 2});
  const [notes, setNotes] = useState('');

  const setSlider = (id: string, val: number) => {
    setSliderValues(prev => ({...prev, [id]: val}));
  };

  const handleComplete = () => {
    navigation.navigate('TipGratuity', {sessionId});
  };

  const showInfo = (msg: string) => {
    Alert.alert('About this question', msg);
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
        <Text style={styles.headerTitle}>CoBuddy</Text>
        <View style={styles.backBtn} />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Session complete badge */}
        <View style={styles.completeBadge}>
          <Text style={styles.completeBadgeText}>SESSION COMPLETE</Text>
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Reflect On Your{'\n'}Experience</Text>

        {/* Trust context chips */}
        {TRUST_CHIPS.map(chip => (
          <View key={chip.icon} style={[styles.trustChip, {backgroundColor: chip.bg, borderColor: chip.bd}]}>
            <Icon name={chip.icon} size={14} color={chip.color} />
            <View style={styles.trustChipMeta}>
              <Text style={[styles.trustChipLabel, {color: chip.color}]}>{chip.label}</Text>
              <Text style={styles.trustChipSub}>{chip.sub}</Text>
            </View>
          </View>
        ))}

        {/* Session summary card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Evening with Elena</Text>
          <View style={styles.summaryRow}>
            <Icon name="calendar-today" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.summaryText}>Oct 24, 2023</Text>
          </View>
          <View style={styles.summaryRow}>
            <Icon name="location-on" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.summaryText}>The Ritz-Carlton Lounge</Text>
          </View>
        </View>

        {/* Emotional Reflection */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Icon name="psychology" size={16} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Emotional Reflection</Text>
          </View>

          {SLIDERS.map(slider => (
            <View key={slider.id} style={styles.sliderBlock}>
              <View style={styles.sliderTitleRow}>
                <Text style={styles.sliderLabel}>{slider.label}</Text>
                <TouchableOpacity
                  onPress={() => showInfo(slider.info)}
                  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
                  activeOpacity={0.7}>
                  <Icon name="info" size={14} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
              <SliderDots
                value={sliderValues[slider.id as keyof typeof sliderValues]}
                onChange={v => setSlider(slider.id, v)}
              />
              <View style={styles.sliderLabelsRow}>
                <Text style={styles.sliderEndLabel}>{slider.leftLabel}</Text>
                <Text style={styles.sliderEndLabel}>{slider.rightLabel}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Private Notes */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Private Notes</Text>
          <TextInput
            style={styles.notesInput}
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Share any private thoughts about your experience... (visible only to you)"
            placeholderTextColor={Colors.onSurfaceVariant}
            textAlignVertical="top"
          />
          <View style={styles.encryptedRow}>
            <Icon name="lock" size={12} color={Colors.onSurfaceVariant} />
            <Text style={styles.encryptedText}>End-to-end encrypted</Text>
          </View>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Sticky CTA */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.completeBtn} onPress={handleComplete} activeOpacity={0.88}>
          <Icon name="check-circle" size={18} color={Colors.onPrimary} />
          <Text style={styles.completeBtnText}>Complete Reflection</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16, gap: 14},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},

  // Complete badge
  completeBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 100, paddingHorizontal: 16, paddingVertical: 7,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  completeBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 1.5},

  heading: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: Colors.onSurface, lineHeight: 36},

  // Trust chips
  trustChip: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    borderRadius: 16, padding: 14, borderWidth: 1,
  },
  trustChipMeta: {flex: 1},
  trustChipLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13},
  trustChipSub: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, marginTop: 2, letterSpacing: 0.5},

  // Summary card
  summaryCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 8,
  },
  summaryTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, marginBottom: 4},
  summaryRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  summaryText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Generic card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 16,
  },
  sectionHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  sectionTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},

  // Sliders
  sliderBlock: {gap: 10},
  sliderTitleRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  sliderLabel: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  sliderLabelsRow: {flexDirection: 'row', justifyContent: 'space-between'},
  sliderEndLabel: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 0.5},

  // Notes
  notesInput: {
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 12, padding: 14, minHeight: 96,
    fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  encryptedRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  encryptedText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},

  // Bottom
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.97)',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
  },
  completeBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 15,
  },
  completeBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
});
