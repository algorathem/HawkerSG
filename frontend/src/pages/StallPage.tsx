import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Clock, Phone, Heart, Camera, MessageCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import ReviewForm from '../components/ReviewForm';
import ReviewCard from '../components/ReviewCard';

export default function StallPage() {
  const { id } = useParams();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { stalls, hawkerCenters, getReviewsByStall, favorites, addToFavorites, removeFromFavorites, addToRecentlyVisited } = useData();
  const { user } = useAuth();
  
  const stall = stalls.find(s => s.id === id);
  const hawker = stall ? hawkerCenters.find(h => h.id === stall.hawkerId) : null;
  const reviews = getReviewsByStall(id || '');
  const isFavorited = favorites.includes(id || '');

  useEffect(() => {
    if (stall) {
      addToRecentlyVisited(stall.id);
    }
  }, [stall, addToRecentlyVisited]);

  if (!stall || !hawker) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Stall Not Found</h1>
        <p className="text-gray-600 mt-2">The stall you're looking for doesn't exist.</p>
        <Link to="/" className="mt-4 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleFavoriteClick = () => {
    if (!user || user.type !== 'consumer') return;
    
    if (isFavorited) {
      removeFromFavorites(stall.id);
    } else {
      addToFavorites(stall.id);
    }
  };

  const menuByCategory = stall.menu.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof stall.menu>);

  return (
    <div className="min-h-screen">
      {/* Image Gallery */}
      <div className="relative h-64 md:h-96">
        <img
          src={stall.images[activeImageIndex]}
          alt={stall.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Image Navigation */}
        {stall.images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {stall.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === activeImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        )}

        {/* Favorite Button */}
        {user && user.type === 'consumer' && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <Heart
              className={`h-6 w-6 ${
                isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
              }`}
            />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            stall.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {stall.isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{stall.name}</h1>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-medium">{stall.rating}</span>
                      <span className="text-gray-500">({stall.reviewCount} reviews)</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{stall.cuisine}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{stall.priceRange}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{stall.location} at {hawker.name}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 text-lg">{stall.description}</p>
            </div>

            {/* Menu */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>
              {Object.keys(menuByCategory).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(menuByCategory).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{category}</h3>
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.id} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm">
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                                  {item.description && (
                                    <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                                  )}
                                </div>
                                <span className="font-semibold text-gray-900 ml-4">
                                  S${item.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">Menu information not available</p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews ({reviews.length})
                </h2>
                {user && user.type === 'consumer' && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Write Review</span>
                  </button>
                )}
              </div>
              
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map(review => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600 mb-4">Be the first to share your experience!</p>
                  {user && user.type === 'consumer' && (
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Write First Review
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Operating Hours</p>
                    <p className="text-sm text-gray-600">10:00 AM - 8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{stall.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hawker Center Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Hawker Center</h3>
              <Link to={`/hawker/${hawker.id}`} className="block hover:bg-gray-50 rounded-lg p-3 -m-3 transition-colors">
                <img
                  src={hawker.image}
                  alt={hawker.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h4 className="font-medium text-gray-900">{hawker.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{hawker.address}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{hawker.rating}</span>
                  <span className="text-sm text-gray-500">• {hawker.stallCount} stalls</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          stallId={stall.id}
          stallName={stall.name}
          onClose={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}