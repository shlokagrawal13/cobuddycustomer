export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radii';
export * from './shadows';
export * from './gradients';
export * from './animations';

import {Colors} from './colors';
import {Typography, FontFamily, FontSize} from './typography';
import {Spacing, Layout} from './spacing';
import {Radii} from './radii';
import {Shadows} from './shadows';
import {Gradients} from './gradients';
import {Durations, Easings, AnimationConfig} from './animations';

export const Theme = {
  colors: Colors,
  typography: Typography,
  fontFamily: FontFamily,
  fontSize: FontSize,
  spacing: Spacing,
  layout: Layout,
  radii: Radii,
  shadows: Shadows,
  gradients: Gradients,
  durations: Durations,
  easings: Easings,
  animations: AnimationConfig,
} as const;

export type AppTheme = typeof Theme;
