
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

import ResultsPage from './pages/ResultsPage';
import AITweetGenerator from './pages/AITweetGenerator';
import ToolsPage from './pages/ToolsPage';
import TrendHunterPage from './pages/TrendHunterPage';
import TrendToStartupPage from './pages/TrendToStartupPage';
import MarketSignalAcademyPage from './pages/MarketSignalAcademyPage';

import FAQPage from './pages/FAQPage';
import BlogIndexPage from './pages/BlogIndexPage';
import BlogPostPage from './pages/BlogPostPage';
import XContentGeneratorGuide from './pages/blog/XContentGeneratorGuide';
import UseCaseSaaSPage from './pages/UseCaseSaaSPage';
import UseCaseEcommercePage from './pages/UseCaseEcommercePage';
import UseCasesIndexPage from './pages/UseCasesIndexPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import PremiumNavBar from './components/PremiumNavBar';
import Analytics from './components/Analytics';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
            <p className="text-slate-300 mb-6">We're sorry, but something unexpected happened. Please try refreshing the page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="relative min-h-screen font-sans antialiased text-slate-100 bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 blur-3xl"></div>
        <div className="pointer-events-none absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-3xl animate-aurora"></div>
        <div className="pointer-events-none absolute -bottom-40 -right-40 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-3xl animate-aurora-slow"></div>
        <BrowserRouter>
          <Analytics />
          <PremiumNavBar />
          
          <main className="container mx-auto px-0 py-0 sm:py-0">
            <Routes>
              <Route path="/" element={<HomePage />} />

              <Route path="/results" element={<ResultsPage />} />
              <Route path="/tweet-generator" element={<AITweetGenerator />} />
              <Route path="/trend-hunter" element={<TrendHunterPage />} />
              <Route path="/trend-to-startup" element={<TrendToStartupPage />} />
              <Route path="/market-signal-academy" element={<MarketSignalAcademyPage />} />
              <Route path="/tools" element={<ToolsPage />} />

              <Route path="/faq" element={<FAQPage />} />
              <Route path="/blog" element={<BlogIndexPage />} />
              <Route path="/blog/x-content-generator-guide" element={<XContentGeneratorGuide />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/use-cases" element={<UseCasesIndexPage />} />
              <Route path="/use-cases/saas-idea-validation" element={<UseCaseSaaSPage />} />
              <Route path="/use-cases/ecommerce-product-validation" element={<UseCaseEcommercePage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="*" element={<div className="min-h-[60vh] flex items-center justify-center text-slate-300">Page not found</div>} />
            </Routes>
          </main>
          
          <footer className="text-center py-8 text-slate-400 text-sm border-t border-white/10">
            <p className="mb-2">&copy; {new Date().getFullYear()} Validationly. All rights reserved.</p>
            <p>
              <a href="/privacy" className="underline hover:text-slate-300">Privacy Policy</a>
            </p>
          </footer>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
};

export default App;
