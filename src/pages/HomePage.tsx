
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import SmartIdeaForm from '../components/SmartIdeaForm';
import EnhancedLoadingSpinner from '../components/EnhancedLoadingSpinner';

interface IdeaFormData {
  idea: string;
  audience: string;
  goal: string;
  industry: string;
  stage: string;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentIdea, setCurrentIdea] = useState<string>('');

  const handleSubmit = async (formData: IdeaFormData) => {
    setCurrentIdea(formData.idea);
    setIsLoading(true);
    
    try {
      // Enhanced payload with context
      const enhancedPayload = {
        idea: formData.idea,
        audience: formData.audience,
        goal: formData.goal,
        industry: formData.industry,
        stage: formData.stage,
        context: `Business Model: ${formData.audience}, Industry: ${formData.industry}, Stage: ${formData.stage}, Goal: ${formData.goal}`
      };

      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enhancedPayload)
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Navigate to results with enhanced data
      navigate('/results', { 
        state: { 
          result: {
            ...result,
            idea: formData.idea,
            audience: formData.audience,
            goal: formData.goal,
            industry: formData.industry,
            stage: formData.stage
          }
        } 
      });

    } catch (error) {
      console.error('Analysis failed:', error);
      // Show error message to user
      alert('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Validationly - AI-Powered Social Arbitrage Analysis for Startup Ideas"
        description="Discover hidden opportunities through cultural gaps, timing advantages, and platform dynamics. Get AI-powered social arbitrage analysis for your business ideas."
        keywords="startup validation, social arbitrage, trend analysis, cultural transfer, market timing, AI analysis, business ideas"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-cyan-500/10 blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
          
          <div className="relative container mx-auto px-6 py-12">
            
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-100 via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                  🔮 Validationly
                </h1>
                <p className="text-2xl md:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  Discover hidden opportunities through <span className="text-purple-400 font-semibold">social arbitrage</span>, 
                  <span className="text-blue-400 font-semibold"> cultural gaps</span>, and 
                  <span className="text-cyan-400 font-semibold"> timing advantages</span>
                </p>
              </div>

              {/* Value Proposition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl mb-3">🌱</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Micro → Macro</h3>
                  <p className="text-slate-400 text-sm">Spot trends before they go mainstream</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl mb-3">⏰</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Perfect Timing</h3>
                  <p className="text-slate-400 text-sm">Enter markets at the optimal moment</p>
                </div>
                <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                  <div className="text-3xl mb-3">🌍</div>
                  <h3 className="text-lg font-semibold text-white mb-2">Cultural Transfer</h3>
                  <p className="text-slate-400 text-sm">Adapt ideas across cultures</p>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto mb-12">
                <p className="text-slate-300 text-lg mb-3">
                  "Validationly helped me spot a trend 6 months before it exploded. The social arbitrage analysis was spot-on!"
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
                  <span className="text-slate-400">Sarah Chen, Founder @ TrendSpot</span>
                </div>
              </div>
            </div>

            {/* Smart Form */}
            <SmartIdeaForm onSubmit={handleSubmit} isLoading={isLoading} />
            
            {/* Loading Spinner */}
            {isLoading && <EnhancedLoadingSpinner idea={currentIdea} />}

            {/* Features Section */}
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-white text-center mb-12">
                Why Choose Validationly?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  {
                    icon: '🤖',
                    title: 'AI-Powered',
                    description: 'Advanced AI models analyze your idea from multiple perspectives'
                  },
                  {
                    icon: '📊',
                    title: 'Data-Driven',
                    description: 'Real market signals and social media trends'
                  },
                  {
                    icon: '⚡',
                    title: 'Lightning Fast',
                    description: 'Get comprehensive analysis in under 20 seconds'
                  },
                  {
                    icon: '🎯',
                    title: 'Actionable',
                    description: 'Specific next steps and validation strategies'
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 text-center hover:border-white/20 transition-colors">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
              <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ready to Discover Your Next Big Opportunity?
                </h2>
                <p className="text-slate-300 mb-6">
                  Join thousands of founders who've used Validationly to validate their ideas and spot market opportunities.
                </p>
                <button
                  onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-2xl text-white font-semibold transition-all transform hover:scale-105"
                >
                  🚀 Start Your Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
