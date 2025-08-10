import React from 'react';
import SEOHead from '../components/SEOHead';

const faqs = [
  { q: 'Validationly nedir?', a: 'Fikriniz için sosyal platform odaklı, yapay zeka destekli hızlı pazar doğrulaması sağlar.' },
  { q: 'Sonuçlar ne kadar sürede gelir?', a: 'Genellikle 15–30 saniye aralığında tamamlanır.' },
  { q: 'Hangi dilleri destekliyor?', a: 'Girdiğiniz dilde yanıt üretir (Türkçe, İngilizce ve diğer diller).' },
  { q: 'Veriler nasıl kullanılır?', a: 'Yalnızca analiz için kullanılır, kalıcı olarak saklamayız. Gizliliğe önem veriyoruz.' },
  { q: 'Ücretli mi?', a: 'Şu an temel sürüm ücretsiz; gelişmiş özellikler ileride planlanabilir.' },
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
      <SEOHead title="FAQ - Validationly" description="Validationly hakkında sık sorulan sorular ve yanıtları." />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-3xl font-bold mb-6">Sık Sorulan Sorular</h1>
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


