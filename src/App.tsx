
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PremiumNavBar from './components/PremiumNavBar';
import Analytics from './components/Analytics';

// Critical pages - loaded immediately
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';

// Lazy load non-critical pages
const ResultsPage = React.lazy(() => import('./pages/ResultsPage'));
const PublicValidationPage = React.lazy(() => import('./pages/PublicValidationPage'));
const PainPointHomePage = React.lazy(() => import('./pages/PainPointHomePage'));
const PainPointDetailPage = React.lazy(() => import('./pages/PainPointDetailPage'));
const AITweetGenerator = React.lazy(() => import('./pages/AITweetGenerator'));
const ToolsPage = React.lazy(() => import('./pages/ToolsPage'));
const TrendHunterPage = React.lazy(() => import('./pages/TrendHunterPage'));
const TrendToStartupPage = React.lazy(() => import('./pages/TrendToStartupPage'));
const MarketSignalAcademyPage = React.lazy(() => import('./pages/MarketSignalAcademyPage'));
const SocialValidationPage = React.lazy(() => import('./pages/SocialValidationPage'));
const AnalysisPage = React.lazy(() => import('./pages/AnalysisPage'));
const JobTailorPage = React.lazy(() => import('./pages/JobTailorPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SignalDigestPage = React.lazy(() => import('./pages/SignalDigestPage'));
const PainExtractorPage = React.lazy(() => import('./pages/PainExtractorPage'));
const YouTubeHookSynthPage = React.lazy(() => import('./pages/YouTubeHookSynthPage'));
const YouTubeAnalysisPage = React.lazy(() => import('./pages/YouTubeAnalysisPage').then(module => ({ default: module.YouTubeAnalysisPage })));
const AppsPage = React.lazy(() => import('./pages/AppsPage'));
const ShopifyPainPointsPage = React.lazy(() => import('./pages/ShopifyPainPointsPage'));
const FAQPage = React.lazy(() => import('./pages/FAQPage'));
const AffiliationPage = React.lazy(() => import('./pages/AffiliationPage'));
const AdminAffiliationPage = React.lazy(() => import('./pages/AdminAffiliationPage'));
const BlogIndexPage = React.lazy(() => import('./pages/BlogIndexPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const XContentGeneratorGuide = React.lazy(() => import('./pages/blog/XContentGeneratorGuide'));
const LoginToSeePriceGuide = React.lazy(() => import('./pages/blog/LoginToSeePriceGuide'));
const UseCaseSaaSPage = React.lazy(() => import('./pages/UseCaseSaaSPage'));
const UseCaseEcommercePage = React.lazy(() => import('./pages/UseCaseEcommercePage'));
const UseCasesIndexPage = React.lazy(() => import('./pages/UseCasesIndexPage'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className="text-gray-400">Loading...</p>
    </div>
  </div>
);

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
      <AuthProvider>
        <div className="relative min-h-screen font-sans antialiased text-slate-100 bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-cyan-500/10 blur-3xl"></div>
          <div className="pointer-events-none absolute -top-40 -left-40 w-[40rem] h-[40rem] bg-indigo-500/20 rounded-full blur-3xl animate-aurora"></div>
          <div className="pointer-events-none absolute -bottom-40 -right-40 w-[40rem] h-[40rem] bg-cyan-500/20 rounded-full blur-3xl animate-aurora-slow"></div>
          <BrowserRouter>
            <Analytics />
            <PremiumNavBar />
            
            <main className="container mx-auto px-0 pt-24 sm:pt-24">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  
                  <Route path="/pain-points" element={<PainPointHomePage />} />
                  <Route path="/pain-point/:id" element={<PainPointDetailPage />} />

                  <Route path="/results" element={<ResultsPage />} />
                  <Route path="/signal-digest" element={<SignalDigestPage />} />
                  <Route path="/pain-extractor" element={<PainExtractorPage />} />
                  <Route path="/youtube-hook-synth" element={<YouTubeHookSynthPage />} />
                  <Route path="/youtube-analysis" element={<YouTubeAnalysisPage />} />
                  <Route path="/public-validation" element={<PublicValidationPage />} />
                  <Route path="/tweet-generator" element={<AITweetGenerator />} />
                  <Route path="/trend-hunter" element={<TrendHunterPage />} />
                  <Route path="/trend-to-startup" element={<TrendToStartupPage />} />
                  <Route path="/market-signal-academy" element={<MarketSignalAcademyPage />} />
                  <Route path="/social-validation" element={<SocialValidationPage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/apps" element={<AppsPage />} />
                  <Route path="/analysis" element={<AnalysisPage />} />
                  <Route path="/job-tailor" element={<JobTailorPage />} />
                  <Route path="/shopify-pain-points" element={<ShopifyPainPointsPage />} />
                  <Route path="/dashboard" element={<ProfilePage />} />
                  <Route path="/profile" element={<ProfilePage />} />

                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/affiliation" element={<AffiliationPage />} />
                  <Route path="/admin/affiliation" element={<AdminAffiliationPage />} />
                  <Route path="/blog" element={<BlogIndexPage />} />
                  <Route path="/blog/x-content-generator-guide" element={<XContentGeneratorGuide />} />
                  <Route path="/blog/login-to-see-price-guide" element={<LoginToSeePriceGuide />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/use-cases" element={<UseCasesIndexPage />} />
                  <Route path="/use-cases/saas-idea-validation" element={<UseCaseSaaSPage />} />
                  <Route path="/use-cases/ecommerce-product-validation" element={<UseCaseEcommercePage />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="*" element={<div className="min-h-[60vh] flex items-center justify-center text-slate-300">Page not found</div>} />
                </Routes>
              </Suspense>
            </main>
            
            <footer className="text-center py-8 text-slate-400 text-sm border-t border-white/10">
              <p className="mb-2">&copy; {new Date().getFullYear()} Validationly. All rights reserved.</p>
              <div className="flex justify-center space-x-6">
                <a href="/faq" className="underline hover:text-slate-300 transition-colors">FAQ</a>
                <a href="/privacy" className="underline hover:text-slate-300 transition-colors">Privacy Policy</a>
                <a href="/terms-of-service" className="underline hover:text-slate-300 transition-colors">Terms of Service</a>
              </div>
            </footer>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
