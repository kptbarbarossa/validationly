import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { JobScraper, JobPosting } from '../lib/jobScraper';

interface UserPayload {
    id: string;
    email: string;
    plan: 'free' | 'pro';
}

function verifyAuth(authorization: string | null) {
    if (!authorization?.startsWith('Bearer ')) {
        return { ok: false as const };
    }

    const token = authorization.split(' ')[1];
    const JWT_SECRET = process.env.JWT_SECRET || 'dev-super-secret-change-in-production';

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (typeof decoded === 'object' && decoded && 'id' in decoded && 'email' in decoded && 'plan' in decoded) {
            const user = decoded as UserPayload;
            return { ok: true as const, user };
        }
        return { ok: false as const };
    } catch {
        return { ok: false as const };
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { method } = req;
  const action = req.query.action as string;

  try {
    if (method === 'GET' && action === 'search') {
      // Job search logic
      const auth = verifyAuth(req.headers.authorization as string);
      if (!auth.ok) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const { query, location = '', platform = 'indeed', limit = '10' } = req.query;

      if (!query || typeof query !== 'string') {
          return res.status(400).json({ error: 'Search query is required' });
      }

      const searchLimit = Math.min(parseInt(limit as string) || 10, auth.user.plan === 'pro' ? 50 : 10);
      const scraper = new JobScraper();

      try {
          let jobs: JobPosting[] = [];

          if (platform === 'indeed') {
              jobs = await scraper.searchIndeedJobs(query, location as string, searchLimit);
          } else if (platform === 'linkedin') {
              jobs = await scraper.searchLinkedInJobs(query, location as string, searchLimit);
          } else {
              return res.status(400).json({ error: 'Unsupported platform. Use "indeed" or "linkedin"' });
          }

          const enrichedJobs = jobs.map(job => ({
              ...job,
              requirements: JobScraper.extractRequirements(job.description || ''),
              benefits: JobScraper.extractBenefits(job.description || '')
          }));

          return res.status(200).json({
              jobs: enrichedJobs,
              total: enrichedJobs.length,
              platform,
              query,
              location: location || 'Any location'
          });
      } finally {
          await scraper.close();
      }
    }
    
    if (method === 'POST' && action === 'scrape') {
      // Job scraping logic
      const auth = verifyAuth(req.headers.authorization as string);
      if (!auth.ok) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const { url } = req.body;
      if (!url) {
          return res.status(400).json({ error: 'Job URL is required' });
      }

      const scraper = new JobScraper();
      try {
          const jobDetails = await scraper.scrapeJobDetails(url);
          return res.status(200).json(jobDetails);
      } finally {
          await scraper.close();
      }
    }

    // CV rewriting endpoints
    if (method === 'POST' && action === 'rewrite') {
      // Verify authentication
      const auth = verifyAuth(req.headers.authorization as string);
      if (!auth.ok) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const { jobDesc, cvText, tone = 'formal' } = req.body;

      if (!jobDesc || !cvText) {
          return res.status(400).json({ error: 'Job description and CV text are required' });
      }

      // Check quota for free users
      if (!checkQuota(auth.user.id, auth.user.plan, auth.user.trialStartDate)) {
          return res.status(429).json({ 
              error: 'Daily limit reached. Upgrade to Pro for unlimited rewrites.',
              limit: 'free'
          });
      }

      try {
          // Use Google Gemini AI for CV rewriting
          const genAI = new GoogleGenAI(process.env.GOOGLE_GENAI_API_KEY!);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

          const prompt = `Rewrite this CV to match the job description. Use a ${tone} tone${getToneGuidelines(tone)}.

Job Description:
${jobDesc}

Current CV:
${cvText}

Please rewrite the CV to:
1. Highlight relevant skills and experience
2. Use keywords from the job description
3. Match the tone and style requested
4. Keep it professional and concise
5. Focus on achievements and results

Rewritten CV:`;

          const result = await model.generateContent(prompt);
          const revised = result.response.text();

          // Record usage
          recordUsage(auth.user.id, prompt.length, revised.length);

          return res.status(200).json({ 
              revised,
              usage: {
                  remaining: auth.user.plan === 'pro' ? 'unlimited' : 'check quota',
                  plan: auth.user.plan
              }
          });

      } catch (error) {
          console.error('CV rewrite error:', error);
          return res.status(500).json({ 
              error: 'Failed to rewrite CV. Please try again.',
              details: error instanceof Error ? error.message : 'Unknown error'
          });
      }
    }

    if (method === 'POST' && action === 'optimize') {
      // CV optimization endpoint
      const auth = verifyAuth(req.headers.authorization as string);
      if (!auth.ok) {
          return res.status(401).json({ error: 'Unauthorized' });
      }

      const { cvText, optimizationType = 'general' } = req.body;

      if (!cvText) {
          return res.status(400).json({ error: 'CV text is required' });
      }

      try {
          const genAI = new GoogleGenAI(process.env.GOOGLE_GENAI_API_KEY!);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

          let prompt = '';
          switch (optimizationType) {
              case 'ats':
                  prompt = `Optimize this CV for ATS (Applicant Tracking System) by:
1. Adding relevant keywords
2. Improving formatting
3. Making it more scannable
4. Ensuring compatibility with ATS systems

CV: ${cvText}`;
                  break;
              case 'executive':
                  prompt = `Transform this CV into an executive-level format by:
1. Adding leadership language
2. Emphasizing strategic achievements
3. Highlighting C-suite relevant experience
4. Using executive terminology

CV: ${cvText}`;
                  break;
              default:
                  prompt = `Optimize this CV by:
1. Improving clarity and impact
2. Adding action verbs
3. Quantifying achievements
4. Enhancing professional language

CV: ${cvText}`;
          }

          const result = await model.generateContent(prompt);
          const optimized = result.response.text();

          return res.status(200).json({ 
              optimized,
              type: optimizationType
          });

      } catch (error) {
          console.error('CV optimization error:', error);
          return res.status(500).json({ 
              error: 'Failed to optimize CV. Please try again.',
              details: error instanceof Error ? error.message : 'Unknown error'
          });
      }
    }

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Jobs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}