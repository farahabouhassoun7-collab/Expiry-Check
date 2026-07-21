import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RiskBadge from './RiskBadge';
import ProgressBar from './ProgressBar';
import { getRiskLevel, getRiskBarColor, getRemainingColor } from '../../services/productsApi';

/**
 * ProductCard — reusable card for a DummyJSON product.
 * Displays thumbnail, title, category, stock, price, and risk level.
 * Navigates to /products/:id on click.
 */
export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { t }    = useTranslation();

  const risk          = getRiskLevel(product.stock);
  const riskBarColor  = getRiskBarColor(risk);
  const remainColor   = getRemainingColor(risk);
  const stockPct      = Math.min(100, Math.round((product.stock / 150) * 100));

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group animate-fade-in"
      style={{
        background: 'var(--color-background-pure)',
        border:     '1px solid var(--color-border-subtle)',
        boxShadow:  'var(--shadow-card)',
      }}
      onClick={() => navigate(`/products/${product.id}`)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform   = 'translateY(-2px)';
        e.currentTarget.style.boxShadow   = 'var(--shadow-card-md)';
        e.currentTarget.style.borderColor = 'rgba(0,108,73,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform   = 'translateY(0)';
        e.currentTarget.style.boxShadow   = 'var(--shadow-card)';
        e.currentTarget.style.borderColor = 'var(--color-border-subtle)';
      }}
    >
      {/* Thumbnail */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 160, background: 'var(--color-surface-container)' }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Risk badge overlay */}
        <div className="absolute top-2 left-2">
          <RiskBadge level={risk} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--color-outline)' }}
        >
          {product.category}
        </p>

        {/* Title */}
        <h3
          className="text-sm font-bold leading-snug line-clamp-2"
          style={{ color: 'var(--color-text-heading)' }}
        >
          {product.title}
        </h3>

        {/* Price + SKU row */}
        <div className="flex items-center justify-between">
          <span className="text-base font-bold" style={{ color: 'var(--color-primary)' }}>
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--color-outline)' }}>
            {product.sku}
          </span>
        </div>

        {/* Stock bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs" style={{ color: 'var(--color-text-body)' }}>
            <span>{t('products.col_stock')}</span>
            <span className="font-bold" style={{ color: remainColor }}>{product.stock} units</span>
          </div>
          <ProgressBar value={stockPct} color={riskBarColor} height={5} />
        </div>
      </div>
    </div>
  );
}
