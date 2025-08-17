import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface TrendAnalysis {
  trendName: string;
  startupIdeas: Array<{
    idea: string;
    description: string;
    marketPotential: number;
    implementationDifficulty: number;
    timeToMarket: string;
  }>;
  socialMomentum: {
    currentPhase: 'emerging' | 'growing' | 'peak' | 'declining';
    momentumScore: number;
    platforms: string[];
  };
  marketGap: {
    existingSolutions: string[];
    gapAnalysis: string;
    opportunityWindow: string;
  };
  recommendation: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { trend, language = 'tr' } = req.body;

    if (!trend || trend.trim().length < 3) {
      return res.status(400).json({ 
        error: language === 'tr' ? 'Geçerli bir trend girmelisiniz' : 'Please enter a valid trend' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    });

    const prompt = language === 'tr' ? `
    Sen bir trend analizi uzmanısın. Verilen trendi analiz et ve bu trendden çıkarılabilecek startup fikirlerini üret.

    TREND: "${trend}"

    GÖREVLER:
    1. Bu trendin mevcut durumunu analiz et (yeni mi, büyüyor mu, zirve mi, azalıyor mu?)
    2. Bu trendden 3-5 startup fikri üret
    3. Her fikir için pazar potansiyeli ve uygulama zorluğu değerlendir
    4. Mevcut çözümleri ve pazar boşluklarını analiz et
    5. Genel öneri ver

    ÇIKTI FORMATI (JSON):
    {
      "trendName": "trend adı",
      "startupIdeas": [
        {
          "idea": "startup fikri başlığı",
          "description": "detaylı açıklama",
          "marketPotential": 85, // 0-100 arası
          "implementationDifficulty": 60, // 0-100 arası
          "timeToMarket": "6-12 ay"
        }
      ],
      "socialMomentum": {
        "currentPhase": "growing", // emerging/growing/peak/declining
        "momentumScore": 75, // 0-100 arası
        "platforms": ["TikTok", "Instagram", "YouTube"]
      },
      "marketGap": {
        "existingSolutions": ["mevcut çözüm 1", "mevcut çözüm 2"],
        "gapAnalysis": "pazar boşluğu analizi",
        "opportunityWindow": "fırsat penceresi süresi"
      },
      "recommendation": "genel öneri ve strateji"
    }

    ÖNEMLI:
    - Sadece JSON formatında yanıt ver
    - Gerçekçi değerlendirmeler yap
    - Türkçe içerik üret
    - Startup fikirlerini yaratıcı ama uygulanabilir olacak şekilde üret
    ` : `
    You are a trend analysis expert. Analyze the given trend and generate startup ideas based on it.

    TREND: "${trend}"

    TASKS:
    1. Analyze the current state of this trend (emerging/growing/peak/declining?)
    2. Generate 3-5 startup ideas from this trend
    3. Evaluate market potential and implementation difficulty for each idea
    4. Analyze existing solutions and market gaps
    5. Provide general recommendation

    OUTPUT FORMAT (JSON):
    {
      "trendName": "trend name",
      "startupIdeas": [
        {
          "idea": "startup idea title",
          "description": "detailed description",
          "marketPotential": 85, // 0-100
          "implementationDifficulty": 60, // 0-100
          "timeToMarket": "6-12 months"
        }
      ],
      "socialMomentum": {
        "currentPhase": "growing", // emerging/growing/peak/declining
        "momentumScore": 75, // 0-100
        "platforms": ["TikTok", "Instagram", "YouTube"]
      },
      "marketGap": {
        "existingSolutions": ["existing solution 1", "existing solution 2"],
        "gapAnalysis": "market gap analysis",
        "opportunityWindow": "opportunity window duration"
      },
      "recommendation": "general recommendation and strategy"
    }

    IMPORTANT:
    - Respond only in JSON format
    - Make realistic evaluations
    - Generate creative but feasible startup ideas
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON'ı parse et
    let analysis: TrendAnalysis;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback response
      analysis = {
        trendName: trend,
        startupIdeas: [
          {
            idea: language === 'tr' ? `${trend} tabanlı platform` : `${trend}-based platform`,
            description: language === 'tr' ? 'Bu trend etrafında topluluk oluşturan platform' : 'Community platform around this trend',
            marketPotential: 70,
            implementationDifficulty: 50,
            timeToMarket: language === 'tr' ? '6-9 ay' : '6-9 months'
          }
        ],
        socialMomentum: {
          currentPhase: 'growing',
          momentumScore: 60,
          platforms: ['Social Media']
        },
        marketGap: {
          existingSolutions: [language === 'tr' ? 'Genel platformlar' : 'General platforms'],
          gapAnalysis: language === 'tr' ? 'Özel çözüm eksikliği' : 'Lack of specialized solutions',
          opportunityWindow: language === 'tr' ? '12-18 ay' : '12-18 months'
        },
        recommendation: language === 'tr' ? 'Hızlı hareket etmek önemli' : 'Quick action is important'
      };
    }

    res.status(200).json({ analysis });

  } catch (error) {
    console.error('Trend Hunter API error:', error);
    res.status(500).json({ 
      error: req.body.language === 'tr' ? 'Trend analizi sırasında hata oluştu' : 'Error during trend analysis' 
    });
  }
}
