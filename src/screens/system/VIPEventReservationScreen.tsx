import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  TextInput,
  Switch,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ModalStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const EVENT_MOCK: Record<string, {title: string; date: string; venue: string}> = {
  atrium_gala:   {title: 'The Atrium Gala',          date: 'Dec 15, 2024 · 20:00', venue: 'The Atrium Reserve, Mayfair'},
  jazz_evening:  {title: 'Private Jazz Evening',      date: 'Nov 28, 2024 · 21:30', venue: 'The Blue Note Vault, Soho'},
  sommelier:     {title: 'Sommelier Masterclass',     date: 'Dec 05, 2024 · 19:00', venue: 'The Vault Dining Room'},
  default:       {title: 'Members Exclusive Evening', date: 'Dec 28, 2024 · 20:00', venue: 'Private Members Club'},
};

type ReservationTier = 'standard' | 'premium' | 'platinum';

interface Tier {
  id: ReservationTier; label: string; price: string;
  perks: string[]; icon: string; accentColor: string;
}

const TIERS: Tier[] = [
  {id: 'standard', label: 'Standard',  price: '$850',
    perks: ['Reserved seating', 'Welcome cocktail', 'Event programme'],
    icon: 'star-outline', accentColor: Colors.onSurfaceVariant},
  {id: 'premium',  label: 'Premium',   price: '$1,950',
    perks: ['Priority seating', 'Champagne reception', 'Gift hamper', 'Dedicated host'],
    icon: 'star-half',   accentColor: Colors.info},
  {id: 'platinum', label: 'Platinum',  price: '$3,500',
    perks: ['VIP table front-row', 'Private bar access', 'Exclusive gift', 'Personal concierge', 'After-party access'],
    icon: 'star',        accentColor: Colors.primary},
];

const TIER_BASE_PRICES: Record<ReservationTier, number> = {
  standard: 850, premium: 1950, platinum: 3500,
};

const PLATFORM_FEE = 95;

type Props = NativeStackScreenProps<ModalStackParamList, 'VIPEventReservation'>;

export default function VIPEventReservationScreen({route, navigation}: Props) {
  const {eventId} = route.params;
  const event = EVENT_MOCK[eventId] ?? EVENT_MOCK.default;

  const [selectedTier,   setSelectedTier]   = useState<ReservationTier>('premium');
  const [addCompanion,   setAddCompanion]   = useState(false);
  const [specialRequest, setSpecialRequest] = useState('');

  const demoAlert = (msg: string) => Alert.alert('Coming Soon', msg);

  const basePrice    = TIER_BASE_PRICES[selectedTier];
  const companionFee = addCompanion ? basePrice : 0;
  const total        = basePrice + companionFee + PLATFORM_FEE;

  const handleConfirm = () => {
    Alert.alert(
      'Reservation Submitted',
      'Our concierge team will confirm your VIP reservation within 24 hours. You will receive a confirmation to your registered contact.',
      [{text: 'Done', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}} activeOpacity={0.7}>
          <Icon name="close" size={22} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>VIP Reservation</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Event preview */}
        <View style={styles.eventCard}>
          <View style={styles.eventCardAccent} />
          <View style={styles.eventCardInner}>
            <View style={styles.eventCardRow}>
              <View style={styles.eventCardInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventMeta}>
                  <Icon name="event" size={13} color={Colors.primary} />
                  <Text style={styles.eventMetaText}>{event.date}</Text>
                </View>
                <View style={styles.eventMeta}>
                  <Icon name="place" size={13} color={Colors.onSurfaceVariant} />
                  <Text style={styles.eventMetaText}>{event.venue}</Text>
                </View>
              </View>
              <View style={styles.membersOnlyBadge}>
                <Icon name="workspace-premium" size={12} color={Colors.onPrimary} />
                <Text style={styles.membersOnlyText}>{'MEMBERS\nONLY'}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tier selection */}
        <Text style={styles.sectionLabel}>Select Your Tier</Text>
        {TIERS.map(tier => {
          const isSelected = selectedTier === tier.id;
          return (
            <TouchableOpacity
              key={tier.id}
              style={[styles.tierCard, isSelected && styles.tierCardSelected]}
              onPress={() => setSelectedTier(tier.id)}
              activeOpacity={0.8}>
              <View style={[styles.tierRadio, isSelected && styles.tierRadioSelected]}>
                {isSelected && <View style={styles.tierRadioDot} />}
              </View>
              <View style={styles.tierContent}>
                <View style={styles.tierHeader}>
                  <View style={styles.tierLabelRow}>
                    <Icon name={tier.icon} size={16} color={isSelected ? tier.accentColor : Colors.onSurfaceVariant} />
                    <Text style={[styles.tierLabel, isSelected && {color: tier.accentColor}]}>{tier.label}</Text>
                  </View>
                  <Text style={[styles.tierPrice, isSelected && {color: tier.accentColor}]}>{tier.price}</Text>
                </View>
                <View style={styles.tierPerks}>
                  {tier.perks.map(perk => (
                    <View key={perk} style={styles.perkRow}>
                      <Icon name="check-circle" size={12} color={isSelected ? tier.accentColor : Colors.onSurfaceVariant} />
                      <Text style={[styles.perkText, isSelected && {color: Colors.onSurface}]}>{perk}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Companion toggle */}
        <Text style={styles.sectionLabel}>Companion</Text>
        <View style={styles.companionCard}>
          <View style={styles.companionRow}>
            <View style={styles.companionLeft}>
              <View style={styles.companionIconWrap}>
                <Icon name="person-add" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.companionTitle}>Add Companion</Text>
                <Text style={styles.companionSub}>+${basePrice.toLocaleString()} companion ticket</Text>
              </View>
            </View>
            <Switch
              value={addCompanion}
              onValueChange={setAddCompanion}
              trackColor={{false: Colors.surfaceContainerHighest, true: GOLD_BORDER}}
              thumbColor={addCompanion ? Colors.primary : Colors.onSurfaceVariant}
            />
          </View>
          {addCompanion && (
            <TouchableOpacity
              style={styles.companionCTA}
              onPress={() => demoAlert('Companion browsing will be available in the next release.')}
              activeOpacity={0.8}>
              <Icon name="people" size={16} color={Colors.primary} />
              <Text style={styles.companionCTAText}>Browse & Invite a Companion</Text>
              <Icon name="chevron-right" size={16} color={Colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Contact info */}
        <Text style={styles.sectionLabel}>Contact Information</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactRow}>
            <Icon name="person" size={16} color={Colors.onSurfaceVariant} />
            <View style={styles.contactField}>
              <Text style={styles.contactLabel}>Member Name</Text>
              <Text style={styles.contactValue}>Julian M.</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Icon name="verified" size={13} color={Colors.success} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <Icon name="phone" size={16} color={Colors.onSurfaceVariant} />
            <View style={styles.contactField}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>+1 (···) ··· ····</Text>
            </View>
            <TouchableOpacity onPress={() => demoAlert('Update your contact details in Account Settings.')}>
              <Text style={styles.editLink}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Special requests */}
        <Text style={styles.sectionLabel}>Special Requests</Text>
        <View style={styles.requestCard}>
          <TextInput
            style={styles.requestInput}
            value={specialRequest}
            onChangeText={setSpecialRequest}
            placeholder="Dietary requirements, accessibility needs, seating preferences..."
            placeholderTextColor={Colors.onSurfaceVariant}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Summary */}
        <Text style={styles.sectionLabel}>Reservation Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>{TIERS.find(t => t.id === selectedTier)?.label} Reservation</Text>
            <Text style={styles.summaryValue}>${basePrice.toLocaleString()}</Text>
          </View>
          {addCompanion && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryItem}>Companion Ticket</Text>
              <Text style={styles.summaryValue}>${basePrice.toLocaleString()}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryItem}>Platform Fee</Text>
            <Text style={styles.summaryValue}>${PLATFORM_FEE}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotal}>Total Due</Text>
            <Text style={styles.summaryTotalValue}>${total.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryNote}>
            <Icon name="info-outline" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.summaryNoteText}>Payment is collected only after concierge confirmation</Text>
          </View>
        </View>

        {/* Confirm */}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm} activeOpacity={0.88}>
          <Icon name="workspace-premium" size={20} color={Colors.onPrimary} />
          <Text style={styles.confirmBtnText}>Confirm VIP Reservation</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerNote}>
          <Icon name="shield" size={14} color={Colors.onSurfaceVariant} />
          <Text style={styles.footerNoteText}>All reservations are verified by our concierge team</Text>
        </View>

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: Colors.surface},
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: CARD_BORDER,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {flex: 1, textAlign: 'center', fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},
  headerSpacer: {width: 36},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20},
  sectionLabel: {
    fontFamily: 'Inter-SemiBold', fontSize: 10, letterSpacing: 2,
    color: Colors.onSurfaceVariant, textTransform: 'uppercase',
    marginTop: 20, marginBottom: 10,
  },
  // Event card
  eventCard: {backgroundColor: CARD_BG, borderRadius: 16, borderWidth: 1, borderColor: GOLD_BORDER, overflow: 'hidden'},
  eventCardAccent: {height: 3, backgroundColor: Colors.primary},
  eventCardInner: {padding: 16},
  eventCardRow: {flexDirection: 'row', alignItems: 'flex-start'},
  eventCardInfo: {flex: 1},
  eventTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: Colors.onSurface, marginBottom: 10, lineHeight: 26},
  eventMeta: {flexDirection: 'row', alignItems: 'center', marginBottom: 5, gap: 6},
  eventMetaText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},
  membersOnlyBadge: {
    backgroundColor: Colors.primary, borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 8,
    alignItems: 'center', justifyContent: 'center', marginLeft: 12, gap: 4,
  },
  membersOnlyText: {fontFamily: 'Inter-SemiBold', fontSize: 8, color: Colors.onPrimary, textAlign: 'center', letterSpacing: 0.5},
  // Tier cards
  tierCard: {
    flexDirection: 'row', backgroundColor: CARD_BG, borderRadius: 14,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 14, marginBottom: 10, alignItems: 'flex-start',
  },
  tierCardSelected: {borderColor: GOLD_BORDER, backgroundColor: 'rgba(42,40,32,0.98)'},
  tierRadio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.onSurfaceVariant,
    marginRight: 12, marginTop: 2, alignItems: 'center', justifyContent: 'center',
  },
  tierRadioSelected: {borderColor: Colors.primary},
  tierRadioDot: {width: 9, height: 9, borderRadius: 5, backgroundColor: Colors.primary},
  tierContent: {flex: 1},
  tierHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8},
  tierLabelRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  tierLabel: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  tierPrice: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  tierPerks: {gap: 5},
  perkRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  perkText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  // Companion
  companionCard: {backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER, overflow: 'hidden'},
  companionRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14},
  companionLeft: {flexDirection: 'row', alignItems: 'center', gap: 12},
  companionIconWrap: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  companionTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  companionSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2},
  companionCTA: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, marginHorizontal: 14, marginBottom: 12,
    borderRadius: 10, backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: GOLD_BORDER, gap: 8,
  },
  companionCTAText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
  // Contact
  contactCard: {backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER, paddingHorizontal: 16},
  contactRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12},
  contactField: {flex: 1},
  contactLabel: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, marginBottom: 2},
  contactValue: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  verifiedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(109,217,140,0.10)', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  verifiedText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.success},
  editLink: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
  divider: {height: 1, backgroundColor: CARD_BORDER, marginHorizontal: -16},
  // Special requests
  requestCard: {backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: CARD_BORDER, padding: 14},
  requestInput: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface, minHeight: 90, lineHeight: 22},
  // Summary
  summaryCard: {backgroundColor: CARD_BG, borderRadius: 14, borderWidth: 1, borderColor: GOLD_BORDER, padding: 18},
  summaryRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10},
  summaryItem: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant},
  summaryValue: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  summaryDivider: {height: 1, backgroundColor: CARD_BORDER, marginVertical: 10},
  summaryTotal: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  summaryTotalValue: {fontFamily: 'Inter-SemiBold', fontSize: 20, color: Colors.primary},
  summaryNote: {flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: CARD_BORDER},
  summaryNoteText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, flex: 1},
  // Confirm
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, borderRadius: 14,
    paddingVertical: 16, marginTop: 20, gap: 10,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  confirmBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary},
  footerNote: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16},
  footerNoteText: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
});
