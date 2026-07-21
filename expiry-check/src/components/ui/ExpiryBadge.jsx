import { useTranslation } from 'react-i18next';

const BADGE_STYLES = {
  critical: {
    bg: 'rgba(186,26,26,0.10)',
    color: 'var(--color-error)',
  },
  high: {
    bg: 'rgba(0,88,190,0.10)',
    color: 'var(--color-secondary)',
  },
  resolved: {
    bg: 'rgba(0,108,73,0.10)',
    color: 'var(--color-primary)',
  },
  upcoming: {
    bg: 'rgba(0,88,190,0.08)',
    color: 'var(--color-secondary)',
  },
};

const BADGE_LABEL_KEYS = {
  critical: 'alerts.badge_critical',
  high:     'alerts.badge_high',
  resolved: 'alerts.badge_resolved',
  upcoming: 'alerts.badge_upcoming',
};

export default function ExpiryBadge({ variant = 'upcoming' }) {
  const { t } = useTranslation();
  const style = BADGE_STYLES[variant] ?? BADGE_STYLES.upcoming;
  const labelKey = BADGE_LABEL_KEYS[variant] ?? BADGE_LABEL_KEYS.upcoming;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
      style={{ background: style.bg, color: style.color }}
    >
      {t(labelKey)}
    </span>
  );
}
