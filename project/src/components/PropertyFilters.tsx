import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { FilterState } from '../types';

interface PropertyFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const PropertyFilters: React.FC<PropertyFiltersProps> = ({ filters, onFiltersChange }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      minPrice: 0,
      maxPrice: 2000000,
      bedrooms: 0,
      minSqft: 0,
      maxSqft: 5000,
      maxAge: 50,
      type: '',
    });
  };

  const hasActiveFilters = filters.search || filters.minPrice > 0 || filters.maxPrice < 2000000 || 
                          filters.bedrooms > 0 || filters.minSqft > 0 || filters.maxSqft < 5000 || 
                          filters.maxAge < 50 || filters.type;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties by title or location..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice === 2000000 ? '' : filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || 2000000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Any</option>
                <option value={1}>1+</option>
                <option value={2}>2+</option>
                <option value={3}>3+</option>
                <option value={4}>4+</option>
                <option value={5}>5+</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="villa">Villa</option>
              </select>
            </div>

            {/* Square Footage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minSqft || ''}
                  onChange={(e) => handleFilterChange('minSqft', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxSqft === 5000 ? '' : filters.maxSqft}
                  onChange={(e) => handleFilterChange('maxSqft', Number(e.target.value) || 5000)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Age (years)
              </label>
              <input
                type="number"
                placeholder="Max age"
                value={filters.maxAge === 50 ? '' : filters.maxAge}
                onChange={(e) => handleFilterChange('maxAge', Number(e.target.value) || 50)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;