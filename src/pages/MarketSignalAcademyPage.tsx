import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  keyLearnings: string[];
  icon: string;
  color: string;
}

interface CaseStudy {
  id: string;
  title: string;
  company: string;
  industry: string;
  description: string;
  keyInsights: string[];
  results: string;
  icon: string;
}

const MarketSignalAcademyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'case-studies' | 'tools'>('courses');
  const navigate = useNavigate();

  const isTR = false; // English by default

  const courses: Course[] = [
    {
      id: 'trend-basics',
      title: isTR ? 'Trend Analizi Temelleri' : 'Trend Analysis Fundamentals',
      description: isTR ? 'Market trendlerini nasıl tespit edeceğinizi ve analiz edeceğinizi öğrenin.' : 'Learn how to identify and analyze market trends.',
      duration: isTR ? '2 saat' : '2 hours',
      level: 'beginner',
      topics: [
        isTR ? 'Trend türleri ve özellikleri' : 'Types and characteristics of trends',
        isTR ? 'Trend tespit yöntemleri' : 'Trend detection methods',
        isTR ? 'Sosyal medya sinyalleri' : 'Social media signals',
        isTR ? 'Pazar döngüleri' : 'Market cycles'
      ],
      keyLearnings: [
        isTR ? 'Emerging trendleri erken yakalama' : 'Early detection of emerging trends',
        isTR ? 'Viral potansiyeli değerlendirme' : 'Assessing viral potential',
        isTR ? 'Trend yaşam döngüsü analizi' : 'Trend lifecycle analysis'
      ],
      icon: '📈',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'market-intelligence',
      title: isTR ? 'Market Sinyal Zekası' : 'Market Signal Intelligence',
      description: isTR ? 'Pazar sinyallerini okuma ve yorumlama sanatını keşfedin.' : 'Discover the art of reading and interpreting market signals.',
      duration: isTR ? '3 saat' : '3 hours',
      level: 'intermediate',
      topics: [
        isTR ? 'Sosyal momentum analizi' : 'Social momentum analysis',
        isTR ? 'Erken sinyal tespiti' : 'Early signal detection',
        isTR ? 'Rekabet analizi' : 'Competitive analysis',
        isTR ? 'Pazar fırsatı değerlendirmesi' : 'Market opportunity assessment'
      ],
      keyLearnings: [
        isTR ? 'Optimal giriş zamanlaması' : 'Optimal entry timing',
        isTR ? 'Risk faktörleri analizi' : 'Risk factor analysis',
        isTR ? 'Pazar boşluğu tespiti' : 'Market gap identification'
      ],
      icon: '🎯',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'startup-validation',
      title: isTR ? 'Startup Validasyon Stratejileri' : 'Startup Validation Strategies',
      description: isTR ? 'Startup fikirlerinizi doğrulama ve geliştirme metodolojileri.' : 'Methodologies for validating and developing startup ideas.',
      duration: isTR ? '4 saat' : '4 hours',
      level: 'advanced',
      topics: [
        isTR ? 'MVP geliştirme stratejileri' : 'MVP development strategies',
        isTR ? 'Kullanıcı geri bildirimi analizi' : 'User feedback analysis',
        isTR ? 'Product-market fit tespiti' : 'Product-market fit detection',
        isTR ? 'Ölçeklendirme kararları' : 'Scaling decisions'
      ],
      keyLearnings: [
        isTR ? 'Validasyon metodolojileri' : 'Validation methodologies',
        isTR ? 'Başarı metrikleri tanımlama' : 'Defining success metrics',
        isTR ? 'Pivot kararları' : 'Pivot decisions'
      ],
      icon: '🚀',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'timing-mastery',
      title: isTR ? 'Zamanlama Ustalığı' : 'Timing Mastery',
      description: isTR ? 'Pazar giriş zamanlamasını mükemmelleştirme teknikleri.' : 'Techniques for perfecting market entry timing.',
      duration: isTR ? '2.5 saat' : '2.5 hours',
      level: 'intermediate',
      topics: [
        isTR ? 'Pazar döngüsü analizi' : 'Market cycle analysis',
        isTR ? 'Rekabet avantajı yaratma' : 'Creating competitive advantage',
        isTR ? 'First-mover vs fast-follower' : 'First-mover vs fast-follower',
        isTR ? 'Launch stratejileri' : 'Launch strategies'
      ],
      keyLearnings: [
        isTR ? 'Optimal timing hesaplama' : 'Calculating optimal timing',
        isTR ? 'Pazar hazırlığı değerlendirmesi' : 'Market readiness assessment',
        isTR ? 'Zamanlama risklerini yönetme' : 'Managing timing risks'
      ],
      icon: '⏰',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: 'ai-avatars',
      title: isTR ? 'AI Avatar Trendi' : 'AI Avatar Trend',
      company: 'Lensa AI',
      industry: isTR ? 'Yapay Zeka' : 'Artificial Intelligence',
      description: isTR ? 'AI avatar trendinin nasıl viral olduğu ve Lensa AI\'ın bu fırsatı nasıl yakaladığı.' : 'How the AI avatar trend went viral and how Lensa AI captured this opportunity.',
      keyInsights: [
        isTR ? 'Sosyal medya viral potansiyeli erken tespiti' : 'Early detection of social media viral potential',
        isTR ? 'Influencer marketing stratejisi' : 'Influencer marketing strategy',
        isTR ? 'Freemium model optimizasyonu' : 'Freemium model optimization'
      ],
      results: isTR ? 'App Store\'da 1 numaraya çıktı, 20M+ indirme' : 'Reached #1 on App Store, 20M+ downloads',
      icon: '🤖'
    },
    {
      id: 'clubhouse-rise',
      title: isTR ? 'Clubhouse\'un Yükselişi' : 'Rise of Clubhouse',
      company: 'Clubhouse',
      industry: isTR ? 'Sosyal Medya' : 'Social Media',
      description: isTR ? 'Pandemi döneminde ses tabanlı sosyal medya trendini yakalayan Clubhouse analizi.' : 'Analysis of Clubhouse capturing the audio-based social media trend during the pandemic.',
      keyInsights: [
        isTR ? 'Pandemi davranış değişikliklerini öngörme' : 'Predicting pandemic behavior changes',
        isTR ? 'FOMO pazarlama stratejisi' : 'FOMO marketing strategy',
        isTR ? 'Invite-only model etkisi' : 'Invite-only model impact'
      ],
      results: isTR ? '10M kullanıcı, $4B değerleme' : '10M users, $4B valuation',
      icon: '🎙️'
    },
    {
      id: 'nft-boom',
      title: isTR ? 'NFT Patlaması' : 'NFT Boom',
      company: 'OpenSea',
      industry: 'Blockchain',
      description: isTR ? 'NFT trendinin yükselişi ve OpenSea\'ın pazar liderliği stratejisi.' : 'The rise of the NFT trend and OpenSea\'s market leadership strategy.',
      keyInsights: [
        isTR ? 'Kripto topluluk sinyallerini okuma' : 'Reading crypto community signals',
        isTR ? 'Sanatçı ekosistemi oluşturma' : 'Building artist ecosystem',
        isTR ? 'Network effect stratejisi' : 'Network effect strategy'
      ],
      results: isTR ? '$23B işlem hacmi, pazar lideri' : '$23B transaction volume, market leader',
      icon: '🎨'
    },
    {
      id: 'remote-work',
      title: isTR ? 'Uzaktan Çalışma Devrimi' : 'Remote Work Revolution',
      company: 'Zoom',
      industry: isTR ? 'Video Konferans' : 'Video Conferencing',
      description: isTR ? 'Uzaktan çalışma trendini erken yakalayan Zoom\'un başarı hikayesi.' : 'Zoom\'s success story in early adoption of the remote work trend.',
      keyInsights: [
        isTR ? 'Makro trend öngörüsü' : 'Macro trend prediction',
        isTR ? 'Kullanıcı deneyimi odağı' : 'User experience focus',
        isTR ? 'Ölçeklenebilir altyapı' : 'Scalable infrastructure'
      ],
      results: isTR ? '300M günlük kullanıcı, %326 büyüme' : '300M daily users, 326% growth',
      icon: '💻'
    }
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return isTR ? 'Başlangıç' : 'Beginner';
      case 'intermediate': return isTR ? 'Orta' : 'Intermediate';
      case 'advanced': return isTR ? 'İleri' : 'Advanced';
      default: return level;
    }
  };

  return (
    <>
      <SEOHead 
        title={isTR ? "Market Sinyal Akademisi - Trend Analizi Eğitimleri | Validationly" : "Market Signal Academy - Trend Analysis Training | Validationly"}
        description={isTR ? "Trend analizi, market intelligence ve startup validasyon konularında kapsamlı eğitimler. Case study'ler ve pratik örnekler." : "Comprehensive training in trend analysis, market intelligence and startup validation. Case studies and practical examples."}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

        
        <div className="relative container mx-auto px-6 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-6 py-3 mb-6 border border-white/20">
              <span className="text-2xl">🎓</span>
              <span className="text-white font-medium">
                {isTR ? 'Market Sinyal Akademisi' : 'Market Signal Academy'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {isTR ? 'Trend Analizi' : 'Master Trend Analysis'}<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {isTR ? 'Ustalığı Kazanın' : '& Market Intelligence'}
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {isTR 
                ? 'Market sinyal zekası, trend analizi ve startup validasyon konularında uzmanlaşın. Gerçek case study\'ler ve pratik örneklerle öğrenin.'
                : 'Master market signal intelligence, trend analysis, and startup validation. Learn through real case studies and practical examples.'
              }
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white/5 backdrop-blur rounded-2xl p-2 border border-white/10">
              <div className="flex gap-2">
                {[
                  { id: 'courses', label: isTR ? 'Eğitimler' : 'Courses', icon: '📚' },
                  { id: 'case-studies', label: isTR ? 'Case Study\'ler' : 'Case Studies', icon: '📊' },
                  { id: 'tools', label: isTR ? 'Araçlar' : 'Tools', icon: '🛠️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                      activeTab === tab.id 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto">
            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {isTR ? '🎯 Uzman Seviyesi Eğitimler' : '🎯 Expert-Level Training'}
                  </h2>
                  <p className="text-slate-300">
                    {isTR ? 'Sıfırdan uzmanlığa kadar her seviyede eğitim' : 'Training for every level from beginner to expert'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-r ${course.color} rounded-2xl flex items-center justify-center text-2xl`}>
                          {course.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                              {getLevelText(course.level)}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">{course.description}</p>
                          <div className="text-xs text-slate-400">
                            ⏱️ {course.duration}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-white mb-3">{isTR ? 'Konu Başlıkları' : 'Topics Covered'}</h4>
                          <ul className="space-y-2">
                            {course.topics.map((topic, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-indigo-400 mt-1">•</span>
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-semibold text-white mb-3">{isTR ? 'Öğrenecekleriniz' : 'Key Learnings'}</h4>
                          <ul className="space-y-2">
                            {course.keyLearnings.map((learning, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-green-400 mt-1">✓</span>
                                <span>{learning}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <button className={`w-full px-6 py-3 bg-gradient-to-r ${course.color} rounded-xl text-white font-medium transition-all duration-200 hover:scale-105`}>
                        {isTR ? 'Eğitime Başla' : 'Start Course'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Case Studies Tab */}
            {activeTab === 'case-studies' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {isTR ? '📊 Gerçek Başarı Hikayeleri' : '📊 Real Success Stories'}
                  </h2>
                  <p className="text-slate-300">
                    {isTR ? 'Trend yakalama ve market timing konusunda gerçek örnekler' : 'Real examples of trend catching and market timing'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {caseStudies.map((study) => (
                    <div key={study.id} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl">
                          {study.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">{study.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400 mb-3">
                            <span>🏢 {study.company}</span>
                            <span>🏭 {study.industry}</span>
                          </div>
                          <p className="text-slate-300 text-sm">{study.description}</p>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-white mb-3">{isTR ? 'Ana İçgörüler' : 'Key Insights'}</h4>
                          <ul className="space-y-2">
                            {study.keyInsights.map((insight, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                <span className="text-yellow-400 mt-1">💡</span>
                                <span>{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4">
                          <h4 className="font-semibold text-white mb-2">{isTR ? 'Sonuçlar' : 'Results'}</h4>
                          <p className="text-green-400 text-sm font-medium">{study.results}</p>
                        </div>
                      </div>

                      <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105">
                        {isTR ? 'Detaylı Analizi Oku' : 'Read Full Analysis'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools Tab */}
            {activeTab === 'tools' && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {isTR ? '🛠️ Pratik Araçlar' : '🛠️ Practical Tools'}
                  </h2>
                  <p className="text-slate-300">
                    {isTR ? 'Öğrendiklerinizi pratiğe dökebileceğiniz araçlar' : 'Tools to put your learning into practice'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      title: isTR ? 'Trend Hunter' : 'Trend Hunter',
                      description: isTR ? 'Viral trendleri keşfedin ve analiz edin' : 'Discover and analyze viral trends',
                      icon: '🎯',
                      route: '/trend-hunter',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      title: isTR ? 'Trend → Startup' : 'Trend → Startup',
                      description: isTR ? 'Trendleri startup fırsatlarına çevirin' : 'Turn trends into startup opportunities',
                      icon: '🚀',
                      route: '/trend-to-startup',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      title: isTR ? 'Fikir Validasyonu' : 'Idea Validation',
                      description: isTR ? 'Startup fikirlerinizi kapsamlı analiz edin' : 'Comprehensively analyze your startup ideas',
                      icon: '✅',
                      route: '/',
                      color: 'from-green-500 to-emerald-500'
                    }
                  ].map((tool, index) => (
                    <div key={index} className="bg-white/5 backdrop-blur rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
                         onClick={() => navigate(tool.route)}>
                      <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center text-2xl mb-6 mx-auto`}>
                        {tool.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-white text-center mb-4">{tool.title}</h3>
                      <p className="text-slate-300 text-sm text-center mb-6">{tool.description}</p>
                      <button className={`w-full px-6 py-3 bg-gradient-to-r ${tool.color} rounded-xl text-white font-medium transition-all duration-200 hover:scale-105`}>
                        {isTR ? 'Aracı Kullan' : 'Use Tool'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MarketSignalAcademyPage;
