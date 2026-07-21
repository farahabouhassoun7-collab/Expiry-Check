import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios:     'System',
  android: 'Roboto',
  default: 'System',
});

export const Typography = {
  h1:      { fontFamily, fontSize: 28, fontWeight: '800' as const, lineHeight: 34 },
  h2:      { fontFamily, fontSize: 22, fontWeight: '700' as const, lineHeight: 28 },
  h3:      { fontFamily, fontSize: 18, fontWeight: '700' as const, lineHeight: 24 },
  h4:      { fontFamily, fontSize: 15, fontWeight: '700' as const, lineHeight: 21 },
  body:    { fontFamily, fontSize: 14, fontWeight: '400' as const, lineHeight: 21 },
  bodyBold:{ fontFamily, fontSize: 14, fontWeight: '600' as const, lineHeight: 21 },
  small:   { fontFamily, fontSize: 12, fontWeight: '400' as const, lineHeight: 18 },
  smallBold:{ fontFamily, fontSize: 12, fontWeight: '600' as const, lineHeight: 18 },
  caption: { fontFamily, fontSize: 10, fontWeight: '600' as const, lineHeight: 14, letterSpacing: 0.8 },
  label:   { fontFamily, fontSize: 11, fontWeight: '700' as const, lineHeight: 16, letterSpacing: 1.2 },
} as const;
