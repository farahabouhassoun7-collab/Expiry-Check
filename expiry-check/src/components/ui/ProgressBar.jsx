/**
 * ProgressBar — thin horizontal bar used for stock levels, confidence, etc.
 * color: any CSS color string (use design tokens)
 * value: 0–100
 * height: px (default 6)
 */
export default function ProgressBar({ value = 0, color, height = 6, bg }) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{
        height:     height,
        background: bg || 'var(--color-surface-container-highest)',
      }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width:      `${Math.min(100, Math.max(0, value))}%`,
          background: color || 'var(--color-primary)',
        }}
      />
    </div>
  );
}
