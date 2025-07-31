
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateIdea } from '../services/geminiService';
import type { ValidationResult, UserInput } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleIdeas = [
    "SaaS platform for automated invoice processing using AI",
    "Mobile app for real-time expense splitting with friends",
    "Web dashboard for social media content scheduling",
    "Mobile fitness app with AI-powered workout recommendations"
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
        <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                Validate your idea before you build it.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
                Why guess? Get an AI-driven demand forecast instantly.
            </p>

            <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
                <div className="mb-4">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={userInput.idea}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Validate your idea"
                            className={`w-full p-6 pr-16 rounded-2xl bg-gray-50 border text-gray-900 focus:ring-0 focus:border-indigo-400 focus:outline-none min-h-[120px] resize-none text-left text-base transition-all duration-200 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] focus:shadow-[0_8px_30px_rgb(0,0,0,0.16)] ${userInput.errorMessage
                                ? 'border-red-300 focus:border-red-400'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                            rows={4}
                            disabled={isLoading}
                            aria-describedby={userInput.errorMessage ? "error-message" : undefined}
                        />
                        <button
                            type="button"
                            onClick={triggerValidation}
                            disabled={!userInput.isValid || isLoading}
                            className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${userInput.isValid && !isLoading
                                ? 'bg-black hover:bg-gray-800 text-white cursor-pointer'
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
                    {userInput.errorMessage && (
                        <div id="error-message" className="text-red-500 text-sm mt-2 text-left">
                            {userInput.errorMessage}
                        </div>
                    )}
                    {isLoading && (
                        <div className="flex items-center justify-center gap-2 mt-3 text-indigo-600">
                            <LoadingSpinner />
                            <span className="text-sm">Analyzing your idea...</span>
                        </div>
                    )}
                </div>


            </form>

            <div className="mt-12">
                <h3 className="text-base font-medium text-gray-600 mb-6">
                    Not sure where to start? Try an example:
                </h3>
                <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                    {sampleIdeas.map((sample, index) => (
                        <button
                            key={index}
                            onClick={() => handleSampleIdeaClick(sample)}
                            disabled={isLoading}
                            className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
                            aria-label={`Try example: ${sample}`}
                        >
                            {sample}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
