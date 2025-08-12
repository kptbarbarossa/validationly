import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const posts = [
  { slug: 'saas-idea-validation-guide', title: 'SaaS Idea Validation: A Step‑by‑Step Guide', desc: 'Fast market signals, ICP, hypothesis → experiment.', date: '2025-08-03' },
  { slug: 'validate-idea-in-24-hours', title: 'Validate an Idea in 24 Hours: Workflow and Metrics', desc: 'A 1‑day practical process with measurable KPIs.', date: '2025-08-03' },
  { slug: 'read-demand-signals-social-platforms', title: 'Reading Demand Signals on X, Reddit, and LinkedIn', desc: 'How to read platform‑specific signals with examples.', date: '2025-08-03' },
  { slug: 'gtm-first-90-days', title: 'Go‑to‑Market Playbook: First 90 Days (B2B/B2C)', desc: 'Channels, messaging, experiment matrix, KPIs.', date: '2025-08-03' },
  { slug: 'product-market-fit-metrics', title: 'Product‑Market Fit: Measurable Indicators That Matter', desc: 'PMF surveys, retention proxies, NPS/WAU/MAU.', date: '2025-08-03' },
  { slug: 'micro-landing-validation', title: 'Validation with a Micro‑Landing Page + Form', desc: 'One‑pager offer hierarchy and A/B messaging.', date: '2025-08-03' },
  { slug: 'pricing-validation-fast-tests', title: 'Pricing Validation: Fast, Value‑Based Tests', desc: 'Van Westendorp quick guide, light surveys, paywalls.', date: '2025-08-03' },
  { slug: 'two-week-content-sprint', title: 'Content‑Led Validation: A 2‑Week Content Sprint', desc: 'Topic clusters, intent mapping, CTA‑driven articles.', date: '2025-08-03' },
  { slug: 'b2b-discovery-templates', title: 'B2B Pre‑Sales Validation: Discovery Call Templates', desc: 'Discovery question sets, note templates, signal reading.', date: '2025-08-03' },
  { slug: 'nocode-validation-without-mvp', title: 'No‑Code Validation Without an MVP', desc: 'No‑code tool stacks and demo flows to test demand.', date: '2025-08-03' },
  { slug: '60-minute-competitor-analysis', title: '60‑Minute Competitor Analysis Framework', desc: 'Alternatives matrix and a positioning sentence.', date: '2025-08-03' },
  { slug: 'community-first-users', title: 'First Users with Zero Budget: Community Strategies', desc: 'Niche community mapping and value‑add posting playbook.', date: '2025-08-03' },
];

const BlogIndexPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 text-slate-100">
      <SEOHead
        title="Blog - Validationly | Startup Idea Validation, Go-to-Market, Prompting"
        description="Actionable articles on startup idea validation, demand testing, go-to-market strategies, platform signal analysis (X/Reddit/LinkedIn), and AI prompting patterns."
        keywords="startup blog, idea validation blog, go-to-market strategy, product-market-fit, demand testing, platform signals, AI prompting, growth loops"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'Validationly Blog',
        url: 'https://validationly.com/blog',
        description: 'Articles on startup validation, demand testing, and GTM.',
        inLanguage: 'en'
      }) }} />
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(p => (
          <Link to={`/blog/${p.slug}`} key={p.slug} className="block bg-white/5 border border-white/10 rounded-xl p-5 hover:border-white/20">
            <div className="text-xs text-slate-400 mb-1">{p.date}</div>
            <h2 className="text-xl font-semibold text-white mb-2">{p.title}</h2>
            <p className="text-slate-300 text-sm">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BlogIndexPage;


