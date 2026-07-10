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
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import {useUserStore} from '../../store/userStore';
import type {HomeStackParamList, MainTabParamList} from '../../navigation/types';
import Icon from '../../components/ui/Icon';
import {FeatureFlags} from '../../config/featureFlags';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'HomeDashboard'>,
  BottomTabScreenProps<MainTabParamList>
>;

const comingSoon = () =>
  Alert.alert('Coming Soon', 'This action will be connected in the next phase.');

// Quick actions from Stitch
const QUICK_ACTIONS = [
  {id: 'book',      icon: '📅', label: 'Book\nExperience',   iconName: 'event'},
  {id: 'concierge', icon: '🛎', label: 'Connect\nConcierge', iconName: 'room-service'},
  {id: 'safety',    icon: '🛡', label: 'Safety\nMonitor',    iconName: 'security', accent: true},
  {id: 'dining',    icon: '🍽', label: 'Luxury\nDining',     iconName: 'restaurant'},
];

// Today's itinerary items from Stitch
const ITINERARY = [
  {id: '1', time: '19:00 – 21:30', title: 'The Atrium Reserve', sub: "Chef's Tasting Menu", active: true},
  {id: '2', time: '22:00',         title: 'Concierge Check-in', sub: 'Transport secured',   active: false},
];

export default function HomeDashboardScreen({navigation}: Props) {
  const profile = useUserStore(s => s.profile);
  const displayName = profile?.name ?? 'Julian';
  const [itineraryExpanded, setItineraryExpanded] = useState(false);

  const goToCompanion = () =>
    navigation.navigate('CompanionProfile', {companionId: 'elena_001'});

  const goToExperienceDetail = () =>
    navigation.navigate('ExperienceDetail', {experienceId: 'exp_001'});

  const goToNotifications = () =>
    (navigation as any).navigate('ConciergeNavigator', {
      screen: 'Notifications',
    });

  const handleQuickAction = (id: string) => {
    if (id === 'book')      { navigation.navigate('Explore'); return; }
    if (id === 'concierge') {
      (navigation as any).navigate('ConciergeNavigator');
      return;
    }
    if (id === 'dining') {
      // Luxury Dining quick action -> Venue Browse
      navigation.navigate('VenueBrowse');
      return;
    }
    if (id === 'safety') {
      (navigation as any).navigate('SafetyNavigator', {screen: 'SafetyHub'});
      return;
    }
    comingSoon();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Standard Root Tab Header: Avatar | CoBuddy | Search + Bell ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAvatar} onPress={() => (navigation as any).navigate('ProfileNavigator')} activeOpacity={0.8}>
          <Text style={styles.headerAvatarText}>{displayName.charAt(0).toUpperCase()}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleWrap} pointerEvents="none">
          <Text style={styles.headerWordmark}>CoBuddy</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => (navigation as any).navigate('SearchNavigator')}
            activeOpacity={0.7}>
            <Icon name="search" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={goToNotifications} activeOpacity={0.7}>
            <Icon name="notifications" size={18} color={Colors.onSurface} />
            <View style={styles.headerNotifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Welcome ── */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeLabel}>Welcome Back,</Text>
          <Text style={styles.welcomeName}>{displayName}</Text>
          <Text style={styles.welcomeSub}>
            Your trusted hospitality ecosystem is prepared for today.
          </Text>
        </View>

        {/* ── Active Experience Card (Stitch: glass-card with bg image overlay) ── */}
        {/*
          SAFE RN PATTERN — Android Fabric fix:
          Outer heroCardShadow: elevation + shadow only, NO overflow:hidden
          Inner heroCard:       borderRadius + overflow:hidden, NO elevation
          Reason: overflow:'hidden' + elevation on the same View crashes the
          Fabric render thread on Android (no JS red screen, AVD closes).
        */}
        <View style={styles.heroCardShadow}>
          <View style={styles.heroCard}>
            {/* Ambient bg placeholder */}
            <View style={styles.heroCardBg}>
              <Text style={styles.heroCardBgIcon}>🌆</Text>
            </View>
            {/*
              heroCardOverlay: was height:'70%' — CRASH.
              Reason: percentage height on absolute child requires parent
              to have explicit height. heroCard only had minHeight.
              Fix: use top:60 (= ~30% from top of 220px card) so the
              overlay covers the bottom 70% with a fixed anchor instead.
            */}
            <View style={styles.heroCardOverlay} />

            {/* Badges row */}
            <View style={styles.heroBadgesRow}>
              <View style={styles.heroBadge}>
                <Icon name="check" size={11} color={Colors.primary} />
                <Text style={styles.heroBadgeText}>Concierge Synced</Text>
              </View>
              <View style={[styles.heroBadge, {marginLeft: 8}]}>
                <Icon name="spa" size={11} color={Colors.primary} />
                <Text style={styles.heroBadgeText}>Wellness Optimized</Text>
              </View>
            </View>

            {/* Bottom content */}
            <View style={styles.heroCardBottom}>
              <View style={styles.heroCardMeta}>
                <Text style={styles.heroCardOverline}>ACTIVE EXPERIENCES</Text>
                <Text style={styles.heroCardTitle}>Private Dining at The Atrium</Text>
                <Text style={styles.heroCardSub}>Starts in 2 hours • Verified Reservation</Text>
              </View>
              <TouchableOpacity style={styles.heroArrowBtn} onPress={goToExperienceDetail} activeOpacity={0.7}>
                <Icon name="arrow-forward" size={18} color={Colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Today's Itinerary Card ── */}
        <View style={styles.glassCard}>
          <View style={styles.itineraryHeader}>
            <Text style={styles.itineraryTitle}>Today's Itinerary</Text>
            <TouchableOpacity onPress={() => setItineraryExpanded((prev: boolean) => !prev)} activeOpacity={0.7}>
              <Text style={styles.itineraryMore}>{itineraryExpanded ? 'less' : '...'}</Text>
            </TouchableOpacity>
          </View>

          {/* Timeline */}
          <View style={styles.timeline}>
            <View style={styles.timelineLine} />
            {ITINERARY.map((item, idx) => (
              <View
                key={item.id}
                style={[styles.timelineItem, !item.active && styles.timelineItemDim]}>
                <View style={[styles.timelineDot, item.active && styles.timelineDotActive]}>
                  <View style={[styles.timelineDotInner, item.active && styles.timelineDotInnerActive]} />
                </View>
                <View style={styles.timelineMeta}>
                  <Text style={[styles.timelineTime, item.active && styles.timelineTimeActive]}>
                    {item.time}
                  </Text>
                  <Text style={styles.timelineItemTitle}>{item.title}</Text>
                  <Text style={styles.timelineItemSub}>{item.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.itineraryViewAll}
            onPress={() => setItineraryExpanded((prev: boolean) => !prev)}
            activeOpacity={0.7}>
            <Text style={styles.itineraryViewAllText}>
              {itineraryExpanded ? 'COLLAPSE' : 'VIEW FULL ITINERARY'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Actions Panel ── */}
        <View style={styles.quickPanel}>
          <Text style={styles.quickLabel}>QUICK ACCESS</Text>
          <View style={styles.quickRow}>
            {QUICK_ACTIONS.map(a => (
              <TouchableOpacity key={a.id} style={styles.quickItem} onPress={() => handleQuickAction(a.id)} activeOpacity={0.7}>
                <View style={[styles.quickIconWrap, a.accent && styles.quickIconWrapAccent]}>
                  <Icon name={a.iconName} size={22} color={a.accent ? Colors.error : Colors.primary} />
                </View>
                <Text style={styles.quickItemLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Explore Venues Section ── */}
        <View style={styles.glassCard}>
          <View style={styles.itineraryHeader}>
            <Text style={styles.itineraryTitle}>Trusted Venues</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('VenueBrowse')}
              activeOpacity={0.7}>
              <Text style={styles.itineraryMore}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={sectionStyles.entryCard}
            onPress={() => navigation.navigate('VenueBrowse')}
            activeOpacity={0.85}>
            <View style={sectionStyles.entryIconWrap}>
              <Icon name="domain" size={22} color={Colors.primary} />
            </View>
            <View style={sectionStyles.entryMeta}>
              <Text style={sectionStyles.entryTitle}>Browse Private Venues</Text>
              <Text style={sectionStyles.entrySub}>Concierge-verified dining, lounges and private spaces</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[sectionStyles.entryCard, {marginTop: 8}]}
            onPress={() => navigation.navigate('VenueDetail', {venueId: 'atelier'})}
            activeOpacity={0.85}>
            <View style={sectionStyles.entryIconWrap}>
              <Icon name="restaurant" size={22} color={Colors.primary} />
            </View>
            <View style={sectionStyles.entryMeta}>
              <Text style={sectionStyles.entryTitle}>The Atelier</Text>
              <Text style={sectionStyles.entrySub}>Mayfair's most intimate dining room</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── Exclusive Events Section ── */}
        <View style={styles.glassCard}>
          <View style={styles.itineraryHeader}>
            <Text style={styles.itineraryTitle}>Exclusive Events</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('EventsBrowse')}
              activeOpacity={0.7}>
              <Text style={styles.itineraryMore}>SEE ALL</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={sectionStyles.entryCard}
            onPress={() => navigation.navigate('EventsBrowse')}
            activeOpacity={0.85}>
            <View style={sectionStyles.entryIconWrap}>
              <Icon name="event" size={22} color={Colors.primary} />
            </View>
            <View style={sectionStyles.entryMeta}>
              <Text style={sectionStyles.entryTitle}>Browse Events</Text>
              <Text style={sectionStyles.entrySub}>Private galas, curated evenings and VIP experiences</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[sectionStyles.entryCard, {marginTop: 8}]}
            onPress={() => navigation.navigate('EventDetail', {eventId: 'atrium_gala'})}
            activeOpacity={0.85}>
            <View style={sectionStyles.entryIconWrap}>
              <Icon name="star" size={22} color={Colors.primary} />
            </View>
            <View style={sectionStyles.entryMeta}>
              <Text style={sectionStyles.entryTitle}>The Atrium Gala</Text>
              <Text style={sectionStyles.entrySub}>Tonight 20:00 - Members Only</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Dining Discovery Section */}
        <View style={styles.glassCard}>
          <View style={styles.itineraryHeader}>
            <Text style={styles.itineraryTitle}>Dining Discovery</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('DiningDiscovery')}
              activeOpacity={0.7}>
              <Text style={styles.itineraryMore}>EXPLORE</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={sectionStyles.entryCard}
            onPress={() => navigation.navigate('DiningDiscovery')}
            activeOpacity={0.85}>
            <View style={sectionStyles.entryIconWrap}>
              <Icon name="local-dining" size={22} color={Colors.primary} />
            </View>
            <View style={sectionStyles.entryMeta}>
              <Text style={sectionStyles.entryTitle}>Browse Curated Dining</Text>
              <Text style={sectionStyles.entrySub}>Private tables, chef experiences and exclusive reservations</Text>
            </View>
            <Icon name="chevron-right" size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Travel & Stays Section */}
        {FeatureFlags.VIP_EVENTS && (
          <>
            <View style={styles.glassCard}>
              <View style={styles.itineraryHeader}>
                <Text style={styles.itineraryTitle}>Travel and Stays</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('TravelStays')}
                  activeOpacity={0.7}>
                  <Text style={styles.itineraryMore}>EXPLORE</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={sectionStyles.entryCard}
                onPress={() => navigation.navigate('TravelStays')}
                activeOpacity={0.85}>
                <View style={sectionStyles.entryIconWrap}>
                  <Icon name="flight" size={22} color={Colors.primary} />
                </View>
                <View style={sectionStyles.entryMeta}>
                  <Text style={sectionStyles.entryTitle}>Browse Retreats and Stays</Text>
                  <Text style={sectionStyles.entrySub}>Private villas, luxury suites and bespoke travel experiences</Text>
                </View>
                <Icon name="chevron-right" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Wellness Experiences Section */}
            <View style={styles.glassCard}>
              <View style={styles.itineraryHeader}>
                <Text style={styles.itineraryTitle}>Wellness</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('WellnessExperiences')}
                  activeOpacity={0.7}>
                  <Text style={styles.itineraryMore}>EXPLORE</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={sectionStyles.entryCard}
                onPress={() => navigation.navigate('WellnessExperiences')}
                activeOpacity={0.85}>
                <View style={sectionStyles.entryIconWrap}>
                  <Icon name="spa" size={22} color={Colors.primary} />
                </View>
                <View style={sectionStyles.entryMeta}>
                  <Text style={sectionStyles.entryTitle}>Browse Wellness Experiences</Text>
                  <Text style={sectionStyles.entrySub}>Holistic treatments, performance coaching and restorative rituals</Text>
                </View>
                <Icon name="chevron-right" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        )}

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#050816'},

  // Top bar
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
  // Absolute center — pointerEvents:none on wrapper so touches pass through
  headerTitleWrap: {position: 'absolute', left: 0, right: 0, alignItems: 'center'},
  // Home uses branded wordmark style (gold, slightly bolder)
  headerWordmark: {fontSize: 20, fontWeight: '700', color: Colors.primary, letterSpacing: -0.5},
  headerRight: {flexDirection: 'row', gap: 8},
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerIconText: {fontSize: 15},
  headerNotifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: Colors.error,
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, gap: 16},

  // Welcome
  welcomeSection: {marginBottom: 4},
  welcomeLabel: {fontSize: 18, color: Colors.onSurface, fontWeight: '400'},
  welcomeName: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: Colors.primary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  welcomeSub: {fontSize: 16, color: Colors.onSurfaceVariant, lineHeight: 24},

  // Hero active experience card — safe Android Fabric split pattern
  // Outer: shadow/elevation only, no overflow (avoids Fabric render crash)
  heroCardShadow: {
    borderRadius: 24,
    backgroundColor: 'rgba(11,13,26,0.4)', // required for Android shadow to render
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.05,
    shadowRadius: 40,
    elevation: 6,
  },
  // Inner: overflow:hidden + borderRadius only, no elevation
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 220,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
    padding: 20,
    justifyContent: 'space-between',
  },
  heroCardBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.2,
  },
  heroCardBgIcon: {fontSize: 100},
  heroCardOverlay: {
    // Fix: was height:'70%' — crashes Fabric when parent has minHeight not height.
    // Replace with top:60 pixel anchor (covers bottom ~73% of 220px card).
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11,13,26,0.8)',
  },
  heroBadgesRow: {
    flexDirection: 'row',
    zIndex: 1,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heroBadgeIcon: {fontSize: 11, color: Colors.primary},
  heroBadgeText: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.primary,
    fontWeight: '600',
  },
  heroCardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 1,
    marginTop: 32,
  },
  heroCardMeta: {flex: 1},
  heroCardOverline: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 4,
  },
  heroCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 4,
    lineHeight: 26,
  },
  heroCardSub: {fontSize: 14, color: Colors.onSurfaceVariant},
  heroArrowBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginLeft: 12,
  },
  heroArrowIcon: {fontSize: 18, color: Colors.onPrimary, fontWeight: '700'},

  // Itinerary card
  glassCard: {
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  itineraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  itineraryTitle: {fontSize: 20, fontWeight: '600', color: Colors.onSurface},
  itineraryMore: {fontSize: 18, color: Colors.primary},
  timeline: {position: 'relative', gap: 20},
  timelineLine: {
    position: 'absolute',
    left: 11,
    top: 8,
    bottom: 8,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timelineItem: {flexDirection: 'row', alignItems: 'flex-start', gap: 16},
  timelineItemDim: {opacity: 0.5},
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  timelineDotActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.1)',
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.onSurfaceVariant,
  },
  timelineDotInnerActive: {backgroundColor: Colors.primary},
  timelineMeta: {flex: 1},
  timelineTime: {
    fontSize: 11,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineTimeActive: {color: Colors.primary},
  timelineItemTitle: {fontSize: 15, fontWeight: '600', color: Colors.onSurface, marginBottom: 1},
  timelineItemSub: {fontSize: 13, color: Colors.onSurfaceVariant},
  itineraryViewAll: {alignItems: 'center', paddingTop: 16},
  itineraryViewAllText: {
    fontSize: 11,
    letterSpacing: 2.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },

  // Quick actions
  quickPanel: {
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 20,
  },
  quickLabel: {
    fontSize: 10,
    letterSpacing: 2.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 16,
  },
  quickRow: {flexDirection: 'row', justifyContent: 'space-between'},
  quickItem: {alignItems: 'center', flex: 1, gap: 6},
  quickIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconWrapAccent: {
    borderColor: 'rgba(255,180,171,0.2)',
    backgroundColor: 'rgba(255,180,171,0.05)',
  },
  quickIcon: {fontSize: 20},
  quickItemLabel: {
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 14,
  },
});




// ── Section entry card styles ─────────────────────────────────────────────────
const sectionStyles = StyleSheet.create({
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 12,
  },
  entryIconWrap: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  entryMeta: {flex: 1, gap: 3},
  entryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.onSurface,
  },
  entrySub: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 16,
  },
});



