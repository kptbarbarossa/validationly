// Reddit API Helper Functions
interface RedditPost {
    title: string;
    selftext: string;
    score: number;
    num_comments: number;
    created_utc: number;
    subreddit: string;
    permalink: string;
    url: string;
}

interface RedditSearchResult {
    posts: RedditPost[];
    totalPosts: number;
    averageScore: number;
    averageComments: number;
    topSubreddits: string[];
    sentiment: number;
}

class RedditAPI {
    private accessToken: string | null = null;
    private clientId: string;
    private clientSecret: string;

    constructor() {
        this.clientId = process.env.REDDIT_CLIENT_ID || '';
        this.clientSecret = process.env.REDDIT_CLIENT_SECRET || '';
    }

    // Get app-only access token (no user auth needed for public data)
    async getAccessToken(): Promise<string> {
        if (this.accessToken) {
            return this.accessToken;
        }

        try {
            const response = await fetch('https://www.reddit.com/api/v1/access_token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
                    'User-Agent': 'Validationly/1.0'
                },
                body: new URLSearchParams({
                    grant_type: 'client_credentials'
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`Token request failed: ${JSON.stringify(data)}`);
            }

            this.accessToken = data.access_token;
            
            // Token expires, clear it after some time
            setTimeout(() => {
                this.accessToken = null;
            }, (data.expires_in - 60) * 1000); // Refresh 1 minute before expiry

            if (!this.accessToken) {
                throw new Error('Failed to obtain access token');
            }
            return this.accessToken;
        } catch (error) {
            console.error('Reddit token error:', error);
            throw error;
        }
    }

    // Search Reddit for posts related to the idea
    async searchPosts(query: string, limit: number = 25): Promise<RedditSearchResult> {
        try {
            const token = await this.getAccessToken();
            
            // Search in relevant subreddits
            const subreddits = [
                'entrepreneur', 'startups', 'SaaS', 'technology', 'business',
                'smallbusiness', 'Entrepreneur', 'startup', 'ProductHunt'
            ];

            const allPosts: RedditPost[] = [];
            const subredditCounts: { [key: string]: number } = {};

            // Search each subreddit
            for (const subreddit of subreddits.slice(0, 5)) { // Limit to 5 subreddits to avoid rate limits
                try {
                    const searchUrl = `https://oauth.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=relevance&limit=${Math.ceil(limit / 5)}`;
                    
                    const response = await fetch(searchUrl, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'User-Agent': 'Validationly/1.0'
                        }
                    });

                    if (!response.ok) {
                        console.warn(`Search failed for r/${subreddit}:`, response.status);
                        continue;
                    }

                    const data = await response.json();
                    const posts = data.data?.children || [];

                    posts.forEach((post: any) => {
                        const postData = post.data;
                        allPosts.push({
                            title: postData.title,
                            selftext: postData.selftext || '',
                            score: postData.score,
                            num_comments: postData.num_comments,
                            created_utc: postData.created_utc,
                            subreddit: postData.subreddit,
                            permalink: postData.permalink,
                            url: postData.url
                        });

                        subredditCounts[postData.subreddit] = (subredditCounts[postData.subreddit] || 0) + 1;
                    });

                    // Rate limiting - wait between requests
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.warn(`Error searching r/${subreddit}:`, error);
                }
            }

            // Calculate metrics
            const totalPosts = allPosts.length;
            const averageScore = totalPosts > 0 ? allPosts.reduce((sum, post) => sum + post.score, 0) / totalPosts : 0;
            const averageComments = totalPosts > 0 ? allPosts.reduce((sum, post) => sum + post.num_comments, 0) / totalPosts : 0;
            
            const topSubreddits = Object.entries(subredditCounts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([subreddit]) => subreddit);

            // Simple sentiment analysis based on scores and engagement
            const sentiment = this.calculateSentiment(allPosts);

            return {
                posts: allPosts.slice(0, limit),
                totalPosts,
                averageScore,
                averageComments,
                topSubreddits,
                sentiment
            };

        } catch (error) {
            console.error('Reddit search error:', error);
            throw error;
        }
    }

    private calculateSentiment(posts: RedditPost[]): number {
        if (posts.length === 0) return 0;

        // Simple sentiment based on engagement metrics
        let sentimentScore = 0;
        
        posts.forEach(post => {
            // Positive indicators
            if (post.score > 10) sentimentScore += 2;
            if (post.num_comments > 5) sentimentScore += 1;
            if (post.score > 50) sentimentScore += 3;
            
            // Negative indicators (very low scores might indicate negative sentiment)
            if (post.score < 0) sentimentScore -= 2;
        });

        // Normalize to -100 to +100 range
        const maxPossibleScore = posts.length * 6; // Max positive score per post
        const normalizedSentiment = Math.max(-100, Math.min(100, (sentimentScore / maxPossibleScore) * 100));
        
        return Math.round(normalizedSentiment);
    }

    // Get trending posts from relevant subreddits
    async getTrendingPosts(subreddits: string[] = ['entrepreneur', 'startups'], limit: number = 10): Promise<RedditPost[]> {
        try {
            const token = await this.getAccessToken();
            const allPosts: RedditPost[] = [];

            for (const subreddit of subreddits) {
                try {
                    const response = await fetch(`https://oauth.reddit.com/r/${subreddit}/hot.json?limit=${limit}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'User-Agent': 'Validationly/1.0'
                        }
                    });

                    if (!response.ok) continue;

                    const data = await response.json();
                    const posts = data.data?.children || [];

                    posts.forEach((post: any) => {
                        const postData = post.data;
                        allPosts.push({
                            title: postData.title,
                            selftext: postData.selftext || '',
                            score: postData.score,
                            num_comments: postData.num_comments,
                            created_utc: postData.created_utc,
                            subreddit: postData.subreddit,
                            permalink: postData.permalink,
                            url: postData.url
                        });
                    });

                    await new Promise(resolve => setTimeout(resolve, 1000));
                } catch (error) {
                    console.warn(`Error getting trending from r/${subreddit}:`, error);
                }
            }

            return allPosts.slice(0, limit);
        } catch (error) {
            console.error('Reddit trending error:', error);
            return [];
        }
    }
}

export default RedditAPI;
export type { RedditPost, RedditSearchResult };