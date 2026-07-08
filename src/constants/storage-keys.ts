export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_ID: 'user_id',
  IS_ONBOARDED: 'is_onboarded',
  IS_VERIFIED: 'is_verified',
  USER_ROLE: 'user_role',
  LANGUAGE: 'language',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  PIN_ENABLED: 'pin_enabled',
  THEME: 'theme',
  LAST_ACTIVE: 'last_active',
  FCM_TOKEN: 'fcm_token',
  ONBOARDING_STEP: 'onboarding_step',
} as const;
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];
