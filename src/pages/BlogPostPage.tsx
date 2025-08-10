import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const posts: Record<string, { title: string; description: string; date: string; body: React.ReactNode }> = {
  'saas-fikri-nasil-validate-edilir': {
    title: 'How to validate a SaaS idea (step by step)',
    description: 'A practical validation workflow and metrics for SaaS.',
    date: '2025-08-01',
    body: (
      <>
        <p className="mb-3">In this post, we share a fast validation flow for SaaS ideas, key metrics, and example steps.</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Problem → solution fit and ICP definition</li>
          <li>TAM/SAM/SOM, LTV/CAC, simple price test</li>
          <li>Platform validation channels: X, Reddit, Product Hunt</li>
        </ul>
      </>
    ),
  },
  '24-saatte-idea-validation': {
    title: 'Idea validation in 24 hours — mini case study',
    description: 'How we tested a real idea in 24 hours.',
    date: '2025-08-02',
    body: (
      <>
        <p className="mb-3">Iterative tests in a tight timeframe: prompt refinement and small experiments across platforms.</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Reddit title/body A/B</li>
          <li>Hook + visual on X</li>
          <li>Problem narrative on LinkedIn</li>
        </ul>
      </>
    ),
  },
};

const BlogPostPage: React.FC = () => {
  const { slug } = useParams();
  const post = useMemo(() => (slug ? posts[slug] : undefined), [slug]);

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-10 text-slate-100">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    description: post.description,
    author: { '@type': 'Organization', name: 'Validationly' },
  };

  return (
    <div className="container mx-auto px-4 py-10 text-slate-100">
      <SEOHead title={`${post.title} - Blog - Validationly`} description={post.description} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="text-xs text-slate-400 mb-2">{post.date}</div>
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="prose prose-invert max-w-none">
        {post.body}
      </div>
    </div>
  );
};

export default BlogPostPage;


