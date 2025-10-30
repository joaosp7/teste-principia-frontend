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
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      todo: 'A Fazer',
      doing: 'Fazendo',
      done: 'Concluído',
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Carregando items...</p>
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
        <p>📭 Nenhum item encontrado</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="items-table">
        <thead>
          <tr>
            <th onClick={() => onSort('name')} className="sortable">
              Nome {getSortIcon('name')}
            </th>
            <th onClick={() => onSort('status')} className="sortable">
              Status {getSortIcon('status')}
            </th>
            <th onClick={() => onSort('createdAt')} className="sortable">
              Data de Criação {getSortIcon('createdAt')}
            </th>
            <th>Ações</th>
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
              <td>{formatDate(item.createdAt)}</td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onEdit(item)}
                    className="btn btn-edit"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="btn btn-delete"
                    title="Excluir"
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
