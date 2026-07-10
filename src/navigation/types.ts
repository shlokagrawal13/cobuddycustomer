import type {NavigatorScreenParams} from '@react-navigation/native';

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Waitlist: undefined;
  RoleSelection: undefined;
  PhoneInput: undefined;
  OTPVerification: {phone: string};
  BiometricSetup: undefined;
  PINSetup: undefined;
  LanguageSelection: undefined;
  LocationPermission: undefined;
  NotificationPermission: undefined;
  PermissionRecovery: undefined;
};

// ─── Onboarding Stack ─────────────────────────────────────────────────────────
export type OnboardingStackParamList = {
  LegalConsent: undefined;
  BasicProfileSetup: undefined;
  InterestSelection: undefined;
  ComfortPreferences: undefined;
  LifestylePersonalization: undefined;
  SafetyTutorial: undefined;
  FirstRecommendations: undefined;
};

// ─── Verify Stack ─────────────────────────────────────────────────────────────
export type VerifyStackParamList = {
  SelfieCapture: undefined;
  LivenessDetection: undefined;
  KYCDocumentUpload: undefined;
  VerificationProcessing: undefined;
  VerificationPending: undefined;
  IdentityTrustCenter: undefined;
  TrustScoreDashboard: undefined;
};

// ─── Home Stack ───────────────────────────────────────────────────────────────
export type HomeStackParamList = {
  HomeDashboard: undefined;
  Explore: undefined;
  CompanionListing: {category: string; filters: string[]};
  CompanionBrowse: undefined;
  CompanionProfile: {companionId: string};
  CompanionCalendar: {companionId: string};
  // BookingSummary registered here so CompanionCalendar can navigate directly
  // without fragile cross-tab getParent() chains.
  // Also kept in SessionsStackParamList for Sessions tab deep links.
  BookingSummary: {companionId: string; slotId: string; venueId?: string};
  VenueBrowse: undefined;
  VenueDetail: {venueId: string};
  ExperienceDetail: {experienceId: string};
  EventsBrowse: undefined;
  EventDetail: {eventId: string};
  DiningDiscovery: undefined;
  TravelStays: undefined;
  WellnessExperiences: undefined;
  MapNavigation: {sessionId?: string};
  CompanionFilter: undefined;
  Wishlist: undefined;
};

// ─── Search Stack ─────────────────────────────────────────────────────────────
export type SearchStackParamList = {
  SearchHub: undefined;
  AIMatchFeed: undefined;
  CommunityBrowse: undefined;
  CommunityDetail: {communityId: string};
  ProfessionalCircles: undefined;
};

// ─── Sessions Stack ───────────────────────────────────────────────────────────
export type SessionsStackParamList = {
  BookingSummary: {companionId: string; slotId: string; venueId?: string};
  SessionPrep: {bookingId: string};
  BookingConfirmed: {bookingId: string};
  DigitalPass: {bookingId: string};
  UpcomingSession: {sessionId: string};
  ArrivalVerification: {sessionId: string};
  ActiveSession: {sessionId: string};
  SafetyMonitor: {sessionId: string};
  CompleteSession: {sessionId: string};
  PostSessionFeedback: {sessionId: string};
  TipGratuity: {sessionId: string};
  SessionHistory: undefined;
  PastSessionDetail: {sessionId: string};
  BookingHistory: undefined;
  DisputeRefund: {bookingId: string};
  SessionCancel: {sessionId: string};
  ModifyBooking: {sessionId: string};
};

// ─── Concierge Stack ──────────────────────────────────────────────────────────
export type ConciergeStackParamList = {
  ConciergeDashboard: undefined;
  MessagingThread: {conversationId: string};
  ChatMediaPicker: {conversationId: string};
  VoiceVideoCall: {callId: string; callType: 'voice' | 'video'};
  Notifications: undefined;
  NotificationPreferences: undefined;
  HelpCenter: undefined;
  HelpArticle: {articleId?: string; categoryId?: string};
  MediaPreview: {uri?: string; conversationId?: string};
};

// ─── Profile Stack ────────────────────────────────────────────────────────────
export type ProfileStackParamList = {
  Profile: undefined;
  RewardsDashboard: undefined;
  RewardRedemption: {rewardId: string};
  MembershipTiers: undefined;
  TierUpgrade: {targetTier: string};
  MembershipCancel: undefined;
  Wallet: undefined;
  TransactionHistory: undefined;
  TransactionDetail: {transactionId: string};
  PaymentMethods: undefined;
  ReferralProgram: undefined;
  ReferralTracking: undefined;
  SettingsHub: undefined;
  LifestylePreferences: undefined;
  Appearance: undefined;
  BlockedUsers: undefined;
  LanguageSelection: undefined;
  PermissionRecovery: undefined;
  EditProfile: undefined;
  ChangePhone: undefined;
  AddPaymentMethod: undefined;
  TextSize: undefined;
  ReceiptViewer: {transactionId?: string};
  DataPortability: undefined;
  DataRetention: undefined;
  ConsentManager: undefined;
  SetDefaultPayment: {methodId?: string};
  InviteContact: undefined;
};

// ─── Safety Stack ─────────────────────────────────────────────────────────────
export type SafetyStackParamList = {
  SafetyHub: undefined;
  TrustedContacts: undefined;
  EmergencySOS: {sessionId?: string};
  IncidentReport: {sessionId?: string};
  EditTrustedContact: {contactId?: string};
  IncidentEvidenceUpload: {reportId?: string};
};

// ─── Modal Stack ──────────────────────────────────────────────────────────────
export type ModalStackParamList = {
  IncomingCall: {callId: string};
  AccountDeactivated: undefined;
  DeleteAccount: undefined;
  Checkout: {companionId: string; slotId: string; venueId?: string; eventId?: string};
  VIPEventReservation: {eventId: string};
  PaymentProcessing: {bookingId: string; amount?: number};
  PaymentSuccess: {bookingId: string; amount: number};
};

// ─── Main Tab ─────────────────────────────────────────────────────────────────
export type MainTabParamList = {
  HomeNavigator: NavigatorScreenParams<HomeStackParamList>;
  SearchNavigator: NavigatorScreenParams<SearchStackParamList>;
  SessionsNavigator: NavigatorScreenParams<SessionsStackParamList>;
  ConciergeNavigator: NavigatorScreenParams<ConciergeStackParamList>;
  ProfileNavigator: NavigatorScreenParams<ProfileStackParamList>;
};

// ─── Root Stack ───────────────────────────────────────────────────────────────
export type RootStackParamList = {
  AuthNavigator: NavigatorScreenParams<AuthStackParamList>;
  OnboardingNavigator: NavigatorScreenParams<OnboardingStackParamList>;
  VerifyNavigator: NavigatorScreenParams<VerifyStackParamList>;
  MainTabNavigator: NavigatorScreenParams<MainTabParamList>;
  SafetyNavigator: NavigatorScreenParams<SafetyStackParamList>;
  ModalNavigator: NavigatorScreenParams<ModalStackParamList>;
};
