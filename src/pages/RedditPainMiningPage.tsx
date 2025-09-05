import React from 'react';
import RedditPainAnalyzer from '@/components/RedditPainAnalyzer';
import RedditIdeaCards from '@/components/RedditIdeaCards';
import SEOHead from '@/components/SEOHead';

const RedditPainMiningPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Reddit Pain Mining | Validationly"
        description="Discover pain points and validate startup ideas using real Reddit discussions. Analyze user frustrations and find market opportunities."
        canonicalUrl="https://validationly.com/reddit-pain-mining"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-cyan-950">
        {/* Aurora Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <div className="container mx-auto px-6 py-12">
            {/* Main Analyzer */}
            <div className="mb-16">
              <RedditPainAnalyzer />
            </div>

            {/* Divider */}
            <div className="flex items-center my-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
              <div className="px-6">
                <h2 className="text-2xl font-bold text-white text-center">
                  🔍 Browse Reddit Insights
                </h2>
                <p className="text-gray-400 text-center mt-2">
                  Explore pain points and ideas discovered from Reddit discussions
                </p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>

            {/* Ideas Grid */}
            <RedditIdeaCards />
          </div>
        </div>
      </div>
    </>
  );
};

export default RedditPainMiningPage;
