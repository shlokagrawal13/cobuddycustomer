import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch ref: past_sessions_experience_archive_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'SessionHistory'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

const SUMMARY_STATS = [
  {icon: 'verified',         label: 'Trusted Experiences', value: '38'},
  {icon: 'star',             label: 'Premium Sessions',    value: '12'},
  {icon: 'support-agent',    label: 'Concierge Supported', value: '50'},
];

const FILTER_TABS = ['All Experiences', 'Networking', 'Wellness', 'Dining', 'Premium Events'];

const SESSIONS = [
  {
    id: 'arch_001',
    badge: 'Trusted',
    category: 'Fine Dining',
    venue: 'The Reserve Club',
    date: 'Oct 24, 2023',
    time: '8:00 PM - 11:00 PM',
    companion: 'Elena V.',
    tier: null,
  },
  {
    id: 'arch_002',
    badge: 'Premium',
    category: 'Wellness',
    venue: 'Aura Sanctuary Spa',
    date: 'Sep 12, 2023',
    time: '10:00 AM - 2:00 PM',
    companion: 'Marcus T.',
    tier: 'workspace_premium',
  },
];

const INSIGHTS_DATA = [
  {label: 'Fine Dining', pct: 0.6},
  {label: 'Networking', pct: 0.3},
  {label: 'Wellness', pct: 0.1},
];

const MEMBERSHIP_BADGE = {
  icon: 'diamond', label: 'Elite', sub: 'Hospitality Level',
};

export default function SessionHistoryScreen({navigation}: Props) {
  const [activeFilter, setActiveFilter] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewSession = (sessionId: string) => {
    navigation.navigate('PastSessionDetail', {sessionId});
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
          <Icon name="arrow-back-ios" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerBrand}>CoBuddy</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setShowSearch(s => !s)}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            activeOpacity={0.7}>
            <Icon name="search" size={20} color={showSearch ? Colors.primary : Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setActiveFilter(0)}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
            activeOpacity={0.7}>
            <Icon name="tune" size={20} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {showSearch && (
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color={Colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search history..."
            placeholderTextColor={Colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{top:8,bottom:8,left:8,right:8}}>
              <Icon name="close" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}
        </View>
      )}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Page title */}
        <View style={styles.pageTitleBlock}>
          <Text style={styles.pageTitle}>Experience Archive</Text>
          <Text style={styles.pageSubtitle}>
            Revisit trusted experiences, hospitality memories, and premium networking moments.
          </Text>
        </View>

        {/* Summary stats row */}
        <View style={styles.statsRow}>
          {SUMMARY_STATS.map((s, i) => (
            <View
              key={s.label}
              style={[styles.statCard, i < SUMMARY_STATS.length - 1 && styles.statCardBorder]}>
              <Icon name={s.icon} size={16} color={Colors.primary} />
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Elite badge */}
        <View style={styles.eliteBadgeCard}>
          <Icon name={MEMBERSHIP_BADGE.icon} size={18} color={Colors.primary} />
          <View style={styles.eliteBadgeMeta}>
            <Text style={styles.eliteBadgeLabel}>{MEMBERSHIP_BADGE.label}</Text>
            <Text style={styles.eliteBadgeSub}>{MEMBERSHIP_BADGE.sub}</Text>
          </View>
          <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}>
          {FILTER_TABS.map((tab, i) => (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, activeFilter === i && styles.filterTabActive]}
              onPress={() => setActiveFilter(i)}
              activeOpacity={0.8}>
              <Text style={[styles.filterTabText, activeFilter === i && styles.filterTabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Session cards */}
        {SESSIONS.map(session => (
          <View key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionCardHeader}>
              <View style={styles.sessionBadge}>
                <Icon name="verified" size={11} color={Colors.success} />
                <Text style={styles.sessionBadgeText}>{session.badge}</Text>
              </View>
              <Text style={styles.sessionCategory}>{session.category}</Text>
              {session.tier && (
                <Icon name={session.tier} size={14} color={Colors.primary} />
              )}
            </View>

            <Text style={styles.sessionVenue}>{session.venue}</Text>

            <View style={styles.sessionDateRow}>
              <Icon name="calendar-today" size={12} color={Colors.onSurfaceVariant} />
              <Text style={styles.sessionDateText}>{session.date}</Text>
              <Text style={styles.sessionDateDot}>·</Text>
              <Text style={styles.sessionDateText}>{session.time}</Text>
            </View>

            <View style={styles.sessionCompanionRow}>
              <View style={styles.sessionCompanionAvatar}>
                <Text style={styles.sessionCompanionInitial}>
                  {session.companion.charAt(0)}
                </Text>
              </View>
              <Text style={styles.sessionCompanionName}>{session.companion}</Text>
            </View>

            <TouchableOpacity
              style={styles.viewExperienceBtn}
              onPress={() => handleViewSession(session.id)}
              activeOpacity={0.8}>
              <Text style={styles.viewExperienceBtnText}>View Experience</Text>
              <Icon name="arrow-forward" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Archive Insights */}
        <View style={styles.card}>
          <View style={styles.insightsHeader}>
            <Icon name="insights" size={16} color={Colors.primary} />
            <Text style={styles.cardTitle}>Archive Insights</Text>
          </View>
          <Text style={styles.insightsSummary}>
            Your most frequent hospitality category is Fine Dining, closely followed by Networking Events.
          </Text>
          {INSIGHTS_DATA.map(item => (
            <View key={item.label} style={styles.insightBar}>
              <Text style={styles.insightBarLabel}>{item.label}</Text>
              <View style={styles.insightBarTrack}>
                <View style={[styles.insightBarFill, {width: `${Math.round(item.pct * 100)}%`}]} />
              </View>
              <Text style={styles.insightBarPct}>{Math.round(item.pct * 100)}%</Text>
            </View>
          ))}
        </View>

        {/* Archive count */}
        <View style={styles.archiveCountRow}>
          <Icon name="history" size={16} color={Colors.onSurfaceVariant} />
          <Text style={styles.archiveCountText}>124 Total Sessions Archived</Text>
          <TouchableOpacity
            onPress={() =>
              Share.share({
                title: 'CoBuddy Session Archive',
                message:
                  'My CoBuddy Session Archive\n' +
                  '124 sessions recorded\n' +
                  'Export generated on ' +
                  new Date().toLocaleDateString() +
                  '\n\nFull archive export with detailed logs is available in the production build.',
              }).catch(() => {})
            }
            activeOpacity={0.7}>
            <Text style={styles.exportLink}>Export Archive</Text>
          </TouchableOpacity>
        </View>

        {/* Explore CTA */}
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={() => (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'})}
          activeOpacity={0.85}>
          <Icon name="explore" size={16} color={Colors.onPrimary} />
          <Text style={styles.exploreBtnText}>Explore New Experiences</Text>
        </TouchableOpacity>

        <View style={{height: 24}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 12, gap: 16},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerCenter: {flex: 1, alignItems: 'center'},
  headerBrand: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, letterSpacing: 1.5},
  headerRight: {flexDirection: 'row', alignItems: 'center'},
  headerIconBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},

  // Page title
  pageTitleBlock: {gap: 8},
  pageTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: Colors.onSurface},
  pageSubtitle: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20},

  // Stats row
  statsRow: {
    flexDirection: 'row',
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, overflow: 'hidden',
  },
  statCard: {flex: 1, alignItems: 'center', paddingVertical: 16, gap: 4},
  statCardBorder: {borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: CARD_BORDER},
  statValue: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.primary},
  statLabel: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, textAlign: 'center'},

  // Elite badge
  eliteBadgeCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: GOLD_BORDER, padding: 14,
  },
  eliteBadgeMeta: {flex: 1},
  eliteBadgeLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.primary},
  eliteBadgeSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},

  // Filter tabs
  filterTabsContent: {paddingHorizontal: 0, gap: 8},
  filterTab: {
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  filterTabActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  filterTabText: {fontFamily: 'Inter-Medium', fontSize: 12, color: Colors.onSurfaceVariant},
  filterTabTextActive: {color: Colors.onPrimary},

  // Session card
  sessionCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 10,
  },
  sessionCardHeader: {flexDirection: 'row', alignItems: 'center', gap: 10},
  sessionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 9, paddingVertical: 4,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  sessionBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success},
  sessionCategory: {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.onSurfaceVariant},
  sessionVenue: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface},
  sessionDateRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  sessionDateText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  sessionDateDot: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  sessionCompanionRow: {flexDirection: 'row', alignItems: 'center', gap: 10},
  sessionCompanionAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  sessionCompanionInitial: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
  sessionCompanionName: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  viewExperienceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    alignSelf: 'flex-start',
    borderWidth: 1, borderColor: GOLD_BORDER,
    borderRadius: 100, paddingHorizontal: 14, paddingVertical: 7,
  },
  viewExperienceBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},

  // Insights
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  cardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  insightsHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  insightsSummary: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  insightBar: {flexDirection: 'row', alignItems: 'center', gap: 10},
  insightBarLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, width: 80},
  insightBarTrack: {
    flex: 1, height: 6, borderRadius: 3,
    backgroundColor: Colors.surfaceContainerHigh, overflow: 'hidden',
  },
  insightBarFill: {height: 6, borderRadius: 3, backgroundColor: Colors.primary},
  insightBarPct: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary, width: 30, textAlign: 'right'},

  // Archive count
  archiveCountRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 4,
  },
  archiveCountText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  exportLink: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary},

  // Explore
  exploreBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: 100, paddingVertical: 14,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  exploreBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.primary},
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 14, color: '#e6e2d9', paddingVertical: 0},
});
