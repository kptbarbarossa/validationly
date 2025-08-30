import {
  HookSynthRequest,
  HookSynthResult,
  Hook,
  HookType,
  VideoTone,
  VideoGoal,
  VisualPlan,
  ABTestPack,
  HookMetrics,
  UserPlan
} from '../types';

export class YouTubeHookSynthService {
  /**
   * Generate YouTube hooks for maximum retention and CTR
   */
  async generateHooks(request: HookSynthRequest): Promise<HookSynthResult> {
    console.log(`🎬 Generating YouTube hooks for: "${request.category}" (${request.persona}, ${request.tone})`);
    
    try {
      // Generate hooks based on request parameters
      const hooks = await this.createHooks(request);
      
      // Generate A/B test pack
      const abTestPack = this.generateABTestPack(hooks, request);
      
      const result: HookSynthResult = {
        brief: {
          category: request.category,
          persona: request.persona,
          tone: request.tone,
          goal: request.goal
        },
        hooks,
        ab_test_pack: abTestPack,
        notes: [
          'API/RSS only; rakip altyazıları izin yoksa analiz edilmez.',
          'Hooklar ≤9 sn; ilk 5 sn\'de net vaat/gizem kuralı uygulandı.',
          'Visual planlar 0.0-9.0s arası timecode ile optimize edildi.'
        ],
        created_at: new Date().toISOString()
      };
      
      console.log(`✅ Generated ${hooks.length} hooks with avg score: ${hooks.reduce((acc, h) => acc + h.hook_score, 0) / hooks.length}`);
      return result;
      
    } catch (error) {
      console.error('Error generating hooks:', error);
      throw new Error(`Failed to generate hooks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create hooks using different hook types and strategies
   */
  private async createHooks(request: HookSynthRequest): Promise<Hook[]> {
    const hooks: Hook[] = [];
    const hookTypes: HookType[] = ['question', 'bold_claim', 'curiosity_gap', 'pattern_interrupt', 'fomo', 'challenge', 'authority', 'contrarian'];
    
    // Generate 2-3 hooks per type for variety
    for (const hookType of hookTypes) {
      const typeHooks = this.generateHooksByType(hookType, request);
      hooks.push(...typeHooks);
    }
    
    // Sort by hook score and return top 15-20
    return hooks
      .sort((a, b) => b.hook_score - a.hook_score)
      .slice(0, Math.min(20, request.user_plan === 'premium' ? 20 : request.user_plan === 'pro' ? 15 : 10));
  }

  /**
   * Generate hooks for a specific hook type
   */
  private generateHooksByType(hookType: HookType, request: HookSynthRequest): Hook[] {
    const hooks: Hook[] = [];
    const templates = this.getHookTemplates(hookType, request);
    
    templates.forEach(template => {
      const hook = this.createHookFromTemplate(template, hookType, request);
      if (hook) hooks.push(hook);
    });
    
    return hooks;
  }

  /**
   * Get hook templates based on type and request
   */
  private getHookTemplates(hookType: HookType, request: HookSynthRequest): string[] {
    const category = request.category.toLowerCase();
    const persona = request.persona.toLowerCase();
    
    const templates = {
      question: [
        `${category} kullanırken bu hatayı yapıyor musun?`,
        `Neden ${category} ile istediğin sonucu alamıyorsun?`,
        `${category}'de en büyük yanılgı nedir biliyor musun?`,
        `Bu ${category} hilesi neden kimse söylemiyor?`
      ],
      bold_claim: [
        `${category} hakkında bildiğin her şey yanlış!`,
        `30 günde ${category} ile hayatın değişecek`,
        `${category}'nin gizli formülünü çözdüm`,
        `Bu ${category} yöntemi %90 daha etkili`
      ],
      curiosity_gap: [
        `${category} uzmanları bunu söylemiyor ama...`,
        `${category}'de gizli kalan gerçek şu:`,
        `Bu ${category} sırrını öğrenince şaşıracaksın`,
        `${category} dünyasının en karanlık sırrı`
      ],
      pattern_interrupt: [
        `Dur! ${category} seçiminde büyük hata yapıyorsun`,
        `Stop! Bu ${category} hilesi illegal olmalı`,
        `Bekle... ${category} böyle kullanılmaz!`,
        `Yanlış! ${category} için doğru yöntem bu`
      ],
      fomo: [
        `Son 24 saatte ${category} trendi patladı`,
        `Bu ${category} fırsatı kaçırma - sadece bugün!`,
        `${category} dünyası değişiyor, geride kalma`,
        `Herkes ${category} için bunu yapıyor, sen neden yapmıyorsun?`
      ],
      challenge: [
        `7 günde ${category} ustası olabilir misin?`,
        `${category} challenge: Sonuçlar inanılmaz!`,
        `30 gün ${category} denemesi - şok sonuçlar`,
        `${category} ile kendini test et - sonuçlar şaşırtıcı`
      ],
      authority: [
        `${category} uzmanı olarak söylüyorum:`,
        `10 yıllık ${category} tecrübemle keşfettim ki`,
        `${category} sektöründe 15 yıl çalıştım, gerçek şu:`,
        `${category} konusunda binlerce kişiye danışmanlık verdim`
      ],
      contrarian: [
        `${category} hakkında herkes yanılıyor`,
        `Popüler ${category} tavsiyesi tam bir saçmalık`,
        `${category} trendleri seni kandırıyor`,
        `${category} 'uzmanları' yalan söylüyor`
      ]
    };

    return templates[hookType] || [];
  }

  /**
   * Create a hook from template with visual plan and scoring
   */
  private createHookFromTemplate(template: string, hookType: HookType, request: HookSynthRequest): Hook | null {
    // Calculate duration (Turkish text ~2.5 chars per second for comfortable reading)
    const duration = Math.min(9, Math.max(3, template.length / 15));
    
    if (duration > 9) return null; // Skip if too long
    
    // Generate visual plan
    const visualPlan = this.generateVisualPlan(hookType, template, duration, request);
    
    // Generate variants
    const variants = this.generateVariants(template, request);
    
    // Calculate hook score
    const metrics = this.calculateHookMetrics(hookType, template, request);
    const hookScore = this.calculateHookScore(metrics);
    
    // Generate reasons for score
    const reasons = this.generateScoreReasons(hookType, metrics, template);
    
    return {
      type: hookType,
      text: template,
      duration_sec: Math.round(duration * 10) / 10,
      visual_plan: visualPlan,
      variants,
      hook_score: Math.round(hookScore * 10) / 10,
      reasons
    };
  }

  /**
   * Generate visual plan with timecodes
   */
  private generateVisualPlan(hookType: HookType, text: string, duration: number, request: HookSynthRequest): VisualPlan[] {
    const plans: VisualPlan[] = [];
    const category = request.category;
    
    // Opening shot (0-2s)
    plans.push({
      t: "0.0",
      shot: this.getOpeningShot(hookType, request.tone),
      overlay: this.getOpeningOverlay(hookType),
      sfx: this.getOpeningSFX(hookType)
    });
    
    // Mid hook (2-5s) 
    if (duration > 4) {
      plans.push({
        t: (duration * 0.3).toFixed(1),
        shot: this.getMidShot(hookType, category),
        overlay: this.getMidOverlay(hookType, text),
        sfx: this.getMidSFX(hookType)
      });
    }
    
    // Closing/transition (5-9s)
    plans.push({
      t: (duration * 0.7).toFixed(1),
      shot: this.getClosingShot(hookType, category),
      overlay: this.getClosingOverlay(hookType),
      sfx: this.getClosingSFX(hookType)
    });
    
    return plans;
  }

  /**
   * Calculate hook metrics for scoring
   */
  private calculateHookMetrics(hookType: HookType, text: string, request: HookSynthRequest): HookMetrics {
    // Retention prediction based on hook type and content
    const retentionFactors = {
      question: 0.75,
      bold_claim: 0.70,
      curiosity_gap: 0.80,
      pattern_interrupt: 0.85,
      fomo: 0.65,
      challenge: 0.70,
      authority: 0.60,
      contrarian: 0.75
    };
    
    // Click prediction based on tone and goal alignment
    const toneFactors = {
      energetic: 0.80,
      analytical: 0.65,
      casual: 0.75,
      authoritative: 0.70,
      friendly: 0.72
    };
    
    // Novelty based on uniqueness patterns
    const hasNumbers = /\d/.test(text);
    const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text);
    const hasQuestion = text.includes('?');
    const hasExclamation = text.includes('!');
    
    const novelty = Math.min(1, 
      (hasNumbers ? 0.2 : 0) + 
      (hasEmoji ? 0.1 : 0) + 
      (hasQuestion ? 0.3 : 0) + 
      (hasExclamation ? 0.2 : 0) + 
      Math.random() * 0.3
    );
    
    // Persona fit based on language and complexity
    const wordCount = text.split(' ').length;
    const complexityScore = wordCount > 12 ? 0.6 : wordCount < 6 ? 0.7 : 0.8;
    const personaFit = complexityScore * (request.persona.includes('beginner') ? 0.9 : 0.8);
    
    return {
      retention_pred: retentionFactors[hookType] + Math.random() * 0.15 - 0.075,
      click_pred: toneFactors[request.tone] + Math.random() * 0.15 - 0.075,
      novelty: Math.min(1, novelty),
      persona_fit: Math.min(1, personaFit)
    };
  }

  /**
   * Calculate final hook score
   * HookScore (0–100) = 0.45 * retention_pred + 0.25 * click_pred + 0.20 * novelty + 0.10 * persona_fit
   */
  private calculateHookScore(metrics: HookMetrics): number {
    return 100 * (
      0.45 * metrics.retention_pred +
      0.25 * metrics.click_pred +
      0.20 * metrics.novelty +
      0.10 * metrics.persona_fit
    );
  }

  /**
   * Generate score reasoning
   */
  private generateScoreReasons(hookType: HookType, metrics: HookMetrics, text: string): string[] {
    const reasons: string[] = [];
    
    if (metrics.retention_pred > 0.75) {
      reasons.push(`Güçlü ${hookType} yapısı ile yüksek retention`);
    }
    
    if (metrics.click_pred > 0.70) {
      reasons.push('Tıklanma oranını artıran ton ve yapı');
    }
    
    if (metrics.novelty > 0.6) {
      reasons.push('Yenilikçi yaklaşım ve merak uyandırma');
    }
    
    if (text.length < 50) {
      reasons.push('Optimal uzunluk - 9 saniye altı');
    }
    
    if (text.includes('?') || text.includes('!')) {
      reasons.push('Duygusal bağlantı ve merak unsuru');
    }
    
    return reasons.slice(0, 3); // Max 3 reason
  }

  /**
   * Generate hook variants
   */
  private generateVariants(template: string, request: HookSynthRequest): string[] {
    const variants: string[] = [];
    const category = request.category;
    
    // Create 2-3 variants by modifying the template
    if (template.includes('?')) {
      variants.push(template.replace('?', ' - işte cevabı!'));
    }
    
    if (template.includes(category)) {
      variants.push(template.replace(category, `${category} dünyası`));
      variants.push(template.replace(category, `${category} sektörü`));
    }
    
    return variants.slice(0, 3);
  }

  /**
   * Generate A/B test pack with titles and thumbnails
   */
  private generateABTestPack(hooks: Hook[], request: HookSynthRequest): ABTestPack {
    const topHooks = hooks.slice(0, 3);
    
    const titles = topHooks.map(hook => {
      // Convert hook to title format
      let title = hook.text.replace(/[?!]/g, '');
      if (title.length > 60) {
        title = title.substring(0, 57) + '...';
      }
      return title;
    });
    
    const thumbnailPrompts = topHooks.map(hook => {
      const category = request.category;
      
      if (hook.type === 'pattern_interrupt') {
        return `Bold STOP text overlay / surprised face expression / ${category} visual in background`;
      } else if (hook.type === 'question') {
        return `Question mark overlay / confused/curious expression / ${category} split-screen comparison`;
      } else if (hook.type === 'bold_claim') {
        return `Large bold text: key claim / confident expression / ${category} transformation visual`;
      } else {
        return `Eye-catching ${hook.type} visual / expressive face / ${category} related imagery`;
      }
    });
    
    return {
      titles,
      thumbnail_prompts: thumbnailPrompts
    };
  }

  // Visual plan helper methods
  private getOpeningShot(hookType: HookType, tone: VideoTone): string {
    const shots = {
      pattern_interrupt: 'Extreme close-up of hand making STOP gesture',
      question: 'Face cam with confused/questioning expression',
      bold_claim: 'Confident face cam with slight lean forward',
      curiosity_gap: 'Mysterious lighting, partial face reveal',
      fomo: 'Fast-paced montage of trending visuals',
      challenge: 'Dynamic action shot or preparation scene',
      authority: 'Professional setup, credentials visible',
      contrarian: 'Skeptical expression, arms crossed'
    };
    
    return shots[hookType] || 'Face cam with engaging expression';
  }

  private getOpeningOverlay(hookType: HookType): string {
    const overlays = {
      pattern_interrupt: 'STOP',
      question: '?',
      bold_claim: 'GERÇEK',
      curiosity_gap: '...',
      fomo: 'SON DAKİKA',
      challenge: 'CHALLENGE',
      authority: 'UZMAN',
      contrarian: 'YANLIŞ'
    };
    
    return overlays[hookType] || '';
  }

  private getOpeningSFX(hookType: HookType): string {
    const sfx = {
      pattern_interrupt: 'record scratch',
      question: 'curious ping',
      bold_claim: 'impact hit',
      curiosity_gap: 'mysterious drone',
      fomo: 'urgent beep',
      challenge: 'game start',
      authority: 'professional chime',
      contrarian: 'error sound'
    };
    
    return sfx[hookType] || 'subtle whoosh';
  }

  private getMidShot(hookType: HookType, category: string): string {
    return `${category} related B-roll or screen recording`;
  }

  private getMidOverlay(hookType: HookType, text: string): string {
    const words = text.split(' ');
    const keyWord = words.find(word => word.length > 4) || words[0];
    return keyWord.toUpperCase();
  }

  private getMidSFX(hookType: HookType): string {
    return 'transition swoosh';
  }

  private getClosingShot(hookType: HookType, category: string): string {
    return `${category} solution preview or result teaser`;
  }

  private getClosingOverlay(hookType: HookType): string {
    return 'İZLEMEYE DEVAM ET';
  }

  private getClosingSFX(hookType: HookType): string {
    return 'anticipation rise';
  }
}

export const youtubeHookSynthService = new YouTubeHookSynthService();
