import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import { HawkerCenter } from '../contexts/DataContext';

interface HawkerCenterCardProps {
  hawker: HawkerCenter;
}

export default function HawkerCenterCard({ hawker }: HawkerCenterCardProps) {
  return (
    <Link
      to={`/hawker/${hawker.id}`}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <img
          src={hawker.image}
          alt={hawker.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-medium">{hawker.rating}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{hawker.name}</h3>
        <div className="flex items-start space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-gray-600 text-sm">{hawker.address}</p>
        </div>
        <p className="text-gray-700 mb-4 text-sm line-clamp-2">{hawker.description}</p>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{hawker.stallCount} stalls</span>
          </div>
        </div>
      </div>
    </Link>
  );
}