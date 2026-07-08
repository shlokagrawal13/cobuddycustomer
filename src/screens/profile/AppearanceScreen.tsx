import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'Appearance'>;

const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface ToggleRow {
  id: string;
  icon: string;
  label: string;
  sub: string;
}

export default function AppearanceScreen({navigation}: Props) {
  const [display, setDisplay] = useState({
    compact: false,
    highContrast: false,
  });
  const [accessibility, setAccessibility] = useState({
    reduceMotion: false,
    boldText: false,
  });

  const flipDisplay = (key: keyof typeof display) =>
    setDisplay(prev => ({...prev, [key]: !prev[key]}));

  const flipAccessibility = (key: keyof typeof accessibility) =>
    setAccessibility(prev => ({...prev, [key]: !prev[key]}));

  const DISPLAY_ROWS: ToggleRow[] = [
    {id: 'compact',      icon: 'tune',        label: 'Compact Mode',    sub: 'Reduce spacing and card sizes'},
    {id: 'highContrast', icon: 'visibility',  label: 'High Contrast',   sub: 'Increase text and element contrast'},
  ];

  const A11Y_ROWS: ToggleRow[] = [
    {id: 'reduceMotion', icon: 'do-not-disturb-on', label: 'Reduce Motion', sub: 'Minimise animation effects'},
    {id: 'boldText',     icon: 'format-quote',       label: 'Bold Text',    sub: 'Increase font weight throughout'},
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appearance</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* THEME SECTION */}
        <Text style={styles.sectionLabel}>THEME</Text>
        <View style={styles.card}>
          {/* Theme preview swatches */}
          <View style={styles.themePreviewRow}>
            <View style={[styles.swatch, {backgroundColor: Colors.surface}]}>
              <Text style={styles.swatchLabel}>Surface</Text>
            </View>
            <View style={[styles.swatch, {backgroundColor: Colors.primary}]}>
              <Text style={[styles.swatchLabel, {color: Colors.onPrimary}]}>Gold</Text>
            </View>
            <View style={[styles.swatch, {backgroundColor: Colors.surfaceContainerHighest}]}>
              <Text style={styles.swatchLabel}>Onyx</Text>
            </View>
          </View>

          <View style={styles.themeBadgeRow}>
            <View style={styles.themeBadgeIcon}>
              <Icon name="star" size={14} color={Colors.primary} />
            </View>
            <View style={styles.themeBadgeMeta}>
              <Text style={styles.themeName}>Ethereal Prestige</Text>
              <Text style={styles.themeSub}>Premium default theme</Text>
            </View>
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>DEFAULT</Text>
            </View>
          </View>

          <View style={styles.rowBorder} />

          <TouchableOpacity style={styles.row} activeOpacity={1}>
            <View style={styles.rowIconWrap}>
              <Icon name="bedtime" size={18} color={Colors.primary} />
            </View>
            <View style={styles.rowMeta}>
              <Text style={styles.rowLabel}>Dark Mode</Text>
              <Text style={styles.rowSub}>Default theme for CoBuddy - always on</Text>
            </View>
            <View style={styles.lockedBadge}>
              <Icon name="lock" size={12} color={Colors.onSurfaceVariant} />
            </View>
          </TouchableOpacity>
        </View>

        {/* DISPLAY SECTION */}
        <Text style={styles.sectionLabel}>DISPLAY</Text>
        <View style={styles.card}>
          {/* Text Size nav row */}
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Text Size', 'Text size customisation available in the next update.')}>
            <View style={styles.rowIconWrap}>
              <Icon name="text-fields" size={18} color={Colors.primary} />
            </View>
            <View style={styles.rowMeta}>
              <Text style={styles.rowLabel}>Text Size</Text>
              <Text style={styles.rowSub}>Standard</Text>
            </View>
            <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
          </TouchableOpacity>

          <View style={styles.rowBorder} />

          {DISPLAY_ROWS.map((row, idx) => (
            <View key={row.id}>
              <View style={styles.row}>
                <View style={styles.rowIconWrap}>
                  <Icon name={row.icon} size={18} color={Colors.primary} />
                </View>
                <View style={styles.rowMeta}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowSub}>{row.sub}</Text>
                </View>
                <Switch
                  value={display[row.id as keyof typeof display]}
                  onValueChange={() => flipDisplay(row.id as keyof typeof display)}
                  trackColor={{false: Colors.surfaceContainerHighest, true: Colors.primaryContainer}}
                  thumbColor={display[row.id as keyof typeof display] ? Colors.primary : Colors.onSurfaceVariant}
                />
              </View>
              {idx < DISPLAY_ROWS.length - 1 && <View style={styles.rowBorder} />}
            </View>
          ))}
        </View>

        {/* ACCESSIBILITY SECTION */}
        <Text style={styles.sectionLabel}>ACCESSIBILITY</Text>
        <View style={styles.card}>
          {A11Y_ROWS.map((row, idx) => (
            <View key={row.id}>
              <View style={styles.row}>
                <View style={styles.rowIconWrap}>
                  <Icon name={row.icon} size={18} color={Colors.primary} />
                </View>
                <View style={styles.rowMeta}>
                  <Text style={styles.rowLabel}>{row.label}</Text>
                  <Text style={styles.rowSub}>{row.sub}</Text>
                </View>
                <Switch
                  value={accessibility[row.id as keyof typeof accessibility]}
                  onValueChange={() => flipAccessibility(row.id as keyof typeof accessibility)}
                  trackColor={{false: Colors.surfaceContainerHighest, true: Colors.primaryContainer}}
                  thumbColor={accessibility[row.id as keyof typeof accessibility] ? Colors.primary : Colors.onSurfaceVariant}
                />
              </View>
              {idx < A11Y_ROWS.length - 1 && <View style={styles.rowBorder} />}
            </View>
          ))}
        </View>

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.footerNoteText}>
            Additional themes coming in premium updates
          </Text>
        </View>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerSpacer: {width: 40},

  scroll: {flex: 1},
  scrollContent: {paddingTop: 20, paddingHorizontal: 16},

  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    letterSpacing: 1.5, color: Colors.onSurfaceVariant,
    marginBottom: 8, paddingLeft: 4, marginTop: 4,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
    marginBottom: 24,
  },

  // Theme preview
  themePreviewRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
  },
  swatch: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchLabel: {
    fontFamily: 'Inter-Medium', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 0.3,
  },

  themeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 10,
  },
  themeBadgeIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  themeBadgeMeta: {flex: 1},
  themeName: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.onSurface, marginBottom: 1,
  },
  themeSub: {
    fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  defaultBadge: {
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderRadius: 6, borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.25)',
    paddingHorizontal: 8, paddingVertical: 3,
  },
  defaultBadgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 9,
    color: Colors.primary, letterSpacing: 0.8,
  },

  rowBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 0,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(242,202,80,0.1)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  rowMeta: {flex: 1},
  rowLabel: {
    fontFamily: 'Inter-Medium', fontSize: 15,
    color: Colors.onSurface, marginBottom: 2,
  },
  rowSub: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 17,
  },
  lockedBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
  },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: -8,
  },
  footerNoteText: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
});
