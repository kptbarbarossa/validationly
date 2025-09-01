import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { AuthUser } from '../../types/types';

const AUTH_STORAGE_KEY = 'validationly-auth-state';

interface AuthState {
  user: AuthUser | null;
  session: Session | null;
}

const saveAuthState = (state: AuthState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
  }
};

const loadAuthState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const storedState = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedState) {
      try {
        return JSON.parse(storedState);
      } catch (e) {
        console.error("Failed to parse auth state from localStorage", e);
        return { user: null, session: null };
      }
    }
  }
  return { user: null, session: null };
};

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
  if (!user) return null;

  // Extract Google profile info from user metadata
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
    displayName: userMetadata.full_name || userMetadata.name || user.user_metadata?.user_name,
    photoURL: userMetadata.avatar_url || userMetadata.picture || user.user_metadata?.avatar_url,
    fullName: userMetadata.full_name || userMetadata.name,
    avatarUrl: userMetadata.avatar_url || userMetadata.picture,
    role,
    isAdmin,
    isSuperAdmin,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saveAuthState(authState);
  }, [authState]);

  useEffect(() => {
    let mounted = true;

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        }
        if (mounted) {
          const user = await extractUserInfo(session?.user ?? null);
          setAuthState({ session, user });
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
            const user = await extractUserInfo(session?.user ?? null);
            setAuthState({ session, user });
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
    await supabase.auth.signOut();
    setAuthState({ user: null, session: null });
  };

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
          // FedCM compatibility
          skipBrowserRedirect: false,
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
    return authState.user?.isAdmin || false;
  };

  const isSuperAdmin = (): boolean => {
    return authState.user?.isSuperAdmin || false;
  };

  const hasPermission = async (permission: string): Promise<boolean> => {
    if (!authState.user) return false;
    
    // Super admins have all permissions
    if (authState.user.isSuperAdmin) return true;
    
    try {
      const { data } = await supabase.rpc('has_permission', {
        permission_name: permission,
        user_id: authState.user.id
      });
      
      return !!data;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  // Debug helper to check auth state
  const debugAuthState = () => {
    console.log('Current Auth State:', {
      user: authState.user,
      session: authState.session ? 'Active' : 'None',
      loading,
      localStorage: typeof window !== 'undefined' ? localStorage.getItem(AUTH_STORAGE_KEY) : 'N/A'
    });
  };

  // Expose debug function in development
  if (process.env.NODE_ENV === 'development') {
    (window as any).debugAuth = debugAuthState;
  }

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
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