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
    <div className="rounded-2xl p-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/15 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1">
		<div className="text-sm text-slate-100">{f.message}</div>
		<div className="mt-2 text-xs text-slate-400 flex items-center gap-3">
			{typeof f.score === 'number' && <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">{f.score}/10</span>}
			{f.contact && <span className="truncate max-w-[40%]">{f.contact}</span>}
			<span>{new Date(f.timestamp).toLocaleString()}</span>
		</div>
	</div>
);

function chunk<T>(arr: T[], size: number): T[][] {
	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
	return out;
}

const FeedbackWall: React.FC = () => {
	const [items, setItems] = useState<FeedbackItem[]>([]);
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    useEffect(() => {
        // Try server first
        (async () => {
            try {
                const r = await fetch('/api/feedback');
                const j = await r.json();
                if (j?.ok && Array.isArray(j.items)) {
                    setItems(j.items as FeedbackItem[]);
                    return;
                }
            } catch {}
            setItems(loadFeedbackLocal());
        })();
    }, []);

	const slides = useMemo(() => {
		const a = items.slice(0, 12);
		const groups = chunk(a, 3);
		return groups.length > 0 ? groups : [[]];
	}, [items]);

    useEffect(() => {
        if (slides.length <= 1) return;
        if (paused) return;
        const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 5000);
        return () => clearInterval(t);
    }, [slides.length, paused]);

	return (
		<div className="mt-12">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-lg font-semibold text-white">What users are saying</h3>
				<div className="flex items-center gap-1">
					{slides.map((_, i) => (
						<button key={i} onClick={()=>setIdx(i)} className={`w-2.5 h-2.5 rounded-full ${i===idx ? 'bg-white/80' : 'bg-white/25'} transition-colors`} aria-label={`slide ${i+1}`} />
					))}
				</div>
			</div>
            <div className="relative overflow-hidden" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
				<div className="h-full min-h-[170px]">
					{slides.map((group, i) => (
                        <div key={i} className={`absolute inset-0 transition-all duration-700 ease-out ${i===idx ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{group.map((f, k) => (
									<FeedbackCard key={f.timestamp + k} f={f} />
								))}
								{group.length === 0 && (
									<div className="text-slate-400 text-sm">No feedback yet. Be the first to leave one!</div>
								)}
							</div>
                            {/* Progress bar */}
                            {i===idx && (
                                <div className="absolute left-0 right-0 -bottom-2 h-1 bg-white/10 rounded">
                                    <div className={`h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded ${paused? '' : 'animate-[progressBar_5s_linear_forwards]'}`}></div>
                                </div>
                            )}
                        </div>
					))}
				</div>
			</div>
		</div>
	);
};

export default FeedbackWall;


