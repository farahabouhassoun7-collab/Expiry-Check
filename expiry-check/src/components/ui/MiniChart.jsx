/**
 * MiniChart — lightweight SVG line chart used in dashboard and product details.
 * Pure SVG, no dependencies.
 */
export default function MiniChart({
  points = 'M0,200 Q150,180 250,210 T500,100 T750,150 T1000,80',
  fillId = 'chartFill',
  strokeColor = 'var(--color-primary)',
  fillColor = 'var(--color-primary)',
  height = 120,
  labels = [],
  dotPoints = [],
}) {
  return (
    <div
      className="relative w-full rounded-lg overflow-hidden"
      style={{ height, background: 'var(--color-surface-muted)', border: '1px solid var(--color-border-subtle)' }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox={`0 0 1000 ${height * 2}`}
      >
        <defs>
          <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fillColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={fillColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Fill area */}
        <path
          d={`${points} L1000,${height * 2} L0,${height * 2} Z`}
          fill={`url(#${fillId})`}
        />
        {/* Line */}
        <path
          d={points}
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Data points */}
        {dotPoints.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="5" fill={strokeColor} />
        ))}
      </svg>

      {/* X-axis labels */}
      {labels.length > 0 && (
        <div
          className="absolute bottom-2 left-0 right-0 px-4 flex justify-between"
          style={{ fontSize: '10px', color: 'var(--color-outline)', fontWeight: 600 }}
        >
          {labels.map((l, i) => <span key={i}>{l}</span>)}
        </div>
      )}
    </div>
  );
}
