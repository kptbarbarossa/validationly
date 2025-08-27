import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const auth = verifyAuth(req.headers.authorization as string);
    if (!auth.ok) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Stripe not configured' });
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });

    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${req.headers.origin}/job-tailor?success=true`,
      cancel_url: cancelUrl || `${req.headers.origin}/job-tailor?canceled=true`,
      customer_email: auth.user.email,
      metadata: {
        userId: auth.user.id,
        email: auth.user.email,
      },
      subscription_data: {
        metadata: {
          userId: auth.user.id,
          email: auth.user.email,
        },
      },
    });

    res.status(200).json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}