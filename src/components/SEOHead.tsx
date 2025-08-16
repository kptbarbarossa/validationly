import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "Validationly - Validate Your Startup Idea Before You Build It",
  description = "Get AI-driven market validation for your startup idea in seconds. Analyze demand across X, Reddit, and LinkedIn with actionable insights.",
  keywords = "startup validation, idea validation, market research, AI analysis, startup tools, entrepreneur, indie hacker",
  ogImage = "https://validationly.com/og-image.png",
  canonical
}) => {
  const location = useLocation();
  const currentUrl = `https://validationly.com${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', currentUrl);
    }

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) {
      ogImg.setAttribute('content', ogImage);
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', title);
    }

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) {
      twitterDesc.setAttribute('content', description);
    }

    const twitterUrl = document.querySelector('meta[property="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.setAttribute('content', currentUrl);
    }

    // Update canonical URL
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', canonicalUrl);
    }

    // Track page view for SEO analytics
    if (window.gtag) {
      window.gtag('config', 'G-80LXQSRZ2P', {
        page_title: title,
        page_location: currentUrl,
        custom_map: {
          custom_parameter_1: 'seo_page_type'
        }
      });
    }

    // Organization JSON-LD injection (once per page)
    const orgScript = document.getElementById('org-jsonld');
    if (!orgScript) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'org-jsonld';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Validationly',
        url: 'https://validationly.com',
        sameAs: [
          'https://x.com/kptbarbarossa'
        ],
        logo: 'https://validationly.com/og-image.png'
      });
      document.head.appendChild(script);
    }
  }, [title, description, keywords, ogImage, canonicalUrl, currentUrl]);

  return null; // This component doesn't render anything
};

export { SEOHead };
export default SEOHead;