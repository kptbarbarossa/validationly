import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ message: 'Only POST requests allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { idea, industry, targetAudience } = await req.json();
    
    if (!idea || typeof idea !== 'string') {
      return new Response(JSON.stringify({ message: 'Idea is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const isTurkish = /[çğıöşüÇĞİÖŞÜ]/.test(idea + (industry || '') + (targetAudience || ''));
    const language = isTurkish ? 'Turkish' : 'English';

    const prompt = `You are an expert social media strategist for startup founders. Create a 5-tweet build-in-public series for this startup idea.

IDEA: "${idea}"
INDUSTRY: ${industry || 'Not specified'}
TARGET AUDIENCE: ${targetAudience || 'Not specified'}
LANGUAGE: ${language}

Create 5 tweets that follow a logical progression:
1. Announcement & Community Building
2. Problem-Solution Framework  
3. Social Proof & Market Validation
4. Progress Update & Traction
5. Conclusion & Call to Action

Each tweet should:
- Be engaging and authentic
- Include relevant hashtags
- Show the founder's journey
- Encourage community interaction
- Be optimized for engagement

Return ONLY valid JSON with this exact structure:
{
  "tweets": [
    {
      "id": 1,
      "tweet": "tweet content with line breaks using \\n",
      "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
      "engagement": 89,
      "purpose": "Brief description of tweet purpose"
    }
  ]
}

Rules:
- Use \\n for line breaks
- Keep tweets under 280 characters
- Make hashtags relevant and searchable
- Engagement numbers should be realistic (50-500 range)
- Purpose should be clear and actionable
- ${isTurkish ? 'Write in Turkish if the idea is in Turkish, otherwise in English' : 'Write in English'}`;

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: prompt,
      config: {
        maxOutputTokens: 2000,
        temperature: 0.8,
      }
    });

    const jsonText = result.text.trim();
    
    // Try to parse the JSON response
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Raw AI response:', jsonText);
      
      // Fallback: generate structured tweets manually
      const fallbackTweets = [
        {
          id: 1,
          tweet: `🚀 Just had a breakthrough idea: "${idea}"\n\nAfter months of research, I'm convinced this could solve a real problem. Starting to build in public today!\n\nWhat do you think? Any founders facing this challenge?`,
          hashtags: ['#startup', '#buildinpublic', '#founder'],
          engagement: 89,
          purpose: 'Announcement & Community Building'
        },
        {
          id: 2,
          tweet: `💡 Day 1 of building "${idea}":\n\n- Problem: Users struggle with [specific issue]\n- Solution: [Your approach]\n- Why now: Market timing is perfect\n\nAlready got 3 people asking for early access!`,
          hashtags: ['#day1', '#startupjourney', '#validation'],
          engagement: 156,
          purpose: 'Problem-Solution Framework'
        },
        {
          id: 3,
          tweet: `🔥 The moment I realized "${idea}" was worth pursuing:\n\n- Customer interview #7: "I'd pay $50/month for this"\n- Market size: $2B+ opportunity\n- Competition: Surprisingly fragmented\n\nSometimes the best ideas are hiding in plain sight.`,
          hashtags: ['#customervalidation', '#marketresearch', '#opportunity'],
          engagement: 234,
          purpose: 'Social Proof & Market Validation'
        },
        {
          id: 4,
          tweet: `⚡ Quick update on "${idea}":\n\nBuilt a simple landing page in 2 hours\n- 47 email signups in 24h\n- 3 people offered to beta test\n- 1 investor asked for a pitch deck\n\nBuild in public works! 🎯`,
          hashtags: ['#progress', '#traction', '#buildinpublic'],
          engagement: 312,
          purpose: 'Progress Update & Traction'
        },
        {
          id: 5,
          tweet: `🎯 Final thoughts on "${idea}":\n\n- Validated with 15+ potential customers\n- MVP ready in 2 weeks\n- Clear path to $10K MRR\n\nReady to go all-in. Sometimes you just know.\n\nThanks for following the journey! 🙏`,
          hashtags: ['#mvp', '#validation', '#founderjourney'],
          engagement: 189,
          purpose: 'Conclusion & Call to Action'
        }
      ];
      
      return new Response(JSON.stringify({ tweets: fallbackTweets }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate the structure
    if (!parsedResult.tweets || !Array.isArray(parsedResult.tweets)) {
      throw new Error('Invalid response structure from AI');
    }

    return new Response(JSON.stringify(parsedResult), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Error in tweet generation:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    return new Response(JSON.stringify({ 
      message: `Failed to generate tweets: ${errorMessage}`,
      error: errorMessage 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
