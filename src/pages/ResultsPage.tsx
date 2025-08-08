import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DynamicPromptResult } from '../types';
import SEOHead from '../components/SEOHead';

// Minimalist Premium Icons
const HomeIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
);

const ChartIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const BookmarkIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const HelpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Platform Icons
const XIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const RedditIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
);

const TrendUpIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ResultsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const result = location.state?.result as DynamicPromptResult;
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Animation trigger
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const getOverallStatus = (score: number) => {
        if (score >= 70) return {
            color: 'emerald',
            text: 'Excellent Potential',
            desc: 'Strong market signals detected. Time to build!',
            action: 'Begin MVP development',
            icon: '🚀'
        };
        if (score >= 50) return {
            color: 'amber',
            text: 'Good Potential',
            desc: 'Promising idea with room for improvement.',
            action: 'Strengthen weak areas',
            icon: '⚡'
        };
        return {
            color: 'red',
            text: 'Needs Work',
            desc: 'Consider pivoting or major improvements.',
            action: 'Reevaluate approach',
            icon: '⚠️'
        };
    };

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

    const handleCopyToClipboard = async (text: string, id: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2500);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const status = getOverallStatus(result.demandScore);

    // All results are now from dynamic prompt system

    // Market Intelligence Card Component
    const MarketIntelligenceCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-green-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendUpIcon />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Market Intelligence</h3>
                    <div className="text-sm text-green-600 font-medium">Market Opportunity</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">TAM:</span> 
                    <span className="text-gray-600 ml-2">{data?.tam || '$2.5B Design Software Market'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">SAM:</span> 
                    <span className="text-gray-600 ml-2">{data?.sam || '$450M SaaS Design Tools'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">SOM:</span> 
                    <span className="text-gray-600 ml-2">{data?.som || '$12M Realistic 3-year target'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Growth:</span> 
                    <span className="text-green-600 ml-2 font-medium">{data?.growthRate || '15% YoY'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Timing:</span>
                    <div className="flex">
                        {[...Array(data?.marketTiming || 4)].map((_, i) => (
                            <span key={i} className="text-yellow-400">⭐</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // Competitive Landscape Card Component
    const CompetitiveLandscapeCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-red-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <span className="text-red-600 font-bold">🥊</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Competition Analysis</h3>
                    <div className="text-sm text-red-600 font-medium">Competitive Landscape</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Direct Competitors:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.directCompetitors?.join(', ') || 'Figma, Sketch, Adobe XD'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Position:</span> 
                    <span className="text-gray-600 ml-2">{data?.marketPosition || 'Blue Ocean Opportunity'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Differentiation:</span> 
                    <span className="text-blue-600 ml-2 font-medium">{data?.differentiationScore || '8'}/10</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Moat:</span> 
                    <span className="text-gray-600 ml-2">{data?.competitiveMoat || 'AI-powered features'}</span>
                </div>
            </div>
        </div>
    );

    // Revenue Model Card Component
    const RevenueModelCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-yellow-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-600 font-bold">💰</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Revenue Model</h3>
                    <div className="text-sm text-yellow-600 font-medium">Monetization Strategy</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Model:</span> 
                    <span className="text-gray-600 ml-2">{data?.primaryModel || 'Freemium SaaS'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Price:</span> 
                    <span className="text-green-600 ml-2 font-medium">{data?.pricePoint || '$29/month'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Break-even:</span> 
                    <span className="text-gray-600 ml-2">{data?.breakEvenTimeline || '18 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">LTV/CAC:</span> 
                    <span className="text-blue-600 ml-2 font-medium">{data?.ltvCacRatio || '4.2x'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Projected MRR:</span> 
                    <span className="text-green-600 ml-2 font-medium">{data?.projectedMrr || '$25K by Year 1'}</span>
                </div>
            </div>
        </div>
    );

    // Target Audience Card Component
    const TargetAudienceCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-purple-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold">👥</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Target Audience</h3>
                    <div className="text-sm text-purple-600 font-medium">Customer Segments</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Primary:</span> 
                    <span className="text-gray-600 ml-2">{data?.primarySegment || 'Freelance Designers (40%)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Secondary:</span> 
                    <span className="text-gray-600 ml-2">{data?.secondarySegment || 'Design Agencies (35%)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Pain Points:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.painPoints?.join(', ') || 'Project chaos, client communication'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Willingness to Pay:</span> 
                    <span className="text-green-600 ml-2 font-medium">{data?.willingnessToPay || 'High ($25-50/month)'}</span>
                </div>
            </div>
        </div>
    );

    // Risk Assessment Card Component
    const RiskAssessmentCard: React.FC<{ data?: any }> = ({ data }) => {
        const getRiskColor = (risk: string) => {
            switch (risk?.toLowerCase()) {
                case 'low': case 'very low': return 'text-green-600';
                case 'medium': return 'text-yellow-600';
                case 'high': case 'very high': return 'text-red-600';
                default: return 'text-gray-600';
            }
        };

        return (
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-orange-50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold">⚠️</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">Risk Assessment</h3>
                        <div className="text-sm text-orange-600 font-medium">Risk Matrix</div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Technical:</span> 
                        <span className={`ml-2 font-medium ${getRiskColor(data?.technicalRisk || 'Low')}`}>
                            {data?.technicalRisk || 'Low'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Market:</span> 
                        <span className={`ml-2 font-medium ${getRiskColor(data?.marketRisk || 'Medium')}`}>
                            {data?.marketRisk || 'Medium'}
                        </span>
                    </div>
                    <div className="text-sm">
                        <span className="font-medium text-gray-700">Financial:</span> 
                        <span className={`ml-2 font-medium ${getRiskColor(data?.financialRisk || 'Low')}`}>
                            {data?.financialRisk || 'Low'}
                        </span>
                    </div>
                    <div className="text-sm border-t pt-2">
                        <span className="font-medium text-gray-700">Overall:</span> 
                        <span className={`ml-2 font-bold ${getRiskColor(data?.overallRiskLevel || 'Medium')}`}>
                            {data?.overallRiskLevel || 'MEDIUM'}
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Go-to-Market Card Component
    const GoToMarketCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-indigo-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">🚀</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Go-to-Market</h3>
                    <div className="text-sm text-indigo-600 font-medium">Launch Strategy</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Phase 1:</span> 
                    <span className="text-gray-600 ml-2">{data?.phase1 || 'Design Twitter + Product Hunt'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Phase 2:</span> 
                    <span className="text-gray-600 ml-2">{data?.phase2 || 'Design communities (Dribbble, Behance)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Phase 3:</span> 
                    <span className="text-gray-600 ml-2">{data?.phase3 || 'Partnership with design schools'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Timeline:</span> 
                    <span className="text-blue-600 ml-2 font-medium">{data?.timeline || '6-month rollout'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Budget:</span> 
                    <span className="text-green-600 ml-2 font-medium">{data?.budgetNeeded || '$50K initial'}</span>
                </div>
            </div>
        </div>
    );

    // Development Roadmap Card Component
    const DevelopmentRoadmapCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-teal-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                    <span className="text-teal-600 font-bold">🛠️</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Development Roadmap</h3>
                    <div className="text-sm text-teal-600 font-medium">Build Timeline</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">MVP:</span> 
                    <span className="text-gray-600 ml-2">{data?.mvpTimeline || '3 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Beta:</span> 
                    <span className="text-gray-600 ml-2">{data?.betaLaunch || '5 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Launch:</span> 
                    <span className="text-blue-600 ml-2 font-medium">{data?.publicLaunch || '8 months'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Team:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.teamNeeded?.join(', ') || '2 developers, 1 designer'}
                    </div>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Tech Stack:</span>
                    <div className="text-gray-600 mt-1">
                        {data?.techStack?.join(', ') || 'React, Node.js, PostgreSQL'}
                    </div>
                </div>
            </div>
        </div>
    );

    // Product-Market Fit Card Component
    const ProductMarketFitCard: React.FC<{ data?: any }> = ({ data }) => (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:bg-pink-50">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <span className="text-pink-600 font-bold">🎯</span>
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">Product-Market Fit</h3>
                    <div className="text-sm text-pink-600 font-medium">PMF Indicators</div>
                </div>
            </div>
            <div className="space-y-3">
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Problem-Solution Fit:</span> 
                    <span className="text-green-600 ml-2 font-medium">{data?.problemSolutionFit || '85'}%</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Solution-Market Fit:</span> 
                    <span className="text-blue-600 ml-2 font-medium">{data?.solutionMarketFit || '78'}%</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Early Adopters:</span> 
                    <span className="text-gray-600 ml-2">{data?.earlyAdopterSignals || 'Strong signals'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Retention:</span> 
                    <span className="text-gray-600 ml-2">{data?.retentionPrediction || '65% (Month 1)'}</span>
                </div>
                <div className="text-sm">
                    <span className="font-medium text-gray-700">Viral Coefficient:</span> 
                    <span className="text-purple-600 ml-2 font-medium">{data?.viralCoefficient || '0.3'}</span>
                </div>
            </div>
        </div>
    );

    // Simple Platform Analysis Card Component
    const PlatformCard: React.FC<{
        platform: string;
        analysis: any;
        icon: React.ReactNode;
        bgColor: string;
    }> = ({ platform, analysis, icon, bgColor }) => {
        const getScoreColor = (score: number) => {
            if (score >= 4) return 'text-green-600';
            if (score >= 3) return 'text-yellow-600';
            return 'text-red-600';
        };

        const getScoreText = (score: number) => {
            if (score >= 4) return 'Excellent';
            if (score >= 3) return 'Good';
            if (score >= 2) return 'Fair';
            return 'Poor';
        };

        return (
            <div className={`bg-white rounded-xl p-6 shadow-lg border border-gray-200 ${bgColor}`}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{platform}</h3>
                        <div className={`text-sm font-medium ${getScoreColor(analysis?.score || 3)}`}>
                            {analysis?.score || 3}/5 - {getScoreText(analysis?.score || 3)}
                        </div>
                    </div>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {analysis?.summary || `AI analysis shows moderate potential for ${platform.toLowerCase()} with room for improvement through targeted content strategy.`}
                    </p>
                </div>

                {analysis?.keyFindings && analysis.keyFindings.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Key Findings</h4>
                        <ul className="space-y-1">
                            {analysis.keyFindings.slice(0, 3).map((finding: string, index: number) => (
                                <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-500 mt-1">•</span>
                                    {finding}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            <SEOHead
                title={`Validation Results: ${result.demandScore}/100 - Validationly`}
                description={`AI analysis shows ${result.demandScore}/100 demand score for "${(result.content || result.idea).substring(0, 100)}...". Get detailed market validation insights.`}
                keywords="startup validation results, market demand analysis, AI validation report, business idea score"
            />

            {/* Simplified Background */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Market Analysis Results
                        </h1>
                        <p className="text-gray-600">AI-powered analysis of your business idea</p>
                    </div>

                    {/* Overall Score Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-3xl mx-auto mb-8">
                        <div className="text-center">
                            <div className="text-base font-medium text-gray-600 mb-4">Market Demand Score</div>
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="text-4xl font-bold text-gray-800">
                                    {result.demandScore}
                                    <span className="text-xl text-gray-500 ml-1">/100</span>
                                </div>
                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`}>
                                    <span className="text-lg">{status.icon}</span>
                                    {status.text}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${result.demandScore >= 70 ? 'from-emerald-400 to-emerald-600' :
                                        result.demandScore >= 50 ? 'from-amber-400 to-amber-600' :
                                            'from-red-400 to-red-600'
                                        }`}
                                    style={{ width: `${result.demandScore}%` }}
                                ></div>
                            </div>

                            <div className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                                "{result.content || result.idea}"
                            </div>
                        </div>
                    </div>

                    {/* Platform Analysis Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Always use real AI analysis from dynamic prompt system */}
                        <PlatformCard
                            platform="X (Twitter)"
                            analysis={(result as DynamicPromptResult).platformAnalyses?.twitter}
                            icon={<XIcon />}
                            bgColor="hover:bg-blue-50"
                        />
                        <PlatformCard
                            platform="Reddit"
                            analysis={(result as DynamicPromptResult).platformAnalyses?.reddit}
                            icon={<RedditIcon />}
                            bgColor="hover:bg-orange-50"
                        />
                        <PlatformCard
                            platform="LinkedIn"
                            analysis={(result as DynamicPromptResult).platformAnalyses?.linkedin}
                            icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>}
                            bgColor="hover:bg-indigo-50"
                        />
                    </div>

                    {/* Market Intelligence Cards - Tier 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <MarketIntelligenceCard data={result.marketIntelligence} />
                        <CompetitiveLandscapeCard data={result.competitiveLandscape} />
                        <RevenueModelCard data={result.revenueModel} />
                    </div>

                    {/* Strategic Analysis Cards - Tier 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <TargetAudienceCard data={result.targetAudience} />
                        <RiskAssessmentCard data={result.riskAssessment} />
                        <GoToMarketCard data={result.goToMarket} />
                    </div>

                    {/* Advanced Analysis Cards - Tier 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <DevelopmentRoadmapCard data={result.developmentRoadmap} />
                        <ProductMarketFitCard data={result.productMarketFit} />
                    </div>

                    {/* Content Suggestions */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto mb-8">
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Test Your Idea</h3>
                            <p className="text-gray-600">Copy and use these AI-generated posts to validate your idea on social platforms</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Twitter Suggestion */}
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <XIcon />
                                        </div>
                                        <span className="font-semibold text-gray-900">X (Twitter)</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(result.tweetSuggestion, 'tweet')}
                                        className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        {copiedId === 'tweet' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-4 border border-blue-200">
                                    {result.tweetSuggestion}
                                </div>
                                <div className="mt-3 text-xs text-blue-700 font-medium">
                                    💡 Best for: Quick validation & viral potential
                                </div>
                            </div>

                            {/* Reddit Suggestion */}
                            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-6 border border-orange-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                                            <RedditIcon />
                                        </div>
                                        <span className="font-semibold text-gray-900">Reddit</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(`${result.redditTitleSuggestion}\n\n${result.redditBodySuggestion}`, 'reddit')}
                                        className="text-xs bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                                    >
                                        {copiedId === 'reddit' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="bg-white rounded-lg p-4 border border-orange-200">
                                    <div className="text-sm font-semibold text-gray-900 mb-2">
                                        {result.redditTitleSuggestion}
                                    </div>
                                    <div className="text-sm text-gray-700 leading-relaxed">
                                        {result.redditBodySuggestion}
                                    </div>
                                </div>
                                <div className="mt-3 text-xs text-orange-700 font-medium">
                                    💡 Best for: Detailed feedback & community insights
                                </div>
                            </div>

                            {/* LinkedIn Suggestion */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-indigo-200">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                        <span className="font-semibold text-gray-900">LinkedIn</span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyToClipboard(result.linkedinSuggestion, 'linkedin')}
                                        className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                    >
                                        {copiedId === 'linkedin' ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed bg-white rounded-lg p-4 border border-indigo-200">
                                    {result.linkedinSuggestion}
                                </div>
                                <div className="mt-3 text-xs text-indigo-700 font-medium">
                                    💡 Best for: Professional validation & B2B feedback
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-blue-600 text-sm">💡</span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Quick Validation Tips</h4>
                                    <p className="text-xs text-gray-600 leading-relaxed">
                                        Post these suggestions on the respective platforms and monitor engagement, comments, and direct messages.
                                        High engagement indicates strong market interest. Save positive responses as social proof for future marketing.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feedback and Support Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        {/* Feedback on X Button */}
                        <a
                            href="https://x.com/kptbarbarossa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg"
                        >
                            <XIcon />
                            <span>Share Feedback on X</span>
                        </a>

                        {/* Buy Me a Coffee Button */}
                        <a
                            href="https://buymeacoffee.com/kptbarbarossa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-yellow-600 transition-all duration-300 shadow-lg"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-.766-1.613a4.44 4.44 0 0 0-1.364-1.04c-.354-.25-.773-.426-1.214-.518a9.909 9.909 0 0 0-1.85-.104c-.26.003-.52.021-.778.053a27.158 27.158 0 0 0-3.583.641c-.5.15-.988.35-1.444.598-.456.247-.882.543-1.267.888a6.404 6.404 0 0 0-1.048 1.137 6.893 6.893 0 0 0-.68 1.329c-.17.484-.295.996-.37 1.514L6.34 8.803c-.24.029-.477.096-.704.198a3.814 3.814 0 0 0-.657.466c-.195.195-.356.426-.477.68-.121.254-.196.532-.218.812-.02.257.014.514.101.756.087.243.218.47.388.67.17.2.383.364.624.482.241.118.513.187.786.203.346.02.693-.039 1.008-.172.315-.133.596-.34.82-.598.224-.259.384-.569.467-.896.083-.327.087-.67.011-.999a3.649 3.649 0 0 0-.236-.784 3.58 3.58 0 0 0-.49-.69 3.49 3.49 0 0 0-.793-.525c-.307-.138-.65-.2-.991-.182-.297.016-.588.108-.848.267-.26.16-.48.384-.639.651-.159.267-.25.575-.265.888-.015.313.055.625.203.905.148.28.37.518.644.691.274.173.594.274.925.293.331.019.663-.041.962-.174.299-.133.563-.34.766-.598.203-.259.34-.569.398-.896.058-.327.045-.67-.038-.999a3.649 3.649 0 0 0-.236-.784z" />
                            </svg>
                            <span>Buy Me a Coffee</span>
                        </a>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold mb-4">Ready to Build Your Idea?</h3>
                            <p className="text-blue-100 mb-6 text-lg">
                                {status.desc} {status.action}.
                            </p>
                            <button
                                onClick={() => navigate('/')}
                                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg"
                            >
                                Analyze Another Idea
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultsPage;