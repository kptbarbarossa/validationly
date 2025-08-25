import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Validationly - AI-Powered Startup Validation Tools"
        description="Validate your startup ideas with AI-powered market research and discover validated SaaS opportunities from real user pain points."
        keywords="startup validation, SaaS ideas, market research, pain points, business validation, AI analysis"
      />
      
      <div className="min-h-screen text-white">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-purple-500/5 to-cyan-600/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-20">
              <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Validationly
              </h1>
              <p className="text-2xl md:text-3xl text-slate-300 mb-6 max-w-4xl mx-auto">
                AI-powered startup validation tools for entrepreneurs
              </p>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-12">
                Stop building products nobody wants. Validate your ideas with AI-powered market research 
                or discover proven opportunities from real user pain points.
              </p>
              
              {/* Quick Stats */}
              <div className="flex justify-center gap-12 mb-16">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-400">10K+</div>
                  <div className="text-slate-400">Ideas Validated</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400">1,247</div>
                  <div className="text-slate-400">Pain Points</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-400">89%</div>
                  <div className="text-slate-400">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Two Main Tools */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
              {/* Idea Validation Tool */}
              <div className="glass glass-border p-8 rounded-3xl hover:scale-105 transition-all">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    Idea Validation
                  </h2>
                  <p className="text-slate-300 mb-6">
                    Get instant AI-powered market research for your startup idea. 
                    Analyze demand, competition, and market signals across social platforms.
                  </p>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>Multi-platform market analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>Demand scoring (0-100)</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>Competition analysis</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>Content suggestions</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl font-semibold transition-all transform hover:scale-105"
                >
                  Validate Your Idea
                </button>
              </div>

              {/* Pain Points Database */}
              <div className="glass glass-border p-8 rounded-3xl hover:scale-105 transition-all">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">💡</div>
                  <h2 className="text-3xl font-bold mb-4 text-white">
                    Pain Points DB
                  </h2>
                  <p className="text-slate-300 mb-6">
                    Discover validated SaaS opportunities from real user pain points 
                    across Reddit, G2, forums, and more. Skip the guesswork.
                  </p>
                </div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>1,247+ validated opportunities</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>Evidence from real users</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>Difficulty & market size estimates</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <span className="text-green-400">✓</span>
                    <span>Suggested solutions</span>
                  </div>
                </div>
                
                <button
                  onClick={() => navigate('/pain-points')}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-2xl font-semibold transition-all transform hover:scale-105"
                >
                  Browse Pain Points
                </button>
              </div>
            </div>

            {/* How It Works */}
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-12 text-white">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                  <div className="text-5xl mb-4">1️⃣</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Choose Your Path</h3>
                  <p className="text-slate-300">
                    Validate your existing idea or discover new opportunities from our pain points database
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">2️⃣</div>
                  <h3 className="text-xl font-bold mb-3 text-white">AI Analysis</h3>
                  <p className="text-slate-300">
                    Our AI analyzes market signals, competition, and real user feedback across platforms
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">3️⃣</div>
                  <h3 className="text-xl font-bold mb-3 text-white">Take Action</h3>
                  <p className="text-slate-300">
                    Get actionable insights, demand scores, and next steps to build with confidence
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <div className="glass glass-border p-12 rounded-3xl max-w-4xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 text-white">
                  Ready to Build Something People Want?
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  Join thousands of entrepreneurs who validate before they build
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl font-semibold transition-all transform hover:scale-105"
                  >
                    Validate My Idea
                  </button>
                  <button
                    onClick={() => navigate('/pain-points')}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 rounded-2xl font-semibold transition-all transform hover:scale-105"
                  >
                    Find Opportunities
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;