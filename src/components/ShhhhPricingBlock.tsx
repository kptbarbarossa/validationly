import React, { useEffect } from 'react';

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What does Shhhh Pricing do?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'It hides product prices and the Add to Cart action for visitors who are not logged in, encouraging them to create an account. This helps increase signups and grow your email list.'
      }
    },
    {
      '@type': 'Question',
      name: 'Who is it for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Stores with B2B pricing requirements, wholesale/exclusive access shops, and any brand that wants to grow their email list organically by requiring login for price visibility.'
      }
    },
    {
      '@type': 'Question',
      name: 'How is it installed and maintained?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          "It installs in minutes with a theme-safe setup that doesn't modify theme code. Set it once and it runs automatically; it’s fully mobile-optimized."
      }
    },
    {
      '@type': 'Question',
      name: 'What’s the pricing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It’s $4.99/month (or $49.99/year) and comes with a 7-day free trial.'
      }
    }
  ]
};

const ShhhhPricingBlock: React.FC = () => {
  useEffect(() => {
    const existing = document.getElementById('shhhh-faq-jsonld');
    if (!existing) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'shhhh-faq-jsonld';
      script.text = JSON.stringify(faqJsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const node = document.getElementById('shhhh-faq-jsonld');
      if (node && node.parentNode) node.parentNode.removeChild(node);
    };
  }, []);

  return (
    <section className="mt-16 glass glass-border rounded-3xl p-8 text-left">
      <div className="flex items-center gap-3 mb-3">
        <img src="/logo-b2b.png" alt="B2B" className="w-6 h-6 rounded" />
        <span className="text-sm text-slate-300">Shhhh Pricing ‑ Price Hider - B2B</span>
      </div>
      <h2 className="text-2xl font-bold text-white mb-4">
        Hide Prices from Guests, Drive More Account Signups
      </h2>
      <p className="text-slate-300 mb-4">
        With Shhhh Pricing – Price Hider, hide product prices and the “Add to Cart” action from visitors who aren’t
        logged in. Create urgency and exclusivity that nudges visitors to create an account, grow your email list
        organically, and meet B2B pricing requirements with ease.
      </p>

      <ul className="list-disc list-inside space-y-2 text-slate-200/90 mb-4">
        <li>
          <strong>Easy installation:</strong> Add to your theme in seconds. Theme-safe with no code modifications.
        </li>
        <li>
          <strong>Perfect for B2B and exclusive stores:</strong> Keep prices visible only to logged-in customers.
        </li>
        <li>
          <strong>Mobile-optimized:</strong> Flawless experience on all devices.
        </li>
        <li>
          <strong>Multi-language:</strong> 7 languages with automatic detection.
        </li>
        <li>
          <strong>Zero maintenance:</strong> Set it once and let it run automatically.
        </li>
      </ul>

      <p className="text-slate-300 mb-6">
        Require login for price visibility to boost conversions and build your database. Ideal for fashion, luxury, and
        wholesale.
      </p>

      <p>
        <a
          href="https://apps.shopify.com/shhhh-pricing"
          target="_blank"
          rel="nofollow noopener"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          Explore Shhhh Pricing – Price Hider on the Shopify App Store
        </a>
      </p>
    </section>
  );
};

export default ShhhhPricingBlock;


