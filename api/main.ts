import type { VercelRequest, VercelResponse } from '@vercel/node';

// Ana API endpoint - tüm işlemleri burada topla
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { action } = req.query;
  
  try {
    switch (action) {
      case 'validate':
        // validate.ts içeriğini buraya taşı
        return await handleValidation(req, res);
      
      case 'advanced':
        // advanced-validate.ts içeriğini buraya taşı
        return await handleAdvancedValidation(req, res);
      
      case 'public':
        // public-validation.ts içeriğini buraya taşı
        return await handlePublicValidation(req, res);
      
      case 'trends':
        // google-trends.ts içeriğini buraya taşı
        return await handleTrends(req, res);
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleValidation(req: VercelRequest, res: VercelResponse) {
  // validate.ts kodunu buraya kopyala
}

async function handleAdvancedValidation(req: VercelRequest, res: VercelResponse) {
  // advanced-validate.ts kodunu buraya kopyala
}

async function handlePublicValidation(req: VercelRequest, res: VercelResponse) {
  // public-validation.ts kodunu buraya kopyala
}

async function handleTrends(req: VercelRequest, res: VercelResponse) {
  // google-trends.ts kodunu buraya kopyala
}