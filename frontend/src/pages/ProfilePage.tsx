import React, { useState } from 'react';
import { Heart, Clock, Star, Search, MapPin } from 'lucide-react';
// 🛑 CRITICAL FIX 1: Import Link from react-router-dom for internal navigation
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import StallCard from '../components/StallCard';
import HawkerCenterCard from '../components/HawkerCenterCard';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recent' | 'history'>('favorites');
  const { user } = useAuth();
  const { stalls, hawkerCenters, favorites, searchHistory, recentlyVisited } = useData();

  const favoriteStalls = stalls.filter(stall => favorites.includes(stall.id));
  const recentStalls = stalls.filter(stall => recentlyVisited.includes(stall.id))
    .sort((a, b) => recentlyVisited.indexOf(a.id) - recentlyVisited.indexOf(b.id));

  if (!user || user.type !== 'consumer') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-600 mt-2">Please log in as a consumer to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold text-red-600">
              {user.username.charAt(0).toUpperCase()} {/* Use username if 'name' isn't available */}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1> {/* Use username */}
            <p className="text-gray-600">{user.email}</p>
            {/* Assuming user has a 'createdAt' field from sign up */}
            <p className="text-sm text-gray-500">Member since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Heart className="h-8 w-8 text-red-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{favorites.length}</div>
          <div className="text-gray-600">Favorite Stalls</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Clock className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">{recentlyVisited.length}</div>
          <div className="text-gray-600">Recently Visited</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <Star className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900">0</div>
          <div className="text-gray-600">Reviews Written</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-200 rounded-lg p-1 max-w-lg">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'favorites'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'recent'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Recent ({recentlyVisited.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'history'
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Search ({searchHistory.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'favorites' ? (
        <div>
          {favoriteStalls.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteStalls.map(stall => (
                <StallCard key={stall.id} stall={stall} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Favorites Yet</h3>
              <p className="text-gray-600 mb-6">Start exploring hawker centers and save your favorite stalls</p>
              {/* 🛑 FIX 2: Replaced <a> with <Link> and href with to */}
              <Link
                to="/search"
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Discover Stalls
              </Link>
            </div>
          )}
        </div>
      ) : activeTab === 'recent' ? (
        <div>
          {recentStalls.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recently Visited Stalls</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentStalls.slice(0, 6).map(stall => (
                    <StallCard key={stall.id} stall={stall} />
                  ))}
                </div>
                {recentStalls.length > 6 && (
                  <div className="mt-6 text-center">
                    <button className="text-red-600 hover:text-red-700 font-medium">
                      View All Recent Visits
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No Recent Visits</h3>
              <p className="text-gray-600 mb-6">Visit some stalls to see them here</p>
              {/* 🛑 FIX 3: Replaced <a> with <Link> and to prop with to */}
              <Link
                to="/search"
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Discover Stalls
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Searches</h3>
          {searchHistory.length > 0 ? (
            <div className="space-y-3">
              {searchHistory.map((query, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{query}</span>
                  </div>
                  {/* 🛑 FIX 4: Replaced <a> with <Link>, changed 'to' prop to the correct value */}
                  <Link
                    to={`/search?q=${encodeURIComponent(query)}`}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Search again
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No search history yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}