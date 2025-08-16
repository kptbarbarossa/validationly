import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

const ToolsPage: React.FC = () => {
    const navigate = useNavigate();

    const tools = [
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
            id: 'market-academy',
            title: 'Market Signal Academy',
            description: 'Master trend analysis and market intelligence through comprehensive courses and real case studies.',
            icon: '🎓',
            route: '/market-signal-academy',
            features: ['Expert training', 'Real case studies', 'Practical tools', 'Market intelligence']
        }
    ];

    return (
        <>
            <SEOHead
                title="Tools - Validationly | Startup Validation & Content Tools"
                description="Access powerful AI tools for startup validation, X content generation, and market analysis. Build better products with data-driven insights."
                keywords="startup tools, content generator, twitter generator, idea validation, AI tools, market analysis"
            />
            
            <div className="relative text-white overflow-hidden">
                {/* Decorative Background Shapes */}
                <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="pointer-events-none absolute top-20 -right-20 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative container mx-auto px-6 py-16">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                Startup Tools
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            AI-powered tools to validate your ideas, create content, and grow your startup with data-driven insights.
                        </p>
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
                                        <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-lg text-white font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/25 text-sm">
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
