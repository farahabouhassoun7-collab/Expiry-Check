import { useTranslation } from 'react-i18next';
import ExpiryBadge from './ExpiryBadge';
import ActionDropdown from './ActionDropdown';
import ProductImage from './ProductImage';

const VARIANT_BAR_COLOR = {
  critical: 'var(--color-error)',
  high:     'var(--color-secondary)',
  resolved: 'var(--color-primary)',
};

const VARIANT_HOVER = {
  critical: { border: 'rgba(186,26,26,0.25)', shadow: 'rgba(186,26,26,0.06)' },
  high:     { border: 'rgba(0,88,190,0.25)',  shadow: 'rgba(0,88,190,0.06)'  },
  resolved: { border: 'rgba(0,108,73,0.20)',  shadow: 'rgba(0,108,73,0.04)'  },
};

const STATUS_ICON = {
  critical: { icon: 'event_busy', color: 'var(--color-tertiary)'   },
  high:     { icon: 'schedule',   color: 'var(--color-secondary)'  },
  resolved: { icon: 'task_alt',   color: 'var(--color-primary)'    },
};

/**
 * AlertCard — prominent alert card used in Today/Yesterday sections.
 * Uses ProductImage for all product thumbnail rendering.
 */
export default function AlertCard({
  variant = 'critical',
  id,
  title,
  subtitle,
  resolved = false,
}) {
  const { t } = useTranslation();
  const barColor = VARIANT_BAR_COLOR[variant] ?? 'var(--color-outline)';
  const hover    = VARIANT_HOVER[variant];
  const status   = STATUS_ICON[variant];

  return (
    <div
      className="group rounded-xl overflow-hidden transition-all duration-300 animate-fade-in"
      style={{
        background: resolved ? 'var(--color-surface-muted)' : 'var(--color-background-pure)',
        border:     '1px solid var(--color-border-subtle)',
        boxShadow:  'var(--shadow-card)',
        opacity:    resolved ? 0.85 : 1,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.borderColor = hover.border;
          e.currentTarget.style.boxShadow   = `0 8px 24px -4px ${hover.shadow}, var(--shadow-card)`;
          e.currentTarget.style.transform   = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
        e.currentTarget.style.boxShadow   = 'var(--shadow-card)';
        e.currentTarget.style.transform   = 'translateY(0)';
      }}
    >
      <div className="flex items-stretch">
        {/* Severity bar */}
        <div className="w-1.5 flex-shrink-0" style={{ background: barColor }} />

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">

          {/* ── Product image ── */}
          <ProductImage
            name={title}
            size="md"
            grayscale={resolved}
            noHover={resolved}
            style={{ border: '1px solid var(--color-border-subtle)' }}
          />

          {/* ── Product info ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <ExpiryBadge variant={variant} />
              <span className="text-xs" style={{ color: 'var(--color-outline)' }}>
                • ID: {id}
              </span>
            </div>
            <h4
              className="text-base font-semibold leading-snug mb-1.5 truncate"
              style={{ color: 'var(--color-text-heading)' }}
            >
              {title}
            </h4>
            <p
              className="text-sm flex items-center gap-1.5"
              style={{
                color:      status.color,
                fontWeight: variant === 'critical' ? 600 : variant === 'resolved' ? 500 : 400,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {status.icon}
              </span>
              {subtitle}
            </p>
          </div>

          {/* ── Action ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {resolved ? (
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                style={{
                  background: 'var(--color-background-pure)',
                  border:     '1px solid var(--color-border-subtle)',
                  color:      'var(--color-text-body)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-background-pure)')}
              >
                {t('alerts.view_logs')}
              </button>
            ) : (
              <ActionDropdown />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
