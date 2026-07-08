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

type Props = NativeStackScreenProps<SearchStackParamList, 'CommunityBrowse'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';


const FEATURED_COMMUNITY = {
  name: 'The Atrium Society',
  members: '1,240',
  description: 'An exclusive circle for distinguished patrons of arts, culture, and culinary excellence. Membership by nomination.',
  badge: 'CURATED CIRCLE',
  iconName: 'workspace-premium',
  since: '2019',
};

const COMMUNITIES = [
  {id: 'dining', name: 'Executive Dining Club',    members: '487',  category: 'Gastronomy', iconName: 'restaurant'},
  {id: 'wellness', name: 'Wellness Collective',    members: '612',  category: 'Wellbeing',  iconName: 'spa'},
  {id: 'voyager', name: 'The Voyager Circle',      members: '334',  category: 'Travel',     iconName: 'flight'},
  {id: 'arts', name: 'Arts Patronage Network',     members: '218',  category: 'Culture',    iconName: 'palette'},
];

const JOIN_STEPS = [
  {icon: 'person-add', step: '01', label: 'Express Interest', sub: 'Submit your profile for review'},
  {icon: 'support-agent', step: '02', label: 'Concierge Review', sub: 'Your concierge presents your application'},
  {icon: 'verified', step: '03', label: 'Member Access', sub: 'Exclusive events and privileges unlocked'},
];

export default function CommunityBrowseScreen({navigation}: Props) {
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const handleMembershipRequest = () => {
    if (requestSubmitted) {
      Alert.alert(
        'Request Pending',
        'Your application to The Atrium Society is under review. You will be contacted within 72 hours.',
        [{text: 'OK'}],
      );
    } else {
      setRequestSubmitted(true);
      Alert.alert(
        'Request Submitted',
        'Your application to The Atrium Society has been received. Your concierge will be in touch within 72 hours.',
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
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={() => Alert.alert('Search Communities', 'Browse and search all available circles from this screen.')} activeOpacity={0.7}>
          <Icon name="search" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroSection}>
          <Text style={styles.heroOverline}>PRIVATE CIRCLES</Text>
          <Text style={styles.heroTitle}>Curated{'\n'}Communities</Text>
          <Text style={styles.heroSub}>
            Join exclusive circles of like-minded individuals — curated by your concierge team.
          </Text>
        </View>

        {/* Featured community */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredCardImgWrap}>
            <Icon name={FEATURED_COMMUNITY.iconName} size={60} color={Colors.primary} />
            <View style={styles.featuredCardGlow} />
          </View>
          <View style={styles.featuredCardBody}>
            <View style={styles.featuredBadgeRow}>
              <View style={styles.featuredBadge}>
                <Icon name="verified" size={10} color={Colors.primary} />
                <Text style={styles.featuredBadgeText}>{FEATURED_COMMUNITY.badge}</Text>
              </View>
            </View>
            <Text style={styles.featuredName}>{FEATURED_COMMUNITY.name}</Text>
            <Text style={styles.featuredDesc}>{FEATURED_COMMUNITY.description}</Text>
            <View style={styles.featuredStats}>
              <View style={styles.featuredStatItem}>
                <Text style={styles.featuredStatValue}>{FEATURED_COMMUNITY.members}</Text>
                <Text style={styles.featuredStatLabel}>Members</Text>
              </View>
              <View style={styles.featuredStatDivider} />
              <View style={styles.featuredStatItem}>
                <Text style={styles.featuredStatValue}>Since {FEATURED_COMMUNITY.since}</Text>
                <Text style={styles.featuredStatLabel}>Established</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.featuredCTA}
              onPress={handleMembershipRequest}
              activeOpacity={0.88}>
              <Text style={styles.featuredCTAText}>
                {requestSubmitted ? 'Request Submitted' : 'Request Membership'}
              </Text>
              <Icon name={requestSubmitted ? 'check-circle' : 'arrow-forward'} size={14} color={Colors.onPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Grid */}
        <Text style={styles.sectionLabel}>EXPLORE CIRCLES</Text>

        <View style={styles.grid}>
          {COMMUNITIES.map(c => (
            <TouchableOpacity
              key={c.id}
              style={styles.gridCard}
              onPress={() => navigation.navigate('CommunityDetail', {communityId: c.id})}
              activeOpacity={0.85}>
              <View style={styles.gridIconWrap}>
                <Icon name={c.iconName} size={26} color={Colors.primary} />
              </View>
              <Text style={styles.gridName}>{c.name}</Text>
              <View style={styles.gridMetaRow}>
                <Icon name="group" size={11} color={Colors.onSurfaceVariant} />
                <Text style={styles.gridMembers}>{c.members}</Text>
              </View>
              <View style={styles.gridCategory}>
                <Text style={styles.gridCategoryText}>{c.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Join process */}
        <View style={styles.joinCard}>
          <Text style={styles.joinCardTitle}>How It Works</Text>
          {JOIN_STEPS.map((step, i) => (
            <View key={step.step} style={[styles.joinStep, i < JOIN_STEPS.length - 1 && styles.joinStepBorder]}>
              <View style={styles.joinStepNum}>
                <Text style={styles.joinStepNumText}>{step.step}</Text>
              </View>
              <View style={styles.joinStepIconWrap}>
                <Icon name={step.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.joinStepMeta}>
                <Text style={styles.joinStepLabel}>{step.label}</Text>
                <Text style={styles.joinStepSub}>{step.sub}</Text>
              </View>
            </View>
          ))}
        </View>

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
  scrollContent: {paddingHorizontal: 20, paddingTop: 24, gap: 20},
  // Hero
  heroSection: {gap: 8},
  heroOverline: {fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 2.5, color: Colors.onSurfaceVariant},
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 36, color: Colors.onSurface, lineHeight: 44, letterSpacing: -0.3},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 21},
  // Featured
  featuredCard: {
    backgroundColor: CARD_BG, borderRadius: 24,
    borderWidth: 1, borderColor: GOLD_BORDER, overflow: 'hidden',
  },
  featuredCardImgWrap: {
    height: 140, backgroundColor: 'rgba(242,202,80,0.06)',
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  featuredCardGlow: {
    position: 'absolute', width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(242,202,80,0.08)', top: -20, left: '50%',
  },
  featuredCardBody: {padding: 20, gap: 12},
  featuredBadgeRow: {flexDirection: 'row'},
  featuredBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(242,202,80,0.10)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: GOLD_BORDER,
  },
  featuredBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.5, color: Colors.primary},
  featuredName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface},
  featuredDesc: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},
  featuredStats: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 12, gap: 16,
  },
  featuredStatItem: {flex: 1, alignItems: 'center', gap: 3},
  featuredStatValue: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  featuredStatLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  featuredStatDivider: {width: 1, height: 32, backgroundColor: CARD_BORDER},
  featuredCTA: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 14, borderRadius: 14, backgroundColor: Colors.primary,
  },
  featuredCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary},
  // Section label
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 2, color: Colors.onSurfaceVariant},
  // Grid
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 12},
  gridCard: {
    width: '47%', backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 10, alignItems: 'flex-start',
  },
  gridIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  gridName: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface, lineHeight: 18},
  gridMetaRow: {flexDirection: 'row', alignItems: 'center', gap: 4},
  gridMembers: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  gridCategory: {
    backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: CARD_BORDER,
  },
  gridCategoryText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 1},
  // Join process
  joinCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 20, gap: 4,
  },
  joinCardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, marginBottom: 12},
  joinStep: {flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12},
  joinStepBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  joinStepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  joinStepNumText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary},
  joinStepIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  joinStepMeta: {flex: 1},
  joinStepLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  joinStepSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 3},
});
