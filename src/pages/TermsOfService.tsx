import React from 'react';
import { SEOHead } from '../components/SEOHead';

const TermsOfService: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service - Validationly"
        description="Read Validationly's Terms of Service. Simple, clear terms for using our startup validation platform."
        canonical="/terms"
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
              Terms of Service
            </h1>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                Simple, clear terms for using our startup validation platform.
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
                  <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    By accessing and using Validationly ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Simple Rule:</strong> Use our service responsibly and respect others' intellectual property.
              </p>
            </section>

                {/* Service Description */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">What We Provide</h2>
                  
                  <div className="bg-slate-800/50 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Our Service</h3>
                    <ul className="list-disc list-inside text-slate-300 space-y-2">
                      <li>AI-powered startup idea validation</li>
                      <li>Market analysis and demand scoring</li>
                      <li>Social media content suggestions</li>
                      <li>Platform-specific insights</li>
                      <li>Validation history (if you sign up)</li>
              </ul>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">What We DON'T Provide</h3>
                  <ul className="list-disc list-inside text-slate-300 space-y-2">
                    <li>Investment advice or financial recommendations</li>
                    <li>Legal or regulatory compliance guidance</li>
                    <li>Guaranteed business success</li>
                    <li>Professional consulting services</li>
              </ul>
            </section>

                {/* User Responsibilities */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Your Responsibilities</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-400 mb-2">✅ Do</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                          <li>Provide accurate information</li>
                          <li>Use the service for legitimate purposes</li>
                          <li>Respect intellectual property rights</li>
                          <li>Follow applicable laws and regulations</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">❌ Don't</h3>
                        <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                          <li>Submit harmful or illegal content</li>
                          <li>Attempt to reverse engineer our AI</li>
                          <li>Use the service for spam or abuse</li>
                          <li>Violate others' intellectual property</li>
              </ul>
                      </div>
                    </div>
                  </div>
            </section>

                {/* Intellectual Property */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-blue-400 mb-3">Your Ideas</h3>
                      <p className="text-slate-300 leading-relaxed">
                        <strong className="text-white">You own your startup ideas.</strong> We don't claim ownership of the business ideas you submit. We only process them to provide validation analysis.
                      </p>
                    </div>
                    
                    <div className="bg-purple-900/20 border border-purple-700/50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-purple-400 mb-3">Our Service</h3>
                      <p className="text-slate-300 leading-relaxed">
                        <strong className="text-white">We own our platform.</strong> The Validationly service, including our AI models, algorithms, and user interface, is our intellectual property.
                      </p>
                    </div>
                  </div>
            </section>

                {/* Service Availability */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Service Availability</h2>
                  
                  <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3">No Guarantees</h3>
                    <ul className="list-disc list-inside text-slate-300 space-y-2">
                      <li>We strive for 99% uptime but cannot guarantee uninterrupted service</li>
                      <li>We may perform maintenance that temporarily affects availability</li>
                      <li>Third-party services (AI providers) may experience outages</li>
                      <li>We reserve the right to modify or discontinue the service</li>
              </ul>
                  </div>
            </section>

                {/* Limitation of Liability */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                  
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <p className="text-slate-300 leading-relaxed mb-4">
                      <strong className="text-white">Important:</strong> Our service provides analysis and suggestions based on AI algorithms. We cannot guarantee the accuracy or success of any business idea or validation results.
                    </p>
                    
                    <ul className="list-disc list-inside text-slate-300 space-y-2">
                      <li>Use our analysis as guidance, not as definitive business advice</li>
                      <li>Always conduct your own research and due diligence</li>
                      <li>We are not liable for business decisions made based on our analysis</li>
                      <li>Our liability is limited to the amount you paid for the service (currently free)</li>
              </ul>
                  </div>
            </section>

                {/* Privacy */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Privacy</h2>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Your privacy is important to us. Please review our{' '}
                    <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                      Privacy Policy
                    </a>{' '}
                    to understand how we collect, use, and protect your information.
              </p>
            </section>

            {/* Termination */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Your Right to Stop</h3>
                      <p className="text-slate-300 text-sm">
                        You can stop using our service at any time. If you have an account, you can delete it and all associated data.
                      </p>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Our Right to Suspend</h3>
                      <p className="text-slate-300 text-sm">
                        We may suspend or terminate access for users who violate these terms or misuse our service.
                      </p>
                    </div>
                  </div>
            </section>

                {/* Changes to Terms */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                  <p className="text-slate-300 leading-relaxed">
                    We may update these Terms of Service from time to time. We will notify you of any significant changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

                {/* Contact */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
                  
                  <div className="bg-slate-800/50 rounded-lg p-6">
                    <p className="text-slate-300 leading-relaxed mb-4">
                      If you have any questions about these Terms of Service, please contact us:
                    </p>
                    
                    <div className="space-y-2 text-slate-300">
                      <p><strong className="text-white">Email:</strong> kaptan3k@gmail.com</p>
                      <p><strong className="text-white">Response Time:</strong> Within 7 business days</p>
                    </div>
                  </div>
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

export default TermsOfService;