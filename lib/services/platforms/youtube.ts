interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  publishedAt: string;
  channelTitle: string;
  tags?: string[];
}

interface YouTubeSearchResult {
  videos: YouTubeVideo[];
  totalResults: number;
  nextPageToken?: string;
}

export class YouTubeService {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeSearchResult> {
    try {
      console.log('🔍 YouTube search starting:', { query, maxResults });
      
      // İlk olarak video ID'lerini al
      const searchUrl = `${this.baseUrl}/search?` +
        `part=snippet&` +
        `q=${encodeURIComponent(query)}&` +
        `type=video&` +
        `maxResults=${maxResults}&` +
        `order=relevance&` +
        `key=${this.apiKey}`;
      
      console.log('📡 YouTube API URL:', searchUrl.replace(this.apiKey, 'API_KEY_HIDDEN'));
      
      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        throw new Error(`YouTube Search API error: ${searchResponse.status}`);
      }

      const searchData: any = await searchResponse.json();
      console.log('📊 YouTube search response:', { 
        itemsCount: searchData.items?.length || 0, 
        totalResults: searchData.pageInfo?.totalResults || 0 
      });
      
      if (!searchData.items || searchData.items.length === 0) {
        console.log('⚠️ No YouTube videos found');
        return { videos: [], totalResults: 0 };
      }

      // Video ID'lerini topla
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

      // Video detaylarını al (statistics için)
      const videosResponse = await fetch(
        `${this.baseUrl}/videos?` +
        `part=snippet,statistics&` +
        `id=${videoIds}&` +
        `key=${this.apiKey}`
      );

      if (!videosResponse.ok) {
        throw new Error(`YouTube Videos API error: ${videosResponse.status}`);
      }

      const videosData: any = await videosResponse.json();

      const videos: YouTubeVideo[] = videosData.items.map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        viewCount: item.statistics.viewCount || '0',
        likeCount: item.statistics.likeCount || '0',
        commentCount: item.statistics.commentCount || '0',
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        tags: item.snippet.tags || []
      }));

      return {
        videos,
        totalResults: searchData.pageInfo.totalResults,
        nextPageToken: searchData.nextPageToken
      };

    } catch (error) {
      console.error('YouTube API error:', error);
      throw error;
    }
  }

  async getChannelVideos(channelId: string, maxResults: number = 10): Promise<YouTubeSearchResult> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?` +
        `part=snippet&` +
        `channelId=${channelId}&` +
        `type=video&` +
        `maxResults=${maxResults}&` +
        `order=date&` +
        `key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube Channel API error: ${response.status}`);
      }

      const data: any = await response.json();
      
      const videos: YouTubeVideo[] = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        viewCount: '0', // Channel search doesn't include statistics
        likeCount: '0',
        commentCount: '0',
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        tags: []
      }));

      return {
        videos,
        totalResults: data.pageInfo.totalResults,
        nextPageToken: data.nextPageToken
      };

    } catch (error) {
      console.error('YouTube Channel API error:', error);
      throw error;
    }
  }

  // Video trend analizi için
  async analyzeTrends(query: string): Promise<{
    totalViews: number;
    averageViews: number;
    totalVideos: number;
    recentActivity: boolean;
    topChannels: string[];
  }> {
    const result = await this.searchVideos(query, 50);
    
    const totalViews = result.videos.reduce((sum, video) => 
      sum + parseInt(video.viewCount), 0
    );
    
    const averageViews = result.videos.length > 0 ? totalViews / result.videos.length : 0;
    
    // Son 30 gün içinde yayınlanan video var mı?
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = result.videos.some(video => 
      new Date(video.publishedAt) > thirtyDaysAgo
    );

    // En popüler kanalları bul
    const channelCounts = result.videos.reduce((acc, video) => {
      acc[video.channelTitle] = (acc[video.channelTitle] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topChannels = Object.entries(channelCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([channel]) => channel);

    return {
      totalViews,
      averageViews: Math.round(averageViews),
      totalVideos: result.videos.length,
      recentActivity,
      topChannels
    };
  }
}