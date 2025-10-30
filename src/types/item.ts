export type ItemStatus = 'todo' | 'doing' | 'done';

export interface Item {
  id: string;
  name: string;
  status: ItemStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFormData {
  name: string;
  status?: ItemStatus;
  description?: string;
}

export interface ItemsQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface ItemsResponse {
  data: Item[],
  metadata: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    nextPage: number | null;
    previousPage: number | null;
    sort: string;
    order: 'ASC' | 'DESC'
  }
}
