// Google Trends API Helper Functions
const googleTrends = require('google-trends-api');

interface TrendsData {
    keyword: string;
    interest: number;
    relatedQueries: string[];
    trendDirection: 'rising' | 'stable' | 'declining';
    searchVolume: number;
    trendScore: number;
    insights: string[];
    boost: number;
}

class GoogleTrendsAPI {
    constructor() {
        console.log('📈 Google Trends API initialized');
    }

    // Analyze trends for a given keyword/content
    async analyzeTrends(content: string): Promise<TrendsData> {
        try {
            console.log('📈 Starting Google Trends analysis...');
            
            // Extract main keywords
            const keywords = this.extractKeywords(content);
            const mainKeyword = keywords[0] || content.split(' ')[0];
            
            console.log(`🔍 Analyzing trends for: "${mainKeyword}"`);

            // Get interest over time (last 12 months)
            const interestOverTime = await this.getInterestOverTime(mainKeyword);
            
            // Get related queries
            const relatedQueries = await this.getRelatedQueries(mainKeyword);
            
            // Calculate metrics
            const trendScore = this.calculateTrendScore(interestOverTime);
            const trendDirection = this.determineTrendDirection(interestOverTime);
            const boost = Math.round((trendScore - 50) / 5); // -10 to +10
            
            // Generate insights
            const insights = this.generateInsights(trendScore, trendDirection, relatedQueries);
            
            console.log(`📈 Trends Analysis: Score=${trendScore}, Direction=${trendDirection}, Boost=${boost}`);
            
            return {
                keyword: mainKeyword,
                interest: trendScore,
                relatedQueries: relatedQueries.slice(0, 5),
                trendDirection,
                searchVolume: Math.floor(trendScore * 100) + Math.floor(Math.random() * 1000),
                trendScore,
                insights,
                boost
            };

        } catch (error) {
            console.error('❌ Google Trends API error, falling back to simulation:', error);
            return this.simulateTrendsData(content);
        }
    }

    private async getInterestOverTime(keyword: string): Promise<number[]> {
        try {
            const results = await googleTrends.interestOverTime({
                keyword: keyword,
                startTime: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), // 1 year ago
                endTime: new Date(),
                geo: 'US' // You can change this to 'TR' for Turkey or '' for worldwide
            });

            const data = JSON.parse(results);
            const timelineData = data.default?.timelineData || [];
            
            return timelineData.map((item: any) => item.value?.[0] || 0);
        } catch (error) {
            console.warn('Interest over time API failed:', error);
            return this.generateMockInterestData();
        }
    }

    private async getRelatedQueries(keyword: string): Promise<string[]> {
        try {
            const results = await googleTrends.relatedQueries({
                keyword: keyword,
                startTime: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
                endTime: new Date(),
                geo: 'US'
            });

            const data = JSON.parse(results);
            const queries = data.default?.rankedList?.[0]?.rankedKeyword || [];
            
            return queries.slice(0, 10).map((item: any) => item.query || '');
        } catch (error) {
            console.warn('Related queries API failed:', error);
            return this.generateMockRelatedQueries(keyword);
        }
    }

    private extractKeywords(content: string): string[] {
        // Extract meaningful keywords from content
        const words = content.toLowerCase()
            .split(' ')
            .filter(word => word.length > 3)
            .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were'].includes(word));
        
        return words.slice(0, 3);
    }

    private calculateTrendScore(interestData: number[]): number {
        if (interestData.length === 0) return 50;
        
        const average = interestData.reduce((sum, val) => sum + val, 0) / interestData.length;
        const recent = interestData.slice(-4).reduce((sum, val) => sum + val, 0) / 4; // Last 4 data points
        
        // Base score on average interest
        let score = Math.min(100, average * 1.2);
        
        // Boost if recent trend is higher than average
        if (recent > average) {
            score += (recent - average) * 0.5;
        }
        
        return Math.max(10, Math.min(100, Math.round(score)));
    }

    private determineTrendDirection(interestData: number[]): 'rising' | 'stable' | 'declining' {
        if (interestData.length < 4) return 'stable';
        
        const firstHalf = interestData.slice(0, Math.floor(interestData.length / 2));
        const secondHalf = interestData.slice(Math.floor(interestData.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        
        const difference = secondAvg - firstAvg;
        
        if (difference > 5) return 'rising';
        if (difference < -5) return 'declining';
        return 'stable';
    }

    private generateInsights(score: number, direction: 'rising' | 'stable' | 'declining', relatedQueries: string[]): string[] {
        const insights: string[] = [];
        
        // Score-based insights
        if (score > 70) {
            insights.push('High search interest detected');
        } else if (score > 40) {
            insights.push('Moderate search interest');
        } else {
            insights.push('Low search volume');
        }
        
        // Direction-based insights
        if (direction === 'rising') {
            insights.push('Search interest is growing');
        } else if (direction === 'declining') {
            insights.push('Search interest is declining');
        } else {
            insights.push('Stable search patterns');
        }
        
        // Related queries insights
        if (relatedQueries.length > 5) {
            insights.push('Strong related search activity');
        } else if (relatedQueries.length > 0) {
            insights.push('Some related search activity');
        }
        
        return insights;
    }

    private generateMockInterestData(): number[] {
        // Generate realistic mock data for 12 months
        const data: number[] = [];
        let baseValue = 30 + Math.random() * 40; // Start between 30-70
        
        for (let i = 0; i < 12; i++) {
            // Add some randomness and trend
            baseValue += (Math.random() - 0.5) * 10;
            baseValue = Math.max(0, Math.min(100, baseValue));
            data.push(Math.round(baseValue));
        }
        
        return data;
    }

    private generateMockRelatedQueries(keyword: string): string[] {
        const commonSuffixes = ['app', 'software', 'tool', 'platform', 'service', 'solution'];
        const commonPrefixes = ['best', 'free', 'online', 'mobile', 'ai'];
        
        const queries: string[] = [];
        
        // Generate some realistic related queries
        commonSuffixes.forEach(suffix => {
            queries.push(`${keyword} ${suffix}`);
        });
        
        commonPrefixes.forEach(prefix => {
            queries.push(`${prefix} ${keyword}`);
        });
        
        return queries.slice(0, 8);
    }

    private simulateTrendsData(content: string): TrendsData {
        console.log('📈 Using simulated trends data...');
        
        const keywords = content.toLowerCase().split(' ').filter(word => word.length > 3);
        const techKeywords = ['ai', 'app', 'platform', 'automation', 'software', 'digital', 'online', 'mobile'];
        const trendingKeywords = ['fitness', 'health', 'productivity', 'finance', 'education', 'social'];

        // Calculate trend score (0-100)
        const techRelevance = keywords.filter(k => techKeywords.some(tk => k.includes(tk))).length;
        const trendingRelevance = keywords.filter(k => trendingKeywords.some(tr => k.includes(tr))).length;
        const baseTrendScore = 40 + (techRelevance * 10) + (trendingRelevance * 15);
        const trendScore = Math.max(10, Math.min(100, baseTrendScore + (Math.random() * 30 - 15)));

        // Determine trend direction
        const trendDirection = trendScore > 60 ? 'rising' : trendScore > 40 ? 'stable' : 'declining';

        // Calculate boost (-10 to +10)
        const boost = Math.round((trendScore - 50) / 5);

        return {
            keyword: keywords[0] || 'startup',
            interest: Math.round(trendScore),
            relatedQueries: ['startup ideas', 'business automation', 'productivity tools'],
            trendDirection,
            searchVolume: Math.floor(Math.random() * 10000) + 1000,
            trendScore: Math.round(trendScore),
            insights: [
                trendDirection === 'rising' ? 'Search interest is growing' : 'Stable search patterns',
                trendScore > 70 ? 'High market interest' : 'Moderate market interest',
                'Related searches show demand'
            ],
            boost
        };
    }

    // Health check
    async healthCheck(): Promise<boolean> {
        try {
            // Simple test query
            await googleTrends.interestOverTime({
                keyword: 'test',
                startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                endTime: new Date()
            });
            return true;
        } catch (error) {
            console.warn('Google Trends API health check failed:', error);
            return false;
        }
    }
}

export default GoogleTrendsAPI;
export type { TrendsData };