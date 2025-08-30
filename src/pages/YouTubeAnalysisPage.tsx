import React, { useState } from 'react';
import { YouTubeAnalysisDisplay } from '../components/YouTubeAnalysisDisplay';
import { youtubeAnalysisService } from '../services/youtubeAnalysisService';

interface StructuredVideoAnalysis {
  video_summary: {
    main_topic: string;
    key_message: string;
    important_sections: string[];
    chronological_flow: string[];
    statistics_and_examples: string[];
  };
  detailed_analysis: {
    methods_and_tools: string[];
    approaches: string[];
    speaker_experience: string[];
    lessons_learned: string[];
    target_audience_insights: string[];
  };
  comment_analysis: {
    recurring_ideas: string[];
    common_phrases: string[];
    positive_feedback: string[];
    negative_feedback: string[];
    community_perception: {
      support_level: 'high' | 'medium' | 'low';
      criticism_level: 'high' | 'medium' | 'low';
      suggestions_count: number;
    };
  };
  summary_table: {
    beginning: string;
    strategy: string;
    user_response: string;
    revenue_outcome: string;
  };
  insights_and_lessons: {
    main_lessons: string[];
    actionable_tips_entrepreneurs: string[];
    actionable_tips_content_creators: string[];
    actionable_tips_viewers: string[];
  };
}

export const YouTubeAnalysisPage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [analysis, setAnalysis] = useState<StructuredVideoAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    // Validate YouTube URL
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    if (!youtubeRegex.test(videoUrl)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await youtubeAnalysisService.analyzeVideoStructured(videoUrl);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setVideoUrl('');
    setAnalysis(null);
    setError(null);
  };

  if (analysis) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-8">
          {/* Back Button */}
          <button
            onClick={handleReset}
            className="mb-6 flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span>←</span>
            <span>Analyze Another Video</span>
          </button>

          <YouTubeAnalysisDisplay analysis={analysis} videoUrl={videoUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">📺</div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
            YouTube Video Analysis
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Get comprehensive analysis of any YouTube video with structured insights, 
            community response analysis, and actionable lessons.
          </p>
        </div>

        {/* Analysis Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Analyze YouTube Video
            </h2>

            {/* URL Input */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-medium mb-2">
                YouTube Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20"
                disabled={isLoading}
              />
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={isLoading || !videoUrl.trim()}
              className={`group relative w-full py-4 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                isLoading || !videoUrl.trim()
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 hover:shadow-xl hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
              }`}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x"></div>
              
              {/* Ripple effect on click */}
              <div className="absolute inset-0 bg-white/20 scale-0 group-active:scale-100 opacity-0 group-active:opacity-100 transition-all duration-200 rounded-xl"></div>
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center space-x-2 text-white">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Analyzing Video...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Analyze Video</span>
                  </>
                )}
              </div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 blur-md opacity-50 -z-10 group-hover:opacity-75 transition-opacity duration-300 rounded-xl"></div>
            </button>

            {/* Format Preview */}
            <div className="mt-8 p-6 bg-gray-700/30 rounded-lg border border-white/10">
              <h3 className="text-white font-semibold mb-4">Analysis Format:</h3>
              <div className="text-sm text-gray-400 space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-400">📋</span>
                  <span>1. Video Summary - Main topic, key message, structure</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-400">🔍</span>
                  <span>2. Detailed Analysis - Methods, tools, speaker insights</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-400">💬</span>
                  <span>3. Comment Analysis - Community response & sentiment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-orange-400">📊</span>
                  <span>4. Summary Table - Key points organized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400">🎯</span>
                  <span>5. Insights & Lessons - Actionable takeaways</span>
                </div>
              </div>
            </div>

            {/* Example URLs */}
            <div className="mt-6">
              <p className="text-gray-400 text-sm mb-3">Example URLs to try:</p>
              <div className="space-y-2">
                <button
                  onClick={() => setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                  className="block w-full text-left text-blue-400 hover:text-blue-300 text-sm p-2 bg-gray-700/30 rounded border border-white/10 hover:border-blue-500/30 transition-colors"
                >
                  https://www.youtube.com/watch?v=dQw4w9WgXcQ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-block p-8 bg-gray-800/50 rounded-3xl border border-white/10">
              <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Analyzing Video</h3>
              <p className="text-gray-400">
                Fetching video data, analyzing comments, and generating insights...
              </p>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Structured Analysis</h3>
            <p className="text-gray-400 text-sm">
              Get organized insights in a clear, actionable format
            </p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Comment Insights</h3>
            <p className="text-gray-400 text-sm">
              Understand community response and sentiment analysis
            </p>
          </div>
          
          <div className="text-center p-6 bg-gray-800/30 rounded-xl border border-white/10">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Actionable Takeaways</h3>
            <p className="text-gray-400 text-sm">
              Get specific tips for entrepreneurs, creators, and viewers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};