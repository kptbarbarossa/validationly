import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';
import Groq from 'groq-sdk';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, useAI = 'gemini' } = req.body;

    if (!idea) {
      return res.status(400).json({ error: 'Idea is required' });
    }

    console.log('Simple analysis request:', { idea, useAI });

    // Get AI instance
    const aiInstance = getAI(useAI);
    if (!aiInstance) {
      return res.status(500).json({ error: 'AI service not available' });
    }

    // Simple prompt - no schema, just analyze
    const prompt = `
Analyze this business idea: "${idea}"

Give me your raw thoughts, insights, and analysis. Don't follow any specific format or schema. Just be honest and helpful.

Consider:
- Market potential
- Competition
- Challenges
- Opportunities
- Social media trends
- Any relevant data you know

Write in a natural, conversational way. Be specific and actionable.
`;

    let analysis;
    
    if (useAI === 'openai') {
      const openai = aiInstance as OpenAI;
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });
      analysis = completion.choices[0]?.message?.content;
    } else if (useAI === 'groq') {
      const groq = aiInstance as Groq;
      const completion = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000
      });
      analysis = completion.choices[0]?.message?.content;
    } else {
      // Gemini
      const gemini = aiInstance as GoogleGenAI;
      const model = gemini.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.7, maxOutputTokens: 2000 }
      });
      const result = await model;
      analysis = result.text;
    }

    console.log('Raw AI analysis:', analysis);

    // Return raw analysis without any processing
    res.status(200).json({
      success: true,
      idea,
      rawAnalysis: analysis,
      aiModel: useAI,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Simple analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

function getAI(useAI: string) {
  try {
    if (useAI === 'openai' && process.env.OPENAI_API_KEY) {
      return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    
    if (useAI === 'groq' && process.env.GROQ_API_KEY) {
      return new Groq({ apiKey: process.env.GROQ_API_KEY });
    }
    
    if (process.env.GOOGLE_API_KEY) {
      return new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
    }
    
    return null;
  } catch (error) {
    console.error('Error creating AI instance:', error);
    return null;
  }
}
