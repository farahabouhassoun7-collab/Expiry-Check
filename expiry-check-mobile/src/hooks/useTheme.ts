import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../theme/colors';

export type Theme = 'light' | 'dark' | 'system';

let _theme: Theme = 'system';
const listeners = new Set<() => void>();

export function setAppTheme(t: Theme) {
  _theme = t;
  listeners.forEach(fn => fn());
}

export function useTheme() {
  const system = useColorScheme();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const cb = () => forceUpdate(n => n + 1);
    listeners.add(cb);
    return () => { listeners.delete(cb); };
  }, []);

  const resolved = _theme === 'system' ? (system ?? 'light') : _theme;
  const isDark    = resolved === 'dark';

  const colors = isDark ? {
    background:       Colors.dark.background,
    backgroundPure:   Colors.dark.backgroundPure,
    surface:          Colors.dark.surface,
    surfaceMuted:     Colors.dark.surfaceMuted,
    surfaceContainer: Colors.dark.surfaceContainer,
    textHeading:      Colors.dark.textHeading,
    textBody:         Colors.dark.textBody,
    outline:          Colors.dark.outline,
    borderSubtle:     Colors.dark.borderSubtle,
    onSurface:        Colors.dark.onSurface,
    primary:          Colors.dark.primary,
    secondary:        Colors.dark.secondary,
    tertiary:         Colors.dark.tertiary,
    error:            Colors.dark.error,
    accentDanger:     Colors.dark.accentDanger,
    // keep others from light
    primaryContainer:       Colors.primaryContainer,
    onPrimary:              Colors.onPrimary,
    onPrimaryContainer:     Colors.onPrimaryContainer,
    primaryFixedDim:        Colors.primaryFixedDim,
    secondaryContainer:     Colors.secondaryContainer,
    onSecondary:            Colors.onSecondary,
    tertiaryContainer:      Colors.tertiaryContainer,
    onTertiary:             Colors.onTertiary,
    errorContainer:         Colors.errorContainer,
    onErrorContainer:       Colors.onErrorContainer,
    outlineVariant:         Colors.outlineVariant,
    inverseSurface:         Colors.inverseSurface,
    inverseOnSurface:       Colors.inverseOnSurface,
    onSurfaceVariant:       Colors.onSurfaceVariant,
    surfaceContainerHigh:   Colors.surfaceContainerHigh,
    onSecondaryContainer:   Colors.onSecondaryContainer,
    onTertiaryContainer:    Colors.onTertiaryContainer,
  } : { ...Colors, ...Object.fromEntries(
    Object.entries(Colors).filter(([k]) => k !== 'dark')
  ) } as typeof Colors & typeof Colors.dark;

  return { isDark, theme: resolved, preference: _theme, setTheme: setAppTheme, colors };
}
