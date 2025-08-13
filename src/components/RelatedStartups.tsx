import React from 'react';

type StartupMetric = {
	name: string;
	description: string;
	metrics: {
		arr?: string;
		mrr?: string;
		growth?: string;
		users?: string;
	};
	sourceUrl?: string;
	sourceLabel?: string;
};

const defaultStartups: StartupMetric[] = [
	{
		name: 'Örnek: Wynter',
		description: 'Mesaj testi ve hedef kitle anketleri (Validationly ile benzer doğrulama amacına hizmet eder).',
		metrics: { arr: '—', mrr: '—', growth: '—', users: '—' },
		sourceUrl: undefined,
		sourceLabel: 'Kaynak eklenecek',
	},
	{
		name: 'Örnek: PickFu',
		description: 'Hızlı tüketici geri bildirimi/anketleri ile konsept validasyonu.',
		metrics: { arr: '—', mrr: '—', growth: '—', users: '—' },
		sourceUrl: undefined,
		sourceLabel: 'Kaynak eklenecek',
	},
	{
		name: 'Örnek: UserTesting',
		description: 'Kullanılabilirlik testleri ve kullanıcı araştırması (pazar validasyonu ile ilişkili).',
		metrics: { arr: '—', mrr: '—', growth: '—', users: '—' },
		sourceUrl: undefined,
		sourceLabel: 'Kaynak eklenecek',
	},
];

export type RelatedStartupsProps = {
	items?: StartupMetric[];
};

const RelatedStartups: React.FC<RelatedStartupsProps> = ({ items = defaultStartups }) => {
	if (!items || items.length === 0) return null;

	return (
		<section className="mt-16">
			<h2 className="text-2xl font-bold text-white mb-2">Benzer Startuplar ve Metrikler</h2>
			<p className="text-slate-300 mb-6 text-sm">
				Aşağıdaki liste, Validationly ile benzer doğrulama/araştırma amaçlarına hizmet eden araçları ve bilinen metriklerini gösterir.
				Örnek değerler gösteriliyorsa lütfen doğrulanmış kaynaktan güncelleyin.
			</p>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{items.map((s) => (
					<div key={s.name} className="rounded-2xl glass glass-border p-6 hover:border-white/15 transition-all">
						<h3 className="text-white font-semibold mb-1">{s.name}</h3>
						<p className="text-slate-300 text-sm mb-4">{s.description}</p>
						<div className="text-sm text-slate-200 space-y-1">
							<div>
								<span className="text-slate-400">ARR:</span> {s.metrics.arr ?? '—'}
							</div>
							<div>
								<span className="text-slate-400">MRR:</span> {s.metrics.mrr ?? '—'}
							</div>
							<div>
								<span className="text-slate-400">Büyüme:</span> {s.metrics.growth ?? '—'}
							</div>
							<div>
								<span className="text-slate-400">Kullanıcılar:</span> {s.metrics.users ?? '—'}
							</div>
						</div>
						{(s.sourceUrl || s.sourceLabel) && (
							<div className="mt-3 text-xs">
								<span className="text-slate-400">Kaynak: </span>
								{s.sourceUrl ? (
									<a className="text-indigo-300 hover:text-indigo-200 underline" href={s.sourceUrl} target="_blank" rel="noreferrer">
										{s.sourceLabel || 'Bağlantı'}
									</a>
								) : (
									<span className="text-slate-400">{s.sourceLabel}</span>
								)}
							</div>
						)}
					</div>
				))}
			</div>
			<p className="text-xs text-slate-400 mt-4">
				Not: ARR (Annual Recurring Revenue) ve diğer metrikler açık kaynak/duyuru/paylaşımlara göre farklılık gösterebilir. Lütfen daima orijinal kaynağı referans alın.
			</p>
		</section>
	);
};

export default RelatedStartups;


