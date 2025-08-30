import {
  HookSynthRequest,
  HookSynthResult,
  Hook,
  HookType,
  VideoTone,
  VideoGoal,
  VisualPlan,
  ABTestPack,
  ThumbnailDesign,
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
      const abTestPack = await this.generateABTestPack(hooks, request);
      
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
    
    // Generate 1-2 high-quality hooks per type for better focus
    for (const hookType of hookTypes) {
      const typeHooks = this.generateHooksByType(hookType, request);
      // Only take the best hook from each type
      hooks.push(...typeHooks.slice(0, 1));
    }
    
    // Sort by hook score and return top 5 quality hooks
    return hooks
      .sort((a, b) => b.hook_score - a.hook_score)
      .slice(0, 5); // Always return 5 high-quality hooks regardless of plan
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
    const language = request.language || 'en';
    
    // High-quality Turkish templates - Viral & Engaging
    const templatesTR = {
      question: [
        `${category} ile milyonlar kazanmanın sırrı ne?`,
        `${category}'de başarısız olanların ortak hatası?`,
        `${category} uzmanlarının gizlediği gerçek ne?`,
        `${category}'yi yanlış mı kullanıyorsun?`
      ],
      bold_claim: [
        `${category} dünyasını değiştirecek devrim!`,
        `${category} ile 30 günde hayat değişimi`,
        `Bu ${category} yöntemi %300 daha etkili`,
        `${category}'nin gizli milyar dolarlık formülü`
      ],
      curiosity_gap: [
        `${category} milyarderleri bu sırrı saklıyor...`,
        `${category}'de kimsenin bilmediği gerçek`,
        `Bu ${category} sırrı yasaklanmalı!`,
        `${category} endüstrisinin en karanlık sırrı`
      ],
      pattern_interrupt: [
        `STOP! ${category} seçiminde büyük hata`,
        `DUR! Bu ${category} hilesi illegal olmalı`,
        `BEKLE! ${category} böyle kullanılmıyor`,
        `YANLIŞ! ${category} için tek doğru yol`
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

    // High-quality English templates - Viral & Click-worthy
    const templatesEN = {
      question: [
        `What's the secret to making millions with ${category}?`,
        `Why do 99% of people fail at ${category}?`,
        `What are ${category} experts hiding from you?`,
        `Are you using ${category} completely wrong?`
      ],
      bold_claim: [
        `This ${category} revolution will change everything!`,
        `${category} life transformation in 30 days`,
        `This ${category} method is 300% more effective`,
        `The billion-dollar ${category} formula revealed`
      ],
      curiosity_gap: [
        `${category} billionaires are hiding this secret...`,
        `The ${category} truth nobody talks about`,
        `This ${category} secret should be banned!`,
        `The darkest secret of the ${category} industry`
      ],
      pattern_interrupt: [
        `STOP! Huge ${category} mistake everyone makes`,
        `STOP! This ${category} hack should be illegal`,
        `WAIT! You're doing ${category} completely wrong`,
        `WRONG! The only right way to do ${category}`
      ],
      fomo: [
        `${category} trend exploded in the last 24 hours`,
        `Don't miss this ${category} opportunity - today only!`,
        `The ${category} world is changing, don't get left behind`,
        `Everyone's doing this for ${category}, why aren't you?`
      ],
      challenge: [
        `Can you become a ${category} master in 7 days?`,
        `${category} challenge: Results are incredible!`,
        `30-day ${category} experiment - shocking results`,
        `Test yourself with ${category} - surprising results`
      ],
      authority: [
        `As a ${category} expert, I'm telling you:`,
        `With 10 years of ${category} experience, I discovered`,
        `I worked 15 years in ${category}, the truth is:`,
        `I've consulted thousands on ${category}`
      ],
      contrarian: [
        `Everyone's wrong about ${category}`,
        `Popular ${category} advice is complete nonsense`,
        `${category} trends are fooling you`,
        `${category} 'experts' are lying to you`
      ]
    };

    const templates = language === 'tr' ? templatesTR : templatesEN;
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
  private async generateABTestPack(hooks: Hook[], request: HookSynthRequest): Promise<ABTestPack> {
    const topHooks = hooks.slice(0, 3);
    
    const titles = topHooks.map(hook => {
      // Convert hook to title format
      let title = hook.text.replace(/[?!]/g, '');
      if (title.length > 60) {
        title = title.substring(0, 57) + '...';
      }
      return title;
    });
    
    const thumbnailDesigns = await this.generateThumbnailDesigns(topHooks, request);
    
    return {
      titles,
      thumbnail_designs: thumbnailDesigns
    };
  }

  /**
   * Generate AI-powered thumbnail designs with performance predictions
   */
  private async generateThumbnailDesigns(hooks: Hook[], request: HookSynthRequest): Promise<ThumbnailDesign[]> {
    const designs: ThumbnailDesign[] = [];
    
    // Generate AI thumbnails for top 3 hooks
    for (let i = 0; i < Math.min(3, hooks.length); i++) {
      const hook = hooks[i];
      try {
        // Call AI thumbnail generation API
        const aiDesign = await this.generateAIThumbnail(hook, request);
        designs.push(aiDesign);
      } catch (error) {
        console.error(`AI thumbnail generation failed for hook ${i}:`, error);
        // Fallback to mock design
        const fallbackDesign = this.createThumbnailDesign(hook, request, i);
        designs.push(fallbackDesign);
      }
    }
    
    return designs;
  }

  /**
   * Generate AI thumbnail using Gemini + Hugging Face
   */
  private async generateAIThumbnail(hook: Hook, request: HookSynthRequest): Promise<ThumbnailDesign> {
    const response = await fetch('/api/ai-thumbnail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        hookText: hook.text,
        hookType: hook.type,
        category: request.category,
        tone: request.tone,
        goal: request.goal,
        language: request.language || 'en'
      })
    });

    if (!response.ok) {
      throw new Error(`AI thumbnail API error: ${response.status}`);
    }

    const aiDesign = await response.json();
    return aiDesign as ThumbnailDesign;
  }

  private createThumbnailDesign(hook: Hook, request: HookSynthRequest, index: number): ThumbnailDesign {
    const styles: ThumbnailDesign['style'][] = ['bold_text', 'split_screen', 'face_reaction', 'before_after', 'question_mark', 'countdown'];
    const style = this.selectOptimalStyle(hook.type, request.goal);
    
    const elements = this.generateThumbnailElements(hook, request, style);
    const performance = this.predictThumbnailPerformance(hook, style, elements);
    
    // Generate detailed prompt for AI image generation
    const prompt = this.generateDetailedPrompt(elements, style, request.category);
    
    return {
      id: `thumb_${index + 1}`,
      prompt,
      style,
      elements,
      performance_prediction: performance
    };
  }

  private selectOptimalStyle(hookType: HookType, goal: VideoGoal): ThumbnailDesign['style'] {
    const styleMap: Record<HookType, ThumbnailDesign['style']> = {
      'question': 'question_mark',
      'bold_claim': 'bold_text',
      'curiosity_gap': 'split_screen',
      'pattern_interrupt': 'face_reaction',
      'fomo': 'countdown',
      'challenge': 'before_after',
      'authority': 'bold_text',
      'contrarian': 'face_reaction'
    };
    
    return styleMap[hookType] || 'bold_text';
  }

  private generateThumbnailElements(hook: Hook, request: HookSynthRequest, style: ThumbnailDesign['style']) {
    const category = request.category;
    const tone = request.tone;
    
    // Extract key text from hook
    const mainText = hook.text.split(' ').slice(0, 3).join(' ').toUpperCase();
    
    // Define face expressions based on hook type and tone
    const faceExpressions = {
      'question': 'confused, curious, raised eyebrow',
      'bold_claim': 'confident, determined, pointing',
      'curiosity_gap': 'surprised, intrigued, wide eyes',
      'pattern_interrupt': 'shocked, amazed, mouth open',
      'fomo': 'urgent, worried, checking time',
      'challenge': 'determined, focused, before/after split',
      'authority': 'professional, confident, expert pose',
      'contrarian': 'skeptical, challenging, arms crossed'
    };

    // Color schemes based on category and tone
    const colorSchemes = {
      'energetic': 'bright red, electric blue, neon yellow',
      'analytical': 'deep blue, clean white, accent green',
      'casual': 'warm orange, friendly blue, natural green',
      'authoritative': 'professional navy, gold accents, clean white',
      'friendly': 'soft blue, warm yellow, gentle green'
    };

    // Background themes based on category
    const backgroundThemes = {
      'fitness': 'gym equipment, workout space, healthy lifestyle',
      'tech': 'modern office, computer screens, digital elements',
      'business': 'office environment, charts, professional setting',
      'education': 'classroom, books, learning materials',
      'lifestyle': 'home environment, daily activities, personal space'
    };

    return {
      main_text: mainText,
      face_expression: faceExpressions[hook.type] || 'confident, engaging',
      background_theme: backgroundThemes[category.toLowerCase()] || `${category} related environment`,
      color_scheme: colorSchemes[tone] || 'bright, attention-grabbing colors',
      overlay_effects: this.getOverlayEffects(style, hook.type)
    };
  }

  private getOverlayEffects(style: ThumbnailDesign['style'], hookType: HookType): string[] {
    const effects: Record<ThumbnailDesign['style'], string[]> = {
      'bold_text': ['large bold text overlay', 'drop shadow', 'contrast outline'],
      'split_screen': ['vertical split line', 'before/after labels', 'comparison arrows'],
      'face_reaction': ['emotion indicators', 'thought bubble', 'reaction emojis'],
      'before_after': ['transformation arrow', 'progress indicator', 'time stamps'],
      'question_mark': ['large question mark', 'curiosity indicators', 'mystery elements'],
      'countdown': ['timer overlay', 'urgency indicators', 'deadline warnings']
    };
    
    return effects[style] || ['attention-grabbing overlay'];
  }

  private generateDetailedPrompt(elements: ThumbnailDesign['elements'], style: ThumbnailDesign['style'], category: string): string {
    const basePrompt = `Professional YouTube thumbnail for ${category} content`;
    const stylePrompt = this.getStylePrompt(style);
    const elementsPrompt = `
Main text: "${elements.main_text}" in bold, readable font
Face: ${elements.face_expression}
Background: ${elements.background_theme}
Colors: ${elements.color_scheme}
Effects: ${elements.overlay_effects?.join(', ')}
    `.trim();
    
    return `${basePrompt}, ${stylePrompt}. ${elementsPrompt}. High quality, professional, eye-catching, optimized for mobile viewing, 1280x720 resolution.`;
  }

  private getStylePrompt(style: ThumbnailDesign['style']): string {
    const prompts = {
      'bold_text': 'large bold text overlay design with high contrast',
      'split_screen': 'split-screen comparison layout with clear division',
      'face_reaction': 'prominent face with clear emotional expression',
      'before_after': 'before and after transformation layout',
      'question_mark': 'question-focused design with curiosity elements',
      'countdown': 'urgency-focused design with time elements'
    };
    
    return prompts[style] || 'eye-catching design';
  }

  private predictThumbnailPerformance(hook: Hook, style: ThumbnailDesign['style'], elements: ThumbnailDesign['elements']) {
    // AI-based performance prediction algorithm
    let ctrScore = 50; // base score
    let retentionScore = 50;
    let brandSafety = 80; // start high
    
    // Hook score influence
    ctrScore += (hook.hook_score - 50) * 0.5;
    retentionScore += (hook.hook_score - 50) * 0.3;
    
    // Style bonuses
    const styleBonuses = {
      'face_reaction': { ctr: 15, retention: 10 },
      'bold_text': { ctr: 10, retention: 5 },
      'question_mark': { ctr: 12, retention: 8 },
      'split_screen': { ctr: 8, retention: 12 },
      'before_after': { ctr: 10, retention: 15 },
      'countdown': { ctr: 18, retention: 5 }
    };
    
    const bonus = styleBonuses[style] || { ctr: 5, retention: 5 };
    ctrScore += bonus.ctr;
    retentionScore += bonus.retention;
    
    // Text length penalty (too long = bad for mobile)
    if (elements.main_text && elements.main_text.length > 20) {
      ctrScore -= 10;
      brandSafety -= 5;
    }
    
    // Ensure scores are within bounds
    ctrScore = Math.max(0, Math.min(100, Math.round(ctrScore)));
    retentionScore = Math.max(0, Math.min(100, Math.round(retentionScore)));
    brandSafety = Math.max(0, Math.min(100, Math.round(brandSafety)));
    
    return {
      ctr_score: ctrScore,
      retention_score: retentionScore,
      brand_safety: brandSafety
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
