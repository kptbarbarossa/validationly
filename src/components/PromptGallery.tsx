import React, { useMemo, useState } from 'react';

export interface PromptGalleryProps {
	open: boolean;
	onClose: () => void;
	onUse: (text: string) => void;
}

type PromptTemplate = {
	id: string;
	category: string;
	title: string;
	description: string;
	content: string;
	tags: string[];
};

const TEMPLATES: PromptTemplate[] = [
    // === SIMPLE & QUICK PROMPTS ===
    { 
        id: 'simple-1', 
        category: 'Simple', 
        title: 'Market Demand', 
        description: 'Evaluate market demand for your idea', 
        content: 'Evaluate the market demand for this idea and give a score from 0-100', 
        tags: ['simple', 'score'] 
    },
    { 
        id: 'simple-2', 
        category: 'Simple', 
        title: 'Target Customer', 
        description: 'Define target customer segment', 
        content: 'Define the target customer segment for this idea and explain why you chose this segment', 
        tags: ['simple', 'customer'] 
    },
    { 
        id: 'simple-3', 
        category: 'Simple', 
        title: 'Competitor Analysis', 
        description: 'List main competitors', 
        content: 'List the main competitors for this idea and identify differentiation points', 
        tags: ['simple', 'competitor'] 
    },
    { 
        id: 'simple-4', 
        category: 'Simple', 
        title: 'Revenue Model', 
        description: 'Suggest revenue model', 
        content: 'Suggest the most suitable revenue model for this idea and explain pricing strategy', 
        tags: ['simple', 'revenue'] 
    },
    { 
        id: 'simple-5', 
        category: 'Simple', 
        title: 'Risk Assessment', 
        content: 'Assess main risks and suggest mitigation strategies', 
        description: 'Identify main risks', 
        tags: ['simple', 'risk'] 
    },

    // === SAAS & B2B PROMPTS ===
    { 
        id: 'saas-1', 
		category: 'SaaS & B2B',
        title: 'SaaS Validation', 
        description: 'Quickly evaluate SaaS idea', 
        content: 'Evaluate the market potential of this SaaS idea: target customer, pain point, solution, pricing', 
		tags: ['saas', 'b2b', 'validation']
	},
	{
        id: 'saas-2', 
        category: 'SaaS & B2B', 
        title: 'B2B Sales Strategy', 
        description: 'Plan B2B sales approach', 
        content: 'Suggest sales strategy for this B2B product: target customer, sales channels, pricing, conversion', 
        tags: ['saas', 'b2b', 'sales'] 
    },
    { 
        id: 'saas-3', 
        category: 'SaaS & B2B', 
        title: 'Enterprise Features', 
        description: 'Features for enterprise customers', 
        content: 'What features should I add to this SaaS product for enterprise customers?', 
        tags: ['saas', 'enterprise', 'features'] 
    },

    // === E-COMMERCE PROMPTS ===
    { 
        id: 'ecom-1', 
        category: 'E-commerce', 
        title: 'Product Validation', 
        description: 'Evaluate e-commerce product', 
        content: 'Evaluate the market potential of this e-commerce product: target audience, competition, pricing, marketing', 
        tags: ['e-commerce', 'product', 'validation'] 
    },
    { 
        id: 'ecom-2', 
        category: 'E-commerce', 
        title: 'Marketing Channels', 
        description: 'Find most effective marketing channels', 
        content: 'Suggest the most effective marketing channels for this e-commerce product and explain why you chose these channels', 
        tags: ['e-commerce', 'marketing', 'channels'] 
    },
    { 
        id: 'ecom-3', 
		category: 'E-commerce',
        title: 'Customer Experience', 
        description: 'Improve customer experience', 
        content: 'How can I improve the customer experience of this e-commerce site? Optimize the purchase process', 
        tags: ['e-commerce', 'customer', 'experience'] 
    },

    // === MOBILE APP PROMPTS ===
    { 
        id: 'mobile-1', 
        category: 'Mobile App', 
        title: 'App Validation', 
        description: 'Evaluate mobile app idea', 
        content: 'Evaluate the market potential of this mobile app idea: target users, features, revenue model', 
        tags: ['mobile', 'app', 'validation'] 
    },
    { 
        id: 'mobile-2', 
        category: 'Mobile App', 
        title: 'User Retention', 
        description: 'Develop user retention strategy', 
        content: 'How can I increase user retention rate in this mobile app? Suggest gamification and reward systems', 
        tags: ['mobile', 'user', 'retention'] 
    },
    { 
        id: 'mobile-3', 
		category: 'Mobile App',
        title: 'ASO Optimization', 
        description: 'Optimize App Store', 
        content: 'Suggest App Store optimization for this mobile app: keywords, description, screenshots', 
        tags: ['mobile', 'aso', 'optimization'] 
    },

    // === FINANCE & FINTECH PROMPTS ===
    { 
        id: 'fintech-1', 
        category: 'Finance & Fintech', 
        title: 'Fintech Validation', 
        description: 'Evaluate fintech idea', 
        content: 'Evaluate the market potential of this fintech idea: regulation, security, user adoption', 
        tags: ['fintech', 'finance', 'validation'] 
    },
    { 
        id: 'fintech-2', 
        category: 'Finance & Fintech', 
        title: 'Payment System', 
        description: 'Payment system integration', 
        content: 'Which payment systems should I integrate into this fintech product? Focus on security and user experience', 
        tags: ['fintech', 'payment', 'integration'] 
    },
    { 
        id: 'fintech-3', 
        category: 'Finance & Fintech', 
        title: 'KYC/AML Process', 
        description: 'Plan KYC/AML process', 
        content: 'How should I design the KYC/AML process for this fintech product? Meet regulatory requirements', 
        tags: ['fintech', 'kyc', 'aml'] 
    },

    // === ARTIFICIAL INTELLIGENCE & AI PROMPTS ===
    { 
        id: 'ai-1', 
        category: 'AI & Machine Learning', 
        title: 'AI Product Validation', 
        description: 'Evaluate AI product idea', 
        content: 'Evaluate the market potential of this AI product idea: technology, data, use cases', 
        tags: ['ai', 'machine learning', 'validation'] 
    },
    { 
        id: 'ai-2', 
        category: 'AI & Machine Learning', 
        title: 'Data Strategy', 
        description: 'Data collection and processing strategy', 
        content: 'How should I develop data collection and processing strategy for this AI product? Focus on privacy and quality', 
        tags: ['ai', 'data', 'strategy'] 
    },
    { 
        id: 'ai-3', 
        category: 'AI & Machine Learning', 
        title: 'AI Ethics Guidelines', 
        description: 'Define AI ethics guidelines', 
        content: 'What ethical guidelines and boundaries should I set for this AI product? Focus on transparency and fairness', 
        tags: ['ai', 'ethics', 'guidelines'] 
    },

    // === HEALTH & WELLNESS PROMPTS ===
    { 
        id: 'health-1', 
        category: 'Health & Wellness', 
        title: 'Health Product Validation', 
        description: 'Evaluate health product idea', 
        content: 'Evaluate the market potential of this health product idea: regulation, safety, user need', 
        tags: ['health', 'wellness', 'validation'] 
    },
    { 
        id: 'health-2', 
        category: 'Health & Wellness', 
        title: 'HIPAA Compliance', 
        description: 'Ensure HIPAA compliance', 
        content: 'How should I ensure HIPAA compliance in this health product? Focus on data security and privacy', 
        tags: ['health', 'hipaa', 'compliance'] 
    },
    { 
        id: 'health-3', 
		category: 'Health & Wellness',
        title: 'Clinical Validation', 
        description: 'Plan clinical validation process', 
        content: 'How should I plan the clinical validation process for this health product? Focus on research and testing', 
        tags: ['health', 'clinical', 'validation'] 
    },

    // === EDUCATION & E-LEARNING PROMPTS ===
    { 
        id: 'education-1', 
        category: 'Education & E-Learning', 
        title: 'Education Product Validation', 
        description: 'Evaluate education product idea', 
        content: 'Evaluate the market potential of this education product idea: target students, curriculum, assessment', 
        tags: ['education', 'e-learning', 'validation'] 
    },
    { 
        id: 'education-2', 
        category: 'Education & E-Learning', 
        title: 'Learning Analytics', 
        description: 'Design learning analytics', 
        content: 'What learning analytics should I use in this education product? Focus on performance and progress', 
        tags: ['education', 'analytics', 'learning'] 
    },
    { 
        id: 'education-3', 
        category: 'Education & E-Learning', 
        title: 'Certification System', 
        description: 'Design certification system', 
        content: 'How should I design a certification system for this education product? Focus on credibility and recognition', 
        tags: ['education', 'certification', 'system'] 
    },

    // === CONTENT & MEDIA PROMPTS ===
    { 
        id: 'content-1', 
        category: 'Content & Media', 
        title: 'Content Product Validation', 
        description: 'Evaluate content product idea', 
        content: 'Evaluate the market potential of this content product idea: target audience, format, distribution', 
        tags: ['content', 'media', 'validation'] 
    },
    { 
        id: 'content-2', 
        category: 'Content & Media', 
        title: 'Content Calendar', 
        description: 'Plan content calendar', 
        content: 'How should I plan a content calendar for this content product? Focus on consistency and quality', 
        tags: ['content', 'calendar', 'planning'] 
    },
    { 
        id: 'content-3', 
        category: 'Content & Media', 
        title: 'Monetization Strategy', 
        description: 'Develop content monetization strategy', 
        content: 'How should I develop a monetization strategy for this content product? Focus on subscriptions and advertising', 
        tags: ['content', 'monetization', 'strategy'] 
    },

    // === HARDWARE & IOT PROMPTS ===
    { 
        id: 'hardware-1', 
        category: 'Hardware & IoT', 
        title: 'Hardware Product Validation', 
        description: 'Evaluate hardware product idea', 
        content: 'Evaluate the market potential of this hardware product idea: manufacturing, cost, distribution', 
        tags: ['hardware', 'iot', 'validation'] 
    },
    { 
        id: 'hardware-2', 
        category: 'Hardware & IoT', 
        title: 'Manufacturing Process', 
        description: 'Plan manufacturing process', 
        content: 'How should I plan the manufacturing process for this hardware product? Focus on quality and cost', 
        tags: ['hardware', 'manufacturing', 'process'] 
    },
    { 
        id: 'hardware-3', 
        category: 'Hardware & IoT', 
        title: 'IoT Integration', 
        description: 'Design IoT features', 
        content: 'What IoT features should I add to this hardware product? Focus on connectivity and data', 
        tags: ['hardware', 'iot', 'integration'] 
	}
];

const PromptGallery: React.FC<PromptGalleryProps> = ({ open, onClose, onUse }) => {
	const [query, setQuery] = useState('');
	const [active, setActive] = useState<PromptTemplate | null>(null);
	const [draft, setDraft] = useState('');

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return TEMPLATES;
		return TEMPLATES.filter(t =>
			t.title.toLowerCase().includes(q) ||
			t.description.toLowerCase().includes(q) ||
			t.tags.join(' ').toLowerCase().includes(q) ||
			t.category.toLowerCase().includes(q)
		);
	}, [query]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-[80]">
			<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
			<div className="absolute inset-0 flex items-center justify-center p-4">
				<div className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
					<div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
						<h3 className="text-white font-semibold">Prompt Gallery</h3>
						<button onClick={onClose} className="text-slate-300 hover:text-white text-sm">Close</button>
					</div>
					<div className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
						<div className="md:col-span-2">
							<input
								type="text"
								value={query}
								onChange={e => setQuery(e.target.value)}
								placeholder="Search templates..."
								className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder-slate-400"
							/>
							<div className="mt-3 max-h-[360px] overflow-auto space-y-2 pr-1">
								{filtered.map(t => (
									<button
										key={t.id}
										onClick={() => { setActive(t); setDraft(t.content); }}
										className={`w-full text-left p-3 rounded-lg border transition-colors ${active?.id === t.id ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
									>
										<div className="text-xs text-slate-400">{t.category}</div>
										<div className="text-white font-medium">{t.title}</div>
										<div className="text-slate-300 text-sm line-clamp-3">{t.description}</div>
									</button>
								))}
								{filtered.length === 0 && (
									<div className="text-slate-400 text-sm">No templates found.</div>
								)}
							</div>
						</div>
						<div className="md:col-span-3">
							{active ? (
								<div className="flex flex-col h-full">
									<div className="mb-2">
										<div className="text-white font-semibold">{active.title}</div>
										<div className="text-slate-400 text-sm">Edit before inserting.</div>
									</div>
									<textarea
										value={draft}
										onChange={e => setDraft(e.target.value)}
										placeholder="Edit the template before inserting..."
										aria-label="Edit template"
										className="flex-1 min-h-[260px] w-full px-3 py-3 rounded-lg bg-white/5 border border-white/10 text-slate-200 placeholder-slate-400"
									/>
									<div className="mt-3 flex justify-end gap-2">
										<button onClick={onClose} className="px-4 py-2 text-sm rounded-lg bg-white/5 border border-white/10 text-slate-200 hover:border-white/20">Cancel</button>
										<button onClick={() => onUse(draft)} className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Insert</button>
									</div>
								</div>
							) : (
								<div className="h-full flex items-center justify-center text-slate-400 text-sm">Select a template to preview and edit</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PromptGallery;


