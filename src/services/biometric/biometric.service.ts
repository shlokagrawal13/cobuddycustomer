// Placeholder — wire to react-native-keychain in Phase 2
export const biometricService = {
  isAvailable: async (): Promise<boolean> => false,
  authenticate: async (): Promise<boolean> => false,
  saveCredentials: async (username: string, password: string): Promise<boolean> => false,
  getCredentials: async (): Promise<{username: string; password: string} | null> => null,
  clearCredentials: async (): Promise<boolean> => true,
};
