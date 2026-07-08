import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Colors} from '../../theme/colors';
import Icon from '../../components/ui/Icon';
import {AuthStackParamList} from '../../navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Waitlist'>;

const CARD_BG = 'rgba(32,32,26,0.95)';
const CARD_BORDER = 'rgba(255,255,255,0.07)';
const GOLD_BORDER = 'rgba(242,202,80,0.20)';

const STATUS_STEPS = [
  {label: 'Application Received', state: 'done'},
  {label: 'Concierge Review', state: 'active'},
  {label: 'Approval & Access', state: 'pending'},
];

export default function WaitlistScreen({navigation}: Props) {
  const handleContactConcierge = () => {
    Alert.alert(
      'Contact Concierge',
      'Our concierge team is available 24/7 at concierge@cobuddy.com or via live chat in the app. Your dedicated advisor will respond within 2 hours.',
      [{text: 'Got it', style: 'default'}],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.surface} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Hero Icon */}
        <View style={styles.heroContainer}>
          <View style={styles.iconRingOuter}>
            <View style={styles.iconRingInner}>
              <Icon name="workspace-premium" size={40} color={Colors.primary} />
            </View>
          </View>
        </View>

        {/* Title Block */}
        <Text style={styles.title}>You're on the List</Text>
        <Text style={styles.subtitle}>
          Your application is being reviewed by our concierge team. You'll be
          notified once approved.
        </Text>

        {/* Queue Position Card */}
        <View style={styles.queueCard}>
          <View style={styles.queueHeader}>
            <Text style={styles.queueBadge}>PRIORITY QUEUE</Text>
          </View>
          <Text style={styles.queueNumber}>#247</Text>
          <Text style={styles.queueLabel}>Your Position</Text>
        </View>

        {/* Status Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>Application Status</Text>
          {STATUS_STEPS.map((step, index) => (
            <View key={step.label} style={styles.stepRow}>
              {/* Track */}
              <View style={styles.stepTrack}>
                <View
                  style={[
                    styles.stepDot,
                    step.state === 'done' && styles.stepDotDone,
                    step.state === 'active' && styles.stepDotActive,
                    step.state === 'pending' && styles.stepDotPending,
                  ]}>
                  {step.state === 'done' && (
                    <Icon name="check" size={12} color={Colors.onPrimary} />
                  )}
                  {step.state === 'active' && (
                    <View style={styles.pulseDot} />
                  )}
                </View>
                {index < STATUS_STEPS.length - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      step.state === 'done' && styles.stepConnectorDone,
                    ]}
                  />
                )}
              </View>
              {/* Label */}
              <View style={styles.stepContent}>
                <Text
                  style={[
                    styles.stepLabel,
                    step.state === 'done' && styles.stepLabelDone,
                    step.state === 'active' && styles.stepLabelActive,
                    step.state === 'pending' && styles.stepLabelPending,
                  ]}>
                  {step.label}
                </Text>
                {step.state === 'active' && (
                  <Text style={styles.stepSubLabel}>In progress</Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Email Confirmation */}
        <View style={styles.emailRow}>
          <Icon name="mark-email-read" size={16} color={Colors.success} />
          <Text style={styles.emailText}>Confirmation sent to your email</Text>
        </View>

        {/* Primary CTA */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleContactConcierge}
          activeOpacity={0.85}>
          <Icon name="support-agent" size={18} color={Colors.onPrimary} />
          <Text style={styles.primaryButtonText}>Contact Concierge</Text>
        </TouchableOpacity>

        {/* Back Link */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
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
    paddingTop: 40,
    paddingBottom: 36,
  },

  // Hero
  heroContainer: {
    marginBottom: 28,
    alignItems: 'center',
  },
  iconRingOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(242,202,80,0.08)',
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRingInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(242,202,80,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(242,202,80,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Title
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 30,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },

  // Queue Card
  queueCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  queueHeader: {
    backgroundColor: 'rgba(242,202,80,0.12)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: GOLD_BORDER,
  },
  queueBadge: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 1.8,
  },
  queueNumber: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 52,
    color: Colors.onSurface,
    lineHeight: 60,
    letterSpacing: -1,
  },
  queueLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    marginTop: 4,
    letterSpacing: 0.5,
  },

  // Steps Card
  stepsCard: {
    width: '100%',
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    padding: 20,
    marginBottom: 20,
  },
  stepsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 18,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  stepTrack: {
    alignItems: 'center',
    width: 28,
    marginRight: 14,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.onSurfaceVariant,
  },
  stepDotDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepDotActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(242,202,80,0.12)',
  },
  stepDotPending: {
    borderColor: Colors.surfaceContainerHighest,
    backgroundColor: Colors.surfaceContainerHighest,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  stepConnector: {
    width: 2,
    height: 28,
    backgroundColor: Colors.surfaceContainerHighest,
    marginTop: 2,
  },
  stepConnectorDone: {
    backgroundColor: Colors.primary,
  },
  stepContent: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 20,
  },
  stepLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  stepLabelDone: {
    color: Colors.onSurface,
  },
  stepLabelActive: {
    color: Colors.primary,
  },
  stepLabelPending: {
    color: Colors.onSurfaceVariant,
  },
  stepSubLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
    opacity: 0.8,
  },

  // Email Row
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  emailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: Colors.success,
  },

  // Buttons
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    marginBottom: 14,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.onPrimary,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textDecorationLine: 'underline',
  },
});
