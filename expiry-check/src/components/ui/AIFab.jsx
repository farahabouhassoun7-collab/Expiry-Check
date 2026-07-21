import { useTranslation } from 'react-i18next';

export default function AIFab() {
  const { t } = useTranslation();

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group active:scale-95"
        style={{
          background: 'var(--color-primary)',
          color: 'var(--color-on-primary)',
          boxShadow: '0 8px 32px rgba(0,108,73,0.35)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        <span
          className="material-symbols-outlined transition-transform duration-300 group-hover:rotate-12"
          style={{ fontSize: '26px', fontVariationSettings: "'FILL' 1" }}
        >
          auto_awesome
        </span>

        {/* Tooltip */}
        <div
          className="absolute right-16 px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none
                     opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-200"
          style={{
            background: 'var(--color-inverse-surface)',
            color: 'var(--color-inverse-on-surface)',
          }}
        >
          {t('common.view_all')}
        </div>
      </button>
    </div>
  );
}
