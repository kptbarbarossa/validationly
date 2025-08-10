import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const posts: Record<string, { title: string; description: string; date: string; body: React.ReactNode }> = {
  'saas-fikri-nasil-validate-edilir': {
    title: 'SaaS fikri nasıl valide edilir? (adım adım)',
    description: 'SaaS fikirleri için pratik validasyon yöntemi ve metrikler.',
    date: '2025-08-01',
    body: (
      <>
        <p className="mb-3">Bu yazıda SaaS fikirleri için hızlı validasyon akışını, metrikleri ve örnek adımları paylaşıyoruz.</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Problem → çözüm uyumu ve ICP tanımı</li>
          <li>TAM/SAM/SOM, LTV/CAC, basit fiyat testi</li>
          <li>Platform validasyon kanalları: X, Reddit, Product Hunt</li>
        </ul>
      </>
    ),
  },
  '24-saatte-idea-validation': {
    title: '24 saatte idea validation — mini case study',
    description: 'Gerçek bir fikri 24 saat içinde nasıl test ettik?',
    date: '2025-08-02',
    body: (
      <>
        <p className="mb-3">Kısıtlı sürede iteratif testler: prompt iyileştirme, platformlarda küçük deneyler.</p>
        <ul className="list-disc pl-5 space-y-2 text-slate-300">
          <li>Reddit başlık/gövde A/B</li>
          <li>X’te kanca (hook) + görsel</li>
          <li>LinkedIn’de problem anlatımı</li>
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
        <h1 className="text-2xl font-bold">Yazı bulunamadı</h1>
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


