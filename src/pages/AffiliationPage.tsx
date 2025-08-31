import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SEOHead } from '../components/SEOHead';

const AffiliationPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();


  const handleApplyClick = async () => {
    if (!user) {
      // User not logged in, trigger sign in
      try {
        await signInWithGoogle();
      } catch (error) {
        console.error('Sign in failed:', error);
      }
      return;
    }
    
    // User is logged in, open mailto directly
    const emailSubject = `Partnership Application - ${user.name || user.email}`;
    const emailBody = `Hi,

I would like to apply for the Validationly Partnership Program.

User Details:
- Name: ${user.name || 'N/A'}
- Email: ${user.email}

Please let me know what additional information you need for the partnership application.

Best regards,
${user.name || user.email}

---
Sent via Validationly Partnership Application
Date: ${new Date().toLocaleDateString()}`;

    // Create mailto link and open email client
    const mailtoLink = `mailto:kaptan3k@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <>
      <SEOHead
        title="Partner with Validationly - Get Your Tools Recommended"
        description="Join our affiliation program and get your startup tools recommended to thousands of entrepreneurs during their validation process."
        keywords="affiliation, partnership, startup tools, entrepreneur tools, validation tools"
      />

      <div className="min-h-screen text-slate-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-cyan-900/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="inline-flex items-center px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-sm font-medium mb-6">
                🤝 Partnership Program
              </div>
              
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Partner with Validationly
                </span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                  Get Your Tools Recommended
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Get your startup tools recommended to <strong>thousands of entrepreneurs</strong> during their validation process. 
                Join our curated ecosystem of high-quality tools that help startups succeed.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-400 mb-12">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>10,000+ Monthly Validations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span>High-Intent Entrepreneurs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Quality-First Approach</span>
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={handleApplyClick}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-full text-white font-medium transition-all transform hover:scale-105 text-lg"
              >
                {!user ? 'Sign In to Apply' : 'Apply for Partnership'}
              </button>
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Partnership Requirements</h2>
              <p className="text-slate-400">
                We maintain high standards to ensure quality recommendations for our users.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Approved Partners */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Approved Partners Only</h3>
                <p className="text-slate-300">
                  All partnership applications go through our review process. We only accept tools and services that provide genuine value to entrepreneurs and startups.
                </p>
              </div>

              {/* Legal Compliance */}
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">🚫</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">No Illegal Projects</h3>
                <p className="text-slate-300">
                  We strictly prohibit any illegal, harmful, or unethical projects. All partners must comply with applicable laws and our community standards.
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-400 text-lg">
                <strong>That's it!</strong> Simple requirements, quality focus. 
                <br />
                Ready to join our partner ecosystem?
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How Partnership Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Simple process to get your tools in front of thousands of entrepreneurs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">1. Apply</h3>
              <p className="text-slate-300">
                Click the apply button, sign in with Google, and share your website link with a brief message about your tool.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">2. Review</h3>
              <p className="text-slate-300">
                Our team reviews your tool for quality, relevance to startups, and alignment with our community standards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-white/10 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">3. Launch</h3>
              <p className="text-slate-300">
                Once approved, your tool gets featured in our recommendations and starts getting exposure to entrepreneurs.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="bg-gradient-to-r from-indigo-900/50 to-cyan-900/50 backdrop-blur rounded-2xl p-12 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Partner?</h2>
            <p className="text-slate-300 mb-8 text-lg">
              Join our ecosystem and help thousands of entrepreneurs build better startups.
            </p>
            <button
              onClick={handleApplyClick}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 rounded-full text-white font-medium transition-all transform hover:scale-105"
            >
              {!user ? 'Sign In to Apply' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliationPage;