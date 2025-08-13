import React from 'react';
import SEOHead from '../components/SEOHead';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Validationly - Privacy Policy"
        description="Privacy Policy for Validationly. We do not store your inputs; they are processed transiently only for analysis."
        keywords="privacy, privacy policy, data retention, data processing"
      />
      <div className="min-h-[60vh] max-w-3xl mx-auto px-4 py-10 text-slate-200">
        <h1 className="text-2xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-slate-300 mb-6">Last updated: {new Date().toISOString().slice(0,10)}</p>

        <div className="space-y-5 text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Data Retention</h2>
            <p>
              The ideas and text you enter into Validationly are processed only to generate your analysis and are not
              permanently stored in our database. Once the analysis is completed, your inputs are not retained by us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Third-Party Services</h2>
            <p>
              To generate results, content may be sent to large language model (LLM) providers (e.g., Google Gemini).
              This transmission is solely for producing your analysis output. Validationly does not store your inputs in
              its own database.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Analytics</h2>
            <p>
              We may collect anonymized usage metrics (e.g., feature usage counts) to improve the product. These metrics do
              not include your content or personally identifiable information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Cookies</h2>
            <p>
              We may use essential cookies as needed (session/performance). We do not use extensive tracking cookies.
              You can manage cookie preferences via your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Contact</h2>
            <p>
              For questions about this policy, please use the in‑app Feedback button.
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyPage;


