# Gelecek Planları: Analiz Metodolojisi ve Prompt Derinliği

Bu doküman sadece plan niteliğindedir; henüz uygulama yapılmamıştır.

## Kısa Vadeli (1–2 sprint)
- **İki-aşamalı zincir**: 
  - 1) Hızlı taslak (flash), 
  - 2) Eleştiri-düzeltme (pro). İkinci adım sadece eksik/zayıf bölümleri onarsın.
- **Sıkı JSON şeması ve onarım**:
  - AJV ile doğrulama; eksik alanlar listelenip “repair” çağrısına verilmesi.
- **Top‑K platform seçimi**:
  - `relevantPlatforms` içinden gerekçe puanı yüksek ilk N platforma derinlik.
- **Belirsizlik/güven skoru**:
  - `confidence` = sektör kapsama + analiz çeşitliliği + şema tamlığı.
- **Girdi standardizasyonu**:
  - Fikir metnini normalize et; özet + madde işaretleri üretip modele ver.

## Orta Vadeli (3–5 sprint)
- **Self‑consistency (çoklu örnekleme)**:
  - k=3 örnek; kritik alanlarda (market, competitive) medyan ve uzlaşı birleştirme.
- **Rubrik tabanlı puanlama**:
  - Skor formülleri deterministik; model gerekçe ve ara metrikleri sağlar.
- **Eleştirmen ajanı**:
  - Şema uyumu, metrik tutarlılığı, çelişki checklist’ine göre otomatik düzeltme prompt’u.
- **Hiyerarşik sistem talimatı**:
  - `base-analyst` + rol modülleri (Pazar, GTM, Finans, Risk); yalnız ilgili bölümleri doldur.
- **Sektör‑özgü few‑shot**:
  - Her sektör için 1–2 kısa örnek (iyi/kötü gerekçe, tipik metrik).

## Uzun Vadeli (6+ sprint)
- **Retrieval / kanıt modu**:
  - Hafif arama veya API stub’ları (Reddit/PH/HN/Crunchbase) ile 3–5 kanıt cümlesi; “yalnızca bu kanıtları kullan” talimatı.
- **A/B prompt deneyleri**:
  - Prompt varyantlarını versiyonla; completeness, parse‑success, insan puanı ile seçim.
- **Model seçimi politikası**:
  - Varsayılan flash; JSON hatasında pro’ya yükselt; çok uzun içerikte 1.5/2.5‑pro; dil karışımında yeniden zorlama.
- **Önbellek/idempotensi**:
  - `hash(idea|lang|model|prompts)` ile cache; “retry/repair” öncesi cache‑hit.

## Prompt Derinliği: Yapısal İlkeler
- **Platform rubrikleri**: erişim, niş uyumu, içerik uygunluğu, rekabet sinyali; kısa kanıt talebi.
- **Sıkı JSON şeması**: boş değer yok, tür/enum zorunluluğu, dil alanı tutarlılığı.
- **Hedefli zorlama**: tek dil (TR/EN), sayı biçimi, para birimi, emoji yok.
- **Sayısal tutarlılık**: ara metrikler önce; özet skorlar formülle türetilir.
- **Eleştiri checklist’i**: boş alan? kanıtsız iddia? rubrik tutarlı mı? skor gerekçesi var mı?
- **Uzunluk bütçesi**: bölüm başına token limiti, 2–3 cümle sınırı.

## Koda Yönelik Planlanan Dokunuşlar
- **`api/validate.ts` / `PromptManager.selectPrompts`**:
  - Rol modülleri ve sektörel few‑shot ekleme; `confidence` formülünü iyileştirme.
- **Çoklu örnekleme ve eleştirmen akışı**:
  - k=3 üretim, ardından critique‑repair; yalnız eksikleri hedefle.
- **AJV ile doğrulama**:
  - Şema hataları listele; “repair” çağrısına yapılandırılmış hata seti gönder.
- **Top‑K & kanıt modu bayrakları**:
  - `?topK=…`, `?evidence=true` ile akışın şekillenmesi.
- **Telemetri**:
  - `parse_success`, `completeness`, `repair_count`, `tokens`, `latency`, `variant_id`.

## Başarı Metrikleri
- **Parse Success Rate**: JSON başarı oranı.
- **Completeness**: zorunlu alanların doluluk yüzdesi.
- **Human‑rated Quality**: 1–5 insan değerlendirmesi (örneklem).
- **Consistency Variance**: çoklu örneklemede metrik/sözde varyans.
- **Latency & Cost**: ortalama süre ve token kullanımı.

## Riskler ve Önlemler
- **Maliyet artışı**: çoklu çağrılar → örnekleme/critique yalnız kritik bölümlerde.
- **Hallucination**: kanıt modu + “yalnız kanıt” talimatı + belirsizlik işaretleme.
- **Şema kırılmaları**: AJV + repair döngüsü + model yükseltme.
- **Aşırı uzun yanıtlar**: bölüm başı token sınırı ve keskin kısaltma kuralları.

## Mini Taslaklar (örnek)
```ts
// Çoklu örnekleme birleştirici
function mergeSamples(samples) {
  // sayısal alanlarda medyan, metinlerde en sık tema + kısa özet
}
```

```ts
// AJV doğrulama iskeleti
const validate = ajv.compile(dynamicPromptSchema);
if (!validate(parsed)) {
  const issues = validate.errors?.map(e => `${e.instancePath} ${e.message}`) || [];
  // critique-repair’e gönder
}
