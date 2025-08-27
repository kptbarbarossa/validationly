import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;
  const action = req.query.action as string;

  try {
    if (method === 'POST' && action === 'issue-token') {
      // Issue JWT token for user
      const { email, userId } = req.body;
      
      if (!email || !userId) {
          return res.status(400).json({ error: 'Email and userId are required' });
      }

      const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-in-production';
      
      const token = jwt.sign(
          { 
              id: userId, 
              email, 
              plan: 'free' // Default plan
          },
          JWT_SECRET,
          { expiresIn: '7d' }
      );

      return res.status(200).json({ token });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Auth API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}