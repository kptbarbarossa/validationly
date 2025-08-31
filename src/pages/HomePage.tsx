
import React, { useState, useRef, useEffect } from 'react';
// import { PLATFORM_COUNT } from '../constants/platforms';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Direct API call - no service layer needed
import type { UserInput } from '../types';
// import LoadingSpinner from '../components/LoadingSpinner';
import EnhancedLoadingSpinner from '../components/EnhancedLoadingSpinner';
import PromptGallery from '../components/PromptGallery';
// import Logo from '../components/Logo';
import { useAnalytics } from '../components/Analytics';
import { SEOHead } from '../components/SEOHead';
// import RelatedStartups from '../components/RelatedStartups';
import GoogleOneTap from '../components/GoogleOneTap';
import DOMPurify from 'dompurify';

// Sample categories removed


const HomePage: React.FC = () => {
    const [userInput, setUserInput] = useState<UserInput>({
        idea: '',
        isValid: false,
        errorMessage: '' as unknown as string // exactOptionalPropertyTypes workaround
    });
    const [isLoading, setIsLoading] = useState(false); // analysis submit loading

    const [isOptimizing, setIsOptimizing] = useState(false); // optimize-only loading
    const [selectedTier, setSelectedTier] = useState<'free' | 'pro' | 'business' | 'enterprise'>('free');
    // const [enhancedPrompt] = useState(false);
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { trackEvent, trackValidation } = useAnalytics();
    const { user, signInWithGoogle } = useAuth();

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const validateInput = (idea: string): UserInput => {
        // Ensure idea is a string and handle null/undefined cases
        const safeIdea = idea || '';

        // Sanitize input to prevent XSS
        const sanitizedIdea = DOMPurify.sanitize(safeIdea, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
        const trimmedIdea = sanitizedIdea.trim();

        if (!trimmedIdea) {
            return { idea: safeIdea, isValid: false, errorMessage: 'Please enter an idea to validate.' };
        }

        if (trimmedIdea.length < 3) {
            return { idea: safeIdea, isValid: false, errorMessage: 'Idea must be at least 3 characters long.' };
        }

        if (trimmedIdea.length > 1000) {
            return { idea: safeIdea, isValid: false, errorMessage: 'Idea must be less than 1000 characters.' };
        }

        // Check for dangerous content
        const dangerousPatterns = [
            /<script/i,
            /javascript:/i,
            /data:text\/html/i,
            /vbscript:/i,
            /on\w+\s*=/i
        ];

        for (const pattern of dangerousPatterns) {
            if (pattern.test(trimmedIdea)) {
                return { idea: safeIdea, isValid: false, errorMessage: 'Input contains potentially dangerous content.' };
            }
        }

        return { idea: safeIdea, isValid: true };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value || '';
        const validation = validateInput(newValue);
        setUserInput(validation);
    };

    const optimizePromptRemotely = async (raw: string): Promise<string | null> => {
        try {
            const resp = await fetch('/api/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && { 'x-user-id': user.id })
                },
                body: JSON.stringify({ idea: (raw || '').trim(), optimize: true })
            });
            if (!resp.ok) return null;
            const data = await resp.json();
            return (data?.optimizedPrompt as string) || null;
        } catch {
            return null;
        }
    };

    const handleGoogleSignIn = async (credential: string) => {
        try {
            // You can handle the credential here if needed
            // For now, we'll use the existing signInWithGoogle function
            await signInWithGoogle();
        } catch (error) {
            console.error('Google sign-in error:', error);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const triggerValidation = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        console.log('triggerValidation called', { isValid: userInput.isValid, idea: userInput.idea });

        if (!userInput.isValid || !userInput.idea?.trim()) {
            console.log('Validation failed - input not valid');
            return;
        }

        // Track validation start
        trackEvent('validation_started', {
            event_category: 'engagement',
            event_label: 'idea_validation_started',
            custom_parameters: {
                idea_length: userInput.idea.length
            }
        });

        setIsLoading(true);
        console.log('Starting API call...');

        try {
            // Use new multi-platform validation API
            const ideaPayload = userInput.idea;
            const response = await fetch('/api/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && { 'x-user-id': user.id })
                },
                body: JSON.stringify({
                    content: ideaPayload,
                    analysisType: 'comprehensive'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Multi-platform API call successful', result);

            // Transform the new API response to match the expected format
            const transformedResult = {
                idea: ideaPayload,
                demandScore: result.insights?.validationScore || 50,
                scoreJustification: result.insights?.keyInsights?.[0] || 'Multi-platform analysis completed',
                classification: result.classification || {
                    primaryCategory: 'Startup',
                    businessModel: 'SaaS',
                    targetMarket: 'B2B',
                    complexity: 'Medium'
                },
                socialMediaSuggestions: result.socialMediaSuggestions || {
                    tweetSuggestion: `🚀 Just validated my startup idea: "${ideaPayload}" - The market demand looks promising! #startup #validation #entrepreneur`,
                    linkedinSuggestion: `Exciting news! I've been researching the market demand for "${ideaPayload}" and the validation results are encouraging. Looking forward to building something that solves real problems. #startup #innovation #marketresearch`,
                    redditTitleSuggestion: `Market validation results for my startup idea - need feedback!`,
                    redditBodySuggestion: `I've been researching the market demand for "${ideaPayload}" and would love to get feedback from the community. What do you think about this idea?`
                },
                youtubeData: result.youtubeData || null,
                multiPlatformData: {
                    platforms: result.platformData?.map((platform: any) => ({
                        platform: platform.platform,
                        items: platform.items || [],
                        error: platform.error
                    })) || [],
                    totalItems: result.platformData?.reduce((sum: number, p: any) => sum + (p.items?.length || 0), 0) || 0
                },
                insights: {
                    validationScore: result.insights?.validationScore || result.insights?.demandScore || 50,
                    sentiment: result.insights?.sentiment || 'positive',
                    keyInsights: result.insights?.keyInsights || [
                        'Market demand analysis completed across multiple platforms',
                        'AI-powered insights generated for strategic planning',
                        'Platform-specific data collected for comprehensive validation'
                    ],
                    opportunities: result.insights?.opportunities || [
                        'Strong market interest detected',
                        'Multiple platforms show positive signals',
                        'Ready for MVP development phase'
                    ],
                    painPoints: result.insights?.painPoints || [
                        'Consider competitive landscape analysis',
                        'Validate pricing strategy with target audience',
                        'Assess technical feasibility requirements'
                    ],
                    trendingTopics: result.insights?.trendingTopics || [
                        'AI-powered solutions',
                        'SaaS business models',
                        'Market validation tools'
                    ]
                }
            };

            // Track successful validation
            trackValidation(userInput.idea, transformedResult.demandScore);

            navigate('/results', { state: { idea: userInput.idea, result: transformedResult, fastMode: true } });
        } catch (err) {
            console.error('API call failed:', err);

            // Track validation error
            trackEvent('validation_error', {
                event_category: 'error',
                event_label: 'api_call_failed',
                custom_parameters: {
                    error_message: err instanceof Error ? err.message : 'Unknown error'
                }
            });

            if (err instanceof Error) {
                setUserInput(prev => ({
                    ...prev,
                    errorMessage: err.message
                }));
            } else {
                setUserInput(prev => ({
                    ...prev,
                    errorMessage: 'An unexpected error occurred. Please try again.'
                }));
            }
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        triggerValidation();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            triggerValidation();
        }
    };

    // Removed sample idea click handler (Prompt Gallery replaces it)

    return (
        <>
            <SEOHead
                title="Validationly - Validate Your Startup Idea Before You Build It"
                description="Get AI-driven market validation for your startup idea in seconds. Analyze demand across X, Reddit, and LinkedIn with actionable insights and social media suggestions."
                keywords="startup validation, idea validation, market research, AI analysis, startup tools, entrepreneur, indie hacker, business validation, market demand"
            />

            {/* Google One Tap Sign-In - appears automatically */}
            {!user && <GoogleOneTap onSignIn={handleGoogleSignIn} />}

            <div className="text-center max-w-4xl mx-auto text-slate-100">
                {/* Enhanced Hero Section - Reduced spacing */}
                <div className="relative mb-0" >
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-indigo-500/10 to-cyan-600/20 rounded-3xl blur-3xl"></div>

                    <div className="relative z-10 py-8">
                        {/* Logo removed by request */}

                        <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-slide-up delay-100">
                            <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                                Validate your idea
                            </span>
                            <br />
                            <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">before you build it</span>
                        </h1>

                        <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto animate-slide-up delay-200">
                            Get instant insights from 7+ platforms and find the exact tools to build smarter.
                        </p>

                        {/* Platform List as Text */}
                        <p className="text-lg text-slate-400 mb-8 animate-slide-up delay-300">
                            Reddit • Hacker News • Product Hunt • GitHub • Stack Overflow • Google News • YouTube
                        </p>



                    </div>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
                    <div className="mb-4">
                        <div className="relative group">
                            {/* Rotating light effect around placeholder */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity animate-rotate-light"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-15 animate-pulse-glow"></div>

                            <div className="relative rounded-3xl glass glass-border hover:border-white/15 hover:shadow-xl transition-all">

                                <textarea
                                    ref={textareaRef}
                                    value={userInput.idea}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder={'Describe your startup idea...'}
                                    className="glass-scroll w-full p-6 pr-16 bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-lg min-h-[120px] placeholder-slate-400 text-slate-100"
                                    rows={4}
                                    disabled={isLoading}
                                    aria-describedby={userInput.errorMessage ? "error-message" : undefined}
                                />

                                {/* Character counter */}
                                <div className="absolute bottom-3 left-6 text-sm text-slate-400">
                                    {userInput.idea.length}/1000
                                </div>

                                {/* Enhanced action bar: Submit only */}
                                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                    {/* Prompt optimizer button removed as requested */}
                                    <button
                                        type="button"
                                        onClick={triggerValidation}
                                        disabled={!userInput.isValid || isLoading}
                                        className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 bg-gradient-to-r from-indigo-600 to-cyan-600 border border-white/20 backdrop-blur-sm shadow-lg overflow-hidden ${userInput.isValid && !isLoading
                                            ? 'hover:scale-110 cursor-pointer opacity-100 hover:shadow-xl hover:shadow-indigo-500/25 hover:from-indigo-500 hover:to-cyan-500 active:scale-95'
                                            : 'cursor-not-allowed opacity-50 grayscale'
                                            }`}
                                        aria-label="Submit idea for validation"
                                    >
                                        {/* Rotating light effect around submit button */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full opacity-75 blur animate-rotate-light"></div>
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full opacity-50 blur animate-pulse-glow"></div>
                                        
                                        {/* Animated background gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-gradient-x rounded-full"></div>

                                        {/* Ripple effect on click */}
                                        <div className="absolute inset-0 rounded-full bg-white/20 scale-0 animate-ping opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-200"></div>

                                        {/* Icon container */}
                                        <div className="relative z-10 flex items-center justify-center">
                                            {isLoading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <svg
                                                    className="w-5 h-5 text-white transition-transform duration-200 group-hover:scale-110"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            )}
                                        </div>

                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-600 blur-md opacity-50 -z-10 group-hover:opacity-75 transition-opacity duration-300"></div>
                                    </button>
                                </div>
                            </div>
                        </div>



                    </div>

                    {userInput.errorMessage && (
                        <div id="error-message" className="text-red-400 text-sm mt-2 text-left">
                            {userInput.errorMessage}
                        </div>
                    )}
                    {isLoading && <EnhancedLoadingSpinner idea={userInput.idea} isLoading={isLoading} />}
                </form>

                {/* Simple Prompt Gallery */}
                <PromptGallery
                    onUse={(text) => {
                        const validation = validateInput(text);
                        setUserInput(validation);
                        textareaRef.current?.focus();
                    }}
                />

                {/* Recommended Tools Section */}
                <div className="mt-16 mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                        🛠️ Recommended Tools for Startups
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Curated tools and services to help you build, launch, and grow your startup efficiently
                    </p>
                </div>

                {/* Affiliate Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
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
                            <div className="flex-1 text-left">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-base font-bold text-white">Capacity</h3>
                                    <span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                        AI Assistant
                                    </span>
                                </div>

                                <p className="text-gray-300 text-xs mb-3 leading-relaxed text-left">
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
                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
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
                            <div className="flex-1 text-left">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-base font-bold text-white">StoryShort</h3>
                                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                        AI Video Creator
                                    </span>
                                </div>

                                <p className="text-gray-300 text-xs mb-3 leading-relaxed text-left">
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
                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
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
                            <div className="flex-1 text-left">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="text-base font-bold text-white">Login to See Price</h3>
                                    <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full text-xs font-medium">
                                        Shopify App
                                    </span>
                                </div>

                                <p className="text-gray-300 text-xs mb-3 leading-relaxed text-left">
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
                                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:shadow-lg transition-all transform hover:scale-105 text-xs font-medium"
                                >
                                    <span>🛍️</span>
                                    <span>View on Shopify App Store</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>





                {/* RelatedStartups section removed by request */}
            </div>
        </>
    );
};

export default HomePage;


