import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type Property = {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  location: string;
  featured?: boolean;
  status: 'active' | 'pending' | 'sold';
  property_type: string;
  year_built?: number;
};

type PropertyCardProps = {
  property: Property;
  onFavorite?: (id: string) => void;
  isFavorite?: boolean;
};

export default function PropertyCard({
  property,
  onFavorite,
  isFavorite = false,
}: PropertyCardProps) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatSquareFeet = (sqft: number) => {
    return new Intl.NumberFormat('en-US').format(sqft);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) return;

    setLoading(true);

    try {
      if (favorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', property.id);
      } else {
        await supabase
          .from('favorites')
          .insert([
            {
              user_id: user.id,
              property_id: property.id,
            },
          ]);
      }

      setFavorited(!favorited);
      onFavorite?.(property.id);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/property/${property.id}`} className="group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Overlay Badges */}
          <div className="absolute top-3 left-3">
            {property.featured && (
              <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <span
              className={`text-white text-xs font-semibold px-2 py-1 rounded-full ${
                property.status === 'active'
                  ? 'bg-green-500'
                  : property.status === 'pending'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            >
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </span>
          </div>

          {/* Favorite Button */}
          {user && (
            <button
              onClick={handleFavoriteClick}
              disabled={loading}
              className="absolute bottom-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 hover:scale-110"
            >
              <Heart
                className={`h-4 w-4 transition-colors ${
                  favorited
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-600 hover:text-red-500'
                }`}
              />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </h3>
            <span className="text-sm text-gray-500 capitalize">
              {property.property_type}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
            {property.title}
          </h4>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {property.location}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>
                  {property.bedrooms} bed
                  {property.bedrooms !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>
                  {property.bathrooms} bath
                  {property.bathrooms !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span>{formatSquareFeet(property.sqft)} sqft</span>
            </div>
          </div>

          {/* Year Built */}
          {property.year_built && (
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Built in {property.year_built}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}