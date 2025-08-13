import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

interface FeedbackItem {
	message: string;
	contact?: string;
	score?: number;
	timestamp: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method === 'POST') {
		try {
			const { message, contact, score } = req.body || {};
			if (!message || typeof message !== 'string' || message.trim().length < 3) {
				return res.status(400).json({ ok: false, message: 'Invalid feedback' });
			}
			const item: FeedbackItem = {
				message: message.trim().slice(0, 1000),
				contact: typeof contact === 'string' ? contact.trim().slice(0, 200) : undefined,
				score: typeof score === 'number' ? Math.max(0, Math.min(10, Math.round(score))) : undefined,
				timestamp: new Date().toISOString(),
			};

			const webhook = process.env.FEEDBACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;
			if (webhook) {
				try {
					await fetch(webhook, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							type: 'validationly_feedback',
							text: item.message,
							contact: item.contact,
							score: item.score,
							timestamp: item.timestamp,
						}),
					});
				} catch (e) {
					// Non-blocking
				}
			}

            // Persist to Vercel KV (keep last 30)
            try {
                await kv.lpush('feedback_items', JSON.stringify(item));
                await kv.ltrim('feedback_items', 0, 29);
            } catch (e) {
                // If KV not configured, ignore silently
            }
			return res.status(200).json({ ok: true });
		} catch (e) {
			return res.status(500).json({ ok: false, message: 'Feedback error' });
		}
	}

    // GET: return latest 30 feedback from KV (fallback empty)
    if (req.method === 'GET') {
        try {
            const raw = await kv.lrange<string>('feedback_items', 0, 29);
            const items = Array.isArray(raw) ? raw.map(r => { try { return JSON.parse(r) as FeedbackItem; } catch { return null; } }).filter(Boolean) as FeedbackItem[] : [];
            return res.status(200).json({ ok: true, items });
        } catch {
            return res.status(200).json({ ok: true, items: [] as FeedbackItem[] });
        }
    }

	return res.status(405).json({ ok: false, message: 'Method not allowed' });
}


