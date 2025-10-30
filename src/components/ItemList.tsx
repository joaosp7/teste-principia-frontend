import React from 'react';
import type { Item } from '../types/item';
import './ItemList.css';

interface ItemListProps {
  items: Item[];
  loading: boolean;
  error: string | null;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onSort: (field: string) => void;
  sortField: string;
  sortOrder: 'ASC' | 'DESC';
}

export const ItemList: React.FC<ItemListProps> = ({
  items,
  loading,
  error,
  onEdit,
  onDelete,
  onSort,
  sortField,
  sortOrder,
}) => {
  const getSortIcon = (field: string) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'ASC' ? '↑' : '↓';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().split('T')[0];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      todo: 'Todo',
      doing: 'Doing',
      done: 'Done',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const truncateText = (text: string | undefined, maxLength: number) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading items...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">❌ {error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-container">
        <p>📭 No items found</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="items-table">
        <thead>
          <tr>
            <th onClick={() => onSort('name')} className="sortable">
              Name {getSortIcon('name')}
            </th>
            <th>Status</th>
            <th>Description</th>
            <th onClick={() => onSort('createdAt')} className="sortable">
              Created At {getSortIcon('createdAt')}
            </th>
            <th onClick={() => onSort('updatedAt')} className="sortable">
              Updated At {getSortIcon('updatedAt')}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>
                <span className={`status-badge status-${item.status}`}>
                  {getStatusLabel(item.status)}
                </span>
              </td>
              <td className="description-cell" title={item.description}>
                {truncateText(item.description, 50)}
              </td>
              <td>{formatDate(item.createdAt)}</td>
              <td>{formatDate(item.updatedAt)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onEdit(item)}
                    className="btn btn-edit"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="btn btn-delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
