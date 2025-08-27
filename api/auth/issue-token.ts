import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  plan: 'free' | 'pro';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email is required' });
    }

    // For MVP, we'll use a simple JWT secret. In production, use a proper secret management system
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-in-production';
    
    const userPayload: UserPayload = {
      id: email.toLowerCase(),
      email: email.toLowerCase(),
      plan: 'free'
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '30d' });

    res.status(200).json({ token });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}