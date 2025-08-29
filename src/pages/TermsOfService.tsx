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
            <p className="text-lg text-gray-500 mt-2">
              Effective Date: January 1, 2024
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Introduction */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By accessing and using Validationly ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. These Terms of Service ("Terms") govern your use of our AI-powered startup validation and market analysis platform at validationly.com and related services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If you do not agree to abide by these terms, please do not use our service. We reserve the right to modify these terms at any time, and your continued use of the Platform constitutes acceptance of any changes.
              </p>
            </section>

            {/* Description of Service */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">
                Validationly provides comprehensive AI-powered startup validation and market analysis services through our advanced platform:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• <strong>Multi-Platform Analysis:</strong> Real-time data collection from Reddit, GitHub, Stack Overflow, Product Hunt, Hacker News, Google News, and YouTube</li>
                <li>• <strong>AI-Powered Insights:</strong> Machine learning algorithms that analyze market demand, sentiment, and trends</li>
                <li>• <strong>Startup Validation:</strong> Comprehensive market research and validation for business ideas</li>
                <li>• <strong>Social Media Generation:</strong> AI-generated content for Twitter, Reddit, and LinkedIn</li>
                <li>• <strong>Export and Reporting:</strong> PDF/CSV reports with detailed market analysis</li>
                <li>• <strong>Premium Tools:</strong> Advanced validation features and unlimited analysis</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Our services are designed to help entrepreneurs, startups, and businesses validate ideas, understand market demand, and make data-driven decisions.
              </p>
            </section>

            {/* User Accounts and Registration */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts and Registration</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.1 Account Creation</h3>
              <p className="text-gray-300 mb-4">
                To access certain features and services, you must create an account. During registration, you agree to provide accurate, current, and complete information about yourself and your business. You are responsible for maintaining the accuracy of this information.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.2 Account Security</h3>
              <p className="text-gray-300 mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. This includes:
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Keeping your password secure and not sharing it with others</li>
                <li>• Logging out of your account when using shared devices</li>
                <li>• Notifying us immediately of any unauthorized access</li>
                <li>• Using strong, unique passwords for your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.3 Account Termination</h3>
              <p className="text-gray-300">
                We reserve the right to terminate or suspend your account at any time for violations of these terms, fraudulent activity, or for any other reason at our sole discretion. Upon termination, your access to the Platform will cease immediately.
              </p>
            </section>

            {/* Acceptable Use Policy */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-300 mb-4">You agree not to use the Platform to:</p>
              <ul className="text-gray-300 space-y-2">
                <li>• Violate any applicable laws, regulations, or third-party rights</li>
                <li>• Infringe on intellectual property rights, including copyrights, trademarks, and patents</li>
                <li>• Submit false, misleading, or fraudulent information or business ideas</li>
                <li>• Attempt to gain unauthorized access to our systems, networks, or other users' accounts</li>
                <li>• Interfere with, disrupt, or compromise the integrity or security of the Platform</li>
                <li>• Use automated tools, bots, or scripts to access or interact with the service</li>
                <li>• Harass, abuse, threaten, or harm other users or our employees</li>
                <li>• Use the service for competitive intelligence gathering against Validationly</li>
                <li>• Reverse engineer, decompile, or attempt to extract source code from our platform</li>
                <li>• Use the service for any illegal, harmful, or objectionable purposes</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Violation of these terms may result in immediate account termination and legal action.
              </p>
            </section>

            {/* Intellectual Property Rights */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property Rights</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.1 Platform Content and Technology</h3>
              <p className="text-gray-300 mb-4">
                The Platform and its content, including but not limited to text, graphics, logos, software, algorithms, AI models, and user interface design, are owned by Validationly and protected by intellectual property laws. All rights, title, and interest in the Platform remain with Validationly.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.2 User Content and Business Ideas</h3>
              <p className="text-gray-300 mb-4">
                You retain ownership of the business ideas, concepts, and content you submit to our platform. However, by using our services, you grant us a limited, non-exclusive license to:
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Process and analyze your business ideas for validation purposes</li>
                <li>• Use anonymized, aggregated data for service improvement</li>
                <li>• Store your content securely for service delivery</li>
                <li>• Generate insights and recommendations based on your submissions</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.3 Third-Party Content and Data</h3>
              <p className="text-gray-300">
                Content and data from third-party platforms (Reddit, GitHub, Stack Overflow, etc.) remain subject to their respective terms of service and copyrights. We access this data through public APIs and RSS feeds for market research purposes only.
              </p>
            </section>

            {/* Privacy and Data Protection */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Privacy and Data Protection</h2>
              <p className="text-gray-300 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
              </p>
              <p className="text-gray-300">
                We are committed to protecting your data and comply with applicable data protection laws, including GDPR. You have rights regarding your personal data as outlined in our Privacy Policy.
              </p>
            </section>

            {/* Payment Terms and Subscriptions */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Payment Terms and Subscriptions</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">7.1 Pricing and Plans</h3>
              <p className="text-gray-300 mb-4">
                Service pricing is subject to change with 30 days' notice. Current pricing is displayed on our website and may vary based on your selected plan and features. All prices are quoted in USD unless otherwise specified.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">7.2 Billing and Payment</h3>
              <p className="text-gray-300 mb-4">
                Subscriptions are billed in advance on a recurring basis (monthly or annually). By subscribing, you authorize us to charge your payment method for the applicable fees. Payment processing is handled securely by third-party providers (Stripe, PayPal).
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Automatic Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date</li>
                <li>• <strong>Payment Methods:</strong> We accept major credit cards, debit cards, and digital wallets</li>
                <li>• <strong>Failed Payments:</strong> Failed payments may result in service suspension</li>
                <li>• <strong>Price Changes:</strong> Price increases will be communicated 30 days in advance</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">7.3 Refunds and Cancellations</h3>
              <p className="text-gray-300">
                Refund policies are determined by your subscription plan and applicable laws. You may cancel your subscription at any time through your account settings. Refunds for unused portions of annual subscriptions may be provided on a pro-rated basis.
              </p>
            </section>

            {/* Service Availability and Maintenance */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">8. Service Availability and Maintenance</h2>
              <p className="text-gray-300 mb-4">
                We strive to maintain high service availability but cannot guarantee uninterrupted access:
              </p>
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Scheduled Maintenance:</strong> Regular maintenance windows will be communicated in advance</li>
                <li>• <strong>Third-Party Dependencies:</strong> Service availability depends on external APIs and data sources</li>
                <li>• <strong>Force Majeure:</strong> Events beyond our control may cause temporary service disruptions</li>
                <li>• <strong>Performance Monitoring:</strong> We continuously monitor and optimize platform performance</li>
                <li>• <strong>Uptime Commitment:</strong> We target 99.5% uptime for our core services</li>
              </ul>
              <p className="text-gray-300 mt-4">
                We will provide notice of planned maintenance when possible and work to minimize service disruptions.
              </p>
            </section>

            {/* Disclaimers and Limitations */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimers and Limitations</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.1 Service Disclaimer</h3>
              <p className="text-gray-300 mb-4">
                The Platform is provided "as is" and "as available" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
              </p>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.2 Analysis and Insights Disclaimer</h3>
              <p className="text-gray-300 mb-4">
                Our market analysis, insights, and recommendations are for informational purposes only and should not be considered as:
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Financial advice or investment recommendations</li>
                <li>• Business strategy or consulting services</li>
                <li>• Guarantees of business success or market performance</li>
                <li>• Legal, tax, or regulatory advice</li>
                <li>• Endorsements of specific business ideas or concepts</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.3 Limitation of Liability</h3>
              <p className="text-gray-300">
                Our liability is limited to the amount paid for the service in the 12 months preceding the claim. We are not liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data, or business opportunities.
              </p>
            </section>

            {/* Indemnification */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
              <p className="text-gray-300 mb-4">
                You agree to indemnify and hold harmless Validationly, its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Your use of the Platform or violation of these Terms</li>
                <li>• Your violation of any third-party rights or applicable laws</li>
                <li>• Your submission of false, misleading, or fraudulent information</li>
                <li>• Any unauthorized access to or use of your account</li>
                <li>• Your business decisions based on our analysis or recommendations</li>
              </ul>
              <p className="text-gray-300 mt-4">
                This indemnification obligation survives the termination of these Terms and your use of the Platform.
              </p>
            </section>

            {/* Termination */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
              <p className="text-gray-300 mb-4">
                Either party may terminate this agreement under the following circumstances:
              </p>
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>User Termination:</strong> You may cancel your subscription and terminate your account at any time</li>
                <li>• <strong>Company Termination:</strong> We may terminate for violations of these Terms or for business reasons</li>
                <li>• <strong>Immediate Effect:</strong> Upon termination, your access to the Platform will cease immediately</li>
                <li>• <strong>Data Retention:</strong> We may retain certain data as required by law or for legitimate business purposes</li>
                <li>• <strong>Surviving Provisions:</strong> Certain provisions survive termination, including indemnification and liability limitations</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Upon termination, you will lose access to all premium features and stored data, except as required by law.
              </p>
            </section>

            {/* Governing Law and Disputes */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law and Dispute Resolution</h2>
              <p className="text-gray-300 mb-4">
                These Terms are governed by the laws of the European Union and applicable member state laws. Disputes will be resolved through the following process:
              </p>
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Good Faith Negotiations:</strong> Initial attempts to resolve disputes through direct communication</li>
                <li>• <strong>Mediation:</strong> If negotiations fail, disputes may be resolved through mediation</li>
                <li>• <strong>Arbitration:</strong> Binding arbitration as a last resort, conducted in English</li>
                <li>• <strong>Small Claims:</strong> Small claims court for amounts under €5,000</li>
                <li>• <strong>Class Action Waiver:</strong> You waive any right to participate in class action lawsuits</li>
              </ul>
              <p className="text-gray-300 mt-4">
                Any legal proceedings must be brought within one year of the date the claim arose.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">13. Changes to These Terms</h2>
              <p className="text-gray-300 mb-4">
                We may modify these Terms at any time to reflect changes in our services, technology, legal requirements, or business practices:
              </p>
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Material Changes:</strong> Significant changes will be communicated via email and platform notifications</li>
                <li>• <strong>Update Process:</strong> Updated Terms will be posted on our platform with new effective dates</li>
                <li>• <strong>User Consent:</strong> Continued use of our services constitutes acceptance of updated Terms</li>
                <li>• <strong>Historical Versions:</strong> Previous versions of these Terms are available upon request</li>
                <li>• <strong>Notification Period:</strong> Material changes will be communicated 30 days in advance</li>
              </ul>
              <p className="text-gray-300 mt-4">
                We encourage you to review these Terms periodically to stay informed about your rights and obligations.
              </p>
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
