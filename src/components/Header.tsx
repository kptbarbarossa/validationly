import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        aria-label="Go to homepage"
                    >
                        <Logo size="lg" showText={false} />
                    </button>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {!isHomePage && (
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                            >
                                New Analysis
                            </button>
                        )}

                        {/* B2B App link with icon (configurable via env) */}
                        {(() => {
                            const b2bUrl = (import.meta as any).env?.VITE_B2B_APP_URL || '#';
                            const b2bIcon = (import.meta as any).env?.VITE_B2B_APP_ICON || '/favicon.svg';
                            return (
                                <a
                                    href={b2bUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                >
                                    <img src={b2bIcon} alt="B2B" className="w-4 h-4 rounded" />
                                    B2B App
                                </a>
                            );
                        })()}

                        <a
                            href="https://x.com/kptbarbarossa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            Feedback
                        </a>

                        <a
                            href="https://buymeacoffee.com/kptbarbarossa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                        >
                            ☕ Support
                        </a>
                    </nav>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => navigate('/')}
                            className="text-gray-600 hover:text-gray-900 p-2"
                            aria-label="Menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;