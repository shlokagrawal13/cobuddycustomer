// Placeholder — wire to @react-native-community/geolocation in Phase 3
export interface Coordinates { lat: number; lng: number; }
export const locationService = {
  getCurrentPosition: async (): Promise<Coordinates | null> => null,
  watchPosition: (callback: (coords: Coordinates) => void) => {
    return 0; // watch ID
  },
  clearWatch: (watchId: number) => {},
};
