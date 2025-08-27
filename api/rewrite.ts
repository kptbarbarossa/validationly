import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
  plan: 'free' | 'pro';
}

interface Usage {
  userId: string;
  dateISO: string;
  count: number;
  tokensIn: number;
  tokensOut: number;
}

// Simple in-memory storage for MVP (replace with database in production)
const usage: Usage[] = [];

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

function checkQuota(userId: string, plan: 'free' | 'pro') {
  if (plan === 'pro') return true;
  
  const freeLimit = 3; // 3 free rewrites per day
  const today = new Date().toDateString();
  const todayCount = usage
    .filter(u => u.userId === userId && new Date(u.dateISO).toDateString() === today)
    .reduce((sum, u) => sum + u.count, 0);
  
  return todayCount < freeLimit;
}

function recordUsage(userId: string, tokensIn: number, tokensOut: number) {
  usage.push({
    userId,
    dateISO: new Date().toISOString(),
    count: 1,
    tokensIn,
    tokensOut
  });
}

function getToneGuidelines(tone: string): string {
  switch (tone) {
    case 'formal':
      return ' (professional, conservative language)';
    case 'casual':
      return ' (approachable, friendly language)';
    case 'impact':
      return ' (results-focused, achievement-heavy language)';
    case 'executive':
      return ' (leadership-focused, strategic language with C-suite appeal)';
    case 'creative':
      return ' (innovative, dynamic language showcasing creativity and originality)';
    case 'technical':
      return ' (precise, technical language emphasizing skills and methodologies)';
    default:
      return '';
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

    const { jobDesc, cvText, tone = 'formal' } = req.body;

    // Validate input
    if (!jobDesc || !cvText || jobDesc.length < 50 || cvText.length < 50) {
      return res.status(400).json({ 
        error: 'Both job description and CV text must be at least 50 characters long' 
      });
    }

    const validTones = ['formal', 'casual', 'impact', 'executive', 'creative', 'technical'];
    if (!validTones.includes(tone)) {
      return res.status(400).json({ error: 'Invalid tone' });
    }

    // Check if user is trying to use premium tones
    const premiumTones = ['executive', 'creative', 'technical'];
    if (premiumTones.includes(tone) && auth.user.plan !== 'pro') {
      return res.status(403).json({ error: 'Premium tone requires Pro plan' });
    }

    // Check quota
    if (!checkQuota(auth.user.id, auth.user.plan)) {
      return res.status(402).json({ 
        error: 'Daily quota exceeded. Upgrade to Pro for unlimited rewrites.' 
      });
    }

    // Prepare messages for AI
    const messages = [
      {
        role: 'system',
        content: `You are an expert resume editor and career consultant. Your task is to optimize a CV/resume for a specific job application while maintaining factual accuracy.

Guidelines:
- Keep all factual information accurate (dates, company names, achievements)
- Tailor the language and emphasis to match the job requirements
- Highlight relevant skills and experiences
- Use appropriate ${tone} tone${getToneGuidelines(tone)}
- Maintain the original structure but improve content
- Focus on quantifiable achievements where possible
- Use action verbs and industry-relevant keywords
- Output only the revised CV text, no explanations`
      },
      {
        role: 'user',
        content: `TONE: ${tone}

JOB DESCRIPTION:
${jobDesc}

CURRENT CV:
${cvText}

Please rewrite this CV to better match the job requirements while keeping all factual information accurate.`
      }
    ];

    // Call OpenAI API (you can also use Google Gemini or other AI services)
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return res.status(500).json({ error: 'AI service temporarily unavailable' });
    }

    const data = await response.json();
    const revised = (data as any).choices?.[0]?.message?.content || '';

    if (!revised) {
      return res.status(500).json({ error: 'Failed to generate revised CV' });
    }

    // Record usage (simple token estimation)
    const inTokens = Math.ceil((jobDesc.length + cvText.length) / 4);
    const outTokens = Math.ceil(revised.length / 4);
    recordUsage(auth.user.id, inTokens, outTokens);

    res.status(200).json({ revised });
  } catch (error) {
    console.error('CV rewrite error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}