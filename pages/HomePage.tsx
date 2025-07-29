import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateIdea } from '../services/geminiService';
import type { ValidationResult } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const sampleIdeas = [
    "AI-powered meal planner for dietary restrictions",
    "Platform to connect local artists with cafes for wall art",
    ];

const MagnifyingGlassIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);
  

const HomePage: React.FC = () => {
    const [idea, setIdea] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        textareaRef.current?.focus();
    }, []);
    
    const triggerValidation = async () => {
        if (!idea.trim()) {
            setError('Please enter an idea to validate.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result: ValidationResult = await validateIdea(idea);
            navigate('/results', { state: { result } });
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
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
    }

    const handleSampleIdeaClick = (sampleIdea: string) => {
        setIdea(sampleIdea);
        textareaRef.current?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-3xl font-bold text-gray-900 mb-4 tracking-tight">Validate your idea before you build it.</h1>
            <p className="text-lg text-gray-600 mb-10">Why guess? Get an AI-driven demand forecast instantly.</p>

            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl shadow-gray-200/80">
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="flex flex-col gap-4">
                        <textarea
                            ref={textareaRef}
                            value={idea}
                            onChange={(e) => {
                                setIdea(e.target.value);
                                if(error) setError(null);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. AI reading coach that sets your daily focus"
                            className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200/90 text-gray-900 focus:ring-2 focus:ring-indigo-400/50 focus:border-indigo-400 focus:outline-none transition duration-200 min-h-[120px] resize-none"
                            rows={4}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !idea.trim()}
                            className="w-full flex justify-center items-center gap-3 font-semibold py-3 px-6 rounded-full text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <LoadingSpinner />
                                    Analyzing...
                                </>
                            ) : (
                               <>
                               <MagnifyingGlassIcon />
                               Validate This Idea
                               </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            <div className="mt-16 pt-8 border-t border-gray-200/80">
                <h3 className="text-lg font-semibold text-gray-600 mb-6">Not sure where to start? Try an example:</h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {sampleIdeas.map((sample, index) => (
                        <button
                            key={index}
                            onClick={() => handleSampleIdeaClick(sample)}
                            disabled={isLoading}
                            className="border border-gray-300 bg-transparent text-gray-600 px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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