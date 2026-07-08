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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import {useUserStore} from '../../store/userStore';
import type {SessionsStackParamList, MainTabParamList} from '../../navigation/types';
import Icon from '../../components/ui/Icon';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SessionsStackParamList, 'BookingHistory'>,
  BottomTabScreenProps<MainTabParamList>
>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

// Tab filters from Stitch
const TABS = ['Upcoming', 'Active', 'Completed', 'Refunds'];

// Booking cards from Stitch
const BOOKINGS = [
  {
    id: 'ritz',
    title: 'The Ritz-Carlton',
    location: 'Kyoto, Japan',
    dateLabel: 'Oct 12',
    dateSub: '3 Nights',
    status: 'Confirmed',
    conciergeNote: 'Concierge arranging airport transfer.',
    conciergeIconName: 'room-service',
    iconName: 'hotel',
  },
  {
    id: 'bernardin',
    title: 'Le Bernardin',
    location: 'New York, USA',
    dateLabel: 'Nov 04',
    dateSub: '19:30',
    status: 'Confirmed',
    conciergeNote: 'Sommelier pairing requested.',
    conciergeIconName: 'wine-bar',
    iconName: 'restaurant',
  },
];

// Completed session cards
const PAST_SESSIONS = [
  {
    id: 'atelier',
    title: "L'Atelier Noir",
    location: 'Paris, France',
    dateLabel: 'Sep 18',
    dateSub: 'Completed',
    rating: '4.9',
    conciergeNote: 'Post-session reflection submitted.',
    conciergeIconName: 'check-circle',
    iconName: 'local-bar',
  },
  {
    id: 'sanctuary',
    title: 'The Sanctuary Estate',
    location: 'Tuscany, Italy',
    dateLabel: 'Aug 03',
    dateSub: 'Completed',
    rating: '5.0',
    conciergeNote: 'Memory journal saved to your profile.',
    conciergeIconName: 'auto-stories',
    iconName: 'spa',
  },
  {
    id: 'obsidian',
    title: 'Obsidian Lounge',
    location: 'London, UK',
    dateLabel: 'Jul 21',
    dateSub: 'Completed',
    rating: '4.8',
    conciergeNote: 'Gratuity processed. Thank you.',
    conciergeIconName: 'volunteer-activism',
    iconName: 'nightlife',
  },
];

export default function BookingHistoryScreen({navigation}: Props) {
  const profile = useUserStore(s => s.profile);
  const initial = (profile?.name ?? 'J').charAt(0).toUpperCase();
  const [activeTab, setTab] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Tab 0: Upcoming, Tab 1: Active, Tab 2: Completed, Tab 3: Refunds
  // Upcoming + Active both show BOOKINGS; Completed shows PAST_SESSIONS; Refunds shows past with dispute CTA
  const showBookings   = activeTab === 0 || activeTab === 1;
  const showCompleted  = activeTab === 2;
  const showRefunds    = activeTab === 3;

  const filterText = searchQuery.toLowerCase();
  const visibleBookings = showBookings
    ? BOOKINGS.filter(b => !filterText || b.title.toLowerCase().includes(filterText) || b.location.toLowerCase().includes(filterText))
    : [];
  const visibleCompleted = (showCompleted || showRefunds)
    ? PAST_SESSIONS.filter(p => !filterText || p.title.toLowerCase().includes(filterText) || p.location.toLowerCase().includes(filterText))
    : [];

  const openSession = (id: string) =>
    navigation.navigate('UpcomingSession', {sessionId: id});

  const openPastSession = (id: string) =>
    navigation.navigate('PastSessionDetail', {sessionId: `sess_${id}`});

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Standard Root Tab Header: Avatar | Sessions | Search + Filter ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAvatar}
          onPress={() => (navigation as any).navigate('ProfileNavigator')}
          activeOpacity={0.8}>
          <Text style={styles.headerAvatarText}>{initial}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleWrap} pointerEvents="none">
          <Text style={styles.headerTitle}>Sessions</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => setShowSearch(s => !s)} activeOpacity={0.7}>
            <Icon name="search" size={18} color={showSearch ? Colors.primary : Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => setTab(t => (t + 1) % TABS.length)} activeOpacity={0.7}>
            <Icon name="tune" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
        </View>
      </View>
      {showSearch && (
        <View style={styles.searchBar}>
          <Icon name="search" size={16} color={Colors.onSurfaceVariant} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sessions..."
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

        {/* ── Hero Header ── */}
        <View style={styles.heroHeader}>
          <View style={styles.heroBgTint} />
          <Text style={styles.heroTitle}>Hospitality{'\n'}Reservations</Text>
          <Text style={styles.heroSub}>
            Trusted booking management and concierge coordination.
          </Text>
        </View>

        {/* ── Overview Card ──
            SAFE RN PATTERN: outer shadow wrapper (elevation, no overflow) +
            inner clipped card (overflow:hidden, no elevation). */}
        <View style={styles.overviewCardShadow}>
        <View style={styles.overviewCard}>
          {/* Gold glow orb */}
          <View style={styles.overviewGlow} />

          {/* Trusted Active row */}
          <View style={styles.overviewTrustRow}>
            <View style={styles.overviewTrustBadge}>
              <Icon name="check" size={14} color={Colors.primary} />
            </View>
            <Text style={styles.overviewTrustText}>TRUSTED ACTIVE</Text>
          </View>

          {/* Stats grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>UPCOMING</Text>
              <Text style={styles.statValue}>03</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>COMPLETED</Text>
              <Text style={styles.statValue}>12</Text>
            </View>
            <View style={[styles.statItem, styles.statItemFull]}>
              <View>
                <Text style={styles.statLabel}>ACTIVE REFUNDS</Text>
                <Text style={styles.statValueGold}>1 Processing</Text>
              </View>
              <Icon name="credit-card" size={22} color={Colors.primary} />
            </View>
          </View>
        </View>
        </View>

        {/* ── Tab Navigation ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(i)}
              style={[styles.tab, i === activeTab && styles.tabActive]}>
              <Text style={[styles.tabText, i === activeTab && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Upcoming / Active Bookings ── */}
        {showBookings && (
          <>
            <Text style={styles.sectionTitle}>
              {activeTab === 1 ? 'Active Sessions' : 'Upcoming Journeys'}
            </Text>
            {visibleBookings.length === 0 ? (
              <Text style={styles.emptyText}>
                {filterText ? `No bookings matching "${searchQuery}"` : 'No upcoming bookings.'}
              </Text>
            ) : (
              visibleBookings.map(b => (
                <View key={b.id} style={styles.bookingCard}>
                  <View style={styles.bookingImg}>
                    <View style={{opacity: 0.25}}>
                      <Icon name={b.iconName} size={64} color={Colors.onSurface} />
                    </View>
                    <View style={styles.bookingOverlay} />
                    <View style={styles.bookingStatusBadge}>
                      <View style={styles.bookingStatusDot} />
                      <Text style={styles.bookingStatusText}>{b.status}</Text>
                    </View>
                  </View>
                  <View style={styles.bookingBody}>
                    <View style={styles.bookingMeta}>
                      <View>
                        <Text style={styles.bookingTitle}>{b.title}</Text>
                        <Text style={styles.bookingLocation}>{b.location}</Text>
                      </View>
                      <View style={styles.bookingDate}>
                        <Text style={styles.bookingDatePrimary}>{b.dateLabel}</Text>
                        <Text style={styles.bookingDateSub}>{b.dateSub}</Text>
                      </View>
                    </View>
                    <View style={styles.conciergeNote}>
                      <Icon name={b.conciergeIconName} size={14} color={Colors.primary} />
                      <Text style={styles.conciergeNoteText}>{b.conciergeNote}</Text>
                    </View>
                    <View style={styles.bookingActions}>
                      <TouchableOpacity
                        style={styles.actionGhost}
                        onPress={() =>
                          navigation.navigate('ModifyBooking', {sessionId: b.id})
                        }
                        activeOpacity={0.8}>
                        <Text style={styles.actionGhostText}>Modify</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionPrimary} onPress={() => openSession(b.id)} activeOpacity={0.8}>
                        <Text style={styles.actionPrimaryText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        {/* ── Completed / Refund Sessions ── */}
        {(showCompleted || showRefunds) && (
          <>
            <Text style={styles.sectionTitle}>
              {showRefunds ? 'Refund Eligible Sessions' : 'Past Sessions'}
            </Text>
            {visibleCompleted.length === 0 ? (
              <Text style={styles.emptyText}>
                {filterText ? `No sessions matching "${searchQuery}"` : 'No completed sessions yet.'}
              </Text>
            ) : (
              visibleCompleted.map(p => (
                <View key={p.id} style={styles.bookingCard}>
                  <View style={styles.bookingImg}>
                    <View style={{opacity: 0.25}}>
                      <Icon name={p.iconName} size={64} color={Colors.onSurface} />
                    </View>
                    <View style={styles.bookingOverlay} />
                    <View style={styles.bookingStatusBadge}>
                      <View style={styles.pastStatusDot} />
                      <Text style={styles.bookingStatusText}>COMPLETED</Text>
                    </View>
                    <View style={styles.ratingChip}>
                      <Icon name="star" size={10} color={Colors.primary} />
                      <Text style={styles.ratingChipText}>{p.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.bookingBody}>
                    <View style={styles.bookingMeta}>
                      <View>
                        <Text style={styles.bookingTitle}>{p.title}</Text>
                        <Text style={styles.bookingLocation}>{p.location}</Text>
                      </View>
                      <View style={styles.bookingDate}>
                        <Text style={styles.bookingDatePrimary}>{p.dateLabel}</Text>
                        <Text style={styles.bookingDateSub}>{p.dateSub}</Text>
                      </View>
                    </View>
                    <View style={styles.conciergeNote}>
                      <Icon name={p.conciergeIconName} size={14} color={Colors.primary} />
                      <Text style={styles.conciergeNoteText}>{p.conciergeNote}</Text>
                    </View>
                    <View style={styles.bookingActions}>
                      {showRefunds ? (
                        <TouchableOpacity
                          style={styles.actionGhost}
                          onPress={() => navigation.navigate('DisputeRefund', {bookingId: p.id})}
                          activeOpacity={0.8}>
                          <Text style={styles.actionGhostText}>File Refund</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.actionGhost}
                          onPress={() => (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'})}
                          activeOpacity={0.8}>
                          <Text style={styles.actionGhostText}>Book Again</Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        style={styles.actionPrimary}
                        onPress={() => openPastSession(p.id)}
                        activeOpacity={0.8}>
                        <Text style={styles.actionPrimaryText}>View Details</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </>
        )}

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#050816'},
  // ── Standard Root Tab Header ──
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: {fontSize: 13, fontWeight: '600', color: Colors.primary},
  headerTitleWrap: {position: 'absolute', left: 0, right: 0, alignItems: 'center'},
  headerTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, letterSpacing: 0.2},
  headerRight: {flexDirection: 'row', gap: 8},
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerIconText: {fontSize: 15},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingBottom: 20, gap: 16},

  // Hero header
  heroHeader: {paddingTop: 32, paddingBottom: 8, position: 'relative'},
  heroBgTint: {
    position: 'absolute',
    top: 0, left: -20, right: -20,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.onSurface,
    lineHeight: 40,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSub: {fontSize: 15, color: Colors.onSurfaceVariant, lineHeight: 22},

  // Overview card — safe shadow/clip split
  // Outer: elevation + shadow only — NO overflow:'hidden'
  overviewCardShadow: {
    borderRadius: 24,
    backgroundColor: 'rgba(11,13,26,0.4)',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 4,
  },
  // Inner: overflow:hidden + borderRadius — NO elevation
  overviewCard: {
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  overviewGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(242,202,80,0.1)',
  },
  overviewTrustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  overviewTrustBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 4,
  },
  overviewTrustIcon: {fontSize: 14, color: Colors.onPrimary, fontWeight: '700'},
  overviewTrustText: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsGrid: {gap: 16},
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statItemFull: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {fontSize: 28, fontWeight: '600', color: Colors.onSurface},
  statValueGold: {fontSize: 18, color: Colors.primary, fontWeight: '400'},
  walletIcon: {fontSize: 22, color: Colors.onSurfaceVariant},

  // Tabs
  tabsContent: {gap: 8, paddingVertical: 4},
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(11,13,26,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: {
    backgroundColor: 'rgba(242,202,80,0.1)',
    borderColor: 'rgba(242,202,80,0.2)',
  },
  tabText: {fontSize: 14, color: Colors.onSurfaceVariant, fontWeight: '400'},
  tabTextActive: {color: Colors.primary, fontWeight: '600'},

  // Section title
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 4,
  },

  // Booking card
  bookingCard: {
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  bookingImg: {
    height: 140,
    backgroundColor: Colors.surfaceContainerHigh,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingImgIcon: {fontSize: 56, opacity: 0.15},
  bookingOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '60%',
    backgroundColor: 'rgba(11,13,26,0.9)',
  },
  bookingStatusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  bookingStatusDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary},
  bookingStatusText: {fontSize: 10, letterSpacing: 1.5, color: Colors.onSurface, fontWeight: '600'},
  bookingBody: {padding: 20, gap: 14},
  bookingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookingTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, marginBottom: 3},
  bookingLocation: {fontSize: 14, color: Colors.onSurfaceVariant},
  bookingDate: {alignItems: 'flex-end'},
  bookingDatePrimary: {fontSize: 18, color: Colors.primary, fontWeight: '400'},
  bookingDateSub: {fontSize: 13, color: Colors.onSurfaceVariant},
  conciergeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  conciergeNoteIcon: {fontSize: 16, color: Colors.primary},
  conciergeNoteText: {fontSize: 13, color: Colors.onSurfaceVariant, flex: 1},
  bookingActions: {flexDirection: 'row', gap: 10},
  actionGhost: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(11,13,26,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  actionGhostText: {fontSize: 14, color: Colors.onSurface, fontWeight: '500'},
  actionPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  actionPrimaryText: {fontSize: 14, color: Colors.onPrimary, fontWeight: '600'},

  // Past sessions extras
  pastStatusDot: {width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success},
  ratingChip: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingChipText: {fontSize: 11, color: Colors.primary, fontWeight: '600'},
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 8, paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 14, color: '#e6e2d9', paddingVertical: 0},
  emptyText: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, textAlign: 'center',
    paddingVertical: 24,
  },
});
