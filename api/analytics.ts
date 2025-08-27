import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

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

      // Mock analytics data - replace with actual database queries
      const analytics = {
          totalValidations: 42,
          validationsThisMonth: 12,
          averageScore: 78,
          topIdeas: [
              { idea: 'AI-powered job matching', score: 85, date: '2024-01-15' },
              { idea: 'Remote work platform', score: 72, date: '2024-01-10' }
          ],
          monthlyUsage: [
              { month: 'Jan', validations: 12 },
              { month: 'Feb', validations: 8 },
              { month: 'Mar', validations: 15 }
          ]
      };

      return res.status(200).json(analytics);
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Analytics API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}