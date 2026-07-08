// Placeholder — wire to analytics SDK in Phase 5
export const analytics = {
  track: (event: string, props?: Record<string, unknown>) => {
    if (__DEV__) console.log('[Analytics]', event, props);
  },
  identify: (userId: string, traits?: Record<string, unknown>) => {
    if (__DEV__) console.log('[Analytics:identify]', userId, traits);
  },
  screen: (name: string, props?: Record<string, unknown>) => {
    if (__DEV__) console.log('[Analytics:screen]', name, props);
  },
};
