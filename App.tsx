
import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';

const App: React.FC = () => {
  return (
    <div className="bg-white text-gray-800 min-h-screen font-sans antialiased">
      <HashRouter>
        <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200/80">
            <div className="container mx-auto flex justify-center">
                <Link to="/" className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-500">
                validationly
                </Link>
            </div>
        </header>
        <main className="container mx-auto px-4 py-6 sm:py-10">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </main>
        <footer className="text-center py- text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Validationly. All rights reserved.</p>
        </footer>
      </HashRouter>
    </div>
  );
};

export default App;