import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {ConciergeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

// Stitch: chat_media_picker_secure_attachment_experience
// close | "Secure Sharing" | support_agent "Share Securely"
// lock Encrypted | verified_user Privacy Protected
// photo_library Photos | photo_camera Camera | description Documents
// mic Voice Note | location_on Location | person Contact
// Selected Media: 3 items | Encrypting files... 85% | Cancel | Send

type Props = NativeStackScreenProps<ConciergeStackParamList, 'ChatMediaPicker'>;

const CARD_BG     = 'rgba(11,13,26,0.85)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const ATTACHMENT_TYPES = [
  {id: 'photos',    icon: 'photo-library', label: 'Photos',     sub: 'Share trusted hospitality photos'},
  {id: 'camera',    icon: 'photo-camera',  label: 'Camera',     sub: 'Capture and share instantly'},
  {id: 'documents', icon: 'description',   label: 'Documents',  sub: 'Booking confirmations, travel docs'},
  {id: 'voice',     icon: 'mic',           label: 'Voice Note', sub: 'Record secure voice message'},
  {id: 'location',  icon: 'location-on',   label: 'Location',   sub: 'Share trusted venue'},
  {id: 'contact',   icon: 'person',        label: 'Contact',    sub: 'Share approved contact info'},
];

export default function ChatMediaPickerScreen({navigation, route}: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleSend = () => {
    if (selected.length === 0) {
      Alert.alert('No Selection', 'Please select at least one attachment type to share.');
      return;
    }
    navigation.navigate('MediaPreview', {
      uri: selected[0],
      conversationId: route.params.conversationId,
    });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — Stitch: close | "Secure Sharing" | support_agent */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="close" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secure Sharing</Text>
        <View style={styles.headerIcon}>
          <Icon name="support-agent" size={20} color={Colors.primary} />
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Trust banner — Stitch: lock Encrypted | verified_user Privacy Protected */}
        <View style={styles.trustBanner}>
          <View style={styles.trustBannerMeta}>
            <Text style={styles.trustBannerTitle}>Share Securely</Text>
            <Text style={styles.trustBannerSub}>
              All shared content is protected through CoBuddy's trusted communication system.
            </Text>
          </View>
          <View style={styles.trustChips}>
            <View style={styles.trustChip}>
              <Icon name="lock" size={11} color={Colors.primary} />
              <Text style={styles.trustChipText}>Encrypted</Text>
            </View>
            <View style={styles.trustChip}>
              <Icon name="verified-user" size={11} color={Colors.success} />
              <Text style={styles.trustChipText}>Privacy Protected</Text>
            </View>
          </View>
        </View>

        {/* Attachment type grid — Stitch: 6 attachment type cards */}
        <Text style={styles.sectionLabel}>CHOOSE ATTACHMENT TYPE</Text>
        <View style={styles.grid}>
          {ATTACHMENT_TYPES.map(item => {
            const isSelected = selected.includes(item.id);
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridItem, isSelected && styles.gridItemSelected]}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.8}>
                <View style={[styles.gridIcon, isSelected && styles.gridIconSelected]}>
                  <Icon name={item.icon} size={24} color={isSelected ? Colors.onPrimary : Colors.primary} />
                </View>
                <Text style={[styles.gridLabel, isSelected && styles.gridLabelSelected]}>{item.label}</Text>
                <Text style={styles.gridSub} numberOfLines={2}>{item.sub}</Text>
                {isSelected && (
                  <View style={styles.selectedCheck}>
                    <Icon name="check-circle" size={18} color={Colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected summary — Stitch: "Selected Media: 3 items" */}
        {selected.length > 0 && (
          <View style={styles.selectedSummary}>
            <View style={styles.selectedSummaryLeft}>
              <Icon name="check-circle" size={16} color={Colors.success} />
              <Text style={styles.selectedSummaryText}>
                {selected.length} item{selected.length > 1 ? 's' : ''} selected
              </Text>
            </View>
            <TouchableOpacity onPress={() => setSelected([])} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon name="close" size={16} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>
        )}

        {/* Encryption progress mock — Stitch: "Encrypting files... 85%" */}
        {selected.length > 0 && (
          <View style={styles.encryptCard}>
            <View style={styles.encryptHeader}>
              <Icon name="shield" size={14} color={Colors.primary} />
              <Text style={styles.encryptLabel}>Encrypting files...</Text>
              <Text style={styles.encryptPct}>Ready</Text>
            </View>
            <View style={styles.encryptBar}>
              <View style={[styles.encryptFill, {width: '100%'}]} />
            </View>
            <Text style={styles.encryptNote}>
              Shared content remains protected inside CoBuddy and follows community safety standards.
            </Text>
          </View>
        )}

        <View style={{height: 16}} />
      </ScrollView>

      {/* Footer CTAs — Stitch: Cancel | Send */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}>
          <Text style={styles.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sendBtn, selected.length === 0 && styles.sendBtnDisabled]}
          onPress={handleSend}
          activeOpacity={0.85}
          disabled={selected.length === 0}>
          <Icon name="send" size={16} color={Colors.onPrimary} />
          <Text style={styles.sendBtnText}>
            Send{selected.length > 0 ? ` (${selected.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 16},

  // Header
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.95)',
  },
  closeBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },
  headerIcon: {width: 40, alignItems: 'flex-end'},

  // Trust banner
  trustBanner: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: GOLD_BORDER,
    padding: 18, gap: 12,
  },
  trustBannerMeta: {gap: 4},
  trustBannerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  trustBannerSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 18},
  trustChips: {flexDirection: 'row', gap: 8},
  trustChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  trustChipText: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurface},

  // Section label
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5},

  // Attachment grid
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  gridItem: {
    width: '47%', backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 16, gap: 6, position: 'relative',
  },
  gridItemSelected: {borderColor: GOLD_BORDER, backgroundColor: 'rgba(242,202,80,0.06)'},
  gridIcon: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  gridIconSelected: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  gridLabel: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  gridLabelSelected: {color: Colors.primary},
  gridSub: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 15},
  selectedCheck: {position: 'absolute', top: 10, right: 10},

  // Selected summary
  selectedSummary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: 'rgba(109,217,140,0.08)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(109,217,140,0.25)',
    paddingVertical: 10, paddingHorizontal: 14,
  },
  selectedSummaryLeft: {flexDirection: 'row', alignItems: 'center', gap: 8},
  selectedSummaryText: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success},

  // Encrypt card
  encryptCard: {
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: CARD_BORDER,
    padding: 16, gap: 10,
  },
  encryptHeader: {flexDirection: 'row', alignItems: 'center', gap: 8},
  encryptLabel: {flex: 1, fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},
  encryptPct: {fontFamily: 'Inter-SemiBold', fontSize: 13, color: Colors.success},
  encryptBar: {height: 4, backgroundColor: Colors.surfaceContainerHighest, borderRadius: 2, overflow: 'hidden'},
  encryptFill: {height: 4, backgroundColor: Colors.primary, borderRadius: 2},
  encryptNote: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},

  // Footer
  footer: {
    flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: CARD_BORDER,
    backgroundColor: 'rgba(20,20,15,0.95)',
  },
  cancelBtn: {
    flex: 1, paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface},
  sendBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 8,
    paddingVertical: 16, borderRadius: 100,
    backgroundColor: Colors.primary,
  },
  sendBtnDisabled: {opacity: 0.4},
  sendBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onPrimary},
});
