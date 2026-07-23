import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../config';
import type { Product, ProductsResponse, RiskLevel } from '../types';

const TOKEN_KEY = 'expiry_check_token';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface InventoryBatch {
  id: number;
  productId: number;
  sku: string;
  productName: string;
  categoryName: string;
  batchNumber: string;
  manufacturingDate?: string;
  expiryDate: string;
  daysRemaining: number;
  quantity: number;
  remainingQuantity: number;
  purchasePrice: number;
  supplierName?: string;
  warehouseLocation?: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: number;
  inventoryBatchId: number;
  batchNumber: string;
  productId: number;
  sku: string;
  productName: string;
  userId: number;
  userName: string;
  movementType: string; // StockIn | StockOut | Adjustment | Waste | Sale | Transfer
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  referenceNumber?: string;
  movementDate: string;
  createdAt: string;
}

export interface CreateProductPayload {
  sku: string;
  barcode?: string;
  title: string;
  description?: string;
  categoryId: number;
  price: number;
  discountPercentage?: number;
  costPrice?: number;
  minStockLevel?: number;
  brand?: string;
  unit?: string;
  thumbnailUrl?: string;
}

export interface CreateBatchPayload {
  productId: number;
  batchNumber: string;
  manufacturingDate?: string;
  expiryDate: string;
  quantity: number;
  purchasePrice: number;
  supplierName?: string;
  warehouseLocation?: string;
  notes?: string;
}

export interface RecordMovementPayload {
  inventoryBatchId: number;
  movementType: 'StockIn' | 'StockOut' | 'Adjustment' | 'Waste' | 'Sale' | 'Transfer';
  quantity: number;
  reason?: string;
  referenceNumber?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Helper to make HTTP requests with automatic Bearer Authorization header if logged in
 */
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(url, { ...options, headers });
}

function mapProduct(p: any): Product {
  return {
    id: p.id,
    sku: p.sku || '',
    title: p.title || '',
    description: p.description || '',
    category: p.categoryName || 'Uncategorized',
    price: p.price || 0,
    discountPercentage: p.discountPercentage || 0,
    rating: p.rating || 0,
    stock: p.minStockLevel || 10,
    tags: p.tags || [],
    brand: p.brand,
    weight: p.weight || 0,
    thumbnail: p.thumbnailUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    images: p.images || [],
  };
}

// ── Products API ──────────────────────────────────────────────

export async function getProducts(limit = 20, skip = 0): Promise<ProductsResponse> {
  const page = Math.floor(skip / limit) + 1;
  const res = await fetchWithAuth(`${API_BASE_URL}/api/products?page=${page}&pageSize=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data: PagedResult<any> = await res.json();

  return {
    products: (data.items || []).map(mapProduct),
    total: data.totalItems,
    skip,
    limit,
  };
}

export async function getProductById(id: number): Promise<Product> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error(`Product ${id} not found`);
  const data = await res.json();
  return mapProduct(data);
}

export async function searchProducts(q: string, limit = 20): Promise<ProductsResponse> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/products?search=${encodeURIComponent(q)}&pageSize=${limit}`);
  if (!res.ok) throw new Error('Search failed');
  const data: PagedResult<any> = await res.json();

  return {
    products: (data.items || []).map(mapProduct),
    total: data.totalItems,
    skip: 0,
    limit,
  };
}

export async function getProductByBarcode(barcode: string): Promise<Product> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/products/barcode/${encodeURIComponent(barcode)}`);
  if (!res.ok) throw new Error(`Product with barcode ${barcode} not found`);
  const data = await res.json();
  return mapProduct(data);
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create product');
  }
  const data = await res.json();
  return mapProduct(data);
}

export async function updateProduct(id: number, payload: any): Promise<Product> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update product');
  }
  const data = await res.json();
  return mapProduct(data);
}

export async function deleteProduct(id: number): Promise<boolean> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/products/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}

// ── Categories API ─────────────────────────────────────────────

export async function getCategories(): Promise<string[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data: Category[] = await res.json();
  return data.map(c => c.name);
}

export async function getFullCategories(): Promise<Category[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// ── Inventory Batches API ──────────────────────────────────────

export async function getExpiringBatches(days = 30): Promise<InventoryBatch[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/inventory/expiring?days=${days}`);
  if (!res.ok) throw new Error('Failed to fetch expiring inventory');
  return res.json();
}

export async function getExpiredBatches(): Promise<InventoryBatch[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/inventory/expired`);
  if (!res.ok) throw new Error('Failed to fetch expired inventory');
  return res.json();
}

export async function getLowStockBatches(): Promise<InventoryBatch[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/inventory/low-stock`);
  if (!res.ok) throw new Error('Failed to fetch low stock inventory');
  return res.json();
}

export async function getBatchesByProductId(productId: number): Promise<InventoryBatch[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/inventory/product/${productId}`);
  if (!res.ok) throw new Error('Failed to fetch product batches');
  return res.json();
}

export async function createInventoryBatch(payload: CreateBatchPayload): Promise<InventoryBatch> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/inventory`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create inventory batch');
  }
  return res.json();
}

export async function updateInventoryBatch(id: number, payload: any): Promise<InventoryBatch> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/inventory/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update inventory batch');
  }
  return res.json();
}

// ── Stock Movements API ────────────────────────────────────────

export async function recordStockMovement(payload: RecordMovementPayload): Promise<StockMovement> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/stock-movements`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to record stock movement');
  }
  return res.json();
}

export async function getStockMovementsByProduct(productId: number): Promise<StockMovement[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/stock-movements/product/${productId}`);
  if (!res.ok) return [];
  return res.json();
}

export async function getStockMovementsByBatch(batchId: number): Promise<StockMovement[]> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/stock-movements/batch/${batchId}`);
  if (!res.ok) return [];
  return res.json();
}

// ── Helpers ──────────────────────────────────────────────────

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
  if (stock <= 5)  return 'critical';
  if (stock <= 15) return 'high';
  if (stock <= 30) return 'medium';
  return 'low';
}

export function formatExpiryDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

