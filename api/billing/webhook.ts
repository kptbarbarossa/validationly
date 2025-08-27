import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

// Simple in-memory user storage for MVP (replace with database in production)
const users: Record<string, { email: string; plan: 'free' | 'pro'; stripeCustomerId?: string }> = {};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
  });

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    const body = JSON.stringify(req.body);
    event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const email = session.metadata?.email;

        if (userId && email) {
          // Upgrade user to pro plan
          users[userId] = {
            email,
            plan: 'pro',
            stripeCustomerId: session.customer as string,
          };
          console.log(`User ${email} upgraded to Pro plan`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by customer ID
        const userId = Object.keys(users).find(id => users[id].stripeCustomerId === customerId);
        
        if (userId) {
          const isActive = subscription.status === 'active';
          users[userId].plan = isActive ? 'pro' : 'free';
          console.log(`User ${users[userId].email} subscription ${isActive ? 'activated' : 'deactivated'}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        // Find user by customer ID and downgrade to free
        const userId = Object.keys(users).find(id => users[id].stripeCustomerId === customerId);
        
        if (userId) {
          users[userId].plan = 'free';
          console.log(`User ${users[userId].email} downgraded to free plan`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
}

// Export users for other API endpoints to access
export { users };