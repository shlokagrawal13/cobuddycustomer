import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {SafetyStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<SafetyStackParamList, 'TrustedContacts'>;

// Stitch: trusted_contacts_management_screen
// arrow_back | "Trusted Contacts" | add icon
// shield_person "Your Trusted Safety Network"
// "Trusted contacts help support safer and protected CoBuddy experiences."
// stars "Priority Alerting"
// Contact rows: check | Name | diversity_1 Family Member | notifications_active Alerts Enabled | stars Emergency Priority | phone | EDIT | REMOVE
// person_add "Add Trusted Contact" | sync "Sync Device Contacts"

interface Contact {
  id: string;
  name: string;
  relationship: string;
  relationshipIcon: string;
  phone: string;
  alertsEnabled: boolean;
  isPriority: boolean;
  verified: boolean;
}

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c1',
    name: 'Eleanor Vance',
    relationship: 'Family Member',
    relationshipIcon: 'diversity-1',
    phone: '+1 (555) 019-2834',
    alertsEnabled: true,
    isPriority: true,
    verified: true,
  },
  {
    id: 'c2',
    name: 'Marcus Sterling',
    relationship: 'Close Friend',
    relationshipIcon: 'group',
    phone: '+1 (555) 837-1029',
    alertsEnabled: true,
    isPriority: false,
    verified: true,
  },
];

const CARD_BG     = 'rgba(11,13,26,0.8)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function TrustedContactsScreen({navigation}: Props) {
  const [contacts, setContacts]   = useState<Contact[]>(INITIAL_CONTACTS);
  const [showAdd, setShowAdd]     = useState(false);
  const [newName, setNewName]     = useState('');
  const [newPhone, setNewPhone]   = useState('');
  const [newRel, setNewRel]       = useState('');

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      'Remove Contact',
      `Remove ${name} from your trusted safety network?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setContacts(prev => prev.filter(c => c.id !== id)),
        },
      ],
    );
  };

  const handleEdit = (contactId: string) => {
    navigation.navigate('EditTrustedContact', {contactId});
  };

  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      Alert.alert('Missing Info', 'Please enter both name and phone number.');
      return;
    }
    const c: Contact = {
      id: `c_${Date.now()}`,
      name: newName.trim(),
      relationship: newRel.trim() || 'Trusted Contact',
      relationshipIcon: 'person',
      phone: newPhone.trim(),
      alertsEnabled: true,
      isPriority: false,
      verified: false,
    };
    setContacts(prev => [...prev, c]);
    setNewName('');
    setNewPhone('');
    setNewRel('');
    setShowAdd(false);
    Alert.alert('Contact Added', `${c.name} has been added to your trusted safety network.`);
  };

  const handleSyncContacts = () => {
    Alert.alert(
      'Sync Contacts',
      'Device contact sync is not available in demo mode. Contacts can be added manually.',
      [{text: 'OK'}],
    );
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header — Stitch: arrow_back | Trusted Contacts | add */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={18} color={Colors.onSurface} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trusted Contacts</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setShowAdd(s => !s)}
          activeOpacity={0.7}>
          <Icon name={showAdd ? 'close' : 'add'} size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* Hero banner — Stitch: shield_person + trust copy */}
          <View style={styles.heroBanner}>
            <View style={styles.heroGlow} pointerEvents="none" />
            <View style={styles.heroIconWrap}>
              <Icon name="security" size={28} color={Colors.primary} />
            </View>
            <View style={styles.heroMeta}>
              <Text style={styles.heroTitle}>Your Trusted Safety Network</Text>
              <Text style={styles.heroSub}>
                Trusted contacts help support safer and protected CoBuddy experiences.
              </Text>
            </View>
          </View>

          {/* Priority alerting note — Stitch: stars Priority Alerting */}
          <View style={styles.priorityNote}>
            <Icon name="stars" size={15} color={Colors.primary} />
            <Text style={styles.priorityNoteText}>
              Priority contacts receive immediate alerts during active safety events.
            </Text>
          </View>

          {/* Add contact form (collapsible) */}
          {showAdd && (
            <View style={styles.addCard}>
              <Text style={styles.sectionLabel}>ADD TRUSTED CONTACT</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={newName}
                onChangeText={setNewName}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={newPhone}
                onChangeText={setNewPhone}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Relationship (e.g. Friend, Family)"
                placeholderTextColor={Colors.onSurfaceVariant}
                value={newRel}
                onChangeText={setNewRel}
              />
              <View style={styles.addActionRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowAdd(false)}
                  activeOpacity={0.75}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleAddContact}
                  activeOpacity={0.85}>
                  <Icon name="check" size={16} color={Colors.onPrimary} />
                  <Text style={styles.saveBtnText}>Save Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Contacts list — Stitch: check | Name | relationship | alerts | priority | phone | EDIT | REMOVE */}
          {contacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="person-add" size={40} color={Colors.onSurfaceVariant} />
              <Text style={styles.emptyTitle}>No Contacts Yet</Text>
              <Text style={styles.emptySub}>Tap + to add your first trusted contact.</Text>
            </View>
          ) : (
            contacts.map((contact, i) => (
              <View
                key={contact.id}
                style={[styles.contactCard, contact.isPriority && styles.contactCardPriority]}>

                {/* Verified check */}
                <View style={styles.contactTop}>
                  <View style={styles.contactAvatar}>
                    <Icon
                      name={contact.verified ? 'check-circle' : 'person'}
                      size={20}
                      color={contact.verified ? Colors.success : Colors.onSurfaceVariant}
                    />
                  </View>

                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={styles.contactRelRow}>
                      <Icon name={contact.relationshipIcon} size={13} color={Colors.onSurfaceVariant} />
                      <Text style={styles.contactRel}>{contact.relationship}</Text>
                    </View>
                  </View>

                  {contact.isPriority && (
                    <View style={styles.priorityBadge}>
                      <Icon name="stars" size={12} color={Colors.primary} />
                      <Text style={styles.priorityBadgeText}>Priority</Text>
                    </View>
                  )}
                </View>

                {/* Status row — Stitch: notifications_active Alerts Enabled + stars Emergency Priority */}
                <View style={styles.contactMidRow}>
                  <View style={styles.alertPill}>
                    <Icon name="notifications-active" size={12} color={Colors.success} />
                    <Text style={styles.alertPillText}>Alerts Enabled</Text>
                  </View>
                  {contact.isPriority && (
                    <View style={styles.emergencyPill}>
                      <Icon name="stars" size={12} color={Colors.primary} />
                      <Text style={styles.emergencyPillText}>Emergency Priority</Text>
                    </View>
                  )}
                </View>

                {/* Phone */}
                <View style={styles.phoneRow}>
                  <Icon name="phone" size={13} color={Colors.onSurfaceVariant} />
                  <Text style={styles.phoneText}>{contact.phone}</Text>
                </View>

                {/* Actions — Stitch: EDIT | REMOVE */}
                <View style={styles.contactActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => handleEdit(contact.id)}
                    activeOpacity={0.75}>
                    <Icon name="edit" size={14} color={Colors.primary} />
                    <Text style={styles.editBtnText}>EDIT</Text>
                  </TouchableOpacity>
                  <View style={styles.actionDivider} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(contact.id, contact.name)}
                    activeOpacity={0.75}>
                    <Icon name="delete-outline" size={14} color={Colors.error} />
                    <Text style={styles.removeBtnText}>REMOVE</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {/* Bottom actions — Stitch: person_add + sync */}
          <View style={styles.bottomActionsCard}>
            <TouchableOpacity
              style={styles.bottomActionRow}
              onPress={() => setShowAdd(s => !s)}
              activeOpacity={0.8}>
              <View style={styles.bottomActionIcon}>
                <Icon name="person-add" size={20} color={Colors.primary} />
              </View>
              <View style={styles.bottomActionMeta}>
                <Text style={styles.bottomActionLabel}>Add Trusted Contact</Text>
                <Text style={styles.bottomActionSub}>Manually add a contact to your network</Text>
              </View>
              <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>

            <View style={styles.bottomActionDivider} />

            <TouchableOpacity
              style={styles.bottomActionRow}
              onPress={handleSyncContacts}
              activeOpacity={0.8}>
              <View style={styles.bottomActionIcon}>
                <Icon name="sync" size={20} color={Colors.onSurfaceVariant} />
              </View>
              <View style={styles.bottomActionMeta}>
                <Text style={styles.bottomActionLabel}>Sync Device Contacts</Text>
                <Text style={styles.bottomActionSub}>Import from your phone contacts</Text>
              </View>
              <Icon name="chevron-right" size={18} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Privacy note */}
          <View style={styles.privacyNote}>
            <Icon name="lock" size={13} color={Colors.onSurfaceVariant} />
            <Text style={styles.privacyText}>
              Contact information is encrypted and used only for emergency safety alerts.
            </Text>
          </View>

          <View style={{height: 20}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   {flex: 1, backgroundColor: Colors.surface},
  flex:   {flex: 1},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 20, paddingTop: 20, gap: 16},

  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, gap: 12,
    backgroundColor: 'rgba(20,20,15,0.95)',
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: CARD_BORDER,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {flex: 1, fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},
  addBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Hero banner
  heroBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    borderLeftWidth: 3, borderLeftColor: Colors.primary,
    padding: 16, position: 'relative', overflow: 'hidden',
  },
  heroGlow: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(242,202,80,0.02)',
  },
  heroIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  heroMeta: {flex: 1},
  heroTitle: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface, marginBottom: 4},
  heroSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 17},

  // Priority note
  priorityNote: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(242,202,80,0.06)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    paddingHorizontal: 14, paddingVertical: 10,
  },
  priorityNoteText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 16},

  // Add form
  addCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)', padding: 20, gap: 12,
  },
  sectionLabel: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.onSurfaceVariant, letterSpacing: 1.5},
  input: {
    borderRadius: 12, borderWidth: 1, borderColor: CARD_BORDER,
    backgroundColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 14, paddingVertical: 12,
    fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurface,
  },
  addActionRow: {flexDirection: 'row', gap: 10},
  cancelBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 13, borderRadius: 100,
    backgroundColor: Colors.surfaceContainerHigh, borderWidth: 1, borderColor: CARD_BORDER,
  },
  cancelBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurfaceVariant},
  saveBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 13, borderRadius: 100, backgroundColor: Colors.primary,
  },
  saveBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onPrimary},

  // Contact card
  contactCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, padding: 16, gap: 12,
  },
  contactCardPriority: {borderColor: 'rgba(242,202,80,0.30)'},
  contactTop: {flexDirection: 'row', alignItems: 'center', gap: 12},
  contactAvatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: CARD_BORDER,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  contactInfo: {flex: 1},
  contactName: {fontFamily: 'Inter-SemiBold', fontSize: 15, color: Colors.onSurface, marginBottom: 3},
  contactRelRow: {flexDirection: 'row', alignItems: 'center', gap: 5},
  contactRel: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant},
  priorityBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(242,202,80,0.10)',
    borderRadius: 100, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.25)',
  },
  priorityBadgeText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary},

  contactMidRow: {flexDirection: 'row', gap: 8, flexWrap: 'wrap'},
  alertPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(109,217,140,0.08)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(109,217,140,0.20)',
  },
  alertPillText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.success},
  emergencyPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.20)',
  },
  emergencyPillText: {fontFamily: 'Inter-SemiBold', fontSize: 10, color: Colors.primary},

  phoneRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  phoneText: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurface},

  contactActions: {
    flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: CARD_BORDER, paddingTop: 12,
  },
  editBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  editBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.primary, letterSpacing: 0.8},
  actionDivider: {width: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginHorizontal: 8},
  removeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  removeBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 12, color: Colors.error, letterSpacing: 0.8},

  // Empty state
  emptyState: {
    alignItems: 'center', paddingVertical: 48, gap: 12,
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER,
  },
  emptyTitle: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.onSurface},
  emptySub: {fontFamily: 'Inter-Regular', fontSize: 13, color: Colors.onSurfaceVariant},

  // Bottom actions card
  bottomActionsCard: {
    backgroundColor: CARD_BG, borderRadius: 20,
    borderWidth: 1, borderColor: CARD_BORDER, overflow: 'hidden',
  },
  bottomActionRow: {flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16},
  bottomActionIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  bottomActionMeta: {flex: 1},
  bottomActionLabel: {fontFamily: 'Inter-Medium', fontSize: 14, color: Colors.onSurface},
  bottomActionSub: {fontFamily: 'Inter-Regular', fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2},
  bottomActionDivider: {height: StyleSheet.hairlineWidth, backgroundColor: CARD_BORDER, marginLeft: 70},

  // Privacy note
  privacyNote: {flexDirection: 'row', alignItems: 'flex-start', gap: 8, opacity: 0.6},
  privacyText: {flex: 1, fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant, lineHeight: 16},
});
