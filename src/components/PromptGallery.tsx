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
    // === BASİT VE HIZLI PROMPT'LAR ===
    { 
        id: 'simple-1', 
        category: 'Basit', 
        title: 'Pazar talebi', 
        description: 'Fikrin pazar talebini değerlendir', 
        content: 'Bu fikrin pazar talebini değerlendir ve 0-100 arası skor ver', 
        tags: ['basit', 'skor'] 
    },
    { 
        id: 'simple-2', 
        category: 'Basit', 
        title: 'Hedef müşteri', 
        description: 'Hedef müşteri segmentini tanımla', 
        content: 'Bu fikrin hedef müşteri segmentini tanımla ve neden bu segmenti seçtiğini açıkla', 
        tags: ['basit', 'müşteri'] 
    },
    { 
        id: 'simple-3', 
        category: 'Basit', 
        title: 'Rakip analizi', 
        description: 'Ana rakipleri listele', 
        content: 'Bu fikrin ana rakiplerini listele ve farklılaşma noktalarını belirt', 
        tags: ['basit', 'rakip'] 
    },
    { 
        id: 'simple-4', 
        category: 'Basit', 
        title: 'Gelir modeli', 
        description: 'Gelir modelini öner', 
        content: 'Bu fikir için en uygun gelir modelini öner ve fiyatlandırma stratejisini açıkla', 
        tags: ['basit', 'gelir'] 
    },
    { 
        id: 'simple-5', 
        category: 'Basit', 
        title: 'Risk değerlendirmesi', 
        content: 'Bu fikrin ana risklerini değerlendir ve nasıl azaltılabileceğini öner', 
        description: 'Ana riskleri belirle', 
        tags: ['basit', 'risk'] 
    },

    // === SAAS & B2B PROMPT'LARI ===
    { 
        id: 'saas-1', 
        category: 'SaaS & B2B', 
        title: 'SaaS validasyonu', 
        description: 'SaaS fikrini hızlıca değerlendir', 
        content: 'Bu SaaS fikrinin pazar potansiyelini değerlendir: hedef müşteri, ağrı noktası, çözüm, fiyatlandırma', 
        tags: ['saas', 'b2b', 'validasyon'] 
    },
    { 
        id: 'saas-2', 
        category: 'SaaS & B2B', 
        title: 'B2B satış stratejisi', 
        description: 'B2B satış yaklaşımını planla', 
        content: 'Bu B2B ürünü için satış stratejisi öner: hedef müşteri, satış kanalları, fiyatlandırma, dönüşüm', 
        tags: ['saas', 'b2b', 'satış'] 
    },
    { 
        id: 'saas-3', 
        category: 'SaaS & B2B', 
        title: 'Enterprise özellikleri', 
        description: 'Enterprise müşteriler için özellikler', 
        content: 'Bu SaaS ürününe enterprise müşteriler için hangi özellikleri eklemeliyim?', 
        tags: ['saas', 'enterprise', 'özellik'] 
    },

    // === E-TİCARET PROMPT'LARI ===
    { 
        id: 'ecom-1', 
        category: 'E-ticaret', 
        title: 'Ürün validasyonu', 
        description: 'E-ticaret ürününü değerlendir', 
        content: 'Bu e-ticaret ürününün pazar potansiyelini değerlendir: hedef kitle, rekabet, fiyatlandırma, pazarlama', 
        tags: ['e-ticaret', 'ürün', 'validasyon'] 
    },
    { 
        id: 'ecom-2', 
        category: 'E-ticaret', 
        title: 'Pazarlama kanalları', 
        description: 'En etkili pazarlama kanallarını bul', 
        content: 'Bu e-ticaret ürünü için en etkili pazarlama kanallarını öner ve neden bu kanalları seçtiğini açıkla', 
        tags: ['e-ticaret', 'pazarlama', 'kanal'] 
    },
    { 
        id: 'ecom-3', 
        category: 'E-ticaret', 
        title: 'Müşteri deneyimi', 
        description: 'Müşteri deneyimini iyileştir', 
        content: 'Bu e-ticaret sitesinin müşteri deneyimini nasıl iyileştirebilirim? Satın alma sürecini optimize et', 
        tags: ['e-ticaret', 'müşteri', 'deneyim'] 
    },

    // === MOBİL UYGULAMA PROMPT'LARI ===
    { 
        id: 'mobile-1', 
        category: 'Mobil Uygulama', 
        title: 'App validasyonu', 
        description: 'Mobil uygulama fikrini değerlendir', 
        content: 'Bu mobil uygulama fikrinin pazar potansiyelini değerlendir: hedef kullanıcı, özellikler, gelir modeli', 
        tags: ['mobil', 'uygulama', 'validasyon'] 
    },
    { 
        id: 'mobile-2', 
        category: 'Mobil Uygulama', 
        title: 'Kullanıcı tutma', 
        description: 'Kullanıcı tutma stratejisini geliştir', 
        content: 'Bu mobil uygulamada kullanıcı tutma oranını nasıl artırabilirim? Gamification ve ödül sistemleri öner', 
        tags: ['mobil', 'kullanıcı', 'tutma'] 
    },
    { 
        id: 'mobile-3', 
        category: 'Mobil Uygulama', 
        title: 'ASO optimizasyonu', 
        description: 'App Store optimizasyonu yap', 
        content: 'Bu mobil uygulama için App Store optimizasyonu öner: anahtar kelimeler, açıklama, ekran görüntüleri', 
        tags: ['mobil', 'aso', 'optimizasyon'] 
    },

    // === FİNANS & FİNTECH PROMPT'LARI ===
    { 
        id: 'fintech-1', 
        category: 'Finans & Fintech', 
        title: 'Fintech validasyonu', 
        description: 'Fintech fikrini değerlendir', 
        content: 'Bu fintech fikrinin pazar potansiyelini değerlendir: düzenleme, güven, kullanıcı benimsemesi', 
        tags: ['fintech', 'finans', 'validasyon'] 
    },
    { 
        id: 'fintech-2', 
        category: 'Finans & Fintech', 
        title: 'Ödeme sistemi', 
        description: 'Ödeme sistemi entegrasyonu', 
        content: 'Bu fintech ürününe hangi ödeme sistemlerini entegre etmeliyim? Güvenlik ve kullanıcı deneyimi odaklı', 
        tags: ['fintech', 'ödeme', 'entegrasyon'] 
    },
    { 
        id: 'fintech-3', 
        category: 'Finans & Fintech', 
        title: 'KYC/AML süreci', 
        description: 'KYC/AML sürecini planla', 
        content: 'Bu fintech ürünü için KYC/AML sürecini nasıl tasarlamalıyım? Düzenleyici gereksinimleri karşıla', 
        tags: ['fintech', 'kyc', 'aml'] 
    },

    // === YAPAY ZEKA & AI PROMPT'LARI ===
    { 
        id: 'ai-1', 
        category: 'Yapay Zeka & AI', 
        title: 'AI ürün validasyonu', 
        description: 'AI ürün fikrini değerlendir', 
        content: 'Bu AI ürün fikrinin pazar potansiyelini değerlendir: teknoloji, veri, kullanım senaryoları', 
        tags: ['ai', 'yapay zeka', 'validasyon'] 
    },
    { 
        id: 'ai-2', 
        category: 'Yapay Zeka & AI', 
        title: 'Veri stratejisi', 
        description: 'Veri toplama ve işleme stratejisi', 
        content: 'Bu AI ürünü için veri toplama ve işleme stratejisini nasıl geliştirmeliyim? Gizlilik ve kalite odaklı', 
        tags: ['ai', 'veri', 'strateji'] 
    },
    { 
        id: 'ai-3', 
        category: 'Yapay Zeka & AI', 
        title: 'AI etik kuralları', 
        description: 'AI etik kurallarını belirle', 
        content: 'Bu AI ürünü için hangi etik kuralları ve sınırlar belirlemeliyim? Şeffaflık ve adalet odaklı', 
        tags: ['ai', 'etik', 'kurallar'] 
    },

    // === SAĞLIK & WELLNESS PROMPT'LARI ===
    { 
        id: 'health-1', 
        category: 'Sağlık & Wellness', 
        title: 'Sağlık ürün validasyonu', 
        description: 'Sağlık ürün fikrini değerlendir', 
        content: 'Bu sağlık ürün fikrinin pazar potansiyelini değerlendir: düzenleme, güvenlik, kullanıcı ihtiyacı', 
        tags: ['sağlık', 'wellness', 'validasyon'] 
    },
    { 
        id: 'health-2', 
        category: 'Sağlık & Wellness', 
        title: 'HIPAA uyumluluğu', 
        description: 'HIPAA uyumluluğunu sağla', 
        content: 'Bu sağlık ürününde HIPAA uyumluluğunu nasıl sağlamalıyım? Veri güvenliği ve gizlilik odaklı', 
        tags: ['sağlık', 'hipaa', 'uyumluluk'] 
    },
    { 
        id: 'health-3', 
        category: 'Sağlık & Wellness', 
        title: 'Klinik validasyon', 
        description: 'Klinik validasyon sürecini planla', 
        content: 'Bu sağlık ürünü için klinik validasyon sürecini nasıl planlamalıyım? Araştırma ve test odaklı', 
        tags: ['sağlık', 'klinik', 'validasyon'] 
    },

    // === EĞİTİM & E-LEARNING PROMPT'LARI ===
    { 
        id: 'education-1', 
        category: 'Eğitim & E-Learning', 
        title: 'Eğitim ürün validasyonu', 
        description: 'Eğitim ürün fikrini değerlendir', 
        content: 'Bu eğitim ürün fikrinin pazar potansiyelini değerlendir: hedef öğrenci, müfredat, ölçme', 
        tags: ['eğitim', 'e-learning', 'validasyon'] 
    },
    { 
        id: 'education-2', 
        category: 'Eğitim & E-Learning', 
        title: 'Öğrenme analitikleri', 
        description: 'Öğrenme analitiklerini tasarla', 
        content: 'Bu eğitim ürününde hangi öğrenme analitiklerini kullanmalıyım? Performans ve ilerleme odaklı', 
        tags: ['eğitim', 'analitik', 'öğrenme'] 
    },
    { 
        id: 'education-3', 
        category: 'Eğitim & E-Learning', 
        title: 'Sertifikasyon sistemi', 
        description: 'Sertifikasyon sistemini tasarla', 
        content: 'Bu eğitim ürünü için nasıl bir sertifikasyon sistemi tasarlamalıyım? Güvenilirlik ve tanınırlık odaklı', 
        tags: ['eğitim', 'sertifikasyon', 'sistem'] 
    },

    // === İÇERİK & MEDYA PROMPT'LARI ===
    { 
        id: 'content-1', 
        category: 'İçerik & Medya', 
        title: 'İçerik ürün validasyonu', 
        description: 'İçerik ürün fikrini değerlendir', 
        content: 'Bu içerik ürün fikrinin pazar potansiyelini değerlendir: hedef kitle, format, dağıtım', 
        tags: ['içerik', 'medya', 'validasyon'] 
    },
    { 
        id: 'content-2', 
        category: 'İçerik & Medya', 
        title: 'İçerik takvimi', 
        description: 'İçerik takvimini planla', 
        content: 'Bu içerik ürünü için nasıl bir içerik takvimi planlamalıyım? Tutarlılık ve kalite odaklı', 
        tags: ['içerik', 'takvim', 'planlama'] 
    },
    { 
        id: 'content-3', 
        category: 'İçerik & Medya', 
        title: 'Monetizasyon stratejisi', 
        description: 'İçerik monetizasyon stratejisini geliştir', 
        content: 'Bu içerik ürünü için nasıl bir monetizasyon stratejisi geliştirmeliyim? Abonelik ve reklam odaklı', 
        tags: ['içerik', 'monetizasyon', 'strateji'] 
    },

    // === HARDWARE & IOT PROMPT'LARI ===
    { 
        id: 'hardware-1', 
        category: 'Hardware & IoT', 
        title: 'Hardware ürün validasyonu', 
        description: 'Hardware ürün fikrini değerlendir', 
        content: 'Bu hardware ürün fikrinin pazar potansiyelini değerlendir: üretim, maliyet, dağıtım', 
        tags: ['hardware', 'iot', 'validasyon'] 
    },
    { 
        id: 'hardware-2', 
        category: 'Hardware & IoT', 
        title: 'Üretim süreci', 
        description: 'Üretim sürecini planla', 
        content: 'Bu hardware ürünü için nasıl bir üretim süreci planlamalıyım? Kalite ve maliyet odaklı', 
        tags: ['hardware', 'üretim', 'süreç'] 
    },
    { 
        id: 'hardware-3', 
        category: 'Hardware & IoT', 
        title: 'IoT entegrasyonu', 
        description: 'IoT özelliklerini tasarla', 
        content: 'Bu hardware ürününe hangi IoT özelliklerini eklemeliyim? Bağlantı ve veri odaklı', 
        tags: ['hardware', 'iot', 'entegrasyon'] 
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


