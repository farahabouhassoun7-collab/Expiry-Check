/** Skeleton shimmer row for the products table */
function SkeletonRow() {
  return (
    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
      {[160, 80, 100, 90, 80, 70, 70, 30].map((w, i) => (
        <td key={i} className="px-6 py-4">
          <div
            className="rounded"
            style={{
              width:          w,
              height:         14,
              background:     'linear-gradient(90deg, var(--color-surface-container) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container) 75%)',
              backgroundSize: '200% 100%',
              animation:      'skeleton-shimmer 1.4s ease infinite',
            }}
          />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 8 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div
      className="rounded-xl overflow-hidden animate-fade-in"
      style={{ background: 'var(--color-background-pure)', border: '1px solid var(--color-border-subtle)', boxShadow: 'var(--shadow-card)' }}
    >
      <div
        style={{
          height:         160,
          background:     'linear-gradient(90deg, var(--color-surface-container) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container) 75%)',
          backgroundSize: '200% 100%',
          animation:      'skeleton-shimmer 1.4s ease infinite',
        }}
      />
      <div className="p-4 space-y-3">
        {[40, 120, 80].map((w, i) => (
          <div key={i} className="rounded"
            style={{
              width: w, height: 12,
              background:     'linear-gradient(90deg, var(--color-surface-container) 25%, var(--color-surface-container-low) 50%, var(--color-surface-container) 75%)',
              backgroundSize: '200% 100%',
              animation:      'skeleton-shimmer 1.4s ease infinite',
            }}
          />
        ))}
      </div>
    </div>
  );
}
