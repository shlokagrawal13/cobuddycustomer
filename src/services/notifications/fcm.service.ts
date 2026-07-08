// Placeholder — wire to @react-native-firebase/messaging in Phase 4
export const fcmService = {
  getToken: async (): Promise<string> => 'mock-fcm-token',
  requestPermission: async (): Promise<boolean> => true,
  onMessage: (handler: (msg: unknown) => void) => {
    console.log('[FCM] onMessage registered');
    return () => {};
  },
  onNotificationOpenedApp: (handler: (msg: unknown) => void) => {
    return () => {};
  },
};
