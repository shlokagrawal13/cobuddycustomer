import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {FeatureFlags} from '../../config/featureFlags';

type Props = NativeStackScreenProps<HomeStackParamList, 'EventDetail'>;

const CARD_BG     = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const demoAlert = () =>
  Alert.alert('Coming Soon', 'This feature will be available in the next phase.');

// Mock event data keyed by eventId
const EVENT_DATA: Record<string, {title: string; date: string; time: string; venue: string; dresscode: string; capacity: string; host: string; description: string; iconName: string; badge: string}> = {
  atrium_gala: {
    title: 'The Atrium Gala',
    date: 'December 15, 2024',
    time: '20:00 – 23:30',
    venue: 'The Atrium Reserve, Mayfair',
    dresscode: 'Black Tie',
    capacity: '48 seats',
    host: 'The Atrium Society',
    description: 'An intimate evening of haute cuisine, curated live jazz, and exquisite company. Guests will enjoy a seven-course tasting menu with paired vintages selected by our resident sommelier. Admission is by invitation only.',
    iconName: 'celebration',
    badge: 'VIP EXCLUSIVE',
  },
  jazz_evening: {
    title: 'Private Jazz Evening',
    date: 'November 28, 2024',
    time: '21:30 – 00:30',
    venue: 'The Blue Note Vault, Soho',
    dresscode: 'Smart Casual',
    capacity: '24 seats',
    host: 'Julian M.',
    description: 'A curated acoustic jazz experience in one of London\'s most intimate heritage venues. Featuring an internationally acclaimed quartet, craft cocktails, and a selection of small plates.',
    iconName: 'music-note',
    badge: 'MEMBERS ONLY',
  },
  sommelier: {
    title: 'Sommelier Masterclass',
    date: 'December 5, 2024',
    time: '19:00 – 21:30',
    venue: 'The Vault Dining Room',
    dresscode: 'Smart Casual',
    capacity: '16 seats',
    host: 'Maître Henri LeBlanc',
    description: 'A rare private tasting led by Michelin-starred sommelier Henri LeBlanc. Explore fifteen curated pours spanning three decades, with expert commentary on provenance, terroir, and pairing philosophy.',
    iconName: 'wine-bar',
    badge: 'CURATED',
  },
};

const GUEST_INITIALS = ['A', 'M', 'T'];

const TIME_SLOTS = ['19:00', '20:00', '21:30'];

export default function EventDetailScreen({navigation, route}: Props) {
  const {eventId} = route.params;
  const event = EVENT_DATA[eventId] ?? EVENT_DATA.atrium_gala;
  const [selectedSlot, setSlot] = useState(TIME_SLOTS[1]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{event.title}</Text>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() =>
            Share.share({
              title: event.title,
              message:
                'Exclusive event on CoBuddy: ' +
                event.title +
                ' — ' +
                event.date +
                ' at ' +
                event.venue +
                '. RSVP through the CoBuddy app.',
            }).catch(() => {})
          }
          activeOpacity={0.7}>
          <Icon name="share" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroImgWrap}>
            <View style={styles.heroImgBg}>
              <Icon name={event.iconName} size={80} color={Colors.onSurface} />
            </View>
            <View style={styles.heroOverlay} />
            {/* VIP badge */}
            <View style={styles.vipBadge}>
              <Text style={styles.vipBadgeText}>{event.badge}</Text>
            </View>
            {/* Date chip bottom left */}
            <View style={styles.heroDateChip}>
              <Icon name="event" size={12} color={Colors.primary} />
              <Text style={styles.heroDateText}>{event.date}</Text>
            </View>
          </View>
          {/* Title overlay */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroTitle}>{event.title}</Text>
            <View style={styles.heroMeta}>
              <Icon name="place" size={13} color={Colors.onSurfaceVariant} />
              <Text style={styles.heroMetaText} numberOfLines={1}>{event.venue}</Text>
            </View>
          </View>
        </View>

        {/* Quick info row */}
        <View style={styles.quickInfoRow}>
          {[
            {icon: 'schedule', label: event.time},
            {icon: 'checkroom', label: event.dresscode},
            {icon: 'group', label: event.capacity},
          ].map(item => (
            <View key={item.icon} style={styles.quickInfoItem}>
              <View style={styles.quickInfoIconWrap}>
                <Icon name={item.icon} size={16} color={Colors.primary} />
              </View>
              <Text style={styles.quickInfoText} numberOfLines={1}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Host row */}
        <View style={styles.hostCard}>
          <View style={styles.hostAvatar}>
            <Text style={styles.hostAvatarText}>{event.host.charAt(0)}</Text>
          </View>
          <View style={styles.hostMeta}>
            <Text style={styles.hostName}>{event.host}</Text>
            <View style={styles.hostBadge}>
              <Icon name="verified" size={11} color={Colors.success} />
              <Text style={styles.hostBadgeText}>VERIFIED HOST</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>

        {/* Guests */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attending</Text>
          <View style={styles.guestRow}>
            {GUEST_INITIALS.map(g => (
              <View key={g} style={styles.guestAvatar}>
                <Text style={styles.guestAvatarText}>{g}</Text>
              </View>
            ))}
            <View style={styles.guestMore}>
              <Text style={styles.guestMoreText}>+12</Text>
            </View>
            <Text style={styles.guestLabel}>attending</Text>
          </View>
        </View>

        {/* Time slot selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.slotRow}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, slot === selectedSlot && styles.slotChipActive]}
                onPress={() => setSlot(slot)}
                activeOpacity={0.8}>
                <Text style={[styles.slotChipText, slot === selectedSlot && styles.slotChipTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Companion pairing */}
        <TouchableOpacity
          style={styles.companionPairingCard}
          onPress={() => navigation.navigate('CompanionBrowse')}
          activeOpacity={0.88}>
          <View style={styles.companionPairingIcon}>
            <Icon name="person-add" size={22} color={Colors.primary} />
          </View>
          <View style={styles.companionPairingMeta}>
            <Text style={styles.companionPairingTitle}>Find a Companion</Text>
            <Text style={styles.companionPairingSub}>Browse trusted companions for this event</Text>
          </View>
          <Icon name="chevron-right" size={18} color={Colors.primary} />
        </TouchableOpacity>

        {/* CTA */}
        {FeatureFlags.VIP_EVENTS && (
          <TouchableOpacity
            style={styles.ctaPrimary}
            onPress={() =>
              (navigation as any).navigate('ModalNavigator', {
                screen: 'VIPEventReservation',
                params: {eventId},
              })
            }
            activeOpacity={0.88}>
            <Icon name="star" size={18} color={Colors.onPrimary} />
            <Text style={styles.ctaPrimaryText}>Reserve Your Place</Text>
          </TouchableOpacity>
        )}

        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 0,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.92)',
  },
  headerBackBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface,
  },
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, gap: 16},
  // Hero
  heroCard: {borderRadius: 24, overflow: 'hidden', backgroundColor: Colors.surfaceContainerHigh},
  heroImgWrap: {height: 220, position: 'relative', alignItems: 'center', justifyContent: 'center'},
  heroImgBg: {opacity: 0.12},
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
    backgroundColor: 'rgba(14,14,10,0.92)',
  },
  vipBadge: {
    position: 'absolute', top: 14, right: 14,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
  },
  vipBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.5, color: Colors.onSurface},
  heroDateChip: {
    position: 'absolute', bottom: 56, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(242,202,80,0.12)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  heroDateText: {fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.primary},
  heroBottom: {padding: 16, gap: 6},
  heroTitle: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: Colors.onSurface, lineHeight: 30},
  heroMeta: {flexDirection: 'row', alignItems: 'center', gap: 4},
  heroMetaText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant, flex: 1},
  // Quick info
  quickInfoRow: {flexDirection: 'row', gap: 10},
  quickInfoItem: {
    flex: 1, alignItems: 'center', gap: 8,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    paddingVertical: 14,
  },
  quickInfoIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  quickInfoText: {fontFamily: 'Inter-Medium', fontSize: 11, color: Colors.onSurface, textAlign: 'center'},
  // Host
  hostCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 14,
  },
  hostAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryContainer,
    borderWidth: 1.5, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  hostAvatarText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.primary},
  hostMeta: {flex: 1, gap: 4},
  hostName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  hostBadge: {flexDirection: 'row', alignItems: 'center', gap: 4},
  hostBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 9, letterSpacing: 1.5, color: Colors.success},
  // Section
  section: {gap: 10},
  sectionTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  description: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22},
  // Guests
  guestRow: {flexDirection: 'row', alignItems: 'center', gap: 6},
  guestAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1.5, borderColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: -8,
  },
  guestAvatarText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.primary},
  guestMore: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1.5, borderColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
    marginLeft: -8,
  },
  guestMoreText: {fontFamily: 'Inter-SemiBold', fontSize: 11, color: Colors.primary},
  guestLabel: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginLeft: 6},
  // Slots
  slotRow: {flexDirection: 'row', gap: 10},
  slotChip: {
    flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center',
    backgroundColor: CARD_BG, borderWidth: 1, borderColor: CARD_BORDER,
  },
  slotChipActive: {backgroundColor: 'rgba(242,202,80,0.12)', borderColor: GOLD_BORDER},
  slotChipText: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurfaceVariant},
  slotChipTextActive: {color: Colors.primary, fontFamily: 'Inter-SemiBold'},
  // Companion pairing
  companionPairingCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: GOLD_BORDER,
  },
  companionPairingIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(242,202,80,0.10)', borderWidth: 1, borderColor: GOLD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  companionPairingMeta: {flex: 1},
  companionPairingTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  companionPairingSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 3},
  // CTA
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    paddingVertical: 16, borderRadius: 16, backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  ctaPrimaryText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onPrimary},
});
