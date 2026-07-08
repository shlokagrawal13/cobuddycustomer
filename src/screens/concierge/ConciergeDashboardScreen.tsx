import React from 'react';
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
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import {useUserStore} from '../../store/userStore';
import type {ConciergeStackParamList, MainTabParamList} from '../../navigation/types';
import Icon from '../../components/ui/Icon';

type Props = CompositeScreenProps<
  NativeStackScreenProps<ConciergeStackParamList, 'ConciergeDashboard'>,
  BottomTabScreenProps<MainTabParamList>
>;

// Support categories from Stitch
const CATEGORIES = [
  {id: 'bookings',  icon: '📋', label: 'Bookings & Reservations', desc: 'Manage upcoming experiences and venue reservations.', accent: 'primary'},
  {id: 'safety',   icon: '🛡',  label: 'Safety & Trust',          desc: 'Report concerns, verification issues, or escalate safety matters.', accent: 'error'},
  {id: 'payments', icon: '💳', label: 'Payments & Refunds',      desc: 'Billing inquiries, receipt requests, and refund processing.', accent: 'primary'},
  {id: 'account',  icon: '⚙',  label: 'Account Assistance',      desc: 'Profile settings, privacy controls, and membership tier details.', accent: 'primary'},
];

const RECENT_CONVO = {
  name: 'Concierge Elena',
  initials: 'E',
  time: '2m ago',
  preview: "I've confirmed your reservation at The Continental...",
};

const QUICK_HELP = [
  {id: 'booking_assistance', icon: '📋', label: 'Booking Help'},
  {id: 'safety_support',    icon: '🛡',  label: 'Safety Concerns'},
  {id: 'payment_help',      icon: '💳', label: 'Payment Issues'},
  {id: 'account_support',   icon: '⚙',  label: 'Account Help'},
];

const demoAlert = () =>
  Alert.alert('Feature Preview', 'This interaction is available in the full production build.');

// Icon maps for dynamic data-driven icon rendering
const CAT_ICON: Record<string, string> = {
  bookings: 'assignment',
  safety: 'security',
  payments: 'credit-card',
  account: 'settings',
};

const CHIP_ICON: Record<string, string> = {
  booking_assistance: 'receipt-long',
  safety_support:     'security',
  payment_help:       'credit-card',
  account_support:    'settings',
};

export default function ConciergeDashboardScreen({navigation}: Props) {
  const profile = useUserStore(s => s.profile);
  const initial = (profile?.name ?? 'J').charAt(0).toUpperCase();

  const openThread = (id: string) =>
    navigation.navigate('MessagingThread', {conversationId: id});
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* ── Standard Root Tab Header: Avatar | Concierge | Search + Bell ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerAvatar} onPress={() => (navigation as any).navigate('ProfileNavigator')} activeOpacity={0.8}>
          <Text style={styles.headerAvatarText}>{initial}</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleWrap} pointerEvents="none">
          <Text style={styles.headerTitle}>Concierge</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => (navigation as any).navigate('SearchNavigator')} activeOpacity={0.7}>
            <Icon name="search" size={18} color={Colors.onSurface} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigation.navigate('Notifications')} activeOpacity={0.7}>
            <Icon name="notifications" size={18} color={Colors.onSurface} />
            <View style={styles.headerNotifDot} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Welcome Hero ──
            SAFE RN PATTERN: outer heroCardShadow holds elevation only (no overflow).
            Inner heroCard holds overflow:hidden + borderRadius only (no elevation).
            Prevents Fabric native renderer crash on Android. */}
        <View style={styles.heroCardShadow}>
          <View style={styles.heroCard}>
            {/* Cinematic bg icon placeholder */}
            <View style={styles.heroBg}>
              <View style={{opacity: 0.15}}>
                <Icon name="hotel" size={80} color={Colors.onSurface} />
              </View>
            </View>
            {/* Gradient overlay — uses absoluteFill (top/left/right/bottom:0) instead of
                height:'100%' which crashes Yoga when parent has only minHeight */}
            <View style={styles.heroGradient} />
            <View style={styles.heroContent}>
              <View style={styles.heroBadge}>
                <View style={styles.heroBadgePulse} />
                <Text style={styles.heroBadgeText}>Premium Member Care</Text>
              </View>
              <Text style={styles.heroTitle}>
                How Can We Assist{'\n'}You Today?
              </Text>
              <Text style={styles.heroSub}>
                Premium support for trusted experiences, bookings, safety, and account assistance.
              </Text>
            </View>
          </View>
        </View>

        <View style={{height: 16}} />

        {/* Live Support Card — same safe outer shadow + inner clipped pattern */}
        <View style={styles.liveCardShadow}>
          <View style={styles.liveCard}>
            <View style={styles.liveCardGlow} />
            <View style={styles.liveCardTop}>
              <View style={styles.liveIconWrap}>
                <Icon name="support-agent" size={26} color={Colors.primary} />
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>Online Now</Text>
              </View>
            </View>
            <Text style={styles.liveCardTitle}>Live Concierge Available</Text>
            <Text style={styles.liveCardSub}>
              Connect with a dedicated specialist for immediate assistance.
            </Text>
            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => openThread('live_001')}
              activeOpacity={0.8}>
              <Icon name="chat" size={18} color={Colors.onPrimary} />
              <Text style={styles.startBtnText}>Start Conversation</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* marginBottom spacer — replaces scrollContent gap:16 */}
        <View style={{height: 16}} />

        {/* Quick Help Chips — horizontal scroll row (Stitch reference) */}
        <View style={styles.quickHelpCard}>
          <Text style={styles.quickHelpLabel}>QUICK ASSISTANCE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickHelpRow}>
            {QUICK_HELP.map(q => (
              <TouchableOpacity
                key={q.id}
                style={styles.quickChip}
                onPress={() => openThread(q.id)}
                activeOpacity={0.8}>
                <Icon name={CHIP_ICON[q.id] ?? 'help'} size={18} color={Colors.primary} />
                <Text style={styles.quickChipText}>{q.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{height: 16}} />

        {/* Active Conversations */}
        <View style={styles.convoCard}>
          <View style={styles.convoHeader}>
            <Text style={styles.convoHeaderLabel}>ACTIVE CONVERSATIONS</Text>
            <TouchableOpacity onPress={() => openThread('convo_001')} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.convoItem}
            onPress={() => openThread('convo_001')}
            activeOpacity={0.8}>
            <View style={styles.convoAvatar}>
              <Text style={styles.convoAvatarText}>{RECENT_CONVO.initials}</Text>
              <View style={styles.convoOnlineDot} />
            </View>
            <View style={styles.convoMeta}>
              <View style={styles.convoMetaRow}>
                <Text style={styles.convoName}>{RECENT_CONVO.name}</Text>
                <Text style={styles.convoTime}>{RECENT_CONVO.time}</Text>
              </View>
              <Text style={styles.convoPreview} numberOfLines={1}>
                {RECENT_CONVO.preview}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 16}} />

        {/* ── Support Categories ── */}
        <Text style={styles.categoriesTitle}>Support Categories</Text>
        <View style={{marginBottom: 10}} />
        {/* Row 1 */}
        <View style={styles.catRow}>
          <TouchableOpacity
            style={styles.catCard}
            onPress={() => navigation.navigate('HelpArticle', {categoryId: 'bookings'})}
            activeOpacity={0.8}>
            <View style={styles.catIconWrap}>
              <Icon name="assignment" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.catLabel}>Bookings</Text>
            <Text style={styles.catDesc}>Manage upcoming experiences and reservations.</Text>
          </TouchableOpacity>
          <View style={{width: 12}} />
          <TouchableOpacity
            style={[styles.catCard, styles.catCardError]}
            onPress={() => navigation.navigate('HelpArticle', {categoryId: 'safety'})}
            activeOpacity={0.8}>
            <View style={[styles.catIconWrap, styles.catIconWrapError]}>
              <Icon name="security" size={22} color={Colors.error} />
            </View>
            <Text style={styles.catLabel}>Safety</Text>
            <Text style={styles.catDesc}>Report concerns or escalate safety matters.</Text>
          </TouchableOpacity>
          <View style={{height: 2}} />
        </View>
        <View style={{marginBottom: 16}} />

        {/* Row 2 */}
        <View style={styles.catRow}>
          <TouchableOpacity
            style={styles.catCard}
            onPress={() => navigation.navigate('HelpArticle', {categoryId: 'payments'})}
            activeOpacity={0.8}>
            <View style={styles.catIconWrap}>
              <Icon name="credit-card" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.catLabel}>Payments</Text>
            <Text style={styles.catDesc}>Billing inquiries and refund processing.</Text>
          </TouchableOpacity>
          <View style={{width: 12}} />
          <TouchableOpacity
            style={styles.catCard}
            onPress={() => navigation.navigate('HelpArticle', {categoryId: 'account'})}
            activeOpacity={0.8}>
            <View style={styles.catIconWrap}>
              <Icon name="settings" size={22} color={Colors.primary} />
            </View>
            <Text style={styles.catLabel}>Account</Text>
            <Text style={styles.catDesc}>Profile settings, privacy and membership.</Text>
          </TouchableOpacity>
        </View>
        <View style={{marginBottom: 16}} />

        {/* ── Escalation Banner ── */}
        <View style={styles.escalationBanner}>
          <View style={styles.escalationLeft}>
            <View style={styles.escalationIconWrap}>
              <Icon name="priority-high" size={24} color={Colors.error} />
            </View>
            <View style={styles.escalationText}>
              <Text style={styles.escalationTitle}>Priority Concierge Escalation</Text>
              <Text style={styles.escalationSub}>
                Immediate assistance for urgent safety concerns or critical membership issues.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.escalateBtn}
            onPress={() =>
              (navigation as any).navigate('SafetyNavigator', {
                screen: 'IncidentReport',
                params: {},
              })
            }
            activeOpacity={0.8}>
            <Icon name="call" size={16} color={Colors.onPrimary} />
            <Text style={styles.escalateBtnText}>Escalate Issue</Text>
          </TouchableOpacity>
        </View>
        <View style={{height: 24}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surfaceContainerLowest},

  // ── Standard Root Tab Header ──
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: {fontSize: 13, fontWeight: '600', color: Colors.primary},
  headerTitleWrap: {position: 'absolute', left: 0, right: 0, alignItems: 'center'},
  headerTitle: {fontSize: 18, fontWeight: '600', color: Colors.onSurface, letterSpacing: 0.2},
  headerRight: {flexDirection: 'row', gap: 8},
  headerIconBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerIconText: {fontSize: 15},
  headerNotifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: Colors.error,
  },

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32},

  // ── Hero (safe shadow/clip split) ──
  // Outer: elevation + shadow only — NO overflow:'hidden'
  heroCardShadow: {
    borderRadius: 24,
    backgroundColor: 'rgba(11,13,26,0.4)',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.05,
    shadowRadius: 40,
    elevation: 4,
  },
  // Inner: overflow:hidden + borderRadius — NO elevation
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 260,
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    position: 'relative',
  },
  heroBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },
  heroBgIcon: {fontSize: 100},
  // FIX: was height:'100%' on absolute child of minHeight parent → Yoga crash.
  // Now uses top/left/right/bottom:0 (absoluteFill equivalent) — always safe.
  heroGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(5,8,22,0.65)',
  },
  heroContent: {
    padding: 28,
    justifyContent: 'flex-end',
    flex: 1,
    gap: 10,
    minHeight: 260,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  heroBadgePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryContainer,
  },
  heroBadgeText: {fontSize: 11, letterSpacing: 1.5, color: Colors.primary, fontWeight: '600'},
  heroTitle: {
    fontSize: 30,
    fontWeight: '600',
    color: Colors.onSurface,
    lineHeight: 38,
    letterSpacing: -0.3,
  },
  heroSub: {fontSize: 15, color: Colors.onSurfaceVariant, lineHeight: 22},

  // ── Live support card (safe shadow/clip split) ──
  // Outer: elevation + shadow — NO overflow:'hidden'
  liveCardShadow: {
    borderRadius: 24,
    backgroundColor: 'rgba(11,13,26,0.4)',
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 3,
  },
  // Inner: overflow:hidden — NO elevation
  liveCard: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    position: 'relative',
    gap: 10,
  },
  liveCardGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  liveCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIconText: {fontSize: 20},
  liveBadge: {flexDirection: 'row', alignItems: 'center', gap: 5},
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  liveBadgeText: {fontSize: 10, letterSpacing: 1, color: Colors.onSurfaceVariant, fontWeight: '600'},
  liveCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.onSurface,
    lineHeight: 25,
  },
  liveCardSub: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    opacity: 0.8,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primaryContainer,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 4,
  },
  startBtnIcon: {fontSize: 14},
  startBtnText: {fontSize: 13, color: Colors.onPrimary, fontWeight: '600', letterSpacing: 0.3},

  // ── Quick Help (horizontal scroll row as per Stitch) ──
  quickHelpCard: {
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
  },
  quickHelpLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
    marginBottom: 12,
  },
  quickHelpRow: {gap: 8, paddingBottom: 2},
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    backgroundColor: Colors.surface,
  },
  quickChipIcon: {fontSize: 13},
  quickChipText: {fontSize: 12, color: Colors.onSurface, fontWeight: '400'},

  // ── Active conversations ──
  convoCard: {
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 14,
  },
  convoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  convoHeaderLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  viewAllText: {fontSize: 12, color: Colors.primary, fontWeight: '500'},
  convoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
    borderRadius: 12,
  },
  convoAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1.5,
    borderColor: 'rgba(242,202,80,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  convoAvatarText: {fontSize: 14, fontWeight: '600', color: Colors.primary},
  convoOnlineDot: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  convoMeta: {flex: 1},
  convoMetaRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2},
  convoName: {fontSize: 13, fontWeight: '600', color: Colors.onSurface},
  convoTime: {fontSize: 11, color: Colors.onSurfaceVariant},
  convoPreview: {fontSize: 11, color: Colors.onSurfaceVariant, opacity: 0.7},

  // ── Support categories (2-col wrap grid) ──
  categoriesTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  // Two-per-row explicit layout — no flexWrap, no gap, no percentage sizing
  catRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  catCard: {
    flex: 1,
    minHeight: 120,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 16,
  },
  catCardError: {
    borderColor: 'rgba(255,180,171,0.25)',
  },
  catIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  catIconWrapError: {
    backgroundColor: 'rgba(255,180,171,0.10)',
    borderColor: 'rgba(255,180,171,0.3)',
  },
  catLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: Colors.onSurface,
    marginBottom: 4,
  },
  catDesc: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    lineHeight: 15,
  },

  // ── Escalation banner ──
  escalationBanner: {
    backgroundColor: 'rgba(11,13,26,0.4)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.2)',
    overflow: 'hidden',
  },
  escalationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 20,
    paddingBottom: 12,
  },
  escalationIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,180,171,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  escalationIcon: {fontSize: 20},
  escalationText: {flex: 1},
  escalationTitle: {fontSize: 16, fontWeight: '600', color: Colors.onSurface, marginBottom: 4},
  escalationSub: {fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18, opacity: 0.7},
  escalateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.3)',
  },
  escalateIcon: {fontSize: 14},
  escalateBtnText: {
    fontSize: 12,
    letterSpacing: 1.5,
    color: Colors.error,
    fontWeight: '600',
  },
});


