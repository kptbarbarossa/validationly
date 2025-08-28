import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const AppsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Apps | Validationly"
        description="Discover powerful apps and tools for startup validation"
        keywords="startup apps, validation tools, business apps"
      />

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Apps
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Discover powerful applications to accelerate your startup journey
            </p>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 max-w-2xl mx-auto gap-8">
            
            {/* Login to See Price App */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Login to See Price</h3>
                  <p className="text-slate-400 text-sm">Shopify B2B & Wholesale</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Hide product prices from guests to boost customer registrations. Perfect for B2B, wholesale, and membership stores.
              </p>
              
              <a
                href="https://apps.shopify.com/shhhh-pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105 text-center block"
              >
                Get App →
              </a>
            </div>


          </div>
        </div>
      </div>
    </>
  );
};

export default AppsPage;
