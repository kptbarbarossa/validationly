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

    console.log('Raw validation request:', { idea, useAI });

    // Get AI instance
    const aiInstance = getAI(useAI);
    if (!aiInstance) {
      return res.status(500).json({ error: 'AI service not available' });
    }

    // Enhanced prompt for structured but natural analysis
    const prompt = `
Analyze this business idea: "${idea}"

Give me a comprehensive, natural analysis that covers these areas but write it conversationally and honestly:

**Market Potential:** What's the market size? Who are the potential customers? Is there real demand?

**Competition:** What's the competitive landscape? Who are the main players? How can you differentiate?

**Challenges:** What are the biggest obstacles? Location, marketing, operations, etc.

**Opportunities:** What unique angles can you exploit? Niche markets? Partnerships?

**Social Media Trends:** How should you approach social media? What content works?

**Actionable Steps:** Give 3-5 specific, actionable next steps.

Write this as if you're talking to a friend - be honest, specific, and helpful. Don't use corporate jargon. Be real about the challenges and opportunities.

Also, give me a 0-100 score for market demand and explain why.
`;

    let analysis;
    
    if (useAI === 'openai') {
      const openai = aiInstance as OpenAI;
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000
      });
      analysis = completion.choices[0]?.message?.content;
    } else if (useAI === 'groq') {
      const groq = aiInstance as Groq;
      const completion = await groq.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 3000
      });
      analysis = completion.choices[0]?.message?.content;
    } else {
      // Gemini
      const gemini = aiInstance as GoogleGenAI;
      const model = gemini.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { temperature: 0.7, maxOutputTokens: 3000 }
      });
      const result = await model;
      analysis = result.text;
    }

    console.log('Raw AI analysis:', analysis);

    // Extract score from analysis (look for patterns like "score: 75" or "75/100")
    const scoreMatch = analysis.match(/(?:score|demand|rating)[:\s]*(\d{1,3})(?:\/100)?/i);
    const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : 65; // Default fallback

    // Create structured result for the main system
    const result = {
      success: true,
      idea,
      demandScore: Math.min(100, Math.max(0, extractedScore)),
      scoreJustification: analysis,
      rawAnalysis: analysis,
      aiModel: useAI,
      timestamp: new Date().toISOString(),
      
      // Additional fields for compatibility
      marketIntelligence: {
        marketSize: 'Analyzed in raw analysis',
        growthRate: 'See raw analysis for details',
        targetAudience: 'Detailed in raw analysis'
      },
      competitiveLandscape: {
        competitors: 'See raw analysis for competitive analysis',
        differentiation: 'Detailed in raw analysis'
      },
      riskAssessment: {
        challenges: 'See raw analysis for challenges',
        mitigation: 'See raw analysis for actionable steps'
      },
      goToMarket: {
        strategy: 'See raw analysis for strategy',
        timeline: 'See raw analysis for next steps'
      }
    };

    res.status(200).json(result);

  } catch (error) {
    console.error('Raw validation error:', error);
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
