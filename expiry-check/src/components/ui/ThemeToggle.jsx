import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const OPTIONS = [
  { value: 'light',  icon: 'light_mode',      labelKey: 'theme.light'  },
  { value: 'dark',   icon: 'dark_mode',        labelKey: 'theme.dark'   },
  { value: 'system', icon: 'computer',         labelKey: 'theme.system' },
];

export default function ThemeToggle({ compact = false }) {
  const { preference, setPreference } = useTheme();
  const { t } = useTranslation();

  if (compact) {
    // Single icon button that cycles through modes
    const current = OPTIONS.find(o => o.value === preference) || OPTIONS[0];
    const next    = OPTIONS[(OPTIONS.indexOf(current) + 1) % OPTIONS.length];
    return (
      <button
        onClick={() => setPreference(next.value)}
        title={t(current.labelKey)}
        className="p-2 rounded-lg transition-colors"
        style={{ color: 'var(--color-text-body)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
          {current.icon}
        </span>
      </button>
    );
  }

  return (
    <div
      className="flex p-1 rounded-lg gap-0.5"
      style={{ background: 'var(--color-surface-container)' }}
    >
      {OPTIONS.map((opt) => {
        const active = preference === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setPreference(opt.value)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
            style={{
              background: active ? 'var(--color-background-pure)' : 'transparent',
              color:      active ? 'var(--color-primary)'         : 'var(--color-text-body)',
              boxShadow:  active ? 'var(--shadow-card)'           : 'none',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              {opt.icon}
            </span>
            {t(opt.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
