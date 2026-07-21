// Expiry Check — Mobile Color System
// Mirrors the web app's CSS variables exactly

export const Colors = {
  // ── Primary (Green) ───────────────────────────────────────
  primary:              '#006c49',
  primaryContainer:     '#10b981',
  onPrimary:            '#ffffff',
  onPrimaryContainer:   '#00422b',
  primaryFixedDim:      '#4edea3',

  // ── Secondary (Blue) ──────────────────────────────────────
  secondary:            '#0058be',
  secondaryContainer:   '#2170e4',
  onSecondary:          '#ffffff',
  onSecondaryContainer: '#fefcff',

  // ── Tertiary (Red-ish) ────────────────────────────────────
  tertiary:             '#a43a3a',
  tertiaryContainer:    '#fc7c78',
  onTertiary:           '#ffffff',
  onTertiaryContainer:  '#711419',

  // ── Error ─────────────────────────────────────────────────
  error:                '#ba1a1a',
  errorContainer:       '#ffdad6',
  onError:              '#ffffff',
  onErrorContainer:     '#93000a',

  // ── Backgrounds ───────────────────────────────────────────
  background:           '#f8f9ff',
  backgroundPure:       '#ffffff',
  surface:              '#f8f9ff',
  surfaceMuted:         '#F8FAFC',
  surfaceContainer:     '#e5eeff',
  surfaceContainerHigh: '#dce9ff',

  // ── Text ──────────────────────────────────────────────────
  textHeading:          '#0F172A',
  textBody:             '#334155',
  outline:              '#6c7a71',
  outlineVariant:       '#bbcabf',
  borderSubtle:         '#E2E8F0',

  // ── On surface ────────────────────────────────────────────
  onSurface:            '#0b1c30',
  onSurfaceVariant:     '#3c4a42',
  inverseOnSurface:     '#eaf1ff',
  inverseSurface:       '#213145',

  // ── Accent ────────────────────────────────────────────────
  accentDanger:         '#FF3D57',

  // ── Dark Mode ─────────────────────────────────────────────
  dark: {
    background:           '#0d1117',
    backgroundPure:       '#161b22',
    surface:              '#161b22',
    surfaceMuted:         '#1c2333',
    surfaceContainer:     '#1c2333',
    textHeading:          '#f0f6fc',
    textBody:             '#8b949e',
    outline:              '#484f58',
    borderSubtle:         '#30363d',
    onSurface:            '#e6edf3',
    primary:              '#3fb98a',
    secondary:            '#4d8ef0',
    tertiary:             '#f87171',
    error:                '#f87171',
    accentDanger:         '#ff6b81',
  },
} as const;

export type ColorKey = keyof typeof Colors;
