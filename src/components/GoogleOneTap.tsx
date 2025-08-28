import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
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
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // You'll need to replace this
          callback: async (response: any) => {
            if (response.credential) {
              // Handle the credential - you can either:
              // 1. Use it directly with Supabase
              // 2. Pass it to your existing signInWithGoogle function
              if (onSignIn) {
                onSignIn(response.credential);
              } else {
                // Default behavior - trigger Google sign in
                await signInWithGoogle();
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
      } catch (error) {
        console.error('Error initializing Google One Tap:', error);
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

  return (
    <div 
      id="google-one-tap" 
      ref={oneTapRef}
      className="fixed top-4 right-4 z-50"
    />
  );
};

export default GoogleOneTap;
