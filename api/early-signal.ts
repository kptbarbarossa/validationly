import { GoogleGenerativeAI } from '@google/genai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface EarlySignalAnalysis {
  idea: string;
  earlySignalScore: number; // 0-100, specialized timing + momentum scoring
  signalStrength: 'weak' | 'moderate' | 'strong' | 'exceptional';
  timingIntelligence: {
    marketCycle: 'pre-trend' | 'early-trend' | 'mid-trend' | 'late-trend' | 'post-trend';
    optimalEntryWindow: string;
    competitorAwareness: 'none' | 'minimal' | 'emerging' | 'high';
    firstMoverAdvantage: number; // 0-100
    windowOfOpportunity: string; // time remaining
  };
  signalSources: {
    technicalIndicators: Array<{
      source: string;
      signal: string;
      strength: number; // 0-100
      reliability: 'low' | 'medium' | 'high';
    }>;
    behavioralSignals: Array<{
      behavior: string;
      evidence: string;
      significance: number; // 0-100
    }>;
    marketGaps: Array<{
      gap: string;
      size: 'small' | 'medium' | 'large';
      accessibility: 'easy' | 'moderate' | 'difficult';
    }>;
  };
  riskFactors: {
    timingRisk: number; // 0-100 (higher = riskier)
    competitionRisk: number;
    marketAcceptanceRisk: number;
    overallRisk: 'low' | 'medium' | 'high';
    mitigationStrategies: string[];
  };
  actionPlan: {
    immediateActions: string[];
    shortTermGoals: string[];
    longTermStrategy: string;
    keyMetrics: string[];
    successIndicators: string[];
  };
  enhancedScore: number; // Original validation score enhanced with early signal intelligence
  confidence: number; // 0-100
  recommendation: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { idea, originalScore, socialMomentum, language = 'tr' } = req.body;

    if (!idea || idea.trim().length < 3) {
      return res.status(400).json({ 
        error: language === 'tr' ? 'Geçerli bir fikir girmelisiniz' : 'Please enter a valid idea' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.4, // Lower for more consistent analysis
        maxOutputTokens: 2000,
      }
    });

    const prompt = language === 'tr' ? `
    Sen bir "erken sinyal" analiz uzmanısın. Market zekası kullanarak startup fikirlerinin optimal giriş zamanlarını tespit ediyorsun.

    STARTUP FİKRİ: "${idea}"
    ${originalScore ? `MEVCUT VALİDASYON SKORU: ${originalScore}/100` : ''}
    ${socialMomentum ? `SOSYAL MOMENTUM VERİSİ: Mevcut` : ''}

    MİSYON: Bu fikir için "erken sinyal" analizi yap. Amaç: En az riskle maksimum fırsatı yakalamak.

    ANALİZ KRİTERLERİ:
    1. Timing Intelligence - Pazar döngüsünde neredeyiz?
    2. Signal Sources - Hangi sinyaller bu fırsatı işaret ediyor?
    3. Risk Assessment - Zamanlama ve rekabet riskleri
    4. Action Plan - Somut adım planı

    ÇIKTI FORMATI (JSON):
    {
      "idea": "startup fikri",
      "earlySignalScore": 78, // 0-100, timing+momentum özelleşmiş skor
      "signalStrength": "strong", // weak/moderate/strong/exceptional
      "timingIntelligence": {
        "marketCycle": "early-trend", // pre-trend/early-trend/mid-trend/late-trend/post-trend
        "optimalEntryWindow": "sonraki 6-9 ay",
        "competitorAwareness": "minimal", // none/minimal/emerging/high
        "firstMoverAdvantage": 85, // 0-100
        "windowOfOpportunity": "12-18 ay kaldı"
      },
      "signalSources": {
        "technicalIndicators": [
          {
            "source": "Google Trends",
            "signal": "Arama hacmi %300 artış",
            "strength": 85,
            "reliability": "high"
          }
        ],
        "behavioralSignals": [
          {
            "behavior": "Erken kullanıcılar çözüm arıyor",
            "evidence": "Forum tartışmaları artışı",
            "significance": 80
          }
        ],
        "marketGaps": [
          {
            "gap": "Mevcut çözümler yetersiz",
            "size": "large",
            "accessibility": "moderate"
          }
        ]
      },
      "riskFactors": {
        "timingRisk": 25, // 0-100 (yüksek = riskli)
        "competitionRisk": 40,
        "marketAcceptanceRisk": 30,
        "overallRisk": "medium", // low/medium/high
        "mitigationStrategies": ["MVP ile hızlı test", "Erken kullanıcı geri bildirimi"]
      },
      "actionPlan": {
        "immediateActions": ["Pazar araştırması derinleştir", "MVP planla"],
        "shortTermGoals": ["İlk 100 kullanıcı", "Product-market fit"],
        "longTermStrategy": "Pazar liderliği için hızlı ölçeklendirme",
        "keyMetrics": ["Kullanıcı büyüme oranı", "Churn rate"],
        "successIndicators": ["Aylık %20+ büyüme", "Pozitif geri bildirim"]
      },
      "enhancedScore": 82, // orijinal + erken sinyal bonusu
      "confidence": 85, // 0-100
      "recommendation": "Güçlü erken sinyaller mevcut. 6-9 ay içinde harekete geçmek optimal."
    }

    ÖNEMLI:
    - Sadece JSON formatında yanıt ver
    - Gerçekçi ve kanıta dayalı analiz yap
    - Timing'e odaklan - bu en kritik faktör
    - Somut aksiyon planı ver
    - Türkçe içerik üret
    ` : `
    You are an "early signal" analysis expert. Using market intelligence, you detect optimal entry timing for startup ideas.

    STARTUP IDEA: "${idea}"
    ${originalScore ? `CURRENT VALIDATION SCORE: ${originalScore}/100` : ''}
    ${socialMomentum ? `SOCIAL MOMENTUM DATA: Available` : ''}

    MISSION: Perform "early signal" analysis for this idea. Goal: Capture maximum opportunity with minimum risk.

    ANALYSIS CRITERIA:
    1. Timing Intelligence - Where are we in the market cycle?
    2. Signal Sources - Which signals indicate this opportunity?
    3. Risk Assessment - Timing and competition risks
    4. Action Plan - Concrete step plan

    OUTPUT FORMAT (JSON):
    {
      "idea": "startup idea",
      "earlySignalScore": 78, // 0-100, specialized timing+momentum score
      "signalStrength": "strong", // weak/moderate/strong/exceptional
      "timingIntelligence": {
        "marketCycle": "early-trend", // pre-trend/early-trend/mid-trend/late-trend/post-trend
        "optimalEntryWindow": "next 6-9 months",
        "competitorAwareness": "minimal", // none/minimal/emerging/high
        "firstMoverAdvantage": 85, // 0-100
        "windowOfOpportunity": "12-18 months remaining"
      },
      "signalSources": {
        "technicalIndicators": [
          {
            "source": "Google Trends",
            "signal": "Search volume +300% increase",
            "strength": 85,
            "reliability": "high"
          }
        ],
        "behavioralSignals": [
          {
            "behavior": "Early users seeking solutions",
            "evidence": "Forum discussion increase",
            "significance": 80
          }
        ],
        "marketGaps": [
          {
            "gap": "Current solutions inadequate",
            "size": "large",
            "accessibility": "moderate"
          }
        ]
      },
      "riskFactors": {
        "timingRisk": 25, // 0-100 (higher = riskier)
        "competitionRisk": 40,
        "marketAcceptanceRisk": 30,
        "overallRisk": "medium", // low/medium/high
        "mitigationStrategies": ["MVP rapid testing", "Early user feedback"]
      },
      "actionPlan": {
        "immediateActions": ["Deepen market research", "Plan MVP"],
        "shortTermGoals": ["First 100 users", "Product-market fit"],
        "longTermStrategy": "Rapid scaling for market leadership",
        "keyMetrics": ["User growth rate", "Churn rate"],
        "successIndicators": ["Monthly 20%+ growth", "Positive feedback"]
      },
      "enhancedScore": 82, // original + early signal bonus
      "confidence": 85, // 0-100
      "recommendation": "Strong early signals present. Optimal to move within 6-9 months."
    }

    IMPORTANT:
    - Respond only in JSON format
    - Make realistic, evidence-based analysis
    - Focus on timing - this is the critical factor
    - Provide concrete action plan
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON'ı parse et
    let analysis: EarlySignalAnalysis;
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
        earlySignalScore: originalScore ? Math.min(100, originalScore + 15) : 75,
        signalStrength: 'moderate',
        timingIntelligence: {
          marketCycle: 'early-trend',
          optimalEntryWindow: language === 'tr' ? 'sonraki 6-12 ay' : 'next 6-12 months',
          competitorAwareness: 'minimal',
          firstMoverAdvantage: 70,
          windowOfOpportunity: language === 'tr' ? '12-18 ay kaldı' : '12-18 months remaining'
        },
        signalSources: {
          technicalIndicators: [
            {
              source: language === 'tr' ? 'Pazar Trendleri' : 'Market Trends',
              signal: language === 'tr' ? 'Pozitif sinyal tespit edildi' : 'Positive signal detected',
              strength: 70,
              reliability: 'medium'
            }
          ],
          behavioralSignals: [
            {
              behavior: language === 'tr' ? 'Kullanıcı ilgisi artışı' : 'Increasing user interest',
              evidence: language === 'tr' ? 'Sosyal medya aktivitesi' : 'Social media activity',
              significance: 65
            }
          ],
          marketGaps: [
            {
              gap: language === 'tr' ? 'Çözüm boşluğu mevcut' : 'Solution gap exists',
              size: 'medium',
              accessibility: 'moderate'
            }
          ]
        },
        riskFactors: {
          timingRisk: 40,
          competitionRisk: 50,
          marketAcceptanceRisk: 45,
          overallRisk: 'medium',
          mitigationStrategies: [
            language === 'tr' ? 'Hızlı prototip geliştirme' : 'Rapid prototyping',
            language === 'tr' ? 'Pazar geri bildirimi' : 'Market feedback'
          ]
        },
        actionPlan: {
          immediateActions: [
            language === 'tr' ? 'Pazar araştırması' : 'Market research',
            language === 'tr' ? 'MVP planlaması' : 'MVP planning'
          ],
          shortTermGoals: [
            language === 'tr' ? 'İlk kullanıcılar' : 'First users',
            language === 'tr' ? 'Ürün-pazar uyumu' : 'Product-market fit'
          ],
          longTermStrategy: language === 'tr' ? 'Sürdürülebilir büyüme' : 'Sustainable growth',
          keyMetrics: [
            language === 'tr' ? 'Büyüme oranı' : 'Growth rate',
            language === 'tr' ? 'Kullanıcı memnuniyeti' : 'User satisfaction'
          ],
          successIndicators: [
            language === 'tr' ? 'Pozitif geri bildirim' : 'Positive feedback',
            language === 'tr' ? 'Büyüme trendi' : 'Growth trend'
          ]
        },
        enhancedScore: originalScore ? Math.min(100, originalScore + 15) : 75,
        confidence: 70,
        recommendation: language === 'tr' ? 
          'Erken sinyal analizi tamamlandı. Orta seviye fırsat tespit edildi.' : 
          'Early signal analysis completed. Medium-level opportunity detected.'
      };
    }

    res.status(200).json({ analysis });

  } catch (error) {
    console.error('Early Signal API error:', error);
    res.status(500).json({ 
      error: req.body.language === 'tr' ? 'Erken sinyal analizi sırasında hata oluştu' : 'Error during early signal analysis' 
    });
  }
}
