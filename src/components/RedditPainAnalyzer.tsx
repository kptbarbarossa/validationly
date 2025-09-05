'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, TrendingUp, Users, MessageSquare, AlertCircle } from 'lucide-react';

interface PainAnalysisResult {
  run_id: string;
  score: number;
  breakdown: {
    reddit_pain: {
      score: number;
      strength: number;
      freshness: number;
      confidence: number;
    };
  };
  insights: {
    reddit: {
      top_pains: Array<{
        pain: string;
        severity: number;
        who: string;
        quote?: string;
      }>;
      examples: Array<{
        title: string;
        subreddit: string;
        created_utc: string;
      }>;
      aggregate_engagement: number;
      total_documents: number;
    };
  };
}

export default function RedditPainAnalyzer() {
  const [idea, setIdea] = useState('');
  const [keywords, setKeywords] = useState('');
  const [targetSegments, setTargetSegments] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PainAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzePain = async () => {
    if (!idea.trim()) {
      setError('Please enter an idea to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/reddit/pain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea.trim(),
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          target_segments: targetSegments.split(',').map(s => s.trim()).filter(s => s),
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-400';
    if (score >= 0.5) return 'text-yellow-400';
    if (score >= 0.3) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.7) return 'bg-green-500/20 border-green-500/30';
    if (score >= 0.5) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 0.3) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          🔍 Reddit Pain Mining
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Discover pain points and validate your startup ideas using real Reddit discussions
        </p>
      </div>

      {/* Analysis Form */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Analyze Your Idea</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Startup Idea *
            </label>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your startup idea..."
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Keywords (comma-separated)
              </label>
              <Input
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="teacher, education, planning..."
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Segments (comma-separated)
              </label>
              <Input
                value={targetSegments}
                onChange={(e) => setTargetSegments(e.target.value)}
                placeholder="teachers, students, parents..."
                className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <Button
            onClick={analyzePain}
            disabled={loading || !idea.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Analyzing Reddit Data...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Analyze Pain Points
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-red-400">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pain Analysis Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className={`inline-block px-6 py-3 rounded-full text-3xl font-bold border ${getScoreBg(result.score)} ${getScoreColor(result.score)}`}>
                  {Math.round(result.score * 100)}
                </div>
                <p className="text-gray-400 mt-2">
                  Based on Reddit pain point analysis
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {Math.round(result.breakdown.reddit_pain.strength * 100)}
                </div>
                <div className="text-sm text-gray-400">Strength</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(result.breakdown.reddit_pain.freshness * 100)}
                </div>
                <div className="text-sm text-gray-400">Freshness</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {Math.round(result.breakdown.reddit_pain.confidence * 100)}
                </div>
                <div className="text-sm text-gray-400">Confidence</div>
              </CardContent>
            </Card>
          </div>

          {/* Top Pain Points */}
          {result.insights.reddit.top_pains.length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Pain Points Found
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {result.insights.reddit.top_pains.map((pain, i) => (
                    <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{pain.pain}</h4>
                        <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30">
                          Severity: {pain.severity}/5
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 mb-1">
                        <strong>Who:</strong> {pain.who}
                      </p>
                      {pain.quote && (
                        <blockquote className="text-sm text-gray-300 italic border-l-2 border-gray-600 pl-3">
                          "{pain.quote}"
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Example Threads */}
          {result.insights.reddit.examples.length > 0 && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Example Reddit Threads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.insights.reddit.examples.map((example, i) => (
                    <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                      <h4 className="font-medium text-white mb-1">{example.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                          r/{example.subreddit}
                        </Badge>
                        <span>{new Date(example.created_utc).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Analysis Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {result.insights.reddit.total_documents}
                  </div>
                  <div className="text-sm text-gray-400">Documents Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(result.insights.reddit.aggregate_engagement)}
                  </div>
                  <div className="text-sm text-gray-400">Total Engagement</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
