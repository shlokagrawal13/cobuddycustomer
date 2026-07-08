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

type Props = NativeStackScreenProps<ProfileStackParamList, 'BlockedUsers'>;

const CARD_BG = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface BlockedUser {
  id: string;
  name: string;
  blockedDate: string;
  reason: string;
}

const INITIAL_BLOCKED: BlockedUser[] = [
  {id: 'b1', name: 'Anonymous User', blockedDate: '12 Jun 2025', reason: 'Inappropriate messages'},
  {id: 'b2', name: 'Anonymous User 2', blockedDate: '03 May 2025', reason: 'Harassment report'},
];

export default function BlockedUsersScreen({navigation}: Props) {
  const [blocked, setBlocked] = useState<BlockedUser[]>(INITIAL_BLOCKED);

  const handleUnblock = (user: BlockedUser) => {
    Alert.alert(
      `Unblock ${user.name}?`,
      'This user will be able to view your profile and message you again.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Unblock',
          style: 'destructive',
          onPress: () => setBlocked(prev => prev.filter(u => u.id !== user.id)),
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
        <Text style={styles.headerTitle}>Blocked Users</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{blocked.length}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <View style={styles.infoBannerIcon}>
            <Icon name="block" size={16} color={Colors.error} />
          </View>
          <Text style={styles.infoBannerText}>
            Blocked users cannot message, view your profile, or book sessions with you.
          </Text>
        </View>

        {/* Blocked user list or empty state */}
        {blocked.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Icon name="block" size={36} color={Colors.onSurfaceVariant} />
            </View>
            <Text style={styles.emptyTitle}>No Blocked Users</Text>
            <Text style={styles.emptySub}>Users you block will appear here</Text>
          </View>
        ) : (
          <View style={styles.card}>
            {blocked.map((user, idx) => (
              <View key={user.id}>
                <View style={styles.userRow}>
                  {/* Avatar */}
                  <View style={styles.avatar}>
                    <Icon name="person" size={20} color={Colors.onSurfaceVariant} />
                  </View>

                  {/* Info */}
                  <View style={styles.userMeta}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userDate}>Blocked on {user.blockedDate}</Text>
                    <View style={styles.reasonPill}>
                      <Text style={styles.reasonText}>{user.reason}</Text>
                    </View>
                  </View>

                  {/* Unblock button */}
                  <TouchableOpacity
                    style={styles.unblockBtn}
                    onPress={() => handleUnblock(user)}
                    activeOpacity={0.7}>
                    <Text style={styles.unblockBtnText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
                {idx < blocked.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        )}

        {/* Footer note */}
        <View style={styles.footerNote}>
          <Icon name="info" size={13} color={Colors.onSurfaceVariant} />
          <Text style={styles.footerText}>
            Blocks are private. Users are not notified when blocked or unblocked.
          </Text>
        </View>

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
    paddingHorizontal: 16,
    gap: 12,
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
    flex: 1,
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  countBadge: {
    minWidth: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countBadgeText: {
    fontFamily: 'Inter-SemiBold', fontSize: 13,
    color: Colors.onSurface,
  },

  scroll: {flex: 1},
  scrollContent: {paddingTop: 20, paddingHorizontal: 16},

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,180,171,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.15)',
    padding: 14,
    marginBottom: 20,
  },
  infoBannerIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,180,171,0.1)',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  infoBannerText: {
    flex: 1,
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant, lineHeight: 19,
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: CARD_BORDER,
    overflow: 'hidden',
    marginBottom: 20,
  },

  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  userMeta: {flex: 1},
  userName: {
    fontFamily: 'Inter-SemiBold', fontSize: 14,
    color: Colors.onSurface, marginBottom: 2,
  },
  userDate: {
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, marginBottom: 6,
  },
  reasonPill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  reasonText: {
    fontFamily: 'Inter-Regular', fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  unblockBtn: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12, paddingVertical: 7,
  },
  unblockBtnText: {
    fontFamily: 'Inter-Medium', fontSize: 12,
    color: Colors.onSurface,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
    marginHorizontal: 16,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 56,
  },
  emptyIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 18,
    color: Colors.onSurface, marginBottom: 6,
  },
  emptySub: {
    fontFamily: 'Inter-Regular', fontSize: 13,
    color: Colors.onSurfaceVariant,
  },

  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 12,
  },
  footerText: {
    flex: 1,
    fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },
});
