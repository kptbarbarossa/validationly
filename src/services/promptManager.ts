interface PromptSelection {
  basePrompt: string;
  sectorPrompts: string[];
  analysisPrompts: string[];
  confidence: number;
}

interface SectorKeywords {
  [key: string]: string[];
}

interface AnalysisKeywords {
  [key: string]: string[];
}

class PromptManager {
  private sectorKeywords: SectorKeywords = {
    saas: [
      'saas', 'software', 'subscription', 'recurring', 'cloud', 'api', 'platform',
      'dashboard', 'analytics', 'crm', 'automation', 'workflow', 'integration',
      'b2b', 'enterprise', 'tool', 'service', 'management', 'tracking'
    ],
    ecommerce: [
      'ecommerce', 'e-commerce', 'marketplace', 'store', 'shop', 'selling',
      'products', 'retail', 'commerce', 'buy', 'sell', 'inventory', 'shipping',
      'payment', 'checkout', 'cart', 'order', 'customer', 'brand', 'fashion'
    ],
    fintech: [
      'fintech', 'finance', 'financial', 'payment', 'banking', 'money', 'crypto',
      'blockchain', 'wallet', 'lending', 'investment', 'trading', 'insurance',
      'credit', 'loan', 'transaction', 'currency', 'savings', 'budget'
    ],
    marketplace: [
      'marketplace', 'platform', 'connect', 'matching', 'network', 'community',
      'freelance', 'gig', 'sharing', 'peer-to-peer', 'p2p', 'two-sided',
      'buyers', 'sellers', 'providers', 'users', 'booking', 'rental'
    ],
    mobile: [
      'mobile', 'app', 'ios', 'android', 'smartphone', 'tablet', 'native',
      'gaming', 'social', 'messaging', 'photo', 'video', 'location',
      'notification', 'offline', 'camera', 'gps', 'ar', 'vr'
    ]
  };

  private analysisKeywords: AnalysisKeywords = {
    market: [
      'market', 'opportunity', 'size', 'demand', 'customers', 'audience',
      'segment', 'niche', 'growth', 'potential', 'tam', 'sam', 'som'
    ],
    competitive: [
      'competitor', 'competition', 'similar', 'existing', 'alternative',
      'rival', 'compare', 'differentiate', 'advantage', 'moat', 'positioning'
    ],
    monetization: [
      'revenue', 'monetize', 'pricing', 'business model', 'subscription',
      'freemium', 'ads', 'commission', 'fee', 'profit', 'income', 'earn'
    ]
  };

  async loadPrompt(promptName: string): Promise<string> {
    try {
      const response = await fetch(`/src/prompts/${promptName}.prompt`);
      return await response.text();
    } catch (error) {
      console.error(`Failed to load prompt: ${promptName}`, error);
      return '';
    }
  }

  detectSector(input: string): string[] {
    const inputLower = input.toLowerCase();
    const detectedSectors: string[] = [];
    
    for (const [sector, keywords] of Object.entries(this.sectorKeywords)) {
      const matchCount = keywords.filter(keyword => 
        inputLower.includes(keyword)
      ).length;
      
      if (matchCount > 0) {
        detectedSectors.push(sector);
      }
    }
    
    // Default to saas if no clear sector detected
    return detectedSectors.length > 0 ? detectedSectors : ['saas'];
  }

  detectAnalysisNeeds(input: string): string[] {
    const inputLower = input.toLowerCase();
    const detectedAnalysis: string[] = [];
    
    for (const [analysis, keywords] of Object.entries(this.analysisKeywords)) {
      const matchCount = keywords.filter(keyword => 
        inputLower.includes(keyword)
      ).length;
      
      if (matchCount > 0) {
        detectedAnalysis.push(analysis);
      }
    }
    
    // Default analysis types
    return detectedAnalysis.length > 0 ? detectedAnalysis : ['market', 'competitive'];
  }

  async selectPrompts(input: string): Promise<PromptSelection> {
    const sectors = this.detectSector(input);
    const analysisTypes = this.detectAnalysisNeeds(input);
    
    const basePrompt = await this.loadPrompt('base-analyst');
    const sectorPrompts = await Promise.all(
      sectors.map(sector => this.loadPrompt(`${sector}-sector`))
    );
    const analysisPrompts = await Promise.all(
      analysisTypes.map(analysis => this.loadPrompt(`${analysis}-opportunity`))
    );
    
    return {
      basePrompt,
      sectorPrompts: sectorPrompts.filter(p => p.length > 0),
      analysisPrompts: analysisPrompts.filter(p => p.length > 0),
      confidence: this.calculateConfidence(sectors, analysisTypes)
    };
  }

  private calculateConfidence(sectors: string[], analysisTypes: string[]): number {
    // Simple confidence calculation based on detection clarity
    const sectorConfidence = sectors.length === 1 ? 0.8 : 0.6;
    const analysisConfidence = analysisTypes.length > 0 ? 0.8 : 0.5;
    return (sectorConfidence + analysisConfidence) / 2;
  }

  combinePrompts(selection: PromptSelection): string {
    const parts = [selection.basePrompt];
    
    if (selection.sectorPrompts.length > 0) {
      parts.push('\n\n' + selection.sectorPrompts.join('\n\n'));
    }
    
    if (selection.analysisPrompts.length > 0) {
      parts.push('\n\n' + selection.analysisPrompts.join('\n\n'));
    }
    
    return parts.join('');
  }
}

export const promptManager = new PromptManager();
export type { PromptSelection };