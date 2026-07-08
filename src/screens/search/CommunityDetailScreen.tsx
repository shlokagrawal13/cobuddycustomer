import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SearchStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SearchStackParamList, 'CommunityDetail'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';


const COMMUNITY_DATA: Record<string, {
  name: string; description: string; members: string; events: number; since: string;
  category: string; iconName: string; activities: Array<{icon: string; title: string; time: string}>;
  upcomingEvents: Array<{title: string; date: string}>;
}> = {
  dining: {
    name: 'Executive Dining Club',
    description: 'A curated circle for discerning food enthusiasts. Monthly private dining events, exclusive chef collaborations, and wine masterclasses — by invitation only.',
    members: '487', events: 24, since: '2020',
    category: 'Gastronomy', iconName: 'restaurant',
    activities: [
      {icon: 'restaurant', title: 'Private Chef Dinner — Le Bernardin', time: '2 days ago'},
      {icon: 'wine-bar',   title: 'Bordeaux Grand Cru Tasting',          time: '1 week ago'},
      {icon: 'group',      title: 'New member: Victoria S. joined',      time: '2 weeks ago'},
    ],
    upcomingEvents: [
      {title: 'Sommelier Masterclass', date: 'Dec 05'},
      {title: "Chef's Table: Christmas Edition", date: 'Dec 20'},
    ],
  },
  wellness: {
    name: 'Wellness Collective',
    description: 'A sanctuary of shared wellbeing. Group meditation retreats, private gym sessions with world-class coaches, and holistic wellness workshops for members seeking balance.',
    members: '612', events: 36, since: '2021',
    category: 'Wellbeing', iconName: 'spa',
    activities: [
      {icon: 'self-improvement', title: 'Sunrise Yoga Retreat — Cotswolds', time: '3 days ago'},
      {icon: 'fitness-center',   title: 'Private Training Session closed',  time: '5 days ago'},
      {icon: 'group',            title: 'New member: Alexander H. joined', time: '1 week ago'},
    ],
    upcomingEvents: [
      {title: 'Sunrise Wellness Ritual', date: 'Dec 12'},
      {title: 'Mindfulness Immersion Day', date: 'Jan 08'},
    ],
  },
  voyager: {
    name: 'The Voyager Circle',
    description: 'Travel beyond the brochure. Exclusive private jet access, vetted luxury resorts, off-the-map experiences, and a community of seasoned global explorers.',
    members: '334', events: 18, since: '2020',
    category: 'Travel', iconName: 'flight',
    activities: [
      {icon: 'flight',    title: 'Group charter — Maldives retreat',  time: '1 week ago'},
      {icon: 'hotel',     title: 'Villa Bali arranged for 4 members', time: '2 weeks ago'},
      {icon: 'group',     title: 'New member: Cassandra L. joined',   time: '3 weeks ago'},
    ],
    upcomingEvents: [
      {title: 'Japan Cherry Blossom Journey', date: 'Mar 22'},
      {title: 'Patagonia Wilderness Retreat', date: 'Apr 14'},
    ],
  },
  arts: {
    name: 'Arts Patronage Network',
    description: 'Connect with fellow patrons of culture. Private gallery openings, artist studio visits, auction previews, and meaningful conversations around contemporary art.',
    members: '218', events: 30, since: '2022',
    category: 'Culture', iconName: 'palette',
    activities: [
      {icon: 'palette',         title: 'Frieze Preview — VIP opening',    time: '4 days ago'},
      {icon: 'collections',     title: 'Studio visit: Aiko Tanaka',       time: '2 weeks ago'},
      {icon: 'group',           title: 'New member: Frederick A. joined', time: '3 weeks ago'},
    ],
    upcomingEvents: [
      {title: 'Private Gallery Preview', date: 'Dec 08'},
      {title: "Artist Q&A: Jemima Cruz", date: 'Jan 15'},
    ],
  },
};

export default function CommunityDetailScreen({navigation, route}: Props) {
  const {communityId} = route.params;
  const community = COMMUNITY_DATA[communityId] ?? COMMUNITY_DATA.dining;
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleMembershipRequest = () => {
    if (requestSubmitted) {
      Alert.alert(
        'Request Pending',
        'Your membership request is under review. Your concierge will contact you within 72 hours.',
        [{text: 'OK'}],
      );
    } else {
      setRequestSubmitted(true);
      Alert.alert(
        'Request Submitted',
        'Your membership request has been sent to the ' + community.name + ' circle. You will hear back within 72 hours.',
        [{text: 'OK'}],
      );
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{community.name}</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert('Community Options', 'Share this community or report an issue via your concierge.')} activeOpacity={0.7}>
          <Icon name="more-horiz" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroIconWrap}>
            <Icon name={community.iconName} size={52} color={Colors.primary} />
            <View style={styles.heroGlow} />
          </View>
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Icon name="verified" size={10} color={Colors.primary} />
              <Text style={styles.heroBadgeText}>PRIVATE CIRCLE</Text>
            </View>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{community.category}</Text>
            </View>
          </View>
          <Text style={styles.heroName}>{community.name}</Text>
          <Text style={styles.heroDesc}>{community.description}</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            {value: community.members, label: 'Members', icon: 'group'},
            {value: String(community.events), label: 'Events', icon: 'event'},
            {value: community.since, label: 'Since', icon: 'schedule'},
          ].map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Icon name={stat.icon} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Recent activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {community.activities.map((act, i) => (
              <View key={act.title} style={[styles.activityRow, i < community.activities.length - 1 && styles.activityRowBorder]}>
                <View style={styles.activityIconWrap}>
                  <Icon name={act.icon} size={16} color={Colors.onSurfaceVariant} />
                </View>
                <View style={styles.activityMeta}>
                  <Text style={styles.activityTitle} numberOfLines={1}>{act.title}</Text>
                  <Text style={styles.activityTime}>{act.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {community.upcomingEvents.map((event, i) => (
            <View key={event.title} style={styles.upcomingEventRow}>
              <View style={styles.upcomingEventDot} />
              <View style={styles.upcomingEventMeta}>
                <Text style={styles.upcomingEventTitle}>{event.title}</Text>
              </View>
              <View style={styles.upcomingEventDate}>
                <Text style={styles.upcomingEventDateText}>{event.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Concierge note */}
        <View style={styles.conciergeNote}>
          <View style={styles.conciergeNoteIcon}>
            <Icon name="support-agent" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.conciergeNoteText}>
            Membership is curated by your concierge team. All applications are reviewed within 72 hours.
          </Text>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaPrimary, requestSubmitted && {opacity: 0.7}]}
          onPress={handleMembershipRequest}
          activeOpacity={0.88}>
          <Icon name={requestSubmitted ? 'check-circle' : 'person-add'} size={18} color={Colors.onPrimary} />
          <Text style={styles.ctaPrimaryText}>
            {requestSubmitted ? 'Request Submitted' : 'Request Membership'}
          </Text>
        </TouchableOpacity>

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.92)',
  },
  headerBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface,
  },
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, gap: 16},
  // Hero card
  heroCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: GOLD_BORDER,
    padding: 24, gap: 12, alignItems: 'center',
    overflow: 'hidden',
  },
  heroIconWrap: {position: 'relative', alignItems: 'center', justifyContent: 'center', marginBottom: 4},
  heroGlow: {
    position: 'absolute', width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(242,202,80,0.08)',
  },
  heroBadgeRow: {flexDirection: 'row', gap: 8},
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(242,202,80,0.10)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: GOLD_BORDER,
  },
  heroBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.5, color: Colors.primary},
  categoryBadge: {
    backgroundColor: Colors.surfaceContainerHigh, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: CARD_BORDER,
  },
  categoryBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.5, color: Colors.onSurfaceVariant},
  heroName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface, textAlign: 'center'},
  heroDesc: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20, textAlign: 'center'},
  // Stats
  statsRow: {flexDirection: 'row', gap: 10},
  statCard: {
    flex: 1, backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 14, alignItems: 'center', gap: 6,
  },
  statIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  statValue: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  statLabel: {fontFamily: 'Inter-Regular', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 0.5},
  // Section
  section: {gap: 10},
  sectionTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  // Activity
  activityCard: {
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    paddingVertical: 4,
  },
  activityRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  activityRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  activityIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  activityMeta: {flex: 1},
  activityTitle: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  activityTime: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 3},
  // Upcoming events
  upcomingEventRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 14,
    borderWidth: 1, borderColor: CARD_BORDER,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  upcomingEventDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6, shadowRadius: 6,
  },
  upcomingEventMeta: {flex: 1},
  upcomingEventTitle: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  upcomingEventDate: {
    backgroundColor: 'rgba(242,202,80,0.10)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: GOLD_BORDER,
  },
  upcomingEventDateText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary},
  // Concierge note
  conciergeNote: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: 'rgba(242,202,80,0.06)', borderRadius: 14,
    borderWidth: 1, borderColor: GOLD_BORDER, padding: 14,
  },
  conciergeNoteIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.12)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  conciergeNoteText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  // CTA
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 16, backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaPrimaryText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary},
});
