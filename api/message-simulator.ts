import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

function detectLang(text: string): 'Turkish' | 'English' {
  return /[çğıöşüÇĞİÖŞÜ]/.test(text) ? 'Turkish' : 'English';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const idea = (req.body?.idea || req.body?.content || '').toString().slice(0, 2000);
    const audience = (req.body?.audience || '').toString().slice(0, 120);
    const tone = (req.body?.tone || '').toString().slice(0, 60);
    if (!idea) return res.status(400).json({ ok: false, message: 'idea required' });
    const lang = detectLang(idea);

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' });
    const system = `You are a conversion copywriter and sales enablement coach. Respond ONLY in ${lang}. Return STRICT JSON with keys:
{
  "landingCopy": { "headline": string, "subheadline": string, "bullets": [string,string,string], "cta": string },
  "email": { "subject": string, "body": string },
  "demoScript": { "steps": [string,string,string,string] },
  "icpVariants": [ { "segment": string, "messageAdjustments": [string], "sampleHook": string } ]
}
Rules: be concrete and short; avoid hype; align language with ${lang}. If audience/tone provided, reflect them subtly. Keep all strings concise.`;

    const prompt = `PRODUCT IDEA: ${idea}
TARGET AUDIENCE (optional): ${audience || '(not provided)'}
TONE (optional): ${tone || '(not provided)'}

Return JSON only.`;

    const r = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: system,
        responseMimeType: 'application/json',
        temperature: 0.25,
        maxOutputTokens: 640,
      }
    });

    const text = (r.text || '').trim();
    return res.status(200).json({ ok: true, result: text });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'message simulator error' });
  }
}


