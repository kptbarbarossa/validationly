import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PricingModal from '../components/PricingModal';

interface JobTailorResult {
    revised: string;
    error?: string;
}

interface UserPlan {
    plan: 'free' | 'pro';
    dailyUsage: number;
    limit: number;
}

const JobTailorPage: React.FC = () => {
    const [jobDesc, setJobDesc] = useState('');
    const [cvText, setCvText] = useState('');
    const [tone, setTone] = useState<'formal' | 'casual' | 'impact' | 'executive' | 'creative' | 'technical'>('formal');
    const [result, setResult] = useState<JobTailorResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [userPlan, setUserPlan] = useState<UserPlan>({ plan: 'free', dailyUsage: 0, limit: 3 });
    const [showPricingModal, setShowPricingModal] = useState(false);

    const handleGetToken = async () => {
        if (!email.trim()) {
            alert('Please enter your email');
            return;
        }

        try {
            const response = await fetch('/api/auth/issue-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                localStorage.setItem('jobTailorToken', data.token);
                alert('Token saved successfully!');
            } else {
                alert(data.error || 'Failed to get token');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    };

    const handleUpgrade = async (priceId: string) => {
        const currentToken = token || localStorage.getItem('jobTailorToken');
        if (!currentToken) {
            alert('Please get a token first');
            return;
        }

        try {
            const response = await fetch('/api/billing/create-checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ 
                    priceId,
                    successUrl: window.location.origin + '/job-tailor?success=true',
                    cancelUrl: window.location.origin + '/job-tailor?canceled=true'
                })
            });

            const data = await response.json();
            if (response.ok && data.url) {
                window.location.href = data.url;
            } else {
                alert(data.error || 'Failed to create checkout session');
            }
        } catch (error) {
            alert('Network error. Please try again.');
        }
    };

    const handleRewrite = async () => {
        if (!jobDesc.trim() || !cvText.trim()) {
            alert('Please fill in both job description and CV text');
            return;
        }

        const currentToken = token || localStorage.getItem('jobTailorToken');
        if (!currentToken) {
            alert('Please get a token first');
            return;
        }

        // Check quota for free users
        if (userPlan.plan === 'free' && userPlan.dailyUsage >= userPlan.limit) {
            setShowPricingModal(true);
            return;
        }

        setIsLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/rewrite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ jobDesc, cvText, tone })
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ revised: data.revised });
                // Update usage count for free users
                if (userPlan.plan === 'free') {
                    setUserPlan(prev => ({ ...prev, dailyUsage: prev.dailyUsage + 1 }));
                }
            } else {
                setResult({ revised: '', error: data.error || 'Failed to rewrite CV' });
            }
        } catch (error) {
            setResult({ revised: '', error: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (result?.revised) {
            await navigator.clipboard.writeText(result.revised);
            alert('Copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Job Tailor
                    </h1>
                    <p className="text-xl text-slate-300 mb-6">
                        AI-powered CV optimization for specific job applications
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to="/"
                            className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            ← Back to Validationly
                        </Link>
                    </div>
                </div>

                {/* Auth Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-4">Authentication</h2>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            onClick={handleGetToken}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Get Token
                        </button>
                    </div>
                    {token && (
                        <div className="mt-4 space-y-2">
                            <p className="text-green-400 text-sm">✓ Token saved successfully</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-300">
                                        Plan: <span className="font-medium text-white">{userPlan.plan === 'free' ? 'Free' : 'Pro'}</span>
                                    </span>
                                    {userPlan.plan === 'free' && (
                                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                            {userPlan.dailyUsage}/{userPlan.limit} used today
                                        </span>
                                    )}
                                </div>
                                {userPlan.plan === 'free' && (
                                    <button
                                        onClick={() => setShowPricingModal(true)}
                                        className="text-sm bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-1 rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all"
                                    >
                                        Upgrade to Pro
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Form */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">Job Description</h3>
                            <textarea
                                value={jobDesc}
                                onChange={(e) => setJobDesc(e.target.value)}
                                placeholder="Paste the job description here..."
                                rows={8}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <h3 className="text-lg font-semibold text-white mb-4">Your CV Text</h3>
                            <textarea
                                value={cvText}
                                onChange={(e) => setCvText(e.target.value)}
                                placeholder="Paste your CV content here..."
                                rows={8}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            />
                        </div>

                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-white">Tone</h3>
                                {userPlan.plan === 'free' && (
                                    <button
                                        onClick={() => setShowPricingModal(true)}
                                        className="text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-3 py-1 rounded-full hover:from-indigo-700 hover:to-cyan-700 transition-all"
                                    >
                                        Unlock Pro Tones
                                    </button>
                                )}
                            </div>
                            <select
                                value={tone}
                                onChange={(e) => setTone(e.target.value as any)}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="formal">Formal</option>
                                <option value="casual">Casual</option>
                                <option value="impact">Impact</option>
                                {userPlan.plan === 'pro' && (
                                    <>
                                        <option value="executive">Executive (Pro)</option>
                                        <option value="creative">Creative (Pro)</option>
                                        <option value="technical">Technical (Pro)</option>
                                    </>
                                )}
                            </select>
                            {userPlan.plan === 'free' && (
                                <p className="text-xs text-slate-400 mt-2">
                                    🔒 Executive, Creative, and Technical tones available in Pro
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleRewrite}
                            disabled={isLoading || !jobDesc.trim() || !cvText.trim()}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                userPlan.plan === 'pro' ? 'Rewriting CV (Priority)...' : 'Rewriting CV...'
                            ) : (
                                userPlan.plan === 'free' && userPlan.dailyUsage >= userPlan.limit ? 
                                'Upgrade to Continue' : 'Rewrite CV'
                            )}
                        </button>
                        
                        {userPlan.plan === 'free' && userPlan.dailyUsage >= userPlan.limit && (
                            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                <p className="text-amber-400 text-sm text-center">
                                    🚀 You've reached your daily limit. Upgrade to Pro for unlimited CV rewrites!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white">Optimized CV</h3>
                            {result?.revised && (
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm"
                                >
                                    Copy
                                </button>
                            )}
                        </div>

                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                <span className="ml-3 text-slate-300">AI is optimizing your CV...</span>
                            </div>
                        )}

                        {result?.error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                <p className="text-red-400">{result.error}</p>
                            </div>
                        )}

                        {result?.revised && (
                            <textarea
                                value={result.revised}
                                readOnly
                                rows={20}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none resize-none"
                            />
                        )}

                        {!isLoading && !result && (
                            <div className="text-center py-12 text-slate-400">
                                <p>Your optimized CV will appear here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                        <div className="text-3xl mb-4">🎯</div>
                        <h3 className="text-lg font-semibold text-white mb-2">Targeted Optimization</h3>
                        <p className="text-slate-300 text-sm">AI analyzes job requirements and tailors your CV accordingly</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                        <div className="text-3xl mb-4">⚡</div>
                        <h3 className="text-lg font-semibold text-white mb-2">Instant Results</h3>
                        <p className="text-slate-300 text-sm">Get your optimized CV in seconds, not hours</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                        <div className="text-3xl mb-4">🔒</div>
                        <h3 className="text-lg font-semibold text-white mb-2">Privacy First</h3>
                        <p className="text-slate-300 text-sm">Your CV data is not stored, ensuring complete privacy</p>
                    </div>
                </div>
            </div>

            {/* Pricing Modal */}
            <PricingModal
                isOpen={showPricingModal}
                onClose={() => setShowPricingModal(false)}
                onUpgrade={handleUpgrade}
            />
        </div>
    );
};

export default JobTailorPage;