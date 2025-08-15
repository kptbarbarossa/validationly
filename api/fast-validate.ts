import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

function detectLang(text: string): 'Turkish' | 'English' {
  return /[çğıöşüÇĞİÖŞÜ]/.test(text) ? 'Turkish' : 'English';
}

function calculateScore(platforms: any, idea: string): number {
  const scores = Object.values(platforms || {}).map((p: any) => p?.score || 0);
  console.log('Platform scores:', scores);
  
  if (scores.length === 0) return 45;
  
  const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
  let finalScore = Math.round(avgScore * 20); // Convert 1-5 to 20-100 scale
  console.log('Average score:', avgScore, 'Final score before penalties:', finalScore);
  
  // Single platform penalty
  if (scores.length === 1) {
    const oldScore = finalScore;
    finalScore = Math.round(finalScore * 0.85);
    console.log('Single platform penalty applied:', oldScore, '->', finalScore);
  }
  
  // Clone detection and penalty - only for obvious clones
  const cloneKeywords = [
    'facebook clone', 'instagram clone', 'tiktok clone', 'twitter clone', 
    'linkedin clone', 'snapchat clone', 'discord clone', 'reddit clone',
    'facebook but for', 'instagram but for', 'tiktok but for', 'twitter but for',
    'like facebook but', 'like instagram but', 'like tiktok but', 'like twitter but'
  ];
  
  const isClone = cloneKeywords.some(keyword => idea.toLowerCase().includes(keyword.toLowerCase()));
  if (isClone) {
    console.log('Clone detected for idea:', idea, 'Score capped at 40');
    finalScore = Math.min(finalScore, 40);
  }
  
  const result = Math.max(0, Math.min(100, finalScore));
  console.log('Final calculated score:', result);
  return result;
}

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks
  text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '');
  // Remove any leading/trailing whitespace
  text = text.trim();
  return text;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' });

  try {
    const idea = (req.body?.idea || '').toString().slice(0, 2000);
    if (!idea) return res.status(400).json({ ok: false, message: 'idea required' });
    
    const lang = detectLang(idea);
    const langCode = lang === 'Turkish' ? 'tr' : 'en';

    // Simple cache key
    const cacheKey = crypto.createHash('sha1').update(idea + langCode).digest('hex').substring(0, 16);
    
    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '' 
    });

    const system = `You are Validationly, an expert market research analyst. Respond ONLY in ${lang}. Return STRICT JSON with this exact structure:
{
  "idea": string,
  "score": number,
  "justification": string,
  "platforms": {
    "twitter": { "summary": string, "findings": [string,string,string], "suggestion": string, "score": number },
    "reddit": { "summary": string, "findings": [string,string,string], "suggestion": string, "score": number },
    "linkedin": { "summary": string, "findings": [string,string,string], "suggestion": string, "score": number }
  },
  "posts": {
    "tweet": string,
    "redditTitle": string,
    "redditBody": string,
    "linkedin": string
  }
}

STRICT RULES:
- summary: concise market insight (no length limit)
- findings: provide as many relevant bullet points as you can find
- suggestion: actionable content advice (no length limit)
- score: integer 1-5 (platform potential)
- posts must be realistic and engaging
- redditBody must be multi-sentence paragraph
- linkedin must be professional
- Provide comprehensive analysis without artificial limits
- Use "X" instead of "Twitter" in content
- Be realistic with scores, avoid over-optimism`;

    const prompt = `ANALYZE: "${idea}"

Simulate scanning X (Twitter), Reddit, and LinkedIn for market demand signals. Provide realistic analysis based on your knowledge of these platforms and similar business ideas. Return JSON only.`;

    const startTime = Date.now();
    const result = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL_PRIMARY || 'gemini-1.5-flash',
      contents: prompt,
      config: {
        systemInstruction: system,
        responseMimeType: 'application/json',
        temperature: 0.2,
        maxOutputTokens: 1200,
      }
    });

    const responseTime = Date.now() - startTime;
    let text = (result.text || '').trim();
    text = cleanJsonResponse(text);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      // Single retry with repair prompt
      const repairResult = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: `Fix this JSON and return valid JSON only: ${text}`,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
          maxOutputTokens: 300,
        }
      });
      
      const repairedText = cleanJsonResponse(repairResult.text || '');
      parsed = JSON.parse(repairedText);
    }

    // Calculate and override score based on platform analysis
    const calculatedScore = calculateScore(parsed.platforms, idea);
    parsed.score = calculatedScore;

    // Ensure required fields
    if (!parsed.idea) parsed.idea = idea;
    if (!parsed.justification) parsed.justification = lang === 'Turkish' 
      ? 'Platform analizine dayalı talep değerlendirmesi' 
      : 'Demand assessment based on platform analysis';

    return res.status(200).json({
      ok: true,
      result: parsed,
      meta: {
        responseTime,
        cacheKey,
        lang: langCode
      }
    });

  } catch (error) {
    console.error('Fast validate error:', error);
    
    // Fallback response
    const lang = detectLang(req.body?.idea || '');
    const fallback = {
      idea: req.body?.idea || '',
      score: 45,
      justification: lang === 'Turkish' 
        ? 'Analiz tamamlanamadı, genel değerlendirme sunuldu'
        : 'Analysis incomplete, general assessment provided',
      platforms: {
        twitter: {
          summary: lang === 'Turkish' ? 'Analiz yapılamadı' : 'Analysis unavailable',
          findings: [
            lang === 'Turkish' ? 'Veri yetersiz' : 'Insufficient data',
            lang === 'Turkish' ? 'Tekrar deneyin' : 'Please retry',
            lang === 'Turkish' ? 'Genel değerlendirme' : 'General assessment'
          ],
          suggestion: lang === 'Turkish' ? 'Daha sonra tekrar deneyin' : 'Try again later',
          score: 3
        }
      },
      posts: {
        tweet: lang === 'Turkish' ? 'Analiz tamamlanamadı' : 'Analysis incomplete',
        redditTitle: lang === 'Turkish' ? 'Analiz Sorunu' : 'Analysis Issue',
        redditBody: lang === 'Turkish' 
          ? 'Maalesef analiz tamamlanamadı. Lütfen daha sonra tekrar deneyin.'
          : 'Unfortunately, the analysis could not be completed. Please try again later.',
        linkedin: lang === 'Turkish' 
          ? 'Analiz geçici olarak kullanılamıyor.'
          : 'Analysis temporarily unavailable.'
      }
    };

    return res.status(200).json({
      ok: true,
      result: fallback,
      meta: { fallback: true }
    });
  }
}
