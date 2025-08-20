import { GoogleGenAI } from "@google/genai";
import OpenAI from 'openai';
import Groq from 'groq-sdk';

// AI-Only Analysis System - No external data fetching
// Uses only the AI model's own knowledge base and reasoning

interface AnalysisInput {
  idea: string;
  audience?: string;
  goal?: string;
  constraints?: string;
}

interface Assumption {
  text: string;
  confidence: number;
}

interface DemandSignal {
  signal: string;
  evidence: string;
  confidence: number;
}

interface Risk {
  type: 'product' | 'market' | 'execution' | 'legal';
  likelihood: number;
  impact: number;
  note: string;
}

interface ValidationPlan {
  name: string;
  cost: 'low' | 'medium' | 'high';
  metric: string;
  success_criteria: string;
}

interface PricingHypothesis {
  plan_free: string;
  plan_pro: string;
  price_range: string;
}

interface GTM {
  ICP: string[];
  channels: string[];
  positioning: string;
  pricing_hypothesis: PricingHypothesis;
}

interface ScoreBreakdown {
  novelty: number;
  demand_plausibility: number;
  monetization_clarity: number;
  feasibility: number;
  gtm_fit: number;
}

interface AnalysisResult {
  idea_summary: string;
  assumptions: Assumption[];
  target_audience: string[];
  jobs_to_be_done: string[];
  value_hypotheses: string[];
  demand_signals: DemandSignal[];
  competitive_landscape: {
    substitutes: string[];
    adjacent_tools: string[];
    moat_likelihood: number;
  };
  risks: Risk[];
  validation_plan: ValidationPlan[];
  gtm: GTM;
  score_breakdown: ScoreBreakdown;
  final_score: number;
  uncertainty_note: string;
}

// AI Model Selection
function getAI() {
  const model = process.env.PREFERRED_AI_MODEL || 'gemini';
  
  switch (model) {
    case 'openai':
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }
      return {
        type: 'openai',
        instance: new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
      };
    
    case 'groq':
      if (!process.env.GROQ_API_KEY) {
        throw new Error('Groq API key not configured');
      }
      return {
        type: 'groq',
        instance: new Groq({ apiKey: process.env.GROQ_API_KEY })
      };
    
    case 'gemini':
    default:
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('Google API key not configured');
      }
      return {
        type: 'gemini',
        instance: new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
      };
  }
}

// AI Analysis Prompt
const ANALYSIS_PROMPT = `# Cursor Prompt — AI‑Only Analysis (Validationly + Vercel)

**Role:** Senior Product Strategist & LLM Architect. **Sadece yapay zekanın kendi bilgisini** kullanarak analiz yap. **Kesinlikle dış veri çekme** (web scrape, API çağrısı, arama yok). Kod üretme aşamasına geçmeden önce **tek bir analiz çıktısı** üret.

---

## 0) Kapsam ve Kısıtlar

* Ürün: **Validationly** — kullanıcı bir fikir/sorgu girer; model, **kendi önbilgisi** ve genel pazar sezgileriyle (2025'e kadar tipik teknoloji pazarı normları) analiz çıkarır.
* **Veri kısıtı:** Sadece modelin eğitimiyle sahip olduğu bilgi ve mantık yürütme. Harici kaynaklara referans verme; emin olmadığın detaylarda **belirsizlik skoru** ver.
* Hedef ortam: **Vercel + Next.js 14**; bu prompt, `/api/analyze` uç noktası için **tek adımda** konsolide bir analiz döndürmek üzere tasarlanmıştır.

---

## 1) Girdi Şeması

Model bu prompt ile çağrıldığında aşağıdaki \`input\` alanlarını bekle:

\`\`\`json
{
  "idea": "kullanıcının fikri veya sorgusu (kısa paragraf)",
  "audience": "hedef kitle (opsiyonel)",
  "goal": "kullanıcının bu analizden beklediği amaç (opsiyonel)",
  "constraints": "ek kısıtlar (opsiyonel)"
}
\`\`\`

---

## 2) Çıktı Formatı (İKİ PARÇA)

**A) İnsan-okur dostu Markdown özet**
**B) Makine tüketimi için JSON** — aşağıdaki şemaya **harfiyen** uy.

\`\`\`json
{
  "idea_summary": "",
  "assumptions": [{"text":"","confidence":0.0}],
  "target_audience": [""],
  "jobs_to_be_done": [""],
  "value_hypotheses": [""],
  "demand_signals": [{"signal":"","evidence":"model-prior","confidence":0.0}],
  "competitive_landscape": {
    "substitutes": [""],
    "adjacent_tools": [""],
    "moat_likelihood": 0.0
  },
  "risks": [
    {"type":"product","likelihood":0.0,"impact":0.0,"note":""},
    {"type":"market","likelihood":0.0,"impact":0.0,"note":""},
    {"type":"execution","likelihood":0.0,"impact":0.0,"note":""},
    {"type":"legal","likelihood":0.0,"impact":0.0,"note":""}
  ],
  "validation_plan": [
    {"name":"Smoke test landing","cost":"low","metric":"CR >= 5%","success_criteria":">=5% email opt-in"},
    {"name":"Audience interviews (n=10)","cost":"low","metric":"% strong pain","success_criteria":">=70%"},
    {"name":"Concierge prototype","cost":"medium","metric":"paid trials","success_criteria":">=5"}
  ],
  "gtm": {
    "ICP": [""],
    "channels": [""],
    "positioning": "",
    "pricing_hypothesis": {"plan_free":"","plan_pro":"","price_range":""}
  },
  "score_breakdown": {
    "novelty": 0.0,
    "demand_plausibility": 0.0,
    "monetization_clarity": 0.0,
    "feasibility": 0.0,
    "gtm_fit": 0.0
  },
  "final_score": 0,
  "uncertainty_note": "bilinmeyen/veri yok alanlarını belirt"
}
\`\`\`

---

## 3) Skorlama Rubriği

* **novelty (0–1):** Fikrin bilinen kalıplara göre özgünlüğü.
* **demand_plausibility (0–1):** Var sayılan acının gücü + ödeme isteği sezgisi.
* **monetization_clarity (0–1):** Gelir modelinin netliği (abonelik, usage, aracı komisyon vs.).
* **feasibility (0–1):** Teknik/operasyonel uygulanabilirlik (MVP karmaşıklığı, risk).
* **gtm_fit (0–1):** Hedef kanallarla uyum (ICP'ye ulaşılabilirlik).

> **final_score (0–100) = 100 * (0.25*demand_plausibility + 0.2*novelty + 0.2*feasibility + 0.2*gtm_fit + 0.15*monetization_clarity)**

---

## 4) Düşünme Disiplini (Prompt Derinliği)

Aşağıdaki adımları **içsel olarak** takip et ve sadece sonuçları çıktı formatında sun:

1. **Decompose:** Fikri parçalara ayır (müşteri, problem, çözüm, kanal, gelir).
2. **Interrogate:** Her parça için en güçlü **karşı argümanı** üret.
3. **Synthesize:** En makul varsayımlarla birleşik model kur.
4. **Score:** Rubriğe göre puanla; belirsiz alanlara düşük güven.
5. **Plan:** 2 hafta içinde yapılabilecek, **maliyet/dönüş** oranı en yüksek 3 test.

---

## 5) Üslup ve Sınırlar

* Net, kısa paragraflar + maddeler. Jargon şişirmesi yok.
* **Kesin konuşma**: "muhtemelen", "olası" gibi kelimeleri sadece belirsizlikte kullan.
* Harici marka/ürün adı verirsen **belirsizlik etiketi** ekle (örn. "(düşük güven)").
* Asla link verme, kaynak gösterme iddiasında bulunma.

---

## 6) Uygulama Notu (Vercel/Next.js için)

Bu prompt, \`POST /api/analyze\` içinde **tek çağrı** ile kullanılacak. Önerilen inference ayarları:

* **temperature: 0.2**, **top_p: 0.9**, **max_tokens: yüksek ama pratik (örn. 2k)**, **seed** mümkünse sabitle.
* Yanıtı **iki blok** halinde dön: önce Markdown özet, ardından ayrı bir \`\`\`json bloğu.
* İstek başına 10s timeout öner; daha uzun analiz gerekirse kısa özet + JSON döndür.

---

## 7) Örnek İstek (dummy)

\`\`\`json
{
  "idea": "B2B SaaS: X/Twitter, Reddit ve LinkedIn sinyallerinden iş fikri validasyon skoru üretir.",
  "audience": "tek kurucular, indie maker'lar, erken aşama ekipler",
  "goal": "yatırımcıya sunum için hızlı analiz",
  "constraints": "harici veri yok, model önbilgisi"
}
\`\`\`

**Yanıt formatı:** Önce kısa bir Markdown özet (1–2 ekran), ardından yukarıdaki JSON şema **eksiksiz** doldurulmuş olarak.

---

## ANALİZ BAŞLA

**GİRDİ:**
Idea: {idea}
Audience: {audience || 'Not specified'}
Goal: {goal || 'Not specified'}
Constraints: {constraints || 'None'}

**Lütfen yukarıdaki formatı takip ederek analiz yapın. Önce Markdown özet, sonra JSON çıktısı.**`;

export async function POST(request: Request) {
  try {
    const body: AnalysisInput = await request.json();
    const { idea, audience, goal, constraints } = body;

    if (!idea || !idea.trim()) {
      return Response.json(
        { error: 'Idea is required' },
        { status: 400 }
      );
    }

    console.log('🚀 Starting AI-only analysis for:', idea.substring(0, 100) + '...');

    const ai = getAI();
    let analysisResult: string;

    // AI Analysis based on model type
    if (ai.type === 'openai') {
      const completion = await ai.instance.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: ANALYSIS_PROMPT
          },
          {
            role: 'user',
            content: `Idea: ${idea}\nAudience: ${audience || 'Not specified'}\nGoal: ${goal || 'Not specified'}\nConstraints: ${constraints || 'None'}`
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        top_p: 0.9
      });
      analysisResult = completion.choices[0]?.message?.content || '';

    } else if (ai.type === 'groq') {
      const completion = await ai.instance.chat.completions.create({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: ANALYSIS_PROMPT
          },
          {
            role: 'user',
            content: `Idea: ${idea}\nAudience: ${audience || 'Not specified'}\nGoal: ${goal || 'Not specified'}\nConstraints: ${constraints || 'None'}`
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        top_p: 0.9
      });
      analysisResult = completion.choices[0]?.message?.content || '';

    } else {
      // Gemini
      const model = ai.instance.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: ANALYSIS_PROMPT + `\n\n**GİRDİ:**\nIdea: ${idea}\nAudience: ${audience || 'Not specified'}\nGoal: ${goal || 'Not specified'}\nConstraints: ${constraints || 'None'}\n\n**Lütfen yukarıdaki formatı takip ederek analiz yapın. Önce Markdown özet, sonra JSON çıktısı.**`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          topP: 0.9,
          maxOutputTokens: 4000
        }
      });
      analysisResult = result.response.text();
    }

    if (!analysisResult) {
      throw new Error('AI analysis failed - no response generated');
    }

    // Extract JSON from the response
    const jsonMatch = analysisResult.match(/```json\s*([\s\S]*?)\s*```/);
    let parsedResult: AnalysisResult;

    if (jsonMatch && jsonMatch[1]) {
      try {
        parsedResult = JSON.parse(jsonMatch[1]);
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        // Fallback: try to extract JSON from the entire response
        const fallbackMatch = analysisResult.match(/\{[\s\S]*\}/);
        if (fallbackMatch) {
          try {
            parsedResult = JSON.parse(fallbackMatch[0]);
          } catch (fallbackError) {
            throw new Error('Failed to parse AI response as JSON');
          }
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      }
    } else {
      throw new Error('No JSON block found in AI response');
    }

    // Validate required fields
    if (!parsedResult.final_score || !parsedResult.idea_summary) {
      throw new Error('AI response missing required fields');
    }

    console.log('✅ AI analysis completed successfully');

    return Response.json({
      success: true,
      markdown_summary: analysisResult.replace(/```json[\s\S]*```/, '').trim(),
      analysis: parsedResult,
      ai_model: ai.type,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ AI analysis failed:', error);
    
    return Response.json(
      { 
        error: 'Analysis failed', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
