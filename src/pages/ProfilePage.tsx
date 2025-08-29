import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
          <Link
            to="/auth"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
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
        description="Manage your Validationly profile and account settings"
        keywords="profile, account settings, user profile, validationly"
      />
      
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Profile Overview Card */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-white/10 mb-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || user.email || 'User'}
                      className="w-24 h-24 rounded-full border-4 border-white/20 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {user.displayName || 'User'}
                  </h2>
                  <p className="text-gray-400 mb-4">{user.email}</p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                      Active Account
                    </span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      Premium User
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-center"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Account Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  activeTab === 'security'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                Security & Privacy
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-white/10">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                      <input
                        type="text"
                        defaultValue={user.displayName || ''}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue={user.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Company</label>
                      <input
                        type="text"
                        placeholder="Your company name"
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                      <select
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white disabled:opacity-50"
                      >
                        <option>Founder</option>
                        <option>Product Manager</option>
                        <option>Developer</option>
                        <option>Designer</option>
                        <option>Marketing</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4 pt-4">
                      <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors">
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Email Notifications</h4>
                        <p className="text-sm text-gray-400">Receive updates about your analysis results</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Marketing Emails</h4>
                        <p className="text-sm text-gray-400">Receive product updates and announcements</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Dark Mode</h4>
                        <p className="text-sm text-gray-400">Use dark theme across the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-600">
                    <h4 className="font-medium text-white mb-4">Subscription</h4>
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 rounded-lg border border-blue-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-white">Premium Plan</h5>
                          <p className="text-sm text-gray-400">Unlimited analysis and advanced features</p>
                        </div>
                        <Link
                          to="/pricing"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                        >
                          Manage Plan
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-white mb-6">Security & Privacy</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-400 mb-3">Add an extra layer of security to your account</p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Password</h4>
                      <p className="text-sm text-gray-400 mb-3">Last changed: 30 days ago</p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm">
                        Change Password
                      </button>
                    </div>

                    <div className="p-4 bg-gray-700/30 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Active Sessions</h4>
                      <p className="text-sm text-gray-400 mb-3">Manage your active login sessions</p>
                      <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                        View Sessions
                      </button>
                    </div>

                    <div className="p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
                      <h4 className="font-medium text-red-400 mb-2">Danger Zone</h4>
                      <p className="text-sm text-gray-400 mb-3">Permanently delete your account and all data</p>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

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

export default ProfilePage;
