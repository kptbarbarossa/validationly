import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { painPointService, type PainPoint } from '../services/painPointService';



const PainPointHomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [painPoints, setPainPoints] = useState<PainPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const categories = painPointService.getCategories();
  const difficulties = painPointService.getDifficultyLevels();

  // Sample pain points for demo
  const samplePainPoints: PainPoint[] = [
    {
      id: '1',
      title: 'Freelancers struggle with client brief collection',
      description: 'Freelancers spend hours going back and forth with clients to get proper project briefs. Many projects fail due to unclear requirements.',
      category: 'Freelancing',
      demandScore: 85,
      difficultyLevel: 'Medium',
      source: 'Reddit r/freelance',
      evidenceUrl: 'https://reddit.com/r/freelance/example',
      suggestedSolution: 'Brief collection tool with templates + CRM integration',
      tags: ['freelancing', 'client-management', 'forms'],
      createdAt: '2025-01-25'
    },
    {
      id: '2',
      title: 'Small businesses need simple inventory tracking',
      description: 'Local shops and small businesses struggle with Excel-based inventory. They need something simpler than enterprise solutions.',
      category: 'SaaS',
      demandScore: 78,
      difficultyLevel: 'Easy',
      source: 'G2 Reviews',
      evidenceUrl: 'https://g2.com/example',
      suggestedSolution: 'Simple inventory tracker with barcode scanning',
      tags: ['inventory', 'small-business', 'retail'],
      createdAt: '2025-01-24'
    },
    {
      id: '3',
      title: 'Content creators need better analytics dashboard',
      description: 'YouTubers and content creators juggle multiple platforms but lack unified analytics. Current tools are too complex or expensive.',
      category: 'Marketing',
      demandScore: 92,
      difficultyLevel: 'Hard',
      source: 'IndieHackers',
      evidenceUrl: 'https://indiehackers.com/example',
      suggestedSolution: 'Multi-platform content analytics dashboard',
      tags: ['analytics', 'content-creation', 'social-media'],
      createdAt: '2025-01-23'
    }
  ];

  useEffect(() => {
    fetchPainPoints();
  }, [selectedCategory, selectedDifficulty]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPainPoints();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchPainPoints = async () => {
    setIsLoading(true);
    try {
      const data = await painPointService.getPainPoints({
        category: selectedCategory,
        difficulty: selectedDifficulty,
        search: searchQuery
      });
      
      setPainPoints(data.painPoints || samplePainPoints);
    } catch (error) {
      console.error('Error fetching pain points:', error);
      setPainPoints(samplePainPoints); // Fallback to sample data
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPainPoints = painPoints.filter(point => {
    const matchesSearch = point.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || point.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || point.difficultyLevel === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <>
      <SEOHead
        title="PainPointDB - Discover Validated SaaS Opportunities"
        description="The largest database of validated SaaS opportunities sourced from real user pain points across Reddit, G2, Upwork, and more."
        keywords="SaaS ideas, startup opportunities, pain points, market validation, business ideas"
      />
      
      <div className="min-h-screen text-white">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-purple-500/5 to-cyan-600/10"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                PainPointDB
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-4 max-w-4xl mx-auto">
                Discover validated SaaS opportunities from real user pain points
              </p>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                We scan Reddit, G2, Upwork, and forums to find problems people are willing to pay to solve
              </p>
              
              {/* Stats */}
              <div className="flex justify-center gap-8 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">1,247</div>
                  <div className="text-slate-400 text-sm">Pain Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">89%</div>
                  <div className="text-slate-400 text-sm">Validated</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">7</div>
                  <div className="text-slate-400 text-sm">Data Sources</div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="glass glass-border p-6 rounded-3xl mb-8 max-w-6xl mx-auto">
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Search */}
                <div className="md:col-span-1">
                  <input
                    type="text"
                    placeholder="Search pain points..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                
                {/* Category Filter */}
                <div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* Difficulty Filter */}
                <div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty === 'All' ? 'All Difficulties' : `${difficulty} to Build`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="text-center text-slate-400">
                Found {filteredPainPoints.length} validated opportunities
              </div>
            </div>

            {/* Pain Points Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin text-6xl mb-4">🔍</div>
                <p className="text-slate-400">Discovering pain points...</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {filteredPainPoints.map((point) => (
                  <div
                    key={point.id}
                    className="glass glass-border p-6 rounded-2xl hover:scale-105 transition-all cursor-pointer"
                    onClick={() => navigate(`/pain-point/${point.id}`)}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">
                          {point.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-xs">
                            {point.category}
                          </span>
                          <span className={`px-2 py-1 border rounded-full text-xs ${getDifficultyColor(point.difficultyLevel)}`}>
                            {point.difficultyLevel}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(point.demandScore)}`}>
                          {point.demandScore}
                        </div>
                        <div className="text-xs text-slate-400">Demand</div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                      {point.description}
                    </p>

                    {/* Solution */}
                    <div className="mb-4">
                      <div className="text-xs text-slate-400 mb-1">Suggested Solution:</div>
                      <div className="text-sm text-green-400 font-medium">
                        {point.suggestedSolution}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <span>📍</span>
                        <span>{point.source}</span>
                      </div>
                      <div>{point.createdAt}</div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {point.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-700/50 rounded-full text-xs text-slate-300"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Section */}
            <div className="text-center mt-16">
              <div className="glass glass-border p-8 rounded-3xl max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-4 text-white">
                  Ready to Build Your Next SaaS?
                </h2>
                <p className="text-slate-300 mb-6">
                  Get unlimited access to our database of validated opportunities
                </p>
                <div className="flex justify-center gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl font-semibold transition-all transform hover:scale-105">
                    Start Free Trial
                  </button>
                  <button className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-2xl font-semibold transition-all">
                    View Pricing
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

export default PainPointHomePage;