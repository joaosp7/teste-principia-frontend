import React from 'react';
import './DeleteConfirmation.css';

interface DeleteConfirmationProps {
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  itemName,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-icon">⚠️</div>
        <h2>Confirmar Exclusão</h2>
        <p>
          Tem certeza que deseja excluir o item <strong>"{itemName}"</strong>?
        </p>
        <p className="warning-text">Esta ação não pode ser desfeita.</p>
        
        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </div>
    </div>
  );
};
