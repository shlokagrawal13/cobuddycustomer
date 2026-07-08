import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch: reward_redemption_screen
// "Redeem Premium Benefits" | "Unlock curated rewards, concierge perks, and premium trusted experiences."
// Available Balance: 2,400 Pts | stars Gold Premium Member | 6 Redeemable Rewards
// confirmation_number Experience Credits 600pts | restaurant Premium Dining Voucher 1200pts
// support_agent Concierge Priority (Unlocked) | vpn_key VIP Venue Access 2000pts | lock Premium Event Invite 5000pts Locked

type Props = NativeStackScreenProps<ProfileStackParamList, 'RewardRedemption'>;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.22)';

const REWARDS = [
  {id:'exp',   icon:'confirmation-number', label:'Experience Credits',     sub:'Apply towards your next verified social experience booking.',         pts:600,  state:'available'},
  {id:'din',   icon:'restaurant',          label:'Premium Dining Voucher', sub:'Exclusive reservations and credits at partner luxury venues.',        pts:1200, state:'available'},
  {id:'con',   icon:'support-agent',       label:'Concierge Priority',     sub:'Skip the wait with 24/7 priority access to your personal concierge.',pts:0,    state:'unlocked'},
  {id:'vip',   icon:'vpn-key',             label:'VIP Venue Access',       sub:'Guaranteed entry and private areas at select partner events.',        pts:2000, state:'available'},
  {id:'event', icon:'celebration',         label:'Premium Event Invite',   sub:'Exclusive access to unlisted, high-tier social gatherings.',         pts:5000, state:'locked'},
] as const;

type RewardState = 'available' | 'unlocked' | 'locked';

const HISTORY = [
  {id:'h1', icon:'stars',          label:'Session Reward',        pts:'+120', date:'Nov 12',  type:'earned'},
  {id:'h2', icon:'group-add',      label:'Referral Bonus',        pts:'+500', date:'Nov 8',   type:'earned'},
  {id:'h3', icon:'local-activity', label:'Experience Credits',    pts:'-600', date:'Oct 30',  type:'redeemed'},
  {id:'h4', icon:'celebration',    label:'Tier Milestone Bonus',  pts:'+200', date:'Oct 25',  type:'earned'},
  {id:'h5', icon:'timelapse',      label:'Promo Credits Expired', pts:'-100', date:'Oct 15',  type:'expired'},
  {id:'h6', icon:'confirmation-number', label:'Dining Voucher',   pts:'-1200',date:'Sep 28',  type:'redeemed'},
] as const;

type HistoryFilter = 'all' | 'earned' | 'redeemed' | 'expired';

const FILTER_LABELS: Record<HistoryFilter, string> = {
  all:'All', earned:'Earned', redeemed:'Redeemed', expired:'Expired',
};

export default function RewardRedemptionScreen({route, navigation}: Props) {
  const {rewardId} = route.params;
  // 'history' => focus on redemption history; 'all' or specific id => show all rewards
  const initialFilter: HistoryFilter = rewardId === 'history' ? 'redeemed' : 'all';
  const [filter, setFilter] = useState<HistoryFilter>(initialFilter);
  const showHistoryFirst = rewardId === 'history';
  const BALANCE = 2400;

  const handleRedeem = (label: string, pts: number) => {
    if (pts > BALANCE) {
      Alert.alert('Insufficient Points', `You need ${pts.toLocaleString()} points to redeem "${label}". Current balance: ${BALANCE.toLocaleString()} points.`, [{text:'OK'}]);
      return;
    }
    Alert.alert('Redeem Reward', `Redeem "${label}" for ${pts.toLocaleString()} points?\n\nThis is a demo - no actual points will be deducted.`, [
      {text:'Cancel', style:'cancel'},
      {text:'Confirm Redemption', onPress:() => Alert.alert('Success', `"${label}" has been redeemed. Check your CoBuddy inbox for details.`)},
    ]);
  };

  const handleAccess = (label: string) => {
    Alert.alert('Benefit Active', `"${label}" is already unlocked as part of your Gold Premium membership.`, [{text:'OK'}]);
  };

  const filteredHistory = HISTORY.filter(h => filter === 'all' || h.type === filter);

  const ptColor = (type: string) => type === 'earned' ? Colors.success : type === 'expired' ? Colors.onSurfaceVariant : Colors.error;

  return (
    <SafeAreaView style={styles.root} edges={['top','bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{top:10,bottom:10,left:10,right:10}} activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showHistoryFirst ? 'Redemption History' : 'Redeem Premium Benefits'}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero - Stitch: "Unlock curated rewards..." | Available Balance 2,400 Pts | stars Gold Premium */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <Text style={styles.heroSub}>Unlock curated rewards, concierge perks, and premium trusted experiences.</Text>
          <View style={styles.balanceRow}>
            <View style={styles.balanceBlock}>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceNumber}>2,400 Pts</Text>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceBlock}>
              <Text style={styles.balanceLabel}>Redeemable</Text>
              <Text style={styles.balanceNumber}>6 Rewards</Text>
            </View>
          </View>
          <View style={styles.tierBadge}>
            <Icon name="stars" size={14} color={Colors.primary} />
            <Text style={styles.tierBadgeText}>Gold Premium Member</Text>
          </View>
        </View>

        {/* Reward rows */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>AVAILABLE REWARDS</Text>
          {REWARDS.map((r, i) => {
            const s: RewardState = r.state;
            return (
              <View key={r.id} style={[styles.rewardRow, i < REWARDS.length - 1 && styles.rewardRowBorder]}>
                <View style={[styles.rewardIcon, s === 'unlocked' && styles.rewardIconOn, s === 'locked' && styles.rewardIconLocked]}>
                  <Icon name={r.icon} size={20} color={s === 'unlocked' ? Colors.primary : s === 'locked' ? Colors.onSurfaceVariant : Colors.primary} />
                </View>
                <View style={styles.rewardMeta}>
                  <Text style={styles.rewardLabel}>{r.label}</Text>
                  <Text style={styles.rewardSub}>{r.sub}</Text>
                  {s === 'available' && (
                    <View style={styles.ptsBadge}>
                      <Icon name="stars" size={10} color={Colors.primary} />
                      <Text style={styles.ptsBadgeText}>{r.pts.toLocaleString()} pts</Text>
                    </View>
                  )}
                  {s === 'locked' && (
                    <View style={styles.lockedBadge}>
                      <Icon name="lock" size={10} color={Colors.onSurfaceVariant} />
                      <Text style={styles.lockedBadgeText}>{r.pts.toLocaleString()} pts required</Text>
                    </View>
                  )}
                </View>
                {s === 'unlocked' && (
                  <TouchableOpacity style={styles.accessBtn} onPress={() => handleAccess(r.label)} activeOpacity={0.8}>
                    <Text style={styles.accessBtnText}>Access Now</Text>
                  </TouchableOpacity>
                )}
                {s === 'available' && (
                  <TouchableOpacity style={styles.redeemBtn} onPress={() => handleRedeem(r.label, r.pts)} activeOpacity={0.8}>
                    <Text style={styles.redeemBtnText}>Redeem</Text>
                  </TouchableOpacity>
                )}
                {s === 'locked' && (
                  <View style={styles.lockedTag}>
                    <Icon name="lock" size={14} color={Colors.onSurfaceVariant} />
                    <Text style={styles.lockedTagText}>Locked</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Reward History with filters */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>REWARD HISTORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
            <View style={styles.filterRow}>
              {(Object.keys(FILTER_LABELS) as HistoryFilter[]).map(f => (
                <TouchableOpacity key={f} style={[styles.filterChip, filter===f && styles.filterChipOn]} onPress={() => setFilter(f)} activeOpacity={0.75}>
                  <Text style={[styles.filterChipText, filter===f && styles.filterChipTextOn]}>{FILTER_LABELS[f]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {filteredHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="history" size={32} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyText}>No {FILTER_LABELS[filter].toLowerCase()} rewards yet.</Text>
            </View>
          ) : filteredHistory.map((h, i) => (
            <View key={h.id} style={[styles.historyRow, i < filteredHistory.length-1 && styles.historyRowBorder]}>
              <View style={styles.historyIcon}>
                <Icon name={h.icon} size={16} color={ptColor(h.type)} />
              </View>
              <View style={styles.historyMeta}>
                <Text style={styles.historyLabel}>{h.label}</Text>
                <View style={styles.historySubRow}>
                  <Text style={styles.historyDate}>{h.date}</Text>
                  <View style={[styles.historyTypePill,
                    h.type==='earned'   && styles.pillEarned,
                    h.type==='redeemed' && styles.pillRedeemed,
                    h.type==='expired'  && styles.pillExpired]}>
                    <Text style={[styles.historyTypeText,
                      h.type==='earned'   && styles.typeTextEarned,
                      h.type==='redeemed' && styles.typeTextRedeemed,
                      h.type==='expired'  && styles.typeTextExpired]}>
                      {h.type.charAt(0).toUpperCase()+h.type.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.historyPts, {color: ptColor(h.type)}]}>{h.pts}</Text>
            </View>
          ))}
        </View>

        <View style={{height:24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root:  {flex:1, backgroundColor:Colors.surface},
  scroll:{flex:1},
  scrollContent:{paddingHorizontal:20, paddingTop:20, gap:16},

  header:{height:56,flexDirection:'row',alignItems:'center',paddingHorizontal:16,gap:12,
    backgroundColor:'rgba(20,20,15,0.95)',borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  backBtn:{width:40,height:40,borderRadius:20,backgroundColor:Colors.surfaceContainerHighest,
    borderWidth:1,borderColor:CARD_BORDER,alignItems:'center',justifyContent:'center'},
  headerTitle:{flex:1,fontFamily:'Inter-SemiBold',fontSize:16,color:Colors.onSurface},
  headerSpacer:{width:40},

  heroCard:{backgroundColor:CARD_BG,borderRadius:24,borderWidth:1,borderColor:GOLD_BORDER,
    padding:20,gap:14,position:'relative',overflow:'hidden'},
  heroGlow:{position:'absolute',top:-40,alignSelf:'center',width:200,height:200,borderRadius:100,
    backgroundColor:'rgba(242,202,80,0.04)'},
  heroSub:{fontFamily:'Inter-Regular',fontSize:13,color:Colors.onSurfaceVariant,lineHeight:19},
  balanceRow:{flexDirection:'row',backgroundColor:Colors.surfaceContainerHigh,borderRadius:14,
    borderWidth:1,borderColor:CARD_BORDER,overflow:'hidden'},
  balanceBlock:{flex:1,alignItems:'center',paddingVertical:14,gap:4},
  balanceDivider:{width:StyleSheet.hairlineWidth,backgroundColor:CARD_BORDER},
  balanceLabel:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant},
  balanceNumber:{fontFamily:'PlayfairDisplay-Bold',fontSize:20,color:Colors.onSurface},
  tierBadge:{flexDirection:'row',alignItems:'center',gap:6,alignSelf:'center',
    backgroundColor:'rgba(242,202,80,0.10)',borderWidth:1,borderColor:GOLD_BORDER,
    borderRadius:100,paddingHorizontal:12,paddingVertical:5},
  tierBadgeText:{fontFamily:'Inter-SemiBold',fontSize:11,color:Colors.primary,letterSpacing:0.5},

  card:{backgroundColor:CARD_BG,borderRadius:20,borderWidth:1,borderColor:CARD_BORDER,padding:20},
  sectionLabel:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.onSurfaceVariant,letterSpacing:1.5,marginBottom:14},

  rewardRow:{flexDirection:'row',alignItems:'center',gap:14,paddingVertical:12},
  rewardRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  rewardIcon:{width:44,height:44,borderRadius:22,backgroundColor:Colors.surfaceContainerHigh,
    borderWidth:1,borderColor:CARD_BORDER,alignItems:'center',justifyContent:'center',flexShrink:0},
  rewardIconOn:{backgroundColor:'rgba(242,202,80,0.10)',borderColor:'rgba(242,202,80,0.25)'},
  rewardIconLocked:{opacity:0.5},
  rewardMeta:{flex:1,gap:4},
  rewardLabel:{fontFamily:'Inter-SemiBold',fontSize:14,color:Colors.onSurface},
  rewardSub:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant,lineHeight:16},
  ptsBadge:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',
    backgroundColor:'rgba(242,202,80,0.08)',borderRadius:100,paddingHorizontal:8,paddingVertical:3,
    borderWidth:1,borderColor:'rgba(242,202,80,0.20)'},
  ptsBadgeText:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.primary},
  lockedBadge:{flexDirection:'row',alignItems:'center',gap:4,alignSelf:'flex-start',
    backgroundColor:Colors.surfaceContainerHigh,borderRadius:100,paddingHorizontal:8,paddingVertical:3},
  lockedBadgeText:{fontFamily:'Inter-Regular',fontSize:10,color:Colors.onSurfaceVariant},
  redeemBtn:{backgroundColor:Colors.primary,borderRadius:100,paddingHorizontal:14,paddingVertical:8,flexShrink:0},
  redeemBtnText:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.onPrimary},
  accessBtn:{backgroundColor:'rgba(242,202,80,0.12)',borderRadius:100,paddingHorizontal:14,paddingVertical:8,
    borderWidth:1,borderColor:'rgba(242,202,80,0.30)',flexShrink:0},
  accessBtnText:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.primary},
  lockedTag:{flexDirection:'row',alignItems:'center',gap:4,flexShrink:0,opacity:0.6},
  lockedTagText:{fontFamily:'Inter-Regular',fontSize:12,color:Colors.onSurfaceVariant},

  filterRow:{flexDirection:'row',gap:8},
  filterChip:{borderRadius:100,paddingHorizontal:14,paddingVertical:7,backgroundColor:Colors.surfaceContainerHigh,
    borderWidth:1,borderColor:CARD_BORDER},
  filterChipOn:{backgroundColor:'rgba(242,202,80,0.12)',borderColor:'rgba(242,202,80,0.35)'},
  filterChipText:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.onSurfaceVariant},
  filterChipTextOn:{color:Colors.primary},

  historyRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:10},
  historyRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  historyIcon:{width:34,height:34,borderRadius:17,backgroundColor:Colors.surfaceContainerHigh,
    alignItems:'center',justifyContent:'center',flexShrink:0},
  historyMeta:{flex:1},
  historyLabel:{fontFamily:'Inter-Medium',fontSize:13,color:Colors.onSurface},
  historySubRow:{flexDirection:'row',alignItems:'center',gap:8,marginTop:3},
  historyDate:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant},
  historyTypePill:{borderRadius:100,paddingHorizontal:8,paddingVertical:2},
  pillEarned:{backgroundColor:'rgba(109,217,140,0.10)'},
  pillRedeemed:{backgroundColor:'rgba(242,202,80,0.10)'},
  pillExpired:{backgroundColor:Colors.surfaceContainerHigh},
  historyTypeText:{fontFamily:'Inter-SemiBold',fontSize:9,letterSpacing:0.5},
  typeTextEarned:{color:Colors.success},
  typeTextRedeemed:{color:Colors.primary},
  typeTextExpired:{color:Colors.onSurfaceVariant},
  historyPts:{fontFamily:'Inter-SemiBold',fontSize:14,flexShrink:0},

  emptyState:{alignItems:'center',paddingVertical:28,gap:10},
  emptyText:{fontFamily:'Inter-Regular',fontSize:13,color:Colors.onSurfaceVariant},
});

