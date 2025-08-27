import React, { useState, useEffect } from 'react';

interface ATSScore {
  overall: number;
  formatting: number;
  keywords: number;
  structure: number;
  readability: number;
  issues: string[];
  suggestions: string[];
  keywords_found: string[];
  keywords_missing: string[];
}

interface ATSCheckerProps {
  cvText: string;
  jobDescription: string;
  userPlan: 'free' | 'pro';
  onUpgrade: () => void;
}

const ATSChecker: React.FC<ATSCheckerProps> = ({ cvText, jobDescription, userPlan, onUpgrade }) => {
  const [atsScore, setAtsScore] = useState<ATSScore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeATS = () => {
    if (userPlan === 'free') {
      onUpgrade();
      return;
    }

    if (!cvText.trim() || !jobDescription.trim()) {
      alert('Please provide both CV text and job description');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate ATS analysis (in real implementation, this would call an API)
    setTimeout(() => {
      const analysis = performATSAnalysis(cvText, jobDescription);
      setAtsScore(analysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const performATSAnalysis = (cv: string, jobDesc: string): ATSScore => {
    const cvLower = cv.toLowerCase();
    const jobLower = jobDesc.toLowerCase();
    
    // Extract keywords from job description
    const jobKeywords = extractKeywords(jobLower);
    const cvKeywords = extractKeywords(cvLower);
    
    // Find matching and missing keywords
    const keywordsFound = jobKeywords.filter(keyword => cvLower.includes(keyword));
    const keywordsMissing = jobKeywords.filter(keyword => !cvLower.includes(keyword));
    
    // Calculate scores
    const keywordScore = Math.round((keywordsFound.length / jobKeywords.length) * 100);
    const formattingScore = analyzeFormatting(cv);
    const structureScore = analyzeStructure(cv);
    const readabilityScore = analyzeReadability(cv);
    
    const overallScore = Math.round((keywordScore + formattingScore + structureScore + readabilityScore) / 4);
    
    // Generate issues and suggestions
    const issues = [];
    const suggestions = [];
    
    if (keywordScore < 70) {
      issues.push('Low keyword match with job description');
      suggestions.push('Include more relevant keywords from the job posting');
    }
    
    if (formattingScore < 80) {
      issues.push('Formatting may not be ATS-friendly');
      suggestions.push('Use standard section headers and avoid complex formatting');
    }
    
    if (structureScore < 75) {
      issues.push('CV structure could be improved');
      suggestions.push('Organize sections in standard order: Contact, Summary, Experience, Education, Skills');
    }
    
    if (readabilityScore < 70) {
      issues.push('Text readability could be enhanced');
      suggestions.push('Use bullet points and clear, concise language');
    }
    
    if (keywordsMissing.length > 5) {
      suggestions.push(`Consider adding these keywords: ${keywordsMissing.slice(0, 5).join(', ')}`);
    }
    
    return {
      overall: overallScore,
      formatting: formattingScore,
      keywords: keywordScore,
      structure: structureScore,
      readability: readabilityScore,
      issues,
      suggestions,
      keywords_found: keywordsFound,
      keywords_missing: keywordsMissing
    };
  };

  const extractKeywords = (text: string): string[] => {
    // Common technical and professional keywords
    const keywords = [];
    const patterns = [
      // Technical skills
      /\b(javascript|python|java|react|node\.?js|sql|aws|docker|kubernetes|git)\b/g,
      // Soft skills
      /\b(leadership|management|communication|teamwork|problem.solving|analytical)\b/g,
      // Experience levels
      /\b(\d+\+?\s*years?|senior|junior|lead|principal|architect)\b/g,
      // Education
      /\b(bachelor|master|phd|degree|certification|certified)\b/g,
      // Industries
      /\b(software|technology|healthcare|finance|marketing|sales|engineering)\b/g
    ];
    
    patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        keywords.push(...matches);
      }
    });
    
    return [...new Set(keywords)]; // Remove duplicates
  };

  const analyzeFormatting = (cv: string): number => {
    let score = 100;
    
    // Check for problematic formatting
    if (cv.includes('\t')) score -= 10; // Tabs can cause issues
    if (cv.match(/[^\x00-\x7F]/g)) score -= 5; // Special characters
    if (cv.split('\n').some(line => line.length > 100)) score -= 10; // Very long lines
    
    return Math.max(score, 0);
  };

  const analyzeStructure = (cv: string): number => {
    let score = 0;
    const cvLower = cv.toLowerCase();
    
    // Check for standard sections
    const sections = [
      'contact', 'summary', 'experience', 'education', 'skills',
      'work experience', 'professional experience', 'employment'
    ];
    
    sections.forEach(section => {
      if (cvLower.includes(section)) score += 15;
    });
    
    return Math.min(score, 100);
  };

  const analyzeReadability = (cv: string): number => {
    const sentences = cv.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = cv.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    let score = 100;
    
    // Penalize very long sentences
    if (avgWordsPerSentence > 25) score -= 20;
    if (avgWordsPerSentence > 35) score -= 30;
    
    // Check for bullet points (good for readability)
    const bulletPoints = cv.match(/^[\s]*[•\-\*]/gm);
    if (bulletPoints && bulletPoints.length > 5) score += 10;
    
    return Math.max(Math.min(score, 100), 0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">ATS Compatibility Check</h3>
        {userPlan === 'free' && (
          <span className="text-xs bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-3 py-1 rounded-full">
            Pro Feature
          </span>
        )}
      </div>

      {userPlan === 'free' ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🤖</div>
          <h4 className="text-lg font-medium text-white mb-2">ATS Optimization</h4>
          <p className="text-slate-300 mb-4">
            Ensure your CV passes Applicant Tracking Systems with our advanced compatibility checker.
          </p>
          <ul className="text-sm text-slate-400 mb-6 space-y-1">
            <li>• Keyword optimization analysis</li>
            <li>• Formatting compatibility check</li>
            <li>• Structure recommendations</li>
            <li>• Readability scoring</li>
            <li>• Missing keyword detection</li>
          </ul>
          <button
            onClick={onUpgrade}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={analyzeATS}
            disabled={isAnalyzing || !cvText.trim() || !jobDescription.trim()}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all duration-200 disabled:opacity-50 mb-6"
          >
            {isAnalyzing ? 'Analyzing ATS Compatibility...' : 'Check ATS Compatibility'}
          </button>

          {atsScore && (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(atsScore.overall)}`}>
                  {atsScore.overall}/100
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${getScoreBackground(atsScore.overall)}`}
                    style={{ width: `${atsScore.overall}%` }}
                  />
                </div>
                <p className="text-slate-300">Overall ATS Compatibility</p>
              </div>

              {/* Detailed Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className={`text-xl font-bold ${getScoreColor(atsScore.keywords)}`}>
                    {atsScore.keywords}%
                  </div>
                  <div className="text-sm text-slate-300">Keywords</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className={`text-xl font-bold ${getScoreColor(atsScore.formatting)}`}>
                    {atsScore.formatting}%
                  </div>
                  <div className="text-sm text-slate-300">Formatting</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className={`text-xl font-bold ${getScoreColor(atsScore.structure)}`}>
                    {atsScore.structure}%
                  </div>
                  <div className="text-sm text-slate-300">Structure</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4">
                  <div className={`text-xl font-bold ${getScoreColor(atsScore.readability)}`}>
                    {atsScore.readability}%
                  </div>
                  <div className="text-sm text-slate-300">Readability</div>
                </div>
              </div>

              {/* Issues */}
              {atsScore.issues.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-red-400 mb-2">⚠️ Issues Found</h4>
                  <ul className="text-sm text-red-300 space-y-1">
                    {atsScore.issues.map((issue, index) => (
                      <li key={index}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {atsScore.suggestions.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="font-medium text-blue-400 mb-2">💡 Suggestions</h4>
                  <ul className="text-sm text-blue-300 space-y-1">
                    {atsScore.suggestions.map((suggestion, index) => (
                      <li key={index}>• {suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Keywords Analysis */}
              <div className="grid md:grid-cols-2 gap-4">
                {atsScore.keywords_found.length > 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-green-400 mb-2">✅ Keywords Found</h4>
                    <div className="flex flex-wrap gap-1">
                      {atsScore.keywords_found.slice(0, 10).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-green-600/20 text-green-300 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {atsScore.keywords_missing.length > 0 && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
                    <h4 className="font-medium text-orange-400 mb-2">❌ Missing Keywords</h4>
                    <div className="flex flex-wrap gap-1">
                      {atsScore.keywords_missing.slice(0, 10).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-600/20 text-orange-300 text-xs rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ATSChecker;