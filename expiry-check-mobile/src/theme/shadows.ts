import { Platform } from 'react-native';

const shadow = (elevation: number, opacity = 0.08) =>
  Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: opacity,
      shadowRadius: elevation * 2,
    },
    android: { elevation },
    default: {},
  });

export const Shadows = {
  card:   shadow(2, 0.06),
  cardMd: shadow(6, 0.10),
  modal:  shadow(20, 0.16),
  fab:    shadow(8, 0.25),
} as const;
