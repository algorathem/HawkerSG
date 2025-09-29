import React, { createContext, useContext, useState, useCallback } from 'react';

export interface HawkerCenter {
  id: string;
  name: string;
  address: string;
  description: string;
  image: string;
  rating: number;
  stallCount: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export interface Stall {
  id: string;
  hawkerId: string;
  name: string;
  description: string;
  cuisine: string;
  location: string;
  images: string[];
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$';
  isOpen: boolean;
  menu: MenuItem[];
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
}

export interface Review {
  id: string;
  stallId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
}

interface DataContextType {
  hawkerCenters: HawkerCenter[];
  stalls: Stall[];
  reviews: Review[];
  favorites: string[];
  searchHistory: string[];
  recentlyVisited: string[];
  getStallsByHawker: (hawkerId: string) => Stall[];
  getReviewsByStall: (stallId: string) => Review[];
  addToFavorites: (stallId: string) => void;
  removeFromFavorites: (stallId: string) => void;
  addToSearchHistory: (query: string) => void;
  addToRecentlyVisited: (stallId: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data for demonstration
const mockHawkerCenters: HawkerCenter[] = [
  {
    id: 'hc1',
    name: 'Maxwell Food Centre',
    address: '1 Kadayanallur Street, Singapore 069184',
    description: 'One of Singapore\'s most famous hawker centers, known for its Hainanese chicken rice and laksa.',
    image: 'https://images.pexels.com/photos/5922220/pexels-photo-5922220.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.5,
    stallCount: 85,
    coordinates: { lat: 1.2805, lng: 103.8431 }
  },
  {
    id: 'hc2',
    name: 'Tiong Bahru Market',
    address: '30 Seng Poh Road, Singapore 168898',
    description: 'A heritage hawker center in the heart of Tiong Bahru, famous for its traditional breakfast items.',
    image: 'https://images.pexels.com/photos/5922265/pexels-photo-5922265.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.3,
    stallCount: 62,
    coordinates: { lat: 1.2866, lng: 103.8279 }
  },
  {
    id: 'hc3',
    name: 'Lau Pa Sat',
    address: '18 Raffles Quay, Singapore 048582',
    description: 'Historic Victorian-era market building serving diverse local and international cuisines.',
    image: 'https://images.pexels.com/photos/5922242/pexels-photo-5922242.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.2,
    stallCount: 45,
    coordinates: { lat: 1.2805, lng: 103.8508 }
  },
  {
    id: 'hc4',
    name: 'Newton Food Centre',
    address: '500 Clemenceau Avenue North, Singapore 229495',
    description: 'Popular tourist destination known for its seafood and barbecue stingray.',
    image: 'https://images.pexels.com/photos/5922280/pexels-photo-5922280.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.1,
    stallCount: 78,
    coordinates: { lat: 1.3048, lng: 103.8318 }
  },
  {
    id: 'hc5',
    name: 'Bugis Street Food Centre',
    address: '3 New Bugis Street, Singapore 188867',
    description: 'Modern hawker center in the bustling Bugis area with air-conditioned comfort.',
    image: 'https://images.pexels.com/photos/5922295/pexels-photo-5922295.jpeg?auto=compress&cs=tinysrgb&w=800',
    rating: 4.0,
    stallCount: 56,
    coordinates: { lat: 1.2966, lng: 103.8547 }
  }
];

const mockStalls: Stall[] = [
  {
    id: 'stall1',
    hawkerId: 'hc1',
    name: 'Tian Tian Hainanese Chicken Rice',
    description: 'Famous for tender chicken and fragrant rice, a Maxwell Food Centre institution.',
    cuisine: 'Chinese',
    location: 'Stall #01-10',
    images: [
      'https://images.pexels.com/photos/5922220/pexels-photo-5922220.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/5922242/pexels-photo-5922242.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.6,
    reviewCount: 1250,
    priceRange: '$',
    isOpen: true,
    menu: [
      {
        id: 'menu1',
        name: 'Hainanese Chicken Rice',
        description: 'Tender steamed chicken with fragrant rice',
        price: 4.50,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922220/pexels-photo-5922220.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'menu2',
        name: 'Roasted Chicken Rice',
        description: 'Crispy roasted chicken with rice',
        price: 5.00,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922242/pexels-photo-5922242.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    operatingHours: {
      monday: { open: '10:00', close: '20:00', closed: false },
      tuesday: { open: '10:00', close: '20:00', closed: false },
      wednesday: { open: '10:00', close: '20:00', closed: false },
      thursday: { open: '10:00', close: '20:00', closed: false },
      friday: { open: '10:00', close: '20:00', closed: false },
      saturday: { open: '10:00', close: '20:00', closed: false },
      sunday: { open: '10:00', close: '20:00', closed: true }
    }
  },
  {
    id: 'stall2',
    hawkerId: 'hc1',
    name: 'Zhen Zhen Porridge',
    description: 'Traditional Teochew porridge with various side dishes.',
    cuisine: 'Chinese',
    location: 'Stall #01-54',
    images: [
      'https://images.pexels.com/photos/5922265/pexels-photo-5922265.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.3,
    reviewCount: 890,
    priceRange: '$',
    isOpen: true,
    menu: [
      {
        id: 'menu3',
        name: 'Teochew Porridge Set',
        description: 'Plain porridge with assorted dishes',
        price: 8.00,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922265/pexels-photo-5922265.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    operatingHours: {
      monday: { open: '11:00', close: '21:00', closed: false },
      tuesday: { open: '11:00', close: '21:00', closed: false },
      wednesday: { open: '11:00', close: '21:00', closed: false },
      thursday: { open: '11:00', close: '21:00', closed: false },
      friday: { open: '11:00', close: '21:00', closed: false },
      saturday: { open: '11:00', close: '21:00', closed: false },
      sunday: { open: '11:00', close: '21:00', closed: false }
    }
  },
  {
    id: 'stall3',
    hawkerId: 'hc2',
    name: 'Tiong Bahru Lor Mee',
    description: 'Traditional lor mee with thick gravy and fresh ingredients.',
    cuisine: 'Chinese',
    location: 'Stall #02-05',
    images: [
      'https://images.pexels.com/photos/5922280/pexels-photo-5922280.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.4,
    reviewCount: 650,
    priceRange: '$',
    isOpen: false,
    menu: [
      {
        id: 'menu4',
        name: 'Lor Mee',
        description: 'Braised noodles in thick starchy gravy',
        price: 4.00,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922280/pexels-photo-5922280.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    operatingHours: {
      monday: { open: '07:00', close: '15:00', closed: false },
      tuesday: { open: '07:00', close: '15:00', closed: false },
      wednesday: { open: '07:00', close: '15:00', closed: false },
      thursday: { open: '07:00', close: '15:00', closed: false },
      friday: { open: '07:00', close: '15:00', closed: false },
      saturday: { open: '07:00', close: '15:00', closed: false },
      sunday: { open: '07:00', close: '15:00', closed: true }
    }
  },
  {
    id: 'stall4',
    hawkerId: 'hc3',
    name: 'Satay by the Bay',
    description: 'Authentic satay with peanut sauce and ketupat.',
    cuisine: 'Malay',
    location: 'Stall #01-15',
    images: [
      'https://images.pexels.com/photos/5922295/pexels-photo-5922295.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.2,
    reviewCount: 420,
    priceRange: '$',
    isOpen: true,
    menu: [
      {
        id: 'menu5',
        name: 'Chicken Satay (10 sticks)',
        description: 'Grilled chicken skewers with peanut sauce',
        price: 8.00,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922295/pexels-photo-5922295.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: 'menu6',
        name: 'Beef Satay (10 sticks)',
        description: 'Grilled beef skewers with peanut sauce',
        price: 10.00,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922295/pexels-photo-5922295.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    operatingHours: {
      monday: { open: '17:00', close: '23:00', closed: false },
      tuesday: { open: '17:00', close: '23:00', closed: false },
      wednesday: { open: '17:00', close: '23:00', closed: false },
      thursday: { open: '17:00', close: '23:00', closed: false },
      friday: { open: '17:00', close: '23:00', closed: false },
      saturday: { open: '17:00', close: '23:00', closed: false },
      sunday: { open: '17:00', close: '23:00', closed: false }
    }
  },
  {
    id: 'stall5',
    hawkerId: 'hc4',
    name: 'Newton Barbecue Seafood',
    description: 'Fresh seafood barbecued to perfection, famous for stingray.',
    cuisine: 'Chinese',
    location: 'Stall #01-25',
    images: [
      'https://images.pexels.com/photos/5922220/pexels-photo-5922220.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.1,
    reviewCount: 780,
    priceRange: '$$',
    isOpen: true,
    menu: [
      {
        id: 'menu7',
        name: 'Barbecue Stingray',
        description: 'Grilled stingray with sambal chili',
        price: 15.00,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922220/pexels-photo-5922220.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    operatingHours: {
      monday: { open: '18:00', close: '02:00', closed: false },
      tuesday: { open: '18:00', close: '02:00', closed: false },
      wednesday: { open: '18:00', close: '02:00', closed: false },
      thursday: { open: '18:00', close: '02:00', closed: false },
      friday: { open: '18:00', close: '02:00', closed: false },
      saturday: { open: '18:00', close: '02:00', closed: false },
      sunday: { open: '18:00', close: '02:00', closed: false }
    }
  },
  {
    id: 'stall6',
    hawkerId: 'hc5',
    name: 'Bugis Laksa',
    description: 'Spicy coconut curry noodle soup with prawns and cockles.',
    cuisine: 'Chinese',
    location: 'Stall #02-08',
    images: [
      'https://images.pexels.com/photos/5922242/pexels-photo-5922242.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.0,
    reviewCount: 340,
    priceRange: '$',
    isOpen: true,
    menu: [
      {
        id: 'menu8',
        name: 'Laksa',
        description: 'Spicy coconut curry noodle soup',
        price: 5.50,
        category: 'Main',
        image: 'https://images.pexels.com/photos/5922242/pexels-photo-5922242.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ],
    operatingHours: {
      monday: { open: '09:00', close: '19:00', closed: false },
      tuesday: { open: '09:00', close: '19:00', closed: false },
      wednesday: { open: '09:00', close: '19:00', closed: false },
      thursday: { open: '09:00', close: '19:00', closed: false },
      friday: { open: '09:00', close: '19:00', closed: false },
      saturday: { open: '09:00', close: '19:00', closed: false },
      sunday: { open: '09:00', close: '19:00', closed: true }
    }
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [hawkerCenters] = useState<HawkerCenter[]>(mockHawkerCenters);
  const [stalls] = useState<Stall[]>(mockStalls);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [recentlyVisited, setRecentlyVisited] = useState<string[]>([]);

  const getStallsByHawker = useCallback((hawkerId: string) => {
    return stalls.filter(stall => stall.hawkerId === hawkerId);
  }, [stalls]);

  const getReviewsByStall = useCallback((stallId: string) => {
    return reviews.filter(review => review.stallId === stallId);
  }, [reviews]);

  const addToFavorites = useCallback((stallId: string) => {
    setFavorites(prev => [...prev, stallId]);
  }, []);

  const removeFromFavorites = useCallback((stallId: string) => {
    setFavorites(prev => prev.filter(id => id !== stallId));
  }, []);

  const addToSearchHistory = useCallback((query: string) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item !== query);
      return [query, ...filtered].slice(0, 10);
    });
  }, []);

  const addToRecentlyVisited = useCallback((stallId: string) => {
    setRecentlyVisited(prev => {
      const filtered = prev.filter(id => id !== stallId);
      return [stallId, ...filtered].slice(0, 20);
    });
  }, []);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setReviews(prev => [newReview, ...prev]);
  }, []);

  return (
    <DataContext.Provider value={{
      hawkerCenters,
      stalls,
      reviews,
      favorites,
      searchHistory,
      recentlyVisited,
      getStallsByHawker,
      getReviewsByStall,
      addToFavorites,
      removeFromFavorites,
      addToSearchHistory,
      addToRecentlyVisited,
      addReview
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}