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
      <SEOHead title="E-commerce Product Validation - Use Case" description="E-ticaret ürünleri için hızlı pazar doğrulaması ve kanal stratejisi." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1 className="text-3xl font-bold mb-4">E-commerce Product Validation</h1>
      <p className="text-slate-300 mb-4">Hedef kitle, görsel kanallar ve fiyatlama için hızlı test.</p>
      <ul className="list-disc pl-5 space-y-2 text-slate-300 mb-6">
        <li>Instagram/Pinterest ile hızlı ilgi testi</li>
        <li>Ürün-müşteri uyumu ve fiyat aralığı</li>
        <li>Etsy/Shopify topluluklarıyla erken sinyal</li>
      </ul>
      <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20">Hemen dene</Link>
    </div>
  );
};

export default UseCaseEcommercePage;


