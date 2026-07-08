import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ConciergeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// ─── Types ───────────────────────────────────────────────────────────────────

type NotificationType = 'booking' | 'safety' | 'concierge' | 'system';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

type FilterKey = 'ALL' | 'UNREAD' | 'BOOKINGS' | 'SAFETY';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'concierge',
    title: 'Concierge Elena',
    body: 'Your reservation at The Continental has been confirmed for tonight at 8pm.',
    time: '2m ago',
    read: false,
  },
  {
    id: '2',
    type: 'booking',
    title: 'Booking Confirmed',
    body: 'Private Dining at The Atrium — Tonight, 19:00. Your digital pass is ready.',
    time: '1h ago',
    read: false,
  },
  {
    id: '3',
    type: 'safety',
    title: 'Safety Check-in',
    body: 'Your trusted contacts have been notified of your upcoming session.',
    time: '3h ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Profile Verification',
    body: 'Your identity verification badge has been renewed successfully.',
    time: 'Yesterday',
    read: true,
  },
];

// ─── Icon Config ──────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  NotificationType,
  {iconName: string; iconColor: string; bgColor: string}
> = {
  concierge: {
    iconName: 'room-service',
    iconColor: Colors.primary,
    bgColor: 'rgba(242,202,80,0.12)',
  },
  booking: {
    iconName: 'event',
    iconColor: Colors.primary,
    bgColor: 'rgba(242,202,80,0.12)',
  },
  safety: {
    iconName: 'security',
    iconColor: Colors.error,
    bgColor: 'rgba(239,83,80,0.12)',
  },
  system: {
    iconName: 'info',
    iconColor: Colors.onSurfaceVariant,
    bgColor: 'rgba(208,197,175,0.12)',
  },
};

// ─── Filter Config ────────────────────────────────────────────────────────────

const FILTERS: {key: FilterKey; label: string}[] = [
  {key: 'ALL', label: 'All'},
  {key: 'UNREAD', label: 'Unread'},
  {key: 'BOOKINGS', label: 'Bookings'},
  {key: 'SAFETY', label: 'Safety'},
];

function applyFilter(
  items: NotificationItem[],
  filter: FilterKey,
): NotificationItem[] {
  switch (filter) {
    case 'UNREAD':
      return items.filter(n => !n.read);
    case 'BOOKINGS':
      return items.filter(n => n.type === 'booking' || n.type === 'concierge');
    case 'SAFETY':
      return items.filter(n => n.type === 'safety');
    case 'ALL':
    default:
      return items;
  }
}

// ─── Screen Props ─────────────────────────────────────────────────────────────

type Props = NativeStackScreenProps<ConciergeStackParamList, 'Notifications'>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationsScreen({navigation}: Props) {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');
  const insets = useSafeAreaInsets();

  const filteredNotifications = applyFilter(notifications, activeFilter);

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? {...n, read: true} : n)),
    );
  }, []);

  // Notifications route to their relevant screen + mark as read
  const handleNotificationPress = useCallback(
    (item: NotificationItem) => {
      toggleRead(item.id);
      if (item.type === 'concierge') {
        navigation.navigate('MessagingThread', {conversationId: 'concierge_main'});
      } else if (item.type === 'booking') {
        // Navigate to BookingHistory so user can view/manage the relevant booking
        (navigation as any).navigate('SessionsNavigator', {screen: 'BookingHistory'});
      } else if (item.type === 'safety') {
        (navigation as any).navigate('SafetyNavigator', {screen: 'SafetyHub'});
      } else if (item.type === 'system') {
        // System notifications — offer relevant action rather than silently dismissing
        Alert.alert(
          'System Notice',
          item.title + '\n\n' + item.body,
          [
            {text: 'Dismiss'},
            {
              text: 'Open Settings',
              onPress: () =>
                (navigation as any).navigate('ProfileNavigator', {screen: 'SettingsHub'}),
            },
          ],
        );
      }
    },
    [navigation, toggleRead],
  );

  const renderNotification = useCallback(
    ({item}: {item: NotificationItem}) => {
      const cfg = TYPE_CONFIG[item.type];
      return (
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => handleNotificationPress(item)}
          style={[
            styles.cardShadowWrapper,
            !item.read && styles.cardShadowWrapperUnread,
          ]}>
          <View
            style={[styles.cardInner, !item.read && styles.cardInnerUnread]}>
            {/* Unread accent bar */}
            {!item.read && <View style={styles.unreadBar} />}

            <View style={styles.cardContent}>
              {/* Icon circle */}
              <View
                style={[
                  styles.iconCircle,
                  {backgroundColor: cfg.bgColor},
                ]}>
                <Icon name={cfg.iconName} size={20} color={cfg.iconColor} />
              </View>

              {/* Text block */}
              <View style={styles.textBlock}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.notifTitle,
                      !item.read && styles.notifTitleUnread,
                    ]}
                    numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
                <Text style={styles.notifBody} numberOfLines={2}>
                  {item.body}
                </Text>
              </View>
            </View>

            {/* Unread dot */}
            {!item.read && <View style={styles.unreadDot} />}
          </View>
        </TouchableOpacity>
      );
    },
    [handleNotificationPress],
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Icon name="auto-awesome" size={32} color={Colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>All caught up</Text>
      <Text style={styles.emptySubtitle}>
        No notifications in this category right now.
      </Text>
    </View>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
          <Icon name="arrow-back" size={22} color={Colors.onSurface} />
        </TouchableOpacity>

        {/* Absolutely centered title + badge */}
        <View style={styles.headerCenter} pointerEvents="none">
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* Mark All (right-aligned) */}
        <TouchableOpacity
          onPress={markAllRead}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          disabled={unreadCount === 0}>
          <Text
            style={[
              styles.markAllText,
              unreadCount === 0 && styles.markAllTextDisabled,
            ]}>
            Mark All
          </Text>
        </TouchableOpacity>
        {/* Preferences */}
        <TouchableOpacity
          onPress={() => navigation.navigate('NotificationPreferences')}
          hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}
          style={{marginLeft: 10}}>
          <Icon name="settings" size={20} color={Colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      {/* ── Filter chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScroll}>
        {FILTERS.map(f => {
          const isActive = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}>
              <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
                {f.label}
              </Text>
              {f.key === 'UNREAD' && unreadCount > 0 && !isActive && (
                <View style={styles.chipBadge}>
                  <Text style={styles.chipBadgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Divider ── */}
      <View style={styles.divider} />

      {/* ── List ── */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={item => item.id}
        renderItem={renderNotification}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={[
          styles.listContent,
          filteredNotifications.length === 0 && styles.listContentEmpty,
          {paddingBottom: Math.max(32, insets.bottom + 16)},
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.surface,
  },

  // Header — title is absolutely centered over the row
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: Colors.onSurface,
    letterSpacing: 0.2,
  },
  headerBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: Colors.onPrimary,
  },
  markAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.primary,
    letterSpacing: 0.1,
  },
  markAllTextDisabled: {
    opacity: 0.35,
  },

  // ── Filter chips ──
  filtersScroll: {
    flexGrow: 0,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: CARD_BORDER,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  chipLabelActive: {
    color: Colors.onPrimary,
  },
  chipBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.onPrimary,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 16,
    marginBottom: 4,
  },

  // ── List ──
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  separator: {
    height: 10,
  },

  // ── Card — Android Fabric safe shadow pattern ──
  cardShadowWrapper: {
    borderRadius: 14,
    // Shadow-only wrapper — NO overflow:hidden
    ...Platform.select({
      android: {
        elevation: 3,
      },
      ios: {
        shadowColor: Colors.black,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.18,
        shadowRadius: 6,
      },
    }),
  },
  cardShadowWrapperUnread: {
    ...Platform.select({
      android: {elevation: 5},
      ios: {shadowOpacity: 0.25, shadowRadius: 8},
    }),
  },
  cardInner: {
    borderRadius: 14,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    overflow: 'hidden', // clip here, not on shadow wrapper
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInnerUnread: {
    borderColor: 'rgba(242,202,80,0.18)',
    backgroundColor: 'rgba(11,13,26,0.92)',
  },

  // Unread left accent bar
  unreadBar: {
    width: 3,
    alignSelf: 'stretch',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },

  cardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },

  // Icon circle
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },

  // Text
  textBlock: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.onSurface,
    flex: 1,
    letterSpacing: 0.1,
  },
  notifTitleUnread: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    flexShrink: 0,
    letterSpacing: 0.2,
  },
  notifBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  // Unread dot (top-right of card)
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 14,
    alignSelf: 'center',
    flexShrink: 0,
  },

  // ── Empty state ──
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 14,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(242,202,80,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.18)',
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 22,
    color: Colors.onSurface,
    letterSpacing: 0.3,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

