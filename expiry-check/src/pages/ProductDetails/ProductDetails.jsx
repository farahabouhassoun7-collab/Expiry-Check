import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MiniChart from '../../components/ui/MiniChart';
import ProgressBar from '../../components/ui/ProgressBar';
import RiskBadge from '../../components/ui/RiskBadge';
import { getProductById, getRiskLevel, getRemainingColor } from '../../services/productsApi';

const HISTORY = [
  { date: 'Oct 02, 2023 09:14 AM', action: 'Inventory Shipment Received', change: '+48 Units', changeColor: 'var(--color-primary)',       user: 'Warehouse Ops',  status: 'Verified',   statusBg: 'rgba(0,108,73,0.08)',   statusColor: 'var(--color-primary)'   },
  { date: 'Sep 30, 2023 04:30 PM', action: 'AI Price Adjustment',         change: '-$0.50',   changeColor: 'var(--color-secondary)',     user: 'System (Auto)',  status: 'Active',     statusBg: 'rgba(0,88,190,0.08)',   statusColor: 'var(--color-secondary)' },
  { date: 'Sep 28, 2023 11:20 AM', action: 'Damaged Goods Logged',        change: '-2 Units', changeColor: 'var(--color-accent-danger)', user: 'Alex Rivera',    status: 'Logged',     statusBg: 'rgba(186,26,26,0.08)',  statusColor: 'var(--color-error)'     },
  { date: 'Sep 25, 2023 08:00 AM', action: 'Restock Threshold Met',       change: 'N/A',      changeColor: 'var(--color-text-body)',     user: 'System (Auto)',  status: 'Alert Sent', statusBg: 'rgba(108,122,113,0.08)', statusColor: 'var(--color-outline)'  },
];

const BAR_DATA = [40, 55, 45, 70, 85, 60, 50, 40, 90, 65];

function Skeleton({ w = '100%', h = 16 }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background:     'linear-gradient(90deg, var(--color-surface-container) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container) 75%)',
      backgroundSize: '200% 100%',
      animation:      'skeleton-shimmer 1.4s ease infinite',
    }} />
  );
}

export default function ProductDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { t }     = useTranslation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getProductById(Number(id))
      .then(setProduct)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const risk        = product ? getRiskLevel(product.stock) : 'low';
  const remainColor = getRemainingColor(risk);

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 mb-6 text-sm" style={{ color: 'var(--color-outline)' }}>
        <button className="hover:underline font-semibold" onClick={() => navigate('/products')} style={{ color: 'var(--color-outline)' }}>
          {t('product_details.breadcrumb')}
        </button>
        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>chevron_right</span>
        {loading ? <Skeleton w={160} h={14} /> : <span className="font-bold" style={{ color: 'var(--color-on-surface)' }}>{product?.title}</span>}
      </nav>

      {/* Error state */}
      {error && (
        <div className="p-5 rounded-xl mb-6 flex items-center gap-4" style={{ background: 'var(--color-error-container)', border: '1px solid var(--color-error)' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-error)', fontSize: '24px' }}>error</span>
          <p className="text-sm font-bold" style={{ color: 'var(--color-on-error-container)' }}>{error}</p>
          <button onClick={() => navigate('/products')} className="ml-auto px-4 py-2 rounded-lg text-sm font-bold" style={{ background: 'var(--color-error)', color: 'white' }}>
            Back
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Product card */}
        <div className="lg:col-span-2 p-6 rounded-xl flex gap-6"
          style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          {/* Image */}
          {loading ? (
            <Skeleton w={96} h={96} />
          ) : (
            <div className="flex-shrink-0 rounded-xl overflow-hidden" style={{ width: 96, height: 96, border: '1px solid var(--color-border-subtle)' }}>
              <img src={product?.thumbnail} alt={product?.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                {loading ? <Skeleton w={200} h={20} /> : <h2 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{product?.title}</h2>}
                {loading ? <Skeleton w={160} h={12} /> : <p className="text-xs capitalize" style={{ color: 'var(--color-outline)' }}>SKU: {product?.sku} · {product?.category}</p>}
              </div>
              {!loading && <RiskBadge level={risk} />}
            </div>
            <div className="grid grid-cols-3 gap-6 pt-4" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
              {loading ? (
                Array(3).fill(0).map((_, i) => <Skeleton key={i} w={80} h={32} />)
              ) : [
                { label: t('product_details.current_price'), value: `$${product?.price?.toFixed(2)}` },
                { label: t('product_details.in_stock'),      value: `${product?.stock} Units` },
                { label: t('product_details.supplier'),      value: product?.brand || 'N/A' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-outline)' }}>{s.label}</p>
                  <p className="text-xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="p-6 rounded-xl flex flex-col gap-3"
          style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{t('product_details.quick_actions')}</h3>
          {[
            { icon: 'percent',       label: t('product_details.ai_discount'), primary: true  },
            { icon: 'refresh',       label: t('product_details.reorder'),     primary: false },
            { icon: 'delete_sweep',  label: t('product_details.mark_waste'),  danger: true   },
          ].map((a) => (
            <button key={a.label}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all active:scale-[0.98]"
              style={{
                background: a.primary ? 'var(--color-primary)' : 'var(--color-background-pure)',
                color:      a.primary ? 'var(--color-on-primary)' : a.danger ? 'var(--color-accent-danger)' : 'var(--color-text-body)',
                border:     a.primary ? 'none' : '1px solid var(--color-border-subtle)',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{a.icon}</span>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Prediction + Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* AI Prediction dark card */}
        <div className="rounded-xl p-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, var(--color-on-surface), #1e293b)' }}>
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--color-primary)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-fixed-dim)', fontVariationSettings: "'FILL' 1", fontSize: '18px' }}>psychology</span>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-primary-fixed-dim)' }}>{t('product_details.ai_prediction')}</span>
            </div>
            {[
              { label: t('product_details.sell_through'), value: '82%', pct: 82, color: 'var(--color-primary-fixed-dim)'     },
              { label: t('product_details.expiry_risk'),  value: '18%', pct: 18, color: 'var(--color-tertiary-container)'    },
            ].map((r) => (
              <div key={r.label} className="mb-5">
                <div className="flex justify-between items-end mb-1.5">
                  <p className="text-sm opacity-80">{r.label}</p>
                  <p className="text-xl font-bold" style={{ color: r.color }}>{r.value}</p>
                </div>
                <ProgressBar value={r.pct} color={r.color} bg="rgba(255,255,255,0.1)" height={5} />
              </div>
            ))}
            <div className="flex justify-between pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-xs opacity-60">{t('product_details.confidence')}</span>
              <span className="text-xs font-bold" style={{ color: 'var(--color-primary-fixed-dim)' }}>94% {t('product_details.accurate')}</span>
            </div>
          </div>
        </div>

        {/* Description / Recommendation */}
        <div className="lg:col-span-2 rounded-xl p-6 flex items-start gap-4"
          style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', borderLeft: '4px solid var(--color-secondary)', boxShadow: 'var(--shadow-card)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(0,88,190,0.08)' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '22px' }}>lightbulb</span>
          </div>
          <div>
            <h3 className="text-base font-bold mb-2" style={{ color: 'var(--color-on-surface)' }}>{t('product_details.recommendation')}</h3>
            {loading ? <Skeleton w="100%" h={48} /> : (
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-body)' }}>{product?.description}</p>
            )}
            <div className="flex gap-3 mt-5">
              <button className="px-5 py-2 rounded-lg text-sm font-bold transition-all active:scale-95" style={{ background: 'var(--color-secondary)', color: 'white' }}>
                {t('product_details.execute')}
              </button>
              <button className="px-5 py-2 rounded-lg text-sm font-bold transition-colors" style={{ background: 'var(--color-surface-muted)', color: 'var(--color-text-body)' }}>
                {t('common.dismiss')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product images gallery */}
      {!loading && product?.images?.length > 0 && (
        <div className="rounded-xl p-6 mb-6" style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-on-surface)' }}>{t('product_details.sales_trend')}</h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product.images.map((img, i) => (
              <div key={i} className="flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 100, height: 100, border: '1px solid var(--color-border-subtle)' }}>
                <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl p-6" style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface)' }}>{t('product_details.sales_trend')}</h3>
            <div className="flex gap-3">
              {[{ label: t('product_details.revenue'), color: 'var(--color-primary)' }, { label: t('product_details.quantity'), color: 'var(--color-secondary)' }].map((l) => (
                <span key={l.label} className="flex items-center gap-1 text-xs font-semibold" style={{ color: l.color }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />{l.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-40 w-full flex items-end justify-between gap-1 rounded-lg p-3" style={{ background: 'var(--color-surface-muted)' }}>
            {BAR_DATA.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm transition-all duration-700"
                style={{ height: `${h}%`, background: i === 4 || i === 8 ? 'var(--color-primary)' : i === 3 || i === 9 ? 'var(--color-secondary)' : 'var(--color-surface-container)' }} />
            ))}
          </div>
        </div>
        <div className="rounded-xl p-6" style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'var(--color-on-surface)' }}>{t('product_details.stock_movement')}</h3>
          <div className="relative">
            <MiniChart points="M 0 120 Q 50 100 100 80 T 200 40 T 300 100 T 400 30" fillId="stockFill" height={130} dotPoints={[[200, 40]]} />
            <div className="absolute top-2 right-2 px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg" style={{ background: 'var(--color-on-surface)', color: 'white' }}>
              {t('product_details.peak_stock')}: {product ? product.stock + 38 : '--'} units
            </div>
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
        <div className="px-6 py-4 flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
          <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--color-on-surface)' }}>{t('product_details.activity_history')}</h3>
          <button className="text-xs font-semibold hover:underline" style={{ color: 'var(--color-secondary)' }}>{t('product_details.download_csv')}</button>
        </div>
        <table className="w-full text-left">
          <thead style={{ background: 'var(--color-surface-muted)' }}>
            <tr>
              {[t('product_details.col_date'), t('product_details.col_action'), t('product_details.col_change'), t('product_details.col_user'), t('product_details.col_status')].map((h) => (
                <th key={h} className="px-6 py-3 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((row, i) => (
              <tr key={i} className="transition-colors" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-body)' }}>{row.date}</td>
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-body)' }}>{row.action}</td>
                <td className="px-6 py-4 text-sm font-semibold" style={{ color: row.changeColor }}>{row.change}</td>
                <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-body)' }}>{row.user}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: row.statusBg, color: row.statusColor }}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
