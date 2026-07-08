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
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'TextSize'>;

type SizeKey = 'small' | 'default' | 'large' | 'xlarge';

interface SizeOption {
  key: SizeKey;
  label: string;
  scale: number;
  description: string;
}

const SIZE_OPTIONS: SizeOption[] = [
  {key: 'small',   label: 'Small',       scale: 0.85, description: 'More content visible on screen. Smaller text.'},
  {key: 'default', label: 'Default',     scale: 1.0,  description: 'Balanced readability and information density.'},
  {key: 'large',   label: 'Large',       scale: 1.2,  description: 'Easier reading. Recommended for accessibility.'},
  {key: 'xlarge',  label: 'Extra Large', scale: 1.4,  description: 'Maximum readability. Reduced content density.'},
];

const PREVIEW_TEXT = {
  heading: 'The Grand Pavilion Suite',
  body: 'An exclusive private suite experience curated for discerning members. Your dedicated companion will meet you at the entrance.',
  caption: 'Saturday, 14 June 2026  •  20:00  •  Mayfair, London',
};

export default function TextSizeScreen({navigation}: Props) {
  const [selected, setSelected] = useState<SizeKey>('default');

  const current = SIZE_OPTIONS.find(o => o.key === selected)!;

  const handleSave = () => {
    Alert.alert(
      'Text Size Saved',
      `Text size set to "${current.label}". This preference will apply app-wide when font scaling is connected to the theme provider.`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Text Size</Text>
        <View style={{width: 36}} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Live Preview Card */}
        <View style={styles.previewSection}>
          <Text style={styles.previewLabel}>PREVIEW</Text>
          <View style={styles.previewCard}>
            <Text style={[styles.previewHeading, {fontSize: 17 * current.scale}]}>
              {PREVIEW_TEXT.heading}
            </Text>
            <Text style={[styles.previewBody, {fontSize: 13 * current.scale, lineHeight: 19 * current.scale}]}>
              {PREVIEW_TEXT.body}
            </Text>
            <Text style={[styles.previewCaption, {fontSize: 11 * current.scale}]}>
              {PREVIEW_TEXT.caption}
            </Text>
          </View>
          <Text style={styles.previewScaleNote}>
            Scale: {(current.scale * 100).toFixed(0)}%  —  {current.description}
          </Text>
        </View>

        {/* Size Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.sectionTitle}>SELECT TEXT SIZE</Text>

          {SIZE_OPTIONS.map(opt => {
            const active = opt.key === selected;
            return (
              <TouchableOpacity
                key={opt.key}
                style={[styles.optionRow, active && styles.optionRowActive]}
                onPress={() => setSelected(opt.key)}
                activeOpacity={0.8}>
                <View style={styles.optionLeft}>
                  <View style={[styles.optionSwatch, active && styles.optionSwatchActive]}>
                    <Text style={[styles.optionSwatchText, {fontSize: 13 * opt.scale}]}>Aa</Text>
                  </View>
                  <View style={styles.optionMeta}>
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>{opt.label}</Text>
                    <Text style={styles.optionDesc}>{opt.description}</Text>
                  </View>
                </View>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Accessibility note */}
        <View style={styles.accessNote}>
          <Icon name="accessibility" size={16} color={Colors.primary} />
          <Text style={styles.accessNoteText}>
            You can also control text size system-wide through your device Accessibility settings. CoBuddy respects your system font scale when set to Default.
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleSave} activeOpacity={0.87}>
          <Icon name="check" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Save Preference</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:        {flex: 1, backgroundColor: Colors.surface},
  header:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:          {padding: 4},
  headerTitle:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  scroll:           {flex: 1},
  scrollContent:    {paddingBottom: 24},
  previewSection:   {paddingHorizontal: 20, paddingTop: 24},
  previewLabel:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 12},
  previewCard:      {backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 18, marginBottom: 10},
  previewHeading:   {fontFamily: 'Playfair-SemiBold', color: Colors.onSurface, marginBottom: 8},
  previewBody:      {fontFamily: 'Inter-Regular', color: Colors.onSurfaceVariant, marginBottom: 10},
  previewCaption:   {fontFamily: 'Inter-Regular', color: Colors.outlineVariant},
  previewScaleNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.outlineVariant, textAlign: 'center'},
  optionsSection:   {paddingHorizontal: 20, paddingTop: 28},
  sectionTitle:     {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 16},
  optionRow:        {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, marginBottom: 8, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, backgroundColor: Colors.surfaceContainerLow},
  optionRowActive:  {borderColor: Colors.primary, backgroundColor: Colors.primaryContainer},
  optionLeft:       {flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14},
  optionSwatch:     {width: 44, height: 44, borderRadius: 8, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center'},
  optionSwatchActive: {backgroundColor: Colors.primary},
  optionSwatchText: {fontFamily: 'Inter-SemiBold', color: Colors.onSurface},
  optionMeta:       {flex: 1},
  optionLabel:      {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  optionLabelActive:{color: Colors.onPrimaryContainer},
  optionDesc:       {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  radio:            {width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.outlineVariant, alignItems: 'center', justifyContent: 'center'},
  radioActive:      {borderColor: Colors.primary},
  radioDot:         {width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary},
  accessNote:       {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 24, padding: 14, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10, borderWidth: 1, borderColor: Colors.outlineVariant},
  accessNoteText:   {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  ctaBtn:           {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 28, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnText:       {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
