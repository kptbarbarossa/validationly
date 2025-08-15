/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const navItems: Array<{ to: string; label: string; external?: boolean }> = [
  { to: '/', label: 'New Analysis' },
  { to: '/social-validation', label: 'Social Validation' },
  { to: '/tweet-generator', label: 'Tweet Generator' },
  { to: '/faq', label: 'FAQ' },
  { to: '/blog', label: 'Blog' },
  // { to: '/use-cases', label: 'Use Cases' }, // hidden from nav for SEO-only exposure
];

const PremiumNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  return (
    <header className="sticky top-0 z-50">
      {/* Gradient divider line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-400/30 to-transparent" />

      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Primary Navigation"
      >
        <div
          className="mt-3 mb-3 grid grid-cols-3 items-center rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] px-4 py-1.5 min-h-12"
        >
          {/* Left: Logo */}
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 pl-4 pr-2 py-1.5 justify-self-start"
            aria-label="Go to homepage"
          >
            <Logo size="sm" showText={false} className="opacity-95" />
            <span className="hidden sm:block text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 group-hover:opacity-90">
              validationly
            </span>
          </button>

          {/* Center: Nav items (desktop) */}
          <nav className="hidden md:flex items-center justify-center gap-2 justify-self-center">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  'relative px-4 py-1.5 rounded-full transition-all',
                  'text-slate-200/90 hover:text-white',
                  'hover:bg-white/10',
                  'border border-transparent hover:border-white/10',
                  isActive(item.to) ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400' : '',
                ].join(' ')}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
                {isActive(item.to) && (
                  <span className="pointer-events-none absolute -bottom-1 left-3 right-3 h-px bg-gradient-to-r from-indigo-400/70 via-cyan-400/70 to-transparent" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right: CTAs */}
          <div className="flex items-center gap-2 pr-2 justify-self-end">
            <a
              href="https://apps.shopify.com/shhhh-pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-emerald-200 hover:text-emerald-100 hover:bg-white/10 transition-colors"
              aria-label="B2B App – Shopify"
            >
              <span className="hidden lg:inline text-xs sm:text-sm">B2B App</span>
            </a>
            <a
              href="https://x.com/kptbarbarossa"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-200/90 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Give Feedback on X/Twitter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
                <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden lg:inline text-xs sm:text-sm">Feedback</span>
            </a>

            <a
              href="https://buymeacoffee.com/kptbarbarossa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-amber-200 hover:text-amber-100 hover:bg-white/10 transition-colors"
            >
              <span className="text-base">☕</span>
              <span className="hidden sm:inline font-medium text-xs sm:text-sm">Buy me a coffee</span>
            </a>

            {/* Mobile menu button */}
            {isOpen ? (
              <button
                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:text-white hover:bg-white/10 border border-white/10"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                aria-expanded="true"
                aria-controls="mobile-menu"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <button
                className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-slate-200 hover:text-white hover:bg-white/10 border border-white/10"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
                aria-expanded="false"
                aria-controls="mobile-menu"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden">
          <div className="mx-4 rounded-2xl bg-white/6 backdrop-blur-xl border border-white/15 shadow-lg ring-1 ring-white/10">
            <nav className="flex flex-col p-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={[
                    'px-3 py-3 rounded-full transition-colors',
                    'text-slate-100/90 hover:text-white',
                    'hover:bg-white/10 border border-transparent hover:border-white/10',
                    isActive(item.to) ? 'bg-white/10 border-white/15' : '',
                  ].join(' ')}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(item.to) ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="https://apps.shopify.com/shhhh-pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 px-3 py-3 rounded-full text-emerald-200 hover:text-emerald-100 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                B2B App
              </a>
              <a
                href="https://x.com/kptbarbarossa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 px-3 py-3 rounded-full text-slate-100/90 hover:text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Feedback
              </a>
              <a
                href="https://buymeacoffee.com/kptbarbarossa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 mb-2 inline-flex items-center justify-center gap-2 px-3 py-3 rounded-full text-amber-200 hover:text-amber-100 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
              <span className="text-lg">☕</span>
              <span className="font-medium">Buy me a coffee</span>
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Subtle underglow */}
      <div className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
    </header>
  );
};

export default PremiumNavBar;


