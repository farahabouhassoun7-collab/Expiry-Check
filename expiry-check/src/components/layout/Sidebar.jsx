import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const NAV_ITEMS = [
  { icon: 'dashboard',            labelKey: 'nav.dashboard',   to: '/dashboard'   },
  { icon: 'inventory_2',          labelKey: 'nav.products',    to: '/products'    },
  { icon: 'notifications_active', labelKey: 'nav.alerts',      to: '/alerts',     filled: true },
  { icon: 'monitoring',           labelKey: 'nav.analytics',   to: '/analytics'   },
  { icon: 'psychology',           labelKey: 'nav.ai_insights', to: '/ai-insights', filled: true },
];

function NavItem({ icon, labelKey, to, filled }) {
  const { t }     = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
          isActive ? 'ec-nav-active font-bold' : 'hover:bg-[--color-surface-muted]',
        ].join(' ')
      }
      style={({ isActive }) => ({
        background: isActive ? 'var(--color-surface-container)' : undefined,
        color:      isActive ? 'var(--color-primary)'           : 'var(--color-text-body)',
        borderRight: (!isRTL && isActive) ? '2px solid var(--color-primary)' : undefined,
        borderLeft:  (isRTL  && isActive) ? '2px solid var(--color-primary)' : undefined,
      })}
    >
      {({ isActive }) => (
        <>
          <span
            className="material-symbols-outlined"
            style={
              filled && isActive
                ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }
                : undefined
            }
          >
            {icon}
          </span>
          <span className="text-sm font-semibold tracking-wide">{t(labelKey)}</span>
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar() {
  const { t }     = useTranslation();
  const { isRTL } = useLanguage();

  return (
    <aside
      className="ec-sidebar h-screen w-64 fixed top-0 overflow-y-auto flex flex-col py-6 px-4 z-50"
      style={{
        left:        isRTL ? 'auto' : 0,
        right:       isRTL ? 0      : 'auto',
        background:  'var(--color-surface)',
        borderRight: !isRTL ? '1px solid var(--color-border-subtle)' : 'none',
        borderLeft:  isRTL  ? '1px solid var(--color-border-subtle)' : 'none',
      }}
    >
      {/* Brand */}
      <NavLink
        to="/dashboard"
        className="flex items-center gap-3 mb-10 px-2"
        style={{ textDecoration: 'none' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          <span
            className="material-symbols-outlined text-white"
            style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
          >
            inventory_2
          </span>
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight" style={{ color: 'var(--color-on-surface)' }}>
            {t('login.title')}
          </h1>
          <p className="text-[10px] font-medium uppercase tracking-widest opacity-60" style={{ color: 'var(--color-outline)' }}>
            {t('nav.suite')}
          </p>
        </div>
      </NavLink>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.labelKey} {...item} />
        ))}
      </nav>

      {/* Bottom — settings */}
      <div className="mt-auto pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <NavItem icon="settings" labelKey="nav.settings" to="/settings" />
      </div>
    </aside>
  );
}
