// Reddit Community Analysis
// Simulates Reddit API data for development - replace with real Reddit API in production

interface RedditPost {
  title: string;
  content: string;
  upvotes: number;
  comments: number;
  subreddit: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  relevanceScore: number;
}

interface RedditAnalysis {
  totalPosts: number;
  averageSentiment: number; // -100 to +100
  topSubreddits: string[];
  keyInsights: string[];
  communityInterest: number; // 0-100
  painPoints: string[];
  solutions: string[];
  discussionTopics: string[];
}

class RedditAnalyzer {
  private relevantSubreddits = [
    'startups', 'entrepreneur', 'business', 'smallbusiness', 'SaaS',
    'technology', 'programming', 'webdev', 'marketing', 'productivity',
    'investing', 'personalfinance', 'freelance', 'remotework', 'innovation'
  ];

  private async extractKeywords(content: string): Promise<string[]> {
    // Extract relevant keywords for Reddit search
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .filter(word => !this.isStopWord(word));
    
    return [...new Set(words)].slice(0, 3);
  }

  private isStopWord(word: string): boolean {
    const stopWords = [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 
      'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 
      'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'who', 'with'
    ];
    return stopWords.includes(word.toLowerCase());
  }

  private simulateRedditPosts(keywords: string[]): RedditPost[] {
    const posts: RedditPost[] = [];
    
    // Generate simulated posts for each keyword
    keywords.forEach(keyword => {
      const numPosts = Math.floor(Math.random() * 5) + 2; // 2-6 posts per keyword
      
      for (let i = 0; i < numPosts; i++) {
        const subreddit = this.relevantSubreddits[Math.floor(Math.random() * this.relevantSubreddits.length)];
        const upvotes = Math.floor(Math.random() * 500) + 10;
        const comments = Math.floor(Math.random() * 100) + 5;
        
        // Generate realistic post content
        const postTemplates = [
          `Looking for ${keyword} solutions - any recommendations?`,
          `Has anyone tried ${keyword} tools? What worked for you?`,
          `Struggling with ${keyword} - need advice from the community`,
          `Built a ${keyword} solution - would love feedback`,
          `${keyword} is becoming essential for businesses`,
          `What's the best approach to ${keyword}?`
        ];
        
        const title = postTemplates[Math.floor(Math.random() * postTemplates.length)];
        const content = this.generatePostContent(keyword, subreddit);
        
        // Determine sentiment based on upvotes and content
        let sentiment: 'positive' | 'neutral' | 'negative';
        if (upvotes > 200 && !content.includes('problem') && !content.includes('issue')) {
          sentiment = 'positive';
        } else if (upvotes < 50 || content.includes('problem') || content.includes('frustrated')) {
          sentiment = 'negative';
        } else {
          sentiment = 'neutral';
        }
        
        // Calculate relevance score
        const relevanceScore = this.calculateRelevance(title + ' ' + content, keyword);
        
        posts.push({
          title,
          content,
          upvotes,
          comments,
          subreddit,
          sentiment,
          relevanceScore
        });
      }
    });
    
    // Sort by relevance and upvotes
    return posts.sort((a, b) => (b.relevanceScore * b.upvotes) - (a.relevanceScore * a.upvotes));
  }

  private generatePostContent(keyword: string, subreddit: string): string {
    const contentTemplates = {
      startups: [
        `We're building a ${keyword} startup and looking for early users. The market seems ready but competition is fierce.`,
        `Anyone else working in the ${keyword} space? Would love to connect and share insights.`,
        `Raised seed funding for our ${keyword} platform. Happy to share lessons learned.`
      ],
      entrepreneur: [
        `Thinking about starting a ${keyword} business. What are the key challenges I should expect?`,
        `${keyword} has huge potential but requires significant investment. Worth the risk?`,
        `Successfully scaled my ${keyword} business to 6 figures. AMA!`
      ],
      technology: [
        `New ${keyword} technology is disrupting the industry. Thoughts on adoption timeline?`,
        `Open source ${keyword} tools vs commercial solutions - what's your experience?`,
        `AI is transforming ${keyword} - exciting times ahead for developers.`
      ],
      default: [
        `Community thoughts on ${keyword}? Seeing mixed reviews online.`,
        `${keyword} solutions are getting better but still have limitations.`,
        `Looking for ${keyword} recommendations that actually work.`
      ]
    };
    
    const templates = contentTemplates[subreddit as keyof typeof contentTemplates] || contentTemplates.default;
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private calculateRelevance(text: string, keyword: string): number {
    const lowerText = text.toLowerCase();
    const lowerKeyword = keyword.toLowerCase();
    
    let score = 0;
    
    // Exact keyword match
    if (lowerText.includes(lowerKeyword)) score += 50;
    
    // Partial matches
    const keywordParts = lowerKeyword.split(' ');
    keywordParts.forEach(part => {
      if (lowerText.includes(part)) score += 20;
    });
    
    // Context relevance
    const relevantTerms = ['solution', 'tool', 'platform', 'service', 'app', 'software'];
    relevantTerms.forEach(term => {
      if (lowerText.includes(term)) score += 10;
    });
    
    return Math.min(100, score);
  }

  async analyzeRedditCommunity(content: string): Promise<RedditAnalysis> {
    try {
      console.log('🔍 Analyzing Reddit community for:', content.substring(0, 100));
      
      // Extract keywords
      const keywords = await this.extractKeywords(content);
      console.log('📊 Reddit keywords:', keywords);
      
      // Simulate Reddit posts
      const posts = this.simulateRedditPosts(keywords);
      
      // Calculate metrics
      const totalPosts = posts.length;
      const averageSentiment = this.calculateAverageSentiment(posts);
      const topSubreddits = this.getTopSubreddits(posts);
      const communityInterest = this.calculateCommunityInterest(posts);
      
      // Extract insights
      const keyInsights = this.generateInsights(posts, averageSentiment, communityInterest);
      const painPoints = this.extractPainPoints(posts);
      const solutions = this.extractSolutions(posts);
      const discussionTopics = this.extractDiscussionTopics(posts);
      
      console.log('✅ Reddit analysis completed');
      
      return {
        totalPosts,
        averageSentiment,
        topSubreddits,
        keyInsights,
        communityInterest,
        painPoints,
        solutions,
        discussionTopics
      };
      
    } catch (error) {
      console.error('❌ Reddit analysis failed:', error);
      
      // Return fallback data
      return {
        totalPosts: 0,
        averageSentiment: 0,
        topSubreddits: [],
        keyInsights: ['Reddit data temporarily unavailable'],
        communityInterest: 50,
        painPoints: [],
        solutions: [],
        discussionTopics: []
      };
    }
  }

  private calculateAverageSentiment(posts: RedditPost[]): number {
    if (posts.length === 0) return 0;
    
    const sentimentScores = posts.map(post => {
      switch (post.sentiment) {
        case 'positive': return 50;
        case 'neutral': return 0;
        case 'negative': return -50;
        default: return 0;
      }
    });
    
    return Math.round(sentimentScores.reduce((sum, score) => sum + score, 0) / posts.length);
  }

  private getTopSubreddits(posts: RedditPost[]): string[] {
    const subredditCounts = new Map<string, number>();
    
    posts.forEach(post => {
      const count = subredditCounts.get(post.subreddit) || 0;
      subredditCounts.set(post.subreddit, count + 1);
    });
    
    return Array.from(subredditCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([subreddit]) => subreddit);
  }

  private calculateCommunityInterest(posts: RedditPost[]): number {
    if (posts.length === 0) return 0;
    
    const totalEngagement = posts.reduce((sum, post) => sum + post.upvotes + post.comments, 0);
    const avgEngagement = totalEngagement / posts.length;
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.round(avgEngagement / 10));
  }

  private generateInsights(posts: RedditPost[], sentiment: number, interest: number): string[] {
    const insights: string[] = [];
    
    // Sentiment insights
    if (sentiment > 20) {
      insights.push('😊 Community sentiment is positive - users are receptive to solutions');
    } else if (sentiment < -20) {
      insights.push('😟 Community sentiment is negative - significant pain points exist');
    } else {
      insights.push('😐 Community sentiment is neutral - mixed opinions on current solutions');
    }
    
    // Interest level insights
    if (interest > 70) {
      insights.push('🔥 High community engagement - strong interest in this topic');
    } else if (interest < 30) {
      insights.push('💤 Low community engagement - niche topic or limited awareness');
    } else {
      insights.push('📊 Moderate community engagement - steady interest exists');
    }
    
    // Post volume insights
    if (posts.length > 15) {
      insights.push('📈 High discussion volume - active community conversations');
    } else if (posts.length < 5) {
      insights.push('📉 Limited discussion volume - emerging or niche topic');
    }
    
    // Top subreddit insight
    const topSubreddits = this.getTopSubreddits(posts);
    if (topSubreddits.length > 0) {
      insights.push(`💬 Most active in r/${topSubreddits[0]} - target this community`);
    }
    
    return insights.slice(0, 4);
  }

  private extractPainPoints(posts: RedditPost[]): string[] {
    const painPoints: string[] = [];
    
    // Look for negative posts and common complaints
    const negativePosts = posts.filter(p => p.sentiment === 'negative');
    
    const commonPainPoints = [
      'Expensive solutions',
      'Complex setup process',
      'Limited features',
      'Poor customer support',
      'Integration difficulties',
      'Steep learning curve'
    ];
    
    // Simulate pain point extraction
    commonPainPoints.forEach(pain => {
      if (Math.random() > 0.6) {
        painPoints.push(pain);
      }
    });
    
    return painPoints.slice(0, 3);
  }

  private extractSolutions(posts: RedditPost[]): string[] {
    const solutions: string[] = [];
    
    const commonSolutions = [
      'Open source alternatives',
      'Freemium pricing models',
      'Better documentation',
      'Community support',
      'API integrations',
      'Mobile-first approach'
    ];
    
    // Simulate solution extraction
    commonSolutions.forEach(solution => {
      if (Math.random() > 0.7) {
        solutions.push(solution);
      }
    });
    
    return solutions.slice(0, 3);
  }

  private extractDiscussionTopics(posts: RedditPost[]): string[] {
    const topics = posts.map(post => {
      // Extract key topics from titles
      const words = post.title.toLowerCase().split(' ');
      return words.filter(word => word.length > 4 && !this.isStopWord(word));
    }).flat();
    
    // Count frequency and return top topics
    const topicCounts = new Map<string, number>();
    topics.forEach(topic => {
      const count = topicCounts.get(topic) || 0;
      topicCounts.set(topic, count + 1);
    });
    
    return Array.from(topicCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  }
}

export default RedditAnalyzer;
export type { RedditPost, RedditAnalysis };