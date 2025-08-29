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
            <p className="text-lg text-gray-500 mt-2">
              Effective Date: January 1, 2024
            </p>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Introduction */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Validationly ("we," "our," or "us") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered startup validation platform at validationly.com and related services.
              </p>
              <p className="text-gray-300 leading-relaxed">
                By using our services, you agree to the collection and use of information in accordance with this policy. We are committed to transparency and will only use your information as described in this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-300 mb-3">When you use our services, we may collect the following personal information:</p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Account Information:</strong> Email address, name, company name, and profile information when you create an account</li>
                <li>• <strong>Business Data:</strong> Startup ideas, business concepts, market research queries, and validation requests you submit</li>
                <li>• <strong>Communication Data:</strong> Messages, feedback, support requests, and communication preferences</li>
                <li>• <strong>Payment Information:</strong> Billing details, subscription plans, and payment history (processed securely by Stripe/PayPal)</li>
                <li>• <strong>Profile Information:</strong> Professional background, industry focus, and business interests</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">2.2 Usage and Analytics Information</h3>
              <p className="text-gray-300 mb-3">We automatically collect certain information about your use of our services:</p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Platform Usage:</strong> Pages visited, features used, analysis requests, and interaction patterns</li>
                <li>• <strong>Search Queries:</strong> Business ideas, market research topics, and validation requests</li>
                <li>• <strong>Analysis Results:</strong> Generated insights, platform data, and AI recommendations</li>
                <li>• <strong>Device Information:</strong> Browser type, operating system, device model, and screen resolution</li>
                <li>• <strong>Network Information:</strong> IP address, location data (city/country level), and connection type</li>
                <li>• <strong>Performance Data:</strong> Page load times, error logs, and service usage metrics</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">2.3 Third-Party Platform Data</h3>
              <p className="text-gray-300 mb-3">
                Our platform analyzes data from public APIs and RSS feeds to provide market insights:
              </p>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Social Platforms:</strong> Reddit, Hacker News, Product Hunt, Twitter, LinkedIn</li>
                <li>• <strong>Developer Platforms:</strong> GitHub, Stack Overflow, GitLab</li>
                <li>• <strong>News Sources:</strong> Google News, RSS feeds, industry publications</li>
                <li>• <strong>Content Platforms:</strong> YouTube, Medium, blogs, and forums</li>
              </ul>
              <p className="text-gray-300">
                This data is publicly available and used solely for market research and validation analysis. We do not collect private or personal information from these platforms.
              </p>
            </section>

            {/* How We Use Information */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">We use your information for the following purposes:</p>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.1 Service Provision</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Provide AI-powered startup validation and market analysis services</li>
                <li>• Generate personalized insights, recommendations, and business intelligence</li>
                <li>• Process and analyze your business ideas across multiple platforms</li>
                <li>• Deliver comprehensive market research reports and validation results</li>
                <li>• Maintain and improve platform functionality and user experience</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.2 Business Operations</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• Process payments and manage subscription services</li>
                <li>• Provide customer support and technical assistance</li>
                <li>• Send important updates, notifications, and service announcements</li>
                <li>• Conduct user research and platform improvement analysis</li>
                <li>• Ensure platform security and prevent fraud</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">3.3 Legal and Compliance</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• Comply with applicable laws, regulations, and legal obligations</li>
                <li>• Respond to legal requests, court orders, and government inquiries</li>
                <li>• Protect our rights, property, and safety, as well as our users</li>
                <li>• Enforce our Terms of Service and other agreements</li>
                <li>• Investigate and prevent potential violations and security threats</li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">4. Legal Basis for Processing (GDPR)</h2>
              <p className="text-gray-300 mb-4">Under the General Data Protection Regulation (GDPR), we process your personal data based on the following legal grounds:</p>
              
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Contract Performance:</strong> Processing necessary to provide our services and fulfill our obligations to you</li>
                <li>• <strong>Legitimate Interest:</strong> Processing for our legitimate business interests, such as improving services and preventing fraud</li>
                <li>• <strong>Consent:</strong> Processing based on your explicit consent for specific purposes (e.g., marketing communications)</li>
                <li>• <strong>Legal Obligation:</strong> Processing required to comply with applicable laws and regulations</li>
                <li>• <strong>Vital Interests:</strong> Processing necessary to protect vital interests of you or another person</li>
              </ul>
            </section>

            {/* Data Sharing and Disclosure */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-300 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.1 Service Providers</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Payment Processors:</strong> Stripe, PayPal for secure payment processing</li>
                <li>• <strong>Cloud Services:</strong> AWS, Vercel for hosting and infrastructure</li>
                <li>• <strong>Analytics Services:</strong> Google Analytics, Mixpanel for usage analysis</li>
                <li>• <strong>Communication Tools:</strong> SendGrid, Intercom for customer support</li>
                <li>• <strong>AI Services:</strong> OpenAI, Anthropic for AI-powered analysis</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.2 Legal Requirements</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• To comply with applicable laws, regulations, or legal processes</li>
                <li>• To respond to valid legal requests from government authorities</li>
                <li>• To protect our rights, property, or safety, or that of our users</li>
                <li>• In connection with legal proceedings or potential litigation</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">5.3 Business Transfers</h3>
              <ul className="text-gray-300 space-y-2">
                <li>• In connection with a merger, acquisition, or sale of assets</li>
                <li>• During due diligence processes for potential business transactions</li>
                <li>• To protect our business interests and ensure service continuity</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">6. Data Security and Protection</h2>
              <p className="text-gray-300 mb-4">
                We implement comprehensive technical and organizational measures to protect your personal information:
              </p>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">6.1 Technical Security Measures</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Encryption:</strong> AES-256 encryption for data at rest and TLS 1.3 for data in transit</li>
                <li>• <strong>Access Controls:</strong> Multi-factor authentication, role-based access, and least privilege principles</li>
                <li>• <strong>Network Security:</strong> Firewalls, DDoS protection, and intrusion detection systems</li>
                <li>• <strong>Secure Development:</strong> Regular security audits, code reviews, and vulnerability assessments</li>
                <li>• <strong>Infrastructure Security:</strong> Secure cloud hosting with SOC 2 compliance</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">6.2 Organizational Security Measures</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Employee Training:</strong> Regular security awareness training and data protection education</li>
                <li>• <strong>Incident Response:</strong> Documented procedures for security incident handling</li>
                <li>• <strong>Vendor Management:</strong> Security assessments of third-party service providers</li>
                <li>• <strong>Regular Audits:</strong> Internal and external security assessments and penetration testing</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">6.3 Data Breach Response</h3>
              <p className="text-gray-300">
                In the unlikely event of a data breach, we have procedures in place to:
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• Immediately assess and contain the breach</li>
                <li>• Notify affected users within 72 hours (as required by GDPR)</li>
                <li>• Report to relevant authorities as required by law</li>
                <li>• Conduct post-incident analysis and implement improvements</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention and Deletion</h2>
              <p className="text-gray-300 mb-4">
                We retain your personal information only for as long as necessary to provide our services and comply with legal obligations:
              </p>
              
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion</li>
                <li>• <strong>Usage Data:</strong> Retained for 24 months for service improvement and analytics</li>
                <li>• <strong>Payment Data:</strong> Retained for 7 years to comply with financial regulations</li>
                <li>• <strong>Communication Data:</strong> Retained for 12 months after last interaction</li>
                <li>• <strong>Analysis Results:</strong> Retained for 36 months for service continuity and insights</li>
                <li>• <strong>Legal Records:</strong> Retained as required by applicable laws and regulations</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                You may request deletion of your data at any time by contacting us. We will process deletion requests within 30 days, subject to legal requirements.
              </p>
            </section>

            {/* Your Rights */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">8. Your Rights and Choices</h2>
              <p className="text-gray-300 mb-4">Under GDPR and other applicable privacy laws, you have the following rights:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-300">8.1 Access and Control</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• <strong>Right of Access:</strong> Request a copy of your personal data</li>
                    <li>• <strong>Right of Rectification:</strong> Correct inaccurate or incomplete data</li>
                    <li>• <strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                    <li>• <strong>Right to Restriction:</strong> Limit how we process your data</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-blue-300">8.2 Data Portability and Objection</h3>
                  <ul className="text-gray-300 space-y-2 text-sm">
                    <li>• <strong>Data Portability:</strong> Receive your data in a structured format</li>
                    <li>• <strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
                    <li>• <strong>Withdraw Consent:</strong> Withdraw consent for specific processing</li>
                    <li>• <strong>Automated Decisions:</strong> Request human review of automated decisions</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-gray-300 mt-4">
                To exercise these rights, please contact us at privacy@validationly.com. We will respond to your request within 30 days.
              </p>
            </section>

            {/* Cookies and Tracking */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">9. Cookies and Tracking Technologies</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar technologies to enhance your experience and provide our services:
              </p>
              
              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.1 Types of Cookies</h3>
              <ul className="text-gray-300 space-y-2 mb-4">
                <li>• <strong>Essential Cookies:</strong> Required for platform functionality and security</li>
                <li>• <strong>Analytics Cookies:</strong> Help us understand usage patterns and improve services</li>
                <li>• <strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li>• <strong>Marketing Cookies:</strong> Used for targeted advertising and content personalization</li>
                <li>• <strong>Third-Party Cookies:</strong> Set by our service providers for payment processing and analytics</li>
              </ul>

              <h3 className="text-xl font-semibold text-blue-300 mb-3">9.2 Cookie Management</h3>
              <p className="text-gray-300">
                You can control cookie settings through your browser preferences. Most browsers allow you to:
              </p>
              <ul className="text-gray-300 space-y-2 mt-3">
                <li>• Block or delete cookies</li>
                <li>• Set preferences for specific websites</li>
                <li>• Clear cookies when you close your browser</li>
                <li>• Opt out of third-party tracking</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                Note: Disabling certain cookies may affect platform functionality and user experience.
              </p>
            </section>

            {/* International Transfers */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">10. International Data Transfers</h2>
              <p className="text-gray-300 mb-4">
                Your information may be transferred to and processed in countries other than your own:
              </p>
              
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Primary Processing:</strong> Data is primarily processed in the European Union (GDPR compliant)</li>
                <li>• <strong>Cloud Services:</strong> Some data may be stored on servers in the United States</li>
                <li>• <strong>Service Providers:</strong> Third-party services may process data in various locations</li>
                <li>• <strong>Adequacy Decisions:</strong> We ensure appropriate safeguards for international transfers</li>
                <li>• <strong>Standard Contractual Clauses:</strong> Use of EU-approved data transfer agreements</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                We ensure that all international transfers comply with applicable data protection laws and include appropriate safeguards.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">11. Children's Privacy</h2>
              <p className="text-gray-300">
                Our services are not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you believe we have collected such information, please contact us immediately, and we will take steps to delete it promptly.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors:
              </p>
              
              <ul className="text-gray-300 space-y-3">
                <li>• <strong>Material Changes:</strong> Significant changes will be communicated via email and platform notifications</li>
                <li>• <strong>Update Process:</strong> Policy updates will be posted on our platform with new effective dates</li>
                <li>• <strong>User Consent:</strong> Continued use of our services constitutes acceptance of updated policies</li>
                <li>• <strong>Historical Versions:</strong> Previous versions of this policy are available upon request</li>
              </ul>
              
              <p className="text-gray-300 mt-4">
                We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information.
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

export default PrivacyPolicy;
