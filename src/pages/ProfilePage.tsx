import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { Link, useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'journey' | 'goals'>('about');
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data for demonstration - in real app this would come from API/database
  const profileData = {
    nickname: 'Startup Founder',
    bio: 'Building the future of validation tools',
    website: 'https://validationly.com',
    linkedin: 'https://linkedin.com/in/founder',
    twitter: 'https://twitter.com/founder',
    description: 'Passionate about building products that solve real problems. Currently working on Validationly to help founders validate their ideas faster.',
    area: 'SaaS, AI, Validation Tools',
    shortTermGoal: 'Launch MVP and get first 100 users',
    targetMarket: 'Early-stage founders and startup enthusiasts',
    activeIdea: 'AI-powered startup validation platform',
    validationMetric: '100 upvotes on Product Hunt',
    preferredChannels: ['Twitter', 'Reddit', 'LinkedIn'],
    validationScore: 78,
    topIdea: 'Validationly Platform',
    totalShares: 24,
    engagementRate: 12.5,
    activeChannels: ['Twitter', 'Reddit', 'LinkedIn']
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Please sign in to view your profile</h1>
          <Link
            to="/auth"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Profile | Validationly"
        description="Your founder profile and validation journey"
        keywords="profile, founder, startup validation, entrepreneur"
      />
      
      {/* Main Layout */}
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar - Profile Info */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* User Profile Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <div className="text-center">
                  {/* Profile Picture */}
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xl font-bold">
                        {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  
                  {/* Name & Bio */}
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {user.displayName || profileData.nickname}
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">{profileData.bio}</p>
                  
                  {/* Edit Profile Button */}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-sm font-medium"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* Links Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
                <div className="space-y-3">
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-3 text-gray-600 hover:text-purple-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.032 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                    </svg>
                    Website
                  </a>
                  <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                    LinkedIn
                  </a>
                  <a href={profileData.twitter} target="_blank" rel="noopener noreferrer"
                     className="flex items-center gap-3 text-gray-600 hover:text-blue-400 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                    Twitter
                  </a>
                </div>
              </div>
            </div>

            {/* Middle Area - Main Content */}
            <div className="lg:col-span-6">
              
              {/* Tab Navigation */}
              <div className="bg-white rounded-xl shadow-md border border-gray-100 mb-6">
                <div className="flex border-b border-gray-100">
                  {[
                    { id: 'about', label: 'About Me' },
                    { id: 'journey', label: 'Founder Journey' },
                    { id: 'goals', label: 'Validation Goals' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'text-purple-600 border-b-2 border-purple-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'about' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <p className="text-gray-900">{user.displayName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <p className="text-gray-900">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <p className="text-gray-600">{profileData.description}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'journey' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Focus Area</label>
                        <p className="text-gray-900">{profileData.area}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Short-term Goal</label>
                        <p className="text-gray-600">{profileData.shortTermGoal}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Target Market</label>
                        <p className="text-gray-600">{profileData.targetMarket}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'goals' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Active Idea</label>
                        <p className="text-gray-900">{profileData.activeIdea}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Validation Metric</label>
                        <p className="text-gray-600">{profileData.validationMetric}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Channels</label>
                        <div className="flex flex-wrap gap-2">
                          {profileData.preferredChannels.map((channel) => (
                            <span key={channel} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              {channel}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel - Stats & Insights */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Validation Score Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
                <h3 className="font-semibold text-gray-900 mb-4">Validation Score</h3>
                <div className="relative">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">{profileData.validationScore}</span>
                  </div>
                  <p className="text-sm text-gray-600">Out of 100</p>
                </div>
                {/* Mini trend line placeholder */}
                <div className="mt-4 h-8 bg-gray-50 rounded flex items-center justify-center">
                  <span className="text-xs text-gray-500">📈 Trending up</span>
                </div>
              </div>

              {/* Top Idea Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  🔥 Top Idea
                </h3>
                <div>
                  <p className="font-medium text-gray-900 mb-2">{profileData.topIdea}</p>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>👍 {profileData.totalShares} upvotes</span>
                    <span>💬 12 mentions</span>
                  </div>
                </div>
              </div>

              {/* Community Engagement Card */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  🌍 Community Engagement
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Shares:</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.totalShares}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engagement Rate:</span>
                    <span className="text-sm font-medium text-gray-900">{profileData.engagementRate}%</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Active Channels:</p>
                    <div className="flex flex-wrap gap-1">
                      {profileData.activeChannels.map((channel) => (
                        <span key={channel} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            {/* Mobile Profile Header */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-600 flex items-center justify-center">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-lg font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {user.displayName || profileData.nickname}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{profileData.bio}</p>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xl font-bold">
                  {profileData.validationScore}
                </div>
                <p className="text-xs text-gray-600 mt-1">Validation Score</p>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100">
              <div className="flex border-b border-gray-100">
                {[
                  { id: 'about', label: 'About' },
                  { id: 'journey', label: 'Journey' },
                  { id: 'goals', label: 'Goals' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 px-3 py-3 text-xs font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-purple-600 border-b-2 border-purple-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="p-4">
                {activeTab === 'about' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Email</p>
                      <p className="text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Description</p>
                      <p className="text-sm text-gray-600">{profileData.description}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'journey' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Focus Area</p>
                      <p className="text-sm text-gray-900">{profileData.area}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Goal</p>
                      <p className="text-sm text-gray-600">{profileData.shortTermGoal}</p>
                    </div>
                  </div>
                )}
                {activeTab === 'goals' && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Active Idea</p>
                      <p className="text-sm text-gray-900">{profileData.activeIdea}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700 mb-1">Channels</p>
                      <div className="flex flex-wrap gap-1">
                        {profileData.preferredChannels.map((channel) => (
                          <span key={channel} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              <span className="mr-2">🚀</span>
              Validate New Idea
            </button>
            <p className="mt-4 text-sm text-gray-600 max-w-md mx-auto">
              Yeni bir startup fikri gir, topluluk verileriyle anında validasyon skorunu öğren.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;