import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import ProgressBar from '../../components/ui/ProgressBar';
import ProductImage from '../../components/ui/ProductImage';

const PREDICTED_PRODUCTS = [
  {
    name: 'Organic Greek Yogurt', sku: 'DG-293', icon: 'egg',
    loss: '$842.00', qty: '210 units',
    recommendation: 'Clearance Bundle', recVariant: 'primary',
    confidence: 94,
  },
  {
    name: 'Artisan Sourdough', sku: 'BK-441', icon: 'bakery_dining',
    loss: '$315.50', qty: '45 units',
    recommendation: 'End-of-Day 50%', recVariant: 'secondary',
    confidence: 88,
  },
  {
    name: 'Atlantic Salmon Fillets', sku: 'SF-102', icon: 'set_meal',
    loss: '$1,120.00', qty: '32 units',
    recommendation: 'Immediate Markdown', recVariant: 'tertiary',
    confidence: 97,
  },
];

const REC_VARIANT_STYLE = {
  primary:   { bg: 'rgba(0,108,73,0.08)',   color: 'var(--color-primary)'   },
  secondary: { bg: 'rgba(0,88,190,0.08)',   color: 'var(--color-secondary)' },
  tertiary:  { bg: 'rgba(164,58,58,0.08)',  color: 'var(--color-tertiary)'  },
};

const CAMPAIGNS = [
  {
    tag: 'Weekend Clearance', tagColor: 'var(--color-secondary)',
    title: 'Organic Produce Blitz',
    desc: 'Bundle 5+ items for a 40% discount. High surplus of seasonal greens and berries predicted for Monday.',
  },
  {
    tag: 'Dairy Precision', tagColor: 'var(--color-primary)',
    title: 'Morning Dairy Drive',
    desc: 'BOGO on short-dated Greek Yogurt. Optimal for loyalty program push via mobile app notifications.',
  },
];

export default function AIInsights() {
  const { t } = useTranslation();
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setToastVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <PageHeader title={t('ai_insights.title')} subtitle={t('ai_insights.subtitle')} />

      <div className="space-y-6">
        {/* Hero + KPIs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hero card */}
          <div
            className="lg:col-span-2 rounded-xl p-6 text-white relative overflow-hidden group"
            style={{ background: 'var(--color-on-primary-container)' }}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
              <span className="material-symbols-outlined" style={{ fontSize: '100px' }}>smart_toy</span>
            </div>
            <div className="relative z-10 space-y-4">
              <div
                className="inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold"
                style={{ background: 'rgba(16,185,129,0.2)', borderColor: 'rgba(16,185,129,0.3)', color: 'var(--color-primary-fixed-dim)' }}
              >
                <span className="material-symbols-outlined mr-2" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
                {t('ai_insights.strategy')}
              </div>
              <h2 className="text-xl font-bold max-w-lg">
                {t('ai_insights.hero_title')}
              </h2>
              <p className="text-sm text-white/80 max-w-md">
                {t('ai_insights.hero_body')}
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-95"
                  style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                >
                  {t('ai_insights.apply')}
                </button>
                <button
                  className="px-5 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                >
                  {t('ai_insights.review')}
                </button>
              </div>
            </div>
          </div>

          {/* KPI cluster */}
          <div className="flex flex-col gap-4">
            {/* Total Predicted Loss */}
            <div
              className="p-5 rounded-xl flex-1"
              style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-outline)' }}>{t('ai_insights.predicted_loss')}</p>
                  <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-heading)' }}>$4,280.50</h3>
                </div>
                <div
                  className="p-2 rounded-lg"
                  style={{ background: 'rgba(255,61,87,0.08)' }}
                >
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-accent-danger)', fontSize: '20px' }}>trending_down</span>
                </div>
              </div>
              <ProgressBar
                value={65}
                color="var(--color-accent-danger)"
                height={6}
              />
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-body)' }}>65% {t('ai_insights.loss_pct')}</p>
            </div>

            {/* Sub KPIs */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: t('ai_insights.unsold'), value: '1,248', note: t('ai_insights.items_risk'),    noteColor: 'var(--color-secondary)' },
                { label: t('ai_insights.accuracy'), value: '98.2%', note: t('ai_insights.high_conf'), noteColor: 'var(--color-primary)'   },
              ].map((k) => (
                <div
                  key={k.label}
                  className="p-4 rounded-xl"
                  style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
                >
                  <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-outline)' }}>{k.label}</p>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--color-text-heading)' }}>{k.value}</h4>
                  <p className="text-xs font-semibold mt-1" style={{ color: k.noteColor }}>{k.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Predictions table */}
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
        >
          <div
            className="p-6 flex justify-between items-center"
            style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
          >
            <div>
              <h2 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('ai_insights.predictions')}</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-outline)' }}>{t('ai_insights.pred_subtitle')}</p>
            </div>
            <div className="flex gap-3">
              {[
                { icon: 'filter_alt', labelKey: 'ai_insights.filter' },
                { icon: 'download',   labelKey: 'common.export' },
              ].map((btn) => (
                <button
                  key={btn.icon}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                  style={{ border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{btn.icon}</span>
                  {t(btn.labelKey)}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead style={{ background: 'rgba(248,250,252,0.5)', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <tr>
                  {[t('ai_insights.col_product'), t('ai_insights.col_loss'), t('ai_insights.col_qty'), t('ai_insights.col_rec'), t('ai_insights.col_conf'), ''].map((h) => (
                    <th key={h} className="px-6 py-4 text-xs font-bold" style={{ color: 'var(--color-text-body)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PREDICTED_PRODUCTS.map((p, i) => {
                  const recStyle = REC_VARIANT_STYLE[p.recVariant];
                  return (
                    <tr
                      key={i}
                      className="transition-colors group"
                      style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ProductImage name={p.name} size="sm" noShadow style={{ border: '1px solid var(--color-border-subtle)' }} />
                          <div>
                            <p className="text-sm font-bold" style={{ color: 'var(--color-text-heading)' }}>{p.name}</p>
                            <p className="text-xs opacity-50" style={{ color: 'var(--color-text-body)' }}>SKU: {p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: 'var(--color-accent-danger)' }}>{p.loss}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-body)' }}>{p.qty}</td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold"
                          style={{ background: recStyle.bg, color: recStyle.color }}
                        >
                          {p.recommendation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ProgressBar value={p.confidence} color="var(--color-primary)" height={5} />
                          <span className="text-xs font-semibold w-8" style={{ color: 'var(--color-text-body)' }}>{p.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg border border-transparent hover:border-border-subtle"
                          style={{ color: 'var(--color-outline)' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div
            className="p-4 flex justify-center"
            style={{ background: 'var(--color-surface-muted)', borderTop: '1px solid var(--color-border-subtle)' }}
          >
            <button className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
              {t('ai_insights.view_all')}
            </button>
          </div>
        </div>

        {/* Campaigns */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>campaign</span>
            <h2 className="text-base font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('ai_insights.campaigns')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {CAMPAIGNS.map((c, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: 'var(--color-background-pure)',
                  border:     '1px solid var(--color-border-subtle)',
                  boxShadow:  'var(--shadow-card)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform  = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = 'var(--color-secondary-fixed-dim)';
                  e.currentTarget.style.boxShadow  = 'var(--shadow-card-md)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform  = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
                  e.currentTarget.style.boxShadow  = 'var(--shadow-card)';
                }}
              >
                <div
                  className="h-36 relative overflow-hidden flex items-center justify-center"
                  style={{ background: 'var(--color-surface-container)' }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '64px', color: 'var(--color-border-subtle)', fontVariationSettings: "'FILL' 1" }}
                  >
                    {i === 0 ? 'eco' : 'water_drop'}
                  </span>
                  <div className="absolute top-3 left-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(8px)',
                        color:      c.tagColor,
                        border:     `1px solid ${c.tagColor}30`,
                      }}
                    >
                      {c.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-sm font-bold" style={{ color: 'var(--color-text-heading)' }}>{c.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-body)', opacity: 0.75 }}>{c.desc}</p>
                  <div className="flex justify-end pt-1">
                    <button
                      className="flex items-center gap-1 text-sm font-bold hover:underline"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      {t('ai_insights.launch')}
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_outward</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Custom Campaign CTA */}
            <div
              className="rounded-xl p-6 flex flex-col justify-between relative overflow-hidden"
              style={{ background: 'var(--color-secondary-container)' }}
            >
              <div className="relative z-10">
                <h3 className="text-base font-bold text-white">{t('ai_insights.custom_title')}</h3>
                <p className="text-sm text-white/80 mt-2">
                  {t('ai_insights.custom_body')}
                </p>
              </div>
              <button
                className="relative z-10 w-full mt-5 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all"
                style={{ background: 'white', color: 'var(--color-secondary-container)' }}
              >
                {t('ai_insights.generate')}
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>magic_button</span>
              </button>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full blur-3xl" style={{ background: 'rgba(255,255,255,0.1)' }} />
            </div>
          </div>
        </section>

        {/* Deep Learning Log */}
        <div
          className="flex items-center justify-between p-5 rounded-xl"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-subtle)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(0,108,73,0.08)' }}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>analytics</span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--color-text-heading)' }}>{t('ai_insights.deep_log')}</p>
              <p className="text-xs" style={{ color: 'var(--color-outline)' }}>{t('ai_insights.last_updated')}</p>
            </div>
          </div>
          <button
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--color-background-pure)')}
          >
            {t('ai_insights.methodology')}
          </button>
        </div>
      </div>

      {/* AI Toast notification */}
      <div
        className="fixed bottom-8 right-8 z-50 transition-all duration-500"
        style={{
          transform: toastVisible ? 'translateY(0)' : 'translateY(80px)',
          opacity:   toastVisible ? 1 : 0,
          pointerEvents: toastVisible ? 'auto' : 'none',
        }}
      >
        <div
          className="p-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm"
          style={{
            background: 'var(--color-on-surface)',
            border:     '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div className="p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.2)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-fixed-dim)', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">{t('ai_insights.new_insight')}</p>
            <p className="text-xs text-white/70">{t('ai_insights.toast_body')}</p>
          </div>
          <button onClick={() => setToastVisible(false)} className="text-white/40 hover:text-white">
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
