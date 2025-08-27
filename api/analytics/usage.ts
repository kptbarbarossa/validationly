import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  plan: 'free' | 'pro';
}

// Mock analytics data (replace with real database queries)
const mockAnalytics = {
  userStats: {
    totalUsers: 1247,
    activeUsers: 342,
    proUsers: 89,
    freeUsers: 1158,
    dailyActiveUsers: 156,
    monthlyActiveUsers: 892
  },
  usageStats: {
    totalRewrites: 15420,
    dailyRewrites: 234,
    avgRewritesPerUser: 12.4,
    popularTones: [
      { tone: 'formal', count: 6234, percentage: 40.4 },
      { tone: 'impact', count: 4521, percentage: 29.3 },
      { tone: 'casual', count: 2890, percentage: 18.7 },
      { tone: 'executive', count: 1234, percentage: 8.0 },
      { tone: 'creative', count: 341, percentage: 2.2 },
      { tone: 'technical', count: 200, percentage: 1.3 }
    ],
    popularIndustries: [
      { industry: 'Technology', count: 4521, percentage: 29.3 },
      { industry: 'Healthcare', count: 2890, percentage: 18.7 },
      { industry: 'Finance', count: 2341, percentage: 15.2 },
      { industry: 'Marketing', count: 1876, percentage: 12.2 },
      { industry: 'Education', count: 1234, percentage: 8.0 },
      { industry: 'Other', count: 2558, percentage: 16.6 }
    ]
  },
  revenueStats: {
    mrr: 890.11, // Monthly Recurring Revenue
    arr: 10681.32, // Annual Recurring Revenue
    conversionRate: 7.14, // Free to Pro conversion rate
    churnRate: 2.3, // Monthly churn rate
    avgRevenuePerUser: 9.99,
    lifetimeValue: 89.91
  },
  performanceStats: {
    avgProcessingTime: 3.2, // seconds
    successRate: 98.7, // percentage
    errorRate: 1.3, // percentage
    uptime: 99.9 // percentage
  }
};

function verifyAuth(authorization: string | null) {
  if (!authorization?.startsWith('Bearer ')) {
    return { ok: false as const };
  }
  
  const token = authorization.split(' ')[1];
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-in-production';
  
  try {
    const user = jwt.verify(token, JWT_SECRET) as UserPayload;
    return { ok: true as const, user };
  } catch {
    return { ok: false as const };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const auth = verifyAuth(req.headers.authorization as string);
    if (!auth.ok) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { type = 'user', period = '30d' } = req.query;

    // Generate user-specific analytics
    if (type === 'user') {
      const userAnalytics = {
        totalRewrites: Math.floor(Math.random() * 50) + 5,
        dailyUsage: Math.floor(Math.random() * 5),
        favoriteIndustry: 'Technology',
        successRate: Math.floor(Math.random() * 30) + 70,
        planType: auth.user.plan,
        memberSince: '2024-01-15',
        recentActivity: [
          {
            date: '2024-01-20',
            action: 'CV Rewrite',
            details: 'Software Engineer at TechCorp',
            tone: 'formal'
          },
          {
            date: '2024-01-19',
            action: 'Job Search',
            details: 'Searched for "React Developer" jobs',
            tone: null
          },
          {
            date: '2024-01-18',
            action: 'CV Export',
            details: 'Exported PDF for Frontend Developer position',
            tone: 'impact'
          }
        ],
        industryBreakdown: [
          { industry: 'Technology', count: 12, percentage: 60 },
          { industry: 'Startups', count: 5, percentage: 25 },
          { industry: 'Finance', count: 3, percentage: 15 }
        ],
        toneUsage: [
          { tone: 'formal', count: 8, percentage: 40 },
          { tone: 'impact', count: 6, percentage: 30 },
          { tone: 'casual', count: 4, percentage: 20 },
          { tone: 'executive', count: 2, percentage: 10 }
        ]
      };

      return res.status(200).json({ analytics: userAnalytics });
    }

    // Admin analytics (only for pro users or admins)
    if (type === 'admin' && auth.user.plan === 'pro') {
      return res.status(200).json({ analytics: mockAnalytics });
    }

    // Platform-wide public stats
    const publicStats = {
      totalRewrites: mockAnalytics.usageStats.totalRewrites,
      activeUsers: mockAnalytics.userStats.activeUsers,
      popularTones: mockAnalytics.usageStats.popularTones.slice(0, 3),
      popularIndustries: mockAnalytics.usageStats.popularIndustries.slice(0, 3),
      successRate: mockAnalytics.performanceStats.successRate
    };

    res.status(200).json({ analytics: publicStats });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}