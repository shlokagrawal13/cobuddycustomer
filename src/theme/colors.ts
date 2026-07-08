export const Colors = {
  // Surface
  surface: '#14140f',
  surfaceDim: '#14140f',
  surfaceBright: '#3a3933',
  surfaceContainerLowest: '#0f0e0a',
  surfaceContainerLow: '#1c1c16',
  surfaceContainer: '#20201a',
  surfaceContainerHigh: '#2b2a24',
  surfaceContainerHighest: '#36352f',

  // On Surface
  onSurface: '#e6e2d9',
  onSurfaceVariant: '#d0c5af',
  inverseSurface: '#e6e2d9',
  inverseOnSurface: '#31302b',

  // Primary (Gold)
  primary: '#f2ca50',
  onPrimary: '#14140f',
  primaryContainer: '#3d3200',
  onPrimaryContainer: '#f2ca50',
  inversePrimary: '#6b5900',

  // Secondary
  secondary: '#d6c4a0',
  onSecondary: '#3a2f14',
  secondaryContainer: '#524529',
  onSecondaryContainer: '#f3e0bb',

  // Tertiary
  tertiary: '#b8cfa2',
  onTertiary: '#243719',
  tertiaryContainer: '#3a4e2d',
  onTertiaryContainer: '#d4ecbc',

  // Error
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  // Outline
  outline: '#998e77',
  outlineVariant: '#4d4639',

  // Utility
  shadow: '#000000',
  scrim: '#000000',
  transparent: 'transparent',
  white: '#ffffff',
  black: '#000000',

  // Semantic
  success: '#6dd98c',
  warning: '#f2ca50',
  info: '#89b4e0',
  gold: '#f2ca50',
  platinum: '#e5e4e2',
  blackTier: '#1a1a1a',

  // Overlay
  overlay10: 'rgba(0,0,0,0.10)',
  overlay20: 'rgba(0,0,0,0.20)',
  overlay40: 'rgba(0,0,0,0.40)',
  overlay60: 'rgba(0,0,0,0.60)',
  overlay80: 'rgba(0,0,0,0.80)',
  goldOverlay10: 'rgba(242,202,80,0.10)',
  goldOverlay20: 'rgba(242,202,80,0.20)',
} as const;

export type ColorKey = keyof typeof Colors;
