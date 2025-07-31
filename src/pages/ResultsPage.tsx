
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ValidationResult } from '../types';
import ScoreBar from '../components/ScoreBar';
import SuggestionCard from '../components/SuggestionCard';

// --- SVG Icons ---
const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
);

const SignalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 0 1.5h-.008A.75.75 0 0 1 12 20.25Z" />
    </svg>
);

const StrategyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);



const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12.0003 2.00002C6.47744 2.00002 2.00031 6.47715 2.00031 12C2.00031 17.5229 6.47744 22 12.0003 22C17.5232 22 22.0003 17.5229 22.0003 12C22.0003 6.47715 17.5232 2.00002 12.0003 2.00002ZM12.0003 19.5C8.41044 19.5 5.50031 16.59 5.50031 13C5.50031 11.215 6.25531 9.59502 7.50031 8.5C7.50031 8.5 8.75031 9.25002 8.75031 10.5C8.75031 10.5 9.75031 11.25 11.2503 11.25C12.7503 11.25 13.7503 10.5 13.7503 10.5C13.7503 9.25002 15.0003 8.5 15.0003 8.5C16.2453 9.59502 17.0003 11.215 17.0003 13C17.0003 16.59 14.0903 19.5 12.0003 19.5ZM9.00031 14.25C8.31031 14.25 7.75031 13.69 7.75031 13C7.75031 12.31 8.31031 11.75 9.00031 11.75C9.69031 11.75 10.2503 12.31 10.2503 13C10.2503 13.69 9.69031 14.25 9.00031 14.25ZM15.0003 14.25C14.3103 14.25 13.7503 13.69 13.7503 13C13.7503 12.31 14.3103 11.75 15.0003 11.75C15.6903 11.75 16.2503 12.31 16.2503 13C16.2503 13.69 15.6903 14.25 15.0003 14.25ZM15.8253 16.62C15.8253 16.62 15.1953 17.625 12.0003 17.625C8.80531 17.625 8.17531 16.62 8.17531 16.62C8.04031 16.41 8.17531 16.125 8.41531 16.125H15.5853C15.8253 16.125 15.9603 16.41 15.8253 16.62Z" />
    </svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);



const PlatformIcons: { [key: string]: React.FC } = {
    X: XIcon,
    Twitter: XIcon, // Backward compatibility
    Reddit: RedditIcon,
    LinkedIn: LinkedInIcon,
};

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as ValidationResult;
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [expandedPlatforms, setExpandedPlatforms] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (!result) {
            navigate('/');
            return;
        }
        window.scrollTo(0, 0);
    }, [result, navigate]);

    if (!result) {
        return null;
    }

    const handleCopyToClipboard = async (text: string, id: string, onCopy?: () => void) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            if (onCopy) onCopy();
            setTimeout(() => setCopiedId(null), 2500);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const handleTweet = () => {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.tweetSuggestion)}`;
        window.open(tweetUrl, '_blank', 'noopener,noreferrer');
    };

    const handlePostToReddit = () => {
        const title = result.redditTitleSuggestion;
        const body = result.redditBodySuggestion;
        const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&selftext=${encodeURIComponent(body)}`;
        window.open(redditUrl, '_blank', 'noopener,noreferrer');
    };

    const handlePostToLinkedIn = () => {
        handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-post', () => {
            window.open('https://www.linkedin.com/feed/', '_blank', 'noopener,noreferrer');
        });
    };

    const togglePlatformExpand = (platform: string) => {
        setExpandedPlatforms(prev => ({
            ...prev,
            [platform]: !prev[platform]
        }));
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'X':
            case 'Twitter':
                return 'bg-black text-white';
            case 'Reddit':
                return 'bg-orange-500 text-white';
            case 'LinkedIn':
                return 'bg-blue-600 text-white';
            default:
                return 'bg-indigo-500 text-white';
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/80 mb-10">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                    "{result.idea}"
                </h1>

                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-3">
                        <ChartBarIcon /> Demand Score
                    </h2>
                    <ScoreBar score={result.demandScore} text={result.scoreJustification} />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                        <SignalIcon /> Signal Summary
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {result.signalSummary.map((signal, index) => {
                            const Icon = PlatformIcons[signal.platform];
                            const isExpanded = expandedPlatforms[signal.platform];
                            const shouldTruncate = signal.summary.length > 200;
                            
                            return (
                                <div 
                                    key={signal.platform} 
                                    className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Platform header */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getPlatformColor(signal.platform)}`}>
                                            {Icon && <Icon />}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{signal.platform}</h3>
                                            <div className="text-sm text-gray-500">Market Signals</div>
                                        </div>
                                    </div>
                                    
                                    {/* Summary with expand/collapse */}
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        <p className={shouldTruncate && !isExpanded ? 'line-clamp-3' : ''}>
                                            {signal.summary}
                                        </p>
                                        {shouldTruncate && (
                                            <button 
                                                onClick={() => togglePlatformExpand(signal.platform)}
                                                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 transition-colors"
                                            >
                                                {isExpanded ? 'Show less' : 'Read more'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                        <StrategyIcon /> Validation Strategies
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.validationStrategies?.map((strategy, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                                    {strategy.title}
                                </h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {strategy.description}
                                </p>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">Action Steps:</h4>
                                    <ul className="space-y-2">
                                        {strategy.steps.map((step, stepIndex) => (
                                            <li key={stepIndex} className="flex items-start gap-2">
                                                <span className="flex-shrink-0 w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-medium mt-0.5">
                                                    {stepIndex + 1}
                                                </span>
                                                <span className="text-gray-600 text-sm">{step}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                <SuggestionCard
                    icon={<XIcon />}
                    title="X Post Suggestion"
                    content={result.tweetSuggestion}
                    actions={[
                        {
                            id: 'tweet-post',
                            label: 'Post to X',
                            handler: handleTweet
                        },
                        {
                            id: 'tweet-copy',
                            label: 'Copy Text',
                            handler: () => handleCopyToClipboard(result.tweetSuggestion, 'tweet-copy'),
                            copiedLabel: 'Copied!'
                        }
                    ]}
                    copiedId={copiedId}
                />

                <SuggestionCard
                    icon={<RedditIcon />}
                    title="Reddit Post Suggestion"
                    content={
                        <>
                            <p className="font-semibold text-gray-800">{result.redditTitleSuggestion}</p>
                            <p className="mt-2 text-gray-600">{result.redditBodySuggestion}</p>
                        </>
                    }
                    actions={[
                        {
                            id: 'reddit-post',
                            label: 'Post to Reddit',
                            handler: handlePostToReddit
                        },
                        {
                            id: 'reddit-copy',
                            label: 'Copy Text',
                            handler: () => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit-copy'),
                            copiedLabel: 'Copied!'
                        }
                    ]}
                    copiedId={copiedId}
                />

                <SuggestionCard
                    icon={<LinkedInIcon />}
                    title="LinkedIn Post Suggestion"
                    content={result.linkedinSuggestion}
                    actions={[
                        {
                            id: 'linkedin-post',
                            label: 'Post to LinkedIn',
                            handler: handlePostToLinkedIn,
                            copiedLabel: 'Copied! Now Paste'
                        },
                        {
                            id: 'linkedin-copy',
                            label: 'Copy Text',
                            handler: () => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-copy'),
                            copiedLabel: 'Copied!'
                        }
                    ]}
                    copiedId={copiedId}
                />
            </div>

            <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto font-semibold py-3 px-8 rounded-full text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-90 transition-all duration-200"
                    aria-label="Try another idea"
                >
                    Try another idea
                </button>
                <a
                    href="https://buymeacoffee.com/kptbarbarossa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center font-semibold py-3 px-6 rounded-full text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 hover:opacity-90 transition-all duration-200"
                    aria-label="Buy me a coffee"
                >
                    Buy me a coffee
                </a>
                <a
                    href="https://x.com/kptbarbarossa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center font-semibold py-3 px-6 rounded-full text-white bg-black hover:bg-gray-800 transition-all duration-200"
                    aria-label="Feedback on X"
                >
                    Feedback on X
                </a>
            </div>
        </div>
    );
};

export default ResultsPage;
