import React from 'react';
import { X, MapPin, Bed, Square, Calendar, Heart, MessageCircle } from 'lucide-react';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { mockUsers } from '../data/mockData';

interface PropertyModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  onContactSeller: (property: Property) => void;
}

const PropertyModal: React.FC<PropertyModalProps> = ({ property, isOpen, onClose, onContactSeller }) => {
  const { user, isAuthenticated } = useAuth();
  const { toggleFavorite, getUserFavorites } = useData();
  
  const seller = mockUsers.find(u => u.id === property.sellerId);
  const userFavorites = user ? getUserFavorites(user.id) : [];
  const isFavorite = userFavorites.includes(property.id);

  const handleFavoriteClick = () => {
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

  const handleContactClick = () => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{property.title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image */}
            <div className="relative">
              <img 
                src={property.image} 
                alt={property.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                  {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">{formatPrice(property.price)}</span>
                <div className="flex items-center space-x-2">
                  {user?.role === 'buyer' && (
                    <button
                      onClick={handleFavoriteClick}
                      className={`p-2 rounded-full transition-colors ${
                        isFavorite 
                          ? 'bg-red-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                    </button>
                  )}
                  <button
                    onClick={handleContactClick}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact Seller</span>
                  </button>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{property.location}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                <div className="text-center">
                  <Bed className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                  <div className="text-lg font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-500">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Square className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                  <div className="text-lg font-semibold">{property.sqft.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Sq Ft</div>
                </div>
                <div className="text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-1 text-gray-400" />
                  <div className="text-lg font-semibold">{property.age}</div>
                  <div className="text-sm text-gray-500">Years Old</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{property.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">
                      {seller?.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{seller?.name}</div>
                    <div className="text-sm text-gray-500">{seller?.email}</div>
                    <div className="text-sm text-gray-500">{seller?.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;