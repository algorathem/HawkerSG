import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, Heart } from 'lucide-react';
import { Stall } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

interface StallCardProps {
  stall: Stall;
}

export default function StallCard({ stall }: StallCardProps) {
  const { user } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites } = useData();
  const isFavorited = favorites.includes(stall.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user || user.type !== 'consumer') return;
    
    if (isFavorited) {
      removeFromFavorites(stall.id);
    } else {
      addToFavorites(stall.id);
    }
  };

  return (
    <Link
      to={`/stall/${stall.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
    >
      {user && user.type === 'consumer' && (
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorited ? 'text-red-500 fill-current' : 'text-gray-400'
            }`}
          />
        </button>
      )}
      
      <div className="relative">
        <img
          src={stall.images[0]}
          alt={stall.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            stall.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {stall.isOpen ? 'Open' : 'Closed'}
          </span>
          <span className="px-2 py-1 bg-white rounded-full text-xs font-medium">
            {stall.priceRange}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{stall.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{stall.rating}</span>
            <span className="text-xs text-gray-500">({stall.reviewCount})</span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-3">{stall.cuisine}</p>
        <p className="text-gray-700 mb-4 text-sm line-clamp-2">{stall.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{stall.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>10:00 - 20:00</span>
          </div>
        </div>
      </div>
    </Link>
  );
}