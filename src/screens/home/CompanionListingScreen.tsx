import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {COMPANIONS, CompanionCard, Companion} from './CompanionBrowseScreen';

type Props = NativeStackScreenProps<HomeStackParamList, 'CompanionListing'>;

export default function CompanionListingScreen({navigation, route}: Props) {
  const {category, filters} = route.params;
  const insets = useSafeAreaInsets();

  const filteredCompanions = useMemo(() => {
    return COMPANIONS.filter(companion => 
      companion.specialities.some(speciality => filters.includes(speciality))
    );
  }, [filters]);

  const handleSelect = (comp: Companion) => {
    navigation.navigate('CompanionProfile', {companionId: comp.id});
  };

  const renderItem = ({item}: {item: Companion}) => (
    <CompanionCard companion={item} onPress={() => handleSelect(item)} />
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.7}>
          <Icon name="arrow-back" size={20} color={Colors.onSurface} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{category} Companions</Text>
        </View>
        <View style={{width: 40}} />
      </View>

      <View style={styles.divider} />

      {/* List */}
      <FlatList
        data={filteredCompanions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          {paddingBottom: Math.max(32, insets.bottom + 16)},
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{height: 14}} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Icon name="person-search" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No companions found</Text>
            <Text style={styles.emptySub}>We couldn't find any companions for {category}.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const CARD_BORDER = 'rgba(255,255,255,0.08)';

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: Colors.surface},

  // Header
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20,20,15,0.92)',
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.surfaceContainerHighest,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: {
    position: 'absolute', left: 0, right: 0,
    alignItems: 'center', pointerEvents: 'none',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold', fontSize: 17,
    color: Colors.onSurface, letterSpacing: 0.2,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: CARD_BORDER,
  },

  listContent: {paddingHorizontal: 16, paddingTop: 16},

  // Empty State
  emptyState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1, borderColor: 'rgba(242,202,80,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontFamily: 'PlayfairDisplay-Bold', fontSize: 20,
    color: Colors.onSurface,
  },
  emptySub: {
    fontFamily: 'Inter-Regular', fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 8,
  },
});
