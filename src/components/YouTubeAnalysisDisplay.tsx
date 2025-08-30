import React from 'react';

interface VideoSummary {
  main_topic: string;
  key_message: string;
  important_sections: string[];
  chronological_flow: string[];
  statistics_and_examples: string[];
}

interface DetailedAnalysis {
  methods_and_tools: string[];
  approaches: string[];
  speaker_experience: string[];
  lessons_learned: string[];
  target_audience_insights: string[];
}

interface CommentAnalysis {
  recurring_ideas: string[];
  common_phrases: string[];
  positive_feedback: string[];
  negative_feedback: string[];
  community_perception: {
    support_level: 'high' | 'medium' | 'low';
    criticism_level: 'high' | 'medium' | 'low';
    suggestions_count: number;
  };
}

interface SummaryTable {
  beginning: string;
  strategy: string;
  user_response: string;
  revenue_outcome: string;
}

interface InsightsAndLessons {
  main_lessons: string[];
  actionable_tips_entrepreneurs: string[];
  actionable_tips_content_creators: string[];
  actionable_tips_viewers: string[];
}

interface StructuredVideoAnalysis {
  video_summary: VideoSummary;
  detailed_analysis: DetailedAnalysis;
  comment_analysis: CommentAnalysis;
  summary_table: SummaryTable;
  insights_and_lessons: InsightsAndLessons;
}

interface YouTubeAnalysisDisplayProps {
  analysis: StructuredVideoAnalysis;
  videoUrl: string;
}

export const YouTubeAnalysisDisplay: React.FC<YouTubeAnalysisDisplayProps> = ({
  analysis,
  videoUrl
}) => {
  const getSupportLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCriticismLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-400 bg-red-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          📺 YouTube Video Analysis
        </h1>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
          <p className="text-gray-400 text-sm mb-2">Analyzing Video:</p>
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 break-all"
          >
            {videoUrl}
          </a>
        </div>
      </div>

      {/* 1. Video Summary */}
      <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          📋 1. Video Summary
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">Main Topic & Message</h3>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
              <p className="text-white font-medium mb-2">Topic:</p>
              <p className="text-gray-300">{analysis.video_summary.main_topic}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-white font-medium mb-2">Key Message:</p>
              <p className="text-gray-300">{analysis.video_summary.key_message}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">Structure & Flow</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white font-medium mb-2">Important Sections:</p>
                <ul className="space-y-1">
                  {analysis.video_summary.important_sections.map((section, i) => (
                    <li key={i} className="text-gray-300 text-sm flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      {section}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <p className="text-white font-medium mb-2">Chronological Flow:</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.video_summary.chronological_flow.map((flow, i) => (
                    <span 
                      key={i}
                      className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                    >
                      {i + 1}. {flow}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {analysis.video_summary.statistics_and_examples.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-green-400 mb-3">Statistics & Examples</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.video_summary.statistics_and_examples.map((stat, i) => (
                <span 
                  key={i}
                  className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg text-sm font-mono"
                >
                  {stat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Detailed Analysis */}
      <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          🔍 2. Detailed Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-orange-400 font-semibold mb-2">Methods & Tools</h3>
              <ul className="space-y-1">
                {analysis.detailed_analysis.methods_and_tools.map((method, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-orange-400 mr-2">🛠️</span>
                    {method}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-cyan-400 font-semibold mb-2">Approaches</h3>
              <ul className="space-y-1">
                {analysis.detailed_analysis.approaches.map((approach, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-cyan-400 mr-2">📈</span>
                    {approach}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-pink-400 font-semibold mb-2">Speaker Experience</h3>
              <ul className="space-y-1">
                {analysis.detailed_analysis.speaker_experience.map((exp, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-pink-400 mr-2">👤</span>
                    {exp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-indigo-400 font-semibold mb-2">Target Audience</h3>
              <ul className="space-y-1">
                {analysis.detailed_analysis.target_audience_insights.map((insight, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-indigo-400 mr-2">🎯</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {analysis.detailed_analysis.lessons_learned.length > 0 && (
          <div className="mt-6">
            <h3 className="text-yellow-400 font-semibold mb-3">Lessons Learned</h3>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <ul className="space-y-2">
                {analysis.detailed_analysis.lessons_learned.map((lesson, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-yellow-400 mr-2">💡</span>
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 3. Comment Analysis */}
      <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          💬 3. Comment Analysis (Community Response)
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Community Perception */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">Community Perception</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Support Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSupportLevelColor(analysis.comment_analysis.community_perception.support_level)}`}>
                  {analysis.comment_analysis.community_perception.support_level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Criticism Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCriticismLevelColor(analysis.comment_analysis.community_perception.criticism_level)}`}>
                  {analysis.comment_analysis.community_perception.criticism_level}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Suggestions:</span>
                <span className="text-blue-400 font-semibold">
                  {analysis.comment_analysis.community_perception.suggestions_count}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-green-400 font-semibold mb-3">✅ Positive Feedback</h3>
                <div className="space-y-2">
                  {analysis.comment_analysis.positive_feedback.slice(0, 3).map((feedback, i) => (
                    <div key={i} className="bg-green-500/10 border border-green-500/20 rounded p-3">
                      <p className="text-gray-300 text-sm italic">"{feedback.slice(0, 100)}..."</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-red-400 font-semibold mb-3">❌ Negative Feedback</h3>
                <div className="space-y-2">
                  {analysis.comment_analysis.negative_feedback.slice(0, 3).map((feedback, i) => (
                    <div key={i} className="bg-red-500/10 border border-red-500/20 rounded p-3">
                      <p className="text-gray-300 text-sm italic">"{feedback.slice(0, 100)}..."</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recurring Ideas */}
        <div className="mt-6">
          <h3 className="text-purple-400 font-semibold mb-3">🔄 Recurring Ideas & Common Phrases</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.comment_analysis.recurring_ideas.map((idea, i) => (
              <span 
                key={i}
                className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm"
              >
                {idea}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Summary Table */}
      <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          📊 4. Summary Table
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 text-blue-400 font-semibold">Topic</th>
                <th className="text-left py-3 px-4 text-blue-400 font-semibold">Key Point</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 font-medium">Beginning</td>
                <td className="py-3 px-4">{analysis.summary_table.beginning}</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 font-medium">Strategy</td>
                <td className="py-3 px-4">{analysis.summary_table.strategy}</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-3 px-4 font-medium">User Response</td>
                <td className="py-3 px-4">{analysis.summary_table.user_response}</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Revenue/Outcome</td>
                <td className="py-3 px-4">{analysis.summary_table.revenue_outcome}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Insights & Lessons */}
      <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          🎯 5. Insights & Lessons
        </h2>
        
        <div className="space-y-6">
          {/* Main Lessons */}
          <div>
            <h3 className="text-yellow-400 font-semibold mb-3">💡 Main Lessons</h3>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <ul className="space-y-2">
                {analysis.insights_and_lessons.main_lessons.map((lesson, i) => (
                  <li key={i} className="text-gray-300 flex items-start">
                    <span className="text-yellow-400 mr-2 mt-1">•</span>
                    {lesson}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-green-400 font-semibold mb-3">🚀 For Entrepreneurs</h3>
              <ul className="space-y-2">
                {analysis.insights_and_lessons.actionable_tips_entrepreneurs.map((tip, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-green-400 mr-2">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-blue-400 font-semibold mb-3">🎬 For Content Creators</h3>
              <ul className="space-y-2">
                {analysis.insights_and_lessons.actionable_tips_content_creators.map((tip, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-blue-400 mr-2">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-purple-400 font-semibold mb-3">👥 For Viewers</h3>
              <ul className="space-y-2">
                {analysis.insights_and_lessons.actionable_tips_viewers.map((tip, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start">
                    <span className="text-purple-400 mr-2">✓</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};