import React, { useState } from 'react';

interface SocialMediaSectionProps {
  result: any;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ result }) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const socialPosts = [
    {
      platform: 'Twitter',
      icon: '🐦',
      color: 'from-blue-400 to-blue-600',
      content: result.socialMediaSuggestions?.tweetSuggestion || result.tweetSuggestion || 
        `🚀 Yeni startup fikrim hakkında ne düşünüyorsunuz? "${result.idea}" - Sizce pazar potansiyeli var mı? #startup #entrepreneur #innovation`,
      maxLength: 280,
      tips: ['Hashtag kullanın', 'Soru sorun', 'Görsel ekleyin']
    },
    {
      platform: 'LinkedIn',
      icon: '💼',
      color: 'from-blue-600 to-blue-800',
      content: result.socialMediaSuggestions?.linkedinSuggestion || result.linkedinSuggestion ||
        `Profesyonel ağımdan görüş almak istiyorum: "${result.idea}" konsepti üzerinde çalışıyorum. Bu alanda deneyimi olan var mı? Önerilerinizi bekliyorum. #startup #business #innovation`,
      maxLength: 3000,
      tips: ['Profesyonel ton', 'Uzun açıklama', 'Ağınızdan yardım isteyin']
    },
    {
      platform: 'Reddit',
      icon: '🔴',
      color: 'from-orange-500 to-red-600',
      content: result.socialMediaSuggestions?.redditBodySuggestion || result.redditBodySuggestion ||
        `Merhaba! "${result.idea}" üzerine bir proje geliştirmeyi planlıyorum. Bu konuda deneyimi olan var mı? Önerilerinizi ve geri bildirimlerinizi çok isterim.`,
      title: result.socialMediaSuggestions?.redditTitleSuggestion || result.redditTitleSuggestion ||
        `"${result.idea}" - Bu fikir hakkında ne düşünüyorsunuz?`,
      maxLength: 40000,
      tips: ['Doğru subreddit seçin', 'Detaylı açıklama', 'Topluluk kurallarına uyun']
    }
  ];

  const platforms = [
    { name: 'Instagram', icon: '📸', color: 'from-pink-500 to-purple-600' },
    { name: 'TikTok', icon: '🎵', color: 'from-black to-red-500' },
    { name: 'Facebook', icon: '👥', color: 'from-blue-600 to-blue-800' },
    { name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Ready-to-Post Content */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center text-blue-400 mb-6">
          📱 Hazır Sosyal Medya İçerikleri
        </h3>
        
        {socialPosts.map((post, index) => (
          <div key={index} className="glass glass-border p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{post.icon}</span>
                <div>
                  <h4 className="font-bold text-white">{post.platform}</h4>
                  <p className="text-slate-400 text-sm">
                    {post.content.length}/{post.maxLength} karakter
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(post.title ? `${post.title}\n\n${post.content}` : post.content, post.platform)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  copiedText === post.platform
                    ? 'bg-green-500 text-white'
                    : `bg-gradient-to-r ${post.color} hover:opacity-80`
                }`}
              >
                {copiedText === post.platform ? '✅ Kopyalandı' : '📋 Kopyala'}
              </button>
            </div>

            {/* Reddit Title */}
            {post.title && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-400 mb-2">Başlık:</label>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                  <p className="text-white font-medium">{post.title}</p>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-400 mb-2">İçerik:</label>
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
            </div>

            {/* Tips */}
            <div className="flex flex-wrap gap-2">
              {post.tips.map((tip, tipIndex) => (
                <span
                  key={tipIndex}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm"
                >
                  💡 {tip}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Platforms */}
      <div className="glass glass-border p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 text-purple-400 text-center">
          🌟 Diğer Platform Önerileri
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700 hover:border-slate-600 transition-all"
            >
              <div className="text-3xl mb-2">{platform.icon}</div>
              <h4 className="font-semibold text-white mb-1">{platform.name}</h4>
              <p className="text-xs text-slate-400">Yakında</p>
            </div>
          ))}
        </div>
      </div>

      {/* Posting Strategy */}
      <div className="glass glass-border p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
          <span>📈</span> Paylaşım Stratejisi
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">🎯 Hedef Kitle</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Erken benimseyen kullanıcılar</li>
              <li>• Sektör profesyonelleri</li>
              <li>• Potansiyel müşteriler</li>
              <li>• Girişimci toplulukları</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">⏰ Zamanlama</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>• Twitter: 09:00-11:00, 19:00-21:00</li>
              <li>• LinkedIn: 08:00-10:00, 17:00-18:00</li>
              <li>• Reddit: Platform kurallarına göre</li>
              <li>• Hafta içi daha etkili</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Engagement Tips */}
      <div className="glass glass-border p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-4 text-yellow-400 flex items-center gap-2">
          <span>💬</span> Etkileşim İpuçları
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <div className="text-2xl mb-2">❓</div>
            <h4 className="font-semibold text-white mb-2">Soru Sorun</h4>
            <p className="text-slate-400 text-sm">Topluluktan geri bildirim isteyin</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold text-white mb-2">Etkileşim</h4>
            <p className="text-slate-400 text-sm">Yorumlara hızlı yanıt verin</p>
          </div>
          <div className="text-center p-4 bg-slate-800/30 rounded-xl">
            <div className="text-2xl mb-2">📊</div>
            <h4 className="font-semibold text-white mb-2">Takip</h4>
            <p className="text-slate-400 text-sm">Metrikleri izleyin ve analiz edin</p>
          </div>
        </div>
      </div>
    </div>
  );
};