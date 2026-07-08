import type {LinkingOptions} from '@react-navigation/native';
import type {RootStackParamList} from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['cobuddy://', 'https://app.cobuddy.com'],
  config: {
    screens: {
      MainTabNavigator: {
        screens: {
          HomeNavigator: {
            screens: {
              HomeDashboard: 'home',
              CompanionProfile: 'home/companions/:companionId',
              VenueDetail: 'home/venues/:venueId',
              EventDetail: 'home/events/:eventId',
            },
          },
          SessionsNavigator: {
            screens: {
              UpcomingSession: 'sessions/upcoming/:sessionId',
              ActiveSession: 'sessions/active/:sessionId',
              PostSessionFeedback: 'sessions/review',
            },
          },
          ConciergeNavigator: {
            screens: {
              MessagingThread: 'concierge/messages/:conversationId',
              Notifications: 'concierge/notifications',
            },
          },
          ProfileNavigator: {
            screens: {
              Profile: 'profile',
              RewardsDashboard: 'profile/rewards',
              MembershipTiers: 'profile/membership',
              Wallet: 'profile/wallet',
            },
          },
        },
      },
      VerifyNavigator: {
        screens: {
          IdentityTrustCenter: 'verify/center',
          TrustScoreDashboard: 'verify/trust-score',
        },
      },
      ModalNavigator: {
        screens: {
          IncomingCall: 'concierge/incoming-call',
          AccountDeactivated: 'account/deactivated',
          PaymentSuccess: 'checkout/success',
        },
      },
      SafetyNavigator: {
        screens: {
          SafetyHub: 'safety',
          EmergencySOS: 'safety/emergency',
        },
      },
    },
  },
};
