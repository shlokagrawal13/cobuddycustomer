export const Spacing = {
  0: 0, 1: 2, 2: 4, 3: 6, 4: 8, 5: 10, 6: 12, 7: 14, 8: 16, 9: 18,
  10: 20, 12: 24, 14: 28, 16: 32, 18: 36, 20: 40, 24: 48, 28: 56,
  32: 64, 36: 72, 40: 80, 48: 96, 56: 112, 64: 128,
} as const;
export type SpacingKey = keyof typeof Spacing;

export const Layout = {
  screenHorizontal: 20,
  screenVertical: 20,
  sectionGap: 32,
  cardPadding: 16,
  cardGap: 12,
  inputHeight: 56,
  buttonHeight: 52,
  tabBarHeight: 80,
  headerHeight: 56,
  bottomSheetRadius: 24,
} as const;
