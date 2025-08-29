import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Privacy Policy | Validationly"
        description="Privacy Policy for Validationly - Learn how we collect, use, and protect your data"
        keywords="privacy policy, data protection, GDPR, validationly"
      />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Introduction */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Validationly ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform validationly.com and related services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">2.1 Personal Information</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Email address and name when you create an account</li>
                <li>• Business ideas and queries you submit for analysis</li>
                <li>• Communication preferences and settings</li>
                <li>• Payment information (processed securely by third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">2.2 Usage Information</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Platform usage patterns and analytics</li>
                <li>• Search queries and analysis results</li>
                <li>• Device information and browser type</li>
                <li>• IP address and location data (anonymized)</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">2.3 Third-Party Data</h3>
              <p className="text-gray-300">
                We collect data from public APIs and RSS feeds (Reddit, GitHub, Stack Overflow, etc.) to provide platform analysis. This data is publicly available and used for market research purposes.
              </p>
            </section>

            {/* How We Use Information */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• Provide and improve our validation services</li>
                <li>• Generate AI-powered market analysis and insights</li>
                <li>• Personalize your experience and recommendations</li>
                <li>• Process payments and manage subscriptions</li>
                <li>• Send important updates and notifications</li>
                <li>• Analyze platform usage to improve services</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• With your explicit consent</li>
                <li>• To comply with legal requirements</li>
                <li>• To protect our rights and safety</li>
                <li>• With service providers who assist in our operations</li>
                <li>• In connection with business transfers or mergers</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Encryption of data in transit and at rest</li>
                <li>• Regular security assessments and updates</li>
                <li>• Access controls and authentication measures</li>
                <li>• Secure hosting and infrastructure</li>
                <li>• Employee training on data protection</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
              <p className="text-gray-300">
                We retain your personal information for as long as necessary to provide our services and comply with legal obligations. You may request deletion of your data at any time by contacting us.
              </p>
            </section>

            {/* Your Rights */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
              <p className="text-gray-300 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="text-gray-300 space-y-2">
                <li>• Access and review your data</li>
                <li>• Correct inaccurate information</li>
                <li>• Request deletion of your data</li>
                <li>• Object to processing of your data</li>
                <li>• Data portability</li>
                <li>• Withdraw consent</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Essential cookies for platform functionality</li>
                <li>• Analytics cookies to improve our services</li>
                <li>• Preference cookies to remember your settings</li>
                <li>• Third-party cookies for payment processing</li>
              </ul>
              <p className="text-gray-300 mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">9. Third-Party Services</h2>
              <p className="text-gray-300 mb-4">
                Our platform integrates with third-party services:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Payment processors (Stripe, PayPal)</li>
                <li>• Analytics services (Google Analytics)</li>
                <li>• Hosting and infrastructure providers</li>
                <li>• API providers (Reddit, GitHub, etc.)</li>
              </ul>
              <p className="text-gray-300 mt-4">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            {/* International Transfers */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-gray-300">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable data protection laws.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
              <p className="text-gray-300">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date. Your continued use of our services constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="text-gray-300 space-y-2">
                <p>• Email: privacy@validationly.com</p>
                <p>• Website: validationly.com</p>
                <p>• Address: [Your Business Address]</p>
              </div>
            </section>

            {/* Back to Home */}
            <div className="text-center pt-8">
              <Link
                to="/"
                className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl text-white font-semibold text-lg transition-all transform hover:scale-105"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
