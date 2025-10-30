import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ItemForm } from '../components/ItemForm';

describe('ItemForm', () => {
  it('deve renderizar o formulário corretamente', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Novo Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('deve validar campo nome obrigatório', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve validar tamanho mínimo do nome', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Nome/i);
    fireEvent.change(nameInput, { target: { value: 'ab' } });

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 3 caracteres')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve submeter o formulário com dados válidos', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Nome/i);
    const statusSelect = screen.getByLabelText(/Status/i);

    fireEvent.change(nameInput, { target: { value: 'Teste Item' } });
    fireEvent.change(statusSelect, { target: { value: 'doing' } });

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Teste Item',
        status: 'doing',
      });
    });
  });

  it('deve chamar onCancel ao clicar em Cancelar', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('deve preencher o formulário ao editar um item', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    const item = {
      id: '1',
      name: 'Item Existente',
      status: 'done' as const,
      createdAt: '2024-01-01T00:00:00Z',
    };

    render(<ItemForm item={item} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Editar Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome/i)).toHaveValue('Item Existente');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('done');
  });

  it('deve exibir estado de loading durante submit', async () => {
    const mockOnSubmit = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Nome/i);
    fireEvent.change(nameInput, { target: { value: 'Teste' } });

    const submitButton = screen.getByText('Salvar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Salvando...')).toBeInTheDocument();
    });
  });
});
