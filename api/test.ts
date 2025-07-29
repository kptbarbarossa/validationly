export default async function handler(req: Request) {
    return new Response(JSON.stringify({ 
        message: 'API is working!',
        method: req.method,
        hasApiKey: !!process.env.API_KEY
    }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
    });
}