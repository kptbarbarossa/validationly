import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const id = (req.query?.id || '').toString();
  if (!id) return res.status(400).send('Missing id');
  try {
    const html = await kv.get<string>(`lp:${id}`);
    if (!html) return res.status(404).send('Not found');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);
  } catch {
    return res.status(500).send('Render error');
  }
}


