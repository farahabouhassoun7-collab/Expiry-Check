import { useTranslation } from 'react-i18next';

const STYLES = {
  critical: { bg: 'rgba(186,26,26,0.08)',   color: 'var(--color-error)'     },
  high:     { bg: 'rgba(164,58,58,0.08)',   color: 'var(--color-tertiary)'  },
  medium:   { bg: 'rgba(0,88,190,0.08)',    color: 'var(--color-secondary)' },
  low:      { bg: 'rgba(0,108,73,0.08)',    color: 'var(--color-primary)'   },
  safe:     { bg: 'rgba(0,108,73,0.08)',    color: 'var(--color-primary)'   },
  expired:  { bg: 'rgba(186,26,26,0.12)',   color: 'var(--color-error)'     },
};

const LABEL_KEYS = {
  critical: 'common.critical',
  high:     'common.high',
  medium:   'common.medium',
  low:      'common.low',
  safe:     'common.safe',
  expired:  'common.expired',
};

export default function RiskBadge({ level = 'low' }) {
  const { t } = useTranslation();
  const key    = level.toLowerCase();
  const style  = STYLES[key] ?? STYLES.low;
  const labelKey = LABEL_KEYS[key] ?? LABEL_KEYS.low;

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
      style={{ background: style.bg, color: style.color }}
    >
      {t(labelKey)}
    </span>
  );
}
