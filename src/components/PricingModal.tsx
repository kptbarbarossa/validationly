import React, { useState } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: (priceId: string) => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async (priceId: string) => {
    setIsLoading(true);
    try {
      await onUpgrade(priceId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Upgrade to Job Tailor Pro</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-slate-300 mt-2">Unlock unlimited CV optimization and advanced features</p>
        </div>

        {/* Pricing Cards */}
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Free Plan</h3>
                <div className="text-3xl font-bold text-slate-300 mb-4">$0<span className="text-sm font-normal">/month</span></div>
                
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    3 CV rewrites per day
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Basic tones (Formal, Casual, Impact)
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-slate-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Standard processing speed
                  </li>
                </ul>

                <button
                  disabled
                  className="w-full py-3 bg-slate-700 text-slate-400 rounded-lg font-medium cursor-not-allowed"
                >
                  Current Plan
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/20 rounded-xl p-6 border border-indigo-500/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Pro Plan</h3>
                <div className="text-3xl font-bold text-white mb-4">
                  $9.99<span className="text-sm font-normal text-slate-300">/month</span>
                </div>
                
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <strong>Unlimited</strong> CV rewrites
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Advanced tones (Executive, Creative, Technical)
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <strong>Priority</strong> processing (2x faster)
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    PDF export & formatting
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    ATS optimization checker
                  </li>
                  <li className="flex items-center gap-3 text-white">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Job matching insights
                  </li>
                </ul>

                <button
                  onClick={() => handleUpgrade('price_1234567890')} // Replace with actual Stripe price ID
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Upgrade to Pro'}
                </button>
              </div>
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
            <h4 className="text-lg font-semibold text-white mb-4">Why upgrade to Pro?</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h5 className="font-medium text-white mb-1">2x Faster Processing</h5>
                <p className="text-sm text-slate-300">Priority queue for instant results</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🎯</div>
                <h5 className="font-medium text-white mb-1">Advanced AI Tones</h5>
                <p className="text-sm text-slate-300">Executive, creative, and technical styles</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📄</div>
                <h5 className="font-medium text-white mb-1">Professional Export</h5>
                <p className="text-sm text-slate-300">PDF formatting and ATS optimization</p>
              </div>
            </div>
          </div>

          {/* Money Back Guarantee */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              💰 <strong>30-day money-back guarantee</strong> • Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;