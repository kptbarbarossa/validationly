import React, { useState } from 'react';
import { SEOHead } from '../components/SEOHead';
import { ValidationHistory, saveValidationToHistory } from '../components/ValidationHistory';

interface RedditPost {
    title: string;
    content: string;
    author: string;
    subreddit: string;
    score: number;
    comments: number;
    url: string;
    created: Date;
}

interface ValidationInsights {
    trendingTopics: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    keyInsights: string[];
    opportunities: string[];
    painPoints: string[];
    popularSolutions: string[];
    validationScore: number;
}

const PublicValidationPage: React.FC = () => {
    const [selectedSubreddits, setSelectedSubreddits] = useState<string[]>(['startups']);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [insights, setInsights] = useState<ValidationInsights | null>(null);
    const [recentPosts, setRecentPosts] = useState<RedditPost[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [analysisMetadata, setAnalysisMetadata] = useState<any>(null);
    const [loadingStep, setLoadingStep] = useState<string>('');

    const popularSubreddits = [
        { name: 'startups', label: '🚀 Startups', description: 'Startup discussions and advice' },
        { name: 'entrepreneur', label: '💼 Entrepreneur', description: 'Entrepreneurship community' },
        { name: 'SaaS', label: '💻 SaaS', description: 'Software as a Service' },
        { name: 'indiehackers', label: '🏗️ Indie Hackers', description: 'Independent makers' },
        { name: 'smallbusiness', label: '🏪 Small Business', description: 'Small business owners' },
        { name: 'marketing', label: '📢 Marketing', description: 'Marketing strategies' },
        { name: 'technology', label: '⚡ Technology', description: 'Tech discussions' },
        { name: 'webdev', label: '🌐 Web Dev', description: 'Web development' },
        { name: 'programming', label: '💾 Programming', description: 'Programming community' },
        { name: 'business', label: '📊 Business', description: 'General business' }
    ];

    const handleSubredditToggle = (subreddit: string) => {
        setSelectedSubreddits(prev =>
            prev.includes(subreddit)
                ? prev.filter(s => s !== subreddit)
                : [...prev, subreddit]
        );
    };

    const analyzePublicSentiment = async () => {
        if (!searchQuery.trim() || selectedSubreddits.length === 0) return;

        setIsAnalyzing(true);
        setError(null);
        setInsights(null);
        setRecentPosts([]);
        setLoadingStep('Fetching community discussions...');

        try {
            setLoadingStep('Analyzing with AI...');

            const response = await fetch('/api/public-validation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: searchQuery,
                    subreddits: selectedSubreddits,
                    analysisType: 'comprehensive'
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setInsights(result.insights);
            setRecentPosts(result.posts || []);
            setAnalysisMetadata(result.metadata);

            // Save to history
            saveValidationToHistory(
                searchQuery,
                result.insights.validationScore,
                result.insights.sentiment,
                selectedSubreddits
            );

        } catch (error: any) {
            console.error('Public validation failed:', error);
            setError(error.message || 'Analysis failed. Please try again.');
        } finally {
            setIsAnalyzing(false);
            setLoadingStep('');
        }
    };

    const getValidationColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getSentimentColor = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return 'text-green-400';
            case 'negative': return 'text-red-400';
            default: return 'text-yellow-400';
        }
    };

    const getSentimentIcon = (sentiment: string) => {
        switch (sentiment) {
            case 'positive': return '😊';
            case 'negative': return '😞';
            default: return '😐';
        }
    };

    const exportResults = () => {
        if (!insights) return;

        const exportData = {
            query: searchQuery,
            analysisDate: new Date().toISOString(),
            validationScore: insights.validationScore,
            sentiment: insights.sentiment,
            communities: selectedSubreddits,
            insights: {
                trendingTopics: insights.trendingTopics,
                keyInsights: insights.keyInsights,
                painPoints: insights.painPoints,
                opportunities: insights.opportunities,
                popularSolutions: insights.popularSolutions
            },
            metadata: analysisMetadata,
            topPosts: recentPosts.slice(0, 5).map(post => ({
                title: post.title,
                subreddit: post.subreddit,
                score: post.score,
                comments: post.comments,
                url: post.url
            }))
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `validation-${searchQuery.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const shareResults = async () => {
        if (!insights) return;

        const shareText = `🚀 Validation Results for "${searchQuery}"

📊 Score: ${insights.validationScore}% ${getSentimentIcon(insights.sentiment)}
🏘️ Communities: ${selectedSubreddits.join(', ')}

Key Insights:
${insights.keyInsights.slice(0, 2).map(insight => `• ${insight}`).join('\n')}

Analyzed with Validationly - AI-powered startup validation
${window.location.origin}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Validation Results: ${searchQuery}`,
                    text: shareText,
                    url: window.location.href
                });
            } catch (error) {
                // Fallback to clipboard
                copyToClipboard(shareText);
            }
        } else {
            copyToClipboard(shareText);
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // You could add a toast notification here
            console.log('Results copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
        }
    };

    return (
        <>
            <SEOHead
                title="Public Validation - Analyze Reddit Community Sentiment | Validationly"
                description="Validate your startup ideas by analyzing public sentiment and discussions on Reddit communities. Get real insights from potential customers."
                keywords="public validation, reddit analysis, community sentiment, startup validation, market research, social validation"
            />

            <div className="min-h-screen text-white">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-indigo-500/10 to-cyan-600/20 rounded-3xl blur-3xl"></div>

                    <div className="container mx-auto px-6 py-8 relative z-10">

                        {/* Header */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                                Public Validation
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 mb-6 max-w-4xl mx-auto">
                                Analyze real community discussions to validate your startup ideas
                            </p>
                            <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                                Get insights from Reddit communities without APIs or scraping - using public RSS feeds and AI analysis
                            </p>
                        </div>

                        {/* Search Interface */}
                        <div className="glass glass-border p-8 rounded-3xl mb-12 max-w-4xl mx-auto">
                            <h2 className="text-2xl font-bold mb-6 text-center text-cyan-400">
                                🔍 Analyze Community Sentiment
                            </h2>

                            {/* Search Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-300 mb-2">
                                    What do you want to validate?
                                </label>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="e.g., AI-powered project management tool, sustainable fashion marketplace..."
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
                                />

                                {/* Example Queries */}
                                <div className="mt-3">
                                    <p className="text-xs text-slate-400 mb-2">💡 Try these examples:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'AI code review tool',
                                            'Remote team collaboration',
                                            'Sustainable packaging',
                                            'Mental health app',
                                            'No-code website builder'
                                        ].map((example) => (
                                            <button
                                                key={example}
                                                onClick={() => setSearchQuery(example)}
                                                className="glass glass-border px-3 py-1 text-xs text-slate-400 rounded-full hover:text-slate-300 hover:border-white/20 transition-colors"
                                            >
                                                {example}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Subreddit Selection */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-slate-300 mb-3">
                                    Select Communities ({selectedSubreddits.length} selected)
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                    {popularSubreddits.map((subreddit) => (
                                        <button
                                            key={subreddit.name}
                                            onClick={() => handleSubredditToggle(subreddit.name)}
                                            className={`glass glass-border px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedSubreddits.includes(subreddit.name)
                                                    ? 'border-purple-400/50 bg-purple-500/20 text-purple-200'
                                                    : 'text-slate-300 hover:text-white hover:border-white/20'
                                                }`}
                                            title={subreddit.description}
                                        >
                                            {subreddit.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Analyze Button */}
                            <button
                                onClick={analyzePublicSentiment}
                                disabled={!searchQuery.trim() || selectedSubreddits.length === 0 || isAnalyzing}
                                className={`glass glass-border w-full py-4 rounded-full font-bold text-lg transition-all ${!searchQuery.trim() || selectedSubreddits.length === 0 || isAnalyzing
                                        ? 'text-gray-400 cursor-not-allowed border-gray-600/20'
                                        : 'text-white hover:border-purple-400/50 hover:bg-purple-500/10'
                                    }`}
                            >
                                {isAnalyzing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                                        </svg>
                                        <span className="flex flex-col items-center">
                                            <span>Analyzing Communities...</span>
                                            {loadingStep && (
                                                <span className="text-xs text-slate-400 mt-1">{loadingStep}</span>
                                            )}
                                        </span>
                                    </span>
                                ) : (
                                    '🔍 Analyze Public Sentiment'
                                )}
                            </button>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="glass glass-border p-6 rounded-2xl mb-8 border-red-500/20 bg-red-500/5">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">⚠️</span>
                                    <h3 className="text-xl font-bold text-red-400">Analysis Failed</h3>
                                </div>
                                <p className="text-slate-300 mb-4">{error}</p>
                                <button
                                    onClick={() => setError(null)}
                                    className="glass glass-border px-4 py-2 text-red-400 rounded-full hover:border-red-400/50 hover:bg-red-500/10 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        {/* Results */}
                        {insights && (
                            <div className="space-y-8">

                                {/* Validation Score */}
                                <div className="glass glass-border p-8 rounded-3xl text-center">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1">
                                            <h2 className="text-3xl font-bold mb-4 text-cyan-400">📊 Public Validation Score</h2>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => shareResults()}
                                                className="glass glass-border px-4 py-2 text-blue-400 rounded-full hover:border-blue-400/50 hover:bg-blue-500/10 transition-colors text-sm"
                                            >
                                                📤 Share
                                            </button>
                                            <button
                                                onClick={() => exportResults()}
                                                className="glass glass-border px-4 py-2 text-purple-400 rounded-full hover:border-purple-400/50 hover:bg-purple-500/10 transition-colors text-sm"
                                            >
                                                📄 Export
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-6xl font-bold mb-4">
                                        <span className={getValidationColor(insights.validationScore)}>
                                            {insights.validationScore}%
                                        </span>
                                    </div>
                                    <div className="flex justify-center items-center gap-4 mb-4">
                                        <span className="text-lg">Community Sentiment:</span>
                                        <span className={`text-2xl font-bold ${getSentimentColor(insights.sentiment)}`}>
                                            {getSentimentIcon(insights.sentiment)} {insights.sentiment}
                                        </span>
                                    </div>

                                    {/* Analysis Metadata */}
                                    {analysisMetadata && (
                                        <div className="mt-6 pt-4 border-t border-white/10">
                                            <div className="flex justify-center gap-6 text-sm text-slate-400">
                                                <span>📊 {analysisMetadata.postsAnalyzed} posts analyzed</span>
                                                <span>🏘️ {analysisMetadata.subredditsSearched?.length} communities</span>
                                                <span>🤖 {analysisMetadata.aiModel}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Insights Grid */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                                    {/* Trending Topics */}
                                    <div className="glass glass-border p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold mb-4 text-green-400">📈 Trending Topics</h3>
                                        <div className="space-y-2">
                                            {insights.trendingTopics.map((topic, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <span className="text-green-400">•</span>
                                                    <span className="text-slate-300">{topic}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pain Points */}
                                    <div className="glass glass-border p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold mb-4 text-red-400">🎯 Pain Points</h3>
                                        <div className="space-y-2">
                                            {insights.painPoints.map((pain, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <span className="text-red-400 mt-1">⚠</span>
                                                    <span className="text-slate-300 text-sm">{pain}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Opportunities */}
                                    <div className="glass glass-border p-6 rounded-2xl">
                                        <h3 className="text-xl font-bold mb-4 text-blue-400">💡 Opportunities</h3>
                                        <div className="space-y-2">
                                            {insights.opportunities.map((opportunity, index) => (
                                                <div key={index} className="flex items-start gap-2">
                                                    <span className="text-blue-400 mt-1">→</span>
                                                    <span className="text-slate-300 text-sm">{opportunity}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                </div>

                                {/* Key Insights */}
                                <div className="glass glass-border p-8 rounded-3xl">
                                    <h3 className="text-2xl font-bold mb-6 text-purple-400">🧠 AI Insights</h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="text-lg font-semibold mb-3 text-slate-300">Key Findings:</h4>
                                            <ul className="space-y-2">
                                                {insights.keyInsights.map((insight, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-purple-400 mt-1">✓</span>
                                                        <span className="text-slate-300 text-sm">{insight}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold mb-3 text-slate-300">Popular Solutions:</h4>
                                            <ul className="space-y-2">
                                                {insights.popularSolutions.map((solution, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="text-yellow-400 mt-1">⭐</span>
                                                        <span className="text-slate-300 text-sm">{solution}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Posts */}
                                {recentPosts.length > 0 && (
                                    <div className="glass glass-border p-8 rounded-3xl">
                                        <h3 className="text-2xl font-bold mb-6 text-orange-400">📝 Recent Community Discussions</h3>
                                        <div className="space-y-4">
                                            {recentPosts.slice(0, 5).map((post, index) => (
                                                <div key={index} className="glass glass-border p-4 rounded-xl hover:bg-white/5 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-semibold text-white text-sm flex-1 mr-3">{post.title}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">r/{post.subreddit}</span>
                                                            {post.url && (
                                                                <a
                                                                    href={post.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                                                                >
                                                                    🔗 View
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {post.content && (
                                                        <p className="text-slate-300 text-sm mb-3 leading-relaxed">{post.content.substring(0, 150)}...</p>
                                                    )}
                                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                                        <span>by u/{post.author}</span>
                                                        <div className="flex gap-4">
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-green-400">↑</span> {post.score}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <span className="text-blue-400">💬</span> {post.comments}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {recentPosts.length > 5 && (
                                            <div className="mt-4 text-center">
                                                <p className="text-sm text-slate-400">
                                                    Showing top 5 of {recentPosts.length} relevant discussions found
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                            </div>
                        )}

                        {/* Validation History */}
                        <div className="mt-12">
                            <ValidationHistory />
                        </div>

                        {/* How It Works */}
                        <div className="glass glass-border p-8 rounded-3xl mt-12">
                            <h2 className="text-3xl font-bold text-center mb-8 text-cyan-400">
                                🔍 How Public Validation Works
                            </h2>

                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="text-4xl mb-4">📡</div>
                                    <h3 className="text-xl font-bold mb-2">RSS Feeds</h3>
                                    <p className="text-slate-400 text-sm">
                                        We use Reddit's public RSS feeds to gather community discussions - completely legal and ethical
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl mb-4">🧠</div>
                                    <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                                    <p className="text-slate-400 text-sm">
                                        Our AI analyzes sentiment, trends, and opportunities from real community conversations
                                    </p>
                                </div>

                                <div className="text-center">
                                    <div className="text-4xl mb-4">📊</div>
                                    <h3 className="text-xl font-bold mb-2">Actionable Insights</h3>
                                    <p className="text-slate-400 text-sm">
                                        Get validation scores, pain points, and opportunities to guide your startup decisions
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicValidationPage;