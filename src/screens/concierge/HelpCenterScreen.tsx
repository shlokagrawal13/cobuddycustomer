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
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ConciergeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

type Props = NativeStackScreenProps<ConciergeStackParamList, 'HelpCenter'>;

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

// ─── Data ─────────────────────────────────────────────────────────────────────
interface HelpCategory {
  id: string;
  iconName: string;
  label: string;
}

const CATEGORIES: HelpCategory[] = [
  {id: 'sessions',      iconName: 'event-seat',           label: 'Sessions & Bookings'},
  {id: 'payments',      iconName: 'payments',             label: 'Payments & Refunds'},
  {id: 'verification',  iconName: 'fingerprint',          label: 'Verification & Identity'},
  {id: 'safety',        iconName: 'shield',               label: 'Safety & Protection'},
  {id: 'membership',    iconName: 'workspace-premium',    label: 'Premium Membership'},
  {id: 'wallet',        iconName: 'account-balance-wallet', label: 'Rewards & Wallet'},
  {id: 'communities',   iconName: 'diversity-3',          label: 'Communities & Events'},
  {id: 'technical',     iconName: 'engineering',          label: 'Technical Assistance'},
];

interface Article {
  id: string;
  tag: string;
  readTime: string;
  title: string;
  body: string;
}

const POPULAR_ARTICLES: Article[] = [
  {
    id: 'a1',
    tag: 'Verification',
    readTime: '3 min',
    title: 'Understanding Our Identity Verification Process',
    body: 'Learn how CoBuddy ensures a secure and exclusive environment through our multi-step verification protocol.',
  },
  {
    id: 'a2',
    tag: 'Refunds',
    readTime: '5 min',
    title: 'Cancellation & Refund Policies for Premium Sessions',
    body: 'A comprehensive guide to handling cancellations, no-shows, and processing refunds for high-tier bookings.',
  },
  {
    id: 'a3',
    tag: 'Safety',
    readTime: '4 min',
    title: 'Utilizing the In-App Safety Features',
    body: 'How to access emergency assistance, share your live location, and report incidents discreetly.',
  },
];

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQ[] = [
  {
    id: 'f1',
    question: 'How do I verify my identity?',
    answer:
      'Navigate to the Identity tab and follow the step-by-step verification flow. You will need a government-issued ID and a live selfie. Verification typically takes 2-4 hours.',
  },
  {
    id: 'f2',
    question: 'Can I cancel my session?',
    answer:
      'Yes. Cancellations made more than 24 hours before the session receive a full refund. Cancellations within 24 hours are subject to our partial refund policy. Access your session from the Sessions tab to cancel.',
  },
  {
    id: 'f3',
    question: 'What is the safety monitoring feature?',
    answer:
      'CoBuddy provides live safety monitoring during all sessions. Your trusted contacts can receive real-time location updates. An emergency SOS is always one tap away from the session screen.',
  },
  {
    id: 'f4',
    question: 'How do I upgrade my membership tier?',
    answer:
      'Visit Profile → Membership Tiers to view available upgrades. Your tier determines companion access levels, booking priority, and concierge response speed.',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function HelpCenterScreen({navigation}: Props) {
  const [search, setSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [submitTopic, setSubmitTopic] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const insets = useSafeAreaInsets();

  const toggleFaq = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(prev => (prev === id ? null : id));
  };

  const handleSubmit = () => {
    if (!submitMessage.trim()) {
      Alert.alert('Required', 'Please describe your issue before submitting.');
      return;
    }
    setSubmitted(true);
    Alert.alert(
      'Request Submitted',
      'Your concierge will respond within 2 business hours. You can also track this request in your messages.',
      [{text: 'View Messages', onPress: () => navigation.navigate('MessagingThread', {conversationId: 'concierge_main'})},
       {text: 'Done', style: 'cancel'}],
    );
  };

  const filteredArticles = search.trim()
    ? POPULAR_ARTICLES.filter(
        a =>
          a.title.toLowerCase().includes(search.toLowerCase()) ||
          a.body.toLowerCase().includes(search.toLowerCase()) ||
          a.tag.toLowerCase().includes(search.toLowerCase()),
      )
    : POPULAR_ARTICLES;

  const filteredFaqs = search.trim()
    ? FAQ_ITEMS.filter(
        f =>
          f.question.toLowerCase().includes(search.toLowerCase()) ||
          f.answer.toLowerCase().includes(search.toLowerCase()),
      )
    : FAQ_ITEMS;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support Hub</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, {paddingBottom: Math.max(32, insets.bottom + 16)}]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Hero banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroIconWrap}>
            <Icon name="support-agent" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.heroTitle}>How Can We{'\n'}Assist You?</Text>
          <Text style={styles.heroSub}>
            Concierge-guided assistance, emotionally intelligent safety systems, and premium hospitality support.
          </Text>
        </View>

        {/* Priority Concierge Assistance banner */}
        <View style={styles.priorityBanner}>
          <View style={styles.priorityLeft}>
            <Icon name="star" size={18} color={Colors.primary} />
            <View>
              <Text style={styles.priorityTitle}>Priority Concierge Assistance</Text>
              <Text style={styles.prioritySub}>Available now - Avg. response 8 min</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.connectBtn}
            onPress={() => navigation.navigate('MessagingThread', {conversationId: 'concierge_main'})}
            activeOpacity={0.85}>
            <Text style={styles.connectBtnText}>Connect Now</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <View style={styles.searchWrap}>
          <Icon name="search" size={18} color={Colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search topics, articles, FAQs..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
              <Icon name="close" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>

        {/* Browse Categories - 8 from Stitch */}
        {search.trim() === '' && (
          <>
            <Text style={styles.sectionLabel}>BROWSE CATEGORIES</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryCard}
                  onPress={() => navigation.navigate('HelpArticle', {categoryId: cat.id})}
                  activeOpacity={0.75}>
                  <View style={styles.categoryIconCircle}>
                    <Icon name={cat.iconName} size={22} color={Colors.primary} />
                  </View>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Popular Articles */}
        <Text style={styles.sectionLabel}>
          {search.trim() ? 'ARTICLES' : 'POPULAR ARTICLES'}
        </Text>
        <View style={styles.articlesList}>
          {filteredArticles.length === 0 ? (
            <View style={styles.emptySearch}>
              <Icon name="search-off" size={32} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptySearchText}>No articles match "{search}"</Text>
            </View>
          ) : (
            filteredArticles.map(article => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => navigation.navigate('HelpArticle', {articleId: article.id})}
                activeOpacity={0.75}>
                <View style={styles.articleTop}>
                  <View style={styles.articleTag}>
                    <Text style={styles.articleTagText}>{article.tag}</Text>
                  </View>
                  <View style={styles.readTimeRow}>
                    <Icon name="schedule" size={12} color={Colors.onSurfaceVariant} />
                    <Text style={styles.readTimeText}>{article.readTime}</Text>
                  </View>
                </View>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <Text style={styles.articleBody} numberOfLines={2}>{article.body}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* FAQ Accordion */}
        <Text style={styles.sectionLabel}>
          {search.trim() ? 'FAQS' : 'FREQUENTLY ASKED'}
        </Text>
        <View style={styles.faqList}>
          {filteredFaqs.length === 0 ? (
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchText}>No FAQs match "{search}"</Text>
            </View>
          ) : (
            filteredFaqs.map(faq => {
              const open = expandedFaq === faq.id;
              return (
                <View key={faq.id} style={styles.faqCard}>
                  <TouchableOpacity
                    style={styles.faqRow}
                    onPress={() => toggleFaq(faq.id)}
                    activeOpacity={0.8}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Icon
                      name={open ? 'expand-less' : 'expand-more'}
                      size={20}
                      color={Colors.onSurfaceVariant}
                    />
                  </TouchableOpacity>
                  {open && (
                    <View style={styles.faqAnswer}>
                      <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Submit Issue Form */}
        {search.trim() === '' && !submitted && (
          <>
            <Text style={styles.sectionLabel}>SUBMIT AN ISSUE</Text>
            <View style={styles.submitCard}>
              <Text style={styles.submitTitle}>Contact Support</Text>
              <Text style={styles.submitSub}>
                Our concierge team typically responds within 2 business hours.
              </Text>
              <Text style={styles.submitFieldLabel}>TOPIC</Text>
              <TextInput
                style={styles.submitInput}
                placeholder="e.g. Booking problem, Payment issue..."
                placeholderTextColor={Colors.onSurfaceVariant}
                value={submitTopic}
                onChangeText={setSubmitTopic}
              />
              <Text style={styles.submitFieldLabel}>DESCRIBE YOUR ISSUE</Text>
              <TextInput
                style={[styles.submitInput, styles.submitTextArea]}
                placeholder="Please describe the issue in as much detail as possible..."
                placeholderTextColor={Colors.onSurfaceVariant}
                value={submitMessage}
                onChangeText={setSubmitMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}>
                <Icon name="send" size={16} color={Colors.onPrimary} />
                <Text style={styles.submitBtnText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {submitted && (
          <View style={styles.submittedBanner}>
            <Icon name="check-circle" size={20} color={Colors.success} />
            <Text style={styles.submittedText}>Request submitted. Our team will respond shortly.</Text>
          </View>
        )}

        {/* Safety Reporting panel */}
        <View style={styles.safetyPanel}>
          <View style={styles.safetyPanelHeader}>
            <Icon name="warning" size={22} color={Colors.error} />
            <Text style={styles.safetyPanelTitle}>Safety Reporting</Text>
          </View>
          <Text style={styles.safetyPanelBody}>
            Immediate, discreet assistance for any concerns during or after a session.
          </Text>
          <TouchableOpacity style={styles.safetyBtn} onPress={() => (navigation as any).navigate('SafetyNavigator', {screen: 'IncidentReport', params: {}})} activeOpacity={0.7}>
            <Text style={styles.safetyBtnText}>Report a Safety Concern</Text>
            <Icon name="chevron-right" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.safetyBtn} onPress={() => (navigation as any).navigate('SafetyNavigator', {screen: 'IncidentReport', params: {}})} activeOpacity={0.7}>
            <Text style={styles.safetyBtnText}>File an Incident Report</Text>
            <Icon name="chevron-right" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>

        {/* Live concierge CTA */}
        <View style={styles.conciergeCard}>
          <View style={styles.conciergeIconCircle}>
            <Icon name="support-agent" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.conciergeTitle}>Live Concierge</Text>
          <Text style={styles.conciergeSub}>
            Premium, personalized support available directly to assist with your arrangements.
          </Text>
          <TouchableOpacity
            style={styles.conciergeBtn}
            onPress={() => navigation.navigate('MessagingThread', {conversationId: 'concierge_main'})}
            activeOpacity={0.8}>
            <Icon name="chat" size={16} color={Colors.surface} />
            <Text style={styles.conciergeBtnText}>Start Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.conciergePhoneBtn}
            onPress={() =>
              navigation.navigate('MessagingThread', {conversationId: 'concierge_main'})
            }
            activeOpacity={0.7}>
            <Icon name="phone" size={16} color={Colors.primary} />
            <Text style={styles.conciergePhoneBtnText}>Request Callback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CARD_BG = 'rgba(20,20,15,0.85)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_DIM = 'rgba(242,202,80,0.12)';

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
  scrollContent: {paddingHorizontal: 16, paddingTop: 20},

  // Hero banner
  heroBanner: {
    backgroundColor: CARD_BG,
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.15)',
    padding: 24, marginBottom: 14,
    alignItems: 'center', gap: 10,
  },
  heroIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: GOLD_DIM,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24,
    color: Colors.onSurface, textAlign: 'center', lineHeight: 32,
  },
  heroSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 21,
  },

  // Priority concierge banner
  priorityBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: GOLD_DIM,
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    padding: 14, marginBottom: 16, gap: 10,
  },
  priorityLeft: {flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1},
  priorityTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, marginBottom: 2,
  },
  prioritySub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  connectBtn: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  connectBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onPrimary},

  // Search
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 12, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 14, paddingVertical: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 15,
    color: Colors.onSurface, padding: 0,
  },

  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10,
    color: Colors.onSurfaceVariant, letterSpacing: 1.5,
    marginBottom: 12, paddingLeft: 2,
  },

  // Category grid - 8 items, 2 per row
  categoryGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
    marginBottom: 24,
  },
  categoryCard: {
    width: '47.5%', backgroundColor: CARD_BG,
    borderRadius: 16, borderWidth: 1, borderColor: CARD_BORDER,
    paddingVertical: 18, paddingHorizontal: 14,
    alignItems: 'center', gap: 10,
  },
  categoryIconCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: GOLD_DIM,
    alignItems: 'center', justifyContent: 'center',
  },
  categoryLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 12,
    color: Colors.onSurface, textAlign: 'center',
  },

  // Popular articles
  articlesList: {gap: 10, marginBottom: 24},
  articleCard: {
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 16, gap: 8,
  },
  articleTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  articleTag: {
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.35)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 3,
  },
  articleTagText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 0.5},
  readTimeRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  readTimeText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  articleTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface, lineHeight: 20},
  articleBody: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18},

  emptySearch: {alignItems: 'center', paddingVertical: 24, gap: 10},
  emptySearchText: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},

  // FAQ accordion
  faqList: {gap: 8, marginBottom: 24},
  faqCard: {
    backgroundColor: CARD_BG, borderRadius: 14,
    borderWidth: 1, borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
  faqRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: 12, padding: 16,
  },
  faqQuestion: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface, flex: 1, lineHeight: 20},
  faqAnswer: {
    paddingHorizontal: 16, paddingBottom: 16,
    borderTopWidth: 1, borderTopColor: CARD_BORDER,
    paddingTop: 12,
  },
  faqAnswerText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},

  // Submit form
  submitCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 20, marginBottom: 16, gap: 12,
  },
  submitTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.onSurface},
  submitSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},
  submitFieldLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant,
    letterSpacing: 1.2, marginBottom: -4,
  },
  submitInput: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 10, borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface,
  },
  submitTextArea: {height: 100, paddingTop: 12},
  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary,
    borderRadius: 12, paddingVertical: 14,
  },
  submitBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary},

  submittedBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(109,217,140,0.1)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(109,217,140,0.2)',
    padding: 14, marginBottom: 16,
  },
  submittedText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface, flex: 1},

  // Safety panel
  safetyPanel: {
    backgroundColor: 'rgba(147,0,10,0.06)',
    borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.15)',
    borderLeftWidth: 3, borderLeftColor: Colors.error,
    padding: 20, marginBottom: 14,
  },
  safetyPanelHeader: {flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10},
  safetyPanelTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  safetyPanelBody: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, lineHeight: 19, marginBottom: 14,
  },
  safetyBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    borderRadius: 10, paddingVertical: 13, paddingHorizontal: 16,
    marginBottom: 8,
  },
  safetyBtnText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},

  // Concierge card
  conciergeCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    padding: 24, alignItems: 'center', gap: 10,
    marginBottom: 8,
  },
  conciergeIconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: GOLD_DIM,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4,
  },
  conciergeTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface},
  conciergeSub: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, textAlign: 'center',
    lineHeight: 19, marginBottom: 4,
  },
  conciergeBtn: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12, paddingVertical: 14,
  },
  conciergeBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.surface},
  conciergePhoneBtn: {
    width: '100%', flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.3)',
    borderRadius: 12, paddingVertical: 13,
    backgroundColor: 'rgba(242,202,80,0.06)',
  },
  conciergePhoneBtnText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.primary},
});


