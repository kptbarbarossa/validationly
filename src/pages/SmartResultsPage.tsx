import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DynamicPromptResult } from '../types';
import SEOHead from '../components/SEOHead';

function detectLanguage(text: string): boolean {
    return /[çğıöşüÇĞİÖŞÜ]/.test(text);
}

export default function SmartResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [result, setResult] = useState<DynamicPromptResult | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (location.state?.result) {
            setResult(location.state.result);
            setLoading(false);
        } else {
            navigate('/');
        }
    }, [location.state, navigate]);

    if (loading || !result) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }

    const isTR = detectLanguage(result.idea || result.content || '');

    return (
        <>
            <SEOHead 
                title={`${result.idea || result.content} - Validation Report | Validationly`}
                description={`Validation Score: ${result.demandScore}/100`}
            />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                {/* Header */}
                <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/logo.png" alt="Validationly" className="w-8 h-8" />
                                <span className="text-lg font-semibold">Validationly</span>
                            </div>
                            <button
                                onClick={() => navigate('/')}
                                className="text-sm px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                            >
                                {isTR ? 'Yeni Analiz' : 'New Analysis'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    {/* Big Score */}
                    <div className="text-center mb-16">
                        <div className="text-8xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                            {result.demandScore}
                        </div>
                        <div className="text-2xl text-slate-300 mb-8">
                            {isTR ? 'Validasyon Skoru' : 'Validation Score'}
                        </div>
                    </div>

                    {/* Idea Title */}
                    <div className="text-center mb-16">
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-8 leading-relaxed">
                            "{result.idea || result.content}"
                        </h1>
                    </div>

                    {/* Tweet Series Generator */}
                    <div className="text-center mb-16">
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                            <div className="text-6xl mb-6">🐦</div>
                            <h2 className="text-2xl font-bold text-white mb-4">
                                {isTR ? 'Tweet Serisi Üreticisi' : 'Tweet Series Generator'}
                            </h2>
                            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                                {isTR 
                                    ? 'Fikrini sosyal medyada test etmek için 5 tweet\'lik build-in-public serisi üret'
                                    : 'Generate a 5-tweet build-in-public series to test your idea on social media'
                                }
                            </p>
                            <button
                                onClick={() => navigate('/tweet-generator', { 
                                    state: { 
                                        idea: result.idea || result.content,
                                        industry: '',
                                        targetAudience: ''
                                    }
                                })}
                                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-lg"
                            >
                                <span className="text-xl">🚀</span>
                                {isTR ? 'Tweet Serisi Üret' : 'Generate Tweet Series'}
                            </button>
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-xl font-semibold text-white transition-all transform hover:scale-105"
                        >
                            <span className="text-xl">✨</span>
                            {isTR ? 'Başka Fikir Analiz Et' : 'Analyze Another Idea'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
