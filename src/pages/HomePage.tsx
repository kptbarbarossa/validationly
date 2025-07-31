
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateIdea } from '../services/geminiService';
import type { ValidationResult, UserInput } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import EnhancedLoadingSpinner from '../components/EnhancedLoadingSpinner';
import Logo from '../components/Logo';

const sampleCategories = [
    {
        name: "SaaS & B2B",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
        ),
        description: "Business software solutions",
        example: "SaaS platform for automated invoice processing using AI"
    },
    {
        name: "Mobile Apps",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
            </svg>
        ),
        description: "Consumer mobile applications",
        example: "Mobile fitness app with AI-powered workout recommendations"
    },
    {
        name: "E-commerce",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
        ),
        description: "Online retail & marketplaces",
        example: "Sustainable fashion marketplace for eco-conscious consumers"
    },
    {
        name: "Fintech",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
        ),
        description: "Financial technology solutions",
        example: "Mobile app for real-time expense splitting with friends"
    },
    {
        name: "Health & Wellness",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
        ),
        description: "Healthcare & fitness solutions",
        example: "Mental health app with AI-powered mood tracking"
    },
    {
        name: "Productivity",
        icon: (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
        ),
        description: "Tools for better productivity",
        example: "Web dashboard for social media content scheduling"
    }
];



const HomePage: React.FC = () => {
    const [userInput, setUserInput] = useState<UserInput>({
        idea: '',
        isValid: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    const validateInput = (idea: string): UserInput => {
        const trimmedIdea = idea.trim();

        if (!trimmedIdea) {
            return { idea, isValid: false, errorMessage: 'Please enter an idea to validate.' };
        }

        if (trimmedIdea.length < 3) {
            return { idea, isValid: false, errorMessage: 'Idea must be at least 3 characters long.' };
        }

        if (trimmedIdea.length > 1000) {
            return { idea, isValid: false, errorMessage: 'Idea must be less than 1000 characters.' };
        }

        return { idea, isValid: true };
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        const validation = validateInput(newValue);
        setUserInput(validation);
    };

    const triggerValidation = async () => {
        console.log('triggerValidation called', { isValid: userInput.isValid, idea: userInput.idea });

        if (!userInput.isValid) {
            console.log('Validation failed - input not valid');
            return;
        }

        setIsLoading(true);
        console.log('Starting API call...');

        try {
            const result: ValidationResult = await validateIdea(userInput.idea);
            console.log('API call successful', result);
            navigate('/results', { state: { result } });
        } catch (err) {
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
        const validation = validateInput(sampleIdea);
        setUserInput(validation);
        textareaRef.current?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="text-center max-w-4xl mx-auto">
            {/* Enhanced Hero Section - Reduced spacing */}
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-3xl blur-3xl"></div>

                <div className="relative z-10 py-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Logo size="lg" showText={true} />
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Validate your idea
                        </span>
                        <br />
                        <span className="text-indigo-600">before you build it</span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                        Get AI-driven market validation in seconds. Analyze demand across social platforms with actionable insights.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
                <div className="mb-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>

                        <div className="relative bg-white rounded-2xl border-2 border-gray-100 hover:border-indigo-200 transition-colors">
                            <textarea
                                ref={textareaRef}
                                value={userInput.idea}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe your startup idea... (e.g., AI-powered fitness app for busy professionals)"
                                className="w-full p-6 pr-16 bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-lg min-h-[120px]"
                                rows={4}
                                disabled={isLoading}
                                aria-describedby={userInput.errorMessage ? "error-message" : undefined}
                            />

                            {/* Character counter */}
                            <div className="absolute bottom-3 left-6 text-sm text-gray-400">
                                {userInput.idea.length}/1000
                            </div>

                            {/* Enhanced submit button */}
                            <button
                                type="button"
                                onClick={triggerValidation}
                                disabled={!userInput.isValid || isLoading}
                                className={`absolute bottom-3 right-3 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${userInput.isValid && !isLoading
                                    ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white hover:scale-105 cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                aria-label="Submit idea for validation"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {userInput.errorMessage && (
                        <div id="error-message" className="text-red-500 text-sm mt-2 text-left">
                            {userInput.errorMessage}
                        </div>
                    )}
                    {isLoading && <EnhancedLoadingSpinner />}
                </div>


            </form>

            <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">
                    Not sure where to start? Try these examples:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleCategories.map((category, index) => (
                        <div
                            key={category.name}
                            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                            onClick={() => handleSampleIdeaClick(category.example)}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300">
                                    {category.icon}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                                    <div className="text-sm text-gray-500">{category.description}</div>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                {category.example}
                            </p>
                            <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700 transition-colors">
                                <span>Try this example</span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
