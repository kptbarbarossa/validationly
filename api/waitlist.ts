import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  try {
    const { lpId, email } = (req.body || {}) as { lpId?: string; email?: string };
    const id = (lpId || '').toString();
    const em = (email || '').toString().trim();
    if (!id || !em || !em.includes('@')) return res.status(400).json({ ok: false });
    const item = JSON.stringify({ lpId: id, email: em, ts: new Date().toISOString() });
    try {
      await kv.lpush(`wl:${id}`, item);
      await kv.ltrim(`wl:${id}`, 0, 999);
    } catch {}
    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
}


