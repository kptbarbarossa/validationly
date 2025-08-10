import React from 'react';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

const UseCaseEcommercePage: React.FC = () => {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Use Cases', item: 'https://validationly.com/use-cases' },
      { '@type': 'ListItem', position: 2, name: 'E-commerce Product Validation', item: 'https://validationly.com/use-cases/ecommerce-product-validation' },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-10 text-slate-100">
      <SEOHead title="E-commerce Product Validation - Use Case" description="Fast market validation and channel strategy for e‑commerce products." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1 className="text-3xl font-bold mb-4">E-commerce Product Validation</h1>
      <p className="text-slate-300 mb-4">Fast testing for target audience, visual channels, and pricing.</p>
      <ul className="list-disc pl-5 space-y-2 text-slate-300 mb-6">
        <li>Rapid interest test via Instagram/Pinterest</li>
        <li>Product‑customer fit and price band</li>
        <li>Early signals via Etsy/Shopify communities</li>
      </ul>
      <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20">Try now</Link>
    </div>
  );
};

export default UseCaseEcommercePage;


