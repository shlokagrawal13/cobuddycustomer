export const FontFamily = {
  // ─── Inter (body, labels, UI) ───────────────────────────────────────────────
  regular:   'Inter-Regular',
  medium:    'Inter-Medium',
  semiBold:  'Inter-SemiBold',
  bold:      'Inter-Bold',
  extraBold: 'Inter-ExtraBold',

  // ─── Playfair Display (headlines, display) ──────────────────────────────────
  // Variable font — weight axis selected per-token via fontWeight
  displayMedium:   'PlayfairDisplay-Medium',
  displaySemiBold: 'PlayfairDisplay-SemiBold',
  displayBold:     'PlayfairDisplay-Bold',
} as const;

export const FontSize = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   16,
  lg:   18,
  xl:   20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 40,
  '6xl': 48,
} as const;

export const LineHeight = {
  tight:   1.2,
  normal:  1.5,
  relaxed: 1.75,
} as const;

export const LetterSpacing = {
  tight:   -0.5,
  normal:   0,
  wide:     0.5,
  wider:    1.0,
  widest:   2.0,
} as const;

export const Typography = {
  // ─── Display (Playfair Display) ─────────────────────────────────────────────
  displayLarge: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['5xl'],
    lineHeight: FontSize['5xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  displayMedium: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
  },
  displaySmall: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize['3xl'],
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  },

  // ─── Headlines (Playfair Display) ───────────────────────────────────────────
  headlineLarge: {
    fontFamily: FontFamily.displaySemiBold,
    fontSize: FontSize['2xl'],
    lineHeight: FontSize['2xl'] * LineHeight.normal,
  },
  headlineMedium: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.normal,
  },
  headlineSmall: {
    fontFamily: FontFamily.displayMedium,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.normal,
  },

  // ─── Titles (Inter SemiBold/Medium) ─────────────────────────────────────────
  titleLarge: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  titleMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },
  titleSmall: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
  },

  // ─── Body (Inter Regular/Medium) ────────────────────────────────────────────
  bodyLarge: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.relaxed,
  },
  bodyMedium: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
  },
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.relaxed,
  },

  // ─── Labels / Caps (Inter Medium/Regular) ───────────────────────────────────
  labelLarge: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.normal,
    letterSpacing: LetterSpacing.wider,
  },
  labelMedium: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.wider,
  },
  labelSmall: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
    letterSpacing: LetterSpacing.widest,
  },
} as const;

export type TypographyVariant = keyof typeof Typography;
