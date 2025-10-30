import React, { useState, useEffect } from 'react';
import type { Item, ItemFormData } from '../types/item';
import './ItemForm.css';

interface ItemFormProps {
  item?: Item | null;
  onSubmit: (data: ItemFormData) => Promise<void>;
  onCancel: () => void;
}

export const ItemForm: React.FC<ItemFormProps> = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    status: 'todo',
  });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        status: item.status,
      });
    }
  }, [item]);

  const validate = (): boolean => {
    const newErrors: { name?: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      setFormData({ name: '', status: 'todo' });
      setErrors({});
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Erro ao salvar item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>{item ? 'Editar Item' : 'Novo Item'}</h2>
        
        {submitError && (
          <div className="form-error">
            ❌ {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              disabled={loading}
              placeholder="Digite o nome do item"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="todo">A Fazer</option>
              <option value="doing">Fazendo</option>
              <option value="done">Concluído</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
