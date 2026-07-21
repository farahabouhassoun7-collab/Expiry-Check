import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function ActionDropdown() {
  const { t }     = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const ACTIONS = [
    { icon: 'sell',                   label: t('alerts.action_discount'),  danger: false },
    { icon: 'shopping_cart_checkout', label: t('alerts.action_clearance'), danger: false },
    { icon: 'delete_forever',         label: t('alerts.action_dispose'),   danger: true  },
    null,
    { icon: 'visibility_off',         label: t('alerts.action_ignore'),    danger: false, muted: true },
  ];

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
        style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        {t('alerts.take_action')}
        <span
          className="material-symbols-outlined transition-transform duration-200"
          style={{ fontSize: '18px', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+8px)] w-52 rounded-xl p-2 z-50 animate-slide-down"
          style={{
            right:      'auto',
            left:       0,
            background: 'var(--color-background-pure)',
            border:     '1px solid var(--color-border-subtle)',
            boxShadow:  'var(--shadow-modal)',
          }}
        >
          {ACTIONS.map((action, i) =>
            action === null ? (
              <div key={`divider-${i}`} className="my-1 h-px" style={{ background: 'var(--color-border-subtle)' }} />
            ) : (
              <button
                key={action.label}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color:   action.danger ? 'var(--color-error)' : 'var(--color-text-body)',
                  opacity: action.muted ? 0.55 : 1,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                onClick={() => setOpen(false)}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{action.icon}</span>
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
