export const colors = {
  brandTeal: '#0F6B5C',
  brandTealDark: '#0B5347',
  tealSurface: '#E7F4F1',
  tealSurfaceStrong: '#D3EDE7',
  tealBorder: '#BFE2DA',

  navy: '#12203A',
  navyMuted: '#4B5A72',
  textPrimary: '#152238',
  textSecondary: '#6B7686',
  textMuted: '#93A0AF',

  background: '#F5F7F8',
  cardBackground: '#FFFFFF',
  border: '#E7EAEE',

  gold: '#D4A017',
  silver: '#9AA5B1',
  bronze: '#C6803D',
  star: '#0F6B5C',

  danger: '#C0392B',
  dangerSurface: '#FBEAE8',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const typography = {
  h1: { fontSize: 22, fontWeight: '700' as const },
  h2: { fontSize: 17, fontWeight: '700' as const },
  h3: { fontSize: 15, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyBold: { fontSize: 14, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  captionBold: { fontSize: 12, fontWeight: '600' as const },
  price: { fontSize: 20, fontWeight: '700' as const },
};

export const shadow = {
  card: {
    shadowColor: '#0B1A2A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};