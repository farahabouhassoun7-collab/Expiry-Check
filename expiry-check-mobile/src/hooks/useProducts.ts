import { useState, useEffect, useCallback } from 'react';
import { getProducts, searchProducts } from '../services/api';
import type { Product } from '../types';

export function useProducts(limit = 20) {
  const [products, setProducts] = useState<Product[]>([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(0);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  const fetch = useCallback(async (query: string, pageIndex: number) => {
    setLoading(true);
    setError(null);
    try {
      const skip = pageIndex * limit;
      const data = query.trim()
        ? await searchProducts(query, limit)
        : await getProducts(limit, skip);
      setProducts(data.products);
      setTotal(data.total);
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetch('', 0); }, [fetch]);

  function loadMore() {
    const next = page + 1;
    if (next * limit >= total) return;
    setPage(next);
    fetch('', next);
  }

  function search(q: string) {
    setPage(0);
    fetch(q, 0);
  }

  function retry() { fetch('', page); }

  return { products, total, loading, error, loadMore, search, retry };
}
