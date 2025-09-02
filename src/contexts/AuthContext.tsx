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
  signInWithGoogleOneTap: (credential: string) => Promise<{ error?: any }>;
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
  if (!user) return null;

  const userMetadata = user.user_metadata || {};
  const appMetadata = user.app_metadata || {};

  // Get user role from database
  let role: 'user' | 'admin' | 'super_admin' = 'user';
  try {
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (userData?.role) {
      role = userData.role;
    }
  } catch (error) {
    console.error('Error fetching user role:', error);
  }

  const isAdmin = role === 'admin' || role === 'super_admin';
  const isSuperAdmin = role === 'super_admin';

  return {
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
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
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
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          try {
            const userInfo = await extractUserInfo(session?.user ?? null);
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
      // Google Identity Services ile çıkış
      if (window.google?.accounts?.id) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Google Identity Services ile giriş (One Tap)
  const signInWithGoogleOneTap = async (credential: string) => {
    try {
      console.log('Signing in with Google One Tap credential');
      
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: credential,
      });
      
      if (error) {
        console.error('Google One Tap sign-in error:', error);
        return { error };
      }
      
      console.log('Successfully signed in with Google One Tap');
      return { error: null };
    } catch (error) {
      console.error('Google One Tap sign-in error:', error);
      return { error };
    }
  };

  // Eski Google OAuth ile giriş (Button için)
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

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signInWithGoogle, 
      signInWithGoogleOneTap,
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