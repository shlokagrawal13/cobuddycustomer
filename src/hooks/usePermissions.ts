// Placeholder — wire to react-native-permissions in Phase 2
export type PermissionStatus = 'granted' | 'denied' | 'blocked' | 'unavailable';
export function usePermissions() {
  const requestCamera = async (): Promise<PermissionStatus> => 'granted';
  const requestMicrophone = async (): Promise<PermissionStatus> => 'granted';
  const requestLocation = async (): Promise<PermissionStatus> => 'granted';
  const requestNotifications = async (): Promise<PermissionStatus> => 'granted';
  return {requestCamera, requestMicrophone, requestLocation, requestNotifications};
}
