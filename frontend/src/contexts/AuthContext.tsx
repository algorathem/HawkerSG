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
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
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
 
    const forgotPassword = async (email: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/consumer/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }), // Send only the email to the backend
            });

            // CRITICAL SECURITY POINT:
            // We treat both 200/204 (Success) and potentially 404 (Not Found) as a success
            // on the frontend to display the neutral message and prevent email enumeration.
            // Only throw an error for severe issues (5xx server error, network failure).
            if (response.status >= 500) {
                throw new Error('Server error during password reset request.');
            }

            // If the status is < 500, we proceed as if the email was sent, 
            // relying on the backend to handle the security check internally.

        } catch (error) {
            console.error('Password reset request failed:', error);
            // Re-throw to be caught by the ForgotPasswordPage component
            throw new Error('Failed to connect to the reset service.');
        }
    };

    const resetPassword = async (token: string, password: string): Promise<void> => {
        const url = `${API_BASE_URL}/consumer/reset-password`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, new_password: password }),
            });

            if (!response.ok) {
                // Read error details from the backend response
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Password reset failed.');
            }

        } catch (error) {
            console.error('Password reset failed:', error);
            throw error;
        }
    };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, forgotPassword, resetPassword }}>
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
