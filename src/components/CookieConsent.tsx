import React, { useState, useEffect } from 'react';

interface CookieConsentProps {
  onAccept: (analytics: boolean) => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onAccept }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = (analytics: boolean) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      analytics,
      timestamp: new Date().toISOString()
    }));
    
    setIsVisible(false);
    onAccept(analytics);
  };

  const handleReject = () => {
    handleAccept(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          {/* Cookie Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🍪</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-2">
              Cookie Preferences
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              We use minimal cookies to improve your experience. We only collect essential data for our service to function properly. 
              <strong className="text-white"> No personal data is stored or shared.</strong>
            </p>
            
            {/* Cookie Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-300">
                  <strong className="text-white">Essential:</strong> Required for basic functionality (always active)
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-slate-300">
                  <strong className="text-white">Analytics:</strong> Anonymous usage statistics to improve our service
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              By using our service, you agree to our{' '}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                Privacy Policy
              </a>{' '}
              and{' '}
              <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
                Terms of Service
              </a>
              .
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={() => handleAccept(true)}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
