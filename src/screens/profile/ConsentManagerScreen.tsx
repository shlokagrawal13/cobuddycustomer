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

type Props = NativeStackScreenProps<ProfileStackParamList, 'ConsentManager'>;

interface ConsentGroup {
  id: string;
  icon: string;
  title: string;
  description: string;
  required: boolean;
  enabled: boolean;
  partners?: string[];
}

const INITIAL_CONSENTS: ConsentGroup[] = [
  {
    id: 'essential',
    icon: 'security',
    title: 'Essential Operations',
    description: 'Required for authentication, session management, safety features, and core app functionality. Cannot be disabled.',
    required: true,
    enabled: true,
    partners: ['CoBuddy Companions Ltd.', 'AWS (Infrastructure)'],
  },
  {
    id: 'personalization',
    icon: 'person',
    title: 'Concierge Personalisation',
    description: 'Allows your concierge team to use your preferences, past sessions, and interests to make tailored recommendations.',
    required: false,
    enabled: true,
    partners: ['CoBuddy Concierge AI', 'Internal Recommendation Engine'],
  },
  {
    id: 'analytics',
    icon: 'bar-chart',
    title: 'Usage Analytics',
    description: 'Helps us understand how members use the app to improve features and fix issues. All data is anonymised.',
    required: false,
    enabled: true,
    partners: ['Mixpanel', 'Amplitude'],
  },
  {
    id: 'marketing',
    icon: 'campaign',
    title: 'Marketing Communications',
    description: 'Receive curated offers, event invitations, and updates about new companions and experiences.',
    required: false,
    enabled: false,
    partners: ['Mailchimp', 'Klaviyo'],
  },
  {
    id: 'thirdparty',
    icon: 'handshake',
    title: 'Third-Party Partnerships',
    description: 'Share anonymised data with our verified lifestyle partners (venues, hotels, wellness providers) for exclusive member benefits.',
    required: false,
    enabled: false,
    partners: ['Selected Luxury Venue Partners', 'Lifestyle Brand Affiliates'],
  },
  {
    id: 'research',
    icon: 'science',
    title: 'Product Research',
    description: 'Participate in optional research studies and UX improvement initiatives. Participation is always opt-in.',
    required: false,
    enabled: false,
    partners: ['UserTesting', 'Internal Research Team'],
  },
];

export default function ConsentManagerScreen({navigation}: Props) {
  const [consents, setConsents] = useState<ConsentGroup[]>(INITIAL_CONSENTS);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleConsent = (id: string) => {
    setConsents(prev => prev.map(c =>
      c.id === id && !c.required ? {...c, enabled: !c.enabled} : c,
    ));
  };

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {next.delete(id);} else {next.add(id);}
      return next;
    });
  };

  const handleSave = () => {
    const active = consents.filter(c => c.enabled).map(c => c.title);
    Alert.alert(
      'Consent Preferences Saved',
      `Your consent settings have been updated. Active: ${active.join(', ')}.\n\nChanges will be applied when the consent management API is connected.`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  const handleRevokeAll = () => {
    Alert.alert(
      'Revoke All Optional Consent',
      'This will disable all non-essential data sharing. Some personalised features may be limited. Continue?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Revoke All',
          style: 'destructive',
          onPress: () => setConsents(prev => prev.map(c => c.required ? c : {...c, enabled: false})),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backBtn}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consent Manager</Text>
        <TouchableOpacity onPress={handleRevokeAll} activeOpacity={0.7} style={styles.revokeBtn}>
          <Text style={styles.revokeBtnText}>Revoke All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={styles.infoBanner}>
          <Icon name="fact-check" size={18} color={Colors.primary} />
          <Text style={styles.infoBannerText}>
            Review and manage how CoBuddy and its verified partners use your data. Required consents cannot be disabled.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATA PROCESSING CONSENTS</Text>

          {consents.map(group => {
            const isExpanded = expanded.has(group.id);
            return (
              <View key={group.id} style={[styles.consentCard, group.required && styles.consentCardRequired]}>
                <View style={styles.consentTop}>
                  <View style={[styles.consentIcon, group.required && styles.consentIconRequired]}>
                    <Icon name={group.icon} size={18} color={group.required ? Colors.onSurfaceVariant : Colors.primary} />
                  </View>
                  <View style={styles.consentMeta}>
                    <View style={styles.consentTitleRow}>
                      <Text style={styles.consentTitle}>{group.title}</Text>
                      {group.required && (
                        <View style={styles.requiredBadge}>
                          <Text style={styles.requiredBadgeText}>Required</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.consentDesc} numberOfLines={isExpanded ? undefined : 2}>
                      {group.description}
                    </Text>
                  </View>
                  <Switch
                    value={group.enabled}
                    onValueChange={() => {
                      if (group.required) {
                        Alert.alert('Required', 'This consent is required for CoBuddy to function and cannot be disabled.');
                        return;
                      }
                      toggleConsent(group.id);
                    }}
                    trackColor={{false: Colors.outlineVariant, true: Colors.primaryContainer}}
                    thumbColor={group.enabled ? Colors.primary : Colors.onSurfaceVariant}
                  />
                </View>

                <TouchableOpacity style={styles.expandRow} onPress={() => toggleExpand(group.id)} activeOpacity={0.7}>
                  <Text style={styles.expandText}>{isExpanded ? 'Hide partners' : 'Show data partners'}</Text>
                  <Icon name={isExpanded ? 'expand-less' : 'expand-more'} size={16} color={Colors.primary} />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.partnerList}>
                    {group.partners?.map(p => (
                      <View key={p} style={styles.partnerRow}>
                        <Icon name="business" size={12} color={Colors.outlineVariant} />
                        <Text style={styles.partnerText}>{p}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.legalNote}>
          <Icon name="verified-user" size={15} color={Colors.primary} />
          <Text style={styles.legalNoteText}>
            Under GDPR Article 7, you have the right to withdraw consent at any time. Withdrawal does not affect the lawfulness of processing based on consent before withdrawal.
          </Text>
        </View>

        <TouchableOpacity style={styles.ctaBtn} onPress={handleSave} activeOpacity={0.87}>
          <Icon name="check" size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaBtnText}>Save Consent Preferences</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          {flex: 1, backgroundColor: Colors.surface},
  header:             {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant},
  backBtn:            {padding: 4},
  headerTitle:        {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface},
  revokeBtn:          {paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: Colors.error},
  revokeBtnText:      {fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.error},
  scroll:             {flex: 1},
  scrollContent:      {paddingBottom: 24},
  infoBanner:         {flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginHorizontal: 20, marginTop: 20, padding: 14, backgroundColor: Colors.primaryContainer, borderRadius: 12, borderWidth: 1, borderColor: Colors.primary},
  infoBannerText:     {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onPrimaryContainer, lineHeight: 19},
  section:            {paddingHorizontal: 20, paddingTop: 24},
  sectionTitle:       {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 1.4, marginBottom: 14},
  consentCard:        {marginBottom: 10, padding: 14, backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant},
  consentCardRequired:{opacity: 0.75, borderColor: Colors.outlineVariant},
  consentTop:         {flexDirection: 'row', alignItems: 'flex-start', gap: 12},
  consentIcon:        {width: 38, height: 38, borderRadius: 10, backgroundColor: Colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginTop: 2},
  consentIconRequired:{backgroundColor: Colors.surfaceContainerHigh},
  consentMeta:        {flex: 1},
  consentTitleRow:    {flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap'},
  consentTitle:       {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  consentDesc:        {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 17},
  requiredBadge:      {paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: Colors.outlineVariant},
  requiredBadgeText:  {fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.outlineVariant, letterSpacing: 0.5},
  expandRow:          {flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: Colors.outlineVariant},
  expandText:         {fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.primary},
  partnerList:        {marginTop: 8, gap: 6},
  partnerRow:         {flexDirection: 'row', alignItems: 'center', gap: 8},
  partnerText:        {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  legalNote:          {flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginHorizontal: 20, marginTop: 16, padding: 13, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 10},
  legalNoteText:      {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 17},
  ctaBtn:             {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginHorizontal: 20, marginTop: 20, paddingVertical: 16, borderRadius: 12, backgroundColor: Colors.primary},
  ctaBtnText:         {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary, letterSpacing: 0.3},
});
