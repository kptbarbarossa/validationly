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
                        <button
                            onClick={() => navigate('/tools')}
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-full hover:bg-gray-100"
                        >
                            Tools
                        </button>

                        <button
                            onClick={() => navigate('/apps')}
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-full hover:bg-gray-100"
                        >
                            Apps
                        </button>

                        <button
                            onClick={() => navigate('/affiliation')}
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-full hover:bg-gray-100"
                        >
                            Affiliation
                        </button>

                        <a
                            href="https://buymeacoffee.com/kptbarbarossa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
                        >
                            ☕ Support
                        </a>
                    </nav>

                    {/* Mobile navigation */}
                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={() => navigate('/affiliation')}
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors px-3 py-1 rounded-full hover:bg-gray-100 text-sm"
                        >
                            Affiliation
                        </button>
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