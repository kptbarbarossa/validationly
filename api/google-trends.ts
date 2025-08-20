import { NextRequest, NextResponse } from 'next/server';

// Google Trends API endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const timeframe = searchParams.get('timeframe') || 'today 12-m'; // Default: last 12 months

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    console.log('🔍 Google Trends analysis for:', keyword);

    // Simulate Google Trends data (in real implementation, you'd use Google Trends API)
    const trendData = await getGoogleTrendsData(keyword, timeframe);

    return NextResponse.json({
      success: true,
      keyword,
      timeframe,
      data: trendData
    });

  } catch (error) {
    console.error('❌ Google Trends API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    );
  }
}

// Simulated Google Trends data function
async function getGoogleTrendsData(keyword: string, timeframe: string): Promise<any> {
  // In real implementation, this would call Google Trends API
  // For now, we'll simulate realistic trend data
  
  const baseScore = Math.floor(Math.random() * 40) + 30; // 30-70 base score
  
  // Generate trend data for the last 12 months
  const months = 12;
  const trendData = [];
  
  for (let i = 0; i < months; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - (months - 1 - i));
    
    // Simulate realistic trend patterns
    let score = baseScore;
    
    // Add some seasonal variation
    if (i === 0 || i === months - 1) score += Math.floor(Math.random() * 20); // Start/end boost
    if (i === Math.floor(months / 2)) score += Math.floor(Math.random() * 30); // Mid-year boost
    
    // Add random fluctuations
    score += Math.floor(Math.random() * 20) - 10;
    
    // Ensure score stays within reasonable bounds
    score = Math.max(0, Math.min(100, score));
    
    trendData.push({
      date: month.toISOString().split('T')[0],
      score: score,
      month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    });
  }

  // Calculate trend metrics
  const recentMonths = trendData.slice(-3);
  const olderMonths = trendData.slice(0, 3);
  
  const recentAvg = recentMonths.reduce((sum, item) => sum + item.score, 0) / recentMonths.length;
  const olderAvg = olderMonths.reduce((sum, item) => sum + item.score, 0) / olderMonths.length;
  
  const momentum = recentAvg - olderAvg;
  const momentumPercentage = ((momentum / olderAvg) * 100).toFixed(1);
  
  // Determine trend direction
  let trendDirection = 'stable';
  if (momentum > 10) trendDirection = 'rising';
  else if (momentum < -10) trendDirection = 'declining';
  
  // Calculate peak and valley
  const scores = trendData.map(item => item.score);
  const peak = Math.max(...scores);
  const valley = Math.min(...scores);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  // Generate related topics (simulated)
  const relatedTopics = generateRelatedTopics(keyword);
  
  // Generate geographic interest (simulated)
  const geographicInterest = generateGeographicInterest(keyword);

  return {
    trendData,
    metrics: {
      currentScore: trendData[trendData.length - 1].score,
      averageScore: Math.round(average),
      peakScore: peak,
      valleyScore: valley,
      momentum: Math.round(momentum),
      momentumPercentage: momentumPercentage,
      trendDirection,
      volatility: Math.round(calculateVolatility(scores))
    },
    relatedTopics,
    geographicInterest,
    insights: generateTrendInsights(keyword, trendDirection, momentum, average)
  };
}

function generateRelatedTopics(keyword: string): Array<{topic: string, score: number, growth: number}> {
  const baseTopics = [
    'startup', 'business', 'entrepreneur', 'innovation', 'technology',
    'marketing', 'growth', 'funding', 'product', 'service'
  ];
  
  return baseTopics
    .filter(topic => topic !== keyword.toLowerCase())
    .slice(0, 5)
    .map(topic => ({
      topic,
      score: Math.floor(Math.random() * 60) + 20,
      growth: Math.floor(Math.random() * 40) - 20
    }))
    .sort((a, b) => b.score - a.score);
}

function generateGeographicInterest(keyword: string): Array<{country: string, score: number, trend: string}> {
  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'India', 'Brazil', 'Japan', 'South Korea'
  ];
  
  return countries
    .slice(0, 6)
    .map(country => ({
      country,
      score: Math.floor(Math.random() * 80) + 20,
      trend: Math.random() > 0.5 ? 'rising' : 'stable'
    }))
    .sort((a, b) => b.score - a.score);
}

function calculateVolatility(scores: number[]): number {
  if (scores.length < 2) return 0;
  
  const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
  
  return Math.sqrt(variance);
}

function generateTrendInsights(keyword: string, direction: string, momentum: number, average: number): string[] {
  const insights = [];
  
  if (direction === 'rising') {
    insights.push(`Interest in "${keyword}" is growing steadily with ${Math.abs(momentum).toFixed(1)}% momentum`);
    insights.push('This suggests increasing market demand and potential for growth');
  } else if (direction === 'declining') {
    insights.push(`Interest in "${keyword}" has decreased by ${Math.abs(momentum).toFixed(1)}%`);
    insights.push('Consider timing and market saturation factors');
  } else {
    insights.push(`Interest in "${keyword}" remains stable`);
    insights.push('This indicates consistent, sustainable market demand');
  }
  
  if (average > 70) {
    insights.push('High overall interest suggests strong market potential');
  } else if (average > 40) {
    insights.push('Moderate interest indicates viable market opportunity');
  } else {
    insights.push('Lower interest may require niche targeting or market education');
  }
  
  return insights;
}
