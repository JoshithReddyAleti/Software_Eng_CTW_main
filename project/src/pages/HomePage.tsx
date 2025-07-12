import React, { useState, useMemo } from 'react';
import { Property, FilterState } from '../types';
import { useData } from '../contexts/DataContext';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import PropertyFilters from '../components/PropertyFilters';
import PropertyGrid from '../components/PropertyGrid';
import PropertyModal from '../components/PropertyModal';

interface HomePageProps {
  onContactSeller: (property: Property) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onContactSeller }) => {
  const { properties } = useData();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: 0,
    minSqft: 0,
    maxSqft: 5000,
    maxAge: 50,
    type: '',
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = !filters.search || 
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesPrice = property.price >= filters.minPrice && 
        property.price <= filters.maxPrice;

      const matchesBedrooms = filters.bedrooms === 0 || 
        property.bedrooms >= filters.bedrooms;

      const matchesSqft = property.sqft >= filters.minSqft && 
        property.sqft <= filters.maxSqft;

      const matchesAge = property.age <= filters.maxAge;

      const matchesType = !filters.type || property.type === filters.type;

      return matchesSearch && matchesPrice && matchesBedrooms && 
             matchesSqft && matchesAge && matchesType;
    });
  }, [properties, filters]);

  const handleContactSeller = (property: Property) => {
    setSelectedProperty(null);
    onContactSeller(property);
  };

  const handleViewDetails = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleBrowseProperties = () => {
    setShowAllProperties(true);
    // Scroll to properties section
    setTimeout(() => {
      const element = document.getElementById('properties-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleGetStarted = () => {
    // Navigate to signup or show properties
    setShowAllProperties(true);
    setTimeout(() => {
      const element = document.getElementById('properties-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {!showAllProperties && (
        <>
          <HeroSection 
            onBrowseProperties={handleBrowseProperties}
            onGetStarted={handleGetStarted}
          />
          <FeaturedSection 
            properties={properties}
            onViewProperty={handleViewDetails}
          />
        </>
      )}

      {/* Properties Section */}
      {showAllProperties && (
        <div id="properties-section" className="min-h-screen bg-gray-50 pt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    All Properties
                  </h1>
                  <p className="text-gray-600">
                    Discover {properties.length} amazing properties in your area
                  </p>
                </div>
                <button
                  onClick={() => setShowAllProperties(false)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  ← Back to Home
                </button>
              </div>
            </div>

            <PropertyFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {filteredProperties.length} of {properties.length} properties
              </p>
            </div>

            <PropertyGrid
              properties={filteredProperties}
              onContactSeller={handleContactSeller}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      )}

      {/* Property Modal */}
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            isOpen={!!selectedProperty}
            onClose={() => setSelectedProperty(null)}
            onContactSeller={handleContactSeller}
          />
        )}
    </div>
  );
};

export default HomePage;