'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, TrendingUp, Users, MessageSquare } from 'lucide-react';

interface PainPoint {
  pain: string;
  severity: number;
  who: string;
  quote?: string;
}

interface Idea {
  title: string;
  value_prop: string;
  features: string[];
  risks: string[];
  icp: string;
}

interface RedditIdea {
  id: string;
  document_id: string;
  title: string;
  subreddit: string;
  created_utc: string;
  reddit_score: number;
  num_comments: number;
  pain_points: PainPoint[];
  summary: string;
  ideas: Idea[];
  total_score: number;
}

interface IdeaCardsProps {
  q?: string;
  cluster?: string;
}

export default function RedditIdeaCards({ q = "", cluster = "" }: IdeaCardsProps) {
  const [items, setItems] = useState<RedditIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(q);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery) params.append('q', searchQuery);
        if (cluster) params.append('cluster', cluster);
        
        const url = `/api/reddit/ideas${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.ok) {
          setItems(data.items || []);
        } else {
          console.error('Error fetching ideas:', data.error);
        }
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [searchQuery, cluster]);

  const handleSearch = () => {
    // Trigger search when user types
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-400">Loading Reddit insights...</span>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-gray-300 mb-2">No Reddit insights found</h3>
        <p className="text-gray-400">
          {searchQuery ? 'Try adjusting your search terms' : 'Reddit pain mining data will appear here once available'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Reddit insights..."
            className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-400"
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Search
        </Button>
      </div>

      {/* Ideas Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="text-white line-clamp-2 text-lg">
                {item.title || 'Untitled'}
              </CardTitle>
              <div className="flex gap-2 items-center flex-wrap">
                {item.subreddit && (
                  <Badge variant="secondary" className="bg-blue-600/20 text-blue-400 border-blue-500/30">
                    r/{item.subreddit}
                  </Badge>
                )}
                <Badge variant="outline" className="border-gray-600 text-gray-400">
                  {new Date(item.created_utc).toLocaleDateString()}
                </Badge>
                {item.total_score && (
                  <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                    Score: {Math.round(item.total_score * 100)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <p className="text-gray-300 text-sm line-clamp-3">
                {item.summary || 'No summary available'}
              </p>

              {/* Engagement Stats */}
              <div className="flex gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{item.reddit_score || 0} upvotes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{item.num_comments || 0} comments</span>
                </div>
              </div>

              {/* Pain Points */}
              {item.pain_points && item.pain_points.length > 0 && (
                <div>
                  <div className="text-xs mb-2 font-medium text-gray-400">Pain Points</div>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {item.pain_points.slice(0, 3).map((pain: PainPoint, i: number) => (
                      <li key={i} className="text-gray-300 line-clamp-1">
                        {pain.pain} — <span className="text-orange-400">sev: {pain.severity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ideas */}
              {item.ideas && item.ideas.length > 0 && (
                <div>
                  <div className="text-xs mb-2 font-medium text-gray-400">Generated Ideas</div>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {item.ideas.slice(0, 2).map((idea: Idea, i: number) => (
                      <li key={i} className="text-gray-300 line-clamp-1">
                        <span className="font-medium">{idea.title}:</span> {idea.value_prop}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  View Details
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Generate Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {items.length >= 50 && (
        <div className="text-center">
          <Button 
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Load More Ideas
          </Button>
        </div>
      )}
    </div>
  );
}
