import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch: referral_invite_screen_1 + referral_invite_screen_2 (invite / tracking detail view)
// Extends ReferralProgramScreen with invite flow + contact selection (mock) + invite status detail

type Props = NativeStackScreenProps<ProfileStackParamList, 'ReferralTracking'>;

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.22)';

const MOCK_CONTACTS = [
  {id:'mc1', name:'Alex Morgan',    relation:'Close Friend', status:'joined',  date:'Nov 10'},
  {id:'mc2', name:'Jamie Clarke',   relation:'Colleague',    status:'joined',  date:'Nov 2'},
  {id:'mc3', name:'Sam Reeves',     relation:'Family',       status:'joined',  date:'Oct 18'},
  {id:'mc4', name:'Taylor Wu',      relation:'Friend',       status:'pending', date:'Nov 14'},
  {id:'mc5', name:'Riley Banks',    relation:'Colleague',    status:'pending', date:'Nov 12'},
  {id:'mc6', name:'Morgan Davis',   relation:'Acquaintance', status:'pending', date:'Nov 9'},
  {id:'mc7', name:'Jordan Ellis',   relation:'Friend',       status:'expired', date:'Sep 30'},
] as const;

const STATUS_META: Record<string, {color:string; icon:string; label:string}> = {
  joined:  {color:Colors.success,          icon:'check-circle',   label:'Joined'},
  pending: {color:Colors.warning,          icon:'schedule',       label:'Pending'},
  expired: {color:Colors.onSurfaceVariant, icon:'timelapse',      label:'Expired'},
};

const EARN_STEPS = [
  {step:'1', label:'Share your invite code',       icon:'ios-share'},
  {step:'2', label:'Contact creates an account',   icon:'person-add'},
  {step:'3', label:'They complete their first experience', icon:'event-available'},
  {step:'4', label:'You earn 500 credits automatically',   icon:'stars'},
];

export default function ReferralTrackingScreen({navigation}: Props) {
  const handleInviteContact = (name: string) => {
    Alert.alert('Invite Sent', `Demo mode: An invite to ${name} would be sent via SMS and email. No actual message has been sent.`, [{text:'OK'}]);
  };

  const handleNewInvite = () => {
    Alert.alert('New Invite', 'Demo mode: This would open your contacts to select someone new to invite. Contact API not available in demo.', [{text:'OK'}]);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top','bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{top:10,bottom:10,left:10,right:10}} activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invite & Track</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} pointerEvents="none" />
          <View style={styles.heroBadge}>
            <Icon name="verified" size={13} color={Colors.primary} />
            <Text style={styles.heroBadgeText}>TRUSTED REFERRAL PROGRAM</Text>
          </View>
          <Text style={styles.heroTitle}>Invite Trusted People To CoBuddy</Text>
          <Text style={styles.heroSub}>
            Expand the trusted CoBuddy community with respectful and verified members.
          </Text>
          <TouchableOpacity style={styles.inviteBtn} onPress={handleNewInvite} activeOpacity={0.85}>
            <Icon name="person-add" size={18} color={Colors.onPrimary} />
            <Text style={styles.inviteBtnText}>Invite a New Contact</Text>
          </TouchableOpacity>
        </View>

        {/* How it works */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
          {EARN_STEPS.map((s, i) => (
            <View key={s.step} style={styles.stepRow}>
              {i < EARN_STEPS.length - 1 && <View style={{position:'absolute',left:13,top:28,bottom:-16,width:1,backgroundColor:'rgba(242,202,80,0.20)'}} />}
              <View style={styles.stepBadge}>
                <Text style={styles.stepNum}>{s.step}</Text>
              </View>
              <View style={styles.stepMeta}>
                <Icon name={s.icon} size={16} color={Colors.primary} />
                <Text style={styles.stepLabel}>{s.label}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact list with invite status */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.sectionLabel}>YOUR INVITATIONS</Text>
            <TouchableOpacity onPress={handleNewInvite} activeOpacity={0.7}>
              <Text style={styles.addNewLink}>+ New Invite</Text>
            </TouchableOpacity>
          </View>

          {MOCK_CONTACTS.map((c, i) => {
            const meta = STATUS_META[c.status];
            return (
              <View key={c.id} style={[styles.contactRow, i < MOCK_CONTACTS.length - 1 && styles.contactRowBorder]}>
                <View style={styles.contactAvatar}>
                  <Icon name="person" size={18} color={Colors.onSurfaceVariant} />
                </View>
                <View style={styles.contactMeta}>
                  <Text style={styles.contactName}>{c.name}</Text>
                  <Text style={styles.contactRelation}>{c.relation} - {c.date}</Text>
                </View>
                <View style={styles.contactRight}>
                  <View style={[styles.statusChip, {backgroundColor:meta.color+'18', borderColor:meta.color+'50'}]}>
                    <Icon name={meta.icon} size={11} color={meta.color} />
                    <Text style={[styles.statusChipText, {color:meta.color}]}>{meta.label}</Text>
                  </View>
                  {c.status === 'pending' && (
                    <TouchableOpacity onPress={() => handleInviteContact(c.name)} activeOpacity={0.75} style={styles.resendBtn}>
                      <Text style={styles.resendBtnText}>Resend</Text>
                    </TouchableOpacity>
                  )}
                  {c.status === 'joined' && (
                    <Text style={styles.creditsLabel}>+500 credits</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Summary card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Icon name="group-add" size={18} color={Colors.primary} />
            <Text style={styles.summaryLabel}>Total Invitations</Text>
            <Text style={styles.summaryValue}>{MOCK_CONTACTS.length}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowBorder]}>
            <Icon name="check-circle" size={18} color={Colors.success} />
            <Text style={styles.summaryLabel}>Members Joined</Text>
            <Text style={[styles.summaryValue, {color:Colors.success}]}>3</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryRowBorder]}>
            <Icon name="stars" size={18} color={Colors.primary} />
            <Text style={styles.summaryLabel}>Total Credits Earned</Text>
            <Text style={[styles.summaryValue, {color:Colors.primary}]}>1,500</Text>
          </View>
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
  heroBadge:{flexDirection:'row',alignItems:'center',gap:6,backgroundColor:'rgba(242,202,80,0.10)',
    borderWidth:1,borderColor:GOLD_BORDER,borderRadius:100,paddingHorizontal:12,paddingVertical:5},
  heroBadgeText:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.primary,letterSpacing:1.5},
  heroTitle:{fontFamily:'PlayfairDisplay-Bold',fontSize:20,color:Colors.onSurface,textAlign:'center'},
  heroSub:{fontFamily:'Inter-Regular',fontSize:13,color:Colors.onSurfaceVariant,textAlign:'center',lineHeight:19},
  inviteBtn:{flexDirection:'row',alignItems:'center',gap:10,paddingHorizontal:24,paddingVertical:14,
    borderRadius:100,backgroundColor:Colors.primary},
  inviteBtnText:{fontFamily:'Inter-SemiBold',fontSize:15,color:Colors.onPrimary},

  card:{backgroundColor:CARD_BG,borderRadius:20,borderWidth:1,borderColor:CARD_BORDER,padding:20},
  sectionLabel:{fontFamily:'Inter-SemiBold',fontSize:10,color:Colors.onSurfaceVariant,letterSpacing:1.5,marginBottom:14},
  cardTitleRow:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},
  addNewLink:{fontFamily:'Inter-SemiBold',fontSize:12,color:Colors.primary},

  stepRow:{flexDirection:'row',alignItems:'flex-start',gap:12,marginBottom:16},
  stepBadge:{width:28,height:28,borderRadius:14,backgroundColor:'rgba(242,202,80,0.15)',
    borderWidth:1,borderColor:GOLD_BORDER,alignItems:'center',justifyContent:'center',flexShrink:0},
  stepNum:{fontFamily:'Inter-Bold',fontSize:12,color:Colors.primary},
  stepMeta:{flex:1,flexDirection:'row',alignItems:'center',gap:10,paddingTop:5},
  stepLabel:{fontFamily:'Inter-Regular',fontSize:13,color:Colors.onSurface,flex:1,lineHeight:18},

  contactRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:10},
  contactRowBorder:{borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:CARD_BORDER},
  contactAvatar:{width:38,height:38,borderRadius:19,backgroundColor:Colors.surfaceContainerHigh,
    alignItems:'center',justifyContent:'center',flexShrink:0},
  contactMeta:{flex:1},
  contactName:{fontFamily:'Inter-SemiBold',fontSize:14,color:Colors.onSurface},
  contactRelation:{fontFamily:'Inter-Regular',fontSize:11,color:Colors.onSurfaceVariant,marginTop:2},
  contactRight:{alignItems:'flex-end',gap:5,flexShrink:0},
  statusChip:{flexDirection:'row',alignItems:'center',gap:4,borderRadius:100,paddingHorizontal:8,paddingVertical:4,borderWidth:1},
  statusChipText:{fontFamily:'Inter-SemiBold',fontSize:10},
  resendBtn:{backgroundColor:Colors.surfaceContainerHigh,borderRadius:100,paddingHorizontal:10,paddingVertical:4,
    borderWidth:1,borderColor:CARD_BORDER},
  resendBtnText:{fontFamily:'Inter-SemiBold',fontSize:11,color:Colors.primary},
  creditsLabel:{fontFamily:'Inter-SemiBold',fontSize:11,color:Colors.success},

  summaryCard:{backgroundColor:CARD_BG,borderRadius:20,borderWidth:1,borderColor:GOLD_BORDER,padding:16,gap:0},
  summaryRow:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:12},
  summaryRowBorder:{borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:CARD_BORDER},
  summaryLabel:{flex:1,fontFamily:'Inter-Medium',fontSize:14,color:Colors.onSurface},
  summaryValue:{fontFamily:'Inter-SemiBold',fontSize:16,color:Colors.onSurface},
});


