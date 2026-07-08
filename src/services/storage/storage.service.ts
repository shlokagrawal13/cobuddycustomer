// Placeholder — wire to react-native-mmkv in Phase 2
const store: Record<string, string> = {};
export const storage = {
  set: (key: string, value: string) => { store[key] = value; },
  getString: (key: string): string | undefined => store[key],
  delete: (key: string) => { delete store[key]; },
  clearAll: () => { Object.keys(store).forEach(k => delete store[k]); },
};
