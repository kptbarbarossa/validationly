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

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FF4500" className="w-8 h-8">
        <path d="M12.0003 2.00002C6.47744 2.00002 2.00031 6.47715 2.00031 12C2.00031 17.5229 6.47744 22 12.0003 22C17.5232 22 22.0003 17.5229 22.0003 12C22.0003 6.47715 17.5232 2.00002 12.0003 2.00002ZM12.0003 19.5C8.41044 19.5 5.50031 16.59 5.50031 13C5.50031 11.215 6.25531 9.59502 7.50031 8.5C7.50031 8.5 8.75031 9.25002 8.75031 10.5C8.75031 10.5 9.75031 11.25 11.2503 11.25C12.7503 11.25 13.7503 10.5 13.7503 10.5C13.7503 9.25002 15.0003 8.5 15.0003 8.5C16.2453 9.59502 17.0003 11.215 17.0003 13C17.0003 16.59 14.0903 19.5 12.0003 19.5ZM9.00031 14.25C8.31031 14.25 7.75031 13.69 7.75031 13C7.75031 12.31 8.31031 11.75 9.00031 11.75C9.69031 11.75 10.2503 12.31 10.2503 13C10.2503 13.69 9.69031 14.25 9.00031 14.25ZM15.0003 14.25C14.3103 14.25 13.7503 13.69 13.7503 13C13.7503 12.31 14.3103 11.75 15.0003 11.75C15.6903 11.75 16.2503 12.31 16.2503 13C16.2503 13.69 15.6903 14.25 15.0003 14.25ZM15.8253 16.62C15.8253 16.62 15.1953 17.625 12.0003 17.625C8.80531 17.625 8.17531 16.62 8.17531 16.62C8.04031 16.41 8.17531 16.125 8.41531 16.125H15.5853C15.8253 16.125 15.9603 16.41 15.8253 16.62Z"/>
    </svg>
);

const LinkedInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
);

const CoffeeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v1.058l1.447.868a1 1 0 01.553.894V13.5a2.5 2.5 0 01-2.5 2.5h-5A2.5 2.5 0 013 13.5V6.82a1 1 0 01.553-.894L5 5.058V4a1 1 0 011-1h4zm0 2H6v1.058l-1.447.868a1 1 0 00-.553.894V13.5a2.5 2.5 0 002.5 2.5h5a2.5 2.5 0 002.5-2.5V6.82a1 1 0 00-.553-.894L14 5.058V5h-4z" clipRule="evenodd" />
        <path d="M14 13.5a1.5 1.5 0 01-1.5 1.5h-5a1.5 1.5 0 010-3h5a1.5 1.5 0 011.5 1.5z" />
    </svg>
);


const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as ValidationResult;
    const [copiedId, setCopiedId] = useState<string | null>(null);

    useEffect(() => {
        if (!result) {
            navigate('/');
        }
        window.scrollTo(0, 0);
    }, [result, navigate]);

    if (!result) {
        return null;
    }

    const handleCopyToClipboard = (text: string, id: string, onCopy?: () => void) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            if (onCopy) onCopy();
            setTimeout(() => setCopiedId(null), 2500);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const handleTweet = () => {
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(result.tweetSuggestion)}`;
        window.open(tweetUrl, '_blank');
    };
    
    const handlePostToReddit = () => {
        const title = result.redditTitleSuggestion;
        const body = result.redditBodySuggestion;
        const redditUrl = `https://www.reddit.com/submit?title=${encodeURIComponent(title)}&selftext=${encodeURIComponent(body)}`;
        window.open(redditUrl, '_blank');
    };

    const handlePostToLinkedIn = () => {
        handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-post', () => {
            window.open('https://www.linkedin.com/feed/', '_blank');
        });
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/80 mb-12">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">“{result.idea}”</h1>
                <div className="mb-10">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                        <ChartBarIcon /> Demand Score
                    </h2>
                    <ScoreBar score={result.demandScore} text={result.scoreJustification} />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-3">
                        <SignalIcon /> Signal Summary
                    </h2>
                    <ul className="space-y-3 list-disc list-inside text-gray-600 pl-2">
                        {result.signalSummary.map((signal, index) => (
                            <li key={index}>{signal}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <SuggestionCard
                    icon={<TwitterIcon />}
                    title="Tweet Suggestion"
                    content={result.tweetSuggestion}
                    actions={[
                        { id: 'tweet-post', label: 'Tweet this', handler: handleTweet },
                        { id: 'tweet-copy', label: 'Copy Text', handler: () => handleCopyToClipboard(result.tweetSuggestion, 'tweet-copy'), copiedLabel: 'Copied!' }
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
                        { id: 'reddit-post', label: 'Post to Reddit', handler: handlePostToReddit },
                        { id: 'reddit-copy', label: 'Copy Text', handler: () => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit-copy'), copiedLabel: 'Copied!' }
                    ]}
                     copiedId={copiedId}
                />
                 <SuggestionCard
                    icon={<LinkedInIcon />}
                    title="LinkedIn Post Suggestion"
                    content={result.linkedinSuggestion}
                    actions={[
                        { id: 'linkedin-post', label: 'Post to LinkedIn', handler: handlePostToLinkedIn, copiedLabel: 'Copied! Now Paste' },
                        { id: 'linkedin-copy', label: 'Copy Text', handler: () => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin-copy'), copiedLabel: 'Copied!' }
                    ]}
                     copiedId={copiedId}
                />
            </div>
            
            <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-4">
                 <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto font-semibold py-3 px-8 rounded-full text-white bg-gradient-to-r from-indigo-500 to-cyan-500 hover:opacity-70 transition-all duration-200"
                >
                    Try another idea
                </button>
                <a
                    href="https://buymeacoffee.com/kptbarbarossa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 font-semibold py-3 px-6 rounded-full text-white bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-600 hover:opacity-90 transition-all duration-200"
                >
                    <CoffeeIcon />
                    Buy me a coffee
                </a>
            </div>
        </div>
    );
};

export default ResultsPage;