# 🔑 API Setup Guide - Validationly

Bu rehber, Validationly multi-platform validation sistemi için gerekli API key'lerini nasıl alacağınızı gösterir.

## 🚀 Hemen Çalışan Platformlar (API Key Gerekmez)

Bu platformlar şu anda API key olmadan çalışır:

✅ **Hacker News** - Ücretsiz API, key gerekmez
✅ **Google News** - RSS feed, key gerekmez  
✅ **Reddit** - RSS feed kullanıyor (API key olmadan sınırlı)
✅ **Stack Overflow** - Temel kullanım için key gerekmez
✅ **Product Hunt** - RSS feed kullanıyor

## 🔑 API Key Gereken Platformlar (Daha İyi Performance)

### 1. YouTube Data API v3 ⭐ (Öncelikli)

**Neden Gerekli:** Video analizi için
**Maliyet:** Ücretsiz (günlük 10,000 quota)

**Kurulum:**
1. [Google Cloud Console](https://console.cloud.google.com/) → Giriş yapın
2. Yeni proje oluşturun: "Validationly"
3. **APIs & Services** → **Library**
4. "YouTube Data API v3" arayın → **Enable**
5. **Credentials** → **Create Credentials** → **API Key**
6. API key'i kopyalayın

```bash
# .env.local dosyasına ekleyin
YOUTUBE_API_KEY=AIzaSyC...your_key_here
```

### 2. GitHub Personal Access Token ⭐ (Öncelikli)

**Neden Gerekli:** Daha yüksek rate limits (5000/saat vs 60/saat)
**Maliyet:** Ücretsiz

**Kurulum:**
1. [GitHub](https://github.com/settings/tokens) → Settings → Developer settings
2. **Personal access tokens** → **Tokens (classic)**
3. **Generate new token (classic)**
4. **Scopes:** `public_repo`, `read:user` seçin
5. Token'ı kopyalayın

```bash
# .env.local dosyasına ekleyin
GITHUB_TOKEN=ghp_...your_token_here
```

### 3. Reddit API (Opsiyonel)

**Neden Gerekli:** Daha detaylı Reddit analizi
**Maliyet:** Ücretsiz

**Kurulum:**
1. [Reddit Apps](https://www.reddit.com/prefs/apps) → Giriş yapın
2. **Create App** → **script** seçin
3. **Name:** "Validationly"
4. **Description:** "Startup validation tool"
5. **About URL:** "https://validationly.com"
6. Client ID ve Secret'i kopyalayın

```bash
# .env.local dosyasına ekleyin
REDDIT_CLIENT_ID=your_client_id
REDDIT_CLIENT_SECRET=your_client_secret
```

### 4. Stack Overflow API Key (Opsiyonel)

**Neden Gerekli:** Daha yüksek rate limits
**Maliyet:** Ücretsiz

**Kurulum:**
1. [Stack Apps](https://stackapps.com/apps/oauth/register) → Giriş yapın
2. **Register Your Application**
3. **Application Name:** "Validationly"
4. **Description:** "Startup idea validation"
5. **OAuth Domain:** "validationly.com"
6. Key'i kopyalayın

```bash
# .env.local dosyasına ekleyin
STACKOVERFLOW_KEY=your_key_here
```

### 5. Product Hunt API (Opsiyonel)

**Neden Gerekli:** Daha detaylı ürün analizi
**Maliyet:** Ücretsiz

**Kurulum:**
1. [Product Hunt API](https://api.producthunt.com/v2/oauth/applications) → Giriş yapın
2. **Create Application**
3. **Name:** "Validationly"
4. **Description:** "Startup validation tool"
5. **Redirect URI:** "https://validationly.com/callback"
6. Client ID ve Secret'i kopyalayın

```bash
# .env.local dosyasına ekleyin
PRODUCTHUNT_CLIENT_ID=your_client_id
PRODUCTHUNT_CLIENT_SECRET=your_client_secret
```

## 📋 Öncelik Sırası

### 🔥 Hemen Yapın (Kritik)
1. **YouTube API** - Video analizi için gerekli
2. **GitHub Token** - Rate limit sorunlarını önler

### 📈 Sonra Yapın (İyileştirme)
3. **Reddit API** - Daha detaylı topluluk analizi
4. **Stack Overflow Key** - Geliştirici sorunları analizi
5. **Product Hunt API** - Ürün karşılaştırması

## 🧪 Test Etme

API key'lerinizi aldıktan sonra test edin:

```bash
# Sunucuyu başlatın
npm run dev

# Test scriptini çalıştırın
node test-platforms.js

# Veya doğrudan validation yapın
# http://localhost:3000 → Bir startup fikri girin
```

## 🚨 Güvenlik

- API key'lerinizi asla GitHub'a commit etmeyin
- `.env.local` dosyası `.gitignore`'da olmalı
- Production'da environment variables kullanın

## 💡 İpuçları

1. **YouTube API** en önemli - önce onu alın
2. **GitHub Token** olmadan rate limit sorunu yaşarsınız
3. Diğer API'ler opsiyonel - sistem onlar olmadan da çalışır
4. Her API'nin kendi rate limit'i var - cache sistemi bunu yönetir

## 🆘 Sorun Giderme

**API key çalışmıyor:**
- Key'in doğru kopyalandığından emin olun
- Boşluk karakteri olmamalı
- API'nin enable edildiğinden emin olun

**Rate limit hatası:**
- Cache sistemi otomatik yönetir
- GitHub token ekleyin
- Biraz bekleyip tekrar deneyin

**CORS hatası:**
- API key'ler backend'de kullanılır
- Frontend'den direkt API çağrısı yapmayın