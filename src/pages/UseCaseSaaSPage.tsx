import React from 'react';
import SEOHead from '../components/SEOHead';
import { Link } from 'react-router-dom';

const UseCaseSaaSPage: React.FC = () => {
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Use Cases', item: 'https://validationly.com/use-cases' },
      { '@type': 'ListItem', position: 2, name: 'SaaS Idea Validation', item: 'https://validationly.com/use-cases/saas-idea-validation' },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-10 text-slate-100">
      <SEOHead title="SaaS Idea Validation - Use Case" description="SaaS fikirleri için hızlı pazar doğrulaması ve platform stratejisi." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <h1 className="text-3xl font-bold mb-4">SaaS Idea Validation</h1>
      <p className="text-slate-300 mb-4">Problem → çözüm uyumu, ICP, fiyat ve kanallar için hızlı validasyon.</p>
      <ul className="list-disc pl-5 space-y-2 text-slate-300 mb-6">
        <li>Sayısal pazar göstergeleri (TAM/SAM/SOM)</li>
        <li>Rakip/alternatif haritası</li>
        <li>Platform odaklı validasyon: X, Reddit, Product Hunt</li>
      </ul>
      <Link to="/" className="inline-block px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20">Hemen dene</Link>
    </div>
  );
};

export default UseCaseSaaSPage;


