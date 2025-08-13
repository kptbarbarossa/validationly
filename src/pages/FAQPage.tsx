import React from 'react';
import SEOHead from '../components/SEOHead';

const faqs = [
  { q: 'Do you store the information I enter?', a: 'No. No information you enter is stored. Inputs are processed transiently to generate results and then discarded.' },
  { q: 'What is Validationly?', a: 'It provides fast, AI‑assisted market validation for your idea via social platforms.' },
  { q: 'How fast are the results?', a: 'Typically within 15–30 seconds.' },
  { q: 'Which languages are supported?', a: 'We mirror your input language for outputs (Turkish, English, and others).' },
  { q: 'How is my data used?', a: 'No information entered is stored. Inputs are used only for analysis and then discarded. We care about privacy.' },
  { q: 'Is it paid?', a: 'The core version is free for now; advanced features may arrive later.' },
];

const FAQPage: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="container mx-auto px-4 py-10 text-slate-100">
      <SEOHead title="FAQ - Validationly" description="Frequently asked questions about Validationly." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((f, i) => (
          <details key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
            <summary className="cursor-pointer font-semibold text-white">{f.q}</summary>
            <p className="mt-2 text-slate-300">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;


