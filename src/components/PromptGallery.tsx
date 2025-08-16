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
    { id: 'ol-en-1', category: 'Quick', title: 'Demand summary', description: 'One sentence', content: 'Summarize market demand in one sentence for: {idea}', tags: ['one-liner'] },
    { id: 'ol-en-2', category: 'Quick', title: 'Value proposition', description: 'One sentence', content: 'Write a one‑sentence value proposition for this idea', tags: ['one-liner'] },
    { id: 'ol-en-3', category: 'Quick', title: 'Target segments', description: 'One sentence', content: 'List 3 target customer segments in one line', tags: ['one-liner'] },
    { id: 'ol-en-4', category: 'Quick', title: 'First 30‑day metrics', description: 'One sentence', content: 'Give 3 metrics to validate in the first 30 days', tags: ['one-liner'] },
    { id: 'ol-en-5', category: 'Quick', title: 'Acquisition channels', description: 'One sentence', content: 'Suggest 3 high‑impact acquisition channels', tags: ['one-liner'] },
    { id: 'ol-en-6', category: 'Quick', title: 'Investor pitch', description: 'One sentence', content: 'Write a one‑sentence investor pitch for this idea', tags: ['one-liner'] },
    { id: 'ol-en-7', category: 'Quick', title: 'Risks', description: 'One sentence', content: 'List 3 primary risks in one line', tags: ['one-liner'] },
    { id: 'ol-tr-1', category: 'Hızlı', title: 'Talep özeti', description: 'Tek cümle', content: 'Bu fikrin pazar talebini tek cümlede özetle: {fikir}', tags: ['tek-cumle'] },
    { id: 'ol-tr-2', category: 'Hızlı', title: 'Değer önerisi', description: 'Tek cümle', content: 'Bu fikrin 1 cümlelik değer önerisini yaz', tags: ['tek-cumle'] },
    { id: 'ol-tr-3', category: 'Hızlı', title: 'Hedef segmentler', description: 'Tek cümle', content: '3 hedef müşteri segmentini tek cümlede listele', tags: ['tek-cumle'] },
    { id: 'ol-tr-4', category: 'Hızlı', title: 'İlk 30 gün metrikleri', description: 'Tek cümle', content: 'İlk 30 günde test edilmesi gereken 3 metriği yaz', tags: ['tek-cumle'] },
    { id: 'ol-tr-5', category: 'Hızlı', title: 'Edinim kanalları', description: 'Tek cümle', content: 'En yüksek etkili 3 edinim kanalını tek cümlede öner', tags: ['tek-cumle'] },
    { id: 'ol-tr-6', category: 'Hızlı', title: 'Yatırımcı pitch', description: 'Tek cümle', content: 'Bu fikir için 1 cümlelik yatırımcı pitch yaz', tags: ['tek-cumle'] },
    { id: 'ol-tr-7', category: 'Hızlı', title: 'Riskler', description: 'Tek cümle', content: 'Bu fikrin 3 ana riskini tek cümlede yaz', tags: ['tek-cumle'] },
	{
		id: 'saas-b2b-basic',
		category: 'SaaS & B2B',
		title: 'SaaS validation brief',
		description: 'Concise SaaS idea brief for fast market validation.',
		content:
			"SaaS idea: {what it does}\nTarget ICP: {role, company size, vertical}\nPain: {top-1 painful workflow}\nValue prop: {clear outcome, quantified if possible}\nPrice point: {starter price}\nChannels: {X, Reddit, LinkedIn}\nSuccess metric (24h): {reply rate OR CTR OR signups}",
		tags: ['saas', 'b2b', 'validation']
	},
	{
		id: 'ecom-d2c',
		category: 'E-commerce',
		title: 'D2C product validation',
		description: 'Quick D2C brief focused on hooks and visuals.',
		content:
			"Product: {what makes it unique}\nAudience: {niche persona}\nUse-case: {when they use it}\nHook ideas: {3 hooks}\nPrice anchor: {range}\nChannels: {Instagram, TikTok, Pinterest}\nSuccess metric (24h): {adds to cart OR link clicks}",
		tags: ['ecommerce', 'd2c']
	},
	{
		id: 'mobile-b2c',
		category: 'Mobile App',
		title: 'Consumer app brief',
		description: 'Short B2C app brief optimized for social tests.',
		content:
			"App: {category}\nUser: {who}\nMoment: {when}\nCore loop: {habit / trigger}\nDifferentiator: {unlike X, we}\nMonetization: {ads/subscription}\nSuccess metric (24h): {waitlist OR CTR}",
		tags: ['mobile', 'b2c']
	},
	{
		id: 'fintech',
		category: 'Fintech',
		title: 'Fintech validation brief',
		description: 'Fintech brief with trust and compliance notes.',
		content:
			"Product: {what}\nUser: {who}\nProblem: {fees, time, risk}\nTrust signal: {data source, security}\nRegulatory note: {if any}\nMonetization: {fee/spread/subscription}\nSuccess metric (24h): {lead DMs OR signups}",
		tags: ['fintech']
	},
	{
		id: 'marketplace',
		category: 'Marketplace',
		title: 'Marketplace brief',
		description: 'Two-sided marketplace hypothesis and tests.',
		content:
			"Supply: {who}\nDemand: {who}\nCold start: {how}\nUnique value: {for both sides}\nTake rate: {x%}\nChannels: {supply ch., demand ch.}\nSuccess metric (24h): {supply signups OR demand CTR}",
		tags: ['marketplace']
	},
	{
		id: 'ai-agent',
		category: 'AI & Agents',
		title: 'AI agent validation brief',
		description: 'Agent task, context window, tools, success metric.',
		content:
			"Agent task: {what it automates}\nUser: {who benefits}\nContext: {data sources}\nTools: {apis, browser, docs}\nGuardrails: {limits}\nPricing: {per task / monthly}\nSuccess metric (24h): {task completions OR leads}",
		tags: ['ai', 'agent']
	},
	{
		id: 'content-creator',
		category: 'Creator & Media',
		title: 'Content product brief',
		description: 'Audience, problem, offer, funnel, KPI.',
		content:
			"Audience: {who}\nProblem: {what they lack}\nOffer: {format}\nDistribution: {channels}\nCTA: {soft vs hard}\nMonetization: {sponsorship/course}\nSuccess metric (24h): {email signups OR CTR}",
		tags: ['content', 'media']
	},
	{
		id: 'open-source-dev',
		category: 'Developer Tools',
		title: 'Dev tool validation brief',
		description: 'Problem, workflow, integration, DX, KPI.',
		content:
			"Problem: {dev pain}\nWorkflow: {where it fits}\nIntegration: {IDE/CI/CD}\nDX: {api, cli}\nOSS hook: {stars, templates}\nCommunity: {Dev.to, GitHub, X}\nSuccess metric (24h): {stars OR signups}",
		tags: ['developer', 'oss']
	},
	{
		id: 'health-wellness',
		category: 'Health & Wellness',
		title: 'Wellness app brief',
		description: 'Habit loop, motivation, safety, KPI.',
		content:
			"User: {who}\nGoal: {what outcome}\nHabit loop: {trigger/action/reward}\nSafety: {medical disclaimer}\nChannels: {TikTok, Instagram}\nMonetization: {subscription}\nSuccess metric (24h): {waitlist OR CTR}",
		tags: ['health', 'wellness']
	},
	{
		id: 'education',
		category: 'Education',
		title: 'Edu course brief',
		description: 'Outcome-based curriculum, social proof, pre-sale.',
		content:
			"Learner: {who}\nOutcome: {job-to-be-done}\nCurriculum: {modules}\nProof: {case/results}\nPre-sale: {pilot cohort}\nChannels: {LinkedIn, Reddit}\nSuccess metric (24h): {email waitlist}",
		tags: ['education']
	},
	{
		id: 'local-service',
		category: 'Local Service',
		title: 'Local service brief',
		description: 'Niche, geo, offer, proof, channel, KPI.',
		content:
			"Niche: {what service}\nGeo: {city/area}\nOffer: {bundle}\nProof: {before/after}\nChannel: {shorts + local groups}\nPricing: {package}\nSuccess metric (24h): {inquiries}",
		tags: ['local', 'service']
	},
	{
		id: 'b2b-outbound',
		category: 'B2B Outbound',
		title: 'Outbound brief',
		description: 'ICP, trigger event, opener, CTA, KPI.',
		content:
			"ICP: {role, size, vertical}\nTrigger: {event}\nOpener: {personalized}\nProof: {numbers}\nCTA: {calendar vs reply}\nChannel: {LinkedIn/X}\nSuccess metric (24h): {reply rate}",
		tags: ['b2b', 'outbound']
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


