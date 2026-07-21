import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

const LANGS = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  if (compact) {
    // Single toggle button
    const next = language === 'en' ? 'ar' : 'en';
    const curr = LANGS.find(l => l.code === language);
    return (
      <button
        onClick={() => setLanguage(next)}
        title={t('lang.label')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
        style={{
          color:  'var(--color-text-body)',
          border: '1px solid var(--color-border-subtle)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <span>{curr?.flag}</span>
        <span>{curr?.code.toUpperCase()}</span>
      </button>
    );
  }

  return (
    <div
      className="flex p-1 rounded-lg gap-0.5"
      style={{ background: 'var(--color-surface-container)' }}
    >
      {LANGS.map((lang) => {
        const active = language === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
            style={{
              background: active ? 'var(--color-background-pure)' : 'transparent',
              color:      active ? 'var(--color-primary)'         : 'var(--color-text-body)',
              boxShadow:  active ? 'var(--shadow-card)'           : 'none',
              fontFamily: 'inherit',
            }}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        );
      })}
    </div>
  );
}
