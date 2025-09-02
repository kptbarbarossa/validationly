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
  const scriptLoadedRef = useRef(false);

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
      scriptLoadedRef.current = true;
      initializeGoogleOneTap();
      return;
    }

    // Load Google GSI script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
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

    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            signInWithIdToken(response.credential);
          }
        },
        // FedCM uyarısını önlemek için modern ayarlar
        use_fedcm_for_prompt: true,
        auto_select: false,
        cancel_on_tap_outside: true,
        prompt_parent_id: 'google-one-tap-container',
        // FedCM için gerekli ayarlar
        fedcm_mode: 'enabled',
        // Daha iyi hata yönetimi
        state_cookie_domain: window.location.hostname,
        ux_mode: 'popup',
      });
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Google One Tap:', error);
    }
  };

  useEffect(() => {
    if (isReady && !promptedRef.current && scriptLoadedRef.current) {
      promptedRef.current = true;
      
      // Delay the prompt to ensure everything is ready
      setTimeout(() => {
        if (window.google?.accounts?.id) {
          try {
            // FedCM uyumlu prompt çağrısı
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed()) {
                const reason = notification.getNotDisplayedReason();
                console.log("Google One Tap prompt was not displayed:", reason);
                // FedCM ile ilgili durumları kontrol et
                if (reason === 'opt_out_or_no_session' || 
                    reason === 'suppressed_by_user' || 
                    reason === 'fedcm_disabled') {
                  return;
                }
              } else if (notification.isSkippedMoment()) {
                const reason = notification.getSkippedReason();
                console.log("Google One Tap prompt was skipped:", reason);
                // FedCM ile ilgili skip durumları
                if (reason === 'fedcm_disabled' || reason === 'unknown_reason') {
                  return;
                }
              } else if (notification.isDismissedMoment()) {
                const reason = notification.getDismissedReason();
                console.log("Google One Tap prompt was dismissed:", reason);
              }
            });
          } catch (error) {
            console.error('Error prompting Google One Tap:', error);
          }
        }
      }, 2000); // FedCM için daha uzun bekleme süresi
    }
  }, [isReady]);

  return (
    <div id="google-one-tap-container" className="fixed top-4 right-4 z-50"></div>
  );
};

export default GoogleOneTap;
