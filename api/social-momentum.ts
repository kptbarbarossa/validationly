import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SocialMomentumAnalysis {
  idea: string;
  momentumScore: number; // 0-100
  trendPhase: 'emerging' | 'growing' | 'peak' | 'declining' | 'stagnant';
  socialSignals: {
    searchVolume: {
      trend: 'increasing' | 'stable' | 'decreasing';
      score: number;
      keywords: string[];
    };
    socialMentions: {
      platforms: Array<{
        name: string;
        activity: 'high' | 'medium' | 'low';
        sentiment: 'positive' | 'neutral' | 'negative';
        score: number;
      }>;
      overallScore: number;
    };
    competitorGaps: {
      hasGaps: boolean;
      opportunities: string[];
      score: number;
    };
  };
  timingAnalysis: {
    isEarlyStage: boolean;
    marketReadiness: number; // 0-100
    recommendedAction: 'wait' | 'move_now' | 'too_late';
    timeWindow: string;
  };
  camilloFactors: {
    // Chris Camillo-inspired factors
    realWorldSignals: string[];
    earlyAdopterBehavior: string[];
    marketMomentum: number;
    arbitrageOpportunity: number; // 0-100
  };
  enhancedValidationScore: number; // Original + momentum boost/penalty
  recommendation: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, originalScore, language = 'tr' } = req.body;

    if (!idea || idea.trim().length < 3) {
      return res.status(400).json({ 
        error: language === 'tr' ? 'Geçerli bir fikir girmelisiniz' : 'Please enter a valid idea' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 1500,
      }
    });

    const prompt = language === 'tr' ? `
    Sen bir sosyal momentum analiz uzmanısın. Chris Camillo'nun "sosyal arbitraj" metodolojisinden ilham alarak, girilen startup fikrini analiz et.

    STARTUP FİKRİ: "${idea}"
    ${originalScore ? `MEVCUT VALİDASYON SKORU: ${originalScore}/100` : ''}

    GÖREVLER:
    1. Sosyal momentum skoru hesapla (0-100)
    2. Trend fazını belirle (emerging/growing/peak/declining/stagnant)
    3. Sosyal sinyalleri analiz et (arama hacmi, sosyal medya aktivitesi, rekabet boşlukları)
    4. Zamanlama analizi yap (erken aşama mı, pazar hazır mı?)
    5. Camillo faktörlerini değerlendir (gerçek dünya sinyalleri, erken kullanıcı davranışı)
    6. Geliştirilmiş validasyon skoru öner

    ÇIKTI FORMATI (JSON):
    {
      "idea": "startup fikri",
      "momentumScore": 75, // 0-100 arası
      "trendPhase": "growing", // emerging/growing/peak/declining/stagnant
      "socialSignals": {
        "searchVolume": {
          "trend": "increasing", // increasing/stable/decreasing
          "score": 80,
          "keywords": ["anahtar kelime 1", "anahtar kelime 2"]
        },
        "socialMentions": {
          "platforms": [
            {
              "name": "Twitter/X",
              "activity": "high", // high/medium/low
              "sentiment": "positive", // positive/neutral/negative
              "score": 85
            },
            {
              "name": "LinkedIn",
              "activity": "medium",
              "sentiment": "positive",
              "score": 70
            },
            {
              "name": "Reddit",
              "activity": "high",
              "sentiment": "neutral",
              "score": 75
            }
          ],
          "overallScore": 77
        },
        "competitorGaps": {
          "hasGaps": true,
          "opportunities": ["fırsat 1", "fırsat 2"],
          "score": 80
        }
      },
      "timingAnalysis": {
        "isEarlyStage": true,
        "marketReadiness": 75,
        "recommendedAction": "move_now", // wait/move_now/too_late
        "timeWindow": "6-12 ay içinde harekete geç"
      },
      "camilloFactors": {
        "realWorldSignals": ["gerçek dünya sinyali 1", "sinyal 2"],
        "earlyAdopterBehavior": ["erken kullanıcı davranışı 1", "davranış 2"],
        "marketMomentum": 80,
        "arbitrageOpportunity": 75
      },
      "enhancedValidationScore": 82, // orijinal skor + momentum etkisi
      "recommendation": "detaylı öneri ve strateji"
    }

    ÖNEMLI:
    - Sadece JSON formatında yanıt ver
    - Chris Camillo'nun "erken sinyal yakalama" metodolojisini uygula
    - Gerçekçi ve kanıta dayalı değerlendirmeler yap
    - Türkçe içerik üret
    - Momentum skorunu sosyal sinyaller ve zamanlama ile destekle
    ` : `
    You are a social momentum analysis expert. Analyze the given startup idea using Chris Camillo's "social arbitrage" methodology.

    STARTUP IDEA: "${idea}"
    ${originalScore ? `CURRENT VALIDATION SCORE: ${originalScore}/100` : ''}

    TASKS:
    1. Calculate social momentum score (0-100)
    2. Determine trend phase (emerging/growing/peak/declining/stagnant)
    3. Analyze social signals (search volume, social media activity, competitor gaps)
    4. Perform timing analysis (early stage?, market ready?)
    5. Evaluate Camillo factors (real-world signals, early adopter behavior)
    6. Suggest enhanced validation score

    OUTPUT FORMAT (JSON):
    {
      "idea": "startup idea",
      "momentumScore": 75, // 0-100
      "trendPhase": "growing", // emerging/growing/peak/declining/stagnant
      "socialSignals": {
        "searchVolume": {
          "trend": "increasing", // increasing/stable/decreasing
          "score": 80,
          "keywords": ["keyword 1", "keyword 2"]
        },
        "socialMentions": {
          "platforms": [
            {
              "name": "Twitter/X",
              "activity": "high", // high/medium/low
              "sentiment": "positive", // positive/neutral/negative
              "score": 85
            },
            {
              "name": "LinkedIn",
              "activity": "medium",
              "sentiment": "positive",
              "score": 70
            },
            {
              "name": "Reddit",
              "activity": "high",
              "sentiment": "neutral",
              "score": 75
            }
          ],
          "overallScore": 77
        },
        "competitorGaps": {
          "hasGaps": true,
          "opportunities": ["opportunity 1", "opportunity 2"],
          "score": 80
        }
      },
      "timingAnalysis": {
        "isEarlyStage": true,
        "marketReadiness": 75,
        "recommendedAction": "move_now", // wait/move_now/too_late
        "timeWindow": "move within 6-12 months"
      },
      "camilloFactors": {
        "realWorldSignals": ["real world signal 1", "signal 2"],
        "earlyAdopterBehavior": ["early adopter behavior 1", "behavior 2"],
        "marketMomentum": 80,
        "arbitrageOpportunity": 75
      },
      "enhancedValidationScore": 82, // original score + momentum effect
      "recommendation": "detailed recommendation and strategy"
    }

    IMPORTANT:
    - Respond only in JSON format
    - Apply Chris Camillo's "early signal detection" methodology
    - Make realistic, evidence-based evaluations
    - Support momentum score with social signals and timing
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON'ı parse et
    let analysis: SocialMomentumAnalysis;
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
        idea: idea,
        momentumScore: originalScore ? Math.min(100, originalScore + 10) : 60,
        trendPhase: 'growing',
        socialSignals: {
          searchVolume: {
            trend: 'increasing',
            score: 70,
            keywords: [language === 'tr' ? 'ana anahtar kelime' : 'main keyword']
          },
          socialMentions: {
            platforms: [
              { name: 'Twitter/X', activity: 'medium', sentiment: 'positive', score: 70 },
              { name: 'LinkedIn', activity: 'medium', sentiment: 'positive', score: 65 },
              { name: 'Reddit', activity: 'medium', sentiment: 'neutral', score: 60 }
            ],
            overallScore: 65
          },
          competitorGaps: {
            hasGaps: true,
            opportunities: [language === 'tr' ? 'Pazar boşluğu mevcut' : 'Market gap exists'],
            score: 70
          }
        },
        timingAnalysis: {
          isEarlyStage: true,
          marketReadiness: 70,
          recommendedAction: 'move_now',
          timeWindow: language === 'tr' ? '6-12 ay içinde harekete geç' : 'Move within 6-12 months'
        },
        camilloFactors: {
          realWorldSignals: [language === 'tr' ? 'Sosyal medya aktivitesi artışı' : 'Increasing social media activity'],
          earlyAdopterBehavior: [language === 'tr' ? 'Erken kullanıcı ilgisi' : 'Early user interest'],
          marketMomentum: 70,
          arbitrageOpportunity: 65
        },
        enhancedValidationScore: originalScore ? Math.min(100, originalScore + 10) : 70,
        recommendation: language === 'tr' ? 'Sosyal momentum olumlu, harekete geçmek için uygun zaman' : 'Social momentum is positive, good time to take action'
      };
    }

    res.status(200).json({ analysis });

  } catch (error) {
    console.error('Social Momentum API error:', error);
    res.status(500).json({ 
      error: req.body.language === 'tr' ? 'Momentum analizi sırasında hata oluştu' : 'Error during momentum analysis' 
    });
  }
}
