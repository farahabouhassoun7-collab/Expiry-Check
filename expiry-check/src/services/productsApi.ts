/* ─── DummyJSON Products API Service ────────────────────────── */

export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

const BASE_URL = 'https://dummyjson.com';

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function searchProducts(query: string, limit = 20, skip = 0): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
  if (!res.ok) throw new Error(`Failed to search products: ${res.status}`);
  return res.json();
}

export async function getProductById(id: number): Promise<DummyProduct> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  return res.json();
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch(`${BASE_URL}/products/category-list`);
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

/** Derive a risk level from stock quantity */
export function getRiskLevel(stock: number): 'critical' | 'high' | 'medium' | 'low' {
  if (stock <= 10)  return 'critical';
  if (stock <= 30)  return 'high';
  if (stock <= 60)  return 'medium';
  return 'low';
}

/** Stock bar color based on risk */
export function getRiskBarColor(risk: string): string {
  switch (risk) {
    case 'critical': return 'var(--color-accent-danger)';
    case 'high':     return 'var(--color-tertiary-container)';
    case 'medium':   return 'var(--color-secondary-container)';
    default:         return 'var(--color-primary-container)';
  }
}

/** Remaining label color based on risk */
export function getRemainingColor(risk: string): string {
  switch (risk) {
    case 'critical': return 'var(--color-error)';
    case 'high':     return 'var(--color-tertiary)';
    case 'medium':   return 'var(--color-secondary)';
    default:         return 'var(--color-primary)';
  }
}
