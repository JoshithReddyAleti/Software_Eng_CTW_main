import React from 'react';
import { Heart, MessageCircle, MapPin, Bed, Square, Calendar } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { mockUsers } from '../data/mockData';

interface PropertyCardProps {
  property: Property;
  onContactSeller: (property: Property) => void;
  onViewDetails: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onContactSeller, onViewDetails }) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleFavorite, getUserFavorites } = useData();
  
  const seller = mockUsers.find(u => u.id === property.sellerId);
  const userFavorites = user ? getUserFavorites(user.id) : [];
  const isFavorite = userFavorites.includes(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }
    if (user?.role !== 'buyer') {
      alert('Only buyers can add favorites');
      return;
    }
    toggleFavorite(user.id, property.id);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to contact sellers');
      return;
    }
    onContactSeller(property);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 group"
      onClick={() => onViewDetails(property)}
    >
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </span>
        </div>
        {user?.role === 'buyer' && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-50 hover:text-red-500 shadow-lg'
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">{property.title}</h3>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">{formatPrice(property.price)}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{property.age} years</span>
          </div>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {seller?.name.charAt(0)}
                </span>
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">{seller?.name}</p>
                <p className="text-xs text-gray-500">Seller</p>
              </div>
            </div>
            
            <button
              onClick={handleContactClick}
              className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full text-sm font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Contact</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;