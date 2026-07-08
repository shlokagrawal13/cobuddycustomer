import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {PrimaryButton, BottomActionBar, AppBottomSheet} from '../../components/ui';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';
import Icon from '../../components/ui/Icon';

const DocIcon = ({icon}: {icon: string}) => {
  if (icon === '⚖') {return <Icon name="balance" size={22} color={Colors.primary} />;}
  if (icon === '🔐') {return <Icon name="lock" size={22} color={Colors.primary} />;}
  if (icon === '🛡') {return <Icon name="security" size={22} color={Colors.primary} />;}
  return <Icon name="article" size={22} color={Colors.primary} />;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'LegalConsent'>;

// ─── Document definitions ──────────────────────────────────────────────────
interface LegalDoc {
  id: string;
  icon: string;
  title: string;
  desc: string;
  sections: {heading: string; body: string}[];
}

const DOCS: LegalDoc[] = [
  {
    id: 'terms',
    icon: '⚖',
    title: 'Terms & Conditions',
    desc: 'Our legal framework for usage and liability.',
    sections: [
      {
        heading: 'Eligibility',
        body: 'You must be 18 years or older to use CoBuddy. By registering, you confirm you meet this requirement and have the legal capacity to enter into this agreement.',
      },
      {
        heading: 'Permitted Use',
        body: 'CoBuddy connects members for trusted public-only experiences including dining, cultural outings, networking, and wellness activities. The platform is strictly for platonic, professional companionship in verified public settings.',
      },
      {
        heading: 'Account Responsibility',
        body: 'You are responsible for all activity under your account. Do not share credentials. CoBuddy reserves the right to suspend accounts for any breach of these terms without prior notice.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'CoBuddy acts as a connection platform only. We are not liable for conduct between members during or after sessions. Sessions are undertaken at your own discretion.',
      },
    ],
  },
  {
    id: 'privacy',
    icon: '🔐',
    title: 'Privacy Policy',
    desc: 'How we protect and manage your data.',
    sections: [
      {
        heading: 'Data We Collect',
        body: 'We collect identity verification data (government ID), contact information, location data during active sessions, and usage analytics to improve your experience.',
      },
      {
        heading: 'How We Use Your Data',
        body: 'Your data is used exclusively for identity verification, session matching, safety monitoring, and personalized recommendations. We never sell personal data to third parties.',
      },
      {
        heading: 'Data Protection',
        body: 'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are compliant with GDPR, CCPA, and applicable regional data protection regulations.',
      },
      {
        heading: 'Your Rights',
        body: 'You may request access to, correction of, or deletion of your personal data at any time through Settings → Privacy → Data Request.',
      },
    ],
  },
  {
    id: 'community',
    icon: '🛡',
    title: 'Community Guidelines',
    desc: 'Behavioral standards for all members.',
    sections: [
      {
        heading: 'Respect & Dignity',
        body: 'All members must treat companions and fellow users with respect. Harassment, discrimination, or any form of disrespectful conduct will result in immediate account suspension.',
      },
      {
        heading: 'Public Venues Only',
        body: 'For safety, all first-time meetings must occur in CoBuddy-verified public venues. Never request a companion to meet in private or isolated settings.',
      },
      {
        heading: 'Zero Tolerance Policy',
        body: 'Any solicitation for services beyond our platform scope (romantic, sexual, or private arrangements) is strictly prohibited and will result in permanent banning and potential legal action.',
      },
      {
        heading: 'Reporting',
        body: 'If you experience any behavior that violates these guidelines, use the in-app report feature or contact our safety team at safety@cobuddy.app immediately.',
      },
    ],
  },
];

const CONSENTS = [
  {id: 'tos',     label: "I agree to CoBuddy's Terms & Conditions"},
  {id: 'public',  label: 'I understand CoBuddy supports public-only meetups and verified experiences'},
  {id: 'safety',  label: 'I agree to follow community safety and respectful behavior guidelines'},
];

// ─── Screen ────────────────────────────────────────────────────────────────
export default function LegalConsentScreen({navigation}: Props) {
  const [checked, setChecked]   = useState<Record<string, boolean>>({});
  const [activeDoc, setActiveDoc] = useState<LegalDoc | null>(null);

  const allChecked = CONSENTS.every(c => checked[c.id]);
  const toggle = (id: string) =>
    setChecked(prev => ({...prev, [id]: !prev[id]}));

  const canGoBack = navigation.canGoBack();

  return (
    <View style={styles.root}>
      {/* Shared header — back only if prev route exists */}
      <OnboardingHeader
        showBack={canGoBack}
        onBack={() => navigation.goBack()}
        centerLabel="Safety Agreement"
        step="1 / 7"
        showProgress
        currentStep={1}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Editorial header */}
        <View style={styles.editorialHeader}>
          <Text style={styles.heroTitle}>Trust Starts With{'\n'}Transparency</Text>
          <Text style={styles.heroSub}>
            To maintain a verified and safety-first community, please review and accept the following guidelines.
          </Text>
        </View>

        {/* Document cards */}
        <View style={styles.docCards}>
          {DOCS.map(doc => (
            <View key={doc.id} style={styles.docCard}>
              <DocIcon icon={doc.icon} />
              <Text style={styles.docTitle}>{doc.title}</Text>
              <Text style={styles.docDesc}>{doc.desc}</Text>
              <TouchableOpacity
                style={styles.readLink}
                activeOpacity={0.7}
                onPress={() => setActiveDoc(doc)}>
                <Text style={styles.readText}>READ  →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Consent checklist */}
        <View style={styles.consentList}>
          {CONSENTS.map(c => {
            const active = !!checked[c.id];
            return (
              <TouchableOpacity
                key={c.id}
                style={styles.consentRow}
                onPress={() => toggle(c.id)}
                activeOpacity={0.75}>
                <View style={[styles.checkbox, active && styles.checkboxChecked]}>
                  {active && <Icon name="check" size={14} color={Colors.onPrimary} />}
                </View>
                <Text style={[styles.consentLabel, active && styles.consentLabelActive]}>
                  {c.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.trustNote}>
          CoBuddy is designed around trust, verification, and safety-first public experiences.
        </Text>
      </ScrollView>

      <BottomActionBar>
        <PrimaryButton
          label="ACCEPT & CONTINUE"
          onPress={() => navigation.navigate('BasicProfileSetup')}
          disabled={!allChecked}
        />
      </BottomActionBar>

      {/* ── Legal Document Bottom Sheet ── */}
      <AppBottomSheet
        visible={activeDoc !== null}
        onClose={() => setActiveDoc(null)}
        title={activeDoc?.title ?? ''}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={sheet.content}>
          <View style={sheet.iconRow}>
            <DocIcon icon={activeDoc?.icon ?? ''} />
            <Text style={sheet.docDesc}>{activeDoc?.desc}</Text>
          </View>
          {activeDoc?.sections.map(s => (
            <View key={s.heading} style={sheet.section}>
              <Text style={sheet.sectionHeading}>{s.heading}</Text>
              <Text style={sheet.sectionBody}>{s.body}</Text>
            </View>
          ))}
          <View style={sheet.bottomGap} />
        </ScrollView>
      </AppBottomSheet>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Step info (right side of header)
  logoC: {fontSize: 22, fontWeight: '700', color: Colors.primary, letterSpacing: -0.5},
  stepInfo: {alignItems: 'flex-end', gap: 4},
  stepLabel: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.primary,
    fontWeight: '600',
  },
  progressTrack: {
    width: 80,
    height: 3,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFull: {flex: 1, backgroundColor: Colors.primaryContainer},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24},

  // Editorial header
  editorialHeader: {alignItems: 'center', marginBottom: 28},
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: Colors.onSurface,
    letterSpacing: -0.5,
    lineHeight: 34,
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
    textAlign: 'center',
  },

  // Doc cards
  docCards: {gap: 12, marginBottom: 24},
  docCard: {
    backgroundColor: 'rgba(11,13,26,0.6)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  docIcon: {fontSize: 22, marginBottom: 8},
  docTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 4,
    lineHeight: 24,
  },
  docDesc: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 19,
    marginBottom: 12,
  },
  readLink: {alignSelf: 'flex-start'},
  readText: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Consent list
  consentList: {gap: 2, marginBottom: 20},
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 11,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: Colors.primaryContainer,
    borderColor: Colors.primaryContainer,
  },
  checkmark: {fontSize: 13, color: Colors.onPrimary, fontWeight: '700'},
  consentLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSurface,
    lineHeight: 21,
  },
  consentLabelActive: {color: Colors.primary},

  trustNote: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.6,
    paddingHorizontal: 8,
  },
});

// Bottom sheet interior
const sheet = StyleSheet.create({
  content: {paddingBottom: 16},
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.outlineVariant,
    marginBottom: 16,
  },
  docIcon: {fontSize: 28},
  docDesc: {flex: 1, fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 21},
  section: {marginBottom: 18},
  sectionHeading: {
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  sectionBody: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 22,
  },
  bottomGap: {height: 24},
});
