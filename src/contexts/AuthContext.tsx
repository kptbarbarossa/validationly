import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  fullName?: string;
  avatarUrl?: string;
  role?: 'user' | 'admin' | 'super_admin';
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
}

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

// Helper function to save auth state to localStorage
const saveAuthState = (user: AuthUser | null) => {
  if (typeof window !== 'undefined') {
    try {
      if (user) {
        localStorage.setItem('validationly-user', JSON.stringify(user));
      } else {
        localStorage.removeItem('validationly-user');
      }
    } catch (error) {
      console.error('Error saving auth state to localStorage:', error);
    }
  }
};

// Helper function to load auth state from localStorage
const loadAuthState = (): AuthUser | null => {
  if (typeof window !== 'undefined') {
    try {
      const savedUser = localStorage.getItem('validationly-user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error('Error loading auth state from localStorage:', error);
      return null;
    }
  }
  return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => loadAuthState());
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Save user state to localStorage whenever it changes
  useEffect(() => {
    saveAuthState(user);
  }, [user]);

  useEffect(() => {
    let mounted = true;

    // Get initial session with better error handling
    const initializeAuth = async () => {
      try {
        // Check if we're in browser environment
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }

        // First try to get session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        }

        if (mounted) {
          if (session?.user) {
            // We have a valid session
            setSession(session);
            const userInfo = await extractUserInfo(session.user);
            setUser(userInfo);
            saveAuthState(userInfo);
          } else {
            // No session, but check if we have cached user data
            const cachedUser = loadAuthState();
            if (cachedUser) {
              setUser(cachedUser);
              // Try to refresh the session
              const { data: { session: refreshedSession } } = await supabase.auth.refreshSession();
              if (refreshedSession) {
                setSession(refreshedSession);
              }
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes with better error handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (mounted) {
        try {
          setSession(session);
          const userInfo = await extractUserInfo(session?.user ?? null);
          setUser(userInfo);
          saveAuthState(userInfo);
        } catch (error) {
          console.error('Error processing auth state change:', error);
        } finally {
          setLoading(false);
        }
      }
    });

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
    saveAuthState(null);
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
      
      return data || false;
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  };

  // Debug helper to check auth state
  const debugAuthState = () => {
    console.log('Current Auth State:', {
      user,
      session: session ? 'Active' : 'None',
      loading,
      localStorage: typeof window !== 'undefined' ? localStorage.getItem('validationly-user') : 'N/A'
    });
  };

  // Expose debug function in development
  if (process.env.NODE_ENV === 'development') {
    (window as any).debugAuth = debugAuthState;
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isAdmin,
    isSuperAdmin,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};