import React from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import PropertyCard from '../components/PropertyCard';

interface ProfilePageProps {
  onContactSeller: (property: any) => void;
  onViewDetails: (property: any) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onContactSeller, onViewDetails }) => {
  const { user } = useAuth();
  const { properties, getUserFavorites } = useData();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Please login to view profile</h2>
        </div>
      </div>
    );
  }

  const userFavorites = getUserFavorites(user.id);
  const favoriteProperties = properties.filter(p => userFavorites.includes(p.id));
  const userProperties = properties.filter(p => p.sellerId === user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {user.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-blue-600 font-medium capitalize">{user.role}</p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-1" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {user.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {user.role === 'buyer' ? 'Favorite Properties' : 'Listed Properties'}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.role === 'buyer' ? favoriteProperties.length : userProperties.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Account Type</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Member Since</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user.createdAt.getFullYear()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {user.role === 'buyer' ? 'My Favorite Properties' : 'My Listed Properties'}
            </h2>
            <p className="text-gray-600 mt-1">
              {user.role === 'buyer' 
                ? 'Properties you\'ve saved for later viewing' 
                : 'Properties you\'ve listed for sale'}
            </p>
          </div>
          
          <div className="p-6">
            {user.role === 'buyer' ? (
              favoriteProperties.length > 0 ? (
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
                  <div className="text-gray-500 text-lg">No favorite properties yet</div>
                  <p className="text-gray-400 mt-2">Start browsing properties to add them to your favorites!</p>
                </div>
              )
            ) : (
              userProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userProperties.map((property) => (
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
                  <div className="text-gray-500 text-lg">No properties listed yet</div>
                  <p className="text-gray-400 mt-2">Add your first property to start selling!</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;