// Idea Classification Utility
export interface IdeaClassification {
  primaryCategory: string;
  businessModel: string;
  targetMarket: string;
  complexity: string;
  industryContext: string;
  keyTerms: string[];
}

export interface IndustryContext {
  regulations: string[];
  keyMetrics: string[];
  competitors: string[];
  trends: string[];
  challenges: string[];
}

// Industry-specific contexts
export const industryContexts: Record<string, IndustryContext> = {
  'SaaS': {
    regulations: ['GDPR', 'SOC2', 'Data Privacy'],
    keyMetrics: ['MRR', 'Churn Rate', 'CAC', 'LTV'],
    competitors: ['Salesforce', 'HubSpot', 'Slack', 'Notion'],
    trends: ['AI Integration', 'No-Code', 'API-First', 'Vertical SaaS'],
    challenges: ['Customer Acquisition', 'Churn', 'Feature Bloat', 'Pricing']
  },
  'FinTech': {
    regulations: ['PCI DSS', 'KYC', 'AML', 'Banking License'],
    keyMetrics: ['Transaction Volume', 'AUM', 'Fraud Rate', 'Compliance Score'],
    competitors: ['Stripe', 'Square', 'PayPal', 'Plaid', 'Robinhood'],
    trends: ['Open Banking', 'DeFi', 'BNPL', 'Embedded Finance', 'Crypto'],
    challenges: ['Regulatory Compliance', 'Security', 'Trust', 'Banking Partnerships']
  },
  'E-commerce': {
    regulations: ['Consumer Protection', 'Tax Compliance', 'Product Safety'],
    keyMetrics: ['GMV', 'AOV', 'Conversion Rate', 'Customer Acquisition Cost'],
    competitors: ['Amazon', 'Shopify', 'WooCommerce', 'BigCommerce'],
    trends: ['Social Commerce', 'D2C', 'Sustainability', 'AR/VR Shopping'],
    challenges: ['Customer Acquisition', 'Logistics', 'Inventory', 'Competition']
  },
  'HealthTech': {
    regulations: ['HIPAA', 'FDA', 'CE Marking', 'Clinical Trials'],
    keyMetrics: ['Patient Outcomes', 'Clinical Efficacy', 'Safety Score', 'Adoption Rate'],
    competitors: ['Epic', 'Cerner', 'Teladoc', 'Veracyte', 'Dexcom'],
    trends: ['Telemedicine', 'AI Diagnostics', 'Wearables', 'Precision Medicine'],
    challenges: ['Regulatory Approval', 'Clinical Validation', 'Privacy', 'Integration']
  },
  'EdTech': {
    regulations: ['FERPA', 'COPPA', 'Accessibility Standards'],
    keyMetrics: ['Student Engagement', 'Learning Outcomes', 'Retention Rate', 'Course Completion'],
    competitors: ['Coursera', 'Udemy', 'Khan Academy', 'Duolingo'],
    trends: ['Personalized Learning', 'Microlearning', 'VR/AR Education', 'Skills-Based Learning'],
    challenges: ['User Engagement', 'Content Quality', 'Monetization', 'Institutional Sales']
  },
  'Marketplace': {
    regulations: ['Platform Liability', 'Payment Processing', 'Consumer Protection'],
    keyMetrics: ['GMV', 'Take Rate', 'Liquidity', 'Network Effects'],
    competitors: ['Uber', 'Airbnb', 'Upwork', 'Etsy', 'DoorDash'],
    trends: ['Vertical Marketplaces', 'Creator Economy', 'B2B Marketplaces', 'Sustainability'],
    challenges: ['Chicken-Egg Problem', 'Trust & Safety', 'Unit Economics', 'Disintermediation']
  }
};

// Quick classification based on keywords
export const classifyIdea = (idea: string): IdeaClassification => {
  const lowerIdea = idea.toLowerCase();
  
  // Category detection patterns
  const categoryPatterns = {
    'SaaS': ['saas', 'software', 'platform', 'dashboard', 'analytics', 'crm', 'automation', 'workflow', 'api'],
    'FinTech': ['payment', 'banking', 'finance', 'money', 'investment', 'trading', 'crypto', 'wallet', 'loan'],
    'E-commerce': ['ecommerce', 'e-commerce', 'shop', 'store', 'marketplace', 'retail', 'product', 'selling'],
    'HealthTech': ['health', 'medical', 'healthcare', 'patient', 'doctor', 'clinic', 'diagnosis', 'therapy'],
    'EdTech': ['education', 'learning', 'course', 'student', 'teacher', 'school', 'training', 'skill'],
    'Marketplace': ['marketplace', 'connect', 'freelancer', 'gig', 'peer-to-peer', 'sharing', 'platform']
  };

  // Business model patterns
  const businessModelPatterns = {
    'B2B': ['business', 'enterprise', 'company', 'organization', 'corporate', 'team'],
    'B2C': ['consumer', 'user', 'customer', 'individual', 'personal', 'people'],
    'Marketplace': ['marketplace', 'connect', 'platform', 'peer-to-peer', 'two-sided'],
    'Subscription': ['subscription', 'monthly', 'recurring', 'saas', 'membership'],
    'Transaction': ['transaction', 'commission', 'fee', 'payment', 'per-use']
  };

  // Target market patterns
  const targetMarketPatterns = {
    'SMB': ['small business', 'smb', 'startup', 'entrepreneur', 'freelancer'],
    'Enterprise': ['enterprise', 'large company', 'corporation', 'fortune'],
    'Consumer': ['consumer', 'individual', 'personal', 'everyday', 'people'],
    'Developer': ['developer', 'programmer', 'api', 'code', 'technical'],
    'Creator': ['creator', 'artist', 'influencer', 'content', 'creative']
  };

  // Detect primary category
  let primaryCategory = 'Other';
  let maxScore = 0;
  
  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    const score = keywords.filter(keyword => lowerIdea.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      primaryCategory = category;
    }
  }

  // Detect business model
  let businessModel = 'B2C';
  maxScore = 0;
  
  for (const [model, keywords] of Object.entries(businessModelPatterns)) {
    const score = keywords.filter(keyword => lowerIdea.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      businessModel = model;
    }
  }

  // Detect target market
  let targetMarket = 'Consumer';
  maxScore = 0;
  
  for (const [market, keywords] of Object.entries(targetMarketPatterns)) {
    const score = keywords.filter(keyword => lowerIdea.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      targetMarket = market;
    }
  }

  // Determine complexity based on category and keywords
  const complexityIndicators = {
    'high': ['ai', 'machine learning', 'blockchain', 'hardware', 'iot', 'robotics'],
    'medium': ['integration', 'api', 'real-time', 'mobile app', 'web app'],
    'low': ['website', 'blog', 'simple', 'basic', 'landing page']
  };

  let complexity = 'Medium';
  for (const [level, keywords] of Object.entries(complexityIndicators)) {
    if (keywords.some(keyword => lowerIdea.includes(keyword))) {
      complexity = level.charAt(0).toUpperCase() + level.slice(1);
      break;
    }
  }

  // Extract key terms for context
  const keyTerms = idea.split(' ')
    .filter(word => word.length > 3)
    .slice(0, 5);

  return {
    primaryCategory,
    businessModel,
    targetMarket,
    complexity,
    industryContext: primaryCategory,
    keyTerms
  };
};

// Get industry-specific context
export const getIndustryContext = (category: string): IndustryContext => {
  return industryContexts[category] || {
    regulations: ['General Business Law'],
    keyMetrics: ['Revenue', 'Growth Rate', 'Customer Satisfaction'],
    competitors: ['Market Leaders'],
    trends: ['Digital Transformation', 'Remote Work'],
    challenges: ['Customer Acquisition', 'Competition', 'Scaling']
  };
};