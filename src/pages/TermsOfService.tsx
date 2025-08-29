import React from 'react';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service | Validationly"
        description="Terms of Service for Validationly - Read our terms and conditions"
        keywords="terms of service, terms and conditions, validationly, legal"
      />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Introduction */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Validationly ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            {/* Description of Service */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">
                Validationly provides AI-powered startup validation and market analysis services through:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Multi-platform data analysis (Reddit, GitHub, Stack Overflow, etc.)</li>
                <li>• AI-powered market insights and demand analysis</li>
                <li>• Social media post generation and recommendations</li>
                <li>• Export and reporting capabilities</li>
                <li>• Premium validation tools and features</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts and Registration</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-300 mb-4">
                To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.2 Account Security</h3>
              <p className="text-gray-300 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.3 Account Termination</h3>
              <p className="text-gray-300">
                We reserve the right to terminate or suspend your account at any time for violations of these terms.
              </p>
            </section>

            {/* Acceptable Use */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-300 mb-4">You agree not to use the Platform to:</p>
              <ul className="text-gray-300 space-y-2">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Infringe on intellectual property rights</li>
                <li>• Submit false or misleading information</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Interfere with the Platform's operation</li>
                <li>• Use automated tools to access the service</li>
                <li>• Harass, abuse, or harm other users</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.1 Platform Content</h3>
              <p className="text-gray-300 mb-4">
                The Platform and its content, including but not limited to text, graphics, logos, and software, are owned by Validationly and protected by intellectual property laws.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.2 User Content</h3>
              <p className="text-gray-300 mb-4">
                You retain ownership of content you submit, but grant us a license to use it for providing our services.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.3 Third-Party Content</h3>
              <p className="text-gray-300">
                Content from third-party platforms (Reddit, GitHub, etc.) remains subject to their respective terms and copyrights.
              </p>
            </section>

            {/* Privacy and Data */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-300">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
            </section>

            {/* Payment Terms */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Payment Terms and Subscriptions</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">7.1 Pricing</h3>
              <p className="text-gray-300 mb-4">
                Service pricing is subject to change with notice. Current pricing is displayed on our website.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">7.2 Billing</h3>
              <p className="text-gray-300 mb-4">
                Subscriptions are billed in advance on a recurring basis. You authorize us to charge your payment method.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">7.3 Refunds</h3>
              <p className="text-gray-300">
                Refund policies are determined by your subscription plan and applicable laws.
              </p>
            </section>

            {/* Service Availability */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability and Maintenance</h2>
              <p className="text-gray-300 mb-4">
                We strive to maintain high service availability but cannot guarantee uninterrupted access:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Scheduled maintenance may temporarily affect service</li>
                <li>• Third-party API availability impacts our services</li>
                <li>• Force majeure events may cause service disruptions</li>
                <li>• We will provide notice of planned maintenance when possible</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.1 Service Disclaimer</h3>
              <p className="text-gray-300 mb-4">
                The Platform is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.2 Analysis Disclaimer</h3>
              <p className="text-gray-300 mb-4">
                Our market analysis and insights are for informational purposes only and should not be considered as financial or business advice.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.3 Limitation of Liability</h3>
              <p className="text-gray-300">
                Our liability is limited to the amount paid for the service in the 12 months preceding the claim.
              </p>
            </section>

            {/* Indemnification */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
              <p className="text-gray-300">
                You agree to indemnify and hold harmless Validationly from any claims, damages, or expenses arising from your use of the Platform or violation of these terms.
              </p>
            </section>

            {/* Termination */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <p className="text-gray-300 mb-4">
                Either party may terminate this agreement:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• You may cancel your subscription at any time</li>
                <li>• We may terminate for violations of these terms</li>
                <li>• Upon termination, your access to the Platform will cease</li>
                <li>• Certain provisions survive termination</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law and Disputes</h2>
              <p className="text-gray-300 mb-4">
                These terms are governed by the laws of [Your Jurisdiction]. Disputes will be resolved through:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Good faith negotiations</li>
                <li>• Mediation if negotiations fail</li>
                <li>• Binding arbitration as a last resort</li>
                <li>• Small claims court for amounts under $10,000</li>
              </ul>
            </section>

            {/* Changes to Terms */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
              <p className="text-gray-300">
                We may modify these terms at any time. Material changes will be communicated via email or platform notification. Continued use constitutes acceptance of updated terms.
              </p>
            </section>

            {/* Contact Information */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="text-gray-300 space-y-2">
                <p>• Email: legal@validationly.com</p>
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

export default TermsOfService;
