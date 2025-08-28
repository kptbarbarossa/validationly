import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const AppsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Apps | Validationly"
        description="Discover powerful apps and tools for startup validation"
        keywords="startup apps, validation tools, business apps"
      />

      <div className="min-h-screen bg-slate-950 text-white">
        {/* Header */}
        <div className="pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Apps & Tools
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Discover powerful applications and tools to accelerate your startup journey
            </p>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="max-w-6xl mx-auto px-4 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Login to See Price App */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Login to See Price</h3>
                  <p className="text-slate-400 text-sm">Shopify B2B & Wholesale</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Hide product prices from guests to boost customer registrations. Perfect for B2B, wholesale, and membership stores.
              </p>
              
              <a
                href="https://apps.shopify.com/shhhh-pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105 text-center block"
              >
                Get App →
              </a>
            </div>

            {/* Job Tailor App */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Job Tailor</h3>
                  <p className="text-slate-400 text-sm">AI-powered job matching</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Get personalized job recommendations based on your skills, experience, and career goals using advanced AI algorithms.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105"
              >
                Login to See Price
              </button>
            </div>

            {/* Market Signal Academy */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Market Signal Academy</h3>
                  <p className="text-slate-400 text-sm">Learn market validation</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Master the art of market validation with our comprehensive course library and expert-led workshops.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105"
              >
                Login to See Price
              </button>
            </div>

            {/* Trend Hunter */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Trend Hunter</h3>
                  <p className="text-slate-400 text-sm">Discover emerging trends</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Stay ahead of the curve with real-time trend analysis and predictive insights for your industry.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105"
              >
                Login to See Price
              </button>
            </div>

            {/* Pain Point Analyzer */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Pain Point Analyzer</h3>
                  <p className="text-slate-400 text-sm">Identify market problems</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Analyze customer pain points and market gaps to find the most promising business opportunities.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105"
              >
                Login to See Price
              </button>
            </div>

            {/* Social Validation */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Social Validation</h3>
                  <p className="text-slate-400 text-sm">Community feedback</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                Get real-time feedback from communities across multiple platforms to validate your ideas.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105"
              >
                Login to See Price
              </button>
            </div>

            {/* Coming Soon */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-slate-700 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">More Coming Soon</h3>
                  <p className="text-slate-400 text-sm">Stay tuned</p>
                </div>
              </div>
              
              <p className="text-slate-300 mb-6">
                We're constantly building new tools and applications. Join our community to get early access.
              </p>
              
              <button
                onClick={() => navigate('/auth')}
                className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-105"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppsPage;
