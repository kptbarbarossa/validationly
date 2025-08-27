import { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { JobScraper } from '../../lib/jobScraper';

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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const auth = verifyAuth(req.headers.authorization as string);
    if (!auth.ok) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Job URL is required' });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const scraper = new JobScraper();
    
    try {
      const jobPosting = await scraper.scrapeJobPosting(url);
      
      if (!jobPosting) {
        return res.status(404).json({ error: 'Could not extract job information from this URL' });
      }

      // Extract additional information
      jobPosting.requirements = JobScraper.extractRequirements(jobPosting.description);
      jobPosting.benefits = JobScraper.extractBenefits(jobPosting.description);

      // TODO: Save to database for caching
      // await Database.cacheJobPosting(jobPosting);

      res.status(200).json({ job: jobPosting });
    } finally {
      await scraper.close();
    }
  } catch (error) {
    console.error('Job scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape job posting' });
  }
}