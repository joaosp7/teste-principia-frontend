import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ItemForm } from '../components/ItemForm';

describe('ItemForm', () => {
  it('should render the form correctly', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('New Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should validate required name field', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should validate minimum name length', async () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'ab' } });

    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Name/i);
    const statusSelect = screen.getByLabelText(/Status/i);
    const descriptionInput = screen.getByLabelText(/Description/i);

    fireEvent.change(nameInput, { target: { value: 'Test Item' } });
    fireEvent.change(statusSelect, { target: { value: 'doing' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Item',
        status: 'doing',
        description: 'Test description',
      });
    });
  });

  it('should call onCancel when clicking Cancel', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('should populate form when editing an item', () => {
    const mockOnSubmit = vi.fn();
    const mockOnCancel = vi.fn();
    const item = {
      id: '1',
      name: 'Existing Item',
      status: 'done' as const,
      description: 'Existing description',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };

    render(<ItemForm item={item} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText('Edit Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Existing Item');
    expect(screen.getByLabelText(/Status/i)).toHaveValue('done');
    expect(screen.getByLabelText(/Description/i)).toHaveValue('Existing description');
  });

  it('should display loading state during submit', async () => {
    const mockOnSubmit = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const mockOnCancel = vi.fn();

    render(<ItemForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Test' } });

    const submitButton = screen.getByText('Save');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });
});
