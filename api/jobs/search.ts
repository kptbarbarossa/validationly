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
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verify authentication
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
            let jobs = [];

            if (platform === 'indeed') {
                jobs = await scraper.searchIndeedJobs(query, location as string, searchLimit);
            } else if (platform === 'linkedin') {
                // LinkedIn search requires authentication - placeholder for now
                jobs = await scraper.searchLinkedInJobs(query, location as string, searchLimit);
            } else {
                return res.status(400).json({ error: 'Unsupported platform. Use "indeed" or "linkedin"' });
            }

            // Add extracted requirements and benefits
            jobs = jobs.map(job => ({
                ...job,
                requirements: JobScraper.extractRequirements(job.description),
                benefits: JobScraper.extractBenefits(job.description)
            }));

            res.status(200).json({
                jobs,
                total: jobs.length,
                platform,
                query,
                location: location || 'Any location'
            });
        } finally {
            await scraper.close();
        }
    } catch (error) {
        console.error('Job search error:', error);
        res.status(500).json({ error: 'Failed to search jobs' });
    }
}