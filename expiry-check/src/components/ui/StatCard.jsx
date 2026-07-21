/**
 * StatCard — dashboard overview metric card
 * @param {string} icon         - Material Symbol name
 * @param {boolean} iconFilled  - use filled variant
 * @param {string} iconBg       - CSS background for icon container
 * @param {string} iconColor    - CSS color for icon
 * @param {string} label        - uppercase label text
 * @param {string|number} value - headline metric
 */
export default function StatCard({ icon, iconFilled, iconBg, iconColor, label, value }) {
  return (
    <div
      className="flex items-center gap-4 p-6 rounded-xl transition-all duration-200 hover:shadow-md animate-fade-in"
      style={{
        background: 'var(--color-background-pure)',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        <span
          className="material-symbols-outlined"
          style={{
            color: iconColor,
            fontSize: '22px',
            fontVariationSettings: iconFilled
              ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
              : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
          }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p
          className="text-[11px] font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: 'var(--color-outline)' }}
        >
          {label}
        </p>
        <p className="text-2xl font-bold" style={{ color: 'var(--color-text-heading)' }}>
          {value}
        </p>
      </div>
    </div>
  );
}
