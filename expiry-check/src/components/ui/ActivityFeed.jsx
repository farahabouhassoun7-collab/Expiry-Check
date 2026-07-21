import { useTranslation } from 'react-i18next';

const TYPE_STYLE = {
  danger:  { bg: 'rgba(186,26,26,0.08)',  icon: 'priority_high', color: 'var(--color-accent-danger)' },
  success: { bg: 'rgba(0,88,190,0.08)',   icon: 'verified',      color: 'var(--color-secondary)'     },
  info:    { bg: 'rgba(0,108,73,0.08)',   icon: 'trending_up',   color: 'var(--color-primary)'        },
  warning: { bg: 'rgba(186,26,26,0.08)',  icon: 'sensors_off',   color: 'var(--color-accent-danger)'  },
};

function ActivityItem({ type = 'info', bold, text, time }) {
  const s = TYPE_STYLE[type] ?? TYPE_STYLE.info;
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
        <span className="material-symbols-outlined" style={{ color: s.color, fontSize: '16px' }}>{s.icon}</span>
      </div>
      <div>
        <p className="text-sm" style={{ color: 'var(--color-text-heading)' }}>
          <span className="font-bold">{bold}</span> {text}
        </p>
        <span className="text-xs" style={{ color: 'var(--color-outline)' }}>{time}</span>
      </div>
    </div>
  );
}

export default function ActivityFeed({ items = [] }) {
  const { t } = useTranslation();

  return (
    <div
      className="rounded-xl flex flex-col overflow-hidden"
      style={{
        background: 'var(--color-background-pure)',
        border:     '1px solid var(--color-border-subtle)',
        boxShadow:  'var(--shadow-card)',
        height:     400,
      }}
    >
      <div
        className="px-6 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
      >
        <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-text-heading)' }}>
          {t('activity.recent')}
        </h3>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold uppercase"
          style={{ background: 'var(--color-surface-muted)', color: 'var(--color-outline)' }}
        >
          {t('common.live')}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>
        {items.map((item, i) => <ActivityItem key={i} {...item} />)}
      </div>

      <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <button
          className="w-full py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: 'var(--color-surface-muted)', color: 'var(--color-text-body)' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-container)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
        >
          {t('activity.clear_all')}
        </button>
      </div>
    </div>
  );
}
