import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import AffiliateCardsSection from '../components/AffiliateCardsSection';

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
            description: 'Extract pain points and insights from your target audience using AI-powered analysis of social media and community discussions.',
            icon: '🔍',
            route: '/pain-extractor',
            features: ['Audience analysis', 'Pain point extraction', 'Insight generation', 'Target validation']
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

            <div className="min-h-screen text-white">
                <div className="container mx-auto px-6 py-5">
                    {/* Recommended Tools Section */}
                    <AffiliateCardsSection 
                        className="mt-7 mb-8"
                        title="🛠️ Recommended Tools for Founders"
                        subtitle="Essential tools and services to help you build, launch, and grow your startup"
                        maxCards={8}
                    />

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
                            ].map((feature, index) => (
                                <div key={index} className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                                    <div className="text-3xl mb-4">{feature.icon}</div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm">{feature.desc}</p>
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
