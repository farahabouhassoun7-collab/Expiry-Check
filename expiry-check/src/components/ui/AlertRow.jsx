import { useTranslation } from 'react-i18next';
import ProductImage from './ProductImage';

export default function AlertRow({ date, title, status, statusColor, dotColor }) {
  const { t } = useTranslation();

  return (
    <div
      className="px-4 py-3 flex items-center gap-3 transition-colors group/row cursor-pointer"
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      <ProductImage
        name={title}
        size="sm"
        noShadow
        style={{ border: '1px solid var(--color-border-subtle)', flexShrink: 0 }}
      />

      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />

      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold block mb-0.5" style={{ color: 'var(--color-outline)' }}>
          {date}
        </span>
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text-heading)' }}>
          {title}{' '}
          <span className="font-normal" style={{ color: statusColor }}>— {status}</span>
        </p>
      </div>

      <div className="hidden group-hover/row:flex items-center gap-3">
        <button className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
          {t('alerts.re_examine')}
        </button>
        <button className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-error)' }}>
          {t('alerts.mark_disposed')}
        </button>
      </div>

      <span className="material-symbols-outlined" style={{ color: 'var(--color-outline)', fontSize: '18px' }}>
        chevron_right
      </span>
    </div>
  );
}
