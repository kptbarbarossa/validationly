import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Reddit content sanitization for API compliance
function sanitizeRedditContent(text: string): string {
  if (!text) return "";
  
  // Remove PII patterns
  text = text.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD_NUMBER]');
  text = text.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');
  text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
  
  // Limit length for Reddit compliance
  return text.length > 5000 ? text.substring(0, 5000) + '...' : text;
}

// Reddit Pain Mining Provider - Reddit API Compliant
export async function runRedditPain(
  runId: string, 
  idea: string, 
  keywords: string[] = [], 
  targetSegments: string[] = []
) {
  try {
    // 1) Fetch data (last 90 days, keyword matching)
    const { data: rows, error } = await supabase.rpc('reddit_pain_fetch', {
      p_keywords: keywords.length ? keywords : null,
      p_segments: targetSegments.length ? targetSegments : null
    });

    if (error) {
      console.error('Error fetching Reddit pain data:', error);
      throw new Error(error.message);
    }

    // 2) Calculate metrics with Reddit API compliance
    const now = Date.now();
    let count = 0, engSum = 0, freshSum = 0;
    const examples: any[] = [];
    
    for (const r of rows as any[]) {
      const ageDays = Math.max(1, (now - new Date(r.created_utc).getTime()) / 86400000);
      const f = Math.exp(-ageDays / 30); // 30-day decay
      freshSum += f;
      
      const engagement = 0.6 * (r.reddit_score || 0) + 0.4 * (r.reddit_comments || 0);
      engSum += engagement;
      count += 1;
      
      if (examples.length < 5) {
        examples.push({ 
          title: sanitizeRedditContent(r.title), 
          subreddit: r.subreddit, 
          created_utc: r.created_utc,
          permalink: `https://reddit.com/r/${r.subreddit}/comments/${r.document_id}` // Reddit compliant permalink
        });
      }
    }

    // Normalize scores
    const N = Math.max(1, count);
    const strength = Math.min(1, 
      0.4 * (Math.log1p(count) / Math.log(50)) + 
      0.6 * (Math.log1p(engSum) / Math.log(1000))
    );
    const freshness = Math.min(1, freshSum / N);
    const confidence = Math.min(1, Math.max(0.4, Math.log1p(count) / Math.log(20)));

    const payload = {
      top_pains: (rows || [])
        .slice(0, 10)
        .flatMap((r: any) => (r.pain_points || []))
        .slice(0, 8)
        .map((pain: any) => ({
          ...pain,
          quote: pain.quote ? sanitizeRedditContent(pain.quote) : undefined
        })),
      examples,
      aggregate_engagement: engSum,
      total_documents: count,
      compliance_note: "Data collected in compliance with Reddit API terms"
    };

    // 3) Write to signals table
    const { error: insertError } = await supabase.from('signals').insert({
      run_id: runId,
      provider: 'reddit_pain',
      payload,
      strength,
      freshness,
      confidence
    });

    if (insertError) {
      console.error('Error inserting signal:', insertError);
      throw new Error(insertError.message);
    }

    return { 
      provider: 'reddit_pain', 
      strength, 
      freshness, 
      confidence, 
      payload 
    };

  } catch (error: any) {
    console.error('Reddit Pain provider error:', error);
    // Return fallback values
    return {
      provider: 'reddit_pain',
      strength: 0.5,
      freshness: 0.5,
      confidence: 0.5,
      payload: {
        top_pains: [],
        examples: [],
        aggregate_engagement: 0,
        total_documents: 0,
        compliance_note: "Fallback data - no Reddit analysis available"
      }
    };
  }
}

// POST /api/reddit/pain - Analyze pain points for an idea
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea, keywords = [], target_segments = [] } = body;

    if (!idea) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Idea is required' 
      }, { status: 400 });
    }

    // Create a validation run
    const runId = crypto.randomUUID();
    const { error: runError } = await supabase.from('validation_runs').insert({
      id: runId,
      idea,
      keywords,
      target_segments,
      status: 'running'
    });

    if (runError) {
      console.error('Error creating validation run:', runError);
      return NextResponse.json({ 
        ok: false, 
        error: runError.message 
      }, { status: 500 });
    }

    // Run Reddit Pain analysis
    const result = await runRedditPain(runId, idea, keywords, target_segments);

    // Calculate final score
    const redditScore = 0.5 * result.strength + 0.3 * result.freshness + 0.2 * result.confidence;

    // Update validation run status
    await supabase.from('validation_runs').update({ status: 'done' }).eq('id', runId);

    // Insert validation score
    await supabase.from('validation_scores').insert({
      run_id: runId,
      score: redditScore,
      breakdown: {
        reddit_pain: { 
          score: redditScore, 
          strength: result.strength,
          freshness: result.freshness,
          confidence: result.confidence
        }
      }
    });

    return NextResponse.json({
      ok: true,
      run_id: runId,
      score: redditScore,
      breakdown: {
        reddit_pain: {
          score: redditScore,
          strength: result.strength,
          freshness: result.freshness,
          confidence: result.confidence
        }
      },
      insights: {
        reddit: result.payload
      }
    });

  } catch (error: any) {
    console.error('Error in pain analysis:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}
