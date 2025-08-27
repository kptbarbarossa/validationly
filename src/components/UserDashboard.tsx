import React, { useState, useEffect } from 'react';

interface UserStats {
  totalRewrites: number;
  dailyUsage: number;
  favoriteIndustry: string;
  successRate: number;
  planType: 'free' | 'pro';
  memberSince: string;
}

interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: 'applied' | 'interview' | 'rejected' | 'offer' | 'accepted';
  applicationDate: string;
}

interface UserDashboardProps {
  token: string;
  userPlan: 'free' | 'pro';
}

const UserDashboard: React.FC<UserDashboardProps> = ({ token, userPlan }) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls (replace with actual API endpoints)
      const mockStats: UserStats = {
        totalRewrites: 15,
        dailyUsage: 2,
        favoriteIndustry: 'Technology',
        successRate: 78,
        planType: userPlan,
        memberSince: '2024-01-15'
      };

      const mockApplications: JobApplication[] = [
        {
          id: '1',
          company: 'TechCorp',
          position: 'Senior Developer',
          status: 'interview',
          applicationDate: '2024-01-20'
        },
        {
          id: '2',
          company: 'StartupXYZ',
          position: 'Full Stack Engineer',
          status: 'applied',
          applicationDate: '2024-01-18'
        },
        {
          id: '3',
          company: 'BigTech Inc',
          position: 'Software Engineer',
          status: 'rejected',
          applicationDate: '2024-01-15'
        }
      ];

      setStats(mockStats);
      setApplications(mockApplications);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'interview': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'offer': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'accepted': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return '📝';
      case 'interview': return '🎤';
      case 'offer': return '🎉';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📄';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-slate-300">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-6">Your Job Tailor Stats</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-400">{stats?.totalRewrites}</div>
            <div className="text-sm text-slate-300">Total Rewrites</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">{stats?.dailyUsage}</div>
            <div className="text-sm text-slate-300">Today's Usage</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{stats?.successRate}%</div>
            <div className="text-sm text-slate-300">Success Rate</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {stats?.planType === 'pro' ? 'PRO' : 'FREE'}
            </div>
            <div className="text-sm text-slate-300">Plan Type</div>
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800/30 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Favorite Industry</h4>
            <p className="text-slate-300">{stats?.favoriteIndustry}</p>
          </div>
          
          <div className="bg-slate-800/30 rounded-lg p-4">
            <h4 className="font-medium text-white mb-2">Member Since</h4>
            <p className="text-slate-300">
              {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Job Applications Tracker */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-white">Job Applications</h3>
          <button className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Add Application
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <div className="text-4xl mb-4">📋</div>
            <p>No job applications tracked yet</p>
            <p className="text-sm mt-2">Start tracking your applications to see your progress</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{getStatusIcon(app.status)}</span>
                      <div>
                        <h4 className="font-medium text-white">{app.position}</h4>
                        <p className="text-slate-300 text-sm">{app.company}</p>
                      </div>
                    </div>
                    <p className="text-slate-400 text-xs">
                      Applied on {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(app.status)}`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <button className="bg-slate-800/50 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors">
            <div className="text-2xl mb-2">🎯</div>
            <div className="font-medium text-white">Optimize New CV</div>
            <div className="text-sm text-slate-400">Create a tailored CV for a new job</div>
          </button>
          
          <button className="bg-slate-800/50 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors">
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium text-white">Find Jobs</div>
            <div className="text-sm text-slate-400">Search for relevant job opportunities</div>
          </button>
          
          <button className="bg-slate-800/50 rounded-lg p-4 text-left hover:bg-slate-700/50 transition-colors">
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-white">View Analytics</div>
            <div className="text-sm text-slate-400">Detailed insights and trends</div>
          </button>
        </div>
      </div>

      {/* Pro Features Promotion (for free users) */}
      {userPlan === 'free' && (
        <div className="bg-gradient-to-r from-indigo-600/20 to-cyan-600/20 rounded-xl p-6 border border-indigo-500/30">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚀</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Unlock Pro Features</h3>
              <p className="text-slate-300 text-sm mb-4">
                Get unlimited CV rewrites, advanced analytics, and premium export options
              </p>
              <button className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 py-2 rounded-lg hover:from-indigo-700 hover:to-cyan-700 transition-all">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;