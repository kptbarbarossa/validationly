import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface StartupIdea {
  title: string;
  description: string;
  targetMarket: string;
  revenueModel: string;
  marketSize: string;
  competitionLevel: 'low' | 'medium' | 'high';
  implementationDifficulty: number; // 1-10
  timeToMarket: string;
  keyFeatures: string[];
  potentialChallenges: string[];
  successProbability: number; // 0-100
}

interface TrendToStartupAnalysis {
  trendName: string;
  trendPhase: 'emerging' | 'growing' | 'peak' | 'declining';
  marketOpportunity: number; // 0-100
  startupIdeas: StartupIdea[];
  marketInsights: {
    totalMarketSize: string;
    growthRate: string;
    keyDrivers: string[];
    targetDemographics: string[];
  };
  recommendedApproach: string;
  timingAdvice: string;
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
        maxOutputTokens: 3000,
      }
    });

    const prompt = language === 'tr' ? `
    Sen bir startup fikri üretim uzmanısın. Verilen trendi analiz et ve bu trendden detaylı startup fikirleri üret.

    TREND: "${trend}"

    GÖREV: Bu trend için kapsamlı startup fırsatları analizi yap.

    ÇIKTI FORMATI (JSON):
    {
      "trendName": "trend adı",
      "trendPhase": "growing", // emerging/growing/peak/declining
      "marketOpportunity": 85, // 0-100 arası
      "startupIdeas": [
        {
          "title": "Startup fikri başlığı",
          "description": "Detaylı açıklama (2-3 cümle)",
          "targetMarket": "Hedef pazar açıklaması",
          "revenueModel": "Gelir modeli (SaaS, Marketplace, vb.)",
          "marketSize": "$500M pazar",
          "competitionLevel": "medium", // low/medium/high
          "implementationDifficulty": 6, // 1-10 arası
          "timeToMarket": "8-12 ay",
          "keyFeatures": [
            "Ana özellik 1",
            "Ana özellik 2",
            "Ana özellik 3",
            "Ana özellik 4"
          ],
          "potentialChallenges": [
            "Potansiyel zorluk 1",
            "Potansiyel zorluk 2"
          ],
          "successProbability": 75 // 0-100 arası
        }
      ],
      "marketInsights": {
        "totalMarketSize": "$2.5B küresel pazar",
        "growthRate": "%25 yıllık büyüme",
        "keyDrivers": [
          "Ana büyüme faktörü 1",
          "Ana büyüme faktörü 2",
          "Ana büyüme faktörü 3"
        ],
        "targetDemographics": [
          "Hedef demografik 1",
          "Hedef demografik 2",
          "Hedef demografik 3"
        ]
      },
      "recommendedApproach": "Bu trend için önerilen yaklaşım stratejisi",
      "timingAdvice": "Zamanlama ve giriş stratejisi önerisi"
    }

    ÖNEMLI:
    - 4-5 farklı startup fikri üret
    - Her fikir farklı açıdan trendi ele alsın
    - Gerçekçi pazar büyüklükleri ver
    - Sadece JSON formatında yanıt ver
    - Türkçe içerik üret
    - Startup fikirlerini uygulanabilir ve karlı olacak şekilde tasarla
    ` : `
    You are a startup idea generation expert. Analyze the given trend and generate detailed startup ideas from it.

    TREND: "${trend}"

    TASK: Perform comprehensive startup opportunity analysis for this trend.

    OUTPUT FORMAT (JSON):
    {
      "trendName": "trend name",
      "trendPhase": "growing", // emerging/growing/peak/declining
      "marketOpportunity": 85, // 0-100
      "startupIdeas": [
        {
          "title": "Startup idea title",
          "description": "Detailed description (2-3 sentences)",
          "targetMarket": "Target market description",
          "revenueModel": "Revenue model (SaaS, Marketplace, etc.)",
          "marketSize": "$500M market",
          "competitionLevel": "medium", // low/medium/high
          "implementationDifficulty": 6, // 1-10
          "timeToMarket": "8-12 months",
          "keyFeatures": [
            "Key feature 1",
            "Key feature 2",
            "Key feature 3",
            "Key feature 4"
          ],
          "potentialChallenges": [
            "Potential challenge 1",
            "Potential challenge 2"
          ],
          "successProbability": 75 // 0-100
        }
      ],
      "marketInsights": {
        "totalMarketSize": "$2.5B global market",
        "growthRate": "25% annual growth",
        "keyDrivers": [
          "Key growth driver 1",
          "Key growth driver 2",
          "Key growth driver 3"
        ],
        "targetDemographics": [
          "Target demographic 1",
          "Target demographic 2",
          "Target demographic 3"
        ]
      },
      "recommendedApproach": "Recommended approach strategy for this trend",
      "timingAdvice": "Timing and entry strategy recommendation"
    }

    IMPORTANT:
    - Generate 4-5 different startup ideas
    - Each idea should approach the trend from different angles
    - Provide realistic market sizes
    - Respond only in JSON format
    - Design startup ideas to be feasible and profitable
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON'ı parse et
    let analysis: TrendToStartupAnalysis;
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
        trendPhase: 'growing',
        marketOpportunity: 70,
        startupIdeas: [
          {
            title: language === 'tr' ? `${trend} Platformu` : `${trend} Platform`,
            description: language === 'tr' ? 
              `${trend} alanında kullanıcıları bir araya getiren kapsamlı platform çözümü.` :
              `Comprehensive platform solution bringing users together in the ${trend} space.`,
            targetMarket: language === 'tr' ? 'Erken benimseyen kullanıcılar' : 'Early adopters',
            revenueModel: language === 'tr' ? 'Freemium SaaS' : 'Freemium SaaS',
            marketSize: language === 'tr' ? '$500M pazar' : '$500M market',
            competitionLevel: 'medium',
            implementationDifficulty: 6,
            timeToMarket: language === 'tr' ? '8-12 ay' : '8-12 months',
            keyFeatures: [
              language === 'tr' ? 'Kullanıcı dostu arayüz' : 'User-friendly interface',
              language === 'tr' ? 'Mobil uygulama' : 'Mobile application',
              language === 'tr' ? 'Analitik dashboard' : 'Analytics dashboard',
              language === 'tr' ? 'Topluluk özellikleri' : 'Community features'
            ],
            potentialChallenges: [
              language === 'tr' ? 'Kullanıcı edinimi' : 'User acquisition',
              language === 'tr' ? 'Rekabet' : 'Competition'
            ],
            successProbability: 70
          }
        ],
        marketInsights: {
          totalMarketSize: language === 'tr' ? '$1B küresel pazar' : '$1B global market',
          growthRate: language === 'tr' ? '%20 yıllık büyüme' : '20% annual growth',
          keyDrivers: [
            language === 'tr' ? 'Teknoloji adaptasyonu' : 'Technology adoption',
            language === 'tr' ? 'Kullanıcı talebi artışı' : 'Increasing user demand',
            language === 'tr' ? 'Pazar olgunlaşması' : 'Market maturation'
          ],
          targetDemographics: [
            language === 'tr' ? '18-35 yaş arası teknoloji kullanıcıları' : '18-35 age tech users',
            language === 'tr' ? 'Erken benimseyen şirketler' : 'Early adopter companies',
            language === 'tr' ? 'Dijital native nesil' : 'Digital native generation'
          ]
        },
        recommendedApproach: language === 'tr' ? 
          'MVP ile başlayıp kullanıcı geri bildirimlerine göre geliştirme yapmak önerilir.' :
          'Start with MVP and develop based on user feedback.',
        timingAdvice: language === 'tr' ?
          'Trend büyüme aşamasında, şimdi giriş yapmak için uygun zaman.' :
          'Trend is in growth phase, now is good time to enter.'
      };
    }

    res.status(200).json({ analysis });

  } catch (error) {
    console.error('Trend-to-Startup API error:', error);
    res.status(500).json({ 
      error: req.body.language === 'tr' ? 'Startup fikri üretimi sırasında hata oluştu' : 'Error during startup idea generation' 
    });
  }
}
