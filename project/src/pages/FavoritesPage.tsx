import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import PropertyCard from '../components/PropertyCard';

interface FavoritesPageProps {
  onContactSeller: (property: any) => void;
  onViewDetails: (property: any) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ onContactSeller, onViewDetails }) => {
  const { user } = useAuth();
  const { properties, getUserFavorites } = useData();

  if (!user || user.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Only buyers can view favorites</p>
        </div>
      </div>
    );
  }

  const userFavorites = getUserFavorites(user.id);
  const favoriteProperties = properties.filter(p => userFavorites.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Favorite Properties
          </h1>
          <p className="text-gray-600">
            {favoriteProperties.length} properties saved for later
          </p>
        </div>

        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onContactSeller={onContactSeller}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No favorite properties yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start browsing properties and click the heart icon to save them here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;