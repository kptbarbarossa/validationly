
import React, { useState, useRef, useEffect } from 'react';
// import { PLATFORM_COUNT } from '../constants/platforms';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// Direct API call - no service layer needed
import type { UserInput } from '../types';
import { ValidationProgress } from '../components/LoadingStates';
import PromptGallery from '../components/PromptGallery';
// import Logo from '../components/Logo';
import { useAnalytics } from '../components/Analytics';
import { SEOHead } from '../components/SEOHead';
// import RelatedStartups from '../components/RelatedStartups';
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

    const triggerValidation = async () => {
        if (!userInput.isValid || isLoading) return;

        setIsLoading(true);
        trackValidation(userInput.idea);

        try {
            const response = await fetch('/api/v1/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(user && { 'x-user-id': user.id })
                },
                body: JSON.stringify({
                    idea: userInput.idea,
                    platform: 'general',
                    optimize: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                trackEvent('validation_success', { idea: userInput.idea });
                navigate('/results', {
                    state: {
                        result: data.result,
                        idea: userInput.idea
                    }
                });
            } else {
                throw new Error(data.error || 'Validation failed');
            }

        } catch (error) {
            console.error('❌ Error in validation:', error);
            trackEvent('validation_error', { error: error instanceof Error ? error.message : 'Unknown error' });
            // Handle error appropriately
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptimize = async () => {
        if (!userInput.isValid || isOptimizing) return;

        setIsOptimizing(true);
        trackEvent('optimize_clicked', { idea: userInput.idea });

        try {
            const optimizedPrompt = await optimizePromptRemotely(userInput.idea);
            if (optimizedPrompt) {
                const validation = validateInput(optimizedPrompt);
                setUserInput(validation);
                textareaRef.current?.focus();
                trackEvent('optimize_success', { idea: userInput.idea });
            }
        } catch (error) {
            console.error('❌ Error in optimization:', error);
            trackEvent('optimize_error', { error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
            setIsOptimizing(false);
        }
    };

    return (
        <>
            <SEOHead
                title="Validationly - AI-Powered Startup Idea Validation"
                description="Validate your startup ideas with AI-powered analysis. Get comprehensive insights, market validation, and strategic recommendations."
                keywords="startup validation, idea validation, AI analysis, market research, business validation"
            />

            <div className="min-h-screen text-white">
                <div className="container mx-auto px-6 py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            AI-Powered Startup Validation
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                            Validate your startup ideas with comprehensive AI analysis. Get market insights, competitive analysis, and strategic recommendations.
                        </p>
                        
                        {/* Auth Section */}
                        {!user ? (
                            <div className="flex justify-center space-x-4 mb-8">
                                <button
                                    onClick={signInWithGoogle}
                                    className="px-6 py-3 bg-white/10 backdrop-blur rounded-xl text-white font-medium hover:bg-white/20 transition-all flex items-center space-x-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                    <span>Sign in with Google</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center space-x-4 mb-8">
                                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur rounded-xl px-4 py-2">
                                    <img 
                                        src={user.photoURL} 
                                        alt={user.displayName}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-white font-medium">{user.displayName}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Main Form */}
                    <form onSubmit={(e) => { e.preventDefault(); triggerValidation(); }} className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="relative bg-white/5 backdrop-blur rounded-3xl border border-white/10 p-6 shadow-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <label htmlFor="idea-input" className="block text-sm font-medium text-gray-300 mb-2">
                                            Describe your startup idea
                                        </label>
                                        <textarea
                                            ref={textareaRef}
                                            id="idea-input"
                                            value={userInput.idea}
                                            onChange={handleInputChange}
                                            placeholder="e.g., A mobile app that helps people find local fitness buddies based on their workout preferences and schedule..."
                                            className="w-full h-32 bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col gap-3">
                                        {/* Optimize Button */}
                                        <button
                                            type="button"
                                            onClick={handleOptimize}
                                            disabled={!userInput.isValid || isOptimizing}
                                            className={`group relative w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 border border-white/20 backdrop-blur-sm shadow-lg overflow-hidden ${userInput.isValid && !isOptimizing
                                                ? 'hover:scale-110 cursor-pointer opacity-100 hover:shadow-xl hover:shadow-purple-500/25 hover:from-purple-500 hover:to-pink-500 active:scale-95'
                                                : 'cursor-not-allowed opacity-50 grayscale'
                                                }`}
                                            aria-label="Optimize idea description"
                                        >
                                            {/* Rotating light effect around optimize button */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-75 blur animate-rotate-light"></div>
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full opacity-50 blur animate-pulse-glow"></div>
                                            
                                            {/* Animated background gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 opacity-0 hover:opacity-100 transition-opacity duration-300 animate-gradient-x rounded-full"></div>

                                            {/* Ripple effect on click */}
                                            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 animate-ping opacity-0 group-active:scale-100 group-active:opacity-100 transition-all duration-200"></div>

                                            {/* Icon container */}
                                            <div className="relative z-10 flex items-center justify-center">
                                                {isOptimizing ? (
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
                                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                        />
                                                    </svg>
                                                )}
                                            </div>

                                            {/* Glow effect */}
                                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 blur-md opacity-50 -z-10 group-hover:opacity-75 transition-opacity duration-300"></div>
                                        </button>

                                        {/* Submit Button */}
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



                    </div>

                    {userInput.errorMessage && (
                        <div id="error-message" className="text-red-400 text-sm mt-2 text-left">
                            {userInput.errorMessage}
                        </div>
                    )}
                    {/* Loading spinner removed as requested */}
                </form>

                {/* Simple Prompt Gallery */}
                <PromptGallery
                    onUse={(text) => {
                        const validation = validateInput(text);
                        setUserInput(validation);
                        textareaRef.current?.focus();
                    }}
                />

                {/* RelatedStartups section removed by request */}
            </div>
        </>
    );
};

export default HomePage;


