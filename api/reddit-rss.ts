import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    console.log('Reddit RSS API called');

    try {
        console.log('Starting Reddit data fetch...');

        // Fetch from multiple startup/entrepreneur related subreddits
        const subreddits = [
            'startups',
            'entrepreneur',
            'SideProject',
            'indiehackers',
            'business'
        ];

        const allPosts: RedditPost[] = [];
        let successfulFetches = 0;

        // Fetch from each subreddit with timeout
        for (const subreddit of subreddits) {
            try {
                console.log(`Fetching from r/${subreddit}...`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

                const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=3`, {
                    headers: {
                        'User-Agent': 'Validationly/1.0 (https://validationly.com)'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    console.log(`Failed to fetch r/${subreddit}: ${response.status}`);
                    continue;
                }

                const data = await response.json();
                const posts = data.data?.children || [];

                console.log(`Found ${posts.length} posts in r/${subreddit}`);

                posts.forEach((post: any) => {
                    const postData = post.data;
                    if (postData && !postData.stickied && !postData.pinned && postData.title) {
                        allPosts.push({
                            id: postData.id,
                            title: postData.title,
                            url: `https://reddit.com${postData.permalink}`,
                            author: postData.author || 'unknown',
                            subreddit: postData.subreddit,
                            created: postData.created_utc,
                            score: postData.score || 0,
                            num_comments: postData.num_comments || 0,
                            selftext: postData.selftext?.substring(0, 200) || '',
                            thumbnail: postData.thumbnail && postData.thumbnail !== 'self' && postData.thumbnail !== 'default' && postData.thumbnail !== 'nsfw' ? postData.thumbnail : undefined
                        });
                    }
                });

                successfulFetches++;

            } catch (error) {
                console.error(`Error fetching from r/${subreddit}:`, error);
                continue;
            }
        }

        console.log(`Successfully fetched from ${successfulFetches}/${subreddits.length} subreddits, total posts: ${allPosts.length}`);

        // Sort by score and created time, then take top 10
        const topPosts = allPosts
            .sort((a, b) => {
                // Prioritize recent posts with good engagement
                const scoreA = a.score + (a.num_comments * 2);
                const scoreB = b.score + (b.num_comments * 2);
                const timeA = Date.now() / 1000 - a.created;
                const timeB = Date.now() / 1000 - b.created;

                // Boost recent posts (less than 24 hours old)
                const recentBoostA = timeA < 86400 ? 50 : 0;
                const recentBoostB = timeB < 86400 ? 50 : 0;

                return (scoreB + recentBoostB) - (scoreA + recentBoostA);
            })
            .slice(0, 10);

        // Cache for 5 minutes
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

        return res.status(200).json({
            posts: topPosts,
            lastUpdated: new Date().toISOString(),
            totalFetched: allPosts.length
        });

    } catch (error) {
        console.error('Reddit RSS API error:', error);

        // Return fallback data instead of empty array
        const fallbackPosts: RedditPost[] = [
            {
                id: 'fallback1',
                title: 'How I validated my SaaS idea before building it',
                url: 'https://reddit.com/r/startups',
                author: 'entrepreneur_dev',
                subreddit: 'startups',
                created: Date.now() / 1000 - 3600,
                score: 156,
                num_comments: 23,
                selftext: 'Sharing my journey of validating a B2B SaaS idea using customer interviews and landing pages...'
            },
            {
                id: 'fallback2',
                title: 'Side project that hit $10k MRR - lessons learned',
                url: 'https://reddit.com/r/indiehackers',
                author: 'indie_maker',
                subreddit: 'indiehackers',
                created: Date.now() / 1000 - 7200,
                score: 234,
                num_comments: 45,
                selftext: 'After 8 months of building in public, my side project finally reached $10k monthly recurring revenue...'
            },
            {
                id: 'fallback3',
                title: 'Market research tools every startup founder should know',
                url: 'https://reddit.com/r/entrepreneur',
                author: 'startup_guru',
                subreddit: 'entrepreneur',
                created: Date.now() / 1000 - 10800,
                score: 89,
                num_comments: 17,
                selftext: 'Compiled a list of free and paid tools that helped me understand my target market better...'
            }
        ];

        return res.status(200).json({
            posts: fallbackPosts,
            lastUpdated: new Date().toISOString(),
            totalFetched: fallbackPosts.length,
            fallback: true
        });
    }
}