import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const UseCasesIndexPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 text-slate-100">
      <SEOHead title="Use Cases - Validationly" description="Idea validation use cases: start with SaaS and E‑commerce." />
      <h1 className="text-3xl font-bold mb-6">Use Cases</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/use-cases/saas-idea-validation" className="block bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20">
          <h2 className="text-xl font-semibold text-white mb-2">SaaS Idea Validation</h2>
          <p className="text-slate-300 text-sm">Fast market validation for SaaS ideas, metrics, and channel strategy.</p>
        </Link>
        <Link to="/use-cases/ecommerce-product-validation" className="block bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20">
          <h2 className="text-xl font-semibold text-white mb-2">E‑commerce Product Validation</h2>
          <p className="text-slate-300 text-sm">Product‑market fit and rapid testing via visual channels.</p>
        </Link>
      </div>
    </div>
  );
};

export default UseCasesIndexPage;


