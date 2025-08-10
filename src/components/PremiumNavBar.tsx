/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const navItems: Array<{ to: string; label: string; external?: boolean }> = [
  { to: '/', label: 'New Analysis' },
  { to: '/faq', label: 'FAQ' },
  { to: '/blog', label: 'Blog' },
  { to: '/use-cases', label: 'Use Cases' },
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
          className="mt-3 mb-3 flex items-center justify-between rounded-2xl bg-white/5 backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] ring-1 ring-white/10"
        >
          {/* Left: Logo */}
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-3 pl-4 pr-2 py-2"
            aria-label="Go to homepage"
          >
            <div className="rounded-xl bg-white/5 border border-white/10 p-1.5 shadow-sm">
              <Logo size="sm" showText={false} />
            </div>
            <span className="hidden sm:block text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 group-hover:opacity-90">
              validationly
            </span>
          </button>

          {/* Center: Nav items (desktop) */}
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={[
                  'relative px-3 py-2 rounded-xl transition-all',
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
          <div className="flex items-center gap-2 pr-2">
            <a
              href="https://x.com/kptbarbarossa"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl text-slate-200/90 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
              aria-label="Give Feedback on X/Twitter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90">
                <path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="hidden lg:inline">Feedback</span>
            </a>

            <a
              href="https://buymeacoffee.com/kptbarbarossa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/15 px-3 py-2 text-amber-200 hover:bg-amber-300/20 hover:border-amber-300/40 transition-colors shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]"
            >
              <span className="text-lg">☕</span>
              <span className="hidden sm:inline font-medium">Support</span>
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
                    'px-3 py-3 rounded-lg transition-colors',
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
                href="https://x.com/kptbarbarossa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 px-3 py-3 rounded-lg text-slate-100/90 hover:text-white hover:bg-white/10 border border-white/10"
                onClick={() => setIsOpen(false)}
              >
                Feedback
              </a>
              <a
                href="https://buymeacoffee.com/kptbarbarossa"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 mb-2 inline-flex items-center justify-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/15 px-3 py-3 text-amber-200 hover:bg-amber-300/20 hover:border-amber-300/40"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-lg">☕</span>
                <span className="font-medium">Support</span>
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


