import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SessionsStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch ref: tip_gratuity_screen

type Props = NativeStackScreenProps<SessionsStackParamList, 'TipGratuity'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const TIP_AMOUNTS = [50, 100, 250, 500];

const MESSAGES = [
  'Thank you for the thoughtful experience',
  'Loved the conversation',
  'Very comfortable and respectful',
];

const TRUST_BADGES = [
  {icon: 'lock',     label: 'Secure Payment'},
  {icon: 'favorite', label: 'Optional Gratitude'},
  {icon: 'policy',   label: 'Platform Protected'},
];

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');


export default function TipGratuityScreen({navigation, route}: Props) {
  const {sessionId} = route.params;
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const handleSend = () => {
    const amount = selectedAmount ?? 0;
    Alert.alert(
      'Gratitude Sent',
      'Your appreciation has been shared securely. Thank you!',
      [
        {
          text: 'Done',
          onPress: () => navigation.navigate('PastSessionDetail', {sessionId}),
        },
      ],
    );
  };

  const handleSkip = () => {
    navigation.navigate('PastSessionDetail', {sessionId});
  };

  const handleCustom = () => {
    Alert.alert(
      'Custom Amount',
      'Enter a custom tip amount in the full production build.',
      [{text: 'OK'}],
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <SafeAreaView edges={['top']} style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gratitude</Text>
        <View style={styles.backBtn} />
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Companion Summary */}
        <View style={styles.companionCard}>
          <View style={styles.companionTop}>
            <View style={styles.companionIconWrap}>
              <Icon name="support-agent" size={32} color={Colors.primary} />
            </View>
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={12} color={Colors.success} />
            </View>
          </View>
          <Text style={styles.companionName}>Julianne</Text>
          <View style={styles.companionDetailRow}>
            <Icon name="location-on" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.companionDetailText}>The Oberoi, Mumbai</Text>
          </View>
          <View style={styles.companionDetailRow}>
            <Icon name="calendar-today" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.companionDetailText}>Sep 5, 2024 - 10:30 PM</Text>
          </View>
          <View style={styles.companionDetailRow}>
            <Icon name="schedule" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.companionDetailText}>Duration: 1 Hour</Text>
          </View>
          {/* Safety chips */}
          <View style={styles.safetyChipsRow}>
            <View style={styles.safetyChip}>
              <Icon name="security" size={11} color={Colors.success} />
              <Text style={styles.safetyChipText}>Session Completed Safely</Text>
            </View>
            <View style={styles.safetyChip}>
              <Icon name="workspace-premium" size={11} color={Colors.primary} />
              <Text style={[styles.safetyChipText, {color: Colors.primary}]}>Concierge Protected</Text>
            </View>
          </View>
        </View>

        {/* Appreciation heading */}
        <View style={styles.headingBlock}>
          <Text style={styles.headingTitle}>Add A Gesture Of Appreciation</Text>
          <Text style={styles.headingSub}>
            If this trusted hospitality experience felt meaningful, you may add an optional gratitude amount.
          </Text>
        </View>

        {/* Amount selection */}
        <View style={styles.card}>
          <View style={styles.amountGrid}>
            {TIP_AMOUNTS.map(amt => (
              <TouchableOpacity
                key={amt}
                style={[
                  styles.amountChip,
                  selectedAmount === amt && styles.amountChipSelected,
                ]}
                onPress={() => setSelectedAmount(selectedAmount === amt ? null : amt)}
                activeOpacity={0.8}>
                <Text
                  style={[
                    styles.amountChipText,
                    selectedAmount === amt && styles.amountChipTextSelected,
                  ]}>
                  {amt}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.amountChip, styles.amountChipCustom]}
              onPress={handleCustom}
              activeOpacity={0.8}>
              <Icon name="edit" size={13} color={Colors.onSurfaceVariant} />
              <Text style={styles.amountChipText}>Custom</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.optionalNote}>Optional and fully your choice.</Text>
        </View>

        {/* Appreciation messages */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Add a Message</Text>
          {MESSAGES.map((msg, i) => (
            <TouchableOpacity
              key={msg}
              style={[
                styles.messageRow,
                i < MESSAGES.length - 1 && styles.messageRowBorder,
                selectedMessage === i && styles.messageRowSelected,
              ]}
              onPress={() => setSelectedMessage(selectedMessage === i ? null : i)}
              activeOpacity={0.8}>
              <View style={[
                styles.messageRadio,
                selectedMessage === i && styles.messageRadioSelected,
              ]}>
                {selectedMessage === i && (
                  <View style={styles.messageRadioDot} />
                )}
              </View>
              <Text style={[
                styles.messageText,
                selectedMessage === i && {color: Colors.onSurface},
              ]}>
                {msg}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <Icon name="account-balance-wallet" size={18} color={Colors.primary} />
            <View style={styles.paymentMeta}>
              <Text style={styles.paymentLabel}>CoBuddy Wallet</Text>
              <Text style={styles.paymentBalance}>1,240.00 credits available</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                (navigation as any).navigate('ProfileNavigator', {screen: 'PaymentMethods'})
              }
              activeOpacity={0.7}>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Trust badges */}
        <View style={styles.trustBadgesRow}>
          {TRUST_BADGES.map(b => (
            <View key={b.icon} style={styles.trustBadge}>
              <Icon name={b.icon} size={14} color={Colors.onSurfaceVariant} />
              <Text style={styles.trustBadgeText}>{b.label}</Text>
            </View>
          ))}
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerRow}>
          <Icon name="verified-user" size={14} color={Colors.onSurfaceVariant} />
          <Text style={styles.disclaimerText}>
            Tips are optional, secure, and processed through CoBuddy. No off-platform payment is encouraged.
          </Text>
        </View>

        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Gratitude</Text>
          <Text style={styles.totalValue}>
            {selectedAmount != null ? selectedAmount.toString() : '--'}
          </Text>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* Bottom CTAs */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend} activeOpacity={0.88}>
          <Icon name="favorite" size={16} color={Colors.onPrimary} />
          <Text style={styles.sendBtnText}>Send Gratitude</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.8}>
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 16, gap: 14},

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {width: 36, height: 36, alignItems: 'center', justifyContent: 'center'},
  headerTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: Colors.onSurface},

  // Companion card
  companionCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER, padding: 20,
    alignItems: 'center', gap: 10,
  },
  companionTop: {position: 'relative', width: 64},
  companionIconWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute', bottom: 0, right: 0,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.surface,
  },
  companionName: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: Colors.onSurface},
  companionDetailRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  companionDetailText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  safetyChipsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 4},
  safetyChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(109,217,140,0.10)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.28)',
  },
  safetyChipText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success},

  // Heading
  headingBlock: {gap: 6},
  headingTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  headingSub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 20},

  // Generic card
  card: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  cardTitle: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},

  // Amount grid
  amountGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  amountChip: {
    flex: 1, minWidth: 72, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 12, paddingVertical: 14,
    borderWidth: 1, borderColor: CARD_BORDER,
    flexDirection: 'row', gap: 6,
  },
  amountChipSelected: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  amountChipCustom: {backgroundColor: Colors.surfaceContainerHigh},
  amountChipText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  amountChipTextSelected: {color: Colors.onPrimary},
  optionalNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, textAlign: 'center'},

  // Messages
  messageRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12,
  },
  messageRowBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER},
  messageRowSelected: {
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 12, paddingHorizontal: 8,
    borderLeftWidth: 2, borderLeftColor: Colors.primary,
  },
  messageRadio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.onSurfaceVariant,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  messageRadioSelected: {borderColor: Colors.primary},
  messageRadioDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  messageText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Payment
  paymentRow: {flexDirection: 'row', alignItems: 'center', gap: 12},
  paymentMeta: {flex: 1},
  paymentLabel: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.onSurface},
  paymentBalance: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginTop: 2},
  changeLink: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},

  // Trust badges
  trustBadgesRow: {flexDirection: 'row', justifyContent: 'space-around'},
  trustBadge: {alignItems: 'center', gap: 6},
  trustBadgeText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, textAlign: 'center'},

  // Disclaimer
  disclaimerRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 14, padding: 14, borderWidth: 1, borderColor: CARD_BORDER,
  },
  disclaimerText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},

  // Total
  totalRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: GOLD_BORDER,
    paddingHorizontal: 18, paddingVertical: 14,
  },
  totalLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  totalValue: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.primary},

  // Bottom
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.97)',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4, gap: 8,
  },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 100, paddingVertical: 15,
  },
  sendBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
  skipBtn: {alignItems: 'center', justifyContent: 'center', paddingVertical: 8},
  skipBtnText: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
});
