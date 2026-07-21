import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ProgressBar from '../../components/ui/ProgressBar';
import MiniChart from '../../components/ui/MiniChart';

function HeatCell({ intensity, danger }) {
  const bg = danger
    ? `rgba(255,61,87,${intensity})`
    : `rgba(0,108,73,${intensity})`;
  return (
    <div
      className="flex-1 rounded-lg transition-transform hover:scale-105 cursor-pointer"
      style={{ background: bg, minHeight: 52 }}
    />
  );
}

export default function Analytics() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();

  const HEATMAP_DAYS   = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const HEATMAP_ROWS   = [
    [0.20, 0.40, 0.10, 0.10, 0.50, 0.10, 0.40],
    [0.40, 0.70, 0.10, 0.90, 0.20, 0.20, 0.50],
    [0.30, 0.20, 0.10, 0.30, 0.10, 0.60, 0.10],
  ];
  const ROW_LABELS = [t('analytics.heatmap_dairy'), t('analytics.heatmap_bakery'), t('analytics.heatmap_produce')];

  return (
    <DashboardLayout>
      <PageHeader title={t('analytics.title')} subtitle={t('analytics.subtitle')}>
        <button
          className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>file_download</span>
          {t('common.export')}
        </button>
        <button
          className="px-4 py-2 rounded-lg text-sm font-bold transition-all active:scale-[0.98]"
          style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
        >
          {t('analytics.view_recs')}
        </button>
      </PageHeader>

      <div className="space-y-6">
        {/* Row 1: Waste Reduction + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Waste Reduction */}
          <div
            className="lg:col-span-2 p-6 rounded-xl flex flex-col"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('analytics.waste_reduction')}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{t('analytics.waste_subtitle')}</p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,108,73,0.08)', color: 'var(--color-primary)' }}
              >
                -24.8%
              </span>
            </div>
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--color-outline)' }}>
                  <span>{t('analytics.pre_ai')}</span><span>$14,200</span>
                </div>
                <ProgressBar value={100} color="rgba(255,61,87,0.4)" height={14} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold" style={{ color: 'var(--color-text-body)' }}>
                  <span>{t('analytics.post_ai')}</span>
                  <span className="font-bold" style={{ color: 'var(--color-primary)' }}>$10,678</span>
                </div>
                <ProgressBar value={75} color="var(--color-primary)" height={14} />
              </div>
            </div>
            <div
              className="mt-6 pt-5 flex justify-around"
              style={{ borderTop: '1px solid var(--color-border-subtle)' }}
            >
              {[
                { label: t('analytics.ai_accuracy'), value: '98.2%', color: 'var(--color-primary)'    },
                { label: t('analytics.savings'),     value: '$3,522', color: 'var(--color-on-surface)' },
                { label: t('analytics.items_saved'), value: '1,402', color: 'var(--color-on-surface)' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-outline)' }}>{s.label}</p>
                  <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div
            className="lg:col-span-3 p-6 rounded-xl"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('analytics.seasonal_risk')}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{t('analytics.risk_subtitle')}</p>
              </div>
              <div className="flex gap-3">
                {[
                  { label: t('analytics.low'),  bg: 'rgba(0,108,73,0.12)' },
                  { label: t('analytics.high'), bg: 'rgba(255,61,87,0.5)' },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1 text-xs font-semibold" style={{ color: 'var(--color-outline)' }}>
                    <span className="w-3 h-3 rounded-sm" style={{ background: l.bg }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {HEATMAP_ROWS.map((row, ri) => (
                <div key={ri} className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold w-12 text-right" style={{ color: 'var(--color-outline)' }}>
                    {ROW_LABELS[ri]}
                  </span>
                  {row.map((val, di) => (
                    <HeatCell key={di} intensity={val} danger={val > 0.4 && ri === 1} />
                  ))}
                </div>
              ))}
              <div className="flex gap-2 ml-14">
                {HEATMAP_DAYS.map((d) => (
                  <div key={d} className="flex-1 text-center text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-outline)' }}>
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Demand Forecast + Velocity Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Demand Forecasting */}
          <div
            className="lg:col-span-2 p-6 rounded-xl"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('analytics.demand')}</h3>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{t('analytics.demand_subtitle')}</p>
              </div>
              <div className="flex items-center gap-4">
                {[
                  { label: t('analytics.predicted'), color: 'var(--color-primary)' },
                  { label: t('analytics.actual'),    color: 'var(--color-secondary)' },
                ].map((l) => (
                  <span key={l.label} className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--color-text-body)' }}>
                    <span className="w-4 h-0.5 rounded-full" style={{ background: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <MiniChart
                points="M0,180 Q100,120 200,150 T400,100 T600,140 T800,80 T1000,110"
                fillId="demandFill"
                height={150}
                labels={['MAY 01', 'MAY 08', 'MAY 15', 'MAY 22', 'MAY 30']}
              />
              <div
                className="absolute top-2 left-1/2 -translate-x-1/2 p-3 rounded-lg shadow-xl pointer-events-none"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  border:     '1px solid var(--color-border-subtle)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-outline)' }}>MAY 14 FORECAST</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] font-bold" style={{ color: 'var(--color-primary)' }}>{t('analytics.predicted')}</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--color-text-heading)' }}>1,240</p>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--color-border-subtle)', paddingLeft: '1rem' }}>
                    <p className="text-[10px] font-bold" style={{ color: 'var(--color-secondary)' }}>{t('analytics.actual')}</p>
                    <p className="text-xl font-bold" style={{ color: 'var(--color-text-heading)' }}>1,180</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Velocity Map */}
          <div
            className="p-6 rounded-xl flex flex-col"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
          >
            <div className="mb-4">
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('analytics.velocity_map')}</h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{t('analytics.velocity_subtitle')}</p>
            </div>
            <div
              className="flex-1 relative rounded-lg p-4 overflow-hidden"
              style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)', minHeight: 180 }}
            >
              {[
                { top: '10%', right: '10%', size: 64, label: 'Fresh Milk', color: 'var(--color-primary)', pulse: true },
                { top: '24%', right: '24%', size: 48, label: 'Eggs',       color: 'var(--color-primary)', pulse: false },
                { top: '45%', left: '45%',  size: 72, label: 'Bakery',     color: 'var(--color-secondary)', pulse: false },
                { bottom: '12%', left: '10%', size: 56, label: 'Canned',   color: 'var(--color-accent-danger)', pulse: false },
              ].map((b, i) => (
                <div
                  key={i}
                  className="absolute rounded-full flex items-center justify-center"
                  style={{
                    width:      b.size,
                    height:     b.size,
                    top:        b.top,
                    bottom:     b.bottom,
                    left:       b.left,
                    right:      b.right,
                    background: `${b.color}18`,
                    border:     `1px solid ${b.color}55`,
                    animation:  b.pulse ? 'float-badge 3s ease-in-out infinite' : 'none',
                  }}
                >
                  <span className="text-[10px] font-bold text-center leading-tight" style={{ color: b.color }}>{b.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: t('analytics.high_velocity'), note: t('analytics.optimized'),       color: 'var(--color-primary)',       bg: 'rgba(0,108,73,0.06)' },
                { label: t('analytics.stagnant'),        note: t('analytics.review'), color: 'var(--color-accent-danger)', bg: 'rgba(255,61,87,0.06)' },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between p-2 rounded"
                  style={{ background: r.bg, borderLeft: `3px solid ${r.color}` }}
                >
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text-body)' }}>{r.label}</span>
                  <span className="text-xs font-bold" style={{ color: r.color }}>{r.note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Optimization Banner */}
        <div
          className="rounded-xl p-6 flex items-center gap-8 relative overflow-hidden"
          style={{ background: 'var(--color-on-surface)' }}
        >
          <div className="absolute top-0 right-0 w-1/4 h-full opacity-10 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100"><circle cx="100" cy="0" fill="white" r="80" /><circle cx="100" cy="0" fill="#006c49" r="60" /></svg>
          </div>
          <div className="flex-1 z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.2)' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-fixed-dim)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              </div>
              <h4 className="text-base font-bold text-white">{t('analytics.ai_banner')}</h4>
            </div>
            <p className="text-sm text-white/80 max-w-2xl mb-5">
              {t('analytics.ai_banner_text')}
            </p>
            <div className="flex gap-3">
              <button
                className="px-5 py-2 rounded-lg text-sm font-bold transition-all active:scale-95"
                style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
              >
                {t('analytics.apply_rec')}
              </button>
              <button
                className="px-5 py-2 rounded-lg text-sm font-bold"
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)' }}
              >
                {t('common.dismiss')}
              </button>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end z-10">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 text-white mb-1">{t('analytics.proj_savings')}</span>
            <p className="text-5xl font-bold" style={{ color: 'var(--color-primary-fixed-dim)' }}>$1,840</p>
            <div
              className="flex items-center gap-2 mt-3 px-4 py-2 rounded-lg"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <span className="w-2 h-2 rounded-full animate-ping" style={{ background: 'var(--color-primary-container)' }} />
              <span className="text-xs text-white/60">{t('analytics.analyzing')}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
