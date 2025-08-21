import React from 'react';

interface SignalData {
  platform: string;
  signalStrength: 'weak' | 'moderate' | 'strong';
  analysis: string;
  score?: number;
}

interface SocialMediaSignals {
  twitter?: {
    trending: boolean;
    sentiment: 'negative' | 'neutral' | 'positive';
    volume: 'low' | 'medium' | 'high';
    keyHashtags?: string[];
  };
  facebook?: {
    groupActivity: 'low' | 'medium' | 'high';
    engagement: 'low' | 'medium' | 'high';
    relevantGroups?: string[];
  };
  tiktok?: {
    viralPotential: 'low' | 'medium' | 'high';
    userReaction: 'negative' | 'neutral' | 'positive';
    contentTypes?: string[];
  };
}

interface SignalSummaryProps {
  platformAnalyses: SignalData[];
  socialMediaSignals?: SocialMediaSignals;
  overallScore: number;
}

const SignalSummary: React.FC<SignalSummaryProps> = ({ 
  platformAnalyses, 
  socialMediaSignals, 
  overallScore 
}) => {
  
  const getSignalColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'weak': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getSignalIcon = (strength: string) => {
    switch (strength) {
      case 'strong': return '🟢';
      case 'moderate': return '🟡';
      case 'weak': return '🔴';
      default: return '⚪';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'neutral': return '😐';
      case 'negative': return '😞';
      default: return '🤔';
    }
  };

  const getVolumeIcon = (volume: string) => {
    switch (volume) {
      case 'high': return '📈';
      case 'medium': return '📊';
      case 'low': return '📉';
      default: return '📋';
    }
  };

  // Calculate overall signal strength
  const calculateOverallSignal = () => {
    const strongCount = platformAnalyses.filter(p => p.signalStrength === 'strong').length;
    const moderateCount = platformAnalyses.filter(p => p.signalStrength === 'moderate').length;
    const weakCount = platformAnalyses.filter(p => p.signalStrength === 'weak').length;
    
    if (strongCount >= 2) return 'strong';
    if (strongCount >= 1 || moderateCount >= 2) return 'moderate';
    return 'weak';
  };

  const overallSignal = calculateOverallSignal();

  return (
    <div className="glass glass-border p-8 rounded-3xl mb-12">
      <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        📡 Market Signal Summary
      </h2>
      
      {/* Overall Signal Strength */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl border ${getSignalColor(overallSignal)}`}>
          <span className="text-2xl">{getSignalIcon(overallSignal)}</span>
          <div>
            <div className="text-lg font-bold capitalize">{overallSignal} Market Signals</div>
            <div className="text-sm opacity-75">
              {overallSignal === 'strong' && 'Strong validation across multiple platforms'}
              {overallSignal === 'moderate' && 'Mixed signals with some validation'}
              {overallSignal === 'weak' && 'Limited validation signals detected'}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Signals Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {platformAnalyses.map((platform, index) => (
          <div key={index} className="glass glass-border p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{platform.platform}</h3>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSignalColor(platform.signalStrength)}`}>
                {getSignalIcon(platform.signalStrength)} {platform.signalStrength}
              </div>
            </div>
            
            {platform.score && (
              <div className="mb-3">
                <div className="flex justify-between text-sm text-slate-400 mb-1">
                  <span>Signal Score</span>
                  <span>{platform.score}/5</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(platform.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            <p className="text-slate-300 text-sm leading-relaxed">{platform.analysis}</p>
          </div>
        ))}
      </div>

      {/* Social Media Signals Detail */}
      {socialMediaSignals && (
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-xl font-bold mb-6 text-center text-cyan-400">📱 Social Media Signal Breakdown</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Twitter Signals */}
            {socialMediaSignals.twitter && (
              <div className="glass glass-border p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🐦</span>
                  <h4 className="font-semibold text-blue-400">Twitter/X</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Trending:</span>
                    <span className={socialMediaSignals.twitter.trending ? 'text-green-400' : 'text-slate-300'}>
                      {socialMediaSignals.twitter.trending ? '🔥 Yes' : '❄️ No'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sentiment:</span>
                    <span className="text-slate-300">
                      {getSentimentIcon(socialMediaSignals.twitter.sentiment)} {socialMediaSignals.twitter.sentiment}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Volume:</span>
                    <span className="text-slate-300">
                      {getVolumeIcon(socialMediaSignals.twitter.volume)} {socialMediaSignals.twitter.volume}
                    </span>
                  </div>
                  
                  {socialMediaSignals.twitter.keyHashtags && (
                    <div className="mt-3">
                      <div className="text-slate-400 text-xs mb-1">Key Hashtags:</div>
                      <div className="flex flex-wrap gap-1">
                        {socialMediaSignals.twitter.keyHashtags.slice(0, 3).map((hashtag, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TikTok Signals */}
            {socialMediaSignals.tiktok && (
              <div className="glass glass-border p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🎵</span>
                  <h4 className="font-semibold text-pink-400">TikTok</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Viral Potential:</span>
                    <span className="text-slate-300">
                      {socialMediaSignals.tiktok.viralPotential === 'high' ? '🚀' : 
                       socialMediaSignals.tiktok.viralPotential === 'medium' ? '📈' : '📊'} 
                      {socialMediaSignals.tiktok.viralPotential}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">User Reaction:</span>
                    <span className="text-slate-300">
                      {getSentimentIcon(socialMediaSignals.tiktok.userReaction)} {socialMediaSignals.tiktok.userReaction}
                    </span>
                  </div>
                  
                  {socialMediaSignals.tiktok.contentTypes && (
                    <div className="mt-3">
                      <div className="text-slate-400 text-xs mb-1">Content Types:</div>
                      <div className="flex flex-wrap gap-1">
                        {socialMediaSignals.tiktok.contentTypes.slice(0, 2).map((type, i) => (
                          <span key={i} className="px-2 py-1 bg-pink-500/20 text-pink-300 text-xs rounded">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Facebook Signals */}
            {socialMediaSignals.facebook && (
              <div className="glass glass-border p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📘</span>
                  <h4 className="font-semibold text-blue-600">Facebook</h4>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Group Activity:</span>
                    <span className="text-slate-300">
                      {getVolumeIcon(socialMediaSignals.facebook.groupActivity)} {socialMediaSignals.facebook.groupActivity}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Engagement:</span>
                    <span className="text-slate-300">
                      {getVolumeIcon(socialMediaSignals.facebook.engagement)} {socialMediaSignals.facebook.engagement}
                    </span>
                  </div>
                  
                  {socialMediaSignals.facebook.relevantGroups && (
                    <div className="mt-3">
                      <div className="text-slate-400 text-xs mb-1">Relevant Groups:</div>
                      <div className="space-y-1">
                        {socialMediaSignals.facebook.relevantGroups.slice(0, 2).map((group, i) => (
                          <div key={i} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded">
                            {group}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Signal Interpretation */}
      <div className="border-t border-white/10 pt-6 mt-6">
        <h4 className="text-lg font-bold mb-4 text-center text-slate-300">🔍 Signal Interpretation</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass glass-border p-4 rounded-xl">
            <h5 className="font-semibold text-green-400 mb-2">✅ Positive Signals</h5>
            <ul className="text-sm text-slate-300 space-y-1">
              {overallSignal === 'strong' && (
                <>
                  <li>• Multiple platforms show validation</li>
                  <li>• Strong market demand indicators</li>
                  <li>• Positive community sentiment</li>
                </>
              )}
              {overallSignal === 'moderate' && (
                <>
                  <li>• Some validation signals present</li>
                  <li>• Market interest detected</li>
                  <li>• Room for optimization</li>
                </>
              )}
              {overallSignal === 'weak' && (
                <>
                  <li>• Early stage concept</li>
                  <li>• Potential for growth</li>
                  <li>• Needs market education</li>
                </>
              )}
            </ul>
          </div>
          
          <div className="glass glass-border p-4 rounded-xl">
            <h5 className="font-semibold text-yellow-400 mb-2">⚠️ Areas to Watch</h5>
            <ul className="text-sm text-slate-300 space-y-1">
              {overallSignal === 'strong' && (
                <>
                  <li>• Monitor competitive response</li>
                  <li>• Scale validation methods</li>
                  <li>• Prepare for rapid growth</li>
                </>
              )}
              {overallSignal === 'moderate' && (
                <>
                  <li>• Strengthen weak signals</li>
                  <li>• Focus on key platforms</li>
                  <li>• Improve messaging clarity</li>
                </>
              )}
              {overallSignal === 'weak' && (
                <>
                  <li>• Validate problem-solution fit</li>
                  <li>• Research target audience</li>
                  <li>• Consider pivot opportunities</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalSummary;