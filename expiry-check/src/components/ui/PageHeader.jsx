/**
 * PageHeader — consistent page title + subtitle + optional actions slot
 * Used on every dashboard page.
 */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h2
          className="text-3xl font-bold tracking-tight leading-tight"
          style={{ color: 'var(--color-text-heading)' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-body)', opacity: 0.7 }}>
            {subtitle}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 flex-shrink-0">{children}</div>
      )}
    </div>
  );
}
