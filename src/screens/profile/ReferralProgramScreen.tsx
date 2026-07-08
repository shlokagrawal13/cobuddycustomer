import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert, Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch: referral_invite_screen_2 (primary) + referral_invite_screen_1
// arrow_back | "Invite Trusted People To CoBuddy"
// "Help us curate an exclusive environment by inviting verified individuals to our trusted social experiences."
// star Premium Member | Your Exclusive Invite Code: COBUDDY-ELARA-7X
// content_copy "Copy Code" | share "Share Link"
// Curated Rewards: diamond Premium Credits (500 credits per verified member)
//   support_agent Concierge Priority | event_available Exclusive Access
// Stats: 12 Invitations Sent | Members Joined | 2,400 Credits Earned

type Props = NativeStackScreenProps<ProfileStackParamList, 'ReferralProgram'>;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.22)';

const INVITE_CODE = 'COBUDDY-ELARA-7X';

const REWARDS_LIST = [
  {icon:'diamond',        label:'Premium Credits',      sub:'Earn 500 credits for every verified member who completes their first curated experience.'},
  {icon:'support-agent',  label:'Concierge Priority',   sub:'Unlock expedited booking and priority waitlist access for high-demand sessions.'},
  {icon:'event-available',label:'Exclusive Access',     sub:'Gain entry to private, invite-only events reserved for top referrers.'},
];

interface Referral {
  id: string;
  name: string;
  status: 'joined' | 'pending' | 'expired';
  date: string;
  credits: number;
}

const REFERRALS: Referral[] = [
  {id:'r1', name:'Alex Morgan',   status:'joined',  date:'Nov 10', credits:500},
  {id:'r2', name:'Jamie Clarke',  status:'joined',  date:'Nov 2',  credits:500},
  {id:'r3', name:'Sam Reeves',    status:'joined',  date:'Oct 18', credits:500},
  {id:'r4', name:'Taylor Wu',     status:'pending', date:'Nov 14', credits:0},
  {id:'r5', name:'Riley Banks',   status:'pending', date:'Nov 12', credits:0},
  {id:'r6', name:'Jordan Ellis',  status:'expired', date:'Sep 30', credits:0},
];

type ReferralFilter = 'all' | 'joined' | 'pending' | 'expired';

const STATUS_COLOR: Record<string, string> = {
  joined:  Colors.success,
  pending: Colors.warning,
  expired: Colors.onSurfaceVariant,
};

export default function ReferralProgramScreen({navigation}: Props) {
  const [filter, setFilter] = useState<ReferralFilter>('all');
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    setCopied(true);
    Alert.alert('Code Copied', `Your invite code "${INVITE_CODE}" has been copied. (Demo mode - clipboard not available.)`, [{text:'OK', onPress:()=>setTimeout(()=>setCopied(false),2000)}]);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: 'Join me on CoBuddy',
        message: `You have been invited to CoBuddy — the exclusive companion platform.\n\nUse invite code: ${INVITE_CODE}\nhttps://app.cobuddy.com/invite/${INVITE_CODE}`,
        url: `https://app.cobuddy.com/invite/${INVITE_CODE}`,
      });
    } catch {
      Alert.alert('Share', 'Unable to open the share sheet. Please try again.');
    }
  };

  const handleInvite = () => {
    navigation.navigate('InviteContact');
  };

  const filtered = filter === 'all' ? REFERRALS : REFERRALS.filter(r => r.status === filter);

  const totalJoined  = REFERRALS.filter(r => r.status === 'joined').length;
  const totalPending = REFERRALS.filter(r => r.status === 'pending').length;
  const totalCredits = REFERRALS.reduce((s, r) => s + r.credits, 0).toLocaleString();

  return (
    <SafeAreaView style={styles.root} edges={['top','bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header - Stitch: arrow_back | CoBuddy logo / person icon */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{top:10,bottom:10,left:10,right:10}} activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refer Trusted Members</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero - Stitch: verified "Verified Community" | "Invite Trusted People To CoBuddy" */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <View style={styles.verifiedBadge}>
            <Icon name="verified" size={13} color={Colors.primary} />
            <Text style={styles.verifiedBadgeText}>VERIFIED COMMUNITY</Text>
          </View>
          <Text style={styles.heroTitle}>Invite Trusted People To CoBuddy</Text>
          <Text style={styles.heroSub}>
            Help us curate an exclusive environment by inviting verified individuals to our trusted social experiences.
          </Text>
          <View style={styles.memberBadge}>
            <Icon name="star" size={13} color={Colors.primary} />
            <Text style={styles.memberBadgeText}>Premium Member</Text>
          </View>
        </View>

        {/* Invite Code - Stitch: Your Exclusive Invite Code | COBUDDY-ELARA-7X | content_copy | share */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>YOUR EXCLUSIVE INVITE CODE</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{INVITE_CODE}</Text>
          </View>
          <View style={styles.codeActions}>
            <TouchableOpacity style={[styles.codeActionBtn, styles.codeActionPrimary]} onPress={handleCopyCode} activeOpacity={0.85}>
              <Icon name={copied ? 'check' : 'content-copy'} size={16} color={Colors.onPrimary} />
              <Text style={styles.codeActionPrimaryText}>{copied ? 'Copied!' : 'Copy Code'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.codeActionBtn} onPress={handleShare} activeOpacity={0.8}>
              <Icon name="share" size={16} color={Colors.primary} />
              <Text style={styles.codeActionSecText}>Share Link</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite CTA button */}
        <TouchableOpacity style={styles.inviteBtn} onPress={handleInvite} activeOpacity={0.85}>
          <Icon name="person-add" size={18} color={Colors.onPrimary} />
          <Text style={styles.inviteBtnText}>Invite a Contact</Text>
        </TouchableOpacity>

        {/* Stats - Stitch: 12 Invitations Sent | Members Joined | Credits Earned 2,400 */}
        <View style={styles.statsCard}>
          <View style={[styles.statBlock, styles.statBlockBorder]}>
            <Text style={styles.statNum}>12</Text>
            <Text style={styles.statLabel}>Invitations{'\n'}Sent</Text>
          </View>
          <View style={[styles.statBlock, styles.statBlockBorder]}>
            <Text style={styles.statNum}>{totalJoined}</Text>
            <Text style={styles.statLabel}>Members{'\n'}Joined</Text>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statNum}>{totalCredits}</Text>
            <Text style={styles.statLabel}>Credits{'\n'}Earned</Text>
          </View>
        </View>

        {/* Track Referrals shortcut */}
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.navigate('ReferralTracking')}
          activeOpacity={0.8}>
          <Icon name="timeline" size={16} color={Colors.primary} />
          <Text style={styles.trackBtnText}>Track Referrals</Text>
          <Icon name="chevron-right" size={16} color={Colors.primary} />
        </TouchableOpacity>

        {/* Curated Rewards - Stitch: diamond Premium Credits | support_agent Concierge Priority | event_available Exclusive Access */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>CURATED REWARDS</Text>
          {REWARDS_LIST.map((r, i) => (
            <View key={r.icon} style={[styles.rewardRow, i < REWARDS_LIST.length - 1 && styles.rewardRowBorder]}>
              <View style={styles.rewardIcon}>
                <Icon name={r.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.rewardMeta}>
                <Text style={styles.rewardLabel}>{r.label}</Text>
                <Text style={styles.rewardSub}>{r.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Referral tracking - all / joined / pending / expired */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>REFERRAL STATUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
            <View style={styles.filterRow}>
              {(['all','joined','pending','expired'] as ReferralFilter[]).map(f => (
                <TouchableOpacity key={f} style={[styles.chip, filter===f && styles.chipOn]} onPress={()=>setFilter(f)} activeOpacity={0.75}>
                  <Text style={[styles.chipText, filter===f && styles.chipTextOn]}>
                    {f.charAt(0).toUpperCase()+f.slice(1)}
                    {f!=='all' && ` (${REFERRALS.filter(r=>r.status===f).length})`}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          {filtered.map((ref, i) => (
            <View key={ref.id} style={[styles.refRow, i < filtered.length-1 && styles.refRowBorder]}>
              <View style={styles.refAvatar}>
                <Icon name="person" size={18} color={Colors.onSurfaceVariant} />
              </View>
              <View style={styles.refMeta}>
                <Text style={styles.refName}>{ref.name}</Text>
                <Text style={styles.refDate}>{ref.date}</Text>
              </View>
              <View style={styles.refRight}>
                <View style={[styles.statusPill, {backgroundColor: STATUS_COLOR[ref.status]+'18', borderColor: STATUS_COLOR[ref.status]+'50'}]}>
                  <Text style={[styles.statusText, {color: STATUS_COLOR[ref.status]}]}>
                    {ref.status.charAt(0).toUpperCase()+ref.status.slice(1)}
                  </Text>
                </View>
                {ref.credits > 0 && (
                  <Text style={styles.creditEarned}>+{ref.credits} credits</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Privacy note */}
        <View style={styles.privacyNote}>
          <Icon name="lock" size={12} color={Colors.onSurfaceVariant} />
          <Text style={styles.privacyText}>Invite links are exclusive and expire after 30 days. Referrals are verified before credits are awarded.</Text>
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
  headerTitle:{flex:1,fontFamily:'Inter-SemiBold',fontSize:17,color:Colors.onSurface},
  headerSpacer:{width:40},

  heroCard:{backgroundColor:CARD_BG,borderRadius:24,borderWidth:1,borderColor:GOLD_BORDER,
    padding:24,alignItems:'center',gap:14,overflow:'hidden',position:'relative'},
  heroGlow:{position:'absolute',top:-40,alignSelf:'center',width:200,height:200,borderRadius:100,
    backgroundColor:'rgba(242,202,80,0.04)'},
  verifiedBadge:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'rgba(242,202,80,0.10)',
    borderWidth:1,borderColor:GOLD_BORDER,borderRadius:100,paddingHorizontal:12,paddingVertical:5},
  verifiedBadgeText:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.primary,letterSpacing:1.5},
  heroTitle:{fontFamily:'PlayfairDisplay-Bold',fontSize:22,color:Colors.onSurface,textAlign:'center'},
  heroSub:{fontFamily:'Inter-Regular',fontSize:13,color:Colors.onSurfaceVariant,textAlign:'center',lineHeight:19},
  memberBadge:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:Colors.surfaceContainerHigh,
    borderRadius:100,paddingHorizontal:12,paddingVertical:5,borderWidth:1,borderColor:CARD_BORDER},
  memberBadgeText:{fontFamily:'Inter-SemiBold',fontSize:11,color:Colors.onSurface},

  codeCard:{backgroundColor:CARD_BG,borderRadius:20,borderWidth:1,borderColor:GOLD_BORDER,padding:20,gap:14,alignItems:'center'},
  codeLabel:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.onSurfaceVariant,letterSpacing:1.5,alignSelf:'flex-start'},
  codeBox:{backgroundColor:Colors.surfaceContainerHigh,borderRadius:14,borderWidth:1,
    borderColor:'rgba(242,202,80,0.30)',borderStyle:'dashed',paddingVertical:14,paddingHorizontal:24,width:'100%',alignItems:'center'},
  codeText:{fontFamily:'PlayfairDisplay-Bold',fontSize:22,color:Colors.primary,letterSpacing:2},
  codeActions:{flexDirection:'row',gap:10,width:'100%'},
  codeActionBtn:{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,
    paddingVertical:13,borderRadius:100,backgroundColor:Colors.surfaceContainerHigh,
    borderWidth:1,borderColor:'rgba(242,202,80,0.25)'},
  codeActionPrimary:{backgroundColor:Colors.primary},
  codeActionPrimaryText:{fontFamily:'Inter-SemiBold',fontSize:13,color:Colors.onPrimary},
  codeActionSecText:{fontFamily:'Inter-SemiBold',fontSize:13,color:Colors.primary},

  inviteBtn:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:10,
    paddingVertical:17,borderRadius:100,backgroundColor:Colors.primary},
  inviteBtnText:{fontFamily:'Inter-SemiBold',fontSize:16,color:Colors.onPrimary,letterSpacing:0.3},

  statsCard:{flexDirection:'row',backgroundColor:CARD_BG,borderRadius:20,borderWidth:1,borderColor:CARD_BORDER,overflow:'hidden'},
  statBlock:{flex:1,alignItems:'center',paddingVertical:16,gap:4},
  statBlockBorder:{borderRightWidth:StyleSheet.hairlineWidth,borderRightColor:CARD_BORDER},
  statNum:{fontFamily:'PlayfairDisplay-Bold',fontSize:24,color:Colors.onSurface},
  statLabel:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant,textAlign:'center',lineHeight:16},

  card:{backgroundColor:CARD_BG,borderRadius:20,borderWidth:1,borderColor:CARD_BORDER,padding:20},
  sectionLabel:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.onSurfaceVariant,letterSpacing:1.5,marginBottom:14},
  rewardRow:{flexDirection:'row',alignItems:'center',gap:14,paddingVertical:10},
  rewardRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  rewardIcon:{width:42,height:42,borderRadius:21,backgroundColor:'rgba(242,202,80,0.10)',
    borderWidth:1,borderColor:'rgba(242,202,80,0.25)',alignItems:'center',justifyContent:'center',flexShrink:0},
  rewardMeta:{flex:1},
  rewardLabel:{fontFamily:'Inter-SemiBold',fontSize:14,color:Colors.onSurface,marginBottom:2},
  rewardSub:{fontFamily:'Inter-Regular',fontSize:12,color:Colors.onSurfaceVariant,lineHeight:17},

  filterRow:{flexDirection:'row',gap:8},
  chip:{borderRadius:100,paddingHorizontal:14,paddingVertical:7,backgroundColor:Colors.surfaceContainerHigh,borderWidth:1,borderColor:CARD_BORDER},
  chipOn:{backgroundColor:'rgba(242,202,80,0.12)',borderColor:'rgba(242,202,80,0.35)'},
  chipText:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.onSurfaceVariant},
  chipTextOn:{color:Colors.primary},

  refRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:10},
  refRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  refAvatar:{width:38,height:38,borderRadius:19,backgroundColor:Colors.surfaceContainerHigh,
    alignItems:'center',justifyContent:'center',flexShrink:0},
  refMeta:{flex:1},
  refName:{fontFamily:'Inter-SemiBold',fontSize:14,color:Colors.onSurface},
  refDate:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant,marginTop:2},
  refRight:{alignItems:'flex-end',gap:4,flexShrink:0},
  statusPill:{borderRadius:100,paddingHorizontal:9,paddingVertical:4,borderWidth:1},
  statusText:{fontFamily:'Inter-SemiBold',fontSize:11},
  creditEarned:{fontFamily:'Inter-SemiBold',fontSize:11,color:Colors.success},

  privacyNote:{flexDirection:'row',alignItems:'flex-start',gap:8,opacity:0.6},
  privacyText:{flex:1,fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant,lineHeight:16},

  trackBtn:{
    flexDirection:'row', alignItems:'center', gap:10,
    backgroundColor:CARD_BG, borderRadius:16,
    borderWidth:1, borderColor:GOLD_BORDER, paddingVertical:14, paddingHorizontal:18,
  },
  trackBtnText:{flex:1, fontFamily:'Inter-SemiBold', fontSize:14, color:Colors.primary},
});

