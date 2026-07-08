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
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ProfileStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MembershipCancel'>;

const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const CANCEL_REASONS = [
  'Too expensive',
  'Not using it',
  'Found an alternative',
  'Taking a break',
];

const LOSSES = [
  {icon: 'bolt',          text: 'Priority companion booking access'},
  {icon: 'support-agent', text: 'Dedicated 24/7 concierge service'},
  {icon: 'diamond',       text: 'Exclusive event and venue access'},
  {icon: 'security',      text: 'Advanced safety monitoring suite'},
  {icon: 'star',          text: 'Trust score benefits and visibility'},
];

export default function MembershipCancelScreen({navigation}: Props) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handlePause = () =>
    Alert.alert('Pause Membership', 'Membership pause feature available soon.');

  const handleCancel = () => {
    Alert.alert(
      'Cancel Membership',
      'This will end your membership at the current billing period end. You will retain all access until 30 Jul 2025.',
      [
        {text: 'Go Back', style: 'cancel'},
        {
          text: 'Cancel Membership',
          style: 'destructive',
          onPress: () =>
            Alert.alert(
              'Cancellation Submitted',
              'Your cancellation has been submitted. You will retain access until 30 Jul 2025.',
              [{text: 'OK', onPress: () => navigation.goBack()}],
            ),
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cancel Membership</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Warning hero */}
        <View style={styles.warningHero}>
          <View style={styles.warningIconWrap}>
            <Icon name="warning" size={24} color={Colors.error} />
          </View>
          <Text style={styles.warningTitle}>Are You Sure?</Text>
          <Text style={styles.warningSub}>
            Cancelling your membership will end your access to CoBuddy premium features at the end of your current billing cycle.
          </Text>
          <View style={styles.activeBadge}>
            <Icon name="verified" size={13} color={Colors.success} />
            <Text style={styles.activeBadgeText}>Elite Member  |  Active until 30 Jul 2025</Text>
          </View>
        </View>

        {/* What you will lose */}
        <Text style={styles.sectionLabel}>WHAT YOU WILL LOSE</Text>
        <View style={styles.card}>
          {LOSSES.map((item, idx) => (
            <View key={item.icon}>
              <View style={styles.lossRow}>
                <View style={styles.lossIconWrap}>
                  <Icon name={item.icon} size={16} color={Colors.onSurfaceVariant} />
                </View>
                <Text style={styles.lossText}>{item.text}</Text>
                <Icon name="cancel" size={16} color={Colors.error} />
              </View>
              {idx < LOSSES.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Pause alternative */}
        <View style={styles.pauseCard}>
          <View style={styles.pauseRecommendBadge}>
            <Text style={styles.pauseRecommendText}>RECOMMENDED</Text>
          </View>
          <View style={styles.pauseHeader}>
            <View style={styles.pauseIconWrap}>
              <Icon name="schedule" size={18} color={Colors.primary} />
            </View>
            <View style={styles.pauseMeta}>
              <Text style={styles.pauseTitle}>Pause Instead of Cancel</Text>
              <Text style={styles.pauseSub}>
                Put your membership on hold for up to 3 months without losing your data or Trust Score.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.pauseBtn} onPress={handlePause} activeOpacity={0.7}>
            <Text style={styles.pauseBtnText}>Pause Membership</Text>
          </TouchableOpacity>
        </View>

        {/* Reason selection */}
        <Text style={styles.sectionLabel}>TELL US WHY (OPTIONAL)</Text>
        <View style={styles.reasonsWrap}>
          {CANCEL_REASONS.map(reason => (
            <TouchableOpacity
              key={reason}
              style={[
                styles.reasonPill,
                selectedReason === reason && styles.reasonPillSelected,
              ]}
              onPress={() => setSelectedReason(prev => prev === reason ? null : reason)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.reasonPillText,
                  selectedReason === reason && styles.reasonPillTextSelected,
                ]}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTAs */}
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8}>
          <Icon name="cancel" size={18} color={Colors.onError} />
          <Text style={styles.cancelBtnText}>Cancel Membership</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.keepBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.keepBtnText}>Keep My Membership</Text>
        </TouchableOpacity>

        <View style={{height: 32}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.error, letterSpacing: 0.2,
  },
  headerSpacer: {width: 40},

  scroll: {flex: 1},
  scrollContent: {paddingTop: 20, paddingHorizontal: 16},

  warningHero: {
    backgroundColor: 'rgba(147,0,10,0.08)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.18)',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  warningIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,180,171,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,180,171,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  warningTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 24,
    color: Colors.onSurface, marginBottom: 10, textAlign: 'center',
  },
  warningSub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant, textAlign: 'center',
    lineHeight: 21, marginBottom: 16,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(109,217,140,0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(109,217,140,0.2)',
    paddingHorizontal: 12, paddingVertical: 6,
  },
  activeBadgeText: {
    fontFamily: 'Inter-Medium', fontSize: 12,
    color: Colors.success,
  },

  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 11,
    letterSpacing: 1.5, color: Colors.onSurfaceVariant,
    marginBottom: 8, paddingLeft: 4, marginTop: 4,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
    marginBottom: 24,
  },

  lossRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  lossIconWrap: {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.surfaceContainerHighest,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  lossText: {
    flex: 1,
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 16,
  },

  pauseCard: {
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    padding: 16,
    marginBottom: 24,
    gap: 14,
  },
  pauseRecommendBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryContainer,
    borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  pauseRecommendText: {
    fontFamily: 'Inter-SemiBold', fontSize: 9,
    color: Colors.primary, letterSpacing: 0.8,
  },
  pauseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  pauseIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  pauseMeta: {flex: 1},
  pauseTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 15,
    color: Colors.onSurface, marginBottom: 4,
  },
  pauseSub: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },
  pauseBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.35)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  pauseBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.primary,
  },

  reasonsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  reasonPill: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    backgroundColor: Colors.surfaceContainerHighest,
    paddingHorizontal: 14, paddingVertical: 9,
  },
  reasonPillSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.1)',
  },
  reasonPillText: {
    fontFamily: 'Inter-Medium', fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  reasonPillTextSelected: {
    color: Colors.primary,
  },

  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.errorContainer,
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.2)',
  },
  cancelBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 16,
    color: Colors.onErrorContainer,
  },
  keepBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  keepBtnText: {
    fontFamily: 'Inter-SemiBold', fontSize: 15,
    color: Colors.onSurface,
  },
});
