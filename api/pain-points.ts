import { VercelRequest, VercelResponse } from '@vercel/node';

interface PainPoint {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  demandScore: number;
  difficultyLevel: 'Easy' | 'Medium' | 'Hard';
  evidence: Array<{
    source: string;
    url: string;
    snippet: string;
    upvotes?: number;
    comments?: number;
  }>;
  suggestedSolution: string;
  competitionLevel: 'Low' | 'Medium' | 'High';
  technicalComplexity: 'Low' | 'Medium' | 'High';
  estimatedMarketSize: string;
  tags: string[];
  createdAt: string;
  lastUpdated: string;
}

// Sample pain points database
const painPointsDB: PainPoint[] = [
  {
    id: '1',
    title: 'Freelancers struggle with client brief collection',
    description: 'Freelancers across all industries consistently report spending 20-40% of their project time just trying to extract proper requirements from clients. This leads to scope creep, missed deadlines, unhappy clients, and reduced profitability.',
    category: 'Freelancing',
    industry: 'Professional Services',
    demandScore: 85,
    difficultyLevel: 'Medium',
    evidence: [
      {
        source: 'Reddit r/freelance',
        url: 'https://reddit.com/r/freelance/example1',
        snippet: 'Getting briefs from clients is a nightmare. I spend more time trying to understand what they want than actually doing the work.',
        upvotes: 234,
        comments: 45
      },
      {
        source: 'IndieHackers',
        url: 'https://indiehackers.com/example2',
        snippet: 'Built a simple brief collection tool for my agency. Clients love it and we save 10+ hours per project.',
        upvotes: 89,
        comments: 23
      }
    ],
    suggestedSolution: 'Brief collection tool with templates + CRM integration',
    competitionLevel: 'Low',
    technicalComplexity: 'Medium',
    estimatedMarketSize: '$50M',
    tags: ['freelancing', 'client-management', 'forms', 'project-management'],
    createdAt: '2025-01-25',
    lastUpdated: '2025-01-25'
  },
  {
    id: '2',
    title: 'Small businesses need simple inventory tracking',
    description: 'Local shops and small businesses struggle with Excel-based inventory management. They need something simpler than enterprise solutions but more robust than spreadsheets.',
    category: 'SaaS',
    industry: 'Retail',
    demandScore: 78,
    difficultyLevel: 'Easy',
    evidence: [
      {
        source: 'G2 Reviews',
        url: 'https://g2.com/example',
        snippet: 'Current inventory software is too complex for our small shop. We just need basic tracking.',
        upvotes: 156,
        comments: 32
      }
    ],
    suggestedSolution: 'Simple inventory tracker with barcode scanning',
    competitionLevel: 'Medium',
    technicalComplexity: 'Low',
    estimatedMarketSize: '$120M',
    tags: ['inventory', 'small-business', 'retail', 'pos'],
    createdAt: '2025-01-24',
    lastUpdated: '2025-01-24'
  },
  {
    id: '3',
    title: 'Content creators need better analytics dashboard',
    description: 'YouTubers and content creators juggle multiple platforms but lack unified analytics. Current tools are too complex or expensive for individual creators.',
    category: 'Marketing',
    industry: 'Content Creation',
    demandScore: 92,
    difficultyLevel: 'Hard',
    evidence: [
      {
        source: 'IndieHackers',
        url: 'https://indiehackers.com/example',
        snippet: 'Managing analytics across YouTube, TikTok, Instagram is a nightmare. Need one dashboard.',
        upvotes: 445,
        comments: 78
      }
    ],
    suggestedSolution: 'Multi-platform content analytics dashboard',
    competitionLevel: 'High',
    technicalComplexity: 'High',
    estimatedMarketSize: '$200M',
    tags: ['analytics', 'content-creation', 'social-media', 'dashboard'],
    createdAt: '2025-01-23',
    lastUpdated: '2025-01-23'
  },
  {
    id: '4',
    title: 'Remote teams struggle with async standup meetings',
    description: 'Distributed teams across timezones find it difficult to coordinate daily standups. Traditional meeting times don\'t work for global teams.',
    category: 'Productivity',
    industry: 'Remote Work',
    demandScore: 73,
    difficultyLevel: 'Easy',
    evidence: [
      {
        source: 'Reddit r/remotework',
        url: 'https://reddit.com/r/remotework/example',
        snippet: 'Our team spans 12 timezones. Daily standups are impossible to schedule.',
        upvotes: 189,
        comments: 56
      }
    ],
    suggestedSolution: 'Async standup tool with video updates',
    competitionLevel: 'Medium',
    technicalComplexity: 'Medium',
    estimatedMarketSize: '$80M',
    tags: ['remote-work', 'async', 'standup', 'team-communication'],
    createdAt: '2025-01-22',
    lastUpdated: '2025-01-22'
  },
  {
    id: '5',
    title: 'Restaurants need better staff scheduling',
    description: 'Restaurant managers spend hours creating schedules manually. Staff availability changes frequently and current tools are too expensive or complex.',
    category: 'SaaS',
    industry: 'Food Service',
    demandScore: 81,
    difficultyLevel: 'Medium',
    evidence: [
      {
        source: 'Restaurant Manager Forum',
        url: 'https://example.com/forum',
        snippet: 'Scheduling is my biggest headache. Staff call in sick, want shift swaps, and I\'m constantly redoing the schedule.',
        upvotes: 267,
        comments: 89
      }
    ],
    suggestedSolution: 'Smart restaurant scheduling with shift swapping',
    competitionLevel: 'Medium',
    technicalComplexity: 'Medium',
    estimatedMarketSize: '$150M',
    tags: ['restaurant', 'scheduling', 'staff-management', 'hospitality'],
    createdAt: '2025-01-21',
    lastUpdated: '2025-01-21'
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { method, query } = req;

    if (method === 'GET') {
      const { 
        id, 
        category, 
        difficulty, 
        search, 
        limit = '10', 
        offset = '0' 
      } = query;

      // Get single pain point by ID
      if (id) {
        const painPoint = painPointsDB.find(p => p.id === id);
        if (!painPoint) {
          return res.status(404).json({ error: 'Pain point not found' });
        }
        return res.status(200).json(painPoint);
      }

      // Filter pain points
      let filteredPainPoints = [...painPointsDB];

      // Filter by category
      if (category && category !== 'All') {
        filteredPainPoints = filteredPainPoints.filter(p => 
          p.category.toLowerCase() === (category as string).toLowerCase()
        );
      }

      // Filter by difficulty
      if (difficulty && difficulty !== 'All') {
        filteredPainPoints = filteredPainPoints.filter(p => 
          p.difficultyLevel.toLowerCase() === (difficulty as string).toLowerCase()
        );
      }

      // Search filter
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredPainPoints = filteredPainPoints.filter(p => 
          p.title.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Sort by demand score (highest first)
      filteredPainPoints.sort((a, b) => b.demandScore - a.demandScore);

      // Pagination
      const limitNum = parseInt(limit as string);
      const offsetNum = parseInt(offset as string);
      const paginatedResults = filteredPainPoints.slice(offsetNum, offsetNum + limitNum);

      return res.status(200).json({
        painPoints: paginatedResults,
        total: filteredPainPoints.length,
        hasMore: offsetNum + limitNum < filteredPainPoints.length
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Pain points API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}