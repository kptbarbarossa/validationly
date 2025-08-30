import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SEOHead } from '../components/SEOHead';
import { Link, useNavigate } from 'react-router-dom';
import { ValidationlyDB } from '../../lib/supabase';
import type { Validation } from '../../lib/supabase';

const ProfilePage: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'validations' | 'analytics' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [validations, setValidations] = useState<Validation[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !authLoading) {
      loadDashboardData();
    }
  }, [user, authLoading]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [userValidations, stats] = await Promise.all([
        ValidationlyDB.getUserValidations(user.id, 10),
        ValidationlyDB.getUserStats(user.id)
      ]);

      setValidations(userValidations);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (validationId: string, currentFavorite: boolean) => {
    try {
      await ValidationlyDB.updateValidationFavorite(validationId, !currentFavorite);
      setValidations(prev =>
        prev.map(v =>
          v.id === validationId ? { ...v, is_favorite: !currentFavorite } : v
        )
      );
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-3xl font-bold mb-4 text-white">Access Your Profile</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Sign in to view your validation history, analytics, and manage your startup journey.
          </p>
          <Link
            to="/auth"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
          >
            Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="Profile Dashboard | Validationly"
        description="Your startup validation dashboard with analytics, history, and insights"
        keywords="profile, dashboard, startup validation, analytics, entrepreneur"
      />

      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Profile Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Welcome back, {user.displayName || user.email?.split('@')[0]}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gray-800/50 border border-white/20 rounded-lg text-white hover:bg-gray-700/50 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* Profile Overview Card */}
          <div className="bg-gray-800/50 backdrop-blur rounded-3xl p-8 border border-white/10 mb-8">
            <div className="flex items-center space-x-6">
              {/* Profile Picture */}
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {user.displayName || 'Startup Founder'}
                </h2>
                <p className="text-gray-400 mb-4">
                  {user.email}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-gray-300">Active</span>
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-300">
                    Member since {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              {userStats && (
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-500/20 rounded-lg p-4 border border-blue-500/30">
                    <div className="text-2xl font-bold text-blue-400">{userStats.totalValidations || 0}</div>
                    <div className="text-xs text-gray-400">Validations</div>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-4 border border-purple-500/30">
                    <div className="text-2xl font-bold text-purple-400">{userStats.avgScore || 0}</div>
                    <div className="text-xs text-gray-400">Avg Score</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-800/30 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'validations', label: 'Validations', icon: '🔍' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              {userStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">Total Validations</h3>
                      <span className="text-2xl">🔍</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.totalValidations || 0}</p>
                    <p className="text-green-400 text-sm mt-2">+12% this month</p>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">Average Score</h3>
                      <span className="text-2xl">📊</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.avgScore || 0}/100</p>
                    <p className="text-blue-400 text-sm mt-2">Above average</p>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">Top Category</h3>
                      <span className="text-2xl">🏆</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.favoriteCategory || 'SaaS'}</p>
                    <p className="text-purple-400 text-sm mt-2">Most validated</p>
                  </div>

                  <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-400 text-sm font-medium">Credits</h3>
                      <span className="text-2xl">⚡</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{userStats.creditsRemaining || 0}</p>
                    <p className="text-yellow-400 text-sm mt-2">Remaining</p>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                {validations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🚀</div>
                    <p className="text-gray-400 mb-4">No validations yet</p>
                    <button
                      onClick={() => navigate('/')}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Start Your First Validation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {validations.slice(0, 5).map((validation) => (
                      <div
                        key={validation.id}
                        className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1 line-clamp-1">
                            {validation.idea_text}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>Score: {validation.demand_score || 'N/A'}/100</span>
                            <span>•</span>
                            <span>{new Date(validation.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => toggleFavorite(validation.id, validation.is_favorite)}
                            className={`p-2 rounded-lg transition-colors ${validation.is_favorite
                              ? 'text-yellow-400 hover:text-yellow-300'
                              : 'text-gray-400 hover:text-yellow-400'
                              }`}
                          >
                            ⭐
                          </button>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${(validation.demand_score || 0) >= 70
                            ? 'bg-green-500/20 text-green-400'
                            : (validation.demand_score || 0) >= 50
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                            }`}>
                            {(validation.demand_score || 0) >= 70 ? 'High' : (validation.demand_score || 0) >= 50 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'validations' && (
            <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">All Validations</h3>
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  New Validation
                </button>
              </div>

              {validations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-400 mb-4">No validations found</p>
                  <p className="text-gray-500 text-sm">Start validating your startup ideas to see them here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {validations.map((validation) => (
                    <div
                      key={validation.id}
                      className="p-6 bg-gray-700/30 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-2">
                            {validation.idea_text}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                            <span>Score: {validation.demand_score || 'N/A'}/100</span>
                            <span>•</span>
                            <span>Category: {validation.category || 'N/A'}</span>
                            <span>•</span>
                            <span>{new Date(validation.created_at).toLocaleDateString()}</span>
                          </div>
                          {validation.justification && (
                            <p className="text-gray-300 text-sm">
                              {validation.justification.slice(0, 200)}...
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <button
                            onClick={() => toggleFavorite(validation.id, validation.is_favorite)}
                            className={`p-2 rounded-lg transition-colors ${validation.is_favorite
                              ? 'text-yellow-400 hover:text-yellow-300'
                              : 'text-gray-400 hover:text-yellow-400'
                              }`}
                          >
                            ⭐
                          </button>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${(validation.demand_score || 0) >= 70
                            ? 'bg-green-500/20 text-green-400'
                            : (validation.demand_score || 0) >= 50
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                            }`}>
                            {(validation.demand_score || 0) >= 70 ? 'High' : (validation.demand_score || 0) >= 50 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Analytics Dashboard</h3>
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📈</div>
                  <p className="text-gray-400 mb-4">Advanced Analytics Coming Soon</p>
                  <p className="text-gray-500 text-sm">
                    Track your validation trends, success rates, and market insights.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Display Name</label>
                    <input
                      type="text"
                      value={user.displayName || ''}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      placeholder="Enter your display name"
                      disabled
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email || ''}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                      disabled
                    />
                  </div>

                  <div className="pt-6 border-t border-white/10">
                    <h4 className="text-white font-medium mb-4">Danger Zone</h4>
                    <button
                      onClick={handleSignOut}
                      className="px-6 py-3 bg-red-600/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-12 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                <span>🚀</span>
                <span>Validate New Idea</span>
              </button>
              <button
                onClick={() => navigate('/tools')}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-800/50 border border-white/20 text-white rounded-xl font-semibold hover:bg-gray-700/50 transition-all"
              >
                <span>🛠️</span>
                <span>Explore Tools</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;