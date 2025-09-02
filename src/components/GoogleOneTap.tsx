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
      // Google'ın resmi FedCM dokümantasyonuna göre yapılandırma
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: (response: any) => {
          if (response.credential) {
            signInWithIdToken(response.credential);
          }
        },
        // FedCM geçiş dönemi ayarları
        use_fedcm: true, // FedCM API'lerini kullan
        auto_select: false,
        cancel_on_tap_outside: true,
        prompt_parent_id: 'google-one-tap-container',
        // FedCM için gerekli ayarlar
        state_cookie_domain: window.location.hostname,
        ux_mode: 'popup',
        // Geçiş dönemi için ek ayarlar
        context: 'signin',
        itp_support: true,
      });
      setIsReady(true);
    } catch (error) {
      console.error('Error initializing Google One Tap:', error);
    }
  };

  useEffect(() => {
    if (isReady && !promptedRef.current && scriptLoadedRef.current) {
      promptedRef.current = true;
      
      // FedCM için optimize edilmiş bekleme süresi
      setTimeout(() => {
        if (window.google?.accounts?.id) {
          try {
            // FedCM uyumlu prompt çağrısı
            window.google.accounts.id.prompt((notification: any) => {
              if (notification.isNotDisplayed()) {
                const reason = notification.getNotDisplayedReason();
                console.log("Google One Tap prompt was not displayed:", reason);
                
                // FedCM geçiş dönemi hata yönetimi
                switch (reason) {
                  case 'opt_out_or_no_session':
                  case 'suppressed_by_user':
                  case 'fedcm_disabled':
                  case 'browser_not_supported':
                    // Bu durumlar normal, tekrar deneme
                    break;
                  default:
                    console.warn("Unexpected not displayed reason:", reason);
                }
              } else if (notification.isSkippedMoment()) {
                const reason = notification.getSkippedReason();
                console.log("Google One Tap prompt was skipped:", reason);
                
                // FedCM geçiş dönemi skip durumları
                switch (reason) {
                  case 'auto_cancel':
                  case 'user_cancel':
                  case 'tap_outside':
                  case 'fedcm_disabled':
                  case 'unknown_reason':
                    // Bu durumlar normal, tekrar deneme
                    break;
                  default:
                    console.warn("Unexpected skip reason:", reason);
                }
              } else if (notification.isDismissedMoment()) {
                const reason = notification.getDismissedReason();
                console.log("Google One Tap prompt was dismissed:", reason);
                
                // FedCM geçiş dönemi dismiss durumları
                switch (reason) {
                  case 'credential_returned':
                    // Başarılı giriş
                    break;
                  case 'cancel_called':
                  case 'tap_outside':
                    // Kullanıcı iptal etti
                    break;
                  default:
                    console.warn("Unexpected dismiss reason:", reason);
                }
              }
            });
          } catch (error) {
            console.error('Error prompting Google One Tap:', error);
          }
        }
      }, 1500); // FedCM için optimize edilmiş bekleme süresi
    }
  }, [isReady]);

  return (
    <div id="google-one-tap-container" className="fixed top-4 right-4 z-50"></div>
  );
};

export default GoogleOneTap;
