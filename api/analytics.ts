import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { ValidationlyDB } from '../lib/supabase';

interface UserPayload {
    id: string;
    email: string;
    plan: 'free' | 'pro';
}

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
  const { method } = req;
  const action = req.query.action as string;

  try {
    if (method === 'GET' && action === 'usage') {
      // Get user usage analytics
      const auth = verifyAuth(req.headers.authorization as string);
      if (!auth.ok) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get real analytics data from Supabase
      const userStats = await ValidationlyDB.getUserStats(auth.user.id);
      const userValidations = await ValidationlyDB.getUserValidations(auth.user.id, 50);
      
      // Calculate monthly usage
      const monthlyUsage = userValidations.reduce((acc: any[], validation) => {
        const month = new Date(validation.created_at).toLocaleDateString('en-US', { month: 'short' });
        const existing = acc.find(item => item.month === month);
        if (existing) {
          existing.validations++;
        } else {
          acc.push({ month, validations: 1 });
        }
        return acc;
      }, []);

      // Get top ideas
      const topIdeas = userValidations
        .filter(v => v.demand_score && v.demand_score > 0)
        .sort((a, b) => (b.demand_score || 0) - (a.demand_score || 0))
        .slice(0, 5)
        .map(v => ({
          idea: v.idea_text.substring(0, 50) + (v.idea_text.length > 50 ? '...' : ''),
          score: v.demand_score,
          date: new Date(v.created_at).toISOString().split('T')[0]
        }));

      const analytics = {
          totalValidations: userStats.totalValidations,
          validationsThisMonth: userValidations.filter(v => 
            new Date(v.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length,
          averageScore: userStats.avgScore,
          topIdeas,
          monthlyUsage: monthlyUsage.slice(0, 12),
          favoriteCategory: userStats.favoriteCategory,
          creditsRemaining: userStats.creditsRemaining
      };

      return res.status(200).json(analytics);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}