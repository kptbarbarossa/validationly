import React from 'react';
import SEOHead from '../components/SEOHead';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Validationly - Gizlilik Politikası"
        description="Validationly için gizlilik politikası. Kullanıcı girdileri kalıcı olarak saklanmaz; analiz amaçlı geçici olarak işlenir."
        keywords="gizlilik, privacy, veri saklama, privacy policy"
      />
      <div className="min-h-[60vh] max-w-3xl mx-auto px-4 py-10 text-slate-200">
        <h1 className="text-2xl font-bold text-white mb-4">Gizlilik Politikası</h1>
        <p className="text-slate-300 mb-6">Güncellenme tarihi: {new Date().toISOString().slice(0,10)}</p>

        <div className="space-y-5 text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Veri Saklama</h2>
            <p>
              Validationly'e girdiğiniz fikir/metinler yalnızca analiz oluşturmak amacıyla geçici olarak işlenir ve
              bizim veritabanımızda kalıcı olarak saklanmaz. Analiz tamamlandıktan sonra girişleriniz sistemimizde tutulmaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Üçüncü Taraf Hizmetler</h2>
            <p>
              Analiz için büyük dil modeli (LLM) sağlayıcılarına içerik iletilebilir (ör. Google Gemini). Bu işlem yalnızca
              çıktıyı üretmek içindir. Validationly, bu içerikleri kendi veritabanında saklamaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Analitik</h2>
            <p>
              Ürünü geliştirmek için anonimleştirilmiş kullanım metrikleri toplayabiliriz (ör. bir özelliğin kaç kez
              kullanıldığı). Bu metrikler, içerik/metinlerinizi veya kişisel verilerinizi kapsamaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Çerezler</h2>
            <p>
              Gerekli olduğu ölçüde temel çerezler kullanılabilir (oturum/performans). İzleyici niteliğinde kapsamlı çerezler
              kullanmıyoruz. Tarayıcınız üzerinden çerez tercihlerinizi yönetebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">İletişim</h2>
            <p>
              Bu politika ile ilgili sorularınız için lütfen proje deposu üzerinden bizimle iletişime geçin.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;


