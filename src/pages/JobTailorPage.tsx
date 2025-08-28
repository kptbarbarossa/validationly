import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PricingModal from '../components/PricingModal';
import JobSearch from '../components/JobSearch';
import CVExport from '../components/CVExport';
import ATSChecker from '../components/ATSChecker';

interface JobTailorResult {
    revised: string;
    error?: string;
}

interface UserPlan {
    plan: 'free' | 'pro';
    dailyUsage: number;
    limit: number;
    trialDaysLeft: number;
    isTrialActive: boolean;
}

const JobTailorPage: React.FC = () => {
    const [jobDesc, setJobDesc] = useState('');
    const [cvText, setCvText] = useState('');
    const [tone, setTone] = useState<'formal' | 'casual' | 'impact' | 'executive' | 'creative' | 'technical'>('formal');
    const [result, setResult] = useState<JobTailorResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [userPlan, setUserPlan] = useState<UserPlan>({ 
        plan: 'free', 
        dailyUsage: 0, 
        limit: 3, 
        trialDaysLeft: 0, 
        isTrialActive: false 
    });
    const [showPricingModal, setShowPricingModal] = useState(false);
    const [showJobSearch, setShowJobSearch] = useState(false);
    const navigate = useNavigate();

    const handleStartTrial = async () => {
        if (!email.trim()) {
            alert('Please enter your email');
            return;
        }

        try {
            const response = await fetch('/api/auth/start-trial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                setUserPlan({
                    plan: 'free',
                    dailyUsage: 0,
                    limit: 3,
                    trialDaysLeft: 0,
                    isTrialActive: false
                });
                localStorage.setItem('jobTailorToken', data.token);
                localStorage.setItem('jobTailorUserPlan', JSON.stringify({
                    plan: 'free',
                    dailyUsage: 0,
                    limit: 3,
                    trialDaysLeft: 0,
                    isTrialActive: false
                }));
                alert('🎉 You now have 3 free CV rewrites! Upgrade to Pro for unlimited access.');
            } else {
                alert(data.error || 'Failed to start trial');
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

    const handleJobSelect = (job: any) => {
        setJobDesc(`${job.title} at ${job.company}\n\nLocation: ${job.location}\n\n${job.description}`);
        setShowJobSearch(false);
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

                {/* How It Works Section */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-8 mb-8 border border-slate-700/50">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-white mb-4">🚀 How It Works</h2>
                        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                            Transform your CV into a job-winning document in just 3 simple steps
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">1</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Paste Job & CV</h3>
                            <p className="text-slate-300 text-sm">
                                Copy the job description and paste your current CV text. Our AI will analyze both to understand the requirements.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
                            <p className="text-slate-300 text-sm">
                                Our advanced AI analyzes the job requirements, identifies key skills, and optimizes your CV content accordingly.
                            </p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Get Optimized CV</h3>
                            <p className="text-slate-300 text-sm">
                                Receive your tailored CV that highlights relevant skills and experience for the specific job position.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trial Section */}
                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-8 mb-8 border border-indigo-500/20">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-white mb-2">🚀 Get Started with Job Tailor</h2>
                        <p className="text-slate-300 text-lg">3 free CV rewrites • Then $9.99/month for unlimited • No credit card required</p>
                    </div>
                    
                    {!token ? (
                        <div className="max-w-md mx-auto">
                            <button
                                onClick={() => navigate('/auth?redirect=/job-tailor')}
                                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold text-lg"
                            >
                                Start Free Trial
                            </button>
                            <p className="text-center text-slate-400 text-sm mt-3">
                                Sign in to get your 3 free CV rewrites
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-green-400 text-sm font-medium">✓ Free Plan Active</p>
                                            <p className="text-slate-300 text-sm">{email}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{userPlan.dailyUsage}/{userPlan.limit}</div>
                                        <div className="text-xs text-slate-400">free rewrites used</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                                        <div className="text-lg font-bold text-white">{userPlan.dailyUsage}/{userPlan.limit}</div>
                                        <div className="text-xs text-slate-400">free rewrites used</div>
                                    </div>
                                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                                        <div className="text-lg font-bold text-white">{userPlan.plan === 'free' ? 'Free' : 'Pro'}</div>
                                        <div className="text-xs text-slate-400">Current Plan</div>
                                    </div>
                                </div>
                                
                                {userPlan.plan === 'free' && (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setShowPricingModal(true)}
                                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
                                        >
                                            Upgrade to Pro
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Form */}
                {token && (
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Input Section */}
                        <div className="space-y-6">
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-white">Job Description</h3>
                                    <button
                                        onClick={() => setShowJobSearch(!showJobSearch)}
                                        className="text-sm bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-4 py-1 rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all"
                                    >
                                        {showJobSearch ? 'Hide Job Search' : '🔍 Find Jobs'}
                                    </button>
                                </div>
                                
                                {showJobSearch && token && (
                                    <div className="mb-4">
                                        <JobSearch onJobSelect={handleJobSelect} token={token} />
                                    </div>
                                )}
                                
                                <textarea
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                    placeholder="Paste the job description here or use the job search above..."
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
                        <div className="space-y-6">
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

                        {/* CV Export */}
                        {result?.revised && (
                            <CVExport
                                cvText={result.revised}
                                jobTitle={jobDesc.split('\n')[0]?.replace(/^(.*?)\s+at\s+/, '')}
                                userPlan={userPlan.plan}
                                onUpgrade={() => setShowPricingModal(true)}
                            />
                        )}

                        {/* ATS Checker */}
                        <ATSChecker
                            cvText={result?.revised || ''}
                            jobDescription={jobDesc}
                            userPlan={userPlan.plan}
                            onUpgrade={() => setShowPricingModal(true)}
                        />
                    </div>
                )}

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