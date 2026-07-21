export const METRICS = [
  { label: 'Total Products', value: '24,512', trend: '+2.1%',  trendPositive: true  },
  { label: 'Near Expiry',    value: '1,204',  trend: '-4%',    trendPositive: false },
  { label: 'High Risk',      value: '184',    trend: 'Critical', trendPositive: false, danger: true },
  { label: 'Predicted Waste',value: '$4,280', trend: 'Saved 12%', trendPositive: true },
  { label: 'Health Score',   value: '92/100', trend: 'Live',   trendPositive: true, live: true  },
];

export const CRITICAL_BATCHES = [
  { name: 'Organic Whole Milk 1L',    batch: '#LOT-4421-B', remaining: '2 Days',  riskPct: 92, danger: true  },
  { name: 'Artisanal Greek Yogurt',   batch: '#LOT-5928-A', remaining: '5 Days',  riskPct: 75, danger: false },
  { name: 'Free-Range Chicken Breast',batch: '#LOT-3112-D', remaining: '3 Days',  riskPct: 88, danger: true  },
  { name: 'Avocado Hass 4pk',         batch: '#LOT-8821-C', remaining: '8 Days',  riskPct: 40, danger: false },
];

export const AI_PRESCRIPTIONS = [
  {
    section:  'Dairy Section',
    impact:   '$840',
    message:  'Discount Organic Dairy by 25% to clear inventory before Thursday.',
    action:   'Apply Action',
  },
  {
    section:  'Produce',
    impact:   '$1,120',
    message:  'Bundle Avocado Batch #8821 with Salsas for weekend flash sale.',
    action:   'Apply Action',
  },
  {
    section:  'Meat & Poultry',
    impact:   '$450',
    message:  'Reduce Poultry order for Next Monday by 15% based on demand.',
    action:   'Update Orders',
  },
];

export const ACTIVITY_ITEMS = [
  { type: 'danger',  bold: 'Batch Expired:',    text: 'Lot #3391 (Beef Mince) has reached zero shelf life.', time: '2 mins ago'  },
  { type: 'success', bold: 'Check Completed:',  text: 'Morning walk completed by Alex J.',                   time: '45 mins ago' },
  { type: 'info',    bold: 'Auto-Markdown:',    text: '12 items moved to \'Flash Sale\' tier.',               time: '1 hour ago'  },
  { type: 'warning', bold: 'Sensor Offline:',   text: 'Freezer 04 temperature sensor not responding.',       time: '3 hours ago' },
];
