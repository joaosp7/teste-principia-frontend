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
      description: 'Description 1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: '2',
      name: 'Item 2',
      status: 'doing',
      description: 'Description 2',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      id: '3',
      name: 'Item 3',
      status: 'done',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    },
  ];

  it('should display loading when loading is true', () => {
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
        sortOrder="ASC"
      />
    );

    expect(screen.getByText('Loading items...')).toBeInTheDocument();
  });

  it('should display error message when error is not null', () => {
    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnSort = vi.fn();

    render(
      <ItemList
        items={[]}
        loading={false}
        error="Error loading data"
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onSort={mockOnSort}
        sortField="createdAt"
        sortOrder="ASC"
      />
    );

    expect(screen.getByText(/Error loading data/i)).toBeInTheDocument();
  });

  it('should display empty list message when there are no items', () => {
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
        sortOrder="ASC"
      />
    );

    expect(screen.getByText(/No items found/i)).toBeInTheDocument();
  });

  it('should render the items list correctly', () => {
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
        sortOrder="ASC"
      />
    );

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('should call onEdit when clicking the edit button', () => {
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
        sortOrder="ASC"
      />
    );

    const editButtons = screen.getAllByTitle('Edit');
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockItems[0]);
  });

  it('should call onDelete when clicking the delete button', () => {
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
        sortOrder="ASC"
      />
    );

    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });

  it('should call onSort when clicking the column header', () => {
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
        sortOrder="ASC"
      />
    );

    const nameHeader = screen.getByText(/Name/i);
    fireEvent.click(nameHeader);

    expect(mockOnSort).toHaveBeenCalledWith('name');
  });
});
