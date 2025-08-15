import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

type RedditPost = {
  title: string;
  url: string;
  subreddit: string;
  score: number;
  selftext?: string;
};

function detectLang(text: string): 'Turkish' | 'English' {
  return /[çğıöşüÇĞİÖŞÜ]/.test(text) ? 'Turkish' : 'English';
}

async function fetchRedditPosts(query: string, limit = 10): Promise<RedditPost[]> {
  try {
    const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(query)}&sort=top&t=year&limit=${Math.max(5, Math.min(25, limit))}`;
    const resp = await fetch(url, { headers: { 'User-Agent': 'validationly/1.0' } as any });
    if (!resp.ok) return [];
    const json = await resp.json();
    const items = Array.isArray(json?.data?.children) ? json.data.children : [];
    return items.slice(0, limit).map((ch: any) => {
      const d = ch?.data || {};
      return {
        title: String(d.title || '').slice(0, 280),
        url: `https://www.reddit.com${d.permalink || ''}`,
        subreddit: String(d.subreddit || ''),
        score: Number(d.score || 0),
        selftext: String(d.selftext || '').slice(0, 2000)
      } as RedditPost;
    });
  } catch {
    return [];
  }
}

async function fetchXSearchText(query: string): Promise<string> {
  // Best-effort read-only extraction via Jina Reader to avoid login walls
  const attempt = async (u: string) => {
    try {
      const r = await fetch(u, { headers: { 'User-Agent': 'validationly/1.0' } as any });
      if (!r.ok) return '';
      return await r.text();
    } catch { return ''; }
  };
  const urls = [
    `https://r.jina.ai/http://x.com/search?q=${encodeURIComponent(query)}&src=typed_query&f=live`,
    `https://r.jina.ai/http://mobile.twitter.com/search?q=${encodeURIComponent(query)}&s=typd&src=typed_query`
  ];
  for (const u of urls) {
    const txt = await attempt(u);
    if (txt && txt.length > 200) return txt.slice(0, 20000);
  }
  return '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const idea = (req.body?.idea || req.body?.query || '').toString().slice(0, 300);
    if (!idea) return res.status(400).json({ ok: false, message: 'idea required' });
    const lang = detectLang(idea);

    // 1) Gather public data
    const [reddit, xText] = await Promise.all([
      fetchRedditPosts(idea, 10),
      fetchXSearchText(idea)
    ]);

    // 2) Build evidence text
    const redditLines = reddit.map(r => `- [r/${r.subreddit}] (${r.score}) ${r.title}\n  ${r.selftext ? r.selftext.slice(0, 200) : ''}\n  URL: ${r.url}`).join('\n');
    const xLines = xText ? xText.slice(0, 5000) : '';

    // 3) Ask LLM to extract pain points
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' });
    const system = `You are a social listening analyst. Respond ONLY in ${lang}. Return STRICT JSON with keys: painPoints (array of {issue, frequency, severity: 1-5, examples: [quote], evidence: [url]}), summary, confidence(0-100). Use ONLY the EVIDENCE below. If X evidence is weak, mark fewer evidence URLs and say 'insufficient evidence' in summary.`;
    const contents = `TOPIC: ${idea}\n\nEVIDENCE — REDDIT (posts)\n${redditLines || '(none)'}\n\nEVIDENCE — X (raw text)\n${xLines || '(none)'}\n\nReturn JSON only.`;
    const r = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
      contents,
      config: { systemInstruction: system, responseMimeType: 'application/json', temperature: 0.2, maxOutputTokens: 768 }
    });
    const text = (r.text || '').trim();

    return res.status(200).json({ ok: true, result: text, sources: { reddit, xUsed: Boolean(xText) } });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'find pain points error' });
  }
}


