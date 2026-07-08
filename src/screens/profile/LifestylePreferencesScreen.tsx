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

type Props = NativeStackScreenProps<ProfileStackParamList, 'LifestylePreferences'>;

const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface ToggleItem {
  id: string;
  icon: string;
  label: string;
  sub: string;
}

export default function LifestylePreferencesScreen({navigation}: Props) {
  const [visibility, setVisibility] = useState({
    activityStatus: true,
    lastSeen: false,
  });
  const [discovery, setDiscovery] = useState({
    appearInSearch: true,
    hiddenMode: false,
  });
  const [communication, setCommunication] = useState({
    readReceipts: true,
    typingIndicators: true,
  });
  const [data, setData] = useState({
    personalisation: true,
    analytics: false,
  });

  const renderToggleRow = (
    id: string,
    icon: string,
    label: string,
    sub: string,
    value: boolean,
    onToggle: () => void,
    isLast: boolean,
  ) => (
    <View key={id}>
      <View style={styles.row}>
        <View style={styles.rowIconWrap}>
          <Icon name={icon} size={18} color={Colors.primary} />
        </View>
        <View style={styles.rowMeta}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowSub}>{sub}</Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{false: Colors.surfaceContainerHighest, true: Colors.primaryContainer}}
          thumbColor={value ? Colors.primary : Colors.onSurfaceVariant}
        />
      </View>
      {!isLast && <View style={styles.rowBorder} />}
    </View>
  );

  const renderNavRow = (icon: string, label: string, value: string, isLast: boolean) => (
    <View key={label}>
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => Alert.alert(label, `${label} settings coming soon.`)}>
        <View style={styles.rowIconWrap}>
          <Icon name={icon} size={18} color={Colors.primary} />
        </View>
        <View style={styles.rowMeta}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowSub}>{value}</Text>
        </View>
        <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
      </TouchableOpacity>
      {!isLast && <View style={styles.rowBorder} />}
    </View>
  );

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
        <Text style={styles.headerTitle}>Privacy Controls</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Privacy hero banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIconWrap}>
            <Icon name="lock" size={16} color={Colors.primary} />
          </View>
          <View style={styles.heroMeta}>
            <Text style={styles.heroTitle}>Your data stays yours.</Text>
            <Text style={styles.heroSub}>
              These settings control who sees what on your profile.
            </Text>
          </View>
        </View>

        {/* PROFILE VISIBILITY */}
        <Text style={styles.sectionLabel}>PROFILE VISIBILITY</Text>
        <View style={styles.card}>
          {renderNavRow('verified-user', 'Show Profile to', 'Verified Members Only', false)}
          <View style={styles.rowBorder} />
          {renderToggleRow(
            'activityStatus', 'bolt', 'Activity Status',
            'Let companions see when you are active',
            visibility.activityStatus,
            () => setVisibility(p => ({...p, activityStatus: !p.activityStatus})),
            false,
          )}
          {renderToggleRow(
            'lastSeen', 'schedule', 'Last Seen',
            'Show your last active time',
            visibility.lastSeen,
            () => setVisibility(p => ({...p, lastSeen: !p.lastSeen})),
            true,
          )}
        </View>

        {/* DISCOVERY */}
        <Text style={styles.sectionLabel}>DISCOVERY</Text>
        <View style={styles.card}>
          {renderToggleRow(
            'appearInSearch', 'search', 'Appear in Search',
            'Let others discover your profile',
            discovery.appearInSearch,
            () => setDiscovery(p => ({...p, appearInSearch: !p.appearInSearch})),
            false,
          )}
          {renderNavRow('my-location', 'Location Precision', 'City Level', false)}
          {renderToggleRow(
            'hiddenMode', 'visibility', 'Hidden Mode',
            'Browse anonymously without being seen',
            discovery.hiddenMode,
            () => setDiscovery(p => ({...p, hiddenMode: !p.hiddenMode})),
            true,
          )}
        </View>

        {/* COMMUNICATION */}
        <Text style={styles.sectionLabel}>COMMUNICATION</Text>
        <View style={styles.card}>
          {renderNavRow('chat', 'Who Can Message Me', 'Verified Members', false)}
          <View style={styles.rowBorder} />
          {renderToggleRow(
            'readReceipts', 'verified', 'Read Receipts',
            'Let senders know when you have read their message',
            communication.readReceipts,
            () => setCommunication(p => ({...p, readReceipts: !p.readReceipts})),
            false,
          )}
          {renderToggleRow(
            'typingIndicators', 'more-horiz', 'Typing Indicators',
            'Show when you are typing a response',
            communication.typingIndicators,
            () => setCommunication(p => ({...p, typingIndicators: !p.typingIndicators})),
            true,
          )}
        </View>

        {/* DATA */}
        <Text style={styles.sectionLabel}>DATA</Text>
        <View style={styles.card}>
          {renderToggleRow(
            'personalisation', 'psychology', 'Personalisation Data',
            'Use activity to improve your recommendations',
            data.personalisation,
            () => setData(p => ({...p, personalisation: !p.personalisation})),
            false,
          )}
          {renderToggleRow(
            'analytics', 'insights', 'Analytics Sharing',
            'Share anonymous usage data to improve CoBuddy',
            data.analytics,
            () => setData(p => ({...p, analytics: !p.analytics})),
            true,
          )}
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveBtn}
          activeOpacity={0.8}
          onPress={() => Alert.alert('Preferences Saved', 'Your privacy preferences have been updated.')}>
          <Icon name="check" size={18} color={Colors.onPrimary} />
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>

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

  heroBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.18)',
    padding: 14,
    marginBottom: 22,
  },
  heroIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  heroMeta: {flex: 1},
  heroTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.onSurface, marginBottom: 2,
  },
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 17,
  },

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

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  rowBorder: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
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

  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 8,
  },
  saveBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 16,
    color: Colors.onPrimary, letterSpacing: 0.3,
  },
});
