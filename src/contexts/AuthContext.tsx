import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/supabase';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user on mount
    checkUser();

    // Subscribe to auth changes
    const { data: authListener } = authService.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Load user profile
          const userData = session.user.user_metadata;
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: userData?.name || '',
            profilePhoto: userData?.profilePhoto,
            emergencyContacts: userData?.emergencyContacts || [],
            preferences: userData?.preferences || getDefaultPreferences(),
            createdAt: session.user.created_at,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const userData = currentUser.user_metadata;
        setUser({
          id: currentUser.id,
          email: currentUser.email,
          name: userData?.name || '',
          profilePhoto: userData?.profilePhoto,
          emergencyContacts: userData?.emergencyContacts || [],
          preferences: userData?.preferences || getDefaultPreferences(),
          createdAt: currentUser.created_at || new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Check user error:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const result = await authService.signIn(email, password);
    setLoading(false);
    return result;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    const result = await authService.signUp(email, password, userData);
    setLoading(false);
    return result;
  };

  const signOut = async () => {
    setLoading(true);
    await authService.signOut();
    setUser(null);
    setLoading(false);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

function getDefaultPreferences() {
  return {
    language: 'en' as const,
    voiceSpeed: 1,
    voiceVolume: 1,
    voiceGender: 'female' as const,
    mapTheme: 'light' as const,
    showTrafficLayer: true,
    safetyPreference: 'safest' as const,
    avoidPotholes: true,
    avoidSchoolZones: true,
    avoidMarkets: false,
  };
}