import { IndustryCategory } from '../types';

/**
 * Dimensional Scoring AI Prompts System
 * Implements requirement 1.1 and 2.3 for specialized prompts with industry-specific modifications
 * and language consistency enforcement
 */

export interface PromptTemplate {
  basePrompt: string;
  industrySpecificAddons: Partial<Record<IndustryCategory, string>>;
  outputFormatting: string;
  languageInstructions: string;
}

export enum AnalysisType {
  MARKET_SIZE = 'market_size',
  COMPETITION_INTENSITY = 'competition_intensity',
  TECHNICAL_FEASIBILITY = 'technical_feasibility',
  MONETIZATION_POTENTIAL = 'monetization_potential',
  TIMING_TREND = 'timing_trend'
}

/**
 * Base prompt templates for each dimensional scoring component
 */
export const DIMENSIONAL_PROMPT_TEMPLATES: Record<AnalysisType, PromptTemplate> = {
  [AnalysisType.MARKET_SIZE]: {
    basePrompt: `You are an expert market analyst evaluating the market size potential of a business idea. 

Analyze the following business idea and provide a comprehensive market size assessment:

BUSINESS IDEA: "{input}"

Evaluate the market size potential by considering:
1. Total Addressable Market (TAM) - the overall market demand
2. Serviceable Addressable Market (SAM) - the portion you can realistically target
3. Market growth trends and future expansion potential
4. Geographic reach and scalability opportunities
5. Customer segments and their size
6. Market maturity and development stage

Provide a score from 0-100 where:
- 90-100: Massive market with billions in potential (global scale)
- 70-89: Large market with significant growth potential
- 50-69: Moderate market size with decent opportunities
- 30-49: Small to niche market with limited growth
- 0-29: Very limited market with minimal potential

Consider both current market size and future growth potential in your scoring.`,

    industrySpecificAddons: {
      [IndustryCategory.SAAS_TECH]: `
SAAS/TECH SPECIFIC CONSIDERATIONS:
- Enterprise vs SMB market segments and their respective sizes
- API integration opportunities and developer ecosystem potential
- Recurring revenue model scalability
- Global software market trends and digital transformation drivers
- Platform effects and network value creation potential`,

      [IndustryCategory.ECOMMERCE]: `
ECOMMERCE SPECIFIC CONSIDERATIONS:
- Consumer spending patterns and e-commerce adoption rates
- Market penetration in target demographics
- Seasonal demand variations and market stability
- Cross-border selling opportunities
- Mobile commerce growth and accessibility`,

      [IndustryCategory.HEALTH_FITNESS]: `
HEALTH/FITNESS SPECIFIC CONSIDERATIONS:
- Healthcare spending trends and wellness market growth
- Demographic shifts (aging population, health consciousness)
- Insurance reimbursement potential and healthcare integration
- Preventive care vs treatment market dynamics
- Global health and wellness market expansion`,

      [IndustryCategory.FINTECH]: `
FINTECH SPECIFIC CONSIDERATIONS:
- Financial services market size and digital adoption
- Underbanked/unbanked population opportunities
- Regulatory market access and geographic expansion potential
- Traditional banking disruption opportunities
- Emerging market financial inclusion potential`,

      [IndustryCategory.EDUCATION]: `
EDUCATION SPECIFIC CONSIDERATIONS:
- Educational spending by institutions and individuals
- Online learning adoption and market growth
- Corporate training and professional development markets
- International education market opportunities
- Lifelong learning and skill development trends`
    },

    outputFormatting: `
REQUIRED OUTPUT FORMAT:
{
  "score": [0-100 integer],
  "reasoning": "[2-3 sentence explanation of the score]",
  "keyFactors": ["factor1", "factor2", "factor3", "factor4"],
  "improvementAreas": ["improvement1", "improvement2", "improvement3"]
}`,

    languageInstructions: `
LANGUAGE CONSISTENCY REQUIREMENTS:
- Respond in the same language as the input business idea
- If input is in Turkish, respond entirely in Turkish
- If input is in English, respond entirely in English
- Maintain professional, analytical tone throughout
- Use industry-appropriate terminology consistently`
  },

  [AnalysisType.COMPETITION_INTENSITY]: {
    basePrompt: `You are an expert competitive analyst evaluating the competition intensity for a business idea.

Analyze the following business idea and assess the competitive landscape:

BUSINESS IDEA: "{input}"

Evaluate competition intensity by considering:
1. Number and strength of direct competitors
2. Indirect competitors and substitute solutions
3. Barriers to entry for new competitors
4. Market saturation and competitive dynamics
5. Differentiation opportunities and unique value propositions
6. Competitive advantages and defensibility

Provide a score from 0-100 where:
- 90-100: Blue ocean with minimal competition, high differentiation potential
- 70-89: Low competition with clear differentiation opportunities
- 50-69: Moderate competition, success depends on execution and positioning
- 30-49: High competition, requires strong differentiation and superior execution
- 0-29: Extremely competitive market, very difficult to gain market share

Note: Higher scores indicate LOWER competition (better for the business idea).`,

    industrySpecificAddons: {
      [IndustryCategory.SAAS_TECH]: `
SAAS/TECH SPECIFIC CONSIDERATIONS:
- Open source alternatives and their market impact
- Big tech companies' potential entry and platform risks
- Developer ecosystem competition and API alternatives
- Technical moats and intellectual property protection
- Network effects and switching costs as competitive advantages`,

      [IndustryCategory.ECOMMERCE]: `
ECOMMERCE SPECIFIC CONSIDERATIONS:
- Amazon and major marketplace competition
- Direct-to-consumer vs marketplace strategy implications
- Brand loyalty and customer acquisition cost dynamics
- Supply chain and logistics competitive advantages
- Private label and white-label competition threats`,

      [IndustryCategory.HARDWARE]: `
HARDWARE SPECIFIC CONSIDERATIONS:
- Manufacturing scale advantages of established players
- Patent landscape and intellectual property barriers
- Supply chain control and component access
- Capital requirements creating natural barriers to entry
- Brand recognition and distribution channel access`,

      [IndustryCategory.FINTECH]: `
FINTECH SPECIFIC CONSIDERATIONS:
- Traditional banking institutions' digital transformation
- Regulatory compliance as a competitive barrier
- Trust and brand recognition advantages of incumbents
- Partnership opportunities vs direct competition with banks
- Neobank and challenger bank competitive landscape`,

      [IndustryCategory.CONSUMER_APP]: `
CONSUMER APP SPECIFIC CONSIDERATIONS:
- App store competition and discovery challenges
- Social media platform competition and feature replication
- Network effects and user acquisition cost dynamics
- Platform dependency risks (iOS/Android policy changes)
- Viral growth potential vs paid acquisition requirements`
    },

    outputFormatting: `
REQUIRED OUTPUT FORMAT:
{
  "score": [0-100 integer],
  "reasoning": "[2-3 sentence explanation of the competitive landscape]",
  "keyFactors": ["factor1", "factor2", "factor3", "factor4"],
  "improvementAreas": ["improvement1", "improvement2", "improvement3"]
}`,

    languageInstructions: `
LANGUAGE CONSISTENCY REQUIREMENTS:
- Respond in the same language as the input business idea
- If input is in Turkish, respond entirely in Turkish
- If input is in English, respond entirely in English
- Maintain professional, analytical tone throughout
- Use competitive analysis terminology consistently`
  },

  [AnalysisType.TECHNICAL_FEASIBILITY]: {
    basePrompt: `You are an expert technical architect evaluating the technical feasibility of a business idea.

Analyze the following business idea and assess its technical implementation complexity:

BUSINESS IDEA: "{input}"

Evaluate technical feasibility by considering:
1. Implementation complexity and technical challenges
2. Required technologies and their maturity/availability
3. Development timeline and resource requirements
4. Scalability and performance considerations
5. Integration requirements with existing systems
6. Technical expertise and talent availability

Provide a score from 0-100 where:
- 90-100: Simple implementation using existing technologies and frameworks
- 70-89: Moderate complexity, achievable with standard development practices
- 50-69: Complex but feasible, requires specialized expertise or significant development
- 30-49: High technical complexity, requires breakthrough innovations or extensive R&D
- 0-29: Extremely challenging, may require technologies that don't exist yet

Consider both current technical capabilities and reasonable development timelines.`,

    industrySpecificAddons: {
      [IndustryCategory.SAAS_TECH]: `
SAAS/TECH SPECIFIC CONSIDERATIONS:
- Cloud infrastructure scalability and architecture complexity
- API design and integration ecosystem requirements
- Data security and privacy compliance implementation
- Multi-tenancy and enterprise-grade features
- Real-time processing and performance optimization needs`,

      [IndustryCategory.FINTECH]: `
FINTECH SPECIFIC CONSIDERATIONS:
- Financial data security and encryption requirements
- Regulatory compliance system implementation (KYC, AML)
- Banking API integrations and payment processing
- Real-time transaction processing and fraud detection
- Audit trails and regulatory reporting capabilities`,

      [IndustryCategory.HARDWARE]: `
HARDWARE SPECIFIC CONSIDERATIONS:
- Physical product design and engineering complexity
- Manufacturing processes and quality control systems
- Supply chain integration and component sourcing
- Firmware/software integration requirements
- Testing, certification, and compliance processes`,

      [IndustryCategory.HEALTH_FITNESS]: `
HEALTH/FITNESS SPECIFIC CONSIDERATIONS:
- Medical device integration and data accuracy requirements
- HIPAA compliance and health data security
- Clinical validation and FDA approval processes
- Wearable device integration and sensor data processing
- Evidence-based algorithm development and validation`,

      [IndustryCategory.EDUCATION]: `
EDUCATION SPECIFIC CONSIDERATIONS:
- Learning management system integration
- Accessibility compliance (WCAG, Section 508)
- Multi-platform delivery (web, mobile, offline)
- Content management and delivery scalability
- Assessment and progress tracking system complexity`
    },

    outputFormatting: `
REQUIRED OUTPUT FORMAT:
{
  "score": [0-100 integer],
  "reasoning": "[2-3 sentence explanation of technical complexity and feasibility]",
  "keyFactors": ["factor1", "factor2", "factor3", "factor4"],
  "improvementAreas": ["improvement1", "improvement2", "improvement3"]
}`,

    languageInstructions: `
LANGUAGE CONSISTENCY REQUIREMENTS:
- Respond in the same language as the input business idea
- If input is in Turkish, respond entirely in Turkish
- If input is in English, respond entirely in English
- Use appropriate technical terminology for the target language
- Maintain consistent technical depth and professional tone`
  },

  [AnalysisType.MONETIZATION_POTENTIAL]: {
    basePrompt: `You are an expert business model analyst evaluating the monetization potential of a business idea.

Analyze the following business idea and assess its revenue generation opportunities:

BUSINESS IDEA: "{input}"

Evaluate monetization potential by considering:
1. Revenue model clarity and viability
2. Customer willingness to pay and price sensitivity
3. Recurring revenue opportunities and customer lifetime value
4. Multiple revenue stream potential
5. Scalability of revenue generation
6. Market pricing benchmarks and competitive pricing power

Provide a score from 0-100 where:
- 90-100: Multiple clear revenue streams with high customer willingness to pay
- 70-89: Strong monetization model with proven market demand for similar solutions
- 50-69: Moderate monetization potential, requires careful pricing strategy
- 30-49: Limited revenue opportunities, challenging monetization model
- 0-29: Very difficult to monetize, unclear value proposition for payment

Consider both immediate monetization opportunities and long-term revenue potential.`,

    industrySpecificAddons: {
      [IndustryCategory.SAAS_TECH]: `
SAAS/TECH SPECIFIC CONSIDERATIONS:
- Subscription model viability and pricing tier opportunities
- Usage-based pricing potential and scalability
- Enterprise vs SMB pricing power and contract values
- API monetization and developer ecosystem revenue
- Freemium conversion rates and premium feature adoption`,

      [IndustryCategory.ECOMMERCE]: `
ECOMMERCE SPECIFIC CONSIDERATIONS:
- Product margin potential and pricing flexibility
- Transaction volume scalability and repeat purchase rates
- Subscription box or membership model opportunities
- Marketplace commission structure viability
- Cross-selling and upselling revenue potential`,

      [IndustryCategory.MARKETPLACE]: `
MARKETPLACE SPECIFIC CONSIDERATIONS:
- Commission rate viability for both sides of the market
- Transaction volume potential and take rate optimization
- Premium service and feature monetization
- Advertising and promotional revenue opportunities
- Data monetization and analytics service potential`,

      [IndustryCategory.CONTENT_MEDIA]: `
CONTENT/MEDIA SPECIFIC CONSIDERATIONS:
- Advertising revenue potential and audience monetization
- Subscription and premium content model viability
- Sponsorship and brand partnership opportunities
- Creator economy and revenue sharing models
- Licensing and syndication revenue potential`,

      [IndustryCategory.B2B_SERVICES]: `
B2B SERVICES SPECIFIC CONSIDERATIONS:
- Professional service pricing power and hourly rates
- Retainer and long-term contract opportunities
- Outcome-based pricing and performance fees
- Training and consulting revenue streams
- Software tool and platform monetization potential`
    },

    outputFormatting: `
REQUIRED OUTPUT FORMAT:
{
  "score": [0-100 integer],
  "reasoning": "[2-3 sentence explanation of monetization opportunities and challenges]",
  "keyFactors": ["factor1", "factor2", "factor3", "factor4"],
  "improvementAreas": ["improvement1", "improvement2", "improvement3"]
}`,

    languageInstructions: `
LANGUAGE CONSISTENCY REQUIREMENTS:
- Respond in the same language as the input business idea
- If input is in Turkish, respond entirely in Turkish
- If input is in English, respond entirely in English
- Use appropriate business and financial terminology
- Maintain consistent analytical tone throughout`
  },

  [AnalysisType.TIMING_TREND]: {
    basePrompt: `You are an expert market timing analyst evaluating the timing and trend alignment of a business idea.

Analyze the following business idea and assess its market timing and trend alignment:

BUSINESS IDEA: "{input}"

Evaluate timing and trend potential by considering:
1. Current market trends and their alignment with the idea
2. Technology readiness and adoption curves
3. Consumer behavior shifts and market readiness
4. Economic conditions and their impact
5. Regulatory environment and policy trends
6. Competitive timing and market windows

Provide a score from 0-100 where:
- 90-100: Perfect timing with strong tailwinds and emerging trends
- 70-89: Good timing with favorable market conditions and trend alignment
- 50-69: Reasonable timing, market is ready but not optimal
- 30-49: Poor timing, market conditions are challenging or premature
- 0-29: Very poor timing, market is not ready or trends are unfavorable

Consider both current market conditions and near-term trend projections.`,

    industrySpecificAddons: {
      [IndustryCategory.SAAS_TECH]: `
SAAS/TECH SPECIFIC CONSIDERATIONS:
- Digital transformation acceleration and cloud adoption trends
- Remote work and distributed team technology needs
- AI/ML integration opportunities and market readiness
- Developer tool ecosystem evolution and API-first trends
- Enterprise software modernization cycles`,

      [IndustryCategory.HEALTH_FITNESS]: `
HEALTH/FITNESS SPECIFIC CONSIDERATIONS:
- Post-pandemic health consciousness and wellness trends
- Aging population and preventive care focus
- Digital health adoption and telemedicine growth
- Wearable technology integration and data-driven health
- Mental health awareness and holistic wellness trends`,

      [IndustryCategory.FINTECH]: `
FINTECH SPECIFIC CONSIDERATIONS:
- Digital payment adoption and cashless society trends
- Cryptocurrency and blockchain technology maturation
- Open banking regulations and API standardization
- Financial inclusion and underbanked market opportunities
- Regulatory sandbox programs and fintech-friendly policies`,

      [IndustryCategory.EDUCATION]: `
EDUCATION SPECIFIC CONSIDERATIONS:
- Online learning acceleration and hybrid education models
- Skills gap and continuous learning market demand
- Corporate training digitization and remote learning needs
- Educational technology funding and institutional adoption
- Personalized learning and AI-driven education trends`,

      [IndustryCategory.ECOMMERCE]: `
ECOMMERCE SPECIFIC CONSIDERATIONS:
- E-commerce penetration growth and omnichannel retail
- Social commerce and influencer marketing trends
- Sustainability and ethical consumption movements
- Direct-to-consumer brand growth and marketplace saturation
- Mobile commerce and social shopping platform evolution`
    },

    outputFormatting: `
REQUIRED OUTPUT FORMAT:
{
  "score": [0-100 integer],
  "reasoning": "[2-3 sentence explanation of timing and trend alignment]",
  "keyFactors": ["factor1", "factor2", "factor3", "factor4"],
  "improvementAreas": ["improvement1", "improvement2", "improvement3"]
}`,

    languageInstructions: `
LANGUAGE CONSISTENCY REQUIREMENTS:
- Respond in the same language as the input business idea
- If input is in Turkish, respond entirely in Turkish
- If input is in English, respond entirely in English
- Use appropriate market analysis and trend terminology
- Maintain consistent forward-looking analytical perspective`
  }
};

/**
 * Prompt Builder Class
 * Constructs complete prompts with industry-specific modifications and language consistency
 */
export class DimensionalPromptBuilder {
  /**
   * Build a complete prompt for dimensional scoring
   */
  static buildPrompt(
    analysisType: AnalysisType,
    input: string,
    industry: IndustryCategory,
    language: string = 'en'
  ): string {
    const template = DIMENSIONAL_PROMPT_TEMPLATES[analysisType];
    
    // Start with base prompt
    let prompt = template.basePrompt.replace('{input}', input);
    
    // Add industry-specific considerations if available
    const industryAddon = template.industrySpecificAddons[industry];
    if (industryAddon) {
      prompt += '\n\n' + industryAddon;
    }
    
    // Add output formatting requirements
    prompt += '\n\n' + template.outputFormatting;
    
    // Add language consistency instructions
    prompt += '\n\n' + template.languageInstructions;
    
    // Add final instruction for language consistency
    if (language === 'tr') {
      prompt += '\n\nIMPORTANT: Respond entirely in Turkish. All analysis, reasoning, and factors must be in Turkish.';
    } else {
      prompt += '\n\nIMPORTANT: Respond entirely in English. Maintain professional business analysis language.';
    }
    
    return prompt;
  }

  /**
   * Get all available analysis types
   */
  static getAnalysisTypes(): AnalysisType[] {
    return Object.values(AnalysisType);
  }

  /**
   * Validate prompt template completeness
   */
  static validatePromptTemplate(analysisType: AnalysisType): boolean {
    const template = DIMENSIONAL_PROMPT_TEMPLATES[analysisType];
    
    return !!(
      template &&
      template.basePrompt &&
      template.outputFormatting &&
      template.languageInstructions &&
      template.industrySpecificAddons
    );
  }

  /**
   * Get industry-specific considerations for an analysis type
   */
  static getIndustryConsiderations(
    analysisType: AnalysisType,
    industry: IndustryCategory
  ): string | null {
    const template = DIMENSIONAL_PROMPT_TEMPLATES[analysisType];
    return template.industrySpecificAddons[industry] || null;
  }
}

/**
 * Language Detection and Consistency Utilities
 */
export class LanguageConsistencyEnforcer {
  /**
   * Detect the primary language of the input text
   */
  static detectLanguage(input: string): string {
    // Simple language detection based on character patterns and common words
    const turkishPatterns = [
      /[çğıöşüÇĞIİÖŞÜ]/,
      /\b(bir|bu|şu|ve|ile|için|olan|olan|gibi|kadar|daha|çok|az|büyük|küçük)\b/i
    ];
    
    const englishPatterns = [
      /\b(the|and|or|but|in|on|at|to|for|of|with|by|from|about|into|through|during)\b/i
    ];
    
    const turkishScore = turkishPatterns.reduce((score, pattern) => {
      return score + (pattern.test(input) ? 1 : 0);
    }, 0);
    
    const englishScore = englishPatterns.reduce((score, pattern) => {
      return score + (pattern.test(input) ? 1 : 0);
    }, 0);
    
    // If Turkish patterns are found and English patterns are fewer, likely Turkish
    if (turkishScore > 0 && turkishScore >= englishScore) {
      return 'tr';
    }
    
    // Default to English
    return 'en';
  }

  /**
   * Validate that response language matches expected language
   */
  static validateResponseLanguage(response: string, expectedLanguage: string): boolean {
    const detectedLanguage = this.detectLanguage(response);
    return detectedLanguage === expectedLanguage;
  }

  /**
   * Get language-specific formatting instructions
   */
  static getLanguageInstructions(language: string): string {
    if (language === 'tr') {
      return `
TÜRKÇE DİL GEREKSİNİMLERİ:
- Tüm analiz ve açıklamalar Türkçe olmalıdır
- Profesyonel iş analizi terminolojisi kullanın
- Tutarlı ve anlaşılır bir ton benimseyin
- Teknik terimler için uygun Türkçe karşılıkları kullanın`;
    } else {
      return `
ENGLISH LANGUAGE REQUIREMENTS:
- All analysis and explanations must be in English
- Use professional business analysis terminology
- Maintain consistent and clear tone
- Use appropriate technical terminology`;
    }
  }
}

/**
 * Prompt Validation and Quality Assurance
 */
export class PromptValidator {
  /**
   * Validate that all required prompt components are present
   */
  static validatePromptCompleteness(prompt: string): {
    isValid: boolean;
    missingComponents: string[];
  } {
    const requiredComponents = [
      'BUSINESS IDEA:',
      'REQUIRED OUTPUT FORMAT:',
      'LANGUAGE CONSISTENCY REQUIREMENTS:',
      'score',
      'reasoning',
      'keyFactors',
      'improvementAreas'
    ];
    
    const missingComponents = requiredComponents.filter(component => 
      !prompt.includes(component)
    );
    
    return {
      isValid: missingComponents.length === 0,
      missingComponents
    };
  }

  /**
   * Validate industry-specific addon coverage
   */
  static validateIndustryAddonCoverage(): {
    analysisType: AnalysisType;
    missingIndustries: IndustryCategory[];
  }[] {
    const results: {
      analysisType: AnalysisType;
      missingIndustries: IndustryCategory[];
    }[] = [];
    
    const allIndustries = Object.values(IndustryCategory);
    
    Object.entries(DIMENSIONAL_PROMPT_TEMPLATES).forEach(([type, template]) => {
      const missingIndustries = allIndustries.filter(industry => 
        !template.industrySpecificAddons[industry]
      );
      
      if (missingIndustries.length > 0) {
        results.push({
          analysisType: type as AnalysisType,
          missingIndustries
        });
      }
    });
    
    return results;
  }
}

// All exports are already defined above with their class/const declarations