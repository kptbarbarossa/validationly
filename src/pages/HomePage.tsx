
import React, { useState, useRef, useEffect } from 'react';
import { PLATFORM_COUNT } from '../constants/platforms';
import { useNavigate } from 'react-router-dom';
// Direct API call - no service layer needed
import type { UserInput } from '../types';
// import LoadingSpinner from '../components/LoadingSpinner';
import EnhancedLoadingSpinner from '../components/EnhancedLoadingSpinner';
import PromptGallery from '../components/PromptGallery';
// import Logo from '../components/Logo';
import { useAnalytics } from '../components/Analytics';
import SEOHead from '../components/SEOHead';
// import RelatedStartups from '../components/RelatedStartups';

// Sample categories removed



const HomePage: React.FC = () => {
    const [userInput, setUserInput] = useState<UserInput>({
        idea: '',
        isValid: false,
        errorMessage: '' as unknown as string // exactOptionalPropertyTypes workaround
    });
    const [isLoading, setIsLoading] = useState(false); // analysis submit loading
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [isEnhancing, setIsEnhancing] = useState(false); // enhance-only loading
    // const [enhancedPrompt] = useState(false);
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
            // Direct API call to our fast validate system
            const ideaPayload = userInput.idea;
            const response = await fetch('/api/fast-validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idea: ideaPayload })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const apiResponse = await response.json();
            
            if (!apiResponse.ok) {
                throw new Error(apiResponse.message || 'API call failed');
            }

            const result = apiResponse.result;
            console.log('API call successful', result);
            
            // Track successful validation
            trackValidation(userInput.idea, result.score);
            
            navigate('/results', { state: { result, fastMode: true } });
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
                        Get AI-driven market validation in seconds. Analyze demand across social platforms with actionable insights.
                    </p>

                    {/* Feature badges with dynamic platform count */}
                    <HomeFeatureBadges />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
                <div className="mb-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>

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

                            {/* Enhanced action bar: Submit + Enhance + Gallery */}
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                {/* fast mode removed by request */}
                                <button
                                    type="button"
                                    onClick={() => setGalleryOpen(true)}
                                    className="text-xs px-3 py-1.5 rounded-full border transition-colors bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10"
                                    aria-label="Open prompt gallery"
                                    title="Open prompt gallery"
                                >
                                    Prompt Gallery
                                </button>
                            <button
                                    type="button"
                                    onClick={async () => {
                                        if (isLoading || isEnhancing) return;
                                        setIsEnhancing(true);
                                        const enhanced = await enhancePromptRemotely(userInput.idea);
                                        if (enhanced) {
                                            const validation = validateInput(enhanced);
                                            setUserInput(validation);
                                        }
                                        setIsEnhancing(false);
                                    }}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors bg-white/5 text-slate-300 border-white/10 hover:border-white/20 hover:bg-white/10 ${isEnhancing ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                                    aria-label="Enhance prompt"
                                    title="Enhance prompt"
                                    disabled={isEnhancing || isLoading}
                                >
                                    {isEnhancing ? (
                                        <span className="inline-flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path>
                                            </svg>
                                            Enhancing…
                                        </span>
                                    ) : (
                                        '✨ Enhance'
                                    )}
                                </button>
                            <button
                                type="button"
                                onClick={triggerValidation}
                                disabled={!userInput.isValid || isLoading}
                                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm ${userInput.isValid && !isLoading
                                    ? 'hover:scale-110 cursor-pointer opacity-100 hover:bg-white/10 hover:border-white/20'
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
                    </div>
                    {userInput.errorMessage && (
                        <div id="error-message" className="text-red-400 text-sm mt-2 text-left">
                            {userInput.errorMessage}
                        </div>
                    )}
                    {isLoading && <EnhancedLoadingSpinner />}
                </div>


            </form>

            {/* Prompt Gallery Modal */}
            <PromptGallery
                open={galleryOpen}
                onClose={() => setGalleryOpen(false)}
                onUse={(text) => {
                    const validation = validateInput(text);
                    setUserInput(validation);
                    setGalleryOpen(false);
                    textareaRef.current?.focus();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />

            {/* Removed sample ideas section (Prompt Gallery replaces it) */}

            {/* Feedback wall removed by request */}

				{/* RelatedStartups section removed by request */}
        </div>
        </>
    );
};

export default HomePage;

// Local component to render feature badges with dynamic platform count
const HomeFeatureBadges: React.FC = () => {
    const platformCount = PLATFORM_COUNT;
    return (
        <div className="flex flex-wrap justify-center gap-3 mt-4 animate-slide-up delay-300">
            <div className="px-4 py-2 bg-white/5 border border-white/10 text-slate-200 rounded-full text-sm inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                AI-Powered Analysis
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 text-slate-200 rounded-full text-sm inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-400 rounded-full"></span>
                {platformCount}+ Platforms
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 text-slate-200 rounded-full text-sm inline-flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-purple-400 rounded-full"></span>
                Instant Results
            </div>
        </div>
    );
};
