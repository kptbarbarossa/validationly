import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  plan: 'free';
  trialStartDate: string;
  trialEndDate: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Generate unique user ID
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Calculate trial dates
    const trialStartDate = new Date();
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7); // 7 days trial

    // Create user payload
    const userPayload: UserPayload = {
      id: userId,
      email,
      plan: 'free',
      trialStartDate: trialStartDate.toISOString(),
      trialEndDate: trialEndDate.toISOString()
    };

    // Generate JWT token
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-in-production';
    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '7d' });

    // In a real app, you would save this to a database
    // For now, we'll just return the token with user info

    return res.status(200).json({
      token,
      user: {
        id: userId,
        email,
        plan: 'free',
        trialStartDate: trialStartDate.toISOString(),
        trialEndDate: trialEndDate.toISOString(),
        trialDaysLeft: 7
      }
    });

  } catch (error) {
    console.error('Start trial error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
