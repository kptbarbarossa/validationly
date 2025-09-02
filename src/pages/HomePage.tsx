
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserInput } from '../types';
import { SEOHead } from '../components/SEOHead';
import GoogleSignInButton from '../components/GoogleOneTap';
import PromptGallery from '../components/PromptGallery';
import IdeaHistory from '../components/IdeaHistory';
import CapacityCard from '../components/tool-cards/CapacityCard';
import StoryShortCard from '../components/tool-cards/StoryShortCard';
import LoginToSeePriceCard from '../components/tool-cards/LoginToSeePriceCard';
import NextUpKitCard from '../components/tool-cards/NextUpKitCard';
import TapReferCard from '../components/tool-cards/TapReferCard';
import DOMPurify from 'dompurify';

const HomePage: React.FC = () => {
    const [userInput, setUserInput] = useState<UserInput>({ idea: '', isValid: false });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { user } = useAuth();

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const validateInput = (idea: string): UserInput => {
        const sanitizedIdea = DOMPurify.sanitize(idea, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }).trim();
        if (!sanitizedIdea) return { idea, isValid: false, errorMessage: 'Please enter an idea.' };
        if (sanitizedIdea.length < 10) return { idea, isValid: false, errorMessage: 'Idea must be at least 10 characters.' };
        if (sanitizedIdea.length > 1000) return { idea, isValid: false, errorMessage: 'Idea must be less than 1000 characters.' };
        return { idea, isValid: true };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(validateInput(e.target.value));
    };

    const triggerValidation = async () => {
        if (!userInput.isValid || isLoading) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...(user && { 'x-user-id': user.id }) },
                body: JSON.stringify({ idea: userInput.idea }),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const result = await response.json();
            navigate('/results', { state: { result } });
        } catch (error: any) {
            setUserInput(prev => ({ ...prev, errorMessage: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            triggerValidation();
        }
    };

    return (
        <>
            <SEOHead
                title="Validationly - AI-Powered Startup Idea Validation"
                description="Get AI-driven market validation for your startup idea in seconds. Analyze demand across multiple platforms with actionable insights."
            />
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Validate Your Idea <span className="text-indigo-400">Before You Build It</span>
                        </h1>
                        <p className="text-lg text-slate-300 mb-8">
                            Get instant insights from 7+ platforms and find the exact tools to build smarter.
                        </p>

                        {!user && (
                            <div className="mb-8">
                                <p className="text-slate-300 mb-4">Sign in to save your history and unlock more features.</p>
                                <GoogleSignInButton />
                            </div>
                        )}

                        <form onSubmit={(e) => { e.preventDefault(); triggerValidation(); }} className="relative">
                            <textarea
                                ref={textareaRef}
                                value={userInput.idea}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe your startup idea..."
                                className="w-full p-4 pr-16 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-lg text-white"
                                rows={4}
                                disabled={isLoading}
                            />
                            <div className="absolute bottom-3 right-3">
                                <button
                                    type="submit"
                                    disabled={!userInput.isValid || isLoading}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed transition-all"
                                >
                                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🚀'}
                                </button>
                            </div>
                        </form>
                        {userInput.errorMessage && <p className="mt-2 text-red-400">{userInput.errorMessage}</p>}
                        
                        <div className="mt-8">
                            <PromptGallery onSelect={(prompt) => setUserInput(validateInput(prompt))} />
                        </div>
                    </div>

                    {user && (
                        <div className="mt-12">
                            <IdeaHistory onSelectIdea={(idea) => setUserInput(validateInput(idea))} />
                        </div>
                    )}
                </div>
            </section>

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white">Founder's Toolkit</h2>
                        <p className="text-slate-400">Curated tools to build, launch, and grow your startup.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
                        <CapacityCard />
                        <StoryShortCard />
                        <LoginToSeePriceCard />
                        <NextUpKitCard />
                        <TapReferCard />
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;


