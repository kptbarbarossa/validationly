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
    <div className="space-y-4">
      {/* Compact Social Posts */}
      <div className="space-y-3">
        {socialPosts.slice(0, 2).map((post, index) => (
          <div key={index} className="border border-slate-200 dark:border-slate-600 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{post.icon}</span>
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white text-sm">{post.platform}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {post.content.length}/{post.maxLength} karakter
                  </p>
                </div>
              </div>
              <button
                onClick={() => copyToClipboard(post.title ? `${post.title}\n\n${post.content}` : post.content, post.platform)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  copiedText === post.platform
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copiedText === post.platform ? '✅' : '📋'}
              </button>
            </div>

            {/* Content Preview */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600">
              {post.title && (
                <p className="font-medium text-slate-900 dark:text-white text-sm mb-2 line-clamp-1">
                  {post.title}
                </p>
              )}
              <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3">
                {post.content}
              </p>
            </div>

            {/* Tips - Compact */}
            <div className="flex flex-wrap gap-1 mt-2">
              {post.tips.slice(0, 2).map((tip, tipIndex) => (
                <span
                  key={tipIndex}
                  className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded text-blue-700 dark:text-blue-300 text-xs"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips - Compact */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
        <h4 className="font-medium text-slate-900 dark:text-white mb-2 text-sm">💡 Paylaşım İpuçları</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
            <span className="font-medium text-slate-900 dark:text-white">🎯 Hedef:</span>
            <p className="text-slate-600 dark:text-slate-400">Erken geri bildirim alın</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/50 p-2 rounded border border-slate-200 dark:border-slate-600">
            <span className="font-medium text-slate-900 dark:text-white">⏰ Zamanlama:</span>
            <p className="text-slate-600 dark:text-slate-400">Hafta içi 09-11, 19-21</p>
          </div>
        </div>
      </div>
    </div>
  );
};