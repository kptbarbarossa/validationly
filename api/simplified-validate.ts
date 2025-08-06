import { GoogleGenAI, Type } from "@google/genai";

// Simplified validation result interface
interface SimplifiedValidationResult {
    idea: string;
    content?: string;
    demandScore: number;
    scoreJustification: string;
    
    // Simplified platform analyses
    platformAnalyses: {
        twitter: SimplePlatformAnalysis;
        reddit: SimplePlatformAnalysis;
        linkedin: SimplePlatformAnalysis;
    };
    
    // Simple content suggestions
    tweetSuggestion: string;
    redditTitleSuggestion: string;
    redditBodySuggestion: string;
    linkedinSuggestion: string;
}

interface SimplePlatformAnalysis {
    platformName: string;
    score: number; // 1-5 simple score
    summary: string; // 2-3 sentence simple explanation
    keyFindings: string[]; // 2-3 key findings
    contentSuggestion: string; // Platform-specific content suggestion
}

// Rate limiting store
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 50;

// Rate limiting check
function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userRequests = requestCounts.get(ip);

    if (!userRequests || now > userRequests.resetTime) {
        requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (userRequests.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    userRequests.count++;
    return true;
}

// Input validation
function validateInput(content: string): void {
    if (!content || typeof content !== 'string') {
        throw new Error("Content is required and must be a string");
    }

    if (content.length < 5) {
        throw new Error("Content must be at least 5 characters long");
    }

    if (content.length > 2000) {
        throw new Error("Content must be less than 2000 characters");
    }
}

// AI instance
let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
    if (!ai) {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            throw new Error("API_KEY environment variable is not set");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
}

// Simplified response schema
const simplifiedResponseSchema = {
    type: Type.OBJECT,
    properties: {
        idea: { type: Type.STRING, description: "The original idea analyzed" },
        demandScore: { type: Type.INTEGER, description: "A score from 0-100 representing market demand" },
        scoreJustification: { type: Type.STRING, description: "A short phrase justifying the score" },
        platformAnalyses: {
            type: Type.OBJECT,
            properties: {
                twitter: {
                    type: Type.OBJECT,
                    properties: {
                        platformName: { type: Type.STRING },
                        score: { type: Type.INTEGER, description: "1-5 score" },
                        summary: { type: Type.STRING, description: "2-3 sentence summary" },
                        keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                        contentSuggestion: { type: Type.STRING }
                    }
                },
                reddit: {
                    type: Type.OBJECT,
                    properties: {
                        platformName: { type: Type.STRING },
                        score: { type: Type.INTEGER, description: "1-5 score" },
                        summary: { type: Type.STRING, description: "2-3 sentence summary" },
                        keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                        contentSuggestion: { type: Type.STRING }
                    }
                },
                linkedin: {
                    type: Type.OBJECT,
                    properties: {
                        platformName: { type: Type.STRING },
                        score: { type: Type.INTEGER, description: "1-5 score" },
                        summary: { type: Type.STRING, description: "2-3 sentence summary" },
                        keyFindings: { type: Type.ARRAY, items: { type: Type.STRING } },
                        contentSuggestion: { type: Type.STRING }
                    }
                }
            }
        },
        tweetSuggestion: { type: Type.STRING, description: "An optimized X (Twitter) post version" },
        redditTitleSuggestion: { type: Type.STRING, description: "A compelling title for Reddit" },
        redditBodySuggestion: { type: Type.STRING, description: "A detailed body for Reddit post" },
        linkedinSuggestion: { type: Type.STRING, description: "A professional LinkedIn post version" }
    },
    required: ["idea", "demandScore", "scoreJustification", "platformAnalyses", "tweetSuggestion", "redditTitleSuggestion", "redditBodySuggestion", "linkedinSuggestion"]
};

// Error handling utilities
function getErrorMessage(error: any, platform: string, userLanguage: string): string {
    const isturkish = userLanguage === 'tr';
    
    if (error?.message?.includes('rate limit') || error?.message?.includes('quota')) {
        return isturkish 
            ? `${platform} analizi geçici olarak kullanılamıyor (hız sınırı). Lütfen birkaç dakika sonra tekrar deneyin.`
            : `${platform} analysis temporarily unavailable (rate limit). Please try again in a few minutes.`;
    }
    
    if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
        return isturkish
            ? `${platform} analizi için ağ bağlantısı sorunu. Lütfen tekrar deneyin.`
            : `Network connection issue for ${platform} analysis. Please try again.`;
    }
    
    if (error?.message?.includes('API_KEY') || error?.message?.includes('authentication')) {
        return isturkish
            ? `${platform} analizi geçici olarak kullanılamıyor (kimlik doğrulama sorunu).`
            : `${platform} analysis temporarily unavailable (authentication issue).`;
    }
    
    // Generic error message
    return isturkish
        ? `${platform} analizi şu anda mevcut değil. Lütfen daha sonra tekrar deneyin.`
        : `${platform} analysis currently unavailable. Please try again later.`;
}

// Enhanced default platform analysis with more meaningful content
function createDefaultPlatformAnalysis(platform: string, userLanguage: string, errorMessage?: string): SimplePlatformAnalysis {
    const isturkish = userLanguage === 'tr';
    
    const defaultMessages = {
        twitter: {
            summary: isturkish 
                ? "Twitter analizi geçici olarak mevcut değil. Genel startup fikirleri için orta seviyede viral potansiyel bekleniyor. Kısa ve etkileyici içerikler Twitter'da daha iyi performans gösterir."
                : "Twitter analysis temporarily unavailable. Generally moderate viral potential expected for startup ideas. Short, impactful content performs better on Twitter.",
            keyFindings: [
                isturkish ? "Viral potansiyel: Orta seviye (genel startup fikirleri için)" : "Viral potential: Moderate (typical for startup ideas)",
                isturkish ? "Hashtag stratejisi: Sektör etiketleri kullanın" : "Hashtag strategy: Use industry-relevant tags",
                isturkish ? "İçerik formatı: Kısa ve net mesajlar tercih edilir" : "Content format: Short, clear messages preferred"
            ],
            contentSuggestion: isturkish 
                ? "280 karakter sınırını göz önünde bulundurarak kısa ve etkileyici tweet'ler hazırlayın. Sektörünüze uygun hashtag'ler kullanın ve görsel içerik ekleyerek etkileşimi artırın."
                : "Create short, impactful tweets within the 280-character limit. Use industry-relevant hashtags and add visual content to increase engagement."
        },
        reddit: {
            summary: isturkish 
                ? "Reddit analizi geçici olarak mevcut değil. Startup fikirleri genellikle Reddit topluluklarında orta seviyede ilgi görür. Detaylı açıklamalar ve samimi yaklaşım önemlidir."
                : "Reddit analysis temporarily unavailable. Startup ideas typically receive moderate interest in Reddit communities. Detailed explanations and authentic approach are important.",
            keyFindings: [
                isturkish ? "Topluluk uyumu: Orta seviye (detaylı açıklama gerekli)" : "Community fit: Moderate (detailed explanation needed)",
                isturkish ? "Subreddit önerileri: r/startups, r/entrepreneur gibi" : "Subreddit suggestions: r/startups, r/entrepreneur, etc.",
                isturkish ? "Tartışma potansiyeli: Samimi yaklaşımla artırılabilir" : "Discussion potential: Can be increased with authentic approach"
            ],
            contentSuggestion: isturkish 
                ? "Fikrinizi detaylı bir şekilde açıklayın, hangi problemi çözdüğünü belirtin ve topluluktan geri bildirim isteyin. r/startups, r/entrepreneur gibi ilgili subreddit'lerde paylaşın."
                : "Explain your idea in detail, specify what problem it solves, and ask for community feedback. Share in relevant subreddits like r/startups, r/entrepreneur."
        },
        linkedin: {
            summary: isturkish 
                ? "LinkedIn analizi geçici olarak mevcut değil. İş fikirleri LinkedIn'de genellikle orta seviyede profesyonel ilgi görür. B2B odaklı yaklaşım ve iş değeri vurgusu önemlidir."
                : "LinkedIn analysis temporarily unavailable. Business ideas typically receive moderate professional interest on LinkedIn. B2B-focused approach and business value emphasis are important.",
            keyFindings: [
                isturkish ? "Profesyonel uygunluk: Orta seviye (iş değeri vurgusu gerekli)" : "Professional relevance: Moderate (business value emphasis needed)",
                isturkish ? "Hedef kitle: Girişimciler ve sektör uzmanları" : "Target audience: Entrepreneurs and industry experts",
                isturkish ? "Ağ değeri: Profesyonel bağlantılar kurma potansiyeli" : "Network value: Potential for professional connections"
            ],
            contentSuggestion: isturkish 
                ? "Profesyonel bir dil kullanarak fikrinizin iş değerini vurgulayın. Sektör uzmanlarından görüş alın ve potansiyel ortaklık fırsatlarını araştırın."
                : "Use professional language to emphasize your idea's business value. Seek insights from industry experts and explore potential partnership opportunities."
        }
    };

    const platformKey = platform.toLowerCase() as keyof typeof defaultMessages;
    const defaults = defaultMessages[platformKey] || defaultMessages.twitter;

    return {
        platformName: platform,
        score: 3, // Neutral score when analysis fails
        summary: errorMessage || defaults.summary,
        keyFindings: defaults.keyFindings,
        contentSuggestion: defaults.contentSuggestion
    };
}

// Enhanced default content suggestions with more actionable advice
function createDefaultContentSuggestions(content: string, userLanguage: string) {
    const isturkish = userLanguage === 'tr';
    const shortContent = content.substring(0, 100);
    const mediumContent = content.substring(0, 150);
    
    return {
        tweetSuggestion: isturkish 
            ? `🚀 Yeni bir fikir üzerinde çalışıyorum: "${shortContent}..." \n\nBu konuda deneyimi olan var mı? Görüşlerinizi merak ediyorum! 💭\n\n#startup #girişim #fikir #validasyon`
            : `🚀 Working on a new idea: "${shortContent}..."\n\nAnyone with experience in this area? Would love your thoughts! 💭\n\n#startup #idea #validation #feedback`,
        redditTitleSuggestion: isturkish 
            ? `[Fikir Paylaşımı] ${content.substring(0, 80)}... - Topluluktan geri bildirim arıyorum`
            : `[Idea Sharing] ${content.substring(0, 80)}... - Seeking community feedback`,
        redditBodySuggestion: isturkish 
            ? `Merhaba r/startups topluluğu!\n\nŞu fikir üzerinde çalışıyorum ve sizin görüşlerinizi almak istiyorum:\n\n**Fikir:** ${content}\n\n**Sorularım:**\n- Bu problemi yaşayan var mı?\n- Benzer çözümler kullandınız mı?\n- Hangi özellikler en önemli olurdu?\n\nHer türlü geri bildirime açığım. Teşekkürler!`
            : `Hi r/startups community!\n\nI'm working on this idea and would love your feedback:\n\n**Idea:** ${content}\n\n**Questions:**\n- Has anyone experienced this problem?\n- Have you used similar solutions?\n- What features would be most important?\n\nOpen to all feedback. Thanks!`,
        linkedinSuggestion: isturkish 
            ? `💡 Yeni bir iş fikri geliştiriyorum ve sektör uzmanlarının görüşlerini almak istiyorum:\n\n"${mediumContent}..."\n\nBu alanda deneyimi olan profesyonellerden öneriler ve geri bildirimler bekliyorum. Yorumlarınızı paylaşır mısınız?\n\n#girişimcilik #startup #inovasyon #işfikri`
            : `💡 Developing a new business idea and seeking insights from industry experts:\n\n"${mediumContent}..."\n\nLooking for suggestions and feedback from professionals with experience in this area. Would you share your thoughts?\n\n#entrepreneurship #startup #innovation #businessidea`
    };
}

// Platform-specific analysis functions with enhanced error handling
async function analyzeTwitter(content: string, userLanguage: string): Promise<SimplePlatformAnalysis> {
    const languageInstructions = getLanguageInstructions(userLanguage);
    const platformName = userLanguage === 'tr' ? 'Twitter' : 'Twitter';
    
    const systemInstruction = `You are a Twitter/X social media expert analyzing startup ideas for viral potential and trend alignment.

    ${languageInstructions}

    TWITTER/X ANALYSIS FOCUS:
    - Viral potential (1-5): How likely is this idea to go viral on Twitter?
    - Trend alignment: Does this align with current Twitter trends and conversations?
    - Audience reaction: What kind of reactions would this get from Twitter users?
    - Hashtag suggestions: 2-3 relevant hashtags that could boost visibility
    - Content strategy: How should this be presented on Twitter for maximum engagement?

    ANALYSIS CRITERIA:
    - Score 1-5 based on Twitter's fast-paced, trend-driven nature
    - Consider Twitter's audience: tech-savvy, early adopters, opinion leaders
    - Think about shareability, controversy potential, and discussion triggers
    - Focus on brevity and impact (Twitter's character limit culture)
    - Consider visual content potential (images, videos, threads)

    OUTPUT FORMAT:
    - platformName: "${platformName}"
    - score: 1-5 integer
    - summary: 2-3 sentences explaining viral potential and audience fit
    - keyFindings: 2-3 bullet points about trend alignment and audience reaction
    - contentSuggestion: Specific Twitter content strategy advice`;

    const twitterSchema = {
        type: Type.OBJECT,
        properties: {
            platformName: { type: Type.STRING },
            score: { type: Type.INTEGER, description: "1-5 score for Twitter viral potential" },
            summary: { type: Type.STRING, description: "2-3 sentence summary of Twitter potential" },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 key findings about Twitter fit" },
            contentSuggestion: { type: Type.STRING, description: "Twitter-specific content strategy" }
        },
        required: ["platformName", "score", "summary", "keyFindings", "contentSuggestion"]
    };

    try {
        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `ANALYZE FOR TWITTER: "${content}"\n\nFocus specifically on Twitter's viral potential, trend alignment, and audience reaction. Consider hashtag strategies and content format optimization.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: twitterSchema,
                temperature: 0.4,
                maxOutputTokens: 512,
            }
        });

        const responseText = result.text?.trim();
        if (!responseText) {
            throw new Error('Empty Twitter analysis response');
        }

        const parsedResult = JSON.parse(responseText);
        
        // Validate the parsed result structure
        if (!parsedResult.platformName || !parsedResult.score || !parsedResult.summary) {
            throw new Error('Invalid Twitter analysis response structure');
        }

        // Validate language consistency
        const summaryLanguageValid = validateLanguageConsistency(parsedResult.summary, userLanguage);
        const contentSuggestionLanguageValid = validateLanguageConsistency(parsedResult.contentSuggestion, userLanguage);
        
        if (!summaryLanguageValid || !contentSuggestionLanguageValid) {
            console.warn(`Twitter analysis language inconsistency detected. Expected: ${userLanguage}`);
            // Continue with the result but log the issue for monitoring
        }

        return parsedResult;
    } catch (error) {
        console.error('Twitter analysis failed:', error);
        const errorMessage = getErrorMessage(error, 'Twitter', userLanguage);
        return createDefaultPlatformAnalysis('Twitter', userLanguage, errorMessage);
    }
}

async function analyzeReddit(content: string, userLanguage: string): Promise<SimplePlatformAnalysis> {
    const languageInstructions = getLanguageInstructions(userLanguage);
    const platformName = userLanguage === 'tr' ? 'Reddit' : 'Reddit';
    
    const systemInstruction = `You are a Reddit community expert analyzing startup ideas for community fit and discussion potential.

    ${languageInstructions}

    REDDIT ANALYSIS FOCUS:
    - Community fit (1-5): How well does this idea fit Reddit's community culture?
    - Discussion potential: Will this generate meaningful discussions and engagement?
    - Subreddit recommendations: Which subreddits would be most receptive?
    - Expected sentiment: What kind of reactions from Reddit users?
    - Content strategy: How to present this idea to Reddit communities effectively?

    ANALYSIS CRITERIA:
    - Score 1-5 based on Reddit's community-driven, discussion-focused nature
    - Consider Reddit's audience: detail-oriented, skeptical, values authenticity
    - Think about which subreddits would engage positively
    - Consider potential for constructive criticism and feedback
    - Focus on community value and genuine problem-solving

    OUTPUT FORMAT:
    - platformName: "${platformName}"
    - score: 1-5 integer
    - summary: 2-3 sentences explaining community fit and discussion potential
    - keyFindings: 2-3 bullet points about subreddit fit and expected reactions
    - contentSuggestion: Specific Reddit community engagement strategy`;

    const redditSchema = {
        type: Type.OBJECT,
        properties: {
            platformName: { type: Type.STRING },
            score: { type: Type.INTEGER, description: "1-5 score for Reddit community fit" },
            summary: { type: Type.STRING, description: "2-3 sentence summary of Reddit potential" },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 key findings about Reddit fit" },
            contentSuggestion: { type: Type.STRING, description: "Reddit-specific community strategy" }
        },
        required: ["platformName", "score", "summary", "keyFindings", "contentSuggestion"]
    };

    try {
        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `ANALYZE FOR REDDIT: "${content}"\n\nFocus specifically on Reddit community fit, discussion potential, and which subreddits would be most receptive. Consider Reddit's culture of detailed feedback and skepticism.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: redditSchema,
                temperature: 0.4,
                maxOutputTokens: 512,
            }
        });

        const responseText = result.text?.trim();
        if (!responseText) {
            throw new Error('Empty Reddit analysis response');
        }

        const parsedResult = JSON.parse(responseText);
        
        // Validate the parsed result structure
        if (!parsedResult.platformName || !parsedResult.score || !parsedResult.summary) {
            throw new Error('Invalid Reddit analysis response structure');
        }

        // Validate language consistency
        const summaryLanguageValid = validateLanguageConsistency(parsedResult.summary, userLanguage);
        const contentSuggestionLanguageValid = validateLanguageConsistency(parsedResult.contentSuggestion, userLanguage);
        
        if (!summaryLanguageValid || !contentSuggestionLanguageValid) {
            console.warn(`Reddit analysis language inconsistency detected. Expected: ${userLanguage}`);
            // Continue with the result but log the issue for monitoring
        }

        return parsedResult;
    } catch (error) {
        console.error('Reddit analysis failed:', error);
        const errorMessage = getErrorMessage(error, 'Reddit', userLanguage);
        return createDefaultPlatformAnalysis('Reddit', userLanguage, errorMessage);
    }
}

async function analyzeLinkedIn(content: string, userLanguage: string): Promise<SimplePlatformAnalysis> {
    const languageInstructions = getLanguageInstructions(userLanguage);
    const platformName = userLanguage === 'tr' ? 'LinkedIn' : 'LinkedIn';
    
    const systemInstruction = `You are a LinkedIn professional network expert analyzing startup ideas for business potential and professional relevance.

    ${languageInstructions}

    LINKEDIN ANALYSIS FOCUS:
    - Professional relevance (1-5): How relevant is this to LinkedIn's professional audience?
    - Business potential: What's the B2B and networking value of this idea?
    - Target audience: Which professionals would be most interested?
    - Networking value: How can this idea leverage LinkedIn's networking features?
    - Content strategy: How to present this professionally on LinkedIn?

    ANALYSIS CRITERIA:
    - Score 1-5 based on LinkedIn's professional, business-focused nature
    - Consider LinkedIn's audience: professionals, entrepreneurs, business leaders
    - Think about B2B potential, industry connections, and professional growth
    - Consider thought leadership opportunities and industry discussions
    - Focus on business value, ROI, and professional development

    OUTPUT FORMAT:
    - platformName: "${platformName}"
    - score: 1-5 integer
    - summary: 2-3 sentences explaining professional relevance and business potential
    - keyFindings: 2-3 bullet points about target audience and networking value
    - contentSuggestion: Specific LinkedIn professional content strategy`;

    const linkedinSchema = {
        type: Type.OBJECT,
        properties: {
            platformName: { type: Type.STRING },
            score: { type: Type.INTEGER, description: "1-5 score for LinkedIn professional relevance" },
            summary: { type: Type.STRING, description: "2-3 sentence summary of LinkedIn potential" },
            keyFindings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "2-3 key findings about LinkedIn fit" },
            contentSuggestion: { type: Type.STRING, description: "LinkedIn-specific professional strategy" }
        },
        required: ["platformName", "score", "summary", "keyFindings", "contentSuggestion"]
    };

    try {
        const aiInstance = getAI();
        const result = await aiInstance.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: `ANALYZE FOR LINKEDIN: "${content}"\n\nFocus specifically on LinkedIn's professional relevance, business potential, and networking value. Consider B2B opportunities and professional audience engagement.`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: linkedinSchema,
                temperature: 0.4,
                maxOutputTokens: 512,
            }
        });

        const responseText = result.text?.trim();
        if (!responseText) {
            throw new Error('Empty LinkedIn analysis response');
        }

        const parsedResult = JSON.parse(responseText);
        
        // Validate the parsed result structure
        if (!parsedResult.platformName || !parsedResult.score || !parsedResult.summary) {
            throw new Error('Invalid LinkedIn analysis response structure');
        }

        // Validate language consistency
        const summaryLanguageValid = validateLanguageConsistency(parsedResult.summary, userLanguage);
        const contentSuggestionLanguageValid = validateLanguageConsistency(parsedResult.contentSuggestion, userLanguage);
        
        if (!summaryLanguageValid || !contentSuggestionLanguageValid) {
            console.warn(`LinkedIn analysis language inconsistency detected. Expected: ${userLanguage}`);
            // Continue with the result but log the issue for monitoring
        }

        return parsedResult;
    } catch (error) {
        console.error('LinkedIn analysis failed:', error);
        const errorMessage = getErrorMessage(error, 'LinkedIn', userLanguage);
        return createDefaultPlatformAnalysis('LinkedIn', userLanguage, errorMessage);
    }
}

// Enhanced language detection helper
function detectLanguage(content: string): string {
    if (!content || typeof content !== 'string') {
        return 'en'; // Default to English for invalid input
    }
    
    const text = content.toLowerCase();
    
    // Turkish character detection (more comprehensive)
    const turkishChars = /[çğıöşüÇĞIİÖŞÜ]/g;
    const turkishCharMatches = text.match(turkishChars);
    const turkishCharCount = turkishCharMatches ? turkishCharMatches.length : 0;
    
    // Turkish words detection (expanded list)
    const turkishWords = /\b(ve|bir|bu|şu|için|ile|olan|gibi|daha|çok|en|de|da|ki|mi|mu|mı|mü|ben|sen|o|biz|siz|onlar|var|yok|iyi|kötü|büyük|küçük|yeni|eski|gelen|giden|yapan|eden|olan|şey|yer|zaman|kişi|insan|adam|kadın|çocuk|anne|baba|ev|iş|para|su|yemek|içmek|gitmek|gelmek|yapmak|etmek|olmak|vermek|almak|görmek|bilmek|söylemek|demek|çalışmak|oturmak|kalkmak|uyumak|uyanmak|sevmek|istemek|gerekli|lazım|mümkün|imkansız|kolay|zor|hızlı|yavaş|sıcak|soğuk|açık|kapalı|doğru|yanlış|güzel|çirkin|temiz|kirli|zengin|fakir|mutlu|üzgün|sağlıklı|hasta|genç|yaşlı|uzun|kısa|geniş|dar|yüksek|alçak|ağır|hafif|sert|yumuşak|tatlı|acı|tuzlu|ekşi|beyaz|siyah|kırmızı|mavi|yeşil|sarı|turuncu|mor|pembe|kahverengi|gri)\b/g;
    const turkishWordMatches = text.match(turkishWords);
    const turkishWordCount = turkishWordMatches ? turkishWordMatches.length : 0;
    
    // Turkish suffixes detection
    const turkishSuffixes = /(lar|ler|dan|den|ta|te|da|de|ya|ye|a|e|ı|i|u|ü|ın|in|un|ün|nın|nin|nun|nün|sı|si|su|sü|nı|ni|nu|nü|dır|dir|dur|dür|tır|tir|tur|tür|ken|iken|ince|ınca|unca|ünce|erek|arak|arak|erek|mak|mek|acak|ecek|yor|iyor|uyor|üyor|dı|di|du|dü|tı|ti|tu|tü|mış|miş|muş|müş|se|sa|yse|ysa|ise|ısa|usa|üse)$/g;
    const turkishSuffixMatches = text.match(turkishSuffixes);
    const turkishSuffixCount = turkishSuffixMatches ? turkishSuffixMatches.length : 0;
    
    // Calculate Turkish indicators score
    const totalLength = content.length;
    const turkishScore = (turkishCharCount * 3) + (turkishWordCount * 2) + turkishSuffixCount;
    const turkishRatio = totalLength > 0 ? turkishScore / totalLength : 0;
    
    // Enhanced detection logic
    // If we have Turkish characters and words, it's likely Turkish
    if (turkishCharCount > 0 && turkishWordCount > 0) {
        return 'tr';
    }
    
    // If we have a high ratio of Turkish indicators
    if (turkishRatio > 0.1 && turkishWordCount > 1) {
        return 'tr';
    }
    
    // If we have multiple Turkish words even without special characters
    if (turkishWordCount > 2) {
        return 'tr';
    }
    
    // Default to English
    return 'en';
}

// Language validation helper
function validateLanguageConsistency(response: string, expectedLanguage: string): boolean {
    if (!response || typeof response !== 'string') {
        return false;
    }
    
    const detectedLanguage = detectLanguage(response);
    return detectedLanguage === expectedLanguage;
}

// Get language-specific instructions for AI prompts
function getLanguageInstructions(language: string): string {
    if (language === 'tr') {
        return `
🌍 TÜRKÇE DİL GEREKSİNİMLERİ:
- TÜM yanıtlar Türkçe olmalıdır
- Türkçe karakter kullanımına dikkat edin (ç, ğ, ı, ö, ş, ü)
- Türkçe dilbilgisi kurallarına uyun
- Doğal ve akıcı Türkçe ifadeler kullanın
- Teknik terimler için Türkçe karşılıkları tercih edin

IMPORTANT: Respond entirely in Turkish for ALL fields including platformName, summary, keyFindings, and contentSuggestion.`;
    } else {
        return `
🌍 ENGLISH LANGUAGE REQUIREMENTS:
- ALL responses must be in English
- Use clear, natural English expressions
- Follow proper English grammar rules
- Use professional but accessible language
- Avoid overly technical jargon

IMPORTANT: Respond entirely in English for ALL fields including platformName, summary, keyFindings, and contentSuggestion.`;
    }
}

// Validation function to ensure analysis results are properly structured
function validateAnalysisResult(result: SimplifiedValidationResult): SimplifiedValidationResult {
    // Ensure all required fields exist with proper defaults
    const validated: SimplifiedValidationResult = {
        idea: result.idea || 'Unknown idea',
        demandScore: Math.max(0, Math.min(100, result.demandScore || 50)),
        scoreJustification: result.scoreJustification || 'Analysis completed',
        platformAnalyses: {
            twitter: validatePlatformAnalysis(result.platformAnalyses?.twitter, 'Twitter'),
            reddit: validatePlatformAnalysis(result.platformAnalyses?.reddit, 'Reddit'),
            linkedin: validatePlatformAnalysis(result.platformAnalyses?.linkedin, 'LinkedIn')
        },
        tweetSuggestion: result.tweetSuggestion || 'Tweet suggestion unavailable',
        redditTitleSuggestion: result.redditTitleSuggestion || 'Reddit title suggestion unavailable',
        redditBodySuggestion: result.redditBodySuggestion || 'Reddit body suggestion unavailable',
        linkedinSuggestion: result.linkedinSuggestion || 'LinkedIn suggestion unavailable'
    };
    
    return validated;
}

function validatePlatformAnalysis(analysis: SimplePlatformAnalysis | undefined, platformName: string): SimplePlatformAnalysis {
    if (!analysis) {
        return {
            platformName,
            score: 3,
            summary: `${platformName} analysis unavailable`,
            keyFindings: ['Analysis pending'],
            contentSuggestion: 'Content suggestion unavailable'
        };
    }
    
    return {
        platformName: analysis.platformName || platformName,
        score: Math.max(1, Math.min(5, analysis.score || 3)),
        summary: analysis.summary || `${platformName} analysis unavailable`,
        keyFindings: Array.isArray(analysis.keyFindings) && analysis.keyFindings.length > 0 
            ? analysis.keyFindings 
            : ['Analysis pending'],
        contentSuggestion: analysis.contentSuggestion || 'Content suggestion unavailable'
    };
}



// Simplified AI analysis using platform-specific functions with enhanced error handling
async function getSimplifiedAIAnalysis(content: string): Promise<SimplifiedValidationResult> {
    const userLanguage = detectLanguage(content);
    
    const languageInstructions = getLanguageInstructions(userLanguage);
    
    const systemInstruction = `You are 'Validationly', an expert AI market research analyst. Provide a simplified overall validation assessment.

    ${languageInstructions}

    OVERALL ANALYSIS:
    - Demand Score (0-100): Simple market demand assessment
    - Score Justification: Brief explanation of the score
    - Content Suggestions: Platform-optimized content versions

    Keep all responses simple, clear, and actionable.`;

    const overallSchema = {
        type: Type.OBJECT,
        properties: {
            idea: { type: Type.STRING, description: "The original idea" },
            demandScore: { type: Type.INTEGER, description: "0-100 market demand score" },
            scoreJustification: { type: Type.STRING, description: "Brief score explanation" },
            tweetSuggestion: { type: Type.STRING, description: "Optimized Twitter post" },
            redditTitleSuggestion: { type: Type.STRING, description: "Reddit title" },
            redditBodySuggestion: { type: Type.STRING, description: "Reddit body text" },
            linkedinSuggestion: { type: Type.STRING, description: "LinkedIn post" }
        },
        required: ["idea", "demandScore", "scoreJustification", "tweetSuggestion", "redditTitleSuggestion", "redditBodySuggestion", "linkedinSuggestion"]
    };

    try {
        console.log('🎯 Using platform-specific analysis approach...');
        
        // Run platform analyses in parallel with individual error handling
        const [twitterAnalysis, redditAnalysis, linkedinAnalysis] = await Promise.allSettled([
            analyzeTwitter(content, userLanguage),
            analyzeReddit(content, userLanguage),
            analyzeLinkedIn(content, userLanguage)
        ]);

        // Extract results or use defaults for failed analyses
        const twitter = twitterAnalysis.status === 'fulfilled' 
            ? twitterAnalysis.value 
            : createDefaultPlatformAnalysis('Twitter', userLanguage);
        
        const reddit = redditAnalysis.status === 'fulfilled' 
            ? redditAnalysis.value 
            : createDefaultPlatformAnalysis('Reddit', userLanguage);
        
        const linkedin = linkedinAnalysis.status === 'fulfilled' 
            ? linkedinAnalysis.value 
            : createDefaultPlatformAnalysis('LinkedIn', userLanguage);

        // Try overall analysis with fallback
        let overallAnalysis;
        try {
            const aiInstance = getAI();
            const result = await aiInstance.models.generateContent({
                model: "gemini-2.0-flash-exp",
                contents: `OVERALL ANALYSIS: "${content}"\n\nProvide overall demand score and content suggestions.`,
                config: {
                    systemInstruction,
                    responseMimeType: "application/json",
                    responseSchema: overallSchema,
                    temperature: 0.3,
                    maxOutputTokens: 1024,
                }
            });
            
            const responseText = result.text?.trim();
            if (!responseText) {
                throw new Error('Empty overall analysis response');
            }
            
            overallAnalysis = JSON.parse(responseText);
        } catch (overallError) {
            console.error('Overall analysis failed, using defaults:', overallError);
            const defaultContent = createDefaultContentSuggestions(content, userLanguage);
            
            // Provide more meaningful default score based on content length and complexity
            let defaultScore = 50;
            if (content.length > 200) defaultScore = 55; // Longer descriptions might indicate more thought
            if (content.includes('AI') || content.includes('app') || content.includes('platform')) defaultScore = 60; // Tech ideas often have demand
            if (content.includes('problem') || content.includes('solution')) defaultScore = 65; // Problem-solution fit awareness
            
            overallAnalysis = {
                idea: content,
                demandScore: defaultScore,
                scoreJustification: userLanguage === 'tr' 
                    ? 'Detaylı analiz geçici olarak mevcut değil. Genel pazar değerlendirmesi yapıldı.'
                    : 'Detailed analysis temporarily unavailable. General market assessment provided.',
                ...defaultContent
            };
        }

        const result: SimplifiedValidationResult = {
            idea: overallAnalysis.idea || content,
            demandScore: overallAnalysis.demandScore || 50,
            scoreJustification: overallAnalysis.scoreJustification || (userLanguage === 'tr' ? 'Genel değerlendirme' : 'General assessment'),
            platformAnalyses: {
                twitter,
                reddit,
                linkedin
            },
            tweetSuggestion: overallAnalysis.tweetSuggestion || '',
            redditTitleSuggestion: overallAnalysis.redditTitleSuggestion || '',
            redditBodySuggestion: overallAnalysis.redditBodySuggestion || '',
            linkedinSuggestion: overallAnalysis.linkedinSuggestion || ''
        };

        console.log('✅ Platform-specific analysis completed');
        return validateAnalysisResult(result);

    } catch (error) {
        console.error('❌ Complete analysis failed, using full fallback:', error);
        
        // Complete fallback when everything fails - still provide value to user
        const defaultContent = createDefaultContentSuggestions(content, userLanguage);
        
        // Provide basic heuristic scoring even when AI fails
        let fallbackScore = 45; // Slightly below neutral to indicate uncertainty
        if (content.length > 100) fallbackScore += 5; // More detailed ideas
        if (content.toLowerCase().includes('ai') || content.toLowerCase().includes('app')) fallbackScore += 10;
        if (content.toLowerCase().includes('problem') || content.toLowerCase().includes('solve')) fallbackScore += 10;
        if (content.toLowerCase().includes('market') || content.toLowerCase().includes('customer')) fallbackScore += 5;
        
        // Cap the score
        fallbackScore = Math.min(fallbackScore, 70);
        
        const fallbackResult = {
            idea: content,
            demandScore: fallbackScore,
            scoreJustification: userLanguage === 'tr' 
                ? 'AI analiz sistemi geçici olarak kullanılamıyor. Temel değerlendirme yapıldı. Daha detaylı analiz için lütfen daha sonra tekrar deneyin.'
                : 'AI analysis system temporarily unavailable. Basic assessment provided. Please try again later for detailed analysis.',
            platformAnalyses: {
                twitter: createDefaultPlatformAnalysis('Twitter', userLanguage, 
                    userLanguage === 'tr' 
                        ? 'Twitter analizi geçici olarak mevcut değil, ancak genel startup fikirleri için öneriler sunuldu.'
                        : 'Twitter analysis temporarily unavailable, but general startup idea recommendations provided.'
                ),
                reddit: createDefaultPlatformAnalysis('Reddit', userLanguage,
                    userLanguage === 'tr' 
                        ? 'Reddit analizi geçici olarak mevcut değil, ancak topluluk etkileşimi için öneriler sunuldu.'
                        : 'Reddit analysis temporarily unavailable, but community engagement recommendations provided.'
                ),
                linkedin: createDefaultPlatformAnalysis('LinkedIn', userLanguage,
                    userLanguage === 'tr' 
                        ? 'LinkedIn analizi geçici olarak mevcut değil, ancak profesyonel ağ için öneriler sunuldu.'
                        : 'LinkedIn analysis temporarily unavailable, but professional networking recommendations provided.'
                )
            },
            ...defaultContent
        };
        
        return validateAnalysisResult(fallbackResult);
    }
}

export default async function handler(req: any, res: any) {
    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
            ? 'https://validationly.com'
            : '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': "default-src 'none'; script-src 'none';"
    };

    Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('=== Simplified API validate called ===');

        // Rate limiting
        const clientIP = req.headers['x-forwarded-for'] as string ||
            req.headers['x-real-ip'] as string ||
            'unknown';

        if (!checkRateLimit(clientIP)) {
            return res.status(429).json({
                message: 'Rate limit exceeded. Please try again later.'
            });
        }

        const { idea, content } = req.body;
        const inputContent = idea || content;

        // Input validation
        if (!inputContent) {
            return res.status(400).json({
                message: 'Idea or content is required'
            });
        }
        validateInput(inputContent);

        // Get simplified AI analysis
        const result = await getSimplifiedAIAnalysis(inputContent);

        console.log('✅ Simplified validation completed successfully');
        return res.status(200).json(result);

    } catch (error) {
        console.error('❌ Simplified validation error:', error);
        
        // Determine user language for error messages
        const { idea, content } = req.body;
        const inputContent = idea || content || '';
        const userLanguage = detectLanguage(inputContent);
        const isturkish = userLanguage === 'tr';
        
        // Create user-friendly error messages
        let errorMessage = 'Analysis failed. Please try again.';
        let statusCode = 500;
        
        if (error?.message?.includes('rate limit') || error?.message?.includes('quota')) {
            statusCode = 429;
            errorMessage = isturkish 
                ? 'Çok fazla istek gönderildi. Lütfen birkaç dakika bekleyip tekrar deneyin.'
                : 'Too many requests. Please wait a few minutes and try again.';
        } else if (error?.message?.includes('API_KEY') || error?.message?.includes('authentication')) {
            statusCode = 503;
            errorMessage = isturkish 
                ? 'Analiz servisi geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.'
                : 'Analysis service temporarily unavailable. Please try again later.';
        } else if (error?.message?.includes('network') || error?.message?.includes('timeout')) {
            statusCode = 503;
            errorMessage = isturkish 
                ? 'Ağ bağlantısı sorunu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.'
                : 'Network connection issue. Please check your internet connection and try again.';
        } else if (error?.message?.includes('validation') || error?.message?.includes('required')) {
            statusCode = 400;
            errorMessage = isturkish 
                ? 'Geçersiz veri gönderildi. Lütfen fikrinizi kontrol edip tekrar deneyin.'
                : 'Invalid data provided. Please check your idea and try again.';
        } else {
            // Generic error
            errorMessage = isturkish 
                ? 'Analiz sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
                : 'An error occurred during analysis. Please try again later.';
        }
        
        return res.status(statusCode).json({
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}