// Premium MVP - 7 Platform System
// Focus on API + RSS feed only (no scraping)
export const SUPPORTED_PLATFORMS: string[] = [
  // Core social + discovery
  'reddit',        // Reddit API
  'hackernews',    // Hacker News API
  'producthunt',   // Product Hunt API
  
  // Dev & tech
  'github',        // GitHub API (repos, issues, stars)
  'stackoverflow', // Stack Overflow API (questions, answers, tags)
  
  // News & content
  'googlenews',    // Google News RSS feed
  'youtube',       // YouTube Data API (videos, comments)
];

export const PLATFORM_COUNT = SUPPORTED_PLATFORMS.length;


