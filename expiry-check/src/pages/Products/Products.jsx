import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/ui/PageHeader';
import RiskBadge from '../../components/ui/RiskBadge';
import ProgressBar from '../../components/ui/ProgressBar';
import { TableSkeleton } from '../../components/ui/ProductsLoadingSkeleton';
import { getProducts, searchProducts, getRiskLevel, getRiskBarColor, getRemainingColor } from '../../services/productsApi';

const PAGE_LIMIT = 20;

export default function Products() {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const [products,   setProducts]   = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(0);          // 0-indexed
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState('');
  const [riskFilter, setRisk]       = useState('');
  const [searchTimer, setTimer]     = useState(null);

  /* ── Fetch ────────────────────────────────────────────────── */
  const fetchProducts = useCallback(async (query, pageIndex) => {
    setLoading(true);
    setError(null);
    try {
      const skip = pageIndex * PAGE_LIMIT;
      const data = query.trim()
        ? await searchProducts(query, PAGE_LIMIT, skip)
        : await getProducts(PAGE_LIMIT, skip);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  /* initial load */
  useEffect(() => { fetchProducts('', 0); }, [fetchProducts]);

  /* debounced search */
  function handleSearch(val) {
    setSearch(val);
    setPage(0);
    clearTimeout(searchTimer);
    setTimer(setTimeout(() => fetchProducts(val, 0), 400));
  }

  function handlePage(newPage) {
    setPage(newPage);
    fetchProducts(search, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Client-side risk filter (applied after fetch) ─────── */
  const filtered = riskFilter
    ? products.filter((p) => getRiskLevel(p.stock) === riskFilter)
    : products;

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  const COL_HEADERS = [
    t('products.col_name'), t('products.col_sku'), t('products.col_stock'),
    t('products.col_expiry'), t('products.col_remaining'), t('products.col_velocity'),
    t('products.col_risk'), '',
  ];

  const SUMMARY = [
    { icon: 'warning',    iconColor: 'var(--color-error)',     label: t('products.stock_out'),     value: products.filter(p => p.stock <= 10).length + ' items', noteColor: 'var(--color-error)',     note: t('products.since_yest') },
    { icon: 'schedule',   iconColor: 'var(--color-secondary)', label: t('products.near_expiry'),   value: products.filter(p => p.stock <= 30).length + ' items', noteColor: 'var(--color-secondary)', note: t('products.no_change')   },
    { icon: 'fact_check', iconColor: 'var(--color-primary)',   label: t('products.waste_reduced'), value: '$14.2k',                                               noteColor: 'var(--color-primary)',   note: t('products.this_month')  },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={t('products.title')}
        subtitle={loading ? t('common.loading') : t('products.subtitle').replace('1,248', total.toLocaleString())}
      >
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
          style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>file_download</span>
          {t('common.export')}
        </button>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all active:scale-[0.98]"
          style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          {t('products.add_product')}
        </button>
      </PageHeader>

      {/* ── Filters ───────────────────────────────────────────── */}
      <div
        className="p-4 rounded-xl mb-6 flex flex-wrap items-center gap-4"
        style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)' }}
      >
        <div className="relative flex-1 min-w-[280px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-outline)', fontSize: '18px' }}>search</span>
          {loading && search && (
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 animate-spin" style={{ color: 'var(--color-outline)', fontSize: '16px' }}>progress_activity</span>
          )}
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t('products.filter_ph')}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all"
            style={{ background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)', color: 'var(--color-text-body)', fontFamily: 'inherit' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,108,73,0.1)'; }}
            onBlur={(e)  => { e.target.style.borderColor = 'var(--color-border-subtle)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold" style={{ color: 'var(--color-outline)' }}>{t('products.risk_level')}</span>
          {['', 'critical', 'high', 'medium', 'low'].map((r) => (
            <button
              key={r}
              onClick={() => setRisk(r)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
              style={{
                border:     riskFilter === r ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                background: riskFilter === r ? 'rgba(0,108,73,0.08)' : 'transparent',
                color:      riskFilter === r ? 'var(--color-primary)' : 'var(--color-text-body)',
              }}
            >
              {r === '' ? t('common.all') : t(`common.${r}`)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Error state ───────────────────────────────────────── */}
      {error && (
        <div
          className="p-5 rounded-xl mb-6 flex items-center gap-4 animate-fade-in"
          style={{ background: 'var(--color-error-container)', border: '1px solid var(--color-error)' }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--color-error)', fontSize: '24px' }}>error</span>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'var(--color-on-error-container)' }}>Failed to load products</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-error-container)', opacity: 0.7 }}>{error}</p>
          </div>
          <button
            onClick={() => fetchProducts(search, page)}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            style={{ background: 'var(--color-error)', color: 'white' }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Table ─────────────────────────────────────────────── */}
      <div
        className="rounded-xl overflow-hidden mb-8"
        style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead style={{ background: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <tr>
                {COL_HEADERS.map((h, i) => (
                  <th key={i} className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--color-outline)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={8} />
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <span className="material-symbols-outlined block mx-auto mb-3" style={{ color: 'var(--color-outline)', fontSize: '40px' }}>inventory_2</span>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-outline)' }}>{t('common.no_data')}</p>
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const risk         = getRiskLevel(p.stock);
                const riskBarColor = getRiskBarColor(risk);
                const remainColor  = getRemainingColor(risk);
                const stockPct     = Math.min(100, Math.round((p.stock / 150) * 100));

                return (
                  <tr
                    key={p.id}
                    className="transition-colors group cursor-pointer animate-fade-in"
                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-surface-muted)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => navigate(`/products/${p.id}`)}
                  >
                    {/* Product name + thumbnail */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex-shrink-0 rounded-lg overflow-hidden"
                          style={{ width: 40, height: 40, border: '1px solid var(--color-border-subtle)' }}
                        >
                          <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div>
                          <p className="text-sm font-bold max-w-[200px] truncate" style={{ color: 'var(--color-on-surface)' }}>{p.title}</p>
                          <p className="text-xs capitalize" style={{ color: 'var(--color-outline)' }}>{p.category}</p>
                        </div>
                      </div>
                    </td>
                    {/* SKU */}
                    <td className="px-6 py-4 text-xs font-mono" style={{ color: 'var(--color-text-body)' }}>{p.sku}</td>
                    {/* Stock */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 w-24">
                        <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-body)' }}>
                          <span>{p.stock}</span>
                          <span style={{ color: remainColor }}>{risk}</span>
                        </div>
                        <ProgressBar value={stockPct} color={riskBarColor} height={5} />
                      </div>
                    </td>
                    {/* Price as expiry placeholder */}
                    <td className="px-6 py-4 text-sm font-bold" style={{ color: 'var(--color-primary)' }}>
                      ${p.price.toFixed(2)}
                    </td>
                    {/* Rating as remaining */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold" style={{ color: remainColor }}>
                        ★ {p.rating.toFixed(1)}
                      </span>
                    </td>
                    {/* Discount as velocity */}
                    <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-body)' }}>
                      -{p.discountPercentage.toFixed(1)}%
                    </td>
                    {/* Risk badge */}
                    <td className="px-6 py-4"><RiskBadge level={risk} /></td>
                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg"
                        style={{ color: 'var(--color-outline)' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────── */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderTop: '1px solid var(--color-border-subtle)' }}>
          <p className="text-sm" style={{ color: 'var(--color-outline)' }}>
            {loading ? t('common.loading') : t('products.showing', {
              from:  page * PAGE_LIMIT + 1,
              to:    Math.min((page + 1) * PAGE_LIMIT, total),
              total: total.toLocaleString(),
            })}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 0}
              onClick={() => handlePage(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: page === 0 ? 'var(--color-outline-variant)' : 'var(--color-text-body)', cursor: page === 0 ? 'not-allowed' : 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_left</span>
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
              return (
                <button
                  key={p}
                  onClick={() => handlePage(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors"
                  style={{
                    background: p === page ? 'var(--color-primary)' : 'transparent',
                    color:      p === page ? 'var(--color-on-primary)' : 'var(--color-outline)',
                  }}
                >
                  {p + 1}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages - 1}
              onClick={() => handlePage(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: page >= totalPages - 1 ? 'var(--color-outline-variant)' : 'var(--color-text-body)', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary bento ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SUMMARY.map((s, i) => (
          <div key={i} className="p-5 rounded-xl flex flex-col justify-between gap-3 animate-fade-in"
            style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}>
            <span className="material-symbols-outlined" style={{ color: s.iconColor, fontSize: '22px' }}>{s.icon}</span>
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--color-outline)' }}>{s.label}</h4>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>{s.value}</p>
            </div>
            <p className="text-xs font-semibold flex items-center gap-1" style={{ color: s.noteColor }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span>
              {s.note}
            </p>
          </div>
        ))}
        <div className="p-5 rounded-xl flex flex-col justify-between gap-3" style={{ background: 'var(--color-primary)', border: '1px solid var(--color-primary)' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary)', fontSize: '22px', fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{t('products.ai_recs')}</h4>
            <p className="text-2xl font-bold text-white">{t('common.active')}</p>
          </div>
          <button className="text-xs font-semibold underline underline-offset-4 text-left" style={{ color: 'rgba(255,255,255,0.8)' }}>
            {t('products.view_suggest')}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
