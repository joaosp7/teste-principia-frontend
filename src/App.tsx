/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import type { Item, ItemFormData, ItemsQueryParams } from './types/item';
import { itemsService } from './services/itemsService';
import { useItems } from './hooks/useItems';
import { ItemList } from './components/ItemList';
import { ItemForm } from './components/ItemForm';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import './App.css';

function App() {
  const [queryParams, setQueryParams] = useState<ItemsQueryParams>({
    search: '',
    page: 1,
    limit: 10,
    sort: 'createdAt',
    order: 'DESC',
  });

  const { items, loading, error, total, refetch } = useItems(queryParams);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams((prev) => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleSort = (field: string) => {
    setQueryParams((prev) => ({
      ...prev,
      sort: field,
      order: prev.sort === field && prev.order === 'ASC' ? 'DESC' : 'ASC',
    }));
  };

  const handlePageChange = (newPage: number) => {
    setQueryParams((prev) => ({ ...prev, page: newPage }));
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormSubmit = async (data: ItemFormData) => {
    if (editingItem) {
      await itemsService.updateItem(editingItem.id, data);
    } else {
      await itemsService.createItem(data);
    }
    setShowForm(false);
    setEditingItem(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDeleteClick = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setDeletingItem(item);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;

    try {
      setDeleteLoading(true);
      await itemsService.deleteItem(deletingItem.id);
      setDeletingItem(null);
      refetch();
    } catch (err) {
      alert('Error deleting item');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingItem(null);
  };

  const totalPages = Math.ceil(total / queryParams.limit!);

  return (
    <div className="app">
      <header className="app-header">
        <h1>📋 Items Manager</h1>
      </header>

      <main className="app-main">
        <div className="controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="🔍 Search by name..."
              value={queryParams.search}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
          <button onClick={handleCreate} className="btn btn-primary">
            ➕ New Item
          </button>
        </div>

        <ItemList
          items={items}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onSort={handleSort}
          sortField={queryParams.sort || ''}
          sortOrder={queryParams.order || 'ASC'}
        />

        {!loading && items.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(queryParams.page! - 1)}
              disabled={queryParams.page === 1}
              className="btn btn-secondary"
            >
              ← Previous
            </button>
            <span className="pagination-info">
              Page {queryParams.page} of {totalPages} ({total} items)
            </span>
            <button
              onClick={() => handlePageChange(queryParams.page! + 1)}
              disabled={queryParams.page === totalPages}
              className="btn btn-secondary"
            >
              Next →
            </button>
          </div>
        )}
      </main>

      {showForm && (
        <ItemForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {deletingItem && (
        <DeleteConfirmation
          itemName={deletingItem.name}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}

export default App;
