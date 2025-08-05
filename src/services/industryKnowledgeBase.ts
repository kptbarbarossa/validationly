import { IndustryCategory, IndustryFramework } from '../types.js';
import { INDUSTRY_FRAMEWORKS, getIndustryFramework } from './industryFrameworks.js';

/**
 * Enhanced Industry Knowledge Base
 * Provides comprehensive industry-specific analysis frameworks, scoring weights, and considerations
 * Requirements: 2.2, 2.3 - Industry-specific analysis and recommendations
 */

export interface IndustryKnowledgeEntry {
  framework: IndustryFramework;
  marketInsights: {
    averageMarketSize: string;
    growthRate: string;
    competitionLevel: 'Low' | 'Medium' | 'High';
    barrierToEntry: 'Low' | 'Medium' | 'High';
    capitalRequirements: 'Low' | 'Medium' | 'High';
  };
  customerProfiles: {
    primaryCustomers: string[];
    decisionMakers: string[];
    buyingProcess: string;
    averageSalescycle: string;
  };
  competitiveLandscape: {
    majorPlayers: string[];
    competitiveFactors: string[];
    differentiationOpportunities: string[];
  };
  technologyFactors: {
    keyTechnologies: string[];
    emergingTrends: string[];
    technicalComplexity: 'Low' | 'Medium' | 'High';
    developmentTimeline: string;
  };
  businessModelPatterns: {
    commonModels: string[];
    revenueStreams: string[];
    pricingStrategies: string[];
    scalabilityFactors: string[];
  };
  riskFactors: {
    primaryRisks: string[];
    mitigationStrategies: string[];
    regulatoryRisks: string[];
    marketRisks: string[];
  };
}

/**
 * Comprehensive Industry Knowledge Base
 * Contains detailed analysis frameworks for each industry category
 */
export const INDUSTRY_KNOWLEDGE_BASE: Record<IndustryCategory, IndustryKnowledgeEntry> = {
  [IndustryCategory.SAAS_TECH]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.SAAS_TECH],
    marketInsights: {
      averageMarketSize: '$100B+ globally',
      growthRate: '15-25% annually',
      competitionLevel: 'High',
      barrierToEntry: 'Medium',
      capitalRequirements: 'Medium'
    },
    customerProfiles: {
      primaryCustomers: ['SMBs', 'Enterprise', 'Developers', 'IT Teams'],
      decisionMakers: ['CTO', 'IT Director', 'Engineering Manager', 'CEO'],
      buyingProcess: 'Trial → Pilot → Department → Enterprise',
      averageSalesycle: '3-12 months'
    },
    competitiveLandscape: {
      majorPlayers: ['Salesforce', 'Microsoft', 'Google', 'AWS', 'Atlassian'],
      competitiveFactors: ['Feature completeness', 'Integration capabilities', 'Pricing', 'Developer experience'],
      differentiationOpportunities: ['Niche specialization', 'Superior UX', 'Better integrations', 'Industry-specific features']
    },
    technologyFactors: {
      keyTechnologies: ['Cloud infrastructure', 'APIs', 'Microservices', 'AI/ML', 'Security'],
      emergingTrends: ['AI integration', 'No-code/Low-code', 'Edge computing', 'Serverless'],
      technicalComplexity: 'High',
      developmentTimeline: '6-18 months'
    },
    businessModelPatterns: {
      commonModels: ['Subscription', 'Freemium', 'Usage-based', 'Tiered pricing'],
      revenueStreams: ['Monthly subscriptions', 'Annual contracts', 'Professional services', 'Marketplace fees'],
      pricingStrategies: ['Per-user pricing', 'Feature-based tiers', 'Usage-based', 'Enterprise custom'],
      scalabilityFactors: ['Self-service onboarding', 'API-first architecture', 'Automated billing', 'Multi-tenancy']
    },
    riskFactors: {
      primaryRisks: ['Technical complexity', 'Competition', 'Customer churn', 'Security breaches'],
      mitigationStrategies: ['MVP approach', 'Strong security', 'Customer success programs', 'Continuous innovation'],
      regulatoryRisks: ['Data privacy', 'Security compliance', 'Industry regulations'],
      marketRisks: ['Market saturation', 'Economic downturns', 'Technology shifts']
    }
  },

  [IndustryCategory.ECOMMERCE]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.ECOMMERCE],
    marketInsights: {
      averageMarketSize: '$5T+ globally',
      growthRate: '10-15% annually',
      competitionLevel: 'High',
      barrierToEntry: 'Low',
      capitalRequirements: 'Medium'
    },
    customerProfiles: {
      primaryCustomers: ['Consumers', 'B2B buyers', 'Retailers', 'Brands'],
      decisionMakers: ['Individual consumers', 'Procurement teams', 'Category managers'],
      buyingProcess: 'Discovery → Comparison → Purchase → Fulfillment',
      averageSalesycle: 'Minutes to days'
    },
    competitiveLandscape: {
      majorPlayers: ['Amazon', 'Shopify', 'Alibaba', 'eBay', 'Walmart'],
      competitiveFactors: ['Price', 'Selection', 'Convenience', 'Shipping speed', 'Customer service'],
      differentiationOpportunities: ['Niche products', 'Superior experience', 'Faster delivery', 'Better curation']
    },
    technologyFactors: {
      keyTechnologies: ['E-commerce platforms', 'Payment processing', 'Inventory management', 'Analytics'],
      emergingTrends: ['Social commerce', 'AR/VR shopping', 'Voice commerce', 'Sustainability'],
      technicalComplexity: 'Medium',
      developmentTimeline: '3-9 months'
    },
    businessModelPatterns: {
      commonModels: ['Direct sales', 'Marketplace', 'Dropshipping', 'Subscription boxes'],
      revenueStreams: ['Product sales', 'Commission fees', 'Advertising', 'Fulfillment services'],
      pricingStrategies: ['Competitive pricing', 'Premium positioning', 'Dynamic pricing', 'Bundle deals'],
      scalabilityFactors: ['Automated fulfillment', 'Marketplace model', 'Drop shipping', 'International expansion']
    },
    riskFactors: {
      primaryRisks: ['Inventory management', 'Customer acquisition costs', 'Returns/refunds', 'Competition'],
      mitigationStrategies: ['Demand forecasting', 'Diversified marketing', 'Clear return policies', 'Brand building'],
      regulatoryRisks: ['Consumer protection', 'Tax compliance', 'Product liability'],
      marketRisks: ['Economic downturns', 'Seasonal fluctuations', 'Supply chain disruptions']
    }
  },

  [IndustryCategory.HEALTH_FITNESS]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.HEALTH_FITNESS],
    marketInsights: {
      averageMarketSize: '$500B+ globally',
      growthRate: '8-12% annually',
      competitionLevel: 'Medium',
      barrierToEntry: 'High',
      capitalRequirements: 'High'
    },
    customerProfiles: {
      primaryCustomers: ['Patients', 'Healthcare providers', 'Fitness enthusiasts', 'Employers'],
      decisionMakers: ['Doctors', 'Health administrators', 'Insurance companies', 'Individuals'],
      buyingProcess: 'Research → Consultation → Trial → Adoption',
      averageSalesycle: '6-18 months'
    },
    competitiveLandscape: {
      majorPlayers: ['Teladoc', 'Peloton', 'MyFitnessPal', 'Fitbit', 'Epic Systems'],
      competitiveFactors: ['Clinical efficacy', 'User engagement', 'Integration', 'Compliance'],
      differentiationOpportunities: ['Specialized conditions', 'Better outcomes', 'Easier compliance', 'AI-driven insights']
    },
    technologyFactors: {
      keyTechnologies: ['Wearables', 'Telemedicine', 'AI/ML', 'IoT devices', 'EHR integration'],
      emergingTrends: ['Digital therapeutics', 'Personalized medicine', 'Mental health tech', 'Remote monitoring'],
      technicalComplexity: 'High',
      developmentTimeline: '12-36 months'
    },
    businessModelPatterns: {
      commonModels: ['Subscription', 'B2B2C', 'Insurance reimbursement', 'Direct pay'],
      revenueStreams: ['Monthly subscriptions', 'Per-session fees', 'Insurance billing', 'Corporate contracts'],
      pricingStrategies: ['Insurance-based', 'Subscription tiers', 'Pay-per-use', 'Corporate packages'],
      scalabilityFactors: ['Digital delivery', 'AI automation', 'Provider networks', 'Insurance partnerships']
    },
    riskFactors: {
      primaryRisks: ['Regulatory compliance', 'Clinical validation', 'User safety', 'Data privacy'],
      mitigationStrategies: ['Clinical trials', 'Regulatory expertise', 'Safety protocols', 'Privacy by design'],
      regulatoryRisks: ['FDA approval', 'HIPAA compliance', 'Medical device regulations'],
      marketRisks: ['Reimbursement changes', 'Clinical evidence requirements', 'Liability concerns']
    }
  },

  [IndustryCategory.EDUCATION]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.EDUCATION],
    marketInsights: {
      averageMarketSize: '$300B+ globally',
      growthRate: '5-10% annually',
      competitionLevel: 'Medium',
      barrierToEntry: 'Medium',
      capitalRequirements: 'Medium'
    },
    customerProfiles: {
      primaryCustomers: ['Students', 'Teachers', 'Schools', 'Corporations', 'Parents'],
      decisionMakers: ['Administrators', 'Teachers', 'IT directors', 'Training managers'],
      buyingProcess: 'Evaluation → Pilot → Procurement → Implementation',
      averageSalesycle: '6-18 months'
    },
    competitiveLandscape: {
      majorPlayers: ['Coursera', 'Khan Academy', 'Blackboard', 'Google Classroom', 'Udemy'],
      competitiveFactors: ['Content quality', 'Learning outcomes', 'Ease of use', 'Integration'],
      differentiationOpportunities: ['Specialized subjects', 'Better engagement', 'Outcome tracking', 'Accessibility']
    },
    technologyFactors: {
      keyTechnologies: ['LMS platforms', 'Video streaming', 'Interactive content', 'Analytics', 'Mobile apps'],
      emergingTrends: ['AI tutoring', 'VR/AR learning', 'Microlearning', 'Adaptive learning'],
      technicalComplexity: 'Medium',
      developmentTimeline: '6-18 months'
    },
    businessModelPatterns: {
      commonModels: ['Subscription', 'Course sales', 'Institutional licensing', 'Freemium'],
      revenueStreams: ['Course fees', 'Subscription revenue', 'Institutional contracts', 'Certification fees'],
      pricingStrategies: ['Per-student pricing', 'Institutional licenses', 'Course bundles', 'Freemium tiers'],
      scalabilityFactors: ['Digital content', 'Automated grading', 'Self-paced learning', 'Global distribution']
    },
    riskFactors: {
      primaryRisks: ['Content quality', 'Student engagement', 'Technology adoption', 'Budget constraints'],
      mitigationStrategies: ['Expert content creators', 'Engagement features', 'Training programs', 'ROI demonstration'],
      regulatoryRisks: ['Student privacy', 'Accessibility compliance', 'Accreditation requirements'],
      marketRisks: ['Budget cuts', 'Technology resistance', 'Competition from free resources']
    }
  },

  [IndustryCategory.FINTECH]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.FINTECH],
    marketInsights: {
      averageMarketSize: '$200B+ globally',
      growthRate: '20-30% annually',
      competitionLevel: 'High',
      barrierToEntry: 'High',
      capitalRequirements: 'High'
    },
    customerProfiles: {
      primaryCustomers: ['Consumers', 'SMBs', 'Enterprises', 'Financial institutions'],
      decisionMakers: ['CFOs', 'Treasurers', 'Individual consumers', 'Compliance officers'],
      buyingProcess: 'Research → Compliance review → Pilot → Implementation',
      averageSalesycle: '6-24 months'
    },
    competitiveLandscape: {
      majorPlayers: ['PayPal', 'Square', 'Stripe', 'Robinhood', 'Plaid'],
      competitiveFactors: ['Security', 'Compliance', 'User experience', 'Integration', 'Cost'],
      differentiationOpportunities: ['Niche markets', 'Better UX', 'Lower costs', 'Specialized compliance']
    },
    technologyFactors: {
      keyTechnologies: ['Blockchain', 'AI/ML', 'APIs', 'Mobile apps', 'Cloud infrastructure'],
      emergingTrends: ['DeFi', 'Open banking', 'Embedded finance', 'Digital currencies'],
      technicalComplexity: 'High',
      developmentTimeline: '12-36 months'
    },
    businessModelPatterns: {
      commonModels: ['Transaction fees', 'Subscription', 'Interest/lending', 'Asset management'],
      revenueStreams: ['Payment processing fees', 'Interest income', 'Subscription fees', 'Trading commissions'],
      pricingStrategies: ['Transaction-based', 'Flat fees', 'Percentage-based', 'Tiered pricing'],
      scalabilityFactors: ['API-first design', 'Automated compliance', 'Partner integrations', 'Global expansion']
    },
    riskFactors: {
      primaryRisks: ['Regulatory compliance', 'Security breaches', 'Fraud', 'Capital requirements'],
      mitigationStrategies: ['Regulatory expertise', 'Security investment', 'Fraud detection', 'Capital planning'],
      regulatoryRisks: ['Banking regulations', 'AML/KYC', 'Consumer protection', 'International compliance'],
      marketRisks: ['Regulatory changes', 'Economic downturns', 'Competition from banks']
    }
  },

  [IndustryCategory.MARKETPLACE]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.MARKETPLACE],
    marketInsights: {
      averageMarketSize: '$2T+ globally',
      growthRate: '15-25% annually',
      competitionLevel: 'High',
      barrierToEntry: 'Medium',
      capitalRequirements: 'High'
    },
    customerProfiles: {
      primaryCustomers: ['Buyers', 'Sellers', 'Service providers', 'Consumers'],
      decisionMakers: ['Individual users', 'Business owners', 'Procurement teams'],
      buyingProcess: 'Discovery → Matching → Transaction → Fulfillment',
      averageSalesycle: 'Minutes to weeks'
    },
    competitiveLandscape: {
      majorPlayers: ['Amazon', 'Uber', 'Airbnb', 'Upwork', 'Etsy'],
      competitiveFactors: ['Network effects', 'Trust & safety', 'User experience', 'Commission rates'],
      differentiationOpportunities: ['Niche focus', 'Better matching', 'Lower fees', 'Superior experience']
    },
    technologyFactors: {
      keyTechnologies: ['Matching algorithms', 'Payment processing', 'Mobile apps', 'Analytics', 'AI/ML'],
      emergingTrends: ['AI-powered matching', 'Blockchain verification', 'Social commerce', 'Voice interfaces'],
      technicalComplexity: 'High',
      developmentTimeline: '9-24 months'
    },
    businessModelPatterns: {
      commonModels: ['Commission-based', 'Subscription', 'Listing fees', 'Advertising revenue'],
      revenueStreams: ['Transaction fees', 'Subscription revenue', 'Advertising fees', 'Premium services'],
      pricingStrategies: ['Percentage commission', 'Flat fees', 'Freemium', 'Success-based'],
      scalabilityFactors: ['Network effects', 'Automated matching', 'Self-service tools', 'Global expansion']
    },
    riskFactors: {
      primaryRisks: ['Chicken-and-egg problem', 'Trust & safety', 'Disintermediation', 'Competition'],
      mitigationStrategies: ['Focused launch', 'Safety systems', 'Value-added services', 'Network effects'],
      regulatoryRisks: ['Platform liability', 'Worker classification', 'Consumer protection'],
      marketRisks: ['Network effects failure', 'Competitive pressure', 'Economic sensitivity']
    }
  },

  [IndustryCategory.CONSUMER_APP]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.CONSUMER_APP],
    marketInsights: {
      averageMarketSize: '$200B+ globally',
      growthRate: '10-20% annually',
      competitionLevel: 'High',
      barrierToEntry: 'Low',
      capitalRequirements: 'Low'
    },
    customerProfiles: {
      primaryCustomers: ['Individual consumers', 'Families', 'Young adults', 'Professionals'],
      decisionMakers: ['Individual users', 'Parents', 'Influencers'],
      buyingProcess: 'Discovery → Download → Trial → Purchase/Subscribe',
      averageSalesycle: 'Minutes to days'
    },
    competitiveLandscape: {
      majorPlayers: ['Meta', 'TikTok', 'Snapchat', 'Spotify', 'Netflix'],
      competitiveFactors: ['User engagement', 'Viral features', 'Content quality', 'Social features'],
      differentiationOpportunities: ['Unique features', 'Niche audiences', 'Better UX', 'Community building']
    },
    technologyFactors: {
      keyTechnologies: ['Mobile development', 'Cloud backend', 'Push notifications', 'Analytics', 'AI/ML'],
      emergingTrends: ['AR filters', 'AI personalization', 'Voice interfaces', 'Wearable integration'],
      technicalComplexity: 'Medium',
      developmentTimeline: '3-12 months'
    },
    businessModelPatterns: {
      commonModels: ['Freemium', 'Advertising', 'In-app purchases', 'Subscription'],
      revenueStreams: ['Ad revenue', 'Premium subscriptions', 'In-app purchases', 'Sponsored content'],
      pricingStrategies: ['Free with ads', 'Premium tiers', 'One-time purchase', 'Subscription'],
      scalabilityFactors: ['Viral growth', 'User-generated content', 'Social sharing', 'Global distribution']
    },
    riskFactors: {
      primaryRisks: ['User acquisition', 'Retention', 'Platform dependency', 'Competition'],
      mitigationStrategies: ['Viral features', 'Engagement optimization', 'Multi-platform', 'Unique value'],
      regulatoryRisks: ['App store policies', 'Privacy regulations', 'Content moderation'],
      marketRisks: ['Attention competition', 'Platform changes', 'Trend shifts']
    }
  },

  [IndustryCategory.B2B_SERVICES]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.B2B_SERVICES],
    marketInsights: {
      averageMarketSize: '$1T+ globally',
      growthRate: '5-15% annually',
      competitionLevel: 'Medium',
      barrierToEntry: 'Medium',
      capitalRequirements: 'Low'
    },
    customerProfiles: {
      primaryCustomers: ['SMBs', 'Enterprises', 'Startups', 'Government'],
      decisionMakers: ['CEOs', 'Department heads', 'Procurement teams', 'Consultants'],
      buyingProcess: 'Problem identification → Vendor research → Proposal → Contract',
      averageSalesycle: '3-18 months'
    },
    competitiveLandscape: {
      majorPlayers: ['Accenture', 'Deloitte', 'McKinsey', 'IBM Services', 'Local agencies'],
      competitiveFactors: ['Expertise', 'Track record', 'Relationships', 'Pricing', 'Delivery quality'],
      differentiationOpportunities: ['Specialization', 'Better outcomes', 'Innovative approaches', 'Technology integration']
    },
    technologyFactors: {
      keyTechnologies: ['CRM systems', 'Project management', 'Communication tools', 'Analytics', 'Automation'],
      emergingTrends: ['AI-assisted services', 'Remote delivery', 'Outcome-based pricing', 'Platform models'],
      technicalComplexity: 'Low',
      developmentTimeline: '1-6 months'
    },
    businessModelPatterns: {
      commonModels: ['Hourly billing', 'Project-based', 'Retainer', 'Outcome-based'],
      revenueStreams: ['Professional services', 'Retainer fees', 'Success fees', 'Training revenue'],
      pricingStrategies: ['Hourly rates', 'Fixed project fees', 'Value-based pricing', 'Subscription retainers'],
      scalabilityFactors: ['Standardized processes', 'Junior staff leverage', 'Technology tools', 'Partner networks']
    },
    riskFactors: {
      primaryRisks: ['Client concentration', 'Talent retention', 'Project overruns', 'Economic sensitivity'],
      mitigationStrategies: ['Client diversification', 'Strong culture', 'Project management', 'Recurring revenue'],
      regulatoryRisks: ['Professional licensing', 'Industry regulations', 'Contract compliance'],
      marketRisks: ['Economic downturns', 'Client budget cuts', 'Competitive pressure']
    }
  },

  [IndustryCategory.HARDWARE]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.HARDWARE],
    marketInsights: {
      averageMarketSize: '$3T+ globally',
      growthRate: '3-8% annually',
      competitionLevel: 'High',
      barrierToEntry: 'High',
      capitalRequirements: 'High'
    },
    customerProfiles: {
      primaryCustomers: ['Consumers', 'Businesses', 'OEMs', 'Distributors'],
      decisionMakers: ['Procurement teams', 'Engineers', 'IT directors', 'Individual consumers'],
      buyingProcess: 'Specification → Evaluation → Testing → Purchase → Integration',
      averageSalesycle: '6-24 months'
    },
    competitiveLandscape: {
      majorPlayers: ['Apple', 'Samsung', 'Intel', 'NVIDIA', 'Qualcomm'],
      competitiveFactors: ['Performance', 'Cost', 'Reliability', 'Innovation', 'Supply chain'],
      differentiationOpportunities: ['Specialized applications', 'Better performance', 'Lower cost', 'Unique features']
    },
    technologyFactors: {
      keyTechnologies: ['Semiconductors', 'IoT', 'AI chips', 'Sensors', 'Manufacturing'],
      emergingTrends: ['Edge computing', 'AI acceleration', 'Sustainable materials', '5G integration'],
      technicalComplexity: 'High',
      developmentTimeline: '18-48 months'
    },
    businessModelPatterns: {
      commonModels: ['Direct sales', 'OEM partnerships', 'Licensing', 'Subscription hardware'],
      revenueStreams: ['Product sales', 'Licensing fees', 'Support services', 'Subscription revenue'],
      pricingStrategies: ['Cost-plus pricing', 'Value-based pricing', 'Competitive pricing', 'Volume discounts'],
      scalabilityFactors: ['Manufacturing partnerships', 'Design reuse', 'Platform approaches', 'Global distribution']
    },
    riskFactors: {
      primaryRisks: ['Development costs', 'Manufacturing complexity', 'Supply chain', 'Technology obsolescence'],
      mitigationStrategies: ['Phased development', 'Supply chain diversity', 'Technology roadmaps', 'Market validation'],
      regulatoryRisks: ['Safety certifications', 'Environmental regulations', 'Export controls'],
      marketRisks: ['Technology shifts', 'Economic cycles', 'Component shortages']
    }
  },

  [IndustryCategory.CONTENT_MEDIA]: {
    framework: INDUSTRY_FRAMEWORKS[IndustryCategory.CONTENT_MEDIA],
    marketInsights: {
      averageMarketSize: '$500B+ globally',
      growthRate: '5-15% annually',
      competitionLevel: 'High',
      barrierToEntry: 'Low',
      capitalRequirements: 'Medium'
    },
    customerProfiles: {
      primaryCustomers: ['Consumers', 'Advertisers', 'Creators', 'Businesses'],
      decisionMakers: ['Content managers', 'Marketing directors', 'Individual consumers', 'Media buyers'],
      buyingProcess: 'Discovery → Consumption → Engagement → Subscription/Purchase',
      averageSalesycle: 'Minutes to months'
    },
    competitiveLandscape: {
      majorPlayers: ['Netflix', 'YouTube', 'Disney', 'Spotify', 'TikTok'],
      competitiveFactors: ['Content quality', 'Distribution', 'User experience', 'Creator tools'],
      differentiationOpportunities: ['Niche content', 'Better creator tools', 'Unique formats', 'Community features']
    },
    technologyFactors: {
      keyTechnologies: ['Content management', 'Streaming', 'Recommendation engines', 'Creator tools', 'Analytics'],
      emergingTrends: ['AI content generation', 'Interactive content', 'Virtual production', 'Blockchain rights'],
      technicalComplexity: 'Medium',
      developmentTimeline: '6-18 months'
    },
    businessModelPatterns: {
      commonModels: ['Subscription', 'Advertising', 'Creator revenue sharing', 'Premium content'],
      revenueStreams: ['Subscription fees', 'Advertising revenue', 'Content licensing', 'Creator tools'],
      pricingStrategies: ['Subscription tiers', 'Ad-supported free', 'Pay-per-content', 'Creator revenue share'],
      scalabilityFactors: ['User-generated content', 'Automated curation', 'Global distribution', 'Creator economy']
    },
    riskFactors: {
      primaryRisks: ['Content costs', 'Creator retention', 'Platform competition', 'Copyright issues'],
      mitigationStrategies: ['Diverse content', 'Creator programs', 'Unique features', 'Rights management'],
      regulatoryRisks: ['Copyright compliance', 'Content moderation', 'Creator rights'],
      marketRisks: ['Attention competition', 'Economic sensitivity', 'Platform changes']
    }
  }
};

/**
 * Industry Knowledge Base Service
 * Provides comprehensive industry-specific insights and analysis frameworks
 */
export class IndustryKnowledgeBaseService {
  /**
   * Get comprehensive industry knowledge for a specific category
   */
  getIndustryKnowledge(category: IndustryCategory): IndustryKnowledgeEntry {
    return INDUSTRY_KNOWLEDGE_BASE[category];
  }

  /**
   * Get industry-specific scoring weights for dimensional analysis
   */
  getIndustryScoringWeights(category: IndustryCategory): Record<string, number> {
    return INDUSTRY_KNOWLEDGE_BASE[category].framework.scoringWeights;
  }

  /**
   * Get industry-specific considerations for analysis
   */
  getIndustryConsiderations(category: IndustryCategory): {
    specificConsiderations: string[];
    regulatoryFactors: string[];
    keyMetrics: string[];
    successPatterns: string[];
    commonChallenges: string[];
  } {
    const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
    return {
      specificConsiderations: knowledge.framework.specificConsiderations,
      regulatoryFactors: knowledge.framework.regulatoryFactors,
      keyMetrics: knowledge.framework.keyMetrics,
      successPatterns: knowledge.framework.successPatterns,
      commonChallenges: knowledge.framework.commonChallenges
    };
  }

  /**
   * Get market insights for industry analysis
   */
  getMarketInsights(category: IndustryCategory): {
    marketSize: string;
    growthRate: string;
    competitionLevel: string;
    barrierToEntry: string;
    capitalRequirements: string;
  } {
    const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
    return {
      marketSize: knowledge.marketInsights.averageMarketSize,
      growthRate: knowledge.marketInsights.growthRate,
      competitionLevel: knowledge.marketInsights.competitionLevel,
      barrierToEntry: knowledge.marketInsights.barrierToEntry,
      capitalRequirements: knowledge.marketInsights.capitalRequirements
    };
  }

  /**
   * Get competitive landscape information
   */
  getCompetitiveLandscape(category: IndustryCategory): {
    majorPlayers: string[];
    competitiveFactors: string[];
    differentiationOpportunities: string[];
  } {
    const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
    return knowledge.competitiveLandscape;
  }

  /**
   * Get business model patterns for the industry
   */
  getBusinessModelPatterns(category: IndustryCategory): {
    commonModels: string[];
    revenueStreams: string[];
    pricingStrategies: string[];
    scalabilityFactors: string[];
  } {
    const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
    return knowledge.businessModelPatterns;
  }

  /**
   * Get risk factors and mitigation strategies
   */
  getRiskFactors(category: IndustryCategory): {
    primaryRisks: string[];
    mitigationStrategies: string[];
    regulatoryRisks: string[];
    marketRisks: string[];
  } {
    const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
    return knowledge.riskFactors;
  }

  /**
   * Get technology factors for the industry
   */
  getTechnologyFactors(category: IndustryCategory): {
    keyTechnologies: string[];
    emergingTrends: string[];
    technicalComplexity: string;
    developmentTimeline: string;
  } {
    const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
    return knowledge.technologyFactors;
  }

  /**
   * Get customer profile information
   */
  getCustomerProfiles(category: IndustryCategory): {
    primaryCustomers: string[];
    decisionMakers: string[];
    buyingProcess: string;
    averageSalesycle: string;
  } {
    const knowledge = INDUSTRY_KNOWLEDGE_BASE[category];
    return knowledge.customerProfiles;
  }

  /**
   * Generate industry-specific analysis context for AI prompts
   */
  generateAnalysisContext(category: IndustryCategory): string {
    const knowledge = this.getIndustryKnowledge(category);
    
    return `
Industry Context for ${category}:

Market Overview:
- Market Size: ${knowledge.marketInsights.averageMarketSize}
- Growth Rate: ${knowledge.marketInsights.growthRate}
- Competition Level: ${knowledge.marketInsights.competitionLevel}
- Barrier to Entry: ${knowledge.marketInsights.barrierToEntry}

Key Success Factors:
${knowledge.framework.successPatterns.map(pattern => `- ${pattern}`).join('\n')}

Common Challenges:
${knowledge.framework.commonChallenges.map(challenge => `- ${challenge}`).join('\n')}

Regulatory Considerations:
${knowledge.framework.regulatoryFactors.map(factor => `- ${factor}`).join('\n')}

Technology Factors:
- Technical Complexity: ${knowledge.technologyFactors.technicalComplexity}
- Development Timeline: ${knowledge.technologyFactors.developmentTimeline}
- Key Technologies: ${knowledge.technologyFactors.keyTechnologies.join(', ')}

Business Model Patterns:
- Common Models: ${knowledge.businessModelPatterns.commonModels.join(', ')}
- Revenue Streams: ${knowledge.businessModelPatterns.revenueStreams.join(', ')}
`;
  }

  /**
   * Compare industries for analysis
   */
  compareIndustries(categories: IndustryCategory[]): {
    comparison: Record<IndustryCategory, {
      competitionLevel: string;
      barrierToEntry: string;
      capitalRequirements: string;
      technicalComplexity: string;
    }>;
    recommendations: string[];
  } {
    const comparison: Record<IndustryCategory, any> = {};
    
    categories.forEach(category => {
      const knowledge = this.getIndustryKnowledge(category);
      comparison[category] = {
        competitionLevel: knowledge.marketInsights.competitionLevel,
        barrierToEntry: knowledge.marketInsights.barrierToEntry,
        capitalRequirements: knowledge.marketInsights.capitalRequirements,
        technicalComplexity: knowledge.technologyFactors.technicalComplexity
      };
    });

    const recommendations = [
      'Consider market entry barriers when choosing between industries',
      'Evaluate capital requirements against available resources',
      'Assess technical complexity relative to team capabilities',
      'Factor in competition levels for market positioning strategy'
    ];

    return { comparison, recommendations };
  }
}

// Export singleton instance
export const industryKnowledgeBaseService = new IndustryKnowledgeBaseService();