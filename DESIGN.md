---
name: Luminous Intelligence
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#a43a3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  background-pure: '#FFFFFF'
  surface-muted: '#F8FAFC'
  border-subtle: '#E2E8F0'
  text-heading: '#0F172A'
  text-body: '#334155'
  accent-danger: '#FF3D57'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style
The design system focuses on **minimalism** and **high-utility precision**, tailored for a B2B SaaS environment where inventory data needs to be parsed at a glance. The brand personality is authoritative yet approachable, evoking the "intelligence" of AI through crisp execution and "premium startup" aesthetics. 

The visual language draws inspiration from Linear’s structured efficiency and Stripe’s clarity. It prioritizes whitespace and functional density, ensuring that users can manage complex inventory lifecycles without cognitive overload. The emotional response should be one of confidence, reliability, and modern sophistication.

## Colors
The palette is rooted in a **Pure White (#FFFFFF)** foundation to maximize the "minimalist premium" feel. 

- **Primary (Emerald Green):** Symbolizes growth, freshness, and "safe" inventory status. Use for primary actions and positive data trends.
- **Secondary (Electric Blue):** Represents the AI intelligence layer and data analytics. Use for secondary buttons, information highlights, and link states.
- **Neutrals (Slate Grays):** A sophisticated scale of grays handles all structural elements. Text-heading is near-black for high contrast, while borders are kept extremely subtle to allow content to breathe.
- **Accent (Danger Red):** Reserved strictly for critical expiry alerts and destructive actions.

## Typography
**Inter** is the core typeface for its exceptional legibility in data-heavy interfaces. The hierarchy relies on tight letter-spacing for headlines to achieve a modern, "compact" look. 

- **Display & Headlines:** Use for page titles and high-level dashboard metrics.
- **Body:** `body-sm` is the workhorse for data tables and list items to maintain density.
- **Labels:** Used for status badges and table headers. The small, uppercase styling provides clear visual separation from content.
- **Code:** Used for SKU numbers, batch IDs, and developer-facing API keys.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop (max 1280px) to maintain a controlled, premium reading experience, and transitions to a **Fluid Grid** on mobile.

- **Rhythm:** A 4px baseline grid ensures consistent vertical rhythm.
- **Density:** In data views (tables/grids), use `stack-sm` for padding to maximize information visibility. In marketing or dashboard overviews, use `stack-lg` to create a "premium" airy feel.
- **Breakpoints:** 
    - Mobile: < 768px (Single column, 16px margins).
    - Tablet: 768px - 1024px (8-column grid, 24px margins).
    - Desktop: > 1024px (12-column grid, 32px margins).

## Elevation & Depth
This design system avoids heavy shadows, instead using **Tonal Layers** and **Low-contrast outlines** to define depth.

- **Level 0 (Background):** Pure White (#FFFFFF).
- **Level 1 (Cards/Surfaces):** Use a subtle 1px border (#E2E8F0). When an element needs to "pop," use a very soft ambient shadow: `0 4px 6px -1px rgba(0, 0, 0, 0.05)`.
- **Level 2 (Modals/Popovers):** Elevated with a more pronounced, diffused shadow and a background blur (12px) on the overlay to maintain focus.
- **Interactive States:** On hover, elements should shift from a transparent border to a secondary blue border or increase shadow depth slightly.

## Shapes
A **Rounded (8px)** aesthetic is the standard, striking a balance between the friendliness of consumer apps and the precision of enterprise software. 

- **Standard (rounded-md):** 8px for buttons, input fields, and small cards.
- **Large (rounded-lg):** 16px for main dashboard containers and modal windows.
- **Pill:** Reserved exclusively for Status Badges and Tag components.

## Components

- **Buttons:** Primary buttons use a solid Emerald Green fill with white text. Secondary buttons use a white background with a subtle slate border. Use a "squishy" active state (scale 0.98) to provide tactile feedback.
- **Status Badges:** Use the "Pill" shape. Apply low-saturation backgrounds (e.g., 10% opacity of the brand color) with high-saturation text for readability (e.g., light green background with dark emerald text).
- **Input Fields:** 8px corners, 1px slate border. On focus, the border transitions to Electric Blue with a soft blue outer glow (3px spread).
- **Data Tables:** High-density layout. Use `body-sm` for rows. Alternating row colors is avoided; instead, use a subtle hover state highlight (#F8FAFC).
- **Cards:** Minimalist execution. No heavy borders; use 1px #E2E8F0. Header areas within cards should have a subtle bottom border to separate titles from data.
- **Data Visualizations:** Use a combination of Emerald Green (positive trends) and Electric Blue (neutral data). Use thick stroke widths (2.5px+) for line charts to maintain a "bold" minimalist feel.