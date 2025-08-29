/* eslint-disable jsx-a11y/aria-proptypes */
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';

const navItems: Array<{ to: string; label: string; external?: boolean }> = [
  { to: '/tools', label: 'Tools' },
  { to: '/apps', label: 'Apps' },
  { to: '/blog', label: 'Blog' },
  // { to: '/use-cases', label: 'Use Cases' }, // hidden from nav for SEO-only exposure
];

const PremiumNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, signOut } = useAuth();

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to));

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignOut = () => {
    signOut();
    setIsProfileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
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
            {user ? (
              <>
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-slate-200/90 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="User profile menu"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || user.email || 'User'}
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="hidden lg:inline text-xs sm:text-sm">{user.displayName || user.email}</span>
                    <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg ring-1 ring-white/10">
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <div className="border-t border-white/10 my-1"></div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-3 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/10 transition-colors w-full text-left"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-indigo-200 hover:text-indigo-100 hover:bg-white/10 transition-colors border border-indigo-400/30"
              >
                <span className="text-xs sm:text-sm font-medium">Sign In</span>
              </Link>
            )}
            
            {/* X/Twitter Logo */}
            <a
              href="https://x.com/kptbarbarossa"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-200/90 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Follow us on X/Twitter"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
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
export { PremiumNavBar };


