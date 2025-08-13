import React, { useEffect, useMemo, useState } from 'react';

export interface FeedbackItem {
	message: string;
	contact?: string;
	score?: number;
	timestamp: string;
}

const STORAGE_KEY = 'validationly_feedback_items';

export const saveFeedbackLocal = (item: FeedbackItem) => {
	try {
		const arr = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as FeedbackItem[];
		arr.unshift(item);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(arr.slice(0, 50)));
	} catch {}
};

export const loadFeedbackLocal = (): FeedbackItem[] => {
	try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as FeedbackItem[]; } catch { return []; }
};

const FeedbackCard: React.FC<{ f: FeedbackItem } > = ({ f }) => (
	<div className="rounded-xl glass glass-border p-4 border border-white/10 bg-white/5">
		<div className="text-sm text-slate-200">{f.message}</div>
		<div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
			{f.contact && <span>Contact: {f.contact}</span>}
			{typeof f.score === 'number' && <span>Score: {f.score}/10</span>}
			<span>{new Date(f.timestamp).toLocaleString()}</span>
		</div>
	</div>
);

const FeedbackWall: React.FC = () => {
	const [items, setItems] = useState<FeedbackItem[]>([]);
	useEffect(() => { setItems(loadFeedbackLocal()); }, []);

	const rows = useMemo(() => {
		const a = items.slice(0, 12);
		return [a.filter((_,i)=> i%2===0), a.filter((_,i)=> i%2===1)];
	}, [items]);

	return (
		<div className="mt-12">
			<h3 className="text-lg font-semibold text-white mb-6">What users are saying</h3>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
				{rows.map((col, idx) => (
					<div key={idx} className={`space-y-4 ${idx===0? 'animate-[scroll_22s_linear_infinite]':'animate-[scroll_26s_linear_infinite]'} motion-reduce:animate-none`}>
						{col.map((f, i) => <FeedbackCard key={f.timestamp + i} f={f} />)}
					</div>
				))}
			</div>
		</div>
	);
};

export default FeedbackWall;


