import React, { useState, useEffect } from 'react';

interface RedditPost {
  id: string;
  title: string;
  url: string;
  author: string;
  subreddit: string;
  created: number;
  score: number;
  num_comments: number;
  selftext?: string;
  thumbnail?: string;
}

interface RedditPostsResponse {
  posts: RedditPost[];
  lastUpdated: string;
  totalFetched: number;
  fallback?: boolean;
}

const RedditPosts: React.FC = () => {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isFallback, setIsFallback] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reddit-rss');
      
      if (!response.ok) {
        throw new Error('Failed to fetch Reddit posts');
      }

      const data: RedditPostsResponse = await response.json();
      setPosts(data.posts);
      setLastUpdated(data.lastUpdated);
      setIsFallback(data.fallback || false);
      setError(null);
    } catch (err) {
      console.error('Error fetching Reddit posts:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchPosts, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    
    if (diff < 3600) {
      return `${Math.floor(diff / 60)}m ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}h ago`;
    } else {
      return `${Math.floor(diff / 86400)}d ago`;
    }
  };

  const truncateTitle = (title: string, maxLength: number = 80) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="glass glass-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-bold text-slate-300">Latest from Reddit</h3>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-800 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="glass glass-border p-6 rounded-2xl">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-bold text-slate-300">Latest from Reddit</h3>
        </div>
        <div className="text-center text-slate-400">
          <p>Unable to load Reddit posts</p>
          <button 
            onClick={fetchPosts}
            className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass glass-border p-6 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <h3 className="text-lg font-bold text-slate-300">Latest from Reddit</h3>
        </div>
        <div className="flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin"></div>
          )}
          <button 
            onClick={fetchPosts}
            className="text-xs text-slate-400 hover:text-slate-300 transition-colors"
            title="Refresh posts"
          >
            🔄
          </button>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto glass-scroll">
        {posts.map((post) => (
          <div key={post.id} className="group">
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/10"
            >
              <div className="flex items-start gap-3">
                {post.thumbnail && (
                  <img 
                    src={post.thumbnail} 
                    alt=""
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                    {truncateTitle(post.title)}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded-full">
                      r/{post.subreddit}
                    </span>
                    <span>•</span>
                    <span>{formatTimeAgo(post.created)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      ⬆️ {post.score}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      💬 {post.num_comments}
                    </span>
                  </div>
                  {post.selftext && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {post.selftext}
                    </p>
                  )}
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {lastUpdated && (
        <div className="text-xs text-slate-500 text-center mt-4">
          Last updated: {new Date(lastUpdated).toLocaleTimeString()}
          {isFallback && (
            <span className="ml-2 text-amber-400">• Sample data</span>
          )}
        </div>
      )}
    </div>
  );
};

export default RedditPosts;