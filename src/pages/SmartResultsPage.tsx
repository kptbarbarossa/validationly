import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DynamicPromptResult } from '../types';
import SEOHead from '../components/SEOHead';

function detectLanguage(text: string): boolean {
    return /[çğıöşüÇĞİÖŞÜ]/.test(text);
}

function getScoreInsight(score: number, isTR: boolean) {
    if (score >= 80) return { 
        status: 'go', 
        color: 'green', 
        icon: '🚀', 
        title: isTR ? 'İleri Git!' : 'Go For It!',
        subtitle: isTR ? 'Güçlü fırsat tespit edildi' : 'Strong opportunity detected'
    };
    if (score >= 60) return { 
        status: 'caution', 
        color: 'yellow', 
        icon: '⚡', 
        title: isTR ? 'Dikkatli İlerle' : 'Proceed with Caution',
        subtitle: isTR ? 'Potansiyel var, test et' : 'Potential exists, validate first'
    };
    return { 
        status: 'stop', 
        color: 'red', 
        icon: '🛑', 
        title: isTR ? 'Dur ve Düşün' : 'Stop & Rethink',
        subtitle: isTR ? 'Büyük riskler tespit edildi' : 'Major risks identified'
    };
}

function extractKeyInsight(result: any, isTR: boolean): string {
    // AI'dan gelen scoreJustification'dan en önemli cümleyi çıkar
    const justification = result.scoreJustification || '';
    const sentences = justification.split('.').filter(s => s.trim().length > 20);
    
    if (sentences.length > 0) {
        return sentences[0].trim() + '.';
    }
    
    // Fallback
    const score = result.demandScore || 0;
    if (score >= 70) return isTR ? 'Pazar talebi güçlü görünüyor.' : 'Market demand looks strong.';
    if (score >= 50) return isTR ? 'Orta seviye talep var.' : 'Moderate demand exists.';
    return isTR ? 'Talep sinyalleri zayıf.' : 'Demand signals are weak.';
}

function getActionPlan(result: any, isTR: boolean): string[] {
    // AI'dan gelen validationSteps varsa kullan, yoksa score'a göre genel öneriler
    if (result.validationSteps && Array.isArray(result.validationSteps) && result.validationSteps.length > 0) {
        return result.validationSteps.slice(0, 3);
    }
    
    const score = result.demandScore || 0;
    if (isTR) {
        if (score >= 70) return [
            'Landing page oluştur ve e-posta topla',
            'Sosyal medyada fikrini test et', 
            'İlk 10 potansiyel müşteriyle konuş'
        ];
        if (score >= 50) return [
            'Hedef kitlenle detaylı görüşmeler yap',
            'Rakip analizi derinleştir',
            'MVP öncesi market validation yap'
        ];
        return [
            'Problem tanımını yeniden gözden geçir',
            'Farklı hedef kitle segmentleri araştır',
            'Fikri pivot etmeyi düşün'
        ];
    } else {
        if (score >= 70) return [
            'Build landing page and collect emails',
            'Test your idea on social media',
            'Talk to your first 10 potential customers'
        ];
        if (score >= 50) return [
            'Conduct detailed customer interviews',
            'Deepen competitive analysis', 
            'Run pre-MVP market validation'
        ];
        return [
            'Revisit your problem definition',
            'Research different target segments',
            'Consider pivoting the idea'
        ];
    }
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
    const insight = getScoreInsight(result.demandScore, isTR);
    const keyInsight = extractKeyInsight(result, isTR);
    const actionPlan = getActionPlan(result, isTR);

    // Platform data for quick tests
    const platforms = [
        { key: 'twitter', name: 'X', suggestion: result.tweetSuggestion },
        { key: 'reddit', name: 'Reddit', suggestion: result.redditTitleSuggestion },
        { key: 'linkedin', name: 'LinkedIn', suggestion: result.linkedinSuggestion }
    ].filter(p => p.suggestion);

    return (
        <>
            <SEOHead 
                title={`${result.idea || result.content} - Validation Report | Validationly`}
                description={keyInsight}
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

                <div className="container mx-auto px-4 py-8 max-w-4xl">
                    
                    {/* Hero Score Section */}
                    <div className="text-center mb-12">
                        <div className="mb-6">
                            <div className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                                {result.demandScore}
                            </div>
                            <div className="text-xl text-slate-300 mb-2">
                                {isTR ? 'Validasyon Skoru' : 'Validation Score'}
                            </div>
                        </div>
                        
                        {/* Traffic Light Status */}
                        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border-2 mb-6 ${
                            insight.status === 'go' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                            insight.status === 'caution' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                            'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}>
                            <span className="text-2xl">{insight.icon}</span>
                            <div>
                                <div className="font-bold text-lg">{insight.title}</div>
                                <div className="text-sm opacity-80">{insight.subtitle}</div>
                            </div>
                        </div>

                        {/* Idea Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
                            "{result.idea || result.content}"
                        </h1>
                        
                        {/* Key Insight */}
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                            {keyInsight}
                        </p>
                    </div>

                    {/* Action Plan */}
                    <div className="mb-12">
                        <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="text-3xl">🎯</span>
                                {isTR ? 'Sonraki Adımların' : 'Your Next Steps'}
                            </h2>
                            
                            <div className="space-y-4">
                                {actionPlan.map((step, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-xl">
                                        <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                            {idx + 1}
                                        </div>
                                        <div className="text-slate-200 text-lg">{step}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Social Tests */}
                    {platforms.length > 0 && (
                        <div className="mb-12">
                            <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                    <span className="text-3xl">📱</span>
                                    {isTR ? 'Hızlı Testler' : 'Quick Tests'}
                                </h2>
                                
                                <div className="grid gap-4">
                                    {platforms.map((platform) => (
                                        <div key={platform.key} className="p-4 bg-slate-700/30 rounded-xl">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="font-semibold text-slate-200">{platform.name}</div>
                                                <button 
                                                    onClick={() => navigator.clipboard.writeText(platform.suggestion || '')}
                                                    className="text-xs px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                                                >
                                                    {isTR ? 'Kopyala' : 'Copy'}
                                                </button>
                                            </div>
                                            <div className="text-slate-300 text-sm bg-slate-900/50 rounded-lg p-3 font-mono">
                                                {platform.suggestion}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                    <div className="text-indigo-300 text-sm">
                                        💡 {isTR ? 'İpucu: Bu mesajları paylaş ve tepkileri ölç. Pozitif geri dönüş alırsan fikrin doğru yolda!' : 'Tip: Share these messages and measure reactions. If you get positive feedback, you\'re on the right track!'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Market & Risk Summary (Minimal) */}
                    <div className="mb-12">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Market Info */}
                            {((result as any).marketSize || (result as any).competitionLevel) && (
                                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        📊 {isTR ? 'Pazar Bilgisi' : 'Market Info'}
                                    </h3>
                                    {(result as any).marketSize && (
                                        <div className="mb-3">
                                            <div className="text-sm text-slate-400 mb-1">{isTR ? 'Pazar Büyüklüğü' : 'Market Size'}</div>
                                            <div className="text-slate-200">{(result as any).marketSize}</div>
                                        </div>
                                    )}
                                    {(result as any).competitionLevel && (
                                        <div>
                                            <div className="text-sm text-slate-400 mb-1">{isTR ? 'Rekabet' : 'Competition'}</div>
                                            <div className="text-slate-200">{(result as any).competitionLevel}</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Top Risk */}
                            {(result as any).keyRisks && Array.isArray((result as any).keyRisks) && (result as any).keyRisks.length > 0 && (
                                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        ⚠️ {isTR ? 'En Büyük Risk' : 'Biggest Risk'}
                                    </h3>
                                    <div className="text-slate-300">
                                        {(result as any).keyRisks[0]}
                                    </div>
                                    {(result as any).keyRisks.length > 1 && (
                                        <div className="text-xs text-slate-500 mt-2">
                                            +{(result as any).keyRisks.length - 1} {isTR ? 'risk daha' : 'more risks'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-xl font-semibold text-white transition-all transform hover:scale-105"
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
