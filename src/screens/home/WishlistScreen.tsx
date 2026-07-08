import React, {useState} from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';

type Props = NativeStackScreenProps<HomeStackParamList, 'Wishlist'>;

const CARD_BG = 'rgba(11,13,26,0.55)';
const BORDER  = 'rgba(255,255,255,0.08)';
const GOLD_BG = 'rgba(242,202,80,0.10)';
const GOLD_BD = 'rgba(242,202,80,0.22)';

const FILTERS = ['All', 'Companions', 'Venues', 'Events'];

const INITIAL_SAVED_ITEMS = [
  {id:'si1', name:'Elena M. - Private Guide', type:'Companion', savedDate:'Saved 3 days ago',  icon:'person',     targetId:'elena_001'},
  {id:'si2', name:'The Atrium Reserve',       type:'Venue',     savedDate:'Saved 1 week ago',  icon:'restaurant', targetId:'atelier'},
  {id:'si3', name:'Atrium Winter Gala',        type:'Event',     savedDate:'Saved 2 weeks ago', icon:'event',      targetId:'atrium_gala'},
  {id:'si4', name:'Villa Solange, Amalfi',     type:'Travel',    savedDate:'Saved 1 month ago', icon:'villa',      targetId:''},
];

const wishlistAlert = () =>
  Alert.alert('Wishlist Sync', 'Wishlist sync with your concierge is available in the full production build.');

export default function WishlistScreen({navigation}: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [items, setItems] = useState(INITIAL_SAVED_ITEMS);

  const filtered = activeFilter === 'All'
    ? items
    : items.filter(i => i.type === activeFilter);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back-ios-new" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={wishlistAlert}
          hitSlop={{top:10,bottom:10,left:10,right:10}}
          activeOpacity={0.7}>
          <Icon name="share" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Heading + count */}
        <View style={styles.hero}>
          <Text style={styles.heroHeading}>Saved Experiences</Text>
          <View style={styles.countBadge}>
            <Icon name="favorite" size={13} color={Colors.error} />
            <Text style={styles.countText}>{items.length} saved experiences</Text>
          </View>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}>
          {FILTERS.map(f => {
            const active = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setActiveFilter(f)}
                activeOpacity={0.8}>
                <Text style={[styles.filterText, active && styles.filterTextActive]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Wishlist items */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="favorite-border" size={32} color={Colors.onSurfaceVariant} />
            </View>
            <Text style={styles.emptyTitle}>No saved items</Text>
            <Text style={styles.emptySub}>Save companions, venues and events to your wishlist.</Text>
          </View>
        ) : (
          filtered.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.wishCard}
              onPress={() => {
                if (item.type === 'Companion') {
                  navigation.navigate('CompanionProfile', {companionId: item.targetId || item.id});
                } else if (item.type === 'Venue') {
                  navigation.navigate('VenueDetail', {venueId: item.targetId || item.id});
                } else if (item.type === 'Event') {
                  navigation.navigate('EventDetail', {eventId: item.targetId || item.id});
                } else {
                  wishlistAlert();
                }
              }}
              activeOpacity={0.85}>
              <View style={styles.wishIcon}>
                <Icon name={item.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.wishMeta}>
                <Text style={styles.wishName}>{item.name}</Text>
                <View style={styles.wishTypeRow}>
                  <View style={styles.typePill}>
                    <Text style={styles.typePillText}>{item.type.toUpperCase()}</Text>
                  </View>
                  <Text style={styles.wishDate}>{item.savedDate}</Text>
                </View>
              </View>
              <View style={styles.wishActions}>
                <Icon name="favorite" size={20} color={Colors.error} />
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() =>
                    Alert.alert(
                      'Remove from Wishlist',
                      'Remove this item from your wishlist?',
                      [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'Remove', style: 'destructive', onPress: () => setItems(prev => prev.filter(i => i.id !== item.id))},
                      ],
                    )
                  }
                  hitSlop={{top:8,bottom:8,left:8,right:8}}
                  activeOpacity={0.7}>
                  <Icon name="close" size={16} color={Colors.onSurfaceVariant} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Bottom CTA */}
        <TouchableOpacity style={styles.ctaBtn} onPress={wishlistAlert} activeOpacity={0.87}>
          <Icon name="book-online" size={18} color={Colors.surface} />
          <Text style={styles.ctaBtnText}>Book a Saved Experience</Text>
        </TouchableOpacity>

        {/* Concierge note */}
        <View style={styles.noteRow}>
          <Icon name="support-agent" size={14} color={Colors.primary} />
          <Text style={styles.noteText}>
            Your concierge can arrange any saved experience on your behalf.
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
    height: 60, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: BORDER,
  },
  headerBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {fontFamily: 'Inter-SemiBold', fontSize: 17, color: Colors.onSurface},

  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: 16, paddingTop: 20, gap: 14},

  hero: {gap: 10},
  heroHeading: {fontFamily: 'PlayfairDisplay-Bold', fontSize: 30, color: Colors.onSurface},
  countBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(220,80,80,0.08)', borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(220,80,80,0.20)',
  },
  countText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurface},

  filterRow: {gap: 8, paddingRight: 16},
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 100,
    borderWidth: 1, borderColor: BORDER, backgroundColor: CARD_BG,
  },
  filterChipActive: {backgroundColor: GOLD_BG, borderColor: GOLD_BD},
  filterText: {fontFamily: 'Inter-Medium', fontSize: 13, color: Colors.onSurfaceVariant},
  filterTextActive: {color: Colors.primary},

  wishCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: CARD_BG, borderRadius: 16,
    borderWidth: 1, borderColor: BORDER, padding: 14,
  },
  wishIcon: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BD,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  wishMeta: {flex: 1, gap: 6},
  wishName: {fontFamily: 'Inter-SemiBold', fontSize: 14, color: Colors.onSurface},
  wishTypeRow: {flexDirection: 'row', alignItems: 'center', gap: 8},
  typePill: {
    backgroundColor: GOLD_BG, borderRadius: 100,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: GOLD_BD,
  },
  typePillText: {fontFamily: 'Inter-SemiBold', fontSize: 9, color: Colors.primary, letterSpacing: 0.8},
  wishDate: {fontFamily: 'Inter-Regular', fontSize: 11, color: Colors.onSurfaceVariant},
  wishActions: {flexDirection: 'row', alignItems: 'center', gap: 10},
  removeBtn: {padding: 2},

  emptyState: {alignItems: 'center', paddingVertical: 48, gap: 12},
  emptyIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1, borderColor: BORDER,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: {fontFamily: 'Inter-SemiBold', fontSize: 18, color: Colors.onSurface},
  emptySub: {fontFamily: 'Inter-Regular', fontSize: 14, color: Colors.onSurfaceVariant, textAlign: 'center', maxWidth: 260},

  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: Colors.primary, borderRadius: 12, paddingVertical: 15,
  },
  ctaBtnText: {fontFamily: 'Inter-SemiBold', fontSize: 16, color: Colors.surface},

  noteRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: GOLD_BG, borderRadius: 12,
    borderWidth: 1, borderColor: GOLD_BD, padding: 12,
  },
  noteText: {
    flex: 1, fontFamily: 'Inter-Regular', fontSize: 12,
    color: Colors.onSurfaceVariant, lineHeight: 18,
  },
});
