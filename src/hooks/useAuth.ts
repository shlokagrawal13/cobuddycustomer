import {useAuthStore} from '../store/authStore';
export function useAuth() {
  const store = useAuthStore();
  return {
    isAuthenticated: store.isAuthenticated,
    isOnboarded: store.isOnboarded,
    isVerified: store.isVerified,
    role: store.role,
    userId: store.userId,
    phone: store.phone,
    language: store.language,
    biometricEnabled: store.biometricEnabled,
    pinEnabled: store.pinEnabled,
    setAuthenticated: store.setAuthenticated,
    setOnboarded: store.setOnboarded,
    setVerified: store.setVerified,
    setPhone: store.setPhone,
    setLanguage: store.setLanguage,
    logout: store.logout,
  };
}
