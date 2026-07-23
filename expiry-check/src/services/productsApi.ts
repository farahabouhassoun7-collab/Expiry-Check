/* ─── Real Backend Products & Categories API Service ────────────────────────── */

import { getToken } from './authService';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: number;
  parentCategoryName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  sku: string;
  barcode?: string;
  title: string;
  description?: string;
  categoryId: number;
  categoryName: string;
  price: number;
  discountPercentage: number;
  costPrice: number;
  rating: number;
  weight: number;
  unit: string;
  brand?: string;
  tags: string[];
  thumbnailUrl?: string;
  images: string[];
  minStockLevel: number;
  reorderLevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Computed / fallback field for UI compatibility
  stock?: number;
  thumbnail?: string;
  category?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const BASE_URL = ((import.meta as any).env?.VITE_API_BASE_URL ?? '').trim();

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/** Get paginated products from ASP.NET Core API */
export async function getProducts(limit = 20, skip = 0, categoryId?: number): Promise<ProductsResponse> {
  const page = Math.floor(skip / limit) + 1;
  let url = `${BASE_URL}/api/products?page=${page}&pageSize=${limit}`;
  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const data: PagedResult<Product> = await res.json();

  const products = (data.items || []).map(p => ({
    ...p,
    category: p.categoryName || 'Uncategorized',
    thumbnail: p.thumbnailUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    stock: p.minStockLevel || 10,
  }));

  return {
    products,
    total: data.totalItems,
    skip,
    limit,
  };
}

/** Search products from ASP.NET Core API */
export async function searchProducts(query: string, limit = 20, skip = 0): Promise<ProductsResponse> {
  const page = Math.floor(skip / limit) + 1;
  const url = `${BASE_URL}/api/products?search=${encodeURIComponent(query)}&page=${page}&pageSize=${limit}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to search products: ${res.status}`);
  const data: PagedResult<Product> = await res.json();

  const products = (data.items || []).map(p => ({
    ...p,
    category: p.categoryName || 'Uncategorized',
    thumbnail: p.thumbnailUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    stock: p.minStockLevel || 10,
  }));

  return {
    products,
    total: data.totalItems,
    skip,
    limit,
  };
}

/** Get single product by ID */
export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch product ${id}: ${res.status}`);
  const p: Product = await res.json();
  return {
    ...p,
    category: p.categoryName || 'Uncategorized',
    thumbnail: p.thumbnailUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    stock: p.minStockLevel || 10,
  };
}

/** Get product by SKU */
export async function getProductBySku(sku: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/sku/${encodeURIComponent(sku)}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Product with SKU ${sku} not found`);
  return res.json();
}

/** Get product by Barcode lookup */
export async function getProductByBarcode(barcode: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/barcode/${encodeURIComponent(barcode)}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Product with barcode ${barcode} not found`);
  return res.json();
}

/** Get category list */
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/api/categories`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
  return res.json();
}

/** Create a new product */
export async function createProduct(productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create product (${res.status})`);
  }
  return res.json();
}

/** Update product */
export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update product (${res.status})`);
  }
  return res.json();
}

/** Delete product */
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to delete product (${res.status})`);
}

/** Derive a risk level from stock quantity */
export function getRiskLevel(stock: number): 'critical' | 'high' | 'medium' | 'low' {
  if (stock <= 5)   return 'critical';
  if (stock <= 15)  return 'high';
  if (stock <= 30)  return 'medium';
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
