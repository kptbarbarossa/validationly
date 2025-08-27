import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ValidationlyDB } from '../../lib/supabase';
import type { Validation, User } from '../../lib/supabase';

const DashboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
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
        ValidationlyDB.getUserValidations(user.id, 20),
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to view your dashboard</h1>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-300">Welcome back, {user.email}</p>
      </div>

      {/* Stats Cards */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Total Validations</h3>
            <p className="text-2xl font-bold text-white">{userStats.totalValidations}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Average Score</h3>
            <p className="text-2xl font-bold text-white">{userStats.avgScore}/100</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Favorite Category</h3>
            <p className="text-2xl font-bold text-white">{userStats.favoriteCategory}</p>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">Credits Remaining</h3>
            <p className="text-2xl font-bold text-white">{userStats.creditsRemaining}</p>
          </div>
        </div>
      )}

      {/* Recent Validations */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Recent Validations</h2>
        
        {validations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No validations yet</p>
            <a 
              href="/" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Your First Validation
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {validations.map((validation) => (
              <div 
                key={validation.id} 
                className="bg-slate-900/50 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-white mb-2 line-clamp-2">
                      {validation.idea_text}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400">
                      <span>Score: {validation.demand_score || 'N/A'}/100</span>
                      <span>Category: {validation.category || 'N/A'}</span>
                      <span>{new Date(validation.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => toggleFavorite(validation.id, validation.is_favorite)}
                      className={`p-2 rounded-lg transition-colors ${
                        validation.is_favorite 
                          ? 'text-yellow-400 hover:text-yellow-300' 
                          : 'text-slate-400 hover:text-yellow-400'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      (validation.demand_score || 0) >= 70 
                        ? 'bg-green-900/50 text-green-300' 
                        : (validation.demand_score || 0) >= 50 
                        ? 'bg-yellow-900/50 text-yellow-300'
                        : 'bg-red-900/50 text-red-300'
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
    </div>
  );
};

export default DashboardPage;