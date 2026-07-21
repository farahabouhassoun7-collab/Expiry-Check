import type { Product, ProductsResponse, RiskLevel } from '../types';

const BASE = 'https://dummyjson.com';

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  const res = await fetch(`${BASE}/products?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE}/products/${id}`);
  if (!res.ok) throw new Error(`Product ${id} not found`);
  return res.json();
}

export async function searchProducts(q: string, limit = 20): Promise<ProductsResponse> {
  const res = await fetch(`${BASE}/products/search?q=${encodeURIComponent(q)}&limit=${limit}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE}/products/category-list`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// ── Helpers ──────────────────────────────────────────────────

/** Mock expiry date: products with lower id expire sooner */
export function getMockExpiryDays(productId: number): number {
  const patterns = [3, 7, 14, 30, 60, 90, 180, 365];
  return patterns[productId % patterns.length];
}

export function getRiskLevel(daysRemaining: number): RiskLevel {
  if (daysRemaining <= 3)  return 'critical';
  if (daysRemaining <= 14) return 'high';
  if (daysRemaining <= 30) return 'medium';
  return 'low';
}

export function getRiskFromStock(stock: number): RiskLevel {
  if (stock <= 10)  return 'critical';
  if (stock <= 30)  return 'high';
  if (stock <= 60)  return 'medium';
  return 'low';
}

export function formatExpiryDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
