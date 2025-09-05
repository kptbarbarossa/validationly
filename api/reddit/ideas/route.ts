import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Reddit Pain Mining API endpoints

// GET /api/reddit/ideas - Get pain mining ideas
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const cluster = searchParams.get('cluster');
  const q = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let query = supabase
      .from('ideas_public')
      .select('*')
      .order('created_utc', { ascending: false })
      .limit(limit);

    if (cluster) {
      // Note: This would need to be implemented based on cluster filtering logic
      // For now, we'll filter by subreddit
      query = query.eq('subreddit', cluster);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching ideas:', error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    // Simple text search filter
    const filtered = q 
      ? data?.filter(d => 
          (d.title || '').toLowerCase().includes(q.toLowerCase()) ||
          (d.summary || '').toLowerCase().includes(q.toLowerCase())
        ) 
      : data;

    return NextResponse.json({ 
      ok: true, 
      items: filtered || [],
      total: filtered?.length || 0
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ 
      ok: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST /api/reddit/ingest - Trigger Reddit data ingestion
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { subreddit, query, limit = 50, time_filter = 'month' } = body;

    if (!subreddit) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Subreddit is required' 
      }, { status: 400 });
    }

    // For now, return a queued response
    // In production, this would trigger a background job
    const jobId = crypto.randomUUID();
    
    return NextResponse.json({ 
      ok: true, 
      queued: { 
        jobId,
        subreddit, 
        query, 
        limit, 
        time_filter 
      },
      message: 'Reddit ingestion queued successfully'
    });

  } catch (error: any) {
    console.error('Error queuing ingestion:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}
