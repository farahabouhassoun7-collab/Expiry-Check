/* ─── Real Backend Inventory & Expiry Tracking API Service ────────────────── */

import { getToken } from './authService';

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
  status: 'Active' | 'NearExpiry' | 'Expired' | 'Depleted' | 'Disposed' | string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

/** Get paginated list of inventory batches */
export async function getInventoryBatches(page = 1, pageSize = 20, productId?: number): Promise<PagedResult<InventoryBatch>> {
  let url = `${BASE_URL}/api/inventory?page=${page}&pageSize=${pageSize}`;
  if (productId) url += `&productId=${productId}`;

  const res = await fetch(url, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch inventory batches: ${res.status}`);
  return res.json();
}

/** Get single batch by ID */
export async function getBatchById(id: number): Promise<InventoryBatch> {
  const res = await fetch(`${BASE_URL}/api/inventory/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch batch ${id}: ${res.status}`);
  return res.json();
}

/** Get all batches for a specific product */
export async function getBatchesByProductId(productId: number): Promise<InventoryBatch[]> {
  const res = await fetch(`${BASE_URL}/api/inventory/product/${productId}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch product batches: ${res.status}`);
  return res.json();
}

/** Get batches expiring within threshold days (default 30) */
export async function getExpiringBatches(days = 30): Promise<InventoryBatch[]> {
  const res = await fetch(`${BASE_URL}/api/inventory/expiring?days=${days}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch expiring batches: ${res.status}`);
  return res.json();
}

/** Get expired inventory batches */
export async function getExpiredBatches(): Promise<InventoryBatch[]> {
  const res = await fetch(`${BASE_URL}/api/inventory/expired`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch expired batches: ${res.status}`);
  return res.json();
}

/** Get low stock inventory batches */
export async function getLowStockBatches(): Promise<InventoryBatch[]> {
  const res = await fetch(`${BASE_URL}/api/inventory/low-stock`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Failed to fetch low-stock batches: ${res.status}`);
  return res.json();
}

/** Create a new inventory batch */
export async function createBatch(batchData: Partial<InventoryBatch>): Promise<InventoryBatch> {
  const res = await fetch(`${BASE_URL}/api/inventory`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(batchData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create inventory batch (${res.status})`);
  }
  return res.json();
}

/** Update an existing inventory batch */
export async function updateBatch(id: number, batchData: Partial<InventoryBatch>): Promise<InventoryBatch> {
  const res = await fetch(`${BASE_URL}/api/inventory/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(batchData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update inventory batch (${res.status})`);
  }
  return res.json();
}

/** Delete an inventory batch */
export async function deleteBatch(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/inventory/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Failed to delete inventory batch (${res.status})`);
}
