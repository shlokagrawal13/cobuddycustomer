import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch ref: complete_session_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'CompleteSession'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';
const SUCCESS_BG  = 'rgba(109,217,140,0.10)';
const SUCCESS_BD  = 'rgba(109,217,140,0.28)';

const SAFETY_CLOSED = [
  'Trusted contact protection ended',
  'Live monitoring completed successfully',
  'Session securely archived',
];

const STATS = [
  {value: '1h 45m', label: 'TOTAL DURATION'},
  {value: '100%',   label: 'TRUST SCORE'},
  {value: 'Premium',label: 'SESSION QUALITY'},
];

export default function CompleteSessionScreen({navigation, route}: Props) {
  const {sessionId} = route.params;

  const handleReview = () => {
    navigation.navigate('PostSessionFeedback', {sessionId});
  };

  const handleExplore = () => {
    (navigation as any).navigate('HomeNavigator', {screen: 'CompanionBrowse'});
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Logo label */}
        <SafeAreaView edges={['top']} style={styles.topBar}>
          <Text style={styles.logoText}>COBUDDY</Text>
        </SafeAreaView>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.heroIconWrap}>
            <Icon name="check-circle" size={56} color={Colors.success} />
          </View>
          <Text style={styles.heroTitle}>Experience Successfully{'\n'}Completed</Text>
          <View style={styles.heroBadge}>
            <Icon name="verified" size={14} color={Colors.success} />
            <Text style={styles.heroBadgeText}>Trusted Experience Completed</Text>
          </View>
        </View>

        {/* Session Summary */}
        <View style={[styles.card, styles.summaryCard]}>
          <View style={styles.summaryRow}>
            <Icon name="verified" size={16} color={Colors.primary} />
            <Text style={styles.summaryTitle}>Curated Coffee Conversations</Text>
          </View>
          <Text style={styles.companionLine}>with Elena V.</Text>
          <Text style={styles.venueLine}>The Roastery, Soho</Text>
          <View style={styles.summaryBadges}>
            <View style={styles.summaryBadge}>
              <Icon name="schedule" size={12} color={Colors.onSurfaceVariant} />
              <Text style={styles.summaryBadgeText}>DURATION: 01:45:00</Text>
            </View>
            <View style={[styles.summaryBadge, styles.summaryBadgeSuccess]}>
              <Icon name="shield" size={12} color={Colors.success} />
              <Text style={[styles.summaryBadgeText, {color: Colors.success}]}>VENUE VERIFIED</Text>
            </View>
          </View>
        </View>

        {/* Safety Closed */}
        <View style={[styles.card, styles.safetyCard]}>
          <View style={styles.safetyHeader}>
            <Icon name="gpp-good" size={20} color={Colors.success} />
            <Text style={styles.safetyTitle}>Safety Systems Closed</Text>
          </View>
          {SAFETY_CLOSED.map(item => (
            <View key={item} style={styles.safetyItem}>
              <Icon name="check" size={14} color={Colors.success} />
              <Text style={styles.safetyItemText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View
              key={s.label}
              style={[
                styles.statItem,
                i < STATS.length - 1 && styles.statItemBorder,
              ]}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        <View style={{height: 24}} />
      </ScrollView>

      {/* Bottom CTAs */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.reviewBtn} onPress={handleReview} activeOpacity={0.88}>
          <Icon name="favorite" size={16} color={Colors.onPrimary} />
          <Text style={styles.reviewBtnText}>Leave Review</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.exploreBtn} onPress={handleExplore} activeOpacity={0.8}>
          <Text style={styles.exploreBtnText}>Explore More Experiences</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, gap: 16, paddingBottom: 16},

  topBar: {alignItems: 'center', paddingTop: 16},
  logoText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.onSurfaceVariant, letterSpacing: 3},

  // Hero
  hero: {alignItems: 'center', paddingVertical: 28, gap: 14},
  heroIconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: SUCCESS_BG, borderWidth: 1, borderColor: SUCCESS_BD,
    alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: Colors.onSurface,
    textAlign: 'center', lineHeight: 34,
  },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: SUCCESS_BG, borderRadius: 100,
    paddingHorizontal: 14, paddingVertical: 7,
    borderWidth: 1, borderColor: SUCCESS_BD,
  },
  heroBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.success},

  // Summary
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 18, gap: 10,
  },
  summaryCard: {borderColor: GOLD_BORDER},
  summaryRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  summaryTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, flex: 1},
  companionLine: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  venueLine: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  summaryBadges: {flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 4},
  summaryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  summaryBadgeSuccess: {backgroundColor: SUCCESS_BG, borderColor: SUCCESS_BD},
  summaryBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 0.5},

  // Safety
  safetyCard: {backgroundColor: 'rgba(109,217,140,0.04)', borderColor: 'rgba(109,217,140,0.20)'},
  safetyHeader: {flexDirection: 'row', alignItems: 'center', gap: 10},
  safetyTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.success},
  safetyItem: {flexDirection: 'row', alignItems: 'center', gap: 10},
  safetyItemText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},

  // Stats
  statsRow: {
    flexDirection: 'row',
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER,
    overflow: 'hidden',
  },
  statItem: {flex: 1, alignItems: 'center', paddingVertical: 18, gap: 4},
  statItemBorder: {borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: CARD_BORDER},
  statValue: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.primary},
  statLabel: {fontFamily: 'Inter-Regular', fontSize: 9, color: Colors.onSurfaceVariant, letterSpacing: 1, textAlign: 'center'},

  // Bottom
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.97)',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 10,
  },
  reviewBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 15,
  },
  reviewBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
  exploreBtn: {
    alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10,
  },
  exploreBtnText: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
});
