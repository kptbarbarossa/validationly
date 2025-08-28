import type { VercelRequest, VercelResponse } from '@vercel/node';

interface RedditPost {
    id: string;
    title: string;
    url: string;
    author: string;
    subreddit: string;
    created: number;
    score?: number;
    num_comments?: number;
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
        console.log('Starting Reddit RSS feed fetch...');

        // Reddit RSS feed URLs for startup/entrepreneur related subreddits
        const rssFeeds = [
            'https://www.reddit.com/r/startups/.rss',
            'https://www.reddit.com/r/entrepreneur/.rss',
            'https://www.reddit.com/r/SideProject/.rss',
            'https://www.reddit.com/r/indiehackers/.rss',
            'https://www.reddit.com/r/business/.rss'
        ];

        const allPosts: RedditPost[] = [];
        let successfulFetches = 0;

        // Fetch from each RSS feed with timeout
        for (const rssUrl of rssFeeds) {
            try {
                console.log(`Fetching from RSS feed: ${rssUrl}`);

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

                const response = await fetch(rssUrl, {
                    headers: {
                        'User-Agent': 'Validationly/1.0 (https://validationly.com)'
                    },
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    console.log(`Failed to fetch RSS feed: ${response.status}`);
                    continue;
                }

                const xmlText = await response.text();
                console.log(`Successfully fetched RSS feed, parsing XML...`);

                // Parse RSS XML
                const posts = parseRSSFeed(xmlText, rssUrl);
                console.log(`Parsed ${posts.length} posts from RSS feed`);

                allPosts.push(...posts);
                successfulFetches++;

            } catch (error) {
                console.error(`Error fetching RSS feed:`, error);
                continue;
            }
        }

        console.log(`Successfully fetched from ${successfulFetches}/${rssFeeds.length} RSS feeds, total posts: ${allPosts.length}`);

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

// RSS XML parsing function
function parseRSSFeed(xmlText: string, rssUrl: string): RedditPost[] {
    const posts: RedditPost[] = [];
    
    try {
        // Extract subreddit name from RSS URL
        const subredditMatch = rssUrl.match(/\/r\/([^\/]+)\//);
        const subreddit = subredditMatch ? subredditMatch[1] : 'unknown';
        
        // Parse RSS XML using regex (simple but effective)
        const itemMatches = xmlText.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];
        
        for (const itemXml of itemMatches) {
            try {
                const title = extractXMLContent(itemXml, 'title');
                const link = extractXMLContent(itemXml, 'link');
                const author = extractXMLContent(itemXml, 'author') || extractXMLContent(itemXml, 'dc:creator') || 'unknown';
                const pubDate = extractXMLContent(itemXml, 'pubDate');
                const description = extractXMLContent(itemXml, 'description');
                
                if (title && link) {
                    // Parse publication date
                    const created = pubDate ? new Date(pubDate).getTime() / 1000 : Date.now() / 1000;
                    
                    // Extract Reddit post ID from URL
                    const postIdMatch = link.match(/\/comments\/([a-zA-Z0-9]+)/);
                    const id = postIdMatch ? postIdMatch[1] : `rss-${Date.now()}-${Math.random()}`;
                    
                    posts.push({
                        id,
                        title: cleanText(title),
                        url: link,
                        author: cleanText(author),
                        subreddit,
                        created,
                        selftext: description ? cleanText(description).substring(0, 200) : '',
                        thumbnail: undefined
                    });
                }
            } catch (itemError) {
                console.error('Error parsing RSS item:', itemError);
                continue;
            }
        }
        
        console.log(`Parsed ${posts.length} posts from RSS feed for r/${subreddit}`);
        
    } catch (error) {
        console.error('Error parsing RSS feed:', error);
    }
    
    return posts;
}

// Helper function to extract XML content
function extractXMLContent(xml: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
    const match = xml.match(regex);
    return match ? match[1].trim() : '';
}

// Helper function to clean text content
function cleanText(text: string): string {
    return text
        .replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}