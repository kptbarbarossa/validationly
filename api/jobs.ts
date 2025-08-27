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
        const user = jwt.verify(token, JWT_SECRET) as UserPayload;
        return { ok: true as const, user };
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

    return res.status(404).json({ error: 'Not found' });
  } catch (error) {
    console.error('Jobs API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}