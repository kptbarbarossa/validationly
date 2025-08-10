import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../components/SEOHead';

const posts = [
  { slug: 'saas-fikri-nasil-validate-edilir', title: 'SaaS fikri nasıl valide edilir? (adım adım)', desc: 'SaaS fikirleri için pratik validasyon yöntemi ve metrikler.', date: '2025-08-01' },
  { slug: '24-saatte-idea-validation', title: '24 saatte idea validation — mini case study', desc: 'Gerçek bir fikri 24 saat içinde nasıl test ettik?', date: '2025-08-02' },
];

const BlogIndexPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 text-slate-100">
      <SEOHead title="Blog - Validationly" description="Validation, growth ve prompt ipuçları." />
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


