import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {CommonActions} from '@react-navigation/native';
import {ModalStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<ModalStackParamList, 'BookingDeclined'>;

const CARD_BG = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';

export default function BookingDeclinedScreen({navigation}: Props) {
  const handleTryAnother = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabNavigator',
            params: {
              screen: 'HomeNavigator',
              params: {
                screen: 'Explore',
              },
            },
          },
        ],
      })
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Decline Circle */}
        <View style={styles.heroContainer}>
          <View style={styles.declineRingOuter}>
            <View style={styles.declineRingMiddle}>
              <View style={styles.declineRingInner}>
                <Icon name="cancel" size={44} color={Colors.error} />
              </View>
            </View>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Booking Declined</Text>
        <Text style={styles.subtitle}>
          The companion is currently unavailable for the requested time.
        </Text>

        {/* Info Note */}
        <View style={styles.noteCard}>
          <Icon name="info-outline" size={18} color={Colors.onSurfaceVariant} />
          <Text style={styles.noteText}>
            No charges have been made to your account. Your authorized funds have been released.
          </Text>
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleTryAnother}
          activeOpacity={0.85}>
          <Icon name="search" size={20} color={Colors.onSurface} />
          <Text style={styles.primaryButtonText}>Find Another Companion</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 36,
  },

  // Hero
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    width: 140,
    height: 140,
  },
  declineRingOuter: {
    width: 136,
    height: 136,
    borderRadius: 68,
    backgroundColor: 'rgba(255,100,100,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineRingMiddle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255,100,100,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineRingInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,100,100,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Title
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: Colors.onSurface,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    paddingHorizontal: 20,
  },

  // Note Card
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: CARD_BG,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 16,
    gap: 12,
    width: '100%',
  },
  noteText: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    lineHeight: 20,
  },

  spacer: {
    flex: 1,
    minHeight: 40,
  },

  // Buttons
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.onSurface,
    letterSpacing: 0.3,
  },
});
