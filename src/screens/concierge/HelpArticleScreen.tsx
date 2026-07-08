import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ConciergeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ConciergeStackParamList, 'HelpArticle'>;

// ── Data ──────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  categoryId: string;
  tag: string;
  readTime: string;
  title: string;
  body: string;
  sections: {heading: string; content: string}[];
}

const ALL_ARTICLES: Article[] = [
  {
    id: 'a1',
    categoryId: 'verification',
    tag: 'Verification',
    readTime: '3 min',
    title: 'Understanding Our Identity Verification Process',
    body: 'CoBuddy uses a multi-step verification protocol to maintain an exclusive, safe environment for all members.',
    sections: [
      {
        heading: 'Why Verification Matters',
        content:
          'Every CoBuddy member undergoes identity verification to ensure the safety and exclusivity of the platform. This builds trust between companions and clients, and enables our safety features to function at their highest level.',
      },
      {
        heading: 'What You Need',
        content:
          'A government-issued photo ID (passport, driving licence, or national ID card) and a live selfie taken within the app. Both documents must be valid and clearly readable.',
      },
      {
        heading: 'The Process',
        content:
          'Navigate to Profile then Identity Trust Center. Follow the step-by-step flow: upload your ID, complete the live selfie check, and submit. Verification typically completes within 2 to 4 hours. You will receive an in-app notification once confirmed.',
      },
      {
        heading: 'After Verification',
        content:
          'Your Trust Score will update automatically. A verified badge appears on your profile, unlocking full booking privileges and companion access.',
      },
    ],
  },
  {
    id: 'a2',
    categoryId: 'payments',
    tag: 'Refunds',
    readTime: '5 min',
    title: 'Cancellation and Refund Policies for Premium Sessions',
    body: 'A guide to handling cancellations, no-shows, and processing refunds for high-tier bookings.',
    sections: [
      {
        heading: 'Cancellation Window',
        content:
          'Cancellations made more than 24 hours before the scheduled session start receive a full refund, minus a small processing fee. Cancellations within 24 hours are subject to our partial refund policy.',
      },
      {
        heading: 'Partial Refund Policy',
        content:
          'If you cancel within 24 hours, you will receive 50% of the session fee as a credit to your CoBuddy wallet. Credits expire after 90 days and can be applied to future bookings.',
      },
      {
        heading: 'No-Show Policy',
        content:
          'Failing to appear at the session location within 30 minutes of the scheduled start time constitutes a no-show. No-shows are not eligible for refunds. Repeated no-shows may affect your Trust Score.',
      },
      {
        heading: 'How to Cancel',
        content:
          'Open the Sessions tab, select the upcoming session, and tap Cancel Session. Confirm your cancellation and the refund will be processed within 3 to 5 business days.',
      },
    ],
  },
  {
    id: 'a3',
    categoryId: 'safety',
    tag: 'Safety',
    readTime: '4 min',
    title: 'Utilizing the In-App Safety Features',
    body: 'How to access emergency assistance, share your live location, and report incidents discreetly.',
    sections: [
      {
        heading: 'Emergency SOS',
        content:
          'The SOS button is accessible from the Active Session screen at all times. Tapping it triggers your emergency protocol, alerting your trusted contacts and our concierge team simultaneously.',
      },
      {
        heading: 'Safety Monitoring',
        content:
          'Enable Live Safety Monitoring from Profile then Safety Settings. Your trusted contacts receive periodic check-ins and can view your session status in real time.',
      },
      {
        heading: 'Trusted Contacts',
        content:
          'Add up to five trusted contacts from Profile then Safety then Trusted Contacts. These individuals are notified at session start, can track your status, and are alerted in an emergency.',
      },
      {
        heading: 'Reporting an Incident',
        content:
          'Use Help Center then Report a Safety Concern, or navigate directly to Safety then Incident Report. All reports are handled confidentially by our dedicated safety team within one hour.',
      },
    ],
  },
  {
    id: 'a4',
    categoryId: 'sessions',
    tag: 'Sessions',
    readTime: '3 min',
    title: 'How to Book a Premium Companion Session',
    body: 'Step-by-step guide to requesting and confirming a luxury companion experience.',
    sections: [
      {
        heading: 'Browse Companions',
        content:
          'Navigate to the Home tab and select Browse Companions. Use filters to narrow by availability, interests, languages, and rating. Tap a companion card to view their full profile.',
      },
      {
        heading: 'Request Intro',
        content:
          'From the companion profile, tap Request Intro. You will be taken to the companion calendar to select a date, time, and duration. Choose your preferred venue or let the concierge suggest one.',
      },
      {
        heading: 'Booking Summary',
        content:
          'Review the booking details, select your payment method, and confirm. A payment hold is placed and released only after the session completes successfully.',
      },
      {
        heading: 'Session Preparation',
        content:
          'Once confirmed, access Session Prep from the upcoming session card. Here you will find venue details, dress code guidelines, behavioural directives, and a countdown timer.',
      },
    ],
  },
  {
    id: 'a5',
    categoryId: 'membership',
    tag: 'Membership',
    readTime: '4 min',
    title: 'CoBuddy Membership Tiers Explained',
    body: 'Understand the privileges, access levels, and upgrade paths for each membership tier.',
    sections: [
      {
        heading: 'Tier Overview',
        content:
          'CoBuddy offers three membership tiers: Gold, Platinum, and Black. Each tier unlocks progressively exclusive companions, faster concierge response times, and enhanced event access.',
      },
      {
        heading: 'Upgrading Your Tier',
        content:
          'Navigate to Profile then Membership Tiers to view your current standing and upgrade options. Upgrades take effect immediately and include a prorated adjustment if upgrading mid-cycle.',
      },
      {
        heading: 'Tier Benefits',
        content:
          'Gold members enjoy priority booking and concierge support. Platinum members gain access to international companions and VIP event reservations. Black tier members receive a dedicated personal concierge and bespoke experience curation.',
      },
    ],
  },
  {
    id: 'a6',
    categoryId: 'wallet',
    tag: 'Rewards',
    readTime: '3 min',
    title: 'Understanding Your CoBuddy Rewards Balance',
    body: 'How to earn, view, and redeem CoBuddy Points for exclusive benefits.',
    sections: [
      {
        heading: 'Earning Points',
        content:
          'Earn CoBuddy Points on every completed session, referral, and profile milestone. Points are credited to your wallet within 24 hours of session completion.',
      },
      {
        heading: 'Redeeming Points',
        content:
          'Navigate to Profile then Rewards and Credits to browse available redemptions. Options include session credits, membership upgrades, and exclusive event access.',
      },
      {
        heading: 'Points Expiry',
        content:
          'Points expire 12 months after they are earned. You will receive an in-app notification 30 days before any points are due to expire.',
      },
    ],
  },
  {
    id: 'a7',
    categoryId: 'bookings',
    tag: 'Bookings',
    readTime: '3 min',
    title: 'How to Modify or Cancel a Booking',
    body: 'Step-by-step guide to changing your upcoming session details or cancelling with minimal penalty.',
    sections: [
      {
        heading: 'Modifying a Booking',
        content:
          'Open the Sessions tab and select your upcoming booking. Tap Modify Booking to adjust the date, time, duration, or venue. Changes are subject to companion availability and require re-confirmation.',
      },
      {
        heading: 'Cancellation Policy',
        content:
          'Cancellations more than 24 hours in advance receive a full refund minus processing fees. Cancellations within 24 hours are eligible for 50% credit to your CoBuddy wallet.',
      },
      {
        heading: 'Rescheduling',
        content:
          'To reschedule, cancel the existing booking and create a new one. Alternatively, contact your concierge directly and we will coordinate the change on your behalf.',
      },
    ],
  },
  {
    id: 'a8',
    categoryId: 'bookings',
    tag: 'Bookings',
    readTime: '4 min',
    title: 'Understanding Booking Confirmations and Digital Passes',
    body: 'What your booking confirmation contains and how to use your Digital Pass at the venue.',
    sections: [
      {
        heading: 'Booking Confirmation',
        content:
          'After completing checkout, you will receive an in-app confirmation with your booking reference, session details, companion information, and venue address.',
      },
      {
        heading: 'Your Digital Pass',
        content:
          'Access your Digital Pass from the Sessions tab. Present the QR code at the venue for a seamless, private check-in. The pass also confirms your CoBuddy membership tier.',
      },
      {
        heading: 'Arrival Verification',
        content:
          'On the day of your session, open Arrival Verification from the session card. This confirms your presence to the companion and activates the live safety monitoring features.',
      },
    ],
  },
  {
    id: 'a9',
    categoryId: 'account',
    tag: 'Account',
    readTime: '3 min',
    title: 'Managing Your Profile and Privacy Settings',
    body: 'How to update your personal information, privacy controls, and data preferences.',
    sections: [
      {
        heading: 'Editing Your Profile',
        content:
          'Navigate to Profile then Edit Profile to update your display name, bio, photos, and lifestyle preferences. Changes save automatically and take effect immediately.',
      },
      {
        heading: 'Privacy Controls',
        content:
          'Manage data sharing and visibility from Profile then Settings then Privacy. You can control who sees your profile, opt out of analytics, and request a data export at any time.',
      },
      {
        heading: 'Consent Manager',
        content:
          'Review and update your consent preferences from Profile then Settings then Consent Manager. This includes marketing communications, session data retention, and third-party sharing.',
      },
    ],
  },
  {
    id: 'a10',
    categoryId: 'account',
    tag: 'Account',
    readTime: '4 min',
    title: 'Membership Tiers and Upgrade Benefits',
    body: 'Understand the privileges at each membership tier and how to upgrade your account.',
    sections: [
      {
        heading: 'Tier Overview',
        content:
          'CoBuddy offers Gold, Platinum, and Black membership tiers. Each tier unlocks progressively exclusive companions, faster concierge response times, and enhanced event access.',
      },
      {
        heading: 'How to Upgrade',
        content:
          'Navigate to Profile then Membership Tiers. Select your desired tier and complete the secure checkout. Upgrades take effect immediately with a prorated billing adjustment.',
      },
      {
        heading: 'Cancelling Membership',
        content:
          'To cancel, go to Profile then Membership then Cancel Membership. Your access remains active until the end of the current billing period. All session data is retained.',
      },
    ],
  },
];


const CATEGORY_META: Record<string, {label: string; iconName: string}> = {
  bookings:     {label: 'Bookings & Reservations',  iconName: 'assignment'},
  sessions:     {label: 'Sessions & Bookings',       iconName: 'event-seat'},
  payments:     {label: 'Payments & Refunds',        iconName: 'payments'},
  verification: {label: 'Verification & Identity',  iconName: 'fingerprint'},
  safety:       {label: 'Safety & Protection',       iconName: 'shield'},
  account:      {label: 'Account & Membership',      iconName: 'settings'},
  membership:   {label: 'Premium Membership',        iconName: 'workspace-premium'},
  wallet:       {label: 'Rewards & Wallet',          iconName: 'account-balance-wallet'},
  communities:  {label: 'Communities & Events',      iconName: 'diversity-3'},
  technical:    {label: 'Technical Assistance',      iconName: 'engineering'},
};

// ── Screen ────────────────────────────────────────────────────────────────────

export default function HelpArticleScreen({navigation, route}: Props) {
  const {articleId, categoryId} = route.params;
  const insets = useSafeAreaInsets();

  const [search, setSearch]           = useState('');
  const [helpful, setHelpful]         = useState<boolean | null>(null);

  // Determine what to show: article view or category list view
  const isArticleView = !!articleId;
  const isCategoryView = !isArticleView && !!categoryId;

  const article = useMemo(
    () => ALL_ARTICLES.find(a => a.id === articleId),
    [articleId],
  );

  const categoryArticles = useMemo(() => {
    if (!categoryId) return ALL_ARTICLES;
    return ALL_ARTICLES.filter(a => a.categoryId === categoryId);
  }, [categoryId]);

  const filteredArticles = useMemo(() => {
    if (!search.trim()) return categoryArticles;
    const q = search.toLowerCase();
    return categoryArticles.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.body.toLowerCase().includes(q),
    );
  }, [categoryArticles, search]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    return ALL_ARTICLES.filter(
      a => a.id !== article.id && a.categoryId === article.categoryId,
    ).slice(0, 3);
  }, [article]);

  const catMeta = categoryId ? CATEGORY_META[categoryId] : null;

  const goToArticle = (id: string) =>
    navigation.push('HelpArticle', {articleId: id});

  const goToConcierge = () =>
    navigation.navigate('MessagingThread', {conversationId: 'concierge_main'});

  // ── Article Detail View ──────────────────────────────────────────────────
  if (isArticleView && article) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <SafeAreaView edges={['top']} style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            activeOpacity={0.7}>
            <Icon name="arrow-back" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {article.tag}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.readTimePill}>
              <Icon name="schedule" size={12} color={Colors.primary} />
              <Text style={styles.readTimeText}>{article.readTime}</Text>
            </View>
          </View>
        </SafeAreaView>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {paddingBottom: Math.max(32, insets.bottom + 16)},
          ]}
          showsVerticalScrollIndicator={false}>

          {/* Article tag + title */}
          <View style={styles.articleHeader}>
            <View style={styles.tagRow}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{article.tag.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.articleTitle}>{article.title}</Text>
            <Text style={styles.articleLead}>{article.body}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Sections */}
          {article.sections.map((sec, i) => (
            <View key={i} style={styles.section}>
              <View style={styles.sectionHeadingRow}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionHeading}>{sec.heading}</Text>
              </View>
              <Text style={styles.sectionContent}>{sec.content}</Text>
            </View>
          ))}

          {/* Helpful rating */}
          <View style={styles.helpfulCard}>
            <Text style={styles.helpfulTitle}>Was this article helpful?</Text>
            <View style={styles.helpfulBtns}>
              <TouchableOpacity
                style={[
                  styles.helpfulBtn,
                  helpful === true && styles.helpfulBtnActive,
                ]}
                onPress={() => setHelpful(true)}
                activeOpacity={0.8}>
                <Icon
                  name="thumb-up"
                  size={18}
                  color={helpful === true ? Colors.onPrimary : Colors.primary}
                />
                <Text
                  style={[
                    styles.helpfulBtnText,
                    helpful === true && styles.helpfulBtnTextActive,
                  ]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.helpfulBtn,
                  helpful === false && styles.helpfulBtnNegActive,
                ]}
                onPress={() => setHelpful(false)}
                activeOpacity={0.8}>
                <Icon
                  name="thumb-down"
                  size={18}
                  color={
                    helpful === false
                      ? Colors.onError
                      : Colors.onSurfaceVariant
                  }
                />
                <Text
                  style={[
                    styles.helpfulBtnText,
                    helpful === false && styles.helpfulBtnTextNeg,
                  ]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
            {helpful !== null && (
              <Text style={styles.helpfulThanks}>
                {helpful
                  ? 'Thank you for your feedback.'
                  : 'We will work to improve this article.'}
              </Text>
            )}
          </View>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>RELATED ARTICLES</Text>
              {relatedArticles.map(rel => (
                <TouchableOpacity
                  key={rel.id}
                  style={styles.relatedCard}
                  onPress={() => goToArticle(rel.id)}
                  activeOpacity={0.8}>
                  <View style={styles.relatedMeta}>
                    <View style={styles.relatedTag}>
                      <Text style={styles.relatedTagText}>{rel.tag}</Text>
                    </View>
                    <View style={styles.relatedTimeRow}>
                      <Icon name="schedule" size={11} color={Colors.outline} />
                      <Text style={styles.relatedTimeText}>{rel.readTime}</Text>
                    </View>
                  </View>
                  <Text style={styles.relatedTitle}>{rel.title}</Text>
                  <Icon name="chevron-right" size={16} color={Colors.outline} />
                </TouchableOpacity>
              ))}
            </>
          )}

          {/* Concierge CTA */}
          <View style={styles.conciergeCard}>
            <View style={styles.conciergeIconCircle}>
              <Icon name="support-agent" size={26} color={Colors.primary} />
            </View>
            <Text style={styles.conciergeTitle}>Still need help?</Text>
            <Text style={styles.conciergeSub}>
              Our concierge team is available around the clock for personalised assistance.
            </Text>
            <TouchableOpacity
              style={styles.conciergeBtn}
              onPress={goToConcierge}
              activeOpacity={0.85}>
              <Icon name="chat" size={16} color={Colors.onPrimary} />
              <Text style={styles.conciergeBtnText}>Contact Concierge</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // ── Category / Search List View ──────────────────────────────────────────
  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {catMeta ? catMeta.label : 'Help Articles'}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </SafeAreaView>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <Icon name="search" size={18} color={Colors.outline} />
        <TextInput
          style={styles.searchInput}
          placeholder={catMeta ? `Search ${catMeta.label}...` : 'Search articles...'}
          placeholderTextColor={Colors.outline}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
            <Icon name="close" size={16} color={Colors.outline} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category meta row */}
      {catMeta && (
        <View style={styles.catMetaRow}>
          <View style={styles.catIconCircle}>
            <Icon name={catMeta.iconName} size={20} color={Colors.primary} />
          </View>
          <Text style={styles.catMetaLabel}>{catMeta.label}</Text>
          <Text style={styles.catMetaCount}>
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {paddingBottom: Math.max(32, insets.bottom + 16)},
        ]}
        showsVerticalScrollIndicator={false}>

        {filteredArticles.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="search-off" size={40} color={Colors.outlineVariant} />
            <Text style={styles.emptyTitle}>No articles found</Text>
            <Text style={styles.emptySub}>Try a different search term</Text>
          </View>
        ) : (
          filteredArticles.map(a => (
            <TouchableOpacity
              key={a.id}
              style={styles.articleCard}
              onPress={() => goToArticle(a.id)}
              activeOpacity={0.8}>
              <View style={styles.articleCardTop}>
                <View style={styles.articleTagPill}>
                  <Text style={styles.articleTagText}>{a.tag}</Text>
                </View>
                <View style={styles.articleTimeRow}>
                  <Icon name="schedule" size={12} color={Colors.outline} />
                  <Text style={styles.articleTimeText}>{a.readTime}</Text>
                </View>
              </View>
              <Text style={styles.articleCardTitle}>{a.title}</Text>
              <Text style={styles.articleCardBody} numberOfLines={2}>
                {a.body}
              </Text>
              <View style={styles.articleCardFooter}>
                <Text style={styles.articleReadMore}>Read article</Text>
                <Icon name="arrow-forward" size={14} color={Colors.primary} />
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Concierge CTA */}
        <View style={styles.conciergeCard}>
          <View style={styles.conciergeIconCircle}>
            <Icon name="support-agent" size={26} color={Colors.primary} />
          </View>
          <Text style={styles.conciergeTitle}>Didn't find what you need?</Text>
          <Text style={styles.conciergeSub}>
            Our concierge team is available around the clock for personalised assistance.
          </Text>
          <TouchableOpacity
            style={styles.conciergeBtn}
            onPress={goToConcierge}
            activeOpacity={0.85}>
            <Icon name="chat" size={16} color={Colors.onPrimary} />
            <Text style={styles.conciergeBtnText}>Contact Concierge</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:                {flex: 1, backgroundColor: Colors.surface},
  scroll:              {flex: 1},
  scrollContent:       {padding: 16, gap: 12},

  // Header
  header:              {flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 8},
  backBtn:             {width: 36, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.06)'},
  headerCenter:        {flex: 1},
  headerTitle:         {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  headerRight:         {alignItems: 'flex-end'},
  readTimePill:        {flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.goldOverlay10, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: Colors.goldOverlay20},
  readTimeText:        {fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.primary},

  // Search
  searchRow:           {flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8, gap: 10, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, paddingVertical: 10},
  searchInput:         {flex: 1, fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface},

  // Category meta
  catMetaRow:          {flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 4, gap: 10, backgroundColor: Colors.surfaceContainer, borderRadius: 12, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 12},
  catIconCircle:       {width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.goldOverlay10, borderWidth: 1, borderColor: Colors.goldOverlay20, alignItems: 'center', justifyContent: 'center'},
  catMetaLabel:        {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  catMetaCount:        {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},

  // Article card (list view)
  articleCard:         {backgroundColor: Colors.surfaceContainer, borderRadius: 16, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 16, gap: 8},
  articleCardTop:      {flexDirection: 'row', alignItems: 'center', gap: 8},
  articleTagPill:      {backgroundColor: Colors.goldOverlay10, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: Colors.goldOverlay20},
  articleTagText:      {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 0.5},
  articleTimeRow:      {flexDirection: 'row', alignItems: 'center', gap: 4},
  articleTimeText:     {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.outline},
  articleCardTitle:    {fontFamily: 'Playfair-SemiBold', fontSize: 16, color: Colors.onSurface, lineHeight: 22},
  articleCardBody:     {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},
  articleCardFooter:   {flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4},
  articleReadMore:     {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},

  // Article detail
  articleHeader:       {gap: 10, marginBottom: 4},
  tagRow:              {flexDirection: 'row'},
  tagPill:             {backgroundColor: Colors.goldOverlay10, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.goldOverlay20},
  tagText:             {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, letterSpacing: 1},
  articleTitle:        {fontFamily: 'Playfair-Bold', fontSize: 22, color: Colors.onSurface, lineHeight: 30},
  articleLead:         {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 21},

  divider:             {height: 1, backgroundColor: Colors.outlineVariant, marginVertical: 4},

  // Sections
  section:             {gap: 8, paddingVertical: 4},
  sectionHeadingRow:   {flexDirection: 'row', alignItems: 'center', gap: 8},
  sectionAccent:       {width: 3, height: 16, borderRadius: 2, backgroundColor: Colors.primary},
  sectionHeading:      {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  sectionContent:      {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22, paddingLeft: 11},

  // Helpful
  helpfulCard:         {backgroundColor: Colors.surfaceContainer, borderRadius: 16, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 20, gap: 14, alignItems: 'center', marginVertical: 4},
  helpfulTitle:        {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  helpfulBtns:         {flexDirection: 'row', gap: 12},
  helpfulBtn:          {flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.goldOverlay10, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: Colors.outlineVariant},
  helpfulBtnActive:    {backgroundColor: Colors.primary, borderColor: Colors.primary},
  helpfulBtnNegActive: {backgroundColor: Colors.errorContainer, borderColor: Colors.errorContainer},
  helpfulBtnText:      {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
  helpfulBtnTextActive:{color: Colors.onPrimary},
  helpfulBtnTextNeg:   {color: Colors.error},
  helpfulThanks:       {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center'},

  // Related
  sectionLabel:        {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5, marginTop: 8, marginBottom: 4},
  relatedCard:         {backgroundColor: Colors.surfaceContainerLow, borderRadius: 14, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 14, gap: 6},
  relatedMeta:         {flexDirection: 'row', alignItems: 'center', gap: 8},
  relatedTag:          {backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2},
  relatedTagText:      {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 0.4},
  relatedTimeRow:      {flexDirection: 'row', alignItems: 'center', gap: 3},
  relatedTimeText:     {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.outline},
  relatedTitle:        {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, lineHeight: 19},
  relatedArrow:        {alignSelf: 'flex-end'},

  // Empty
  emptyState:          {alignItems: 'center', paddingVertical: 48, gap: 10},
  emptyTitle:          {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurfaceVariant},
  emptySub:            {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.outline},

  // Concierge CTA
  conciergeCard:       {backgroundColor: Colors.surfaceContainer, borderRadius: 20, borderWidth: 1, borderColor: Colors.outlineVariant, padding: 24, gap: 12, alignItems: 'center', marginTop: 8},
  conciergeIconCircle: {width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.goldOverlay10, borderWidth: 1, borderColor: Colors.goldOverlay20, alignItems: 'center', justifyContent: 'center'},
  conciergeTitle:      {fontFamily: 'Playfair-SemiBold', fontSize: 17, color: Colors.onSurface, textAlign: 'center'},
  conciergeSub:        {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 19},
  conciergeBtn:        {flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12},
  conciergeBtnText:    {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary},
});
