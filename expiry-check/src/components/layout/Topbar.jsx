import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import ThemeToggle from '../ui/ThemeToggle';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Topbar() {
  const { t }     = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <header
      className="ec-topbar fixed top-0 h-16 z-40 flex items-center"
      style={{
        left:         isRTL ? 0       : '16rem',
        right:        isRTL ? '16rem' : 0,
        background:   'var(--color-background-pure)',
        borderBottom: '1px solid var(--color-border-subtle)',
      }}
    >
      <div className="flex justify-between items-center w-full px-8">
        {/* Search */}
        <div className="relative flex-1 max-w-xl group">
          <span
            className="material-symbols-outlined absolute top-1/2 -translate-y-1/2 transition-colors"
            style={{
              color:    'var(--color-outline)',
              fontSize: '18px',
              left:     isRTL ? 'auto' : '0.75rem',
              right:    isRTL ? '0.75rem' : 'auto',
            }}
          >
            search
          </span>
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              paddingLeft:  isRTL ? '1rem'    : '2.5rem',
              paddingRight: isRTL ? '2.5rem'  : '1rem',
              background:   'var(--color-surface-muted)',
              border:       '1px solid var(--color-border-subtle)',
              color:        'var(--color-text-body)',
              fontFamily:   'inherit',
              direction:    'inherit',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-primary-container)';
              e.currentTarget.style.boxShadow   = '0 0 0 3px rgba(16,185,129,0.15)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
              e.currentTarget.style.boxShadow   = 'none';
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ms-6">
          {/* Theme toggle (compact cycling button) */}
          <ThemeToggle compact />

          {/* Language switcher (compact flag button) */}
          <LanguageSwitcher compact />

          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-body)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>notifications</span>
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: 'var(--color-error)' }}
            />
          </button>

          {/* AI */}
          <button
            className="p-2 rounded-lg transition-colors"
            style={{ color: 'var(--color-text-body)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>auto_awesome</span>
          </button>

          {/* Divider */}
          <div className="w-px h-8 mx-1" style={{ background: 'var(--color-border-subtle)' }} />

          {/* User */}
          <button
            className="flex items-center gap-2 px-2 py-1 rounded-full border border-transparent transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.background   = 'var(--color-surface-muted)';
              e.currentTarget.style.borderColor  = 'var(--color-border-subtle)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background   = 'transparent';
              e.currentTarget.style.borderColor  = 'transparent';
            }}
          >
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-body)' }}>
              Alex Rivera
            </span>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--color-primary)' }}
            >
              AR
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
