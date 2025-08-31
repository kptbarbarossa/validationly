import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SEOHead } from '../components/SEOHead';

const AffiliationPage: React.FC = () => {
  const { user, signInWithGoogle } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [siteLink, setSiteLink] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    // User is logged in, show contact modal
    setShowContactModal(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !siteLink.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Save application to Supabase database
      const response = await fetch('https://ozuwdljoxvszuiakcgay.supabase.co/functions/v1/send-affiliation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dXdkbGpveHZzenVpYWtjZ2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NzI1NjMsImV4cCI6MjA1MDA0ODU2M30.OP7bUa4NUlMT0-vKrKjvZnZvJmKLgO4VNRKcZYHFfJ0',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dXdkbGpveHZzenVpYWtjZ2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NzI1NjMsImV4cCI6MjA1MDA0ODU2M30.OP7bUa4NUlMT0-vKrKjvZnZvJmKLgO4VNRKcZYHFfJ0',
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name || user.email,
          siteLink: siteLink.trim(),
          message: message.trim(),
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        alert('Application submitted successfully! We will review your request and get back to you soon.');
        setShowContactModal(false);
        setSiteLink('');
        setMessage('');
      } else {
        alert('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
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

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Partnership Application</h3>
            
            <form onSubmit={handleSubmitApplication}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your website/tool affiliation link *
                </label>
                <input
                  type="url"
                  value={siteLink}
                  onChange={(e) => setSiteLink(e.target.value)}
                  placeholder="https://yourtool.com"
                  required
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Brief Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your tool and how it helps startups..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1 px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-full text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !siteLink.trim()}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-medium transition-all"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AffiliationPage;
