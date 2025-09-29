import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Star, Clock, Filter } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import HawkerCenterCard from '../components/HawkerCenterCard';
import StallCard from '../components/StallCard';

export default function NearbyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'hawkers' | 'stalls'>('hawkers');
  const [radius, setRadius] = useState(2); // km
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');

  const { hawkerCenters, stalls } = useData();

  // Mock locations for demo
  const mockLocations = {
    'Tiong Bahru': { lat: 1.2866, lng: 103.8279 },
    'Chinatown': { lat: 1.2805, lng: 103.8431 },
    'Marina Bay': { lat: 1.2805, lng: 103.8508 },
    'Orchard': { lat: 1.3048, lng: 103.8318 },
    'Bugis': { lat: 1.2966, lng: 103.8547 }
  };

  useEffect(() => {
    // Try to get user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationName('Your Location');
        },
        () => {
          // Fallback to Tiong Bahru for demo
          setUserLocation(mockLocations['Tiong Bahru']);
          setLocationName('Tiong Bahru');
        }
      );
    } else {
      setUserLocation(mockLocations['Tiong Bahru']);
      setLocationName('Tiong Bahru');
    }
  }, []);

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const getNearbyHawkers = () => {
    if (!userLocation) return [];
    
    return hawkerCenters
      .map(hawker => ({
        ...hawker,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          hawker.coordinates.lat,
          hawker.coordinates.lng
        )
      }))
      .filter(hawker => hawker.distance <= radius)
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        return b.rating - a.rating;
      });
  };

  const getNearbyStalls = () => {
    if (!userLocation) return [];
    
    const nearbyHawkerIds = getNearbyHawkers().map(h => h.id);
    return stalls
      .filter(stall => nearbyHawkerIds.includes(stall.hawkerId))
      .map(stall => {
        const hawker = hawkerCenters.find(h => h.id === stall.hawkerId);
        return {
          ...stall,
          distance: hawker ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            hawker.coordinates.lat,
            hawker.coordinates.lng
          ) : 0
        };
      })
      .sort((a, b) => {
        if (sortBy === 'distance') return a.distance - b.distance;
        return b.rating - a.rating;
      });
  };

  const nearbyHawkers = getNearbyHawkers();
  const nearbyStalls = getNearbyStalls();

  const handleLocationChange = (location: string) => {
    setLoading(true);
    setTimeout(() => {
      setUserLocation(mockLocations[location as keyof typeof mockLocations]);
      setLocationName(location);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hawkers Near You</h1>
        <p className="text-gray-600">Discover great food options in your area</p>
      </div>

      {/* Location Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <MapPin className="h-5 w-5 text-red-600" />
          <span className="font-medium text-gray-900">Current Location: {locationName}</span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
          {Object.keys(mockLocations).map(location => (
            <button
              key={location}
              onClick={() => handleLocationChange(location)}
              disabled={loading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                locationName === location
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
            >
              {location}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Radius:</span>
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-200 rounded-lg p-1 max-w-md">
        <button
          onClick={() => setActiveTab('hawkers')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'hawkers'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Hawker Centers ({nearbyHawkers.length})
        </button>
        <button
          onClick={() => setActiveTab('stalls')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'stalls'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Stalls ({nearbyStalls.length})
        </button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Finding nearby hawkers...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeTab === 'hawkers' ? (
            nearbyHawkers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyHawkers.map(hawker => (
                  <div key={hawker.id} className="relative">
                    <HawkerCenterCard hawker={hawker} />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {hawker.distance.toFixed(1)} km
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Navigation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Hawker Centers Nearby</h3>
                <p className="text-gray-600 mb-4">Try increasing the search radius</p>
              </div>
            )
          ) : (
            nearbyStalls.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {nearbyStalls.map(stall => (
                  <div key={stall.id} className="relative">
                    <StallCard stall={stall} />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {stall.distance.toFixed(1)} km
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Navigation className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No Stalls Nearby</h3>
                <p className="text-gray-600 mb-4">Try increasing the search radius</p>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}