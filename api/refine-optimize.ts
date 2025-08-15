import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  try {
    const idea = (req.body?.idea || '').toString().slice(0, 2000);
    if (!idea) return res.status(400).json({ ok: false, message: 'idea required' });
    const looksTr = /[çğıöşüÇĞİÖŞÜ]/.test(idea);
    const lang = looksTr ? 'Turkish' : 'English';
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' });
    const system = `You are a startup validation mentor. Respond ONLY in ${lang}. Return JSON with keys: headline, subheadline, bullets[3], tests[3]{hypothesis,channel,metric}, copyTweaks[3], positioning, targetICP, risks[3], nextStep.
Rules: Be concrete, concise, no fluff. Avoid generic advice. Keep each string short.`;
    const r = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
      contents: `OPTIMIZE THIS IDEA FOR FASTER VALIDATION:\n\n${idea}\n\nReturn ONLY JSON.`,
      config: { systemInstruction: system, responseMimeType: 'application/json', temperature: 0.3, maxOutputTokens: 640 }
    });
    const text = (r.text || '').trim();
    return res.status(200).json({ ok: true, result: text });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'optimize error' });
  }
}


