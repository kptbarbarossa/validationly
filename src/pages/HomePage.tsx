
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Direct API call - no service layer needed
import type { DynamicPromptResult, UserInput } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EnhancedLoadingSpinner from '../components/EnhancedLoadingSpinner';
import Logo from '../components/Logo';
import { useAnalytics } from '../components/Analytics';
import SEOHead from '../components/SEOHead';

const sampleCategories = [
    {
        name: "SaaS & B2B",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        description: "Business software solutions",
        example: "SaaS platform for automated invoice processing using AI",
        platforms: "GitHub, Stack Overflow, Slack, Dev.to, Indie Hackers"
    },
    {
        name: "E-commerce",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
        description: "Online retail & marketplaces",
        example: "Sustainable fashion marketplace for eco-conscious consumers",
        platforms: "Instagram, Pinterest, Etsy, Shopify, Amazon"
    },
    {
        name: "Fintech",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
        ),
        description: "Financial technology solutions",
        example: "Mobile app for real-time expense splitting with friends",
        platforms: "AngelList, Crunchbase, Substack, Clubhouse"
    },
    {
        name: "Design & Creative",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
            </svg>
        ),
        description: "Design tools & creative platforms",
        example: "AI-powered design tool for creating social media graphics",
        platforms: "Dribbble, Behance, Awwwards, Canva, Unsplash"
    },
    {
        name: "Mobile Apps",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
            </svg>
        ),
        description: "Consumer mobile applications",
        example: "Mental health app with AI-powered mood tracking",
        platforms: "Product Hunt, GitHub, Dev.to, Indie Hackers"
    },
    {
        name: "Marketplace",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        ),
        description: "Two-sided marketplace platforms",
        example: "Freelance marketplace for specialized AI consultants",
        platforms: "AngelList, Product Hunt, Indie Hackers, Etsy"
    }
];



const HomePage: React.FC = () => {
    const [userInput, setUserInput] = useState<UserInput>({
        idea: '',
        isValid: false,
        errorMessage: undefined
    });
    const [isLoading, setIsLoading] = useState(false);
    const [enhancedPrompt, setEnhancedPrompt] = useState(false);
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { trackEvent, trackValidation } = useAnalytics();

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const validateInput = (idea: string): UserInput => {
        // Ensure idea is a string and handle null/undefined cases
        const safeIdea = idea || '';
        const trimmedIdea = safeIdea.trim();

        if (!trimmedIdea) {
            return { idea: safeIdea, isValid: false, errorMessage: 'Please enter an idea to validate.' };
        }

        if (trimmedIdea.length < 3) {
            return { idea: safeIdea, isValid: false, errorMessage: 'Idea must be at least 3 characters long.' };
        }

        if (trimmedIdea.length > 1000) {
            return { idea: safeIdea, isValid: false, errorMessage: 'Idea must be less than 1000 characters.' };
        }

        return { idea: safeIdea, isValid: true };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value || '';
        const validation = validateInput(newValue);
        setUserInput(validation);
    };

    const enhancePromptRemotely = async (raw: string): Promise<string | null> => {
        try {
            const resp = await fetch('/api/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idea: (raw || '').trim(), enhance: true })
            });
            if (!resp.ok) return null;
            const data = await resp.json();
            return (data?.enhancedPrompt as string) || null;
        } catch {
            return null;
        }
    };

    const triggerValidation = async () => {
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
            // Direct API call to our dynamic prompt system
            const ideaPayload = enhancedPrompt ? buildEnhancedIdea(userInput.idea) : userInput.idea;
            const response = await fetch('/api/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idea: ideaPayload })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: DynamicPromptResult = await response.json();
            console.log('API call successful', result);
            
            // Track successful validation
            trackValidation(userInput.idea, result.demandScore);
            
            navigate('/results', { state: { result } });
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

    const handleSampleIdeaClick = (sampleIdea: string) => {
        if (!sampleIdea || typeof sampleIdea !== 'string') {
            console.error('Invalid sample idea:', sampleIdea);
            return;
        }
        
        // Track sample idea usage
        trackEvent('sample_idea_clicked', {
            event_category: 'engagement',
            event_label: 'sample_idea_selected',
            custom_parameters: {
                sample_idea: sampleIdea.substring(0, 50) // First 50 chars for privacy
            }
        });
        
        const validation = validateInput(sampleIdea);
        setUserInput(validation);
        textareaRef.current?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <SEOHead 
                title="Validationly - Validate Your Startup Idea Before You Build It"
                description="Get AI-driven market validation for your startup idea in seconds. Analyze demand across X, Reddit, and LinkedIn with actionable insights and social media suggestions."
                keywords="startup validation, idea validation, market research, AI analysis, startup tools, entrepreneur, indie hacker, business validation, market demand"
            />
            <div className="text-center max-w-4xl mx-auto text-slate-100">
            {/* Enhanced Hero Section - Reduced spacing */}
            <div className="relative mb-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 via-indigo-500/10 to-cyan-600/20 rounded-3xl blur-3xl"></div>

                <div className="relative z-10 py-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo size="lg" showText={false} />
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                            Validate your idea
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">before you build it</span>
                    </h1>

                    <p className="text-xl text-slate-300 mb-6 max-w-2xl mx-auto">
                        Get AI-driven market validation in seconds. Analyze demand across social platforms with actionable insights.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
                <div className="mb-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>

                        <div className="relative rounded-3xl glass glass-border hover:border-white/15 hover:shadow-xl transition-all">
                            <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                            <button
                                    type="button"
                                    onClick={async () => {
                                        const enhanced = await enhancePromptRemotely(userInput.idea);
                                        if (enhanced) {
                                            // Fill enhanced prompt into textarea (placeholder-like behavior)
                                            const validation = validateInput(enhanced);
                                            setUserInput(validation);
                                        }
                                    }}
                                className="text-xs px-3 py-1.5 rounded-full border transition-colors bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                                    aria-label="Enhance prompt"
                                    title="Enhance prompt"
                                >
                                    ✨ Enhance
                                </button>
                            </div>
                            <textarea
                                ref={textareaRef}
                                value={userInput.idea}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder={'Describe your startup idea... (e.g., AI-powered fitness app for busy professionals)'}
                                className="glass-scroll w-full p-6 pr-16 bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-lg min-h-[120px] placeholder-slate-400 text-slate-100"
                                rows={4}
                                disabled={isLoading}
                                aria-describedby={userInput.errorMessage ? "error-message" : undefined}
                            />

                            {/* Character counter */}
                            <div className="absolute bottom-3 left-6 text-sm text-slate-400">
                                {userInput.idea.length}/1000
                            </div>

                            {/* Enhanced submit button */}
                            <button
                                type="button"
                                onClick={triggerValidation}
                                disabled={!userInput.isValid || isLoading}
                                className={`absolute bottom-3 right-3 w-10 h-10 flex items-center justify-center transition-all duration-200 ${userInput.isValid && !isLoading
                                    ? 'hover:scale-110 cursor-pointer opacity-100'
                                    : 'cursor-not-allowed opacity-50'
                                    }`}
                                aria-label="Submit idea for validation"
                            >
                                <img
                                    src="/logo.png"
                                    alt="Submit"
                                    className="w-6 h-6 object-contain"
                                />
                            </button>
                        </div>
                    </div>
                    {userInput.errorMessage && (
                        <div id="error-message" className="text-red-400 text-sm mt-2 text-left">
                            {userInput.errorMessage}
                        </div>
                    )}
                    {isLoading && <EnhancedLoadingSpinner />}
                </div>


            </form>

            <div className="mt-12">
                <h3 className="text-lg font-semibold text-white mb-6">
                    Not sure where to start? Try these examples:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleCategories.map((category, index) => (
                        <div
                            key={category.name}
                            className="group rounded-2xl glass glass-border p-6 hover:border-white/15 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:shadow-xl"
                            onClick={() => handleSampleIdeaClick(category.example)}
                        >
                            <div className="mb-4">
                                <h4 className="font-semibold text-white mb-1">{category.name}</h4>
                                <div className="text-sm text-slate-300">{category.description}</div>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed mb-3">
                                {category.example}
                            </p>
                            <div className="text-xs text-indigo-300 font-medium">
                                📱 {category.platforms}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                                Phase 3: Enhanced platform coverage
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default HomePage;
