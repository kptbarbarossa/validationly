import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';

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
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded && 'id' in decoded && 'email' in decoded && 'plan' in decoded) {
            const user = decoded as UserPayload;
            return { ok: true as const, user };
        }
        return { ok: false as const };
    } catch {
        return { ok: false as const };
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;
  const action = req.query.action as string;

  try {
    if (method === 'POST' && action === 'create-checkout') {
      // Create Stripe checkout session
      const auth = verifyAuth(req.headers.authorization as string);
      if (!auth.ok || !auth.user) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2025-07-30.basil'
      });

      const priceId = process.env.STRIPE_PRICE_ID;
      if (!priceId) {
          return res.status(500).json({ error: 'Stripe price ID not configured' });
      }

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
              {
                  price: priceId,
                  quantity: 1,
              },
          ],
          mode: 'subscription',
          success_url: `${req.headers.origin}/dashboard?success=true`,
          cancel_url: `${req.headers.origin}/pricing?canceled=true`,
          customer_email: auth.user.email,
          metadata: {
              userId: auth.user.id,
          },
      });

      return res.status(200).json({ url: session.url });
    }
    
    if (method === 'POST' && action === 'webhook') {
      // Stripe webhook handler
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
          apiVersion: '2025-07-30.basil'
      });

      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

      let event;
      try {
          event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
          console.log('Webhook signature verification failed.', err);
          return res.status(400).send('Webhook signature verification failed.');
      }

      if (event.type === 'checkout.session.completed') {
          const session = event.data.object as any;
          // Update user plan in database
          console.log('Payment successful for user:', session.metadata?.userId);
      }

      if (event.type === 'customer.subscription.deleted') {
          const subscription = event.data.object as any;
          // Downgrade user plan in database
          console.log('Subscription cancelled for customer:', subscription.customer);
      }

      return res.status(200).json({ received: true });
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Billing API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}