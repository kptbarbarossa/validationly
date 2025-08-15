import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface UserCredits {
  email: string;
  credits: number;
  plan: 'free' | 'starter' | 'pro' | 'business';
  lastReset: string; // Monthly reset for free users
  totalUsed: number;
  createdAt: string;
}

const PLANS = {
  free: { credits: 3, resetMonthly: true },
  starter: { credits: 20, resetMonthly: true },
  pro: { credits: 100, resetMonthly: true },
  business: { credits: 999999, resetMonthly: false }
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

async function getUserCredits(email: string): Promise<UserCredits | null> {
  try {
    const userData = await kv.get<UserCredits>(`user:${email}`);
    return userData;
  } catch {
    return null;
  }
}

async function createUser(email: string): Promise<UserCredits> {
  const user: UserCredits = {
    email,
    credits: PLANS.free.credits,
    plan: 'free',
    lastReset: getMonthKey(),
    totalUsed: 0,
    createdAt: new Date().toISOString()
  };
  
  await kv.set(`user:${email}`, user);
  return user;
}

async function resetMonthlyCredits(user: UserCredits): Promise<UserCredits> {
  const currentMonth = getMonthKey();
  if (user.lastReset !== currentMonth && PLANS[user.plan].resetMonthly) {
    user.credits = PLANS[user.plan].credits;
    user.lastReset = currentMonth;
    await kv.set(`user:${user.email}`, user);
  }
  return user;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // Get email from query params for GET, body for POST/PUT
    const email = req.method === 'GET' ? req.query.email as string : req.body?.email;
    const { action } = req.body || {};

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Valid email required' 
      });
    }

    // Get or create user
    let user = await getUserCredits(email);
    if (!user) {
      user = await createUser(email);
    }

    // Reset monthly credits if needed
    user = await resetMonthlyCredits(user);

    if (req.method === 'GET' || !action) {
      // Return current credits
      return res.status(200).json({
        ok: true,
        user: {
          email: user.email,
          credits: user.credits,
          plan: user.plan,
          totalUsed: user.totalUsed
        }
      });
    }

    if (req.method === 'POST' && action === 'use_credit') {
      // Use a credit for analysis
      if (user.credits <= 0) {
        return res.status(402).json({
          ok: false,
          message: 'No credits remaining',
          needsUpgrade: true,
          user: {
            email: user.email,
            credits: user.credits,
            plan: user.plan,
            totalUsed: user.totalUsed
          }
        });
      }

      // Deduct credit
      user.credits -= 1;
      user.totalUsed += 1;
      await kv.set(`user:${user.email}`, user);

      return res.status(200).json({
        ok: true,
        message: 'Credit used successfully',
        user: {
          email: user.email,
          credits: user.credits,
          plan: user.plan,
          totalUsed: user.totalUsed
        }
      });
    }

    if (req.method === 'PUT' && action === 'upgrade_plan') {
      // Upgrade user plan (called after successful payment)
      const { newPlan, stripeCustomerId } = req.body;
      
      if (!PLANS[newPlan as keyof typeof PLANS]) {
        return res.status(400).json({ 
          ok: false, 
          message: 'Invalid plan' 
        });
      }

      user.plan = newPlan;
      user.credits = PLANS[newPlan as keyof typeof PLANS].credits;
      user.lastReset = getMonthKey();
      
      // Store stripe customer ID for future reference
      await kv.set(`user:${user.email}`, { ...user, stripeCustomerId });

      return res.status(200).json({
        ok: true,
        message: 'Plan upgraded successfully',
        user: {
          email: user.email,
          credits: user.credits,
          plan: user.plan,
          totalUsed: user.totalUsed
        }
      });
    }

    return res.status(400).json({ 
      ok: false, 
      message: 'Invalid action' 
    });

  } catch (error) {
    console.error('User credits error:', error);
    return res.status(500).json({ 
      ok: false, 
      message: 'Server error' 
    });
  }
}
