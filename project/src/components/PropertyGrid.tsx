import React from 'react';
import { Property } from '../types';
import PropertyCard from './PropertyCard';

interface PropertyGridProps {
  properties: Property[];
  onContactSeller: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ properties, onContactSeller, onViewDetails }) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No properties found matching your criteria.</div>
        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onContactSeller={onContactSeller}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default PropertyGrid;