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
        <h2>Confirm Deletion</h2>
        <p>
          Are you sure you want to delete the item <strong>"{itemName}"</strong>?
        </p>
        <p className="warning-text">This action cannot be undone.</p>

        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};
