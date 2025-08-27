# Validationly Supabase Kurulum Rehberi

## 1. Supabase Proje Bilgilerini Al

Supabase dashboard'unda (https://supabase.com/dashboard/project/ozuwdijovszuakcgay):

1. **Settings** > **API** sayfasına git
2. Şu bilgileri kopyala:
   - **Project URL**: `https://ozuwdljoxvszuiakcgay.supabase.co`
   - **anon public key**: `eyJ...` (uzun bir JWT token)
   - **service_role key**: `eyJ...` (başka bir JWT token)

## 2. Environment Variables'ları Güncelle

Supabase dashboard'dan API keys'leri kopyala ve `.env.local` dosyasında güncelle:

```bash
# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=https://ozuwdljoxvszuiakcgay.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # anon public key
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # service_role key

# Supabase (for server-side)
SUPABASE_URL=https://ozuwdljoxvszuiakcgay.supabase.co  
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # anon public key (aynı)
```

**Önemli**: Gerçek API keys'leri Supabase dashboard'dan kopyalaman gerekiyor!

## 3. Veritabanı Şemasını Kur

1. Supabase dashboard'da **SQL Editor**'a git
2. `sql/validationly-schema.sql` dosyasının içeriğini kopyala
3. SQL Editor'a yapıştır ve **RUN** butonuna bas
4. Tüm tablolar, indexler ve güvenlik politikaları otomatik kurulacak

## 4. Supabase Paketlerini Yükle

```bash
npm install @supabase/supabase-js
```

## 5. Test Et

Kurulum tamamlandıktan sonra:

```bash
# Supabase bağlantısını test et
npm run test:supabase

# Uygulamayı başlat
npm run dev
```

✅ Test başarılıysa ve uygulama çalışıyorsa kurulum tamamlandı!

## 6. Production'a Deploy

Vercel'de environment variables'ları ekle:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## Özellikler

✅ **Otomatik User Management**: Auth ile entegre
✅ **Row Level Security**: Güvenli veri erişimi
✅ **Real-time**: Canlı güncellemeler
✅ **Analytics**: Kullanım istatistikleri
✅ **Scalable**: Otomatik ölçeklendirme

## Veritabanı Yapısı

- **users**: Kullanıcı profilleri ve planları
- **validations**: İdea doğrulama sonuçları
- **analytics**: Kullanım istatistikleri
- **idea_collections**: İdea koleksiyonları
- **workspaces**: Takım çalışma alanları (business plan)

## Sonraki Adımlar

1. ✅ Supabase kurulumu
2. 🔄 API endpoints'leri güncelle
3. 🔄 Frontend'i Supabase'e bağla
4. 🔄 Authentication ekle
5. 🔄 Production'a deploy