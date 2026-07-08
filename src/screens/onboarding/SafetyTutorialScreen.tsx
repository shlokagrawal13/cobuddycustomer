import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {OnboardingStackParamList} from '../../navigation/types';
import {Colors} from '../../theme/colors';
import {PrimaryButton, SecondaryButton, BottomActionBar} from '../../components/ui';
import Icon from '../../components/ui/Icon';
import OnboardingHeader from '../../components/onboarding/OnboardingHeader';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'SafetyTutorial'>;

const {width: SW} = Dimensions.get('window');

// 4 horizontal carousel slides — exact text from Stitch
interface Slide {
  id: string;
  icon: string;
  title: string;
  body: string;
  visual: 'shield' | 'venue' | 'live' | 'community';
}

const SLIDES: Slide[] = [
  {
    id: 'verified',
    icon: '🛡',
    title: 'Verified Members',
    body: 'Our community is built on trust. Every member undergoes a rigorous identity verification process to ensure a secure, elite environment.',
    visual: 'shield',
  },
  {
    id: 'public',
    icon: '📍',
    title: 'Public-Only Experiences',
    body: 'All first-time sessions are hosted exclusively in curated, high-traffic venues including boutique lounges and luxury hotel lobbies.',
    visual: 'venue',
  },
  {
    id: 'live',
    icon: '🔒',
    title: 'Live Safety Protection',
    body: 'Our concierge team monitors active sessions in real-time, providing a discreet layer of protection and instant assistance if needed.',
    visual: 'live',
  },
  {
    id: 'community',
    icon: '🤝',
    title: 'Respectful Community',
    body: 'CoBuddy operates on mutual respect and hospitality. Our strict community standards ensure every interaction is refined and professional.',
    visual: 'community',
  },
];

// The Stitch has these three safety detail items in the bottom sheet
const SAFETY_DETAILS = [
  {
    iconName: 'fingerprint',
    label: 'IDENTITY ASSURANCE',
    text: 'All members are required to upload government-issued identification which is cross-referenced with global security databases.',
  },
  {
    iconName: 'contacts',
    label: 'TRUSTED CONTACTS',
    text: "Optionally share your session details and live location with your personal emergency contacts through the app's Guardian feature.",
  },
  {
    iconName: 'verified',
    label: 'VERIFIED DESTINATIONS',
    text: 'Our concierge team personally vets every venue in our catalog to ensure they meet our criteria for visibility, professional staffing, and atmosphere.',
  },
];

// Visual for each slide
function SlideVisual({visual}: {visual: Slide['visual']}) {
  if (visual === 'shield') {
    return (
      <View style={visualStyles.shieldWrap}>
        <View style={visualStyles.shieldGlow} />
        <View style={visualStyles.shieldCard}>
          <View style={visualStyles.shieldIconWrap}>
            <Icon name="security" size={80} color={Colors.primary} />
            <View style={visualStyles.shieldBadge}>
              <Icon name="star" size={12} color={Colors.onPrimary} />
            </View>
          </View>
        </View>
      </View>
    );
  }
  if (visual === 'venue') {
    return (
      <View style={visualStyles.venueCard}>
        <View style={visualStyles.venueImagePlaceholder}>
          <View style={{opacity: 0.12}}>
            <Icon name="hotel" size={64} color={Colors.onSurface} />
          </View>
        </View>
        <View style={visualStyles.venueOverlay} />
        <View style={visualStyles.venueBadge}>
          <Icon name="location-on" size={13} color={Colors.primary} />
          <Text style={visualStyles.venueBadgeText}>VERIFIED VENUE</Text>
        </View>
      </View>
    );
  }
  if (visual === 'live') {
    return (
      <View style={visualStyles.liveCard}>
        <View style={visualStyles.liveHeader}>
          <Icon name="lock" size={22} color={Colors.primary} />
          <View style={visualStyles.liveDots}>
            <View style={[visualStyles.liveDot, {opacity: 1}]} />
            <View style={[visualStyles.liveDot, {opacity: 0.5}]} />
          </View>
        </View>
        <View style={visualStyles.liveRow}>
          <View style={[visualStyles.liveIconSmallWrap, {backgroundColor: 'rgba(74,222,128,0.2)'}]}>
            <Icon name="cell-tower" size={14} color={Colors.tertiary} />
          </View>
          <View style={visualStyles.liveBar} />
        </View>
        <View style={visualStyles.liveRow}>
          <View style={[visualStyles.liveIconSmallWrap, {backgroundColor: 'rgba(242,202,80,0.2)'}]}>
            <Icon name="phone" size={14} color={Colors.primary} />
          </View>
          <View style={[visualStyles.liveBar, {width: '66%'}]} />
        </View>
      </View>
    );
  }
  // community
  return (
    <View style={visualStyles.communityWrap}>
      <View style={[visualStyles.avatar, {marginRight: -24, zIndex: 2}]}>
        <View style={{opacity: 0.4}}>
          <Icon name="person" size={48} color={Colors.onSurfaceVariant} />
        </View>
      </View>
      <View style={[visualStyles.avatar, {marginTop: 40}]}>
        <View style={{opacity: 0.4}}>
          <Icon name="person" size={48} color={Colors.onSurfaceVariant} />
        </View>
      </View>
    </View>
  );
}

export default function SafetyTutorialScreen({navigation}: Props) {
  const [current, setCurrent] = useState(0);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const listRef = useRef<FlatList<Slide>>(null);

  const isLast = current === SLIDES.length - 1;

  const goNext = () => {
    if (!isLast) {
      const next = current + 1;
      listRef.current?.scrollToIndex({index: next, animated: true});
    } else {
      navigation.navigate('FirstRecommendations');
    }
  };

  const renderSlide = ({item}: ListRenderItemInfo<Slide>) => (
    <View style={[slideStyles.slide, {width: SW}]}>
      <SlideVisual visual={item.visual} />
      <Text style={slideStyles.title}>{item.title}</Text>
      <Text style={slideStyles.body}>{item.body}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <OnboardingHeader
        showBack
        onBack={() => navigation.goBack()}
        centerLabel="Safety"
        step="6 / 7"
        showProgress
        currentStep={6}
        rightNode={
          <TouchableOpacity
            onPress={() => navigation.navigate('FirstRecommendations')}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        }
      />

      {/* Horizontal slide list */}
      <FlatList<Slide>
        ref={listRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={i => i.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SW);
          setCurrent(idx);
        }}
        style={styles.carousel}
      />

      <BottomActionBar>
        <PrimaryButton
          label={isLast ? 'FINISH TUTORIAL' : 'NEXT'}
          onPress={goNext}
        />
        <SecondaryButton
          label="LEARN MORE"
          onPress={() => setShowLearnMore(true)}
          variant="ghost"
        />
      </BottomActionBar>

      {/* Learn More modal overlay — from Stitch (hidden by default, shows on tap) */}
      {showLearnMore && (
        <View style={modal.backdrop}>
          <View style={modal.sheet}>
            <View style={modal.sheetHeader}>
              <Text style={modal.sheetTitle}>Safety Ecosystem</Text>
              <TouchableOpacity onPress={() => setShowLearnMore(false)}>
                <Icon name="close" size={20} color={Colors.onSurfaceVariant} />
              </TouchableOpacity>
            </View>
            {SAFETY_DETAILS.map(d => (
              <View key={d.label} style={modal.detailRow}>
                <View style={modal.detailIconWrap}>
                  <Icon name={d.iconName} size={20} color={Colors.primary} />
                </View>
                <View style={modal.detailMeta}>
                  <Text style={modal.detailLabel}>{d.label}</Text>
                  <Text style={modal.detailText}>{d.text}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity
              style={modal.understoodBtn}
              onPress={() => setShowLearnMore(false)}>
              <Text style={modal.understoodText}>UNDERSTOOD</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.surface},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  progressDots: {flexDirection: 'row', alignItems: 'center', gap: 6},
  progressDot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressDotLong: {width: 24},
  progressDotShort: {width: 8},
  progressDotActive: {backgroundColor: Colors.primary},
  skipText: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },

  carousel: {flex: 1},
});

const slideStyles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 26,
    color: Colors.onSurface,
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 14,
    lineHeight: 34,
  },
  body: {
    fontSize: 16,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 340,
  },
});

// Visual sub-styles
const visualStyles = StyleSheet.create({
  // Slide 1: Shield
  shieldWrap: {alignItems: 'center', justifyContent: 'center', width: '100%', height: 200},
  shieldGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(242,202,80,0.05)',
  },
  shieldCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 36,
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 80,
    elevation: 6,
  },
  shieldIconWrap: {position: 'relative'},
  shieldIcon: {fontSize: 80},
  shieldBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 6,
  },
  shieldBadgeIcon: {fontSize: 12},

  // Slide 2: Venue
  venueCard: {
    width: '100%',
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: Colors.surfaceContainerHigh,
  },
  venueImagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerHigh,
  },
  venueImageIcon: {fontSize: 64, opacity: 0.12},
  venueOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,20,15,0.5)',
  },
  venueBadge: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  venueBadgeIcon: {fontSize: 13, color: Colors.primary},
  venueBadgeText: {
    fontSize: 10,
    letterSpacing: 2,
    color: Colors.onSurface,
    fontWeight: '600',
  },

  // Slide 3: Live safety card
  liveCard: {
    width: '100%',
    backgroundColor: 'rgba(242,202,80,0.05)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.2)',
    padding: 20,
    gap: 14,
  },
  liveHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  liveIcon: {fontSize: 22, color: Colors.primary},
  liveDots: {flexDirection: 'row', gap: 6},
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  liveIconSmallWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveIconSmall: {fontSize: 14},
  liveBar: {
    height: 8,
    width: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
  },

  // Slide 4: Community
  communityWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#050816',
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarIcon: {fontSize: 48, opacity: 0.4},
});

const modal = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20,20,15,0.6)',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  sheet: {
    backgroundColor: 'rgba(11,13,26,0.95)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 28,
    gap: 20,
  },
  sheetHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  sheetTitle: {fontSize: 24, fontWeight: '600', color: Colors.onSurface},
  closeIcon: {fontSize: 20, color: Colors.onSurfaceVariant},
  detailRow: {flexDirection: 'row', gap: 16},
  detailIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(242,202,80,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  detailIcon: {fontSize: 20, color: Colors.primary},
  detailMeta: {flex: 1},
  detailLabel: {
    fontSize: 11,
    letterSpacing: 2,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: 6,
  },
  detailText: {fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 19},
  understoodBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  understoodText: {
    fontSize: 12,
    letterSpacing: 2,
    color: Colors.onPrimary,
    fontWeight: '600',
  },
});
