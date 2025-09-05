import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics tracking function
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

const Analytics: React.FC = () => {
  const location = useLocation();
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  useEffect(() => {
    // Only track if GA ID is provided and gtag is available
    if (GA_MEASUREMENT_ID && window.gtag) {
      // Track page views on route changes
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
        send_page_view: true // Now we can send page views since user consented
      });
    }
  }, [location, GA_MEASUREMENT_ID]);

  return null; // This component doesn't render anything
};

// Custom hook for tracking events
export const useAnalytics = () => {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (GA_MEASUREMENT_ID && window.gtag) {
      window.gtag('event', eventName, {
        event_category: 'engagement',
        event_label: parameters?.label || '',
        value: parameters?.value || 0,
        ...parameters
      });
    }
  };

  const trackValidation = (idea: string, score: number) => {
    trackEvent('idea_validation', {
      event_category: 'validation',
      event_label: 'idea_submitted',
      value: score,
      custom_parameters: {
        idea_length_range: idea.length < 50 ? 'short' : idea.length < 100 ? 'medium' : 'long',
        score_range: score < 30 ? 'low' : score < 70 ? 'medium' : 'high'
      }
    });
  };

  const trackSocialShare = (platform: string, _content: string) => {
    trackEvent('social_share', {
      event_category: 'social',
      event_label: platform,
      custom_parameters: {
        platform: platform,
        content_type: 'suggestion'
      }
    });
  };

  return {
    trackEvent,
    trackValidation,
    trackSocialShare
  };
};

export default Analytics;