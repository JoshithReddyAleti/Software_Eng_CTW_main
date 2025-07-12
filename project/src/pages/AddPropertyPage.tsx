import React, { useState } from 'react';
import { Plus, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface AddPropertyPageProps {
  onSuccess: () => void;
}

const AddPropertyPage: React.FC<AddPropertyPageProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const { addProperty } = useData();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    bedrooms: '',
    sqft: '',
    age: '',
    description: '',
    type: 'house' as 'house' | 'apartment' | 'condo' | 'villa',
    features: [] as string[],
  });
  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Stock images for demo purposes
  const stockImages = [
    'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
    'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
  ];

  if (!user || user.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="text-gray-600">Only sellers can add properties</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (featureToRemove: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter(feature => feature !== featureToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.price || !formData.location || 
          !formData.bedrooms || !formData.sqft || !formData.age) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Use a random stock image for demo
      const randomImage = stockImages[Math.floor(Math.random() * stockImages.length)];

      addProperty({
        title: formData.title,
        price: Number(formData.price),
        location: formData.location,
        bedrooms: Number(formData.bedrooms),
        sqft: Number(formData.sqft),
        age: Number(formData.age),
        description: formData.description,
        type: formData.type,
        status: 'available',
        sellerId: user.id,
        features: formData.features,
        image: randomImage,
      });

      onSuccess();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Add New Property</h1>
            <p className="text-gray-600 mt-1">Create a listing for your property</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter property title"
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="house">House</option>
                  <option value="apartment">Apartment</option>
                  <option value="condo">Condo</option>
                  <option value="villa">Villa</option>
                </select>
              </div>

              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  required
                  min="1"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Number of bedrooms"
                />
              </div>

              <div>
                <label htmlFor="sqft" className="block text-sm font-medium text-gray-700 mb-2">
                  Square Feet *
                </label>
                <input
                  type="number"
                  id="sqft"
                  name="sqft"
                  required
                  min="1"
                  value={formData.sqft}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Square footage"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                  Age (years) *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="0"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Age in years"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your property..."
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a feature (e.g., Swimming Pool, Garage)"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Image Info */}
            <div className="bg-blue-50 p-4 rounded-md">
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Property Image</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                A high-quality stock image will be automatically assigned to your property for demo purposes.
              </p>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onSuccess}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding Property...' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPropertyPage;