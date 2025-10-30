import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ItemList } from '../components/ItemList';
import type { Item } from '../types/item';

describe('ItemList', () => {
  const mockItems: Item[] = [
    {
      id: '1',
      name: 'Item 1',
      status: 'todo',
      createdAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Item 2',
      status: 'doing',
      createdAt: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      name: 'Item 3',
      status: 'done',
      createdAt: '2024-01-03T00:00:00Z',
    },
  ];

  it('deve exibir loading quando loading é true', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={[]}
        loading={true}
        error={null}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="asc"
      />
    );

    expect(screen.getByText('Carregando items...')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando error não é null', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={[]}
        loading={false}
        error="Erro ao carregar dados"
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="asc"
      />
    );

    expect(screen.getByText(/Erro ao carregar dados/i)).toBeInTheDocument();
  });

  it('deve exibir mensagem de lista vazia quando não há items', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={[]}
        loading={false}
        error={null}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="asc"
      />
    );

    expect(screen.getByText(/Nenhum item encontrado/i)).toBeInTheDocument();
  });

  it('deve renderizar a lista de items corretamente', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={mockItems}
        loading={false}
        error={null}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="asc"
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('deve chamar onEdit ao clicar no botão de editar', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={mockItems}
        loading={false}
        error={null}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="asc"
      />
    );

    const editButtons = screen.getAllByTitle('Editar');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);
  });

  it('deve chamar onDelete ao clicar no botão de excluir', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={mockItems}
        loading={false}
        error={null}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="asc"
      />
    );

    const deleteButtons = screen.getAllByTitle('Excluir');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('deve chamar onSort ao clicar no cabeçalho da coluna', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={mockItems}
        loading={false}
        error={null}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="asc"
      />
    );

    const nameHeader = screen.getByText(/Nome/i);
    fireEvent.click(nameHeader);

    expect(mockOnSort).toHaveBeenCalledWith('name');
  });
});
