import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyFilters from './PropertyFilters';
import { FilterState } from '../types';

describe('PropertyFilters', () => {
  const initialFilters: FilterState = {
    search: '',
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: 0,
    minSqft: 0,
    maxSqft: 5000,
    maxAge: 50,
    type: '',
  };

  it('updates search input and calls onFiltersChange', () => {
    const handleFiltersChange = jest.fn();
    render(<PropertyFilters filters={initialFilters} onFiltersChange={handleFiltersChange} />);

    const input = screen.getByPlaceholderText(/search properties/i);
    fireEvent.change(input, { target: { value: 'Downtown' } });

    expect(handleFiltersChange).toHaveBeenCalledWith({
      ...initialFilters,
      search: 'Downtown',
    });
  });

  it('expands filters and updates bedrooms', () => {
    const handleFiltersChange = jest.fn();
    render(<PropertyFilters filters={initialFilters} onFiltersChange={handleFiltersChange} />);

    const expandButton = screen.getByText(/advanced filters/i);
    fireEvent.click(expandButton);

    const bedroomsSelect = screen.getByLabelText(/bedrooms/i);
    fireEvent.change(bedroomsSelect, { target: { value: '2' } });

    expect(handleFiltersChange).toHaveBeenCalledWith({
      ...initialFilters,
      bedrooms: 2,
    });
  });

  it('clears filters when "Clear Filters" is clicked', () => {
    const modifiedFilters: FilterState = {
      search: 'test',
      minPrice: 100000,
      maxPrice: 800000,
      bedrooms: 3,
      minSqft: 1000,
      maxSqft: 4000,
      maxAge: 20,
      type: 'house',
    };

    const handleFiltersChange = jest.fn();
    render(<PropertyFilters filters={modifiedFilters} onFiltersChange={handleFiltersChange} />);

    const clearButton = screen.getByText(/clear filters/i);
    fireEvent.click(clearButton);

    expect(handleFiltersChange).toHaveBeenCalledWith(initialFilters);
  });
});