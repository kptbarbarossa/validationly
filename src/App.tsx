
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';
import Header from './components/Header';
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
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
      <div className="bg-white text-gray-800 min-h-screen font-sans antialiased">
        <BrowserRouter>
          <Analytics />
          <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80">
            <div className="container mx-auto flex justify-center">
              <Link 
                to="/" 
                className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-80 transition-opacity"
                aria-label="Go to homepage"
              >
                validationly
              </Link>
            </div>
          </header>
          
          <main className="container mx-auto px-0 py-0 sm:py-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/results" element={<ResultsPage />} />
            </Routes>
          </main>
          
          <footer className="text-center py-8 text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Validationly. All rights reserved.</p>
          </footer>
        </BrowserRouter>
      </div>
    </ErrorBoundary>
  );
};

export default App;
