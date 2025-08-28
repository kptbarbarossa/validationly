import type { VercelRequest, VercelResponse } from '@vercel/node';

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    type: string;
  };
  topics: string[];
  watchers_count: number;
  size: number;
  default_branch: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepository[];
}

interface GitHubValidationResult {
  totalResults: number;
  items: GitHubRepository[];
  analysis: {
    averageStars: number;
    averageForks: number;
    averageIssues: number;
    topLanguages: string[];
    sentiment: 'positive' | 'negative' | 'neutral';
    trendingRepos: string[];
    engagementScore: number;
    marketValidation: {
      highInterest: boolean;
      competitionLevel: 'high' | 'medium' | 'low';
      marketOpportunity: string;
      developmentActivity: string;
    };
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query, analysisType = 'comprehensive' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Search GitHub using REST API
    const githubData = await searchGitHub(query, analysisType);

    res.status(200).json(githubData);
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch GitHub data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function searchGitHub(query: string, analysisType: string): Promise<GitHubValidationResult> {
  try {
    // Get GitHub access token from environment
    const accessToken = process.env.GITHUB_ACCESS_TOKEN;
    
    if (!accessToken) {
      console.warn('GitHub access token not configured, using fallback data');
      return generateFallbackData();
    }

    // Search repositories on GitHub
    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=50`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `token ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Validationly-GitHub-Integration'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubSearchResponse = await response.json();
    
    // Analyze the results
    const analysis = analyzeGitHubResults(data.items, query);
    
    return {
      totalResults: data.total_count,
      items: data.items.slice(0, 20), // Return top 20 results
      analysis
    };
  } catch (error) {
    console.error('Error searching GitHub:', error);
    
    // Return fallback data if API fails
    return generateFallbackData();
  }
}

function analyzeGitHubResults(repos: GitHubRepository[], query: string): GitHubValidationResult['analysis'] {
  if (repos.length === 0) {
    return {
      averageStars: 0,
      averageForks: 0,
      averageIssues: 0,
      topLanguages: [],
      sentiment: 'neutral',
      trendingRepos: [],
      engagementScore: 0,
      marketValidation: {
        highInterest: false,
        competitionLevel: 'low',
        marketOpportunity: 'No existing repositories found - potential blue ocean opportunity',
        developmentActivity: 'No development activity detected'
      }
    };
  }

  // Calculate averages
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalIssues = repos.reduce((sum, repo) => sum + repo.open_issues_count, 0);
  const averageStars = Math.round(totalStars / repos.length);
  const averageForks = Math.round(totalForks / repos.length);
  const averageIssues = Math.round(totalIssues / repos.length);

  // Find top languages
  const languageCounts: { [key: string]: number } = {};
  repos.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  });
  const topLanguages = Object.entries(languageCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([language]) => language);

  // Analyze sentiment based on stars and forks
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  if (averageStars > 100 && averageForks > 20) {
    sentiment = 'positive';
  } else if (averageStars < 10 && averageForks < 5) {
    sentiment = 'negative';
  }

  // Extract trending repository names
  const trendingRepos = repos
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 5)
    .map(repo => repo.name);

  // Calculate engagement score (0-100)
  const engagementScore = Math.min(100, Math.round(
    ((averageStars / 500) * 0.6 + (averageForks / 100) * 0.4) * 100
  ));

  // Market validation analysis
  const marketValidation = analyzeMarketValidation(repos, query);

  return {
    averageStars,
    averageForks,
    averageIssues,
    topLanguages,
    sentiment,
    trendingRepos,
    engagementScore,
    marketValidation
  };
}

function analyzeMarketValidation(repos: GitHubRepository[], query: string): GitHubValidationResult['analysis']['marketValidation'] {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const avgStars = totalStars / repos.length;
  
  // Determine competition level
  let competitionLevel: 'high' | 'medium' | 'low' = 'low';
  if (repos.length > 30 && avgStars > 100) {
    competitionLevel = 'high';
  } else if (repos.length > 15 && avgStars > 30) {
    competitionLevel = 'medium';
  }

  // Determine market opportunity
  let marketOpportunity = '';
  if (competitionLevel === 'high') {
    marketOpportunity = 'High competition indicates strong market demand - focus on unique features';
  } else if (competitionLevel === 'medium') {
    marketOpportunity = 'Moderate competition with growth potential - identify underserved niches';
  } else {
    marketOpportunity = 'Low competition suggests untapped market opportunity';
  }

  // Analyze development activity
  const recentRepos = repos.filter(repo => {
    const updatedDate = new Date(repo.updated_at);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    return updatedDate > threeMonthsAgo;
  });

  let developmentActivity = '';
  if (recentRepos.length > repos.length * 0.7) {
    developmentActivity = 'High development activity - market is actively evolving';
  } else if (recentRepos.length > repos.length * 0.4) {
    developmentActivity = 'Moderate development activity - steady market growth';
  } else {
    developmentActivity = 'Low development activity - market may be mature or declining';
  }

  return {
    highInterest: avgStars > 50,
    competitionLevel,
    marketOpportunity,
    developmentActivity
  };
}

function generateFallbackData(): GitHubValidationResult {
  return {
    totalResults: 0,
    items: [],
    analysis: {
      averageStars: 0,
      averageForks: 0,
      averageIssues: 0,
      topLanguages: [],
      sentiment: 'neutral',
      trendingRepos: [],
      engagementScore: 0,
      marketValidation: {
        highInterest: false,
        competitionLevel: 'low',
        marketOpportunity: 'GitHub data unavailable - check API configuration',
        developmentActivity: 'No development activity data available'
      }
    }
  };
}
