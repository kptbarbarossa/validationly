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
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if Google Client ID is configured
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
      console.log('Google Client ID not configured, skipping One Tap');
      setIsLoading(false);
      return;
    }

    let retryCount = 0;
    const maxRetries = 10;

    // Wait for Google Identity Services to load
    const initializeGoogleOneTap = () => {
      if (!window.google?.accounts?.id) {
        retryCount++;
        if (retryCount < maxRetries) {
          // Retry after a short delay if Google script hasn't loaded yet
          setTimeout(initializeGoogleOneTap, 200);
        } else {
          console.log('Google Identity Services failed to load after retries');
          setIsLoading(false);
        }
        return;
      }

      try {
        // Initialize Google One Tap with modern FedCM settings
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            if (response.credential) {
              try {
                if (onSignIn) {
                  onSignIn(response.credential);
                } else {
                  await signInWithGoogle();
                }
              } catch (signInError) {
                console.error('Sign in error:', signInError);
                setError('Failed to sign in with Google. Please try again.');
              }
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          prompt_parent_id: oneTapRef.current?.id || 'google-one-tap',
          // Modern FedCM settings
          use_fedcm_for_prompt: true,
          context: 'signin',
          itp_support: true,
          state_cookie_domain: window.location.hostname,
        });

        // Show the One Tap prompt with silent error handling
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed()) {
            const reason = notification.getNotDisplayedReason();
            // Only log in development
            if (process.env.NODE_ENV === 'development') {
              console.log('Google One Tap not displayed:', reason);
            }
            
            // Handle FedCM-related reasons silently
            if (reason === 'fedcm_opted_out' || reason === 'fedcm_disabled' || reason === 'browser_not_supported') {
              // These are expected behaviors, don't show errors
              return;
            }
          } else if (notification.isSkippedMoment()) {
            const reason = notification.getSkippedReason();
            if (process.env.NODE_ENV === 'development') {
              console.log('Google One Tap skipped:', reason);
            }
          } else if (notification.isDismissedMoment()) {
            const reason = notification.getDismissedReason();
            if (process.env.NODE_ENV === 'development') {
              console.log('Google One Tap dismissed:', reason);
            }
          }
        });

        setIsInitialized(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
        setIsLoading(false);
      }
    };

    // Start initialization
    initializeGoogleOneTap();

    // Cleanup function
    return () => {
      if (window.google?.accounts?.id && isInitialized) {
        try {
          window.google.accounts.id.cancel();
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    };
  }, [signInWithGoogle, onSignIn, isInitialized]);

  // Temporarily disable Google One Tap due to FedCM issues
  return null;

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
