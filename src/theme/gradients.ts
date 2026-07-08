export const Gradients = {
  surfaceTop: ['#20201a', '#14140f'] as string[],
  surfaceCard: ['#2b2a24', '#1c1c16'] as string[],
  goldPrimary: ['#f2ca50', '#c9a227'] as string[],
  goldSubtle: ['rgba(242,202,80,0.15)', 'rgba(242,202,80,0)'] as string[],
  darkOverlay: ['rgba(20,20,15,0)', 'rgba(20,20,15,0.95)'] as string[],
  darkTop: ['rgba(20,20,15,0.8)', 'rgba(20,20,15,0)'] as string[],
  heroFade: ['rgba(20,20,15,0.1)', 'rgba(20,20,15,0.6)', 'rgba(20,20,15,1)'] as string[],
  platinumSheen: ['#e5e4e2', '#c0bfc0'] as string[],
  blackTier: ['#2a2a2a', '#0f0f0f'] as string[],
} as const;
export type GradientKey = keyof typeof Gradients;
