import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ProgressBar from '../../components/ui/ProgressBar';
import ThemeToggle from '../../components/ui/ThemeToggle';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';

const TEAM = [
  { initials: 'JD', name: 'James Durnham', roleKey: 'Store Manager',  badge: 'Admin',  badgeBg: 'rgba(0,108,73,0.08)',           badgeColor: 'var(--color-primary)'   },
  { initials: 'SP', name: 'Sarah Porter',  roleKey: 'Inventory Lead', badge: 'Editor', badgeBg: 'var(--color-surface-container)', badgeColor: 'var(--color-text-body)' },
  { initials: 'MK', name: 'Mike Kovak',    roleKey: 'Staff',          badge: 'Viewer', badgeBg: 'var(--color-surface-container)', badgeColor: 'var(--color-text-body)' },
];

const INTEGRATIONS = [
  { name: 'Square POS', connected: true,  bg: '#000000',                             textColor: 'white'                },
  { name: 'Clover',     connected: true,  bg: '#2CB34A',                             textColor: 'white'                },
  { name: 'Lightspeed', connected: false, bg: 'var(--color-surface-container-high)', textColor: 'var(--color-outline)' },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-colors"
      style={{ background: checked ? 'var(--color-primary)' : 'var(--color-outline-variant)' }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
        style={{ transform: checked ? 'translateX(1.25rem)' : 'translateX(0.125rem)' }}
      />
    </button>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`p-6 rounded-xl transition-all duration-300 ${className}`}
      style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,108,73,0.2)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,108,73,0.05)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border-subtle)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}
    >
      {children}
    </div>
  );
}

/* ─── Tab content components ────────────────────────────────── */

function TabProfile({ t }) {
  return (
    <Card>
      <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-text-heading)' }}>{t('settings.tab_profile')}</h3>
      <div className="space-y-5">
        {[
          { label: t('common.name'),   placeholder: 'Green Basket Store',     icon: 'storefront' },
          { label: 'Email',            placeholder: 'store@greenbasket.com',   icon: 'mail'       },
          { label: t('settings.sys_version'), placeholder: 'v4.12.0-beta',    icon: 'tag'        },
        ].map((f) => (
          <div key={f.label}>
            <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-body)' }}>{f.label}</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-outline)', fontSize: '16px' }}>{f.icon}</span>
              <input
                type="text"
                defaultValue={f.placeholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
                style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)', fontFamily: 'inherit' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,108,73,0.1)'; }}
                onBlur={(e)  => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
          </div>
        ))}
        <div className="pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: 'var(--color-text-body)' }}>{t('settings.appearance')}</label>
          <div className="flex gap-4 flex-wrap">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </Card>
  );
}

function TabTeam({ t }) {
  return (
    <Card>
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('settings.staff_title')}</h3>
        <button className="flex items-center gap-1 text-sm font-bold hover:underline" style={{ color: 'var(--color-primary)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>person_add</span>
          {t('settings.add_member')}
        </button>
      </div>
      <div className="space-y-3">
        {TEAM.map((m) => (
          <div
            key={m.name}
            className="flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: 'var(--color-secondary-container)' }}>
                {m.initials}
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>{m.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-outline)' }}>{m.roleKey}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider" style={{ background: m.badgeBg, color: m.badgeColor }}>
                {m.badge}
              </span>
              <span className="material-symbols-outlined cursor-pointer" style={{ color: 'var(--color-outline)', fontSize: '18px' }}>more_vert</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TabNotifications({ t }) {
  const [notifs, setNotifs] = useState({
    critical: true, high: true, upcoming: false,
    email: true, sms: false, push: true,
  });
  const toggle = (key) => setNotifs((p) => ({ ...p, [key]: !p[key] }));

  const ROWS = [
    { key: 'critical', icon: 'priority_high', label: t('alerts.stat_critical'), desc: 'Immediate alerts for products expiring within 3 days' },
    { key: 'high',     icon: 'warning',       label: t('alerts.stat_high'),     desc: 'Alerts for products expiring within 2 weeks'          },
    { key: 'upcoming', icon: 'update',        label: t('alerts.stat_upcoming'), desc: 'Weekly digest for products expiring within 30 days'   },
  ];
  const CHANNELS = [
    { key: 'email', icon: 'mail',           label: 'Email Notifications' },
    { key: 'sms',   icon: 'sms',            label: 'SMS Alerts'          },
    { key: 'push',  icon: 'notifications',  label: 'Push Notifications'  },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-text-heading)' }}>Alert Types</h3>
        <div className="space-y-4">
          {ROWS.map((row) => (
            <div key={row.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: 'var(--color-outline)', fontSize: '20px' }}>{row.icon}</span>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>{row.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{row.desc}</p>
                </div>
              </div>
              <Toggle checked={notifs[row.key]} onChange={() => toggle(row.key)} />
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-text-heading)' }}>Notification Channels</h3>
        <div className="space-y-4">
          {CHANNELS.map((ch) => (
            <div key={ch.key} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>{ch.icon}</span>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>{ch.label}</p>
              </div>
              <Toggle checked={notifs[ch.key]} onChange={() => toggle(ch.key)} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TabAI({ t, riskLevel, setRiskLevel, autoDiscount, setAutoDiscount, dynamicPricing, setDynamicPricing }) {
  return (
    <Card>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('settings.decision_title')}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{t('settings.decision_sub')}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(0,108,73,0.08)', color: 'var(--color-primary)' }}>
          {t('settings.active_intel')}
        </span>
      </div>
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-3">
            <label className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>{t('settings.risk_sens')}</label>
            <span className="text-sm font-bold font-mono" style={{ color: 'var(--color-primary)' }}>{riskLevel}%</span>
          </div>
          <input type="range" min={0} max={100} value={riskLevel} onChange={(e) => setRiskLevel(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: 'var(--color-primary)', background: 'var(--color-surface-container)' }} />
          <div className="flex justify-between mt-1.5 text-[11px] font-semibold" style={{ color: 'var(--color-outline)' }}>
            <span>{t('settings.conservative')}</span><span>{t('settings.aggressive')}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: t('settings.auto_discount'), desc: t('settings.auto_disc_desc'), value: autoDiscount,   setter: setAutoDiscount   },
            { label: t('settings.dynamic_api'),   desc: t('settings.dynamic_desc'),   value: dynamicPricing, setter: setDynamicPricing  },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-xl" style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)' }}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>{item.label}</span>
                <Toggle checked={item.value} onChange={item.setter} />
              </div>
              <p className="text-xs" style={{ color: 'var(--color-outline)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <div>
          <label className="block text-sm font-bold mb-3" style={{ color: 'var(--color-text-body)' }}>{t('settings.conf_threshold')}</label>
          <div className="flex items-center gap-4">
            <ProgressBar value={85} color="var(--color-primary)" height={10} />
            <span className="text-sm font-mono font-bold flex-shrink-0" style={{ color: 'var(--color-on-surface)' }}>0.85 σ</span>
          </div>
          <p className="text-xs italic mt-2" style={{ color: 'var(--color-outline)' }}>{t('settings.conf_note')}</p>
        </div>
      </div>
    </Card>
  );
}

function TabIntegrations({ t }) {
  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-text-heading)' }}>{t('settings.connected_sys')}</h3>
        <div className="space-y-4">
          {INTEGRATIONS.map((integ) => (
            <div key={integ.name} className="flex items-center justify-between p-4 rounded-xl group" style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: integ.bg, color: integ.textColor }}>
                  {integ.name.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>{integ.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: integ.connected ? 'var(--color-primary-container)' : 'var(--color-outline-variant)' }} />
                    <span className="text-xs font-bold" style={{ color: integ.connected ? 'var(--color-primary)' : 'var(--color-outline)' }}>
                      {integ.connected ? t('common.connected') : t('common.disconnected')}
                    </span>
                  </div>
                </div>
              </div>
              {integ.connected
                ? <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-container)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>settings</span> Configure
                  </button>
                : <button className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                    style={{ background: 'var(--color-secondary)', color: 'white' }}>
                    {t('common.link')}
                  </button>
              }
            </div>
          ))}
        </div>
      </Card>
      <Card>
        <h3 className="text-base font-bold mb-2" style={{ color: 'var(--color-text-heading)' }}>Add Integration</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--color-outline)' }}>Connect your POS, ERP, or supply chain system.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Shopify', 'QuickBooks', 'SAP', 'Oracle', 'Toast POS', 'Revel'].map((name) => (
            <button key={name} className="p-3 rounded-xl text-sm font-semibold text-center transition-colors"
              style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)' }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--color-border-subtle)')}>
              + {name}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TabBilling({ t }) {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl relative overflow-hidden" style={{ background: 'var(--color-on-primary-container)' }}>
        <div className="relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(16,185,129,0.2)', color: 'var(--color-primary-fixed-dim)' }}>Current Plan</span>
          <h3 className="text-2xl font-bold text-white mt-3">Pro Plan</h3>
          <p className="text-white/70 text-sm mt-1">$49 / month · Billed annually</p>
          <div className="flex gap-3 mt-5">
            <button className="px-5 py-2 rounded-lg text-sm font-bold transition-all" style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}>
              {t('settings.upgrade')}
            </button>
            <button className="px-5 py-2 rounded-lg text-sm font-bold" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>
              Manage Billing
            </button>
          </div>
        </div>
      </div>
      <Card>
        <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-text-heading)' }}>{t('settings.usage_credits')}</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold" style={{ color: 'var(--color-text-body)' }}>
            <span>API Calls Used</span><span style={{ color: 'var(--color-primary)' }}>1,482 / 2,000</span>
          </div>
          <ProgressBar value={74} color="var(--color-primary)" height={8} />
          <p className="text-xs" style={{ color: 'var(--color-outline)' }}>{t('settings.next_reset')}</p>
        </div>
      </Card>
      <Card>
        <h3 className="text-base font-bold mb-5" style={{ color: 'var(--color-text-heading)' }}>Billing History</h3>
        <div className="space-y-3">
          {[
            { date: 'Jun 1, 2026',  amount: '$49.00', status: 'Paid'    },
            { date: 'May 1, 2026',  amount: '$49.00', status: 'Paid'    },
            { date: 'Apr 1, 2026',  amount: '$49.00', status: 'Paid'    },
          ].map((inv) => (
            <div key={inv.date} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>Pro Plan — {inv.date}</p>
                <p className="text-xs" style={{ color: 'var(--color-outline)' }}>{inv.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,108,73,0.08)', color: 'var(--color-primary)' }}>{inv.status}</span>
                <button className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-secondary)' }}>Download</button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ─── Main Settings page ─────────────────────────────────────── */

export default function Settings() {
  const { t } = useTranslation();

  const TAB_KEYS = [
    'tab_profile', 'tab_team', 'tab_notify', 'tab_ai', 'tab_integrations', 'tab_billing',
  ];

  const [activeTab,      setActiveTab]      = useState('tab_ai');
  const [autoDiscount,   setAutoDiscount]   = useState(true);
  const [dynamicPricing, setDynamicPricing] = useState(false);
  const [riskLevel,      setRiskLevel]      = useState(75);

  /* right sidebar shown for AI + profile tabs */
  const showSidebar = ['tab_ai', 'tab_profile', 'tab_billing'].includes(activeTab);

  function renderContent() {
    switch (activeTab) {
      case 'tab_profile':      return <TabProfile t={t} />;
      case 'tab_team':         return <TabTeam t={t} />;
      case 'tab_notify':       return <TabNotifications t={t} />;
      case 'tab_ai':           return <TabAI t={t} riskLevel={riskLevel} setRiskLevel={setRiskLevel} autoDiscount={autoDiscount} setAutoDiscount={setAutoDiscount} dynamicPricing={dynamicPricing} setDynamicPricing={setDynamicPricing} />;
      case 'tab_integrations': return <TabIntegrations t={t} />;
      case 'tab_billing':      return <TabBilling t={t} />;
      default:                 return null;
    }
  }

  return (
    <DashboardLayout>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')}>
        <button
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all active:scale-[0.98]"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
          {t('common.save')}
        </button>
      </PageHeader>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
        {TAB_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="px-5 py-3.5 text-sm font-bold whitespace-nowrap transition-all border-b-2"
            style={{
              color:       activeTab === key ? 'var(--color-primary)' : 'var(--color-text-body)',
              borderColor: activeTab === key ? 'var(--color-primary)' : 'transparent',
              background:  activeTab === key ? 'rgba(0,108,73,0.04)' : 'transparent',
            }}
          >
            {t(`settings.${key}`)}
          </button>
        ))}
      </div>

      {/* Content grid */}
      <div className={`grid gap-6 ${showSidebar ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
        {/* Main col */}
        <div className={showSidebar ? 'lg:col-span-8 space-y-6' : 'space-y-6'}>
          {renderContent()}
        </div>

        {/* Right sidebar — only for certain tabs */}
        {showSidebar && (
          <div className="lg:col-span-4 space-y-5">
            {/* Connected Systems */}
            <Card>
              <h3 className="text-[11px] font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--color-outline)' }}>
                {t('settings.connected_sys')}
              </h3>
              <div className="space-y-5">
                {INTEGRATIONS.map((integ) => (
                  <div key={integ.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{ background: integ.bg, color: integ.textColor }}>
                        {integ.name.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--color-text-body)' }}>{integ.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: integ.connected ? 'var(--color-primary-container)' : 'var(--color-outline-variant)' }} />
                          <span className="text-xs font-bold" style={{ color: integ.connected ? 'var(--color-primary)' : 'var(--color-outline)' }}>
                            {integ.connected ? t('common.connected') : t('common.disconnected')}
                          </span>
                        </div>
                      </div>
                    </div>
                    {integ.connected
                      ? <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" style={{ color: 'var(--color-outline)', fontSize: '18px' }}>settings</span>
                      : <button className="text-xs font-bold hover:underline" style={{ color: 'var(--color-secondary)' }}>{t('common.link')}</button>
                    }
                  </div>
                ))}
              </div>
            </Card>

            {/* Usage Credits */}
            <div className="p-6 rounded-xl relative overflow-hidden" style={{ background: 'rgba(0,108,73,0.06)', border: '1px solid rgba(0,108,73,0.15)' }}>
              <h3 className="text-xs font-bold mb-1" style={{ color: 'var(--color-primary)' }}>{t('settings.usage_credits')}</h3>
              <p className="text-3xl font-bold mb-1" style={{ color: 'var(--color-on-primary-container)' }}>
                1,482 <span className="text-sm font-normal">/ 2,000</span>
              </p>
              <ProgressBar value={74} color="var(--color-primary-container)" bg="rgba(255,255,255,0.3)" height={6} />
              <p className="text-xs mt-2 mb-4" style={{ color: 'rgba(0,66,43,0.6)' }}>{t('settings.next_reset')}</p>
              <button className="w-full py-2 rounded-lg text-sm font-bold transition-colors"
                style={{ background: 'var(--color-on-primary-container)', color: 'white' }}>
                {t('settings.upgrade')}
              </button>
            </div>

            {/* System Integrity */}
            <div className="p-5 rounded-xl" style={{ background: 'var(--color-background-pure)', border: '1px solid rgba(164,58,58,0.2)', boxShadow: 'var(--shadow-card)' }}>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '20px' }}>error</span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--color-tertiary)' }}>{t('settings.integrity')}</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-body)' }}>{t('settings.integrity_body')}</p>
                  <button className="mt-3 flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-tertiary)' }}>
                    {t('settings.fix_now')}
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between py-6 mt-8 opacity-50" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
        <div className="flex gap-8">
          {[
            { label: t('settings.sys_version'), value: 'v4.12.0-beta' },
            { label: t('settings.last_sync'),   value: 'Today, 09:42 AM' },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-[10px] font-bold uppercase tracking-tight" style={{ color: 'var(--color-outline)' }}>{f.label}</p>
              <p className="text-xs font-mono">{f.value}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          {[t('settings.privacy'), t('settings.docs'), t('settings.support')].map((l) => (
            <a key={l} className="text-xs hover:underline cursor-pointer" style={{ color: 'var(--color-text-body)' }}>{l}</a>
          ))}
        </div>
      </footer>
    </DashboardLayout>
  );
}
