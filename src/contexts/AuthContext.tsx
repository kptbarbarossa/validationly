import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthUser } from '../types';

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: any }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error?: any }>;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  hasPermission: (permission: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to extract user info from Supabase user
const extractUserInfo = async (user: User | null): Promise<AuthUser | null> => {
  console.log('🔍 extractUserInfo called with user:', user);
  
  if (!user) {
    console.log('❌ extractUserInfo: user is null');
    return null;
  }

  try {
    const userMetadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};

    console.log('📋 extractUserInfo: userMetadata:', userMetadata);
    console.log('📋 extractUserInfo: appMetadata:', appMetadata);

    // Skip database role check for now - use default role
    let role: 'user' | 'admin' | 'super_admin' = 'user';
    console.log('✅ extractUserInfo: Using default role:', role);

    const isAdmin = role === 'admin' || role === 'super_admin';
    const isSuperAdmin = role === 'super_admin';

    const userInfo = {
      id: user.id,
      email: user.email || '',
      displayName: userMetadata.full_name || userMetadata.name || user.user_metadata?.user_name || '',
      photoURL: userMetadata.avatar_url || userMetadata.picture || user.user_metadata?.avatar_url || '',
      fullName: userMetadata.full_name || userMetadata.name || '',
      avatarUrl: userMetadata.avatar_url || userMetadata.picture || '',
      role,
      isAdmin,
      isSuperAdmin,
    };

    console.log('✅ extractUserInfo: Returning userInfo:', userInfo);
    return userInfo;
  } catch (error) {
    console.error('❌ extractUserInfo: Unexpected error:', error);
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        // URL'de code parametresi var mı kontrol et (Google OAuth callback)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
          console.log('Google OAuth callback detected, code:', code);
          
          // URL'den code parametresini hemen temizle
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
          
          // Code'u session'a çevir
          try {
            console.log('Attempting to exchange code for session...');
            const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              console.error('Error exchanging code for session:', error);
            } else {
              console.log('Successfully exchanged code for session:', session);
            }
            
            if (mounted) {
              const userInfo = await extractUserInfo(session?.user ?? null);
              console.log('Extracted user info:', userInfo);
              setSession(session);
              setUser(userInfo);
              setLoading(false);
            }
          } catch (exchangeError) {
            console.error('Error in exchangeCodeForSession:', exchangeError);
            // Fallback: normal session kontrolü
            console.log('Trying fallback getSession...');
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
              console.error('Error getting session after OAuth:', error);
            } else {
              console.log('Fallback session:', session);
            }
            
            if (mounted) {
              const userInfo = await extractUserInfo(session?.user ?? null);
              console.log('Fallback user info:', userInfo);
              setSession(session);
              setUser(userInfo);
              setLoading(false);
            }
          }
        } else {
          // Normal session kontrolü
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.error('Error getting initial session:', error);
          }
          if (mounted) {
            const userInfo = await extractUserInfo(session?.user ?? null);
            setSession(session);
            setUser(userInfo);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        if (mounted) {
          try {
            const userInfo = await extractUserInfo(session?.user ?? null);
            console.log('Auth state change - user info:', userInfo);
            setSession(session);
            setUser(userInfo);
            setLoading(false);
          } catch (error) {
            console.error('Error updating auth state:', error);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Google OAuth ile giriş
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { error };
    }
  };

  const isAdmin = (): boolean => {
    return user?.isAdmin || false;
  };

  const isSuperAdmin = (): boolean => {
    return user?.isSuperAdmin || false;
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!user) return false;
    
    // Super admins have all permissions
    if (user.isSuperAdmin) return true;
    
    try {
      const { data } = await supabase.rpc('has_permission', {
        permission_name: permission,
        user_id: user.id
      });
      
      return !!data;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  console.log('AuthContext rendering with user:', user);
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signInWithGoogle, 
      signOut, 
      signIn, 
      signUp,
      isAdmin,
      isSuperAdmin,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};