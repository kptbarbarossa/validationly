# 🔐 Google Identity Service Kurulum Rehberi

## 🚨 Hata Çözümü

Google Identity Service hatası alıyorsanız, aşağıdaki adımları takip edin:

## 📋 Gerekli Adımlar

### 1. Google Cloud Console'da OAuth 2.0 Client ID Oluşturma

1. [Google Cloud Console](https://console.cloud.google.com/)'a gidin
2. Yeni proje oluşturun veya mevcut projeyi seçin
3. **APIs & Services** > **Credentials** bölümüne gidin
4. **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs** seçin
5. **Application type** olarak **Web application** seçin
6. **Authorized JavaScript origins**'e şunları ekleyin:
   - `http://localhost:5173` (development)
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
7. **Authorized redirect URIs**'e şunları ekleyin:
   - `http://localhost:5173/auth/callback`
   - `https://yourdomain.com/auth/callback`
8. **Create** butonuna tıklayın
9. **Client ID** ve **Client Secret**'ı kopyalayın

### 2. Environment Variables Kurulumu

1. Proje kök dizininde `.env.local` dosyası oluşturun:
```bash
cp env.example .env.local
```

2. `.env.local` dosyasını düzenleyin:
```bash
# Google OAuth 2.0 Client ID
VITE_GOOGLE_CLIENT_ID=your_actual_client_id_here

# Google OAuth 2.0 Client Secret (opsiyonel)
VITE_GOOGLE_CLIENT_SECRET=your_actual_client_secret_here
```

### 3. Development Server'ı Yeniden Başlatın

```bash
npm run dev
# veya
yarn dev
```

## 🔧 Yaygın Hatalar ve Çözümleri

### Hata: "Google Client ID is not configured"
**Çözüm**: `.env.local` dosyasında `VITE_GOOGLE_CLIENT_ID` değerini doğru şekilde ayarlayın

### Hata: "Failed to initialize Google One Tap"
**Çözüm**: 
1. Google Cloud Console'da OAuth consent screen'i yapılandırın
2. Gerekli API'leri etkinleştirin (Google+ API, Google Identity)

### Hata: "One Tap not displayed"
**Çözüm**: Bu normal bir durum, kullanıcı birden fazla Google hesabına sahipse One Tap gösterilmez

## 📱 Test Etme

1. Tarayıcıda Developer Tools'u açın (F12)
2. Console sekmesinde hata mesajlarını kontrol edin
3. Network sekmesinde Google API çağrılarını izleyin

## 🚀 Production Deployment

Vercel'de environment variables ekleyin:
1. Vercel Dashboard > Project Settings > Environment Variables
2. `VITE_GOOGLE_CLIENT_ID` ekleyin
3. Production ve Preview environment'ları seçin

## 📚 Ek Kaynaklar

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)

## ❓ Yardım

Hala sorun yaşıyorsanız:
1. Console hata mesajlarını kontrol edin
2. Network isteklerini inceleyin
3. Google Cloud Console'da API durumunu kontrol edin
4. Environment variables'ların doğru yüklendiğinden emin olun
