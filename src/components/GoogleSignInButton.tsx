import React, { useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';

declare global {
  interface Window {
    google: any;
  }
}

interface GoogleSignInButtonProps {
  className?: string;
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  size?: 'large' | 'medium' | 'small';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  shape?: 'rectangular' | 'rounded' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  className = '',
  text = 'signin_with',
  size = 'large',
  theme = 'outline',
  shape = 'rectangular',
  logo_alignment = 'left',
  width = 240,
  locale = 'tr'
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !buttonRef.current) return;

    // Google Identity Services script yükleme kontrolü
    if (!window.google?.accounts?.id) {
      console.error('Google Identity Services not loaded');
      return;
    }

    try {
      // Google Sign-In Button'u render et
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: theme,
        size: size,
        text: text,
        shape: shape,
        logo_alignment: logo_alignment,
        width: width,
        locale: locale,
        click_listener: handleSignInClick,
      });
    } catch (error) {
      console.error('Error rendering Google Sign-In Button:', error);
    }
  }, [text, size, theme, shape, logo_alignment, width, locale]);

  const handleSignInClick = async () => {
    try {
      console.log('Google Sign-In Button clicked');
      // Button tıklandığında One Tap'i de tetikle
      if (window.google?.accounts?.id) {
        window.google.accounts.id.prompt();
      }
    } catch (error) {
      console.error('Error in Google Sign-In Button click:', error);
    }
  };

  return (
    <div 
      ref={buttonRef} 
      className={`google-signin-button ${className}`}
      data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    />
  );
};

export default GoogleSignInButton;
