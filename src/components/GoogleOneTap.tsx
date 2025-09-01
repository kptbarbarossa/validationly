import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

const GoogleOneTap: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const promptedRef = useRef(false);

  const handleGoogleSignIn = useCallback(async () => {
    if (!isReady || promptedRef.current) return;
    promptedRef.current = true;

    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('FedCM Sign-In Error:', error.message);
        // Handle specific errors like "declined" or "closed" if needed
        if (error.message.includes('declined') || error.message.includes('closed')) {
          // User intentionally closed the prompt, maybe show a button to try again
        }
      }
    } catch (e: any) {
      console.error('Unexpected FedCM Error:', e.message);
    }
  }, [isReady, signInWithGoogle]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            // This callback handles the credential response
            // We are using FedCM, so this might not be the primary flow
            console.log('Google One Tap callback received:', response);
          },
          use_fedcm_for_prompt: true,
        });
        setIsReady(true);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      handleGoogleSignIn();
    }
  }, [isReady, handleGoogleSignIn]);

  // This component does not render anything itself
  // It triggers the Google One Tap prompt programmatically
  return null;
};

export default GoogleOneTap;
