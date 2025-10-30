import { useState, useEffect } from 'react';
import type { Item, ItemsQueryParams } from '../types/item';
import { itemsService } from '../services/itemsService';

interface UseItemsResult {
  items: Item[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  refetch: () => void;
}

export const useItems = (params: ItemsQueryParams): UseItemsResult => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(params.page || 1);
  const [limit, setLimit] = useState(params.limit || 10);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await itemsService.getItems(params);
      setItems(response.data);
      setTotal(response.metadata.totalItems);
      setPage(response.metadata.page);
      setLimit(response.metadata.limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [JSON.stringify(params)]);

  return {
    items,
    loading,
    error,
    total,
    page,
    limit,
    refetch: fetchItems,
  };
};
