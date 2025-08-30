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
        {/* Apps Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <ShhhhPricingBlock />
          </div>
        </div>
    </>
  );
};

export default AppsPage;
