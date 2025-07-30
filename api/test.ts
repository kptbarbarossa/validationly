// Simple test API to check if Vercel functions work
interface VercelRequest {
    method?: string;
    body: any;
    headers: { [key: string]: string | string[] | undefined };
}

interface VercelResponse {
    status(code: number): VercelResponse;
    json(data: any): void;
    setHeader(key: string, value: string): void;
    end(): void;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const response = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            method: req.method,
            hasApiKey: !!process.env.API_KEY,
            nodeEnv: process.env.NODE_ENV || 'unknown'
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error('Test API error:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
}