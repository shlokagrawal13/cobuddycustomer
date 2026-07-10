import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {FeatureFlags} from '../../config/featureFlags';

// Stitch: member_perks_loyalty_dashboard + loyalty_rewards_benefits_dashboard + reward_redemption_screen
// "Loyalty Ecosystem" | "Your Premium Member Rewards"
// "Unlock elevated experiences, concierge perks, and trusted member benefits."
// verified "Gold Premium Member" | "Trust Level: Elite"
// 2,400 Reward Points | 600 points to Black Elite Concierge
// event_available 12 Sessions | group_add Referrals | shield High Safety
// Curated Rewards rows: local_activity Experience Credits | support_agent Concierge Priority Pass
// Tier Roadmap: Silver Member 1,000pts | Gold Premium (current) | Black Elite 3,000pts
// Premium Benefits: book_online Priority Booking | health_and_safety Enhanced Safety | restaurant Verified Venues

type Props = NativeStackScreenProps<ProfileStackParamList, 'RewardsDashboard'>;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.22)';

const CURATED_REWARDS = [
  {id:'exp',  icon:'local-activity', pts:600,   label:'Experience Credits',        sub:'600 credits for upcoming sessions.',          unlocked:true},
  {id:'con',  icon:'support-agent',  pts:0,     label:'Concierge Priority Pass',   sub:'Instant chat response.',                      unlocked:true},
  {id:'ven',  icon:'meeting-room',   pts:3000,  label:'Premium Venue Access',      sub:'Access to exclusive locations.',               unlocked:false},
  {id:'vip',  icon:'celebration',    pts:0,     label:'VIP Event Invitation',      sub:'Exclusive black-tie gatherings.',             unlocked:false, blackTier:true},
];

const BENEFITS = [
  {icon:'book-online',      label:'Priority Booking',    sub:'Skip the waitlist for high-demand companions.'},
  {icon:'health-and-safety',label:'Enhanced Safety',     sub:'Advanced identity verification protocols.'},
  {icon:'restaurant',       label:'Verified Venues',     sub:'Access to our curated list of safe spaces.'},
];

const TIER_STEPS = [
  {label:'Silver Member',  pts:'1,000 Points',  sub:'Achieved',      done:true,  current:false},
  {label:'Gold Premium',   pts:'Current Status',sub:'Your tier',     done:true,  current:true},
  {label:'Black Elite',    pts:'3,000 Points',  sub:'Locked',        done:false, current:false},
];

const HISTORY_ITEMS = [
  {icon:'stars',         label:'Session Completed',    pts:'+120',  date:'Nov 12',  sign:true},
  {icon:'person-add',    label:'Referral Bonus',       pts:'+500',  date:'Nov 8',   sign:true},
  {icon:'local-activity',label:'Experience Credits',   pts:'-600',  date:'Oct 30',  sign:false},
  {icon:'celebration',   label:'Tier Bonus',           pts:'+200',  date:'Oct 25',  sign:true},
];

export default function RewardsDashboardScreen({navigation}: Props) {
  return (
    <SafeAreaView style={styles.root} edges={['top','bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header - Stitch: arrow_back | "Loyalty Ecosystem" | history icon */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{top:10,bottom:10,left:10,right:10}} activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loyalty Ecosystem</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('RewardRedemption', {rewardId: 'history'})} activeOpacity={0.7}>
          <Icon name="history" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero - Stitch: "Your Premium Member Rewards" | verified Gold Premium Member | 2,400 points | stats */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <View style={styles.heroBadge}>
            <Icon name="verified" size={13} color={Colors.primary} />
            <Text style={styles.heroBadgeText}>GOLD PREMIUM MEMBER</Text>
          </View>
          <Text style={styles.heroHeading}>Your Premium Member Rewards</Text>
          <Text style={styles.heroSub}>Unlock elevated experiences, concierge perks, and trusted member benefits.</Text>
          <View style={styles.pointsWrap}>
            <Text style={styles.pointsNumber}>2,400</Text>
            <Text style={styles.pointsLabel}>Reward Points</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {width:'80%'}]} />
          </View>
          <Text style={styles.progressNote}>600 points to Black Elite Concierge</Text>
          {/* Stats row - Stitch: event_available 12 Sessions | group_add Referrals | shield High Safety */}
          <View style={styles.statsRow}>
            <View style={[styles.statCell, styles.statCellBorder]}>
              <Icon name="event-available" size={18} color={Colors.primary} />
              <Text style={styles.statNum}>12</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={[styles.statCell, styles.statCellBorder]}>
              <Icon name="group-add" size={18} color={Colors.info} />
              <Text style={styles.statNum}>3</Text>
              <Text style={styles.statLabel}>Referrals</Text>
            </View>
            <View style={styles.statCell}>
              <Icon name="shield" size={18} color={Colors.success} />
              <Text style={styles.statNum}>High</Text>
              <Text style={styles.statLabel}>Safety</Text>
            </View>
          </View>
        </View>

        {/* Quick nav row */}
        <View style={styles.quickRow}>
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('RewardRedemption', {rewardId: 'all'})} activeOpacity={0.8}>
            <Icon name="stars" size={18} color={Colors.primary} />
            <Text style={styles.quickBtnText}>Redeem</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('ReferralProgram')} activeOpacity={0.8}>
            <Icon name="group-add" size={18} color={Colors.info} />
            <Text style={styles.quickBtnText}>Refer</Text>
          </TouchableOpacity>
          {FeatureFlags.MEMBERSHIP_TIERS && (
            <TouchableOpacity style={styles.quickBtn} onPress={() => navigation.navigate('MembershipTiers')} activeOpacity={0.8}>
              <Icon name="workspace-premium" size={18} color={Colors.onSurfaceVariant} />
              <Text style={styles.quickBtnText}>Tiers</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Curated Rewards - Stitch: local_activity Experience Credits | support_agent Concierge Priority */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CURATED REWARDS</Text>
          {CURATED_REWARDS.map((r, i) => (
            <View key={r.id} style={[styles.rewardRow, i < CURATED_REWARDS.length - 1 && styles.rewardRowBorder]}>
              <View style={[styles.rewardIconWrap, r.unlocked && styles.rewardIconWrapOn]}>
                <Icon name={r.icon} size={20} color={r.unlocked ? Colors.primary : Colors.onSurfaceVariant} />
              </View>
              <View style={styles.rewardMeta}>
                <Text style={styles.rewardLabel}>{r.label}</Text>
                <Text style={styles.rewardSub}>{r.sub}</Text>
              </View>
              {r.unlocked ? (
                <View style={styles.unlockedPill}>
                  <Icon name="check-circle" size={12} color={Colors.success} />
                  <Text style={styles.unlockedText}>Unlocked</Text>
                </View>
              ) : r.blackTier ? (
                <View style={styles.lockedPill}>
                  <Icon name="lock" size={12} color={Colors.onSurfaceVariant} />
                  <Text style={styles.lockedText}>Black Tier</Text>
                </View>
              ) : (
                <View style={styles.ptsPill}>
                  <Icon name="lock" size={11} color={Colors.onSurfaceVariant} />
                  <Text style={styles.ptsText}>{r.pts.toLocaleString()} pts</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Tier Roadmap - Stitch: Silver | Gold (current) | Black Elite */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>TIER ROADMAP</Text>
          {TIER_STEPS.map((t, i) => (
            <View key={t.label} style={styles.tierRow}>
              <View style={styles.tierLineWrap}>
                <View style={[styles.tierDot, t.current && styles.tierDotCurrent, t.done && !t.current && styles.tierDotDone]}>
                  {t.done && !t.current && <Icon name="check" size={10} color={Colors.onPrimary} />}
                  {t.current && <Icon name="stars" size={10} color={Colors.onPrimary} />}
                </View>
                {i < TIER_STEPS.length - 1 && <View style={[styles.tierLine, t.done && styles.tierLineDone]} />}
              </View>
              <View style={styles.tierMeta}>
                <Text style={[styles.tierLabel, t.current && styles.tierLabelCurrent]}>{t.label}</Text>
                <Text style={styles.tierPts}>{t.pts} - {t.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Premium Benefits - Stitch: book_online | health_and_safety | restaurant */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>PREMIUM BENEFITS</Text>
          {BENEFITS.map((b, i) => (
            <View key={b.icon} style={[styles.benefitRow, i < BENEFITS.length - 1 && styles.benefitRowBorder]}>
              <View style={styles.benefitIcon}>
                <Icon name={b.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.benefitMeta}>
                <Text style={styles.benefitLabel}>{b.label}</Text>
                <Text style={styles.benefitSub}>{b.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Reward History preview */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.sectionLabel}>RECENT HISTORY</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RewardRedemption', {rewardId: 'history'})} activeOpacity={0.7}>
              <Text style={styles.viewAllLink}>View All</Text>
            </TouchableOpacity>
          </View>
          {HISTORY_ITEMS.map((h, i) => (
            <View key={`${h.label}-${i}`} style={[styles.historyRow, i < HISTORY_ITEMS.length - 1 && styles.historyRowBorder]}>
              <View style={styles.historyIcon}>
                <Icon name={h.icon} size={16} color={Colors.primary} />
              </View>
              <View style={styles.historyMeta}>
                <Text style={styles.historyLabel}>{h.label}</Text>
                <Text style={styles.historyDate}>{h.date}</Text>
              </View>
              <Text style={[styles.historyPts, {color: h.sign ? Colors.success : Colors.error}]}>{h.pts}</Text>
            </View>
          ))}
        </View>

        {/* Referral entry CTA */}
        <TouchableOpacity style={styles.referralCard} onPress={() => navigation.navigate('ReferralProgram')} activeOpacity={0.85}>
          <View style={styles.referralLeft}>
            <Icon name="group-add" size={22} color={Colors.primary} />
            <View>
              <Text style={styles.referralTitle}>Refer Trusted Members</Text>
              <Text style={styles.referralSub}>Earn 500 credits per verified referral</Text>
            </View>
          </View>
          <Icon name="chevron-right" size={18} color={Colors.primary} />
        </TouchableOpacity>

        <View style={{height:24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:  {flex:1, backgroundColor:Colors.surface},
  scroll:{flex:1},
  scrollContent:{paddingHorizontal:20, paddingTop:20, gap:16},

  header:{height:56, flexDirection:'row', alignItems:'center', paddingHorizontal:16, gap:12,
    backgroundColor:'rgba(20,20,15,0.95)', borderBottomWidth:StyleSheet.hairlineWidth, borderBottomColor:CARD_BORDER},
  backBtn:{width:40,height:40,borderRadius:20,backgroundColor:Colors.surfaceContainerHighest,
    borderWidth:1,borderColor:CARD_BORDER,alignItems:'center',justifyContent:'center'},
  headerTitle:{flex:1,fontFamily:'Inter-SemiBold',fontSize:17,color:Colors.onSurface},
  historyBtn:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(242,202,80,0.10)',
    borderWidth:1,borderColor:'rgba(242,202,80,0.25)',alignItems:'center',justifyContent:'center'},

  heroCard:{backgroundColor:CARD_BG,borderRadius:24,borderWidth:1,borderColor:GOLD_BORDER,
    padding:24,alignItems:'center',gap:12,overflow:'hidden',position:'relative'},
  heroGlow:{position:'absolute',top:-40,alignSelf:'center',width:200,height:200,borderRadius:100,
    backgroundColor:'rgba(242,202,80,0.05)'},
  heroBadge:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'rgba(242,202,80,0.10)',
    borderWidth:1,borderColor:GOLD_BORDER,borderRadius:100,paddingHorizontal:12,paddingVertical:5},
  heroBadgeText:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.primary,letterSpacing:1.5},
  heroHeading:{fontFamily:'PlayfairDisplay-Bold',fontSize:22,color:Colors.onSurface,textAlign:'center'},
  heroSub:{fontFamily:'Inter-Regular',fontSize:13,color:Colors.onSurfaceVariant,textAlign:'center',lineHeight:19},
  pointsNumber:{fontFamily:'PlayfairDisplay-Bold',fontSize:48,color:Colors.onSurface},
  pointsLabel:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.onSurfaceVariant,letterSpacing:1},
  pointsWrap:{alignItems:'center'},
  progressBarBg:{width:'100%',height:6,backgroundColor:Colors.surfaceContainerHighest,borderRadius:3,overflow:'hidden'},
  progressBarFill:{height:6,backgroundColor:Colors.primary,borderRadius:3},
  progressNote:{fontFamily:'Inter-Regular',fontSize:12,color:Colors.onSurfaceVariant},
  statsRow:{flexDirection:'row',width:'100%',backgroundColor:Colors.surfaceContainerHigh,
    borderRadius:14,borderWidth:1,borderColor:CARD_BORDER,overflow:'hidden'},
  statCell:{flex:1,alignItems:'center',paddingVertical:12,gap:4},
  statCellBorder:{borderRightWidth:StyleSheet.hairlineWidth,borderRightColor:CARD_BORDER},
  statNum:{fontFamily:'Inter-SemiBold',fontSize:16,color:Colors.onSurface},
  statLabel:{fontFamily:'Inter-Regular',fontSize:10,color:Colors.onSurfaceVariant},

  quickRow:{flexDirection:'row',gap:10},
  quickBtn:{flex:1,alignItems:'center',gap:6,paddingVertical:14,borderRadius:16,
    backgroundColor:CARD_BG,borderWidth:1,borderColor:CARD_BORDER},
  quickBtnText:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.onSurface},

  card:{backgroundColor:CARD_BG,borderRadius:20,borderWidth:1,borderColor:CARD_BORDER,padding:20},
  sectionLabel:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.onSurfaceVariant,letterSpacing:1.5,marginBottom:14},
  cardHeaderRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},
  viewAllLink:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.primary},

  rewardRow:{flexDirection:'row',alignItems:'center',gap:14,paddingVertical:12},
  rewardRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  rewardIconWrap:{width:42,height:42,borderRadius:21,backgroundColor:Colors.surfaceContainerHigh,
    borderWidth:1,borderColor:CARD_BORDER,alignItems:'center',justifyContent:'center',flexShrink:0},
  rewardIconWrapOn:{backgroundColor:'rgba(242,202,80,0.10)',borderColor:'rgba(242,202,80,0.25)'},
  rewardMeta:{flex:1},
  rewardLabel:{fontFamily:'Inter-SemiBold',fontSize:14,color:Colors.onSurface,marginBottom:2},
  rewardSub:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant},
  unlockedPill:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:'rgba(109,217,140,0.10)',
    borderRadius:100,paddingHorizontal:8,paddingVertical:4,borderWidth:1,borderColor:'rgba(109,217,140,0.25)'},
  unlockedText:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.success},
  lockedPill:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:Colors.surfaceContainerHigh,
    borderRadius:100,paddingHorizontal:8,paddingVertical:4,borderWidth:1,borderColor:CARD_BORDER},
  lockedText:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.onSurfaceVariant},
  ptsPill:{flexDirection:'row',alignItems:'center',gap:4,backgroundColor:Colors.surfaceContainerHigh,
    borderRadius:100,paddingHorizontal:8,paddingVertical:4,borderWidth:1,borderColor:CARD_BORDER},
  ptsText:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.onSurfaceVariant},

  tierRow:{flexDirection:'row',gap:14,minHeight:40},
  tierLineWrap:{alignItems:'center',width:22},
  tierDot:{width:22,height:22,borderRadius:11,backgroundColor:Colors.surfaceContainerHighest,
    borderWidth:1,borderColor:CARD_BORDER,alignItems:'center',justifyContent:'center',flexShrink:0},
  tierDotDone:{backgroundColor:Colors.primary,borderColor:Colors.primary},
  tierDotCurrent:{backgroundColor:Colors.primary,borderColor:Colors.primary},
  tierLine:{width:1,flex:1,backgroundColor:CARD_BORDER,marginVertical:3},
  tierLineDone:{backgroundColor:'rgba(242,202,80,0.40)'},
  tierMeta:{flex:1,paddingTop:2},
  tierLabel:{fontFamily:'Inter-Medium',fontSize:14,color:Colors.onSurfaceVariant},
  tierLabelCurrent:{fontFamily:'Inter-SemiBold',color:Colors.primary},
  tierPts:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant,marginTop:2},

  benefitRow:{flexDirection:'row',alignItems:'center',gap:14,paddingVertical:12},
  benefitRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  benefitIcon:{width:40,height:40,borderRadius:20,backgroundColor:'rgba(242,202,80,0.10)',
    borderWidth:1,borderColor:'rgba(242,202,80,0.25)',alignItems:'center',justifyContent:'center',flexShrink:0},
  benefitMeta:{flex:1},
  benefitLabel:{fontFamily:'Inter-SemiBold',fontSize:14,color:Colors.onSurface,marginBottom:2},
  benefitSub:{fontFamily:'Inter-Regular',fontSize:12,color:Colors.onSurfaceVariant},

  historyRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:10},
  historyRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  historyIcon:{width:34,height:34,borderRadius:17,backgroundColor:Colors.surfaceContainerHigh,
    alignItems:'center',justifyContent:'center',flexShrink:0},
  historyMeta:{flex:1},
  historyLabel:{fontFamily:'Inter-Medium',fontSize:13,color:Colors.onSurface},
  historyDate:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant,marginTop:2},
  historyPts:{fontFamily:'Inter-SemiBold',fontSize:14},

  referralCard:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
    backgroundColor:'rgba(242,202,80,0.06)',borderRadius:16,borderWidth:1,borderColor:GOLD_BORDER,
    borderLeftWidth:3,borderLeftColor:Colors.primary,padding:16},
  referralLeft:{flexDirection:'row',alignItems:'center',gap:14},
  referralTitle:{fontFamily:'Inter-SemiBold',fontSize:14,color:Colors.onSurface,marginBottom:2},
  referralSub:{fontFamily:'Inter-Regular',fontSize:12,color:Colors.onSurfaceVariant},
});

