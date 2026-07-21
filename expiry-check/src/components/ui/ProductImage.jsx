import { useState } from 'react';
import { getProductImage } from '../../assets/images/index.js';

// ─── Size presets ─────────────────────────────────────────────
const SIZE_MAP = {
  xs: { px: 28, text: '10px', radius: 'var(--radius-md)' },
  sm: { px: 40, text: '13px', radius: 'var(--radius-md)' },
  md: { px: 56, text: '16px', radius: 'var(--radius-lg)' },
  lg: { px: 72, text: '20px', radius: 'var(--radius-xl)' },
  xl: { px: 96, text: '24px', radius: 'var(--radius-xl)' },
};

// ─── Initials helper ──────────────────────────────────────────
function getInitials(name = '') {
  // Strip batch/variant suffix before deriving initials
  const clean = name.replace(/\s*[-–(].*$/, '').trim();
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// ─── Deterministic fallback palette (design tokens only) ─────
const FALLBACK_BG = [
  'var(--color-surface-container-high)',
  'var(--color-secondary-fixed)',
  'var(--color-primary-fixed)',
  'var(--color-tertiary-fixed)',
  'var(--color-surface-container-highest)',
];
const FALLBACK_FG = [
  'var(--color-secondary)',
  'var(--color-on-secondary-fixed-variant)',
  'var(--color-on-primary-fixed-variant)',
  'var(--color-on-tertiary-fixed-variant)',
  'var(--color-on-surface)',
];

function hashIndex(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % FALLBACK_BG.length;
}

/**
 * ProductImage
 *
 * Renders a product image resolved automatically from the product name.
 * Falls back to styled initials avatar when no image is found or on error.
 *
 * Props
 * ─────
 *   name        {string}          Product name — drives both image lookup and fallback initials
 *   src         {string}          Optional direct URL override (skips auto-lookup)
 *   size        {xs|sm|md|lg|xl}  Preset size token (default: "md")
 *   customSize  {number}          Exact pixel size override
 *   grayscale   {boolean}         Desaturate image (resolved / inactive state)
 *   noShadow    {boolean}         Remove drop shadow
 *   noHover     {boolean}         Remove hover scale effect
 *   className   {string}          Extra class names on wrapper
 *   style       {object}          Extra inline styles on wrapper
 */
export default function ProductImage({
  name = '',
  src,
  size = 'md',
  customSize,
  grayscale = false,
  noShadow = false,
  noHover = false,
  className = '',
  style = {},
}) {
  const [loaded, setLoaded] = useState(false);
  const [error,  setError]  = useState(false);

  // Auto-resolve image — src override → name-based auto-lookup
  const resolvedSrc = src || getProductImage(name);
  const showImage   = !!resolvedSrc && !error;

  // Dimensions
  const preset    = SIZE_MAP[size] ?? SIZE_MAP.md;
  const px        = customSize ?? preset.px;
  const fontSize  = customSize ? `${Math.max(10, Math.round(customSize * 0.28))}px` : preset.text;

  // Fallback
  const idx      = hashIndex(name);
  const initials = getInitials(name);

  const wrapperStyle = {
    width:        px,
    height:       px,
    minWidth:     px,
    borderRadius: preset.radius,
    overflow:     'hidden',
    position:     'relative',
    flexShrink:   0,
    transition:   'transform 0.2s ease, box-shadow 0.2s ease',
    boxShadow:    noShadow ? 'none' : '0 2px 8px rgba(0,0,0,0.10)',
    filter:       grayscale ? 'grayscale(65%) opacity(0.75)' : 'none',
    ...style,
  };

  const hoverProps = noHover ? {} : {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform  = 'scale(1.04)';
      if (!noShadow) e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.14)';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform  = 'scale(1)';
      if (!noShadow) e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
    },
  };

  return (
    <div
      className={className}
      style={wrapperStyle}
      role="img"
      aria-label={name || 'Product image'}
      {...hoverProps}
    >
      {/* Shimmer skeleton while loading */}
      {showImage && !loaded && (
        <div
          style={{
            position:       'absolute',
            inset:          0,
            background:     'linear-gradient(90deg, var(--color-surface-container) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container) 75%)',
            backgroundSize: '200% 100%',
            animation:      'skeleton-shimmer 1.4s ease infinite',
          }}
        />
      )}

      {/* Image */}
      {showImage && (
        <img
          src={resolvedSrc}
          alt={name || 'Product'}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            display:    'block',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      {/* Initials fallback */}
      {!showImage && (
        <div
          style={{
            width:          '100%',
            height:         '100%',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            background:     FALLBACK_BG[idx],
            color:          FALLBACK_FG[idx],
            fontSize,
            fontWeight:     700,
            fontFamily:     'inherit',
            letterSpacing:  '0.02em',
            userSelect:     'none',
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
