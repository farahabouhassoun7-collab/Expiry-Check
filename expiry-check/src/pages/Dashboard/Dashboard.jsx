import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ProgressBar from '../../components/ui/ProgressBar';
import MiniChart from '../../components/ui/MiniChart';
import ActivityFeed from '../../components/ui/ActivityFeed';
import ProductImage from '../../components/ui/ProductImage';
import { CRITICAL_BATCHES, AI_PRESCRIPTIONS } from './data';

function MetricCard({ label, value, trend, trendPositive, danger, live }) {
  return (
    <div
      className="p-5 rounded-xl flex flex-col gap-2 animate-fade-in"
      style={{
        background: 'var(--color-background-pure)',
        border:     '1px solid var(--color-border-subtle)',
        boxShadow:  'var(--shadow-card)',
      }}
    >
      <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-outline)', opacity: 0.7 }}>
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold" style={{ color: danger ? 'var(--color-accent-danger)' : 'var(--color-text-heading)' }}>
          {value}
        </span>
        <span
          className="text-xs font-semibold flex items-center gap-1"
          style={{ color: trendPositive ? 'var(--color-primary-container)' : danger ? 'var(--color-accent-danger)' : 'var(--color-tertiary)' }}
        >
          {live && <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: 'var(--color-primary)' }} />}
          {trend}
        </span>
      </div>
    </div>
  );
}

function AIPrescriptionCard({ section, impact, message, action }) {
  return (
    <div
      className="p-4 rounded-lg border cursor-pointer transition-all"
      style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', borderColor: 'rgba(255,255,255,0.10)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-[11px] font-bold uppercase opacity-60">{section}</span>
        <span className="font-bold text-xs" style={{ color: 'var(--color-primary-fixed-dim)' }}>{impact}</span>
      </div>
      <p className="text-sm font-medium mb-3 opacity-90">{message}</p>
      <button
        className="w-full py-2 rounded-md text-xs font-bold transition-transform active:scale-95"
        style={{ background: 'var(--color-primary-fixed-dim)', color: 'var(--color-on-primary-fixed)' }}
      >
        {action}
      </button>
    </div>
  );
}

export default function Dashboard() {
  const navigate  = useNavigate();
  const { t }     = useTranslation();

  const METRICS = [
    { label: t('dashboard.metric_total'),  value: '24,512', trend: '+2.1%',               trendPositive: true  },
    { label: t('dashboard.metric_expiry'), value: '1,204',  trend: '-4%',                 trendPositive: false },
    { label: t('dashboard.metric_risk'),   value: '184',    trend: t('dashboard.metric_critical'), trendPositive: false, danger: true },
    { label: t('dashboard.metric_waste'),  value: '$4,280', trend: t('dashboard.metric_saved'),    trendPositive: true  },
    { label: t('dashboard.metric_health'), value: '92/100', trend: t('common.live'),       trendPositive: true, live: true },
  ];

  const ACTIVITY_ITEMS = [
    { type: 'danger',  bold: t('activity.batch_expired'),  text: t('activity.batch_exp_body'),  time: '2 mins ago'  },
    { type: 'success', bold: t('activity.check_done'),     text: t('activity.check_body'),      time: '45 mins ago' },
    { type: 'info',    bold: t('activity.auto_markdown'),  text: t('activity.markdown_body'),   time: '1 hour ago'  },
    { type: 'warning', bold: t('activity.sensor_off'),     text: t('activity.sensor_body'),     time: '3 hours ago' },
  ];

  const TABLE_HEADERS = [
    t('dashboard.col_product'),
    t('dashboard.col_batch'),
    t('dashboard.col_remaining'),
    t('dashboard.col_risk'),
    '',
  ];

  return (
    <DashboardLayout>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')}>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>calendar_today</span>
          {t('dashboard.last_30_days')}
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-[0.98]"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
          {t('dashboard.export_report')}
        </button>
      </PageHeader>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {METRICS.map((m, i) => <MetricCard key={i} {...m} />)}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Expiry Risk Timeline */}
          <div
            className="rounded-xl p-6"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>
                  {t('dashboard.expiry_timeline')}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>
                  {t('dashboard.expiry_subtitle')}
                </p>
              </div>
              <div className="flex gap-2">
                {[
                  { label: t('dashboard.normal'),          color: 'var(--color-primary)',       bg: 'rgba(0,108,73,0.08)'  },
                  { label: t('dashboard.spike_predicted'), color: 'var(--color-accent-danger)', bg: 'rgba(255,61,87,0.08)' },
                ].map((leg) => (
                  <span
                    key={leg.label}
                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold"
                    style={{ background: leg.bg, color: leg.color }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: leg.color }} />
                    {leg.label}
                  </span>
                ))}
              </div>
            </div>
            <MiniChart
              points="M0,200 Q150,180 250,210 T500,100 T750,150 T1000,80"
              fillId="dashFill"
              height={130}
              dotPoints={[[250, 210], [500, 100], [750, 150]]}
              labels={['Day 1', 'Day 7', 'Day 14', 'Day 21', 'Day 30']}
            />
          </div>

          {/* Critical Batches table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
          >
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
            >
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>
                {t('dashboard.critical_batches')}
              </h3>
              <button
                className="text-sm font-semibold hover:underline"
                style={{ color: 'var(--color-secondary)' }}
                onClick={() => navigate('/products')}
              >
                {t('dashboard.view_all_inventory')}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead style={{ background: 'var(--color-surface-muted)' }}>
                  <tr>
                    {TABLE_HEADERS.map((h, i) => (
                      <th key={i} className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
                  {CRITICAL_BATCHES.map((row, i) => (
                    <tr
                      key={i}
                      className="transition-colors group"
                      style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage name={row.name} size="xs" noShadow noHover />
                          <span className="text-sm font-semibold" style={{ color: 'var(--color-text-heading)' }}>{row.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-mono" style={{ color: 'var(--color-outline)' }}>{row.batch}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="px-2 py-1 rounded text-xs font-bold"
                          style={{
                            background: row.danger ? 'rgba(255,61,87,0.08)' : 'rgba(164,58,58,0.08)',
                            color:      row.danger ? 'var(--color-accent-danger)' : 'var(--color-on-tertiary-container)',
                          }}
                        >
                          {row.remaining}
                        </span>
                      </td>
                      <td className="px-6 py-4 w-36">
                        <ProgressBar value={row.riskPct} color={row.danger ? 'var(--color-accent-danger)' : 'var(--color-tertiary-container)'} height={6} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--color-outline)' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-6">
          {/* AI Prescriptions */}
          <div className="rounded-xl p-6 relative overflow-hidden text-white" style={{ background: 'var(--color-on-primary-container)' }}>
            <div className="absolute top-0 right-0 opacity-10 -translate-y-1/4 translate-x-1/4 pointer-events-none">
              <span className="material-symbols-outlined" style={{ fontSize: '160px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-fixed-dim)', fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>psychology</span>
                <h3 className="text-base font-bold">{t('dashboard.ai_prescriptions')}</h3>
              </div>
              <div className="space-y-4">
                {AI_PRESCRIPTIONS.map((p, i) => <AIPrescriptionCard key={i} {...p} />)}
              </div>
            </div>
          </div>
          <ActivityFeed items={ACTIVITY_ITEMS} />
        </div>
      </div>

      {/* FAB */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group active:scale-95"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)', boxShadow: '0 8px 32px rgba(0,108,73,0.35)' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <span className="material-symbols-outlined transition-transform group-hover:rotate-90" style={{ fontSize: '26px' }}>add</span>
          <span
            className="absolute right-16 px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'var(--color-inverse-surface)', color: 'var(--color-inverse-on-surface)' }}
          >
            {t('dashboard.add_batch')}
          </span>
        </button>
      </div>
    </DashboardLayout>
  );
}
