import React from 'react';
import { SEOHead } from '../components/SEOHead';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy - Validationly"
        description="Learn how Validationly protects your privacy and handles your data. We collect minimal data and prioritize your privacy."
        canonical="/privacy"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950">
        {/* Aurora Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Your privacy is important to us. Here's how we handle your data.
              </p>
              <p className="text-sm text-slate-400 mt-4">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Content */}
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-8 md:p-12">
              <div className="prose prose-invert max-w-none">
                
                {/* Introduction */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Validationly ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our startup idea validation service.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Key Point:</strong> We collect minimal data and prioritize your privacy. We do not sell, rent, or share your personal information with third parties.
                  </p>
                </section>

                {/* Data We Collect */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Data We Collect</h2>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">Minimal Data Collection</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    We collect only the data necessary to provide our service:
                  </p>
                  
                  <ul className="list-disc list-inside text-slate-300 space-y-2 mb-6">
                    <li><strong className="text-white">Startup Ideas:</strong> The business ideas you submit for validation (processed anonymously)</li>
                    <li><strong className="text-white">Usage Analytics:</strong> Anonymous usage statistics to improve our service (only if you consent)</li>
                    <li><strong className="text-white">Authentication Data:</strong> Email address and name (only if you choose to sign up)</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">What We DON'T Collect</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Personal identification beyond email (if you sign up)</li>
                    <li>Location data</li>
                    <li>Device information</li>
                    <li>Browsing history</li>
                    <li>Social media profiles</li>
                    <li>Financial information</li>
                  </ul>
                </section>

                {/* How We Use Data */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Data</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Service Provision</h3>
                      <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                        <li>Process your startup ideas through AI analysis</li>
                        <li>Generate validation reports</li>
                        <li>Provide social media suggestions</li>
                        <li>Save your validation history (if signed up)</li>
                      </ul>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-3">Service Improvement</h3>
                      <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                        <li>Analyze usage patterns (anonymized)</li>
                        <li>Improve AI accuracy</li>
                        <li>Fix bugs and technical issues</li>
                        <li>Enhance user experience</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Data Storage */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Data Storage & Security</h2>
                  
                  <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3">🔒 Security Measures</h3>
                    <ul className="list-disc list-inside text-slate-300 space-y-2">
                      <li>All data is encrypted in transit and at rest</li>
                      <li>We use industry-standard security practices</li>
                      <li>Regular security audits and updates</li>
                      <li>Limited access to data (only essential personnel)</li>
                    </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">Data Retention</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li><strong className="text-white">Validation Results:</strong> Stored for 1 year (if you're signed up) or deleted immediately (if anonymous)</li>
                    <li><strong className="text-white">Analytics Data:</strong> Anonymized and stored for 2 years maximum</li>
                    <li><strong className="text-white">Account Data:</strong> Retained until you delete your account</li>
                  </ul>
                </section>

                {/* Third Parties */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Third-Party Services</h2>
                  
                  <p className="text-slate-300 leading-relaxed mb-4">
                    We use minimal third-party services to provide our functionality:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Google Analytics (Optional)</h3>
                      <p className="text-slate-300 text-sm">
                        Only loaded if you consent to analytics cookies. Used for anonymous usage statistics.
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Supabase (Authentication)</h3>
                      <p className="text-slate-300 text-sm">
                        Used only for user authentication if you choose to sign up. Your startup ideas are processed separately.
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Google AI (Analysis)</h3>
                      <p className="text-slate-300 text-sm">
                        Used to analyze your startup ideas. Data is processed and not stored by Google.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Your Rights */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-blue-400 mb-2">Access & Portability</h3>
                        <p className="text-slate-300 text-sm">
                          Request a copy of your data or export your validation history.
                        </p>
                      </div>
                      
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">Right to Delete</h3>
                        <p className="text-slate-300 text-sm">
                          Request deletion of your account and all associated data.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Opt-Out</h3>
                        <p className="text-slate-300 text-sm">
                          Withdraw consent for analytics or marketing communications.
                        </p>
                      </div>
                      
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">Correction</h3>
                        <p className="text-slate-300 text-sm">
                          Request correction of any inaccurate personal data.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Contact */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <p className="text-slate-300 leading-relaxed mb-4">
                      If you have any questions about this Privacy Policy or want to exercise your rights, please contact us:
                    </p>
                    
                    <div className="space-y-2 text-slate-300">
                      <p><strong className="text-white">Email:</strong> privacy@validationly.com</p>
                      <p><strong className="text-white">Response Time:</strong> Within 30 days</p>
                      <p><strong className="text-white">Data Protection Officer:</strong> Available upon request</p>
                    </div>
                  </div>
                </section>

                {/* Changes */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                  <p className="text-slate-300 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

              </div>
            </div>

            {/* Back Button */}
            <div className="text-center mt-12">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;