import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { code, error } = req.query;

    if (error) {
        console.error('Reddit OAuth error:', error);
        return res.status(400).json({ message: 'OAuth error', error });
    }

    if (!code) {
        return res.status(400).json({ message: 'No authorization code provided' });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64')}`,
                'User-Agent': 'Validationly/1.0'
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code as string,
                redirect_uri: process.env.REDDIT_REDIRECT_URI || 'https://validationly.com/api/auth/reddit/callback'
            })
        });

        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error('Token exchange failed:', tokenData);
            return res.status(400).json({ message: 'Token exchange failed', error: tokenData });
        }

        // Store token temporarily (in production, use proper session management)
        // For now, redirect back with success
        return res.redirect('/?reddit_auth=success');

    } catch (error) {
        console.error('Reddit OAuth callback error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}