import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the API base URL.
const API_BASE_URL = 'http://localhost:8001'; 

export interface User {
  id: number; 
  email: string;
  username: string; 
  type: 'consumer' | 'business'; 
  created_at?: string; 
  
  // --- ADDED FIELD ---
  profile_pic?: string; // New optional field from ConsumerOut
  // -------------------
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, userType: 'consumer' | 'business') => Promise<void>;
  signup: (name: string, email: string, password: string, userType: 'consumer' | 'business') => Promise<void>; 
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);


  // --- LOGIN implementation (Mapping updated to include profile_pic) ---
  const login = async (email: string, password: string, userType: 'consumer' | 'business') => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/consumer/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          user_type: userType, 
        }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || 'Login failed.';
        throw new Error(errorMessage);
      }

      const loggedInUser: User = {
        id: data.id,
        email: data.email,
        username: data.username,
        type: data.user_type, 
        created_at: data.created_at,
        profile_pic: data.profile_pic, // <--- ADDED MAPPING
      };
      
      setUser(loggedInUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // --- SIGNUP implementation (Mapping updated to include profile_pic) ---
  const signup = async (name: string, email: string, password: string, userType: 'consumer' | 'business') => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/consumer/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The payload now maps to the ConsumerCreate schema
        body: JSON.stringify({ 
          username: name, 
          email,
          password,
          user_type: userType, 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.detail || 'Failed to create account via API.';
        throw new Error(errorMessage);
      }

      // Data is a ConsumerOut object
      const newUser: User = {
        id: data.id,
        email: data.email,
        username: data.username,
        type: data.user_type,
        created_at: data.created_at,
        profile_pic: data.profile_pic, // <--- ADDED MAPPING
      };

      setUser(newUser);
      
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
