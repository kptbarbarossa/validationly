import { IndustryCategory, IndustryFramework } from '../types.js';

/**
 * Industry-specific analysis frameworks and configurations
 * Based on requirements 2.2 and 11.1 for industry-specific analysis
 */

export const INDUSTRY_FRAMEWORKS: Record<IndustryCategory, IndustryFramework> = {
  [IndustryCategory.SAAS_TECH]: {
    category: IndustryCategory.SAAS_TECH,
    scoringWeights: {
      marketSize: 0.20,
      competition: 0.25,
      technical: 0.30,
      monetization: 0.15,
      timing: 0.10
    },
    specificConsiderations: [
      'Developer community adoption and feedback',
      'API design and integration complexity',
      'Scalability and infrastructure requirements',
      'Subscription model viability',
      'Technical differentiation from existing solutions'
    ],
    regulatoryFactors: [
      'Data privacy regulations (GDPR, CCPA)',
      'Security compliance requirements',
      'Industry-specific regulations for target customers',
      'International data transfer restrictions'
    ],
    keyMetrics: [
      'Monthly Recurring Revenue (MRR)',
      'Customer Acquisition Cost (CAC)',
      'Lifetime Value (LTV)',
      'Churn Rate',
      'Product-Market Fit Score',
      'Net Promoter Score (NPS)'
    ],
    successPatterns: [
      'Strong developer experience and documentation',
      'Clear value proposition for technical buyers',
      'Freemium or trial-based adoption model',
      'Community-driven growth and feedback loops',
      'Integration ecosystem and partnerships'
    ],
    commonChallenges: [
      'High technical complexity and development costs',
      'Long sales cycles for enterprise customers',
      'Intense competition from established players',
      'Need for continuous feature development',
      'Scaling infrastructure costs'
    ],
    typicalTimelines: {
      mvp: '3-6 months',
      marketEntry: '6-12 months',
      profitability: '18-36 months'
    }
  },

  [IndustryCategory.ECOMMERCE]: {
    category: IndustryCategory.ECOMMERCE,
    scoringWeights: {
      marketSize: 0.30,
      competition: 0.25,
      technical: 0.15,
      monetization: 0.20,
      timing: 0.10
    },
    specificConsiderations: [
      'Market size and customer demand validation',
      'Supply chain and inventory management',
      'Payment processing and security',
      'Customer acquisition and retention strategies',
      'Mobile commerce optimization'
    ],
    regulatoryFactors: [
      'Consumer protection laws',
      'Tax compliance across jurisdictions',
      'Product safety and liability regulations',
      'Advertising and marketing compliance',
      'International trade regulations'
    ],
    keyMetrics: [
      'Conversion Rate',
      'Average Order Value (AOV)',
      'Customer Lifetime Value (CLV)',
      'Return on Ad Spend (ROAS)',
      'Cart Abandonment Rate',
      'Inventory Turnover'
    ],
    successPatterns: [
      'Strong brand identity and customer loyalty',
      'Efficient supply chain and fulfillment',
      'Data-driven marketing and personalization',
      'Mobile-first customer experience',
      'Strategic partnerships and marketplace presence'
    ],
    commonChallenges: [
      'High customer acquisition costs',
      'Inventory management and cash flow',
      'Intense price competition',
      'Logistics and fulfillment complexity',
      'Seasonal demand fluctuations'
    ],
    typicalTimelines: {
      mvp: '2-4 months',
      marketEntry: '4-8 months',
      profitability: '12-24 months'
    }
  },

  [IndustryCategory.HEALTH_FITNESS]: {
    category: IndustryCategory.HEALTH_FITNESS,
    scoringWeights: {
      marketSize: 0.25,
      competition: 0.20,
      technical: 0.15,
      monetization: 0.20,
      timing: 0.20
    },
    specificConsiderations: [
      'Health claims and medical accuracy',
      'User safety and liability concerns',
      'Integration with health devices and platforms',
      'Behavior change and user engagement',
      'Professional endorsements and credibility'
    ],
    regulatoryFactors: [
      'FDA regulations for health claims',
      'HIPAA compliance for health data',
      'Medical device regulations if applicable',
      'Professional licensing requirements',
      'International health data regulations'
    ],
    keyMetrics: [
      'User Engagement Rate',
      'Health Outcome Improvements',
      'Retention Rate',
      'Net Promoter Score (NPS)',
      'Professional Adoption Rate',
      'Compliance Rate'
    ],
    successPatterns: [
      'Evidence-based approach with clinical validation',
      'Strong user engagement and habit formation',
      'Professional healthcare partnerships',
      'Personalized user experience',
      'Community support and social features'
    ],
    commonChallenges: [
      'Regulatory compliance and liability risks',
      'User motivation and long-term engagement',
      'Competition from established health brands',
      'Need for clinical validation and research',
      'Insurance and reimbursement complexities'
    ],
    typicalTimelines: {
      mvp: '4-8 months',
      marketEntry: '8-15 months',
      profitability: '24-48 months'
    }
  },

  [IndustryCategory.EDUCATION]: {
    category: IndustryCategory.EDUCATION,
    scoringWeights: {
      marketSize: 0.25,
      competition: 0.20,
      technical: 0.20,
      monetization: 0.15,
      timing: 0.20
    },
    specificConsiderations: [
      'Learning effectiveness and outcomes',
      'Accessibility and inclusive design',
      'Age-appropriate content and safety',
      'Teacher and institutional adoption',
      'Integration with existing educational systems'
    ],
    regulatoryFactors: [
      'COPPA compliance for children under 13',
      'FERPA compliance for student data',
      'Accessibility requirements (Section 508, WCAG)',
      'State and local education regulations',
      'International education privacy laws'
    ],
    keyMetrics: [
      'Learning Outcomes',
      'Student Engagement Rate',
      'Course Completion Rate',
      'Teacher Adoption Rate',
      'Knowledge Retention Rate',
      'Time to Competency'
    ],
    successPatterns: [
      'Proven learning effectiveness with measurable outcomes',
      'Strong teacher and administrator support',
      'Scalable content delivery and assessment',
      'Integration with existing educational workflows',
      'Community and peer learning features'
    ],
    commonChallenges: [
      'Long sales cycles with educational institutions',
      'Budget constraints in education sector',
      'Resistance to change in traditional education',
      'Need for extensive content development',
      'Seasonal demand patterns'
    ],
    typicalTimelines: {
      mvp: '4-6 months',
      marketEntry: '8-12 months',
      profitability: '18-36 months'
    }
  },

  [IndustryCategory.FINTECH]: {
    category: IndustryCategory.FINTECH,
    scoringWeights: {
      marketSize: 0.20,
      competition: 0.25,
      technical: 0.25,
      monetization: 0.20,
      timing: 0.10
    },
    specificConsiderations: [
      'Financial regulations and compliance',
      'Security and fraud prevention',
      'Integration with banking systems',
      'User trust and credibility',
      'Scalability of financial operations'
    ],
    regulatoryFactors: [
      'Banking regulations and licensing',
      'Anti-money laundering (AML) compliance',
      'Know Your Customer (KYC) requirements',
      'PCI DSS compliance for payments',
      'International financial regulations'
    ],
    keyMetrics: [
      'Transaction Volume',
      'Revenue per User',
      'Fraud Rate',
      'Compliance Score',
      'User Trust Score',
      'Regulatory Approval Timeline'
    ],
    successPatterns: [
      'Strong regulatory compliance and partnerships',
      'Robust security and fraud prevention',
      'Clear value proposition over traditional finance',
      'Strategic partnerships with financial institutions',
      'User education and trust building'
    ],
    commonChallenges: [
      'Complex regulatory environment',
      'High security and compliance costs',
      'User trust and adoption barriers',
      'Competition from established financial institutions',
      'Capital requirements for financial services'
    ],
    typicalTimelines: {
      mvp: '6-12 months',
      marketEntry: '12-24 months',
      profitability: '24-48 months'
    }
  },

  [IndustryCategory.MARKETPLACE]: {
    category: IndustryCategory.MARKETPLACE,
    scoringWeights: {
      marketSize: 0.30,
      competition: 0.25,
      technical: 0.15,
      monetization: 0.20,
      timing: 0.10
    },
    specificConsiderations: [
      'Network effects and two-sided market dynamics',
      'Trust and safety mechanisms',
      'Payment processing and escrow services',
      'Quality control and curation',
      'Geographic expansion strategies'
    ],
    regulatoryFactors: [
      'Platform liability and content moderation',
      'Consumer protection regulations',
      'Tax collection and reporting requirements',
      'International trade and customs',
      'Data protection and privacy laws'
    ],
    keyMetrics: [
      'Gross Merchandise Value (GMV)',
      'Take Rate',
      'Active Buyers and Sellers',
      'Transaction Success Rate',
      'Trust and Safety Score',
      'Network Density'
    ],
    successPatterns: [
      'Strong network effects and liquidity',
      'Effective trust and safety systems',
      'Clear value proposition for both sides',
      'Efficient matching and discovery',
      'Community building and engagement'
    ],
    commonChallenges: [
      'Chicken-and-egg problem for initial growth',
      'Trust and safety at scale',
      'Competition from established marketplaces',
      'Complex multi-sided business model',
      'International expansion complexity'
    ],
    typicalTimelines: {
      mvp: '3-6 months',
      marketEntry: '6-12 months',
      profitability: '18-36 months'
    }
  },

  [IndustryCategory.CONSUMER_APP]: {
    category: IndustryCategory.CONSUMER_APP,
    scoringWeights: {
      marketSize: 0.25,
      competition: 0.30,
      technical: 0.15,
      monetization: 0.15,
      timing: 0.15
    },
    specificConsiderations: [
      'User acquisition and viral growth',
      'App store optimization and discovery',
      'User engagement and retention',
      'Monetization strategy effectiveness',
      'Platform-specific design and features'
    ],
    regulatoryFactors: [
      'App store policies and guidelines',
      'Privacy regulations for user data',
      'Content moderation requirements',
      'In-app purchase regulations',
      'Age-appropriate content restrictions'
    ],
    keyMetrics: [
      'Daily/Monthly Active Users (DAU/MAU)',
      'User Retention Rate',
      'App Store Rating',
      'Viral Coefficient',
      'Average Revenue Per User (ARPU)',
      'Session Length and Frequency'
    ],
    successPatterns: [
      'Strong user engagement and habit formation',
      'Viral growth mechanisms',
      'Excellent user experience and design',
      'Effective app store optimization',
      'Community features and social sharing'
    ],
    commonChallenges: [
      'High user acquisition costs',
      'Intense competition for attention',
      'App store discovery challenges',
      'Monetization without hurting user experience',
      'Platform dependency and policy changes'
    ],
    typicalTimelines: {
      mvp: '2-4 months',
      marketEntry: '4-8 months',
      profitability: '12-24 months'
    }
  },

  [IndustryCategory.B2B_SERVICES]: {
    category: IndustryCategory.B2B_SERVICES,
    scoringWeights: {
      marketSize: 0.25,
      competition: 0.20,
      technical: 0.15,
      monetization: 0.25,
      timing: 0.15
    },
    specificConsiderations: [
      'Enterprise sales process and decision-making',
      'Service delivery scalability',
      'Client relationship management',
      'Industry expertise and credibility',
      'Integration with client workflows'
    ],
    regulatoryFactors: [
      'Industry-specific compliance requirements',
      'Professional licensing and certifications',
      'Data security and confidentiality',
      'Contract and liability considerations',
      'International business regulations'
    ],
    keyMetrics: [
      'Annual Recurring Revenue (ARR)',
      'Client Retention Rate',
      'Average Contract Value',
      'Sales Cycle Length',
      'Client Satisfaction Score',
      'Utilization Rate'
    ],
    successPatterns: [
      'Deep industry expertise and specialization',
      'Strong client relationships and references',
      'Scalable service delivery model',
      'Clear ROI demonstration for clients',
      'Strategic partnerships and alliances'
    ],
    commonChallenges: [
      'Long sales cycles and complex decision-making',
      'Scaling service delivery while maintaining quality',
      'Competition from established consulting firms',
      'Client dependency and concentration risk',
      'Talent acquisition and retention'
    ],
    typicalTimelines: {
      mvp: '2-4 months',
      marketEntry: '4-8 months',
      profitability: '12-18 months'
    }
  },

  [IndustryCategory.HARDWARE]: {
    category: IndustryCategory.HARDWARE,
    scoringWeights: {
      marketSize: 0.20,
      competition: 0.20,
      technical: 0.35,
      monetization: 0.15,
      timing: 0.10
    },
    specificConsiderations: [
      'Manufacturing and supply chain complexity',
      'Product design and engineering requirements',
      'Quality control and testing processes',
      'Inventory management and working capital',
      'Distribution and retail partnerships'
    ],
    regulatoryFactors: [
      'Product safety and certification requirements',
      'Environmental and sustainability regulations',
      'Import/export and customs regulations',
      'Intellectual property and patent considerations',
      'Industry-specific standards and compliance'
    ],
    keyMetrics: [
      'Gross Margin',
      'Manufacturing Cost',
      'Quality Score',
      'Time to Market',
      'Inventory Turnover',
      'Return Rate'
    ],
    successPatterns: [
      'Strong product design and engineering',
      'Efficient manufacturing and supply chain',
      'Clear differentiation and value proposition',
      'Strategic retail and distribution partnerships',
      'Effective quality control and testing'
    ],
    commonChallenges: [
      'High upfront development and tooling costs',
      'Complex manufacturing and supply chain',
      'Long product development cycles',
      'Inventory risk and working capital requirements',
      'Competition from established manufacturers'
    ],
    typicalTimelines: {
      mvp: '6-12 months',
      marketEntry: '12-24 months',
      profitability: '24-48 months'
    }
  },

  [IndustryCategory.CONTENT_MEDIA]: {
    category: IndustryCategory.CONTENT_MEDIA,
    scoringWeights: {
      marketSize: 0.25,
      competition: 0.25,
      technical: 0.15,
      monetization: 0.20,
      timing: 0.15
    },
    specificConsiderations: [
      'Content creation and curation strategies',
      'Audience development and engagement',
      'Monetization model effectiveness',
      'Content distribution and platform strategy',
      'Creator economy and talent management'
    ],
    regulatoryFactors: [
      'Copyright and intellectual property laws',
      'Content moderation and platform policies',
      'Advertising and sponsorship regulations',
      'Privacy regulations for user data',
      'International content distribution rights'
    ],
    keyMetrics: [
      'Content Engagement Rate',
      'Audience Growth Rate',
      'Revenue per Content Piece',
      'Creator Retention Rate',
      'Content Production Cost',
      'Platform Distribution Success'
    ],
    successPatterns: [
      'High-quality, engaging content creation',
      'Strong audience community and loyalty',
      'Diversified monetization strategies',
      'Effective content distribution across platforms',
      'Creator partnership and talent development'
    ],
    commonChallenges: [
      'Content creation costs and scalability',
      'Audience attention and competition',
      'Platform dependency and algorithm changes',
      'Monetization challenges and revenue volatility',
      'Creator talent acquisition and retention'
    ],
    typicalTimelines: {
      mvp: '2-4 months',
      marketEntry: '4-8 months',
      profitability: '12-24 months'
    }
  }
};

/**
 * Get industry framework by category
 */
export function getIndustryFramework(category: IndustryCategory): IndustryFramework {
  return INDUSTRY_FRAMEWORKS[category];
}

/**
 * Get all available industry categories
 */
export function getAllIndustryCategories(): IndustryCategory[] {
  return Object.values(IndustryCategory);
}

/**
 * Get industry-specific scoring weights
 */
export function getIndustryScoringWeights(category: IndustryCategory): Record<string, number> {
  return INDUSTRY_FRAMEWORKS[category].scoringWeights;
}

/**
 * Get industry-specific considerations for analysis
 */
export function getIndustryConsiderations(category: IndustryCategory): {
  considerations: string[];
  regulatoryFactors: string[];
  keyMetrics: string[];
  successPatterns: string[];
  commonChallenges: string[];
} {
  const framework = INDUSTRY_FRAMEWORKS[category];
  return {
    considerations: framework.specificConsiderations,
    regulatoryFactors: framework.regulatoryFactors,
    keyMetrics: framework.keyMetrics,
    successPatterns: framework.successPatterns,
    commonChallenges: framework.commonChallenges
  };
}