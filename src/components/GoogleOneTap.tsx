import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GooglePromptNotification {
  isNotDisplayed(): boolean;
  getNotDisplayedReason(): string;
  isSkippedMoment(): boolean;
  getSkippedReason(): string;
  isDismissedMoment(): boolean;
  getDismissedReason(): string;
}

const GoogleOneTap: React.FC = () => {
  const { signInWithGoogleOneTap, user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const promptedRef = useRef(false);
  const scriptLoadedRef = useRef(false);

  // Google Identity Services ile giriş işlemi
  const handleCredentialResponse = useCallback(async (response: GoogleCredentialResponse) => {
    try {
      console.log('Google One Tap credential received:', response.select_by);
      
      const { error } = await signInWithGoogleOneTap(response.credential);

      if (error) {
        console.error('Error signing in with Google One Tap:', error);
      } else {
        console.log('Successfully signed in with Google One Tap');
        setIsSignedIn(true);
      }
    } catch (error) {
      console.error('Error in handleCredentialResponse:', error);
    }
  }, [signInWithGoogleOneTap]);

  // Google Identity Services script yükleme
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Script zaten yüklenmiş mi kontrol et
    if (window.google?.accounts?.id) {
      scriptLoadedRef.current = true;
      initializeGoogleIdentityServices();
      return;
    }

    // Google Identity Services script'ini yükle
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    // FedCM geçiş döneminde uyarıları önlemek için data-fedcm-explicit-call kaldırıldı
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      if (window.google?.accounts?.id) {
        initializeGoogleIdentityServices();
      } else {
        console.error("Google Identity Services script loaded but window.google.accounts.id is not available.");
      }
    };
    
    script.onerror = () => {
      console.error("Failed to load Google Identity Services script.");
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

  // Google Identity Services başlatma
  const initializeGoogleIdentityServices = () => {
    if (!window.google?.accounts?.id) return;

    try {
      // FedCM geçiş döneminde uyarıları önlemek için eski sistemi kullan
      // Ağustos 2025'te FedCM zorunlu hale geldiğinde use_fedcm: true yapılacak
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        // FedCM geçiş dönemi - uyarıları önlemek için devre dışı
        auto_select: false,
        cancel_on_tap_outside: true,
        prompt_parent_id: 'google-one-tap-container',
        // Temel ayarlar
        state_cookie_domain: window.location.hostname,
        ux_mode: 'popup',
        context: 'signin',
        itp_support: true,
        // FedCM geçiş dönemi - uyarıları önlemek için devre dışı
        use_fedcm: false, // FedCM API'lerini kullanma, eski sistemi kullan
        // Gelişmiş güvenlik ayarları
        nonce: generateNonce(),
        // Performans optimizasyonları
        prompt_delay: 1000,
        prompt_timeout: 5000,
      });
      
      setIsReady(true);
      console.log('Google Identity Services initialized successfully');
    } catch (error) {
      console.error('Error initializing Google Identity Services:', error);
    }
  };

  // Güvenlik için nonce oluştur
  const generateNonce = (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };

  // Google One Tap prompt'u göster
  useEffect(() => {
    // Kullanıcı giriş yapmamışsa ve sistem hazırsa prompt göster
    if (isReady && !promptedRef.current && scriptLoadedRef.current && !user) {
      promptedRef.current = true;
      
      // Eski sistem için optimize edilmiş bekleme süresi
      setTimeout(() => {
        if (window.google?.accounts?.id) {
          try {
            // Eski sistem prompt çağrısı - FedCM uyarıları olmayacak
            window.google.accounts.id.prompt((notification: GooglePromptNotification) => {
              if (notification.isNotDisplayed()) {
                const reason = notification.getNotDisplayedReason();
                console.log("Google One Tap prompt was not displayed:", reason);
                
                // Eski sistem hata yönetimi
                switch (reason) {
                  case 'opt_out_or_no_session':
                  case 'suppressed_by_user':
                  case 'browser_not_supported':
                  case 'invalid_client':
                    // Bu durumlar normal, tekrar deneme
                    break;
                  default:
                    console.warn("Unexpected not displayed reason:", reason);
                }
              } else if (notification.isSkippedMoment()) {
                const reason = notification.getSkippedReason();
                console.log("Google One Tap prompt was skipped:", reason);
                
                // Eski sistem skip durumları
                switch (reason) {
                  case 'auto_cancel':
                  case 'user_cancel':
                  case 'tap_outside':
                  case 'unknown_reason':
                  case 'credential_returned':
                    // Bu durumlar normal, tekrar deneme
                    break;
                  default:
                    console.warn("Unexpected skip reason:", reason);
                }
              } else if (notification.isDismissedMoment()) {
                const reason = notification.getDismissedReason();
                console.log("Google One Tap prompt was dismissed:", reason);
                
                // Eski sistem dismiss durumları
                switch (reason) {
                  case 'credential_returned':
                    // Başarılı giriş
                    break;
                  case 'cancel_called':
                  case 'tap_outside':
                  case 'user_cancel':
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
      }, 1000); // Eski sistem için optimize edilmiş bekleme süresi
    }
  }, [isReady, user]);

  return (
    <div id="google-one-tap-container" className="fixed top-4 right-4 z-50"></div>
  );
};

export default GoogleOneTap;
