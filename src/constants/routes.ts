export const ROUTES = {
  // Navigators
  AUTH_NAVIGATOR: 'AuthNavigator',
  ONBOARDING_NAVIGATOR: 'OnboardingNavigator',
  VERIFY_NAVIGATOR: 'VerifyNavigator',
  MAIN_TAB_NAVIGATOR: 'MainTabNavigator',
  HOME_NAVIGATOR: 'HomeNavigator',
  SEARCH_NAVIGATOR: 'SearchNavigator',
  SESSIONS_NAVIGATOR: 'SessionsNavigator',
  CONCIERGE_NAVIGATOR: 'ConciergeNavigator',
  PROFILE_NAVIGATOR: 'ProfileNavigator',
  SAFETY_NAVIGATOR: 'SafetyNavigator',
  MODAL_NAVIGATOR: 'ModalNavigator',

  // AUTH 01-12
  SPLASH: 'Splash',
  WELCOME: 'Welcome',
  WAITLIST: 'Waitlist',
  ROLE_SELECTION: 'RoleSelection',
  PHONE_INPUT: 'PhoneInput',
  OTP_VERIFICATION: 'OTPVerification',
  BIOMETRIC_SETUP: 'BiometricSetup',
  PIN_SETUP: 'PINSetup',
  LANGUAGE_SELECTION: 'LanguageSelection',
  LOCATION_PERMISSION: 'LocationPermission',
  NOTIFICATION_PERMISSION: 'NotificationPermission',
  PERMISSION_RECOVERY: 'PermissionRecovery',

  // ONBOARDING 13-19
  LEGAL_CONSENT: 'LegalConsent',
  PROFILE_SETUP: 'BasicProfileSetup',
  INTEREST_SELECTION: 'InterestSelection',
  COMFORT_PREFERENCES: 'ComfortPreferences',
  LIFESTYLE: 'LifestylePersonalization',
  SAFETY_TUTORIAL: 'SafetyTutorial',
  FIRST_RECOMMENDATIONS: 'FirstRecommendations',

  // VERIFY 20-26
  VERIFY_SELFIE: 'SelfieCapture',
  VERIFY_LIVENESS: 'LivenessDetection',
  VERIFY_DOCUMENTS: 'KYCDocumentUpload',
  VERIFY_PROCESSING: 'VerificationProcessing',
  VERIFY_PENDING: 'VerificationPending',
  IDENTITY_TRUST_CENTER: 'IdentityTrustCenter',
  TRUST_SCORE: 'TrustScoreDashboard',

  // HOME TAB 27-40
  HOME: 'HomeDashboard',
  COMPANION_BROWSE: 'CompanionBrowse',
  COMPANION_PROFILE: 'CompanionProfile',
  COMPANION_CALENDAR: 'CompanionCalendar',
  VENUE_BROWSE: 'VenueBrowse',
  VENUE_DETAIL: 'VenueDetail',
  EXPERIENCE_DETAIL: 'ExperienceDetail',
  EVENTS_BROWSE: 'EventsBrowse',
  EVENT_DETAIL: 'EventDetail',
  DINING_DISCOVERY: 'DiningDiscovery',
  TRAVEL_STAYS: 'TravelStays',
  WELLNESS_EXPERIENCES: 'WellnessExperiences',
  MAP_NAVIGATION: 'MapNavigation',
  WISHLIST: 'Wishlist',

  // SEARCH TAB 41-45
  SEARCH_HUB: 'SearchHub',
  AI_MATCH_FEED: 'AIMatchFeed',
  COMMUNITY_BROWSE: 'CommunityBrowse',
  COMMUNITY_DETAIL: 'CommunityDetail',
  PROFESSIONAL_CIRCLES: 'ProfessionalCircles',

  // SESSIONS TAB 46-60
  BOOKING_SUMMARY: 'BookingSummary',
  SESSION_PREP: 'SessionPrep',
  BOOKING_CONFIRMED: 'BookingConfirmed',
  DIGITAL_PASS: 'DigitalPass',
  UPCOMING_SESSION: 'UpcomingSession',
  ARRIVAL_VERIFICATION: 'ArrivalVerification',
  ACTIVE_SESSION: 'ActiveSession',
  SAFETY_MONITOR: 'SafetyMonitor',
  COMPLETE_SESSION: 'CompleteSession',
  POST_SESSION_FEEDBACK: 'PostSessionFeedback',
  TIP_GRATUITY: 'TipGratuity',
  SESSION_HISTORY: 'SessionHistory',
  PAST_SESSION_DETAIL: 'PastSessionDetail',
  BOOKING_HISTORY: 'BookingHistory',
  DISPUTE_REFUND: 'DisputeRefund',

  // CONCIERGE TAB 61-68
  CONCIERGE_DASHBOARD: 'ConciergeDashboard',
  MESSAGING_THREAD: 'MessagingThread',
  CHAT_MEDIA_PICKER: 'ChatMediaPicker',
  VOICE_VIDEO_CALL: 'VoiceVideoCall',
  INCOMING_CALL: 'IncomingCall',
  NOTIFICATIONS: 'Notifications',
  NOTIFICATION_PREFS: 'NotificationPreferences',
  HELP_CENTER: 'HelpCenter',

  // PROFILE TAB 69-84
  PROFILE: 'Profile',
  REWARDS_DASHBOARD: 'RewardsDashboard',
  REWARD_REDEMPTION: 'RewardRedemption',
  MEMBERSHIP_TIERS: 'MembershipTiers',
  TIER_UPGRADE: 'TierUpgrade',
  MEMBERSHIP_CANCEL: 'MembershipCancel',
  WALLET: 'Wallet',
  TRANSACTION_HISTORY: 'TransactionHistory',
  TRANSACTION_DETAIL: 'TransactionDetail',
  PAYMENT_METHODS: 'PaymentMethods',
  REFERRAL_PROGRAM: 'ReferralProgram',
  REFERRAL_TRACKING: 'ReferralTracking',
  SETTINGS_HUB: 'SettingsHub',
  LIFESTYLE_PREFERENCES: 'LifestylePreferences',
  APPEARANCE: 'Appearance',
  BLOCKED_USERS: 'BlockedUsers',

  // SAFETY 90-93
  SAFETY_HUB: 'SafetyHub',
  TRUSTED_CONTACTS: 'TrustedContacts',
  EMERGENCY_SOS: 'EmergencySOS',
  INCIDENT_REPORT: 'IncidentReport',

  // SYSTEM / MODALS 65, 85-89
  ACCOUNT_DEACTIVATED: 'AccountDeactivated',
  CHECKOUT: 'Checkout',
  VIP_RESERVATION: 'VIPEventReservation',
  PAYMENT_PROCESSING: 'PaymentProcessing',
  PAYMENT_SUCCESS: 'PaymentSuccess',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteName = (typeof ROUTES)[RouteKey];
