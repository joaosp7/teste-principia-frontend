import axios from 'axios';
import type { Item, ItemFormData, ItemsQueryParams, ItemsResponse } from '../types/item';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': import.meta.env.VITE_API_SECRET
  },
});

export const itemsService = {
  async getItems(params: ItemsQueryParams = {}): Promise<ItemsResponse> {
    const response = await api.get<ItemsResponse>('/items', { params });
    return response.data;
  },

  async getItemById(id: string): Promise<Item> {
    const response = await api.get<Item>(`/items/${id}`);
    return response.data;
  },

  async createItem(data: ItemFormData): Promise<Item> {
    const response = await api.post<Item>('/items', data);
    return response.data;
  },

  async updateItem(id: string, data: ItemFormData): Promise<Item> {
    const response = await api.patch<Item>(`/items/${id}`, data);
    return response.data;
  },

  async deleteItem(id: string): Promise<void> {
    await api.delete(`/items/${id}`);
  },
};
