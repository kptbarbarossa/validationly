import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const ToolsPage: React.FC = () => {
    const navigate = useNavigate();

    const tools = [
        {
            id: 'pain-points',
            title: 'PainPointDB',
            description: 'Discover validated SaaS opportunities from real user pain points across Reddit, Product Hunt, forums, and more.',
            icon: '💡',
            route: '/pain-points',
            features: ['1,247+ validated opportunities', 'Evidence from real users', 'Market size estimates', 'Suggested solutions']
        },
        {
            id: 'trend-hunter',
            title: 'Trend Hunter',
            description: 'Discover viral trends and generate profitable startup ideas from social media momentum.',
            icon: '🎯',
            route: '/trend-hunter',
            features: ['Viral trend analysis', 'Startup idea generation', 'Market gap detection', 'Timing optimization']
        },
        {
            id: 'trend-to-startup',
            title: 'Trend → Startup Generator',
            description: 'Transform viral trends into detailed startup opportunities with market analysis and competition assessment.',
            icon: '🚀',
            route: '/trend-to-startup',
            features: ['Detailed startup ideas', 'Market size analysis', 'Competition assessment', 'Revenue models']
        },
        {
            id: 'x-generator',
            title: 'X Content Generator',
            description: 'Generate engaging Twitter/X posts for your startup idea with AI-powered content creation.',
            icon: '𝕏',
            route: '/tweet-generator',
            features: ['AI-powered content', '5-tweet series', 'Optimized for engagement', 'Ready to post']
        },
        {
            id: 'job-tailor',
            title: 'Job Tailor',
            description: 'AI-powered CV optimization for specific job applications. Tailor your resume to match job requirements perfectly.',
            icon: '📄',
            route: '/job-tailor',
            features: ['CV optimization', 'Job matching', 'Multiple tones', 'Instant results']
        },
        {
            id: 'market-academy',
            title: 'Market Signal Academy',
            description: 'Master trend analysis and market intelligence through comprehensive courses and real case studies.',
            icon: '🎓',
            route: '/market-signal-academy',
            features: ['Expert training', 'Real case studies', 'Practical tools', 'Market intelligence']
        },
        {
            id: 'social-validation',
            title: 'Social Validation Analysis',
            description: 'Discover early trend opportunities and market timing advantages using AI-powered social media trend analysis.',
            icon: '🚀',
            route: '/social-validation',
            features: ['Trend phase analysis', 'Social media signals', 'Validation scoring', 'Strategic recommendations']
        },
        {
            id: 'ai-analysis',
            title: '🤖 AI-Only Analysis',
            description: 'Deep strategic analysis using only the AI\'s knowledge base. No external data, pure insights.',
            icon: '🤖',
            route: '/analysis',
            features: ['Strategic insights', 'Risk analysis', 'Validation plan', 'GTM strategy']
        },
        {
            id: 'public-validation',
            title: 'Public Validation',
            description: 'Validate ideas using real community discussions across Reddit communities and social platforms.',
            icon: '🔍',
            route: '/public-validation',
            features: ['Reddit communities', 'Real discussions', 'Community feedback', 'Social validation']
        },
        {
            id: 'shopify-pain-points',
            title: 'Shopify Pain Points Analyzer',
            description: 'Discover the most common challenges and pain points faced by Shopify store owners based on community discussions.',
            icon: '🛍️',
            route: '/shopify-pain-points',
            features: ['Community analysis', 'Pain point identification', 'Solution recommendations', 'Trend insights']
        },
        {
            id: 'signal-digest',
            title: 'Signal Digest for Investors',
            description: 'Weekly category digest with Top 5 Signals + 3 Actionable Plays. Early opportunity detection with social arbitrage insights.',
            icon: '📊',
            route: '/signal-digest',
            features: ['Weekly investor digest', 'Top 5 ranked signals', '3 actionable plays', 'Social arbitrage metrics', 'Email templates']
        },
        {
            id: 'pain-extractor',
            title: 'ICP Pain Extractor',
            description: 'Extract persona-specific pain patterns and generate actionable copy hooks for your ideal customer profile.',
            icon: '🔍',
            route: '/pain-extractor',
            features: ['8-category pain taxonomy', 'Persona-based scoring', 'Copy hook generation', 'MVP feature suggestions', 'Social post drafts']
        },
        {
            id: 'youtube-hook-synth',
            title: 'YouTube Hook Synth',
            description: 'Generate high-converting YouTube video hooks with visual planning and A/B test packs. Optimize for 30s retention and CTR.',
            icon: '🎬',
            route: '/youtube-hook-synth',
            features: ['8 hook types', 'Visual shot planning', 'A/B test titles', 'Thumbnail prompts', 'HookScore (0-100)', '≤9s duration rule']
        },
        {
            id: 'youtube-analysis',
            title: 'YouTube Video Analysis',
            description: 'Comprehensive analysis of YouTube videos with structured insights, community response analysis, and actionable lessons.',
            icon: '📺',
            route: '/youtube-analysis',
            features: ['Structured analysis format', 'Comment sentiment analysis', 'Community insights', 'Actionable takeaways', 'Strategy breakdown', 'Revenue analysis']
        }
    ];

    return (
        <>
            <SEOHead
                title="Tools - Validationly | Startup Validation & Content Tools"
                description="Access powerful AI tools for startup validation, X content generation, and market analysis. Build better products with data-driven insights."
                keywords="startup tools, content generator, twitter generator, idea validation, AI tools, market analysis"
            />

            <div className="text-white">
                <div className="container mx-auto px-6 py-6">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                Startup Tools
                            </span>
                        </h1>
                    </div>
                    {/* Recommended Tools Section */}
                    <div className="mb-16 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            🛠️ Recommended Tools for Startups
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                            Curated tools and services to help you build, launch, and grow your startup efficiently
                        </p>

                        {/* Affiliate Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {/* Capacity.so Affiliate Card */}
                            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10">
                                <div className="flex items-start space-x-3">
                                    {/* Logo */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
                                            <img
                                                src="https://capacity.so/favicon.ico"
                                                alt="Capacity Logo"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    // Fallback to text logo if image fails
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.className = "w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center";
                                                        parent.innerHTML = '<span class="text-white font-bold text-sm">C</span>';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-base font-bold text-white">Capacity</h3>
                                            <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                                AI Assistant
                                            </span>
                                        </div>

                                        <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                                            AI-powered knowledge management and team collaboration platform.
                                            Perfect for startups to organize ideas and automate workflows.
                                        </p>

                                        {/* Key Features */}
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>AI automation</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Team collaboration</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Knowledge base</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Workflow optimization</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <a
                                            href="https://capacity.so/?via=barbaros"
                                            target="_blank"
                                            rel="nofollow noopener"
                                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                                        >
                                            <span>🚀</span>
                                            <span>Try Free</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* StoryShort.ai Affiliate Card */}
                            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10">
                                <div className="flex items-start space-x-3">
                                    {/* Logo */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
                                            <img
                                                src="https://storyshort.ai/favicon.ico"
                                                alt="StoryShort Logo"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    // Fallback to text logo if image fails
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.className = "w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center";
                                                        parent.innerHTML = '<span class="text-white font-bold text-sm">S</span>';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-base font-bold text-white">StoryShort</h3>
                                            <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                                AI Video Creator
                                            </span>
                                        </div>

                                        <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                                            Transform your ideas into engaging short videos with AI.
                                            Perfect for content marketing and social media.
                                        </p>

                                        {/* Key Features */}
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>AI video generation</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Social media ready</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Multiple formats</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Quick creation</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <a
                                            href="https://storyshort.ai/?via=barbaros"
                                            target="_blank"
                                            rel="nofollow noopener"
                                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                                        >
                                            <span>🎬</span>
                                            <span>Create Videos</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Login to See Price Affiliate Card */}
                            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10">
                                <div className="flex items-start space-x-3">
                                    {/* Logo */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
                                            <img
                                                src="/logo-b2b.png"
                                                alt="B2B Logo"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    // Fallback to text logo if image fails
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.className = "w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center";
                                                        parent.innerHTML = '<span class="text-white font-bold text-xs">B2B</span>';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-base font-bold text-white">Login to See Price</h3>
                                            <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                                Shopify App
                                            </span>
                                        </div>

                                        <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                                            Hide product prices from guests to drive account signups and grow your email list.
                                            Perfect for B2B stores, wholesale, and exclusive pricing strategies.
                                        </p>

                                        {/* Key Features */}
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Easy installation</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>B2B & wholesale ready</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Mobile optimized</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Zero maintenance</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <a
                                            href="https://apps.shopify.com/shhhh-pricing"
                                            target="_blank"
                                            rel="nofollow noopener"
                                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                                        >
                                            <span>🛍️</span>
                                            <span>View on Shopify App Store</span>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* NextUpKit Affiliate Card */}
                            <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-4 border border-white/10">
                                <div className="flex items-start space-x-3">
                                    {/* Logo */}
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center p-2">
                                            <img
                                                src="https://www.nextupkit.com/favicon.ico"
                                                alt="NextUpKit Logo"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    // Fallback to text logo if image fails
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    const parent = target.parentElement;
                                                    if (parent) {
                                                        parent.className = "w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center";
                                                        parent.innerHTML = '<span class="text-white font-bold text-xs">N</span>';
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-1">
                                            <h3 className="text-base font-bold text-white">NextUpKit</h3>
                                            <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                                Startup Toolkit
                                            </span>
                                        </div>

                                        <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                                            Complete startup toolkit with templates, resources, and tools to launch your next project faster.
                                            Perfect for founders, developers, and entrepreneurs.
                                        </p>

                                        {/* Key Features */}
                                        <div className="grid grid-cols-2 gap-2 mb-3">
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Ready-to-use templates</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Launch resources</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Time-saving tools</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                                <span className="text-green-400">✓</span>
                                                <span>Proven frameworks</span>
                                            </div>
                                        </div>

                                        {/* CTA */}
                                        <a
                                            href="https://nextupkit.lemonsqueezy.com?aff=rYX8Vm"
                                            target="_blank"
                                            rel="nofollow noopener"
                                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                                        >
                                            <span>🚀</span>
                                            <span>Get NextUpKit</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                className="group bg-white/5 backdrop-blur rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 cursor-pointer"
                                onClick={() => navigate(tool.route)}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                                        {tool.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-cyan-400 transition-all duration-300">
                                            {tool.title}
                                        </h3>
                                        <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                                            {tool.description}
                                        </p>

                                        {/* Features */}
                                        <div className="grid grid-cols-2 gap-1 mb-4">
                                            {tool.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2 text-xs text-slate-400">
                                                    <div className="w-1 h-1 rounded-full bg-indigo-400" />
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        {/* CTA Button */}
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-full text-white font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/25 text-sm">
                                            Use Tool →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>



                    {/* Features Highlight */}
                    <div className="mt-20 text-center">
                        <h2 className="text-2xl font-bold text-white mb-8">Powered by Advanced AI</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { icon: '🧠', title: 'Market Signal Intelligence', desc: 'AI-powered trend detection and analysis' },
                                { icon: '⚡', title: 'Early Signal Detection', desc: 'Spot opportunities before competition' },
                                { icon: '🎯', title: 'Optimal Timing Analysis', desc: 'Perfect your market entry timing' }
                            ].map((item, index) => (
                                <div key={index} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                                    <div className="text-3xl mb-3">{item.icon}</div>
                                    <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ToolsPage;
