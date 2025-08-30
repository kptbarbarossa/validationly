import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import ShhhhPricingBlock from '../components/ShhhhPricingBlock';

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
          <div className="max-w-4xl mx-auto">
            <ShhhhPricingBlock />
          </div>
        </div>
      </div>
    </>
  );
};

export default AppsPage;
