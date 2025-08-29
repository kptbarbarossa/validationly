import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleOneTapProps {
  onSignIn?: (credential: string) => void;
}

const GoogleOneTap: React.FC<GoogleOneTapProps> = ({ onSignIn }) => {
  const { signInWithGoogle } = useAuth();
  const oneTapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if Google Client ID is configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
      setError('Google Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.');
      setIsLoading(false);
      return;
    }

    // Wait for Google Identity Services to load
    const initializeGoogleOneTap = () => {
      if (!window.google?.accounts?.id) {
        // Retry after a short delay if Google script hasn't loaded yet
        setTimeout(initializeGoogleOneTap, 100);
        return;
      }

      try {
        // Initialize Google One Tap
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              try {
                // Handle the credential - you can either:
                // 1. Use it directly with Supabase
                // 2. Pass it to your existing signInWithGoogle function
                if (onSignIn) {
                  onSignIn(response.credential);
                } else {
                  // Default behavior - trigger Google sign in
                  await signInWithGoogle();
                }
              } catch (signInError) {
                console.error('Sign in error:', signInError);
                setError('Failed to sign in with Google. Please try again.');
              }
            }
          },
          auto_select: false, // Don't auto-select if user has multiple accounts
          cancel_on_tap_outside: true, // Cancel if user clicks outside
          prompt_parent_id: oneTapRef.current?.id || 'google-one-tap',
        });

        // Show the One Tap prompt
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap is not displayed or skipped - this is normal
            console.log('Google One Tap not displayed:', notification.getNotDisplayedReason());
          }
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
        setError('Failed to initialize Google One Tap. Please refresh the page and try again.');
        setIsLoading(false);
      }
    };

    // Start initialization
    initializeGoogleOneTap();

    // Cleanup function
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [signInWithGoogle, onSignIn]);

  if (error) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <div className="flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
        <button 
          onClick={() => setError(null)} 
          className="text-red-500 hover:text-red-700 text-xs mt-1"
        >
          Dismiss
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm">Loading Google Sign-In...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="google-one-tap" 
      ref={oneTapRef}
      className="fixed top-4 right-4 z-50"
    />
  );
};

export default GoogleOneTap;
