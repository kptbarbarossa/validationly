import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase'; // Direct import for simplicity

declare global {
  interface Window {
    google: any;
  }
}

const GoogleOneTap: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const promptedRef = useRef(false);

  const signInWithIdToken = useCallback(async (token: string) => {
    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: token,
    });

    if (error) {
      console.error('Error signing in with ID token:', error.message);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response: any) => {
            if (response.credential) {
              signInWithIdToken(response.credential);
            }
          },
          use_fedcm_for_prompt: true,
        });
        setIsReady(true);
      } else {
        console.error("Google GSI script loaded but window.google is not available.");
      }
    };
    script.onerror = () => {
      console.error("Failed to load Google GSI script.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [signInWithIdToken]);

  useEffect(() => {
    if (isReady && !promptedRef.current) {
      promptedRef.current = true;
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
  }, [isReady]);

  return null; // This component does not render UI
};

export default GoogleOneTap;
