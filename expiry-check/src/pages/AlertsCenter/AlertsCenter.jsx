import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/ui/StatCard';
import AlertCard from '../../components/ui/AlertCard';
import AlertRow from '../../components/ui/AlertRow';
import AIFab from '../../components/ui/AIFab';
import { TODAY_ALERTS, YESTERDAY_ALERTS, EARLIER_ALERTS } from './data';

function SectionHeader({ title, date, muted }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <h3
        className="text-base font-semibold whitespace-nowrap"
        style={{ color: 'var(--color-text-heading)', opacity: muted ? 0.65 : 1 }}
      >
        {title}
      </h3>
      <div className="h-px flex-1" style={{ background: 'var(--color-border-subtle)' }} />
      {date && (
        <span className="text-xs font-semibold whitespace-nowrap" style={{ color: 'var(--color-outline)' }}>
          {date}
        </span>
      )}
    </div>
  );
}

export default function AlertsCenter() {
  const { t }           = useTranslation();
  const [activeTab, setActiveTab] = useState('pending');

  // Stats built from translation keys — no hardcoded labels
  const STATS = [
    { id: 'critical', icon: 'priority_high', iconFilled: true,  iconBg: 'var(--color-error-container)',           iconColor: 'var(--color-error)',                label: t('alerts.stat_critical'), value: 12 },
    { id: 'high',     icon: 'warning',       iconFilled: false, iconBg: 'var(--color-tertiary-container)',         iconColor: 'var(--color-on-tertiary-container)', label: t('alerts.stat_high'),     value: 28 },
    { id: 'upcoming', icon: 'update',        iconFilled: false, iconBg: 'var(--color-surface-container-highest)', iconColor: 'var(--color-secondary)',             label: t('alerts.stat_upcoming'), value: 45 },
    { id: 'resolved', icon: 'check_circle',  iconFilled: false, iconBg: 'rgba(16,185,129,0.12)',                  iconColor: 'var(--color-primary)',               label: t('alerts.stat_resolved'), value: 84 },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight leading-tight" style={{ color: 'var(--color-text-heading)' }}>
            {t('alerts.title')}
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-body)', opacity: 0.7 }}>
            {t('alerts.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tab toggle */}
          <div className="flex p-1 rounded-lg" style={{ background: 'var(--color-surface-container)' }}>
            {['pending', 'resolved'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200"
                style={{
                  background: activeTab === tab ? 'var(--color-background-pure)' : 'transparent',
                  color:      activeTab === tab ? 'var(--color-primary)'          : 'var(--color-text-body)',
                  boxShadow:  activeTab === tab ? 'var(--shadow-card)'            : 'none',
                }}
              >
                {t(`alerts.${tab}`)}
              </button>
            ))}
          </div>

          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
            style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_list</span>
            {t('alerts.filter')}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STATS.map((stat, i) => (
          <div key={stat.id} style={{ animationDelay: `${i * 60}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-10">
        <section>
          <SectionHeader title={t('alerts.today')} date="Oct 24, 2023" />
          <div className="space-y-4">
            {TODAY_ALERTS.map((alert) => <AlertCard key={alert.id} {...alert} />)}
          </div>
        </section>

        <section>
          <SectionHeader title={t('alerts.yesterday')} muted />
          <div className="space-y-4">
            {YESTERDAY_ALERTS.map((alert) => <AlertCard key={alert.id} {...alert} />)}
          </div>
        </section>

        <section>
          <SectionHeader title={t('alerts.earlier')} muted />
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'var(--color-background-pure)',
              border:     '1px solid var(--color-border-subtle)',
              boxShadow:  'var(--shadow-card)',
            }}
          >
            {EARLIER_ALERTS.map((row, i) => (
              <div
                key={row.id}
                style={i < EARLIER_ALERTS.length - 1 ? { borderBottom: '1px solid var(--color-border-subtle)' } : {}}
              >
                <AlertRow {...row} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <AIFab />
    </DashboardLayout>
  );
}
