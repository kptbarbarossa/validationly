import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { painPointService, type PainPoint } from '../services/painPointService';



const PainPointDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [painPoint, setPainPoint] = useState<PainPoint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullEvidence, setShowFullEvidence] = useState(false);

  // Sample detailed pain point data
  const samplePainPoint: PainPoint = {
    id: '1',
    title: 'Freelancers struggle with client brief collection',
    description: 'Freelancers across all industries consistently report spending 20-40% of their project time just trying to extract proper requirements from clients. This leads to scope creep, missed deadlines, unhappy clients, and reduced profitability. The problem is particularly acute for design, development, and consulting freelancers who need detailed specifications to deliver quality work.',
    category: 'Freelancing',
    industry: 'Professional Services',
    demandScore: 85,
    difficultyLevel: 'Medium',
    evidence: [
      {
        source: 'Reddit r/freelance',
        url: 'https://reddit.com/r/freelance/example1',
        snippet: 'Getting briefs from clients is a nightmare. I spend more time trying to understand what they want than actually doing the work. Need a better system.',
        upvotes: 234,
        comments: 45
      },
      {
        source: 'IndieHackers',
        url: 'https://indiehackers.com/example2',
        snippet: 'Built a simple brief collection tool for my agency. Clients love it and we save 10+ hours per project.',
        upvotes: 89,
        comments: 23
      },
      {
        source: 'Upwork Forum',
        url: 'https://upwork.com/example3',
        snippet: 'Clients never give complete requirements upfront. Always leads to revisions and scope creep.',
        upvotes: 156,
        comments: 67
      }
    ],
    suggestedSolution: 'Brief collection tool with templates + CRM integration',
    competitionLevel: 'Low',
    technicalComplexity: 'Medium',
    estimatedMarketSize: '$50M',
    tags: ['freelancing', 'client-management', 'forms', 'project-management'],
    createdAt: '2025-01-25',
    lastUpdated: '2025-01-25'
  };

  useEffect(() => {
    if (id) {
      fetchPainPoint(id);
    }
  }, [id]);

  const fetchPainPoint = async (painPointId: string) => {
    setIsLoading(true);
    try {
      const data = await painPointService.getPainPoint(painPointId);
      setPainPoint(data);
    } catch (error) {
      console.error('Error fetching pain point:', error);
      // Fallback to sample data for demo
      if (painPointId === '1') {
        setPainPoint(samplePainPoint);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center max-w-4xl mx-auto text-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🔍</div>
          <p className="text-slate-400">Loading pain point details...</p>
        </div>
      </div>
    );
  }

  if (!painPoint) {
    return (
      <div className="text-center max-w-4xl mx-auto text-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-slate-400 mb-4">Pain point not found</p>
          <button
            onClick={() => navigate('/pain-points')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-xl transition-all transform hover:scale-105"
          >
            Back to Pain Points
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <>
      <SEOHead
        title={`${painPoint.title} - PainPointDB`}
        description={painPoint.description}
        keywords={`${painPoint.tags.join(', ')}, SaaS opportunity, startup idea`}
      />
      
      <div className="text-center max-w-6xl mx-auto text-slate-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/pain-points')}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-all text-left"
          >
            <span>←</span>
            <span>Back to Pain Points</span>
          </button>

          {/* Header */}
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-indigo-500/10 to-cyan-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative glass glass-border p-8 rounded-3xl hover:border-white/20 transition-all">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1 text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                    {painPoint.title}
                  </span>
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300">
                    {painPoint.category}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300">
                    {painPoint.industry}
                  </span>
                  <span className={`px-3 py-1 border rounded-full ${getDifficultyColor(painPoint.difficultyLevel)}`}>
                    {painPoint.difficultyLevel} to Build
                  </span>
                </div>
              </div>

              <div className="text-center lg:text-right">
                <div className="text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {painPoint.demandScore}
                </div>
                <div className="text-slate-400">Demand Score</div>
                <div className="text-sm text-slate-500 mt-1">
                  Based on {painPoint.evidence.length} sources
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Problem Description */}
            <div className="glass glass-border p-6 rounded-2xl hover:border-white/20 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-white text-left">Problem Description</h2>
              <p className="text-slate-300 leading-relaxed text-left">
                {painPoint.description}
              </p>
            </div>

            {/* Evidence */}
            <div className="glass glass-border p-6 rounded-2xl hover:border-white/20 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-white text-left">Evidence Sources</h2>
              <div className="space-y-4">
                {painPoint.evidence.slice(0, showFullEvidence ? undefined : 2).map((evidence, index) => (
                  <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400 font-medium">{evidence.source}</span>
                        <a
                          href={evidence.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-indigo-400 transition-all"
                        >
                          🔗
                        </a>
                      </div>
                      {evidence.upvotes && (
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>👍 {evidence.upvotes}</span>
                          <span>💬 {evidence.comments}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-300 italic text-left">"{evidence.snippet}"</p>
                  </div>
                ))}
                
                {painPoint.evidence.length > 2 && (
                  <button
                    onClick={() => setShowFullEvidence(!showFullEvidence)}
                    className="text-indigo-400 hover:text-indigo-300 transition-all"
                  >
                    {showFullEvidence ? 'Show Less' : `Show ${painPoint.evidence.length - 2} More Sources`}
                  </button>
                )}
              </div>
            </div>

            {/* Suggested Solution */}
            <div className="glass glass-border p-6 rounded-2xl hover:border-white/20 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-white text-left">Suggested Solution</h2>
              <div className="bg-gradient-to-r from-green-500/10 to-cyan-500/10 border border-green-500/20 p-4 rounded-xl">
                <p className="text-green-300 font-medium text-lg text-left">
                  {painPoint.suggestedSolution}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="glass glass-border p-6 rounded-2xl hover:border-white/20 transition-all">
              <h3 className="text-xl font-bold mb-4 text-white text-left">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-400">Competition Level</span>
                  <span className={`font-medium ${getCompetitionColor(painPoint.competitionLevel)}`}>
                    {painPoint.competitionLevel}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Technical Complexity</span>
                  <span className={`font-medium ${getCompetitionColor(painPoint.technicalComplexity)}`}>
                    {painPoint.technicalComplexity}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Market Size</span>
                  <span className="font-medium text-green-400">{painPoint.estimatedMarketSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Updated</span>
                  <span className="text-slate-300">{painPoint.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="glass glass-border p-6 rounded-2xl hover:border-white/20 transition-all">
              <h3 className="text-xl font-bold mb-4 text-white text-left">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {painPoint.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-slate-300 hover:bg-white/10 hover:border-white/20 cursor-pointer transition-all"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="glass glass-border p-6 rounded-2xl hover:border-white/20 transition-all">
              <h3 className="text-xl font-bold mb-4 text-white text-left">Take Action</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-xl font-semibold transition-all transform hover:scale-105">
                  Save to Favorites
                </button>
                <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl font-semibold transition-all">
                  Export Details
                </button>
                <button className="w-full px-4 py-3 bg-gradient-to-r from-green-500/20 to-cyan-500/20 hover:from-green-500/30 hover:to-cyan-500/30 border border-green-500/30 text-green-400 rounded-xl font-semibold transition-all">
                  Start Building
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

export default PainPointDetailPage;