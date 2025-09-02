import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleOneTap: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const promptedRef = useRef(false);

  const signInWithIdToken = useCallback(async (token: string) => {
    try {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: token,
      });

      if (error) {
        console.error('Error signing in with ID token:', error.message);
      } else {
        console.log('Successfully signed in with Google One Tap');
      }
    } catch (error) {
      console.error('Error in signInWithIdToken:', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogleOneTap();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleOneTap();
      } else {
        console.error("Google GSI script loaded but window.google.accounts.id is not available.");
      }
    };
    script.onerror = () => {
      console.error("Failed to load Google GSI script.");
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, []);

  const initializeGoogleOneTap = () => {
    if (!window.google?.accounts?.id) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: any) => {
        if (response.credential) {
          signInWithIdToken(response.credential);
        }
      },
      use_fedcm_for_prompt: true,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    setIsReady(true);
  };

  useEffect(() => {
    if (isReady && !promptedRef.current) {
      promptedRef.current = true;
      
      // Delay the prompt to ensure everything is ready
      setTimeout(() => {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.prompt((notification: any) => {
            if (notification.isNotDisplayed()) {
              console.log("Google One Tap prompt was not displayed:", notification.getNotDisplayedReason());
            } else if (notification.isSkippedMoment()) {
              console.log("Google One Tap prompt was skipped:", notification.getSkippedReason());
            } else if (notification.isDismissedMoment()) {
              console.log("Google One Tap prompt was dismissed:", notification.getDismissedReason());
            }
          });
        }
      }, 1000);
    }
  }, [isReady]);

  return null; // This component does not render UI
};

export default GoogleOneTap;
