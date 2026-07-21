// Static data for the Alerts Center page.
// Products do NOT carry image references — ProductImage resolves
// images automatically by matching the product title against filenames.

export const STATS = [
  {
    id: 'critical',
    icon: 'priority_high',
    iconFilled: true,
    iconBg: 'var(--color-error-container)',
    iconColor: 'var(--color-error)',
    label: 'Critical Risk',
    value: 12,
  },
  {
    id: 'high',
    icon: 'warning',
    iconFilled: false,
    iconBg: 'var(--color-tertiary-container)',
    iconColor: 'var(--color-on-tertiary-container)',
    label: 'High Risk',
    value: 28,
  },
  {
    id: 'upcoming',
    icon: 'update',
    iconFilled: false,
    iconBg: 'var(--color-surface-container-highest)',
    iconColor: 'var(--color-secondary)',
    label: 'Upcoming',
    value: 45,
  },
  {
    id: 'resolved',
    icon: 'check_circle',
    iconFilled: false,
    iconBg: 'rgba(16,185,129,0.12)',
    iconColor: 'var(--color-primary)',
    label: 'Resolved Today',
    value: 84,
  },
];

export const TODAY_ALERTS = [
  {
    id: 'EXP-9042',
    variant: 'critical',
    title: 'Organic Hydration Serum - Batch A1',
    subtitle: 'Expiring in 3 days with 50 units remaining',
  },
  {
    id: 'EXP-8821',
    variant: 'high',
    title: 'Multi-Vitamin Complex (90 ct)',
    subtitle: 'Expiring in 14 days with 120 units remaining',
  },
];

export const YESTERDAY_ALERTS = [
  {
    id: 'EXP-7710',
    variant: 'resolved',
    resolved: true,
    title: 'Artisanal Olive Oil (500ml)',
    subtitle: 'Applied 30% discount - Inventory moving',
  },
];

export const EARLIER_ALERTS = [
  {
    id: 'row-1',
    date: 'Oct 20, 2023',
    title: 'Artisan Olive',
    status: 'Expired (42 units)',
    statusColor: 'var(--color-error)',
    dotColor: 'var(--color-error)',
  },
  {
    id: 'row-2',
    date: 'Oct 18, 2023',
    title: 'Organic Hydro Granola',
    status: 'Low Stock & Near Expiry',
    statusColor: 'var(--color-secondary)',
    dotColor: 'var(--color-secondary)',
  },
];
