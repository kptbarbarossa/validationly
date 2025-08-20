import React from 'react';

export interface PromptGalleryProps {
	onUse: (text: string) => void;
}

type PromptTemplate = {
	id: string;
	title: string;
	content: string;
};

const TEMPLATES: PromptTemplate[] = [
	{ 
		id: 'market-demand', 
		title: 'Market Demand', 
		content: 'Evaluate the market demand for this idea and give a score from 0-100'
	},
	{ 
		id: 'target-customer', 
		title: 'Target Customer', 
		content: 'Define the target customer segment for this idea and explain why you chose this segment'
	},
	{ 
		id: 'competitor-analysis', 
		title: 'Competitor Analysis', 
		content: 'List the main competitors for this idea and identify differentiation points'
	},
	{ 
		id: 'revenue-model', 
		title: 'Revenue Model', 
		content: 'Suggest the most suitable revenue model for this idea and explain pricing strategy'
	},
	{ 
		id: 'risk-assessment', 
		title: 'Risk Assessment', 
		content: 'Assess main risks and suggest mitigation strategies'
	},
	{ 
		id: 'saas-validation', 
		title: 'SaaS Validation', 
		content: 'Evaluate the market potential of this SaaS idea: target customer, pain point, solution, pricing'
	},
	{ 
		id: 'b2b-sales', 
		title: 'B2B Sales Strategy', 
		content: 'Suggest sales strategy for this B2B product: target customer, sales channels, pricing, conversion'
	},
	{ 
		id: 'ecommerce', 
		title: 'E-commerce', 
		content: 'Evaluate the market potential of this e-commerce product: target audience, competition, pricing, marketing'
	}
];

const PromptGallery: React.FC<PromptGalleryProps> = ({ onUse }) => {
	return (
		<div className="mt-6">
			<div className="text-center mb-4">
				<p className="text-sm text-slate-400 mb-3">💡 Quick Analysis Templates</p>
			</div>
			
			<div className="flex flex-wrap justify-center gap-3">
				{TEMPLATES.map((template) => (
					<button
						key={template.id}
						onClick={() => onUse(template.content)}
						className="px-4 py-2 rounded-full bg-white/5 backdrop-blur border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all duration-200 text-sm font-medium"
					>
						{template.title}
					</button>
				))}
			</div>
		</div>
	);
};

export default PromptGallery;


