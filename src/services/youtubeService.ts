interface YouTubeAnalysis {
    totalViews: number;
    averageViews: number;
    totalVideos: number;
    recentActivity: boolean;
    topChannels: string[];
    videos?: Array<{
        id: string;
        title: string;
        viewCount: string;
        channelTitle: string;
        publishedAt: string;
    }>;
}

export class YouTubeApiService {
    private baseUrl = '/api/youtube';

    async searchVideos(query: string): Promise<YouTubeAnalysis> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    action: 'search'
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'YouTube API request failed');
            }

            // Video verilerini analiz formatına çevir
            const videos = result.data.videos || [];
            const totalViews = videos.reduce((sum: number, video: any) =>
                sum + parseInt(video.viewCount || '0'), 0
            );

            const averageViews = videos.length > 0 ? totalViews / videos.length : 0;

            // Son 30 gün kontrolü
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentActivity = videos.some((video: any) =>
                new Date(video.publishedAt) > thirtyDaysAgo
            );

            // Top kanallar
            const channelCounts = videos.reduce((acc: Record<string, number>, video: any) => {
                acc[video.channelTitle] = (acc[video.channelTitle] || 0) + 1;
                return acc;
            }, {});

            const topChannels = Object.entries(channelCounts)
                .sort(([, a], [, b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([channel]) => channel);

            return {
                totalViews,
                averageViews: Math.round(averageViews),
                totalVideos: videos.length,
                recentActivity,
                topChannels,
                videos: videos.slice(0, 10) // İlk 10 videoyu döndür
            };

        } catch (error) {
            console.error('YouTube service error:', error);
            throw new Error('YouTube verisi alınamadı');
        }
    }

    async getTrends(query: string): Promise<YouTubeAnalysis> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    action: 'trends'
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'YouTube trends request failed');
            }

            return result.data;

        } catch (error) {
            console.error('YouTube trends error:', error);
            throw new Error('YouTube trend verisi alınamadı');
        }
    }
}

export const youtubeService = new YouTubeApiService();